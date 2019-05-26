
import contractUtil from '../utils/contractUtil';

const controller = {
	getAccountList: async (req, res, next) => {
		try {
            const list = await contractUtil.getAccountList();
            const result = {
                accountList: list
            }
            return res.json(result);
        } catch (error) {
            console.error(`error:${error})`);
            const result = {
                error: error
            }
            return res.json(result);
        }
        // return res.status(status).json(data);

	},
	getAccountData: async (req, res, next) => {
        const { address } = req.params;
        if (!address) {
            return;
        }
        try {
            const balance = await contractUtil.getBalance(address);
            const result = {
                balance: balance
            }
            return res.json(result);
        } catch (error) {
            console.error(`error:${error})`);
            const result = {
                error: error
            }
            return res.json(result);
		}
    },
    transfer: async (req, res, next) => {
        const { address } = req.params;
        const { body } = req;
        if (!body.password || !body.toAddr || !body.value) {
            return;
        }
        try {
            const balance = await contractUtil.getBalance(address,body.password,body.toAddr,body.value);
            const result = {
                balance: balance
            }
            return res.json(result);
        } catch (error) {
            console.error(`error:${error})`);
            const result = {
                error: error
            }
            return res.json(result);
		}
    }
};

export default controller;
