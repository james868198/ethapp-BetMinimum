import kue from 'kue';
import BetMinimun from '../utils/betMinimun';
import { FAIL, SUCCESS } from '../utils/constants';

const jobs = kue.createQueue();

let pendingBets = 0;

let betData = {}; // [address]: data
let playedMap = {};
let amountMap = {};
const gameRecords = [];

function newBetJob(params) {
    const job = jobs.create('bet', params);
    pendingBets++;
    job.on('complete', res => {
        betData[res.address] = res.data;
        pendingBets--;
    });
    job.save();
}

function newDistributeJob(params) {
    const job = jobs.create('distribute', params);
    job.on('complete', () => {
        betData = {};
        playedMap = {};
        amountMap = {};
    });
    job.save();
}

jobs.process('bet', async (job, done) => {
    const { address, password, number, value } = job.data;

    const result = { status: FAIL, address };

    try {
        const contract = await BetMinimun.getBetMinimun();
        const played = await BetMinimun.checkPlayerExists(contract, address);

        if (played) {
            result.status = SUCCESS;
            result.played = played;
            console.log('(Has played) result:', result);
            return done(null, { address, data: null });
        }

        const transaction = await BetMinimun.bet(
            contract,
            address,
            password,
            number,
            value
        );

        if (!transaction) throw new Error('No transaction');

        result.status = SUCCESS;
        result.data = transaction;
    } catch (error) {
        console.error(`error: ${error.message})`);
        result.error = error;
    }
    return done(null, result);
});

jobs.process('distribute', async (job, done) => {
    const { address, password } = job.data;

    const result = { status: FAIL, address };
    try {
        const contract = await BetMinimun.getBetMinimun();
        const transaction = await BetMinimun.distribute(
            contract,
            address,
            password
        );
        if (!transaction) throw new Error('No transaction');

        result.status = SUCCESS;
        result.data = transaction;
    } catch (error) {
        result.error = error;
        console.error(`error: ${error.message})`);
    }
    done(null, result);
});

const controller = {
    getPrevGame: (_, res) => {
        console.log('[betMiniminController][getPrevGame]');
        return res.json({
            status: SUCCESS,
            prevGame: gameRecords.length
                ? gameRecords[gameRecords.length - 1]
                : null
        });
    },
    getGameStatus: async (req, res) => {
        console.log('[betMiniminController][getGameStatus]');

        const { awaiting = false } = req.query;

        if (awaiting && pendingBets <= 0) {
            const result = {};
            try {
                const contract = await BetMinimun.getBetMinimun();
                const data = await BetMinimun.getGameData(contract);
                if (!data) throw new Error('no data');

                gameRecords.push(data);

                result.status = SUCCESS;
                result.gameData = data;
            } catch (error) {
                result.status = FAIL;
            }
            return res.json(result);
        }

        const total = Object.values(amountMap).reduce(
            (sum, amount) => sum + amount,
            0
        );
        return res.json({
            status: SUCCESS,
            total,
            processing: pendingBets > 0
        });
    },

    getBetStatus: (req, res) => {
        console.log('[betMiniminController][getBetStatus]');

        const { address } = req.params;
        const result = { status: FAIL };
        if (address) {
            result.status = SUCCESS;
            result.played = Boolean(playedMap[address]);
            result.data = betData[address];
        }
        return res.json(result);
    },
    bet: async (req, res) => {
        console.log('[betMiniminController][bet]');
        const { address } = req.params;
        const { body } = req;
        const result = { status: FAIL };

        if (
            address &&
            body.password !== undefined &&
            body.number !== undefined &&
            body.value !== undefined
        ) {
            playedMap[address] = true;
            amountMap[address] = body.value;
            newBetJob(Object.assign({}, body, { address }));
            result.status = SUCCESS;
        }
        return res.json(result);
    },

    distribute: async (req, res) => {
        console.log('[betMiniminController][distribute]');
        const { address } = req.params;
        const {
            body: { password }
        } = req;
        const result = { status: FAIL };

        if (address && password !== undefined) {
            newDistributeJob({ address, password });
            result.status = SUCCESS;
        }
        return res.json(result);
    }
};

export default controller;
