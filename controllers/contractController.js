import contractUtil from '../utils/contract';
import { FAIL, SUCCESS } from '../utils/constants';

const controller = {
    createAccount: async (_, res) => {
        console.log('[contractController][createAccount]');
        const result = { status: FAIL };
        try {
            const account = await contractUtil.createAccount();
            result.status = SUCCESS;
            result.account = account;
        } catch (error) {
            console.error(`error: ${error.message})`);
        }
        return res.json(result);
    },
    getAccountList: async (_, res) => {
        console.log('[contractController][getAccountList]');
        const result = { status: FAIL };
        try {
            const list = await contractUtil.getAccountList();
            result.status = SUCCESS;
            result.data = list;
        } catch (error) {
            console.error(`error: ${error.message})`);
        }
        return res.json(result);
    },
    getAccountData: async (req, res) => {
        console.log('[contractController][getAccountData]');
        const result = { status: FAIL };
        const { address } = req.params;
        if (address) {
            try {
                const balance = await contractUtil.getBalance(address);
                result.status = SUCCESS;
                result.balance = contractUtil.toMoney(balance);
            } catch (error) {
                console.error(`error: ${error.message})`);
            }
        }
        return res.json(result);
    },
    transfer: async (req, res) => {
        console.log('[contractController][transfer]');
        const { address } = req.params;
        const { body } = req;
        const result = { status: FAIL };

        if (
            body.password !== undefined &&
            body.toAddr !== undefined &&
            body.value !== undefined
        ) {
            try {
                const transaction = await contractUtil.transfer(
                    address,
                    body.password,
                    body.toAddr,
                    body.value
                );
                result.status = SUCCESS;
                result.transaction = transaction;
            } catch (error) {
                console.error(`error: ${error.message})`);
            }
        }
        return res.json(result);
    }
};

export default controller;
