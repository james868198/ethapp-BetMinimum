import BetMinimun from '../utils/betMinimun';
import { FAIL, SUCCESS } from '../utils/constants';

const controller = {
    getGameStatus: async (_, res) => {
        console.log('[betMiniminController][getGameStatus]');

        const result = { status: FAIL };
        try {
            const contract = await BetMinimun.getBetMinimun();
            const data = await BetMinimun.getGameData(contract);
            if (!data) throw new Error('no data');

            result.status = SUCCESS;
            result.gameData = data;
        } catch (error) {
            console.error(`error: ${error})`);
        }

        return res.json(result);
    },
    getAccountStatus: async (req, res) => {
        console.log('[betMiniminController][getAccountStatus]');

        const { address } = req.params;
        const result = { status: FAIL };
        if (address) {
            try {
                const contract = await BetMinimun.getBetMinimun();
                const played = await BetMinimun.checkPlayerExists(
                    contract,
                    address
                );
                result.status = SUCCESS;
                result.played = played;
            } catch (error) {
                console.error(`error: ${error})`);
            }
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
            try {
                const contract = await BetMinimun.getBetMinimun();
                const played = await BetMinimun.checkPlayerExists(
                    contract,
                    address
                );
                console.log({ played });

                if (played) {
                    result.status = SUCCESS;
                    result.played = played;
                    console.log('(Has played) result:', result);
                    return res.json({ test: '?' }); // what's this?
                }

                const transaction = await BetMinimun.bet(
                    contract,
                    address,
                    body.password,
                    body.number,
                    body.value
                );

                if (!transaction) throw new Error('No transaction');

                result.status = SUCCESS;
                result.data = transaction;
            } catch (error) {
                console.error(`error: ${error})`);
            }
        }
        return res.json(result);
    },
    distribute: async (req, res) => {
        console.log('[betMiniminController][distribute]');
        const { address } = req.params;
        const { body } = req;
        const result = { status: FAIL };

        if (address && body.password !== undefined) {
            try {
                const contract = await BetMinimun.getBetMinimun();
                const transaction = await BetMinimun.distribute(
                    contract,
                    address,
                    body.password
                );
                if (!transaction) throw new Error('No transaction');

                result.status = SUCCESS;
                result.data = transaction;
            } catch (error) {
                console.error(`error: ${error})`);
            }
        }
        return res.json(result);
    }
};

export default controller;
