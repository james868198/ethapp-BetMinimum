import Web3 from 'web3';
import { ETHEREUM_URI } from './constants';

const web3 = new Web3(Web3.givenProvider || ETHEREUM_URI, null, {});

const GAS_LIMIT = 21000;
const GAS_PRICE = 20000000000;

const contractUtil = {
    getBalance: async acountAddr => {
        if (!acountAddr) {
            return;
        }
        const balance = await web3.eth.getBalance(acountAddr);
        return balance;
    },
    getContract: async (abi, contractAddr) => {
        if (!abi || !contractAddr || !value) {
            return;
        }
        const myContract = new web3.eth.Contract(abi, contractAddr);
        return myContract;
    },
    getAccountList: async () => {
        const accounts = await web3.eth.getAccounts();
        if (!accounts) {
            return;
        }
        return accounts;
    },
    transfer: async (fromAddr, fromPassword, toAddr, value) => {
        if (!fromAddr || !fromAddr || !toAddr || !value) {
            return;
        }
        const transactionData = {
            to: toAddr,
            from: fromAddr,
            value: web3.utils.toWei(value.toString(), 'ether'),
            gasLimit: GAS_LIMIT,
            gasPrice: GAS_PRICE
        };

        const unlock = await web3.eth.personal.unlockAccount(
            fromAddr,
            fromPassword,
            2000
        );
        if (!unlock) {
            return;
        }
        console.log('account unlock');
        const result = await web3.eth.sendTransaction(transactionData);
        console.log('get result');
        await web3.eth.personal.lockAccount(fromAddr);
        console.log('account lock');
        return result;
    }
};

export default contractUtil;
