const Web3 = require('web3');
const fs = require('fs');

const ethereumUri = 'http://localhost:8546';
const ethunit = 1000000000000;
const contractAddr = "0xf80f4b6b0654a705bb70508433023e1e1400dc2d";
const web3 = new Web3(Web3.givenProvider || ethereumUri, null, {});
const abiStr = fs.readFileSync('abi/BetMinimun.json').toString();
const abi = JSON.parse(abiStr);


const BetMinimun = {
    getBetMinimun: async () => {
        const myContract = new web3.eth.Contract(abi,contractAddr);
        return myContract;
    },
    getGameData: async (contract) => {
        if (!contract) {
            return;
        }
        const _total_pool = await contract.methods.total_pool.call();
        const _minimumBet = await contract.methods.minimumBet.call();
        const _numbers_region = await contract.methods.numbers_region.call();
        const _prevWinNumber = await contract.methods.prevWinNumber.call();
        return {
            total_pool: _total_pool,
            minimumBet: web3.utils.hexToNumber(_minimumBet),
            numbers_region: web3.utils.hexToNumber(_numbers_region),
            prevWinNumber: web3.utils.hexToNumber(_prevWinNumber)
        }
    },
    checkPlayerExists: async (contract,address) => {
        if (!address) {
            return;
        }
        const exist = await contract.methods.checkPlayerExists(address).call();
        return exist;
    },
    bet: async (contract, account, password, number, value) => {
        if (!contract || !account ||!number || !value) {
            return;
        }
        const transactionData = {
            from: account,
            gas: 1500000,
            value: web3.utils.toWei(value,'ether')
        }
        const unlock = await web3.eth.personal.unlockAccount(account, password, 200);
        if (!unlock) {
            return;
        }
        console.log("account unlock")
        const result = await contract.methods.bet(number).send(transactionData)
        console.log("get result")
        await web3.eth.personal.lockAccount(account);
        console.log("account lock")
        return result;
    },
    distribute: async (contract, account, password) => {
        if (!contract || !account ||!password ) {
            return;
        }
        const transactionData = {
            from: account,
            gas: 1500000
        }
        const unlock = await web3.eth.personal.unlockAccount(account, password, 20);
        if (!unlock) {
            return;
        }
        console.log("account unlock")
        const result = await contract.methods.distributePrizes().send(transactionData);
        console.log("get result", result)
        await web3.eth.personal.lockAccount(account);
        console.log("account lock")
        return result;
    },
};

export default BetMinimun;