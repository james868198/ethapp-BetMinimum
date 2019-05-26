
import BetMinimun from '../utils/contracts/BetMinimun';

const controller = {
	getGameStatus: async (req, res) => {
        console.log("[betMiniminController][getGameStatus]");
        const result = {
            status:'fail'
        };
        try {
            const contract = await BetMinimun.getBetMinimun();
            const data = await BetMinimun.getGameData(contract);
            if (!data) {
                return res.json(result);
            }
            result['status'] = 'success';
            result['gameData'] = data;
            return res.json(result);
        } catch (error) {
            console.error(`error:${error})`);
            return res.json(result);
		}
    },
    getAccountStatus: async (req, res) => {
        console.log("[betMiniminController][getAccountStatus]");
        const { address } = req.params;
        const result = {
            status:'fail'
        };
        if (!address) {
            return res.json(result);
        }
        try {
            const contract = await BetMinimun.getBetMinimun();
            const played = await BetMinimun.checkPlayerExists(contract, address);
            result['status'] = 'success';
            result['played'] = played;
            return res.json(result);
        } catch (error) {
            console.error(`error:${error})`);
            return res.json(result);
		}
	},
    bet: async (req, res) => {
        console.log("[betMiniminController][bet]");
        const { address } = req.params;
        const { body } = req;
        const result = {
            status:'fail'
        };
        if (!address || !body.password || !body.number || !body.value) {
            return res.json(result);
        }
        
        try {
            const contract = await BetMinimun.getBetMinimun();
            const played = await BetMinimun.checkPlayerExists(contract, address);
            console.log(played);

            if (played) {
                result["status"] = 'success';
                result["played"] = played;
                console.log(result);
                return res.json({ test: '?'});
            }
            console.log('testing');
            const transaction = await BetMinimun.bet(contract, address, body.password,body.number, body.value);
            if (!transaction) {
                return res.json(result);
            }
            result['status'] = 'success';
            result['data'] = transaction;
            return res.json(result);
        } catch (error) {
            console.error(`error:${error})`);
            return res.json(result);
		}
    },
    distribute: async (req, res) => {
        console.log("[betMiniminController][distribute]");
        const { address } = req.params;
        const { body } = req;
        const result = {
            status:'fail'
        };
        if (!address || !body.password) {
            return res.json(result);
        }
        console.log('testing');
        try {
            const contract = await BetMinimun.getBetMinimun();
            const transaction = await BetMinimun.distribute(contract, address, body.password);
            console.log('testing');
            if (!transaction) {
                return res.json(result);
            }
            result['status'] = 'success';
            result['data'] = transaction;
            return res.json(result);
        } catch (error) {
            console.error(`error:${error})`);
            return res.json(result);
		}
    }
};

export default controller;
