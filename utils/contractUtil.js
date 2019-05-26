const Web3 = require('web3');
const fs = require('fs');

const ethereumUri = 'http://localhost:8546';
const ethunit = 1000000000000;
// const contractAddr = "0xf80f4b6b0654a705bb70508433023e1e1400dc2d";
const web3 = new Web3(Web3.givenProvider || ethereumUri, null, {});

const contractUtil = {
    getBalance: async (acountAddr) => {
        if (!acountAddr) {
            return;
        } 
        await web3.eth.getBalance(acountAddr,(err,bal)=> {
            if (!err) {
                return bal;
            }
        });
        return;
    },
    getContract: async (abi,contractAddr) => {
        if (!abi || !contractAddr || !value) {
            return;
        } 
        const myContract = new web3.eth.Contract(abi,contractAddr);
        return myContract;
    },
    getAccountList: async () => {
        const accounts = await web3.eth.getAccounts();
        if (!accounts) {
            return;
        } 
        return accounts;
    },
    transfer: async (fromAddr,fromPassword, toAddr, value) => {
        if (!fromAddr || !toAddr || !value) {
            return;
        } 
        const transactionData = {
            to: toAddr, 
            from: fromAddr, 
            value: web3.utils.toWei(value.toString(), "ether"),
            gasLimit: 21000,
            gasPrice: 20000000000
        }

        const unlock = await web3.eth.personal.unlockAccount(fromAddr, fromPassword, 2000);
        if (!unlock) {
            return;
        }
        const result = await web3.eth.sendTransaction(transactionData);
        return result;
       
    },
};

export default contractUtil;