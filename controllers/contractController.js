
import contractUtil from '../utils/contractUtil';

const controller = {
	getAccountList: async (req, res, next) => {
        console.log("[contractController][getAccountList]");
        const result = {
            status:'fail'
        };
		try {
            const list = await contractUtil.getAccountList();
            result['status'] = 'success';
            result['data'] = list;
            return res.json(result);
        } catch (error) {
            console.error(`error:${error})`);
            return res.json(result);
        }
        // return res.status(status).json(data);

	},
	getAccountData: async (req, res, next) => {
        console.log("[contractController][getAccountData]");
        const result = {
            status:'fail'
        };
        const { address } = req.params;
        if (!address) {
            return res.json();
        }
        try {
            const balance = await contractUtil.getBalance(address);
            result['status'] = 'success';
            result['balance'] = balance;
            return res.json(result);
        } catch (error) {
            console.error(`error:${error})`);
            return res.json(result);
		}
    },
    transfer: async (req, res, next) => {
        console.log("[contractController][transfer]");
        const { address } = req.params;
        const { body } = req;
        const result = {
            status:'fail'
        };
        // console.log(body.password);
        // console.log(body.toAddr);
        // console.log(body.value);
        if (!body.password || !body.toAddr || !body.value) {
            return res.json(result);
        }
       
        try {
            const transaction = await contractUtil.transfer(address,body.password,body.toAddr,body.value);
            result['status'] = 'success';
            result['transaction'] = transaction;
            return res.json(result);
        } catch (error) {
            console.error(`error:${error})`);
            return res.json(result);
		}
    }
};

export default controller;
