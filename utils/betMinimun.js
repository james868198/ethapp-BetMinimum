import Web3 from 'web3';
import fs from 'fs';
import { ETHEREUM_URI, CONTRACT_ADDR } from './constants';

const web3 = new Web3(Web3.givenProvider || ETHEREUM_URI, null, {});
const abiStr = fs.readFileSync('abi/BetMinimun.json').toString();
const abi = JSON.parse(abiStr);

const GAS_PER_TRANSACTION = 1500000;

const BetMinimun = {
    getBetMinimun: async () => {
        const myContract = new web3.eth.Contract(abi, CONTRACT_ADDR);
        return myContract;
    },
    getGameData: async contract => {
        if (!contract) return;

        const _total_pool = await contract.methods.total_pool.call();
        const _minimumBet = await contract.methods.minimumBet.call();
        const _numbers_region = await contract.methods.numbers_region.call();
        const _prevWinNumber = await contract.methods.prevWinNumber.call();
        return {
            totalPool: _total_pool,
            minimumBet: web3.utils.hexToNumber(_minimumBet),
            numbersRegion: web3.utils.hexToNumber(_numbers_region),
            prevWinNumber: web3.utils.hexToNumber(_prevWinNumber)
        };
    },
    checkPlayerExists: async (contract, address) => {
        if (!address) return;

        const exist = await contract.methods.checkPlayerExists(address).call();
        return exist;
    },
    bet: async (contract, account, password, number, value) => {
        if (!contract || !account || !number || !value) return;

        const transactionData = {
            from: account,
            gas: GAS_PER_TRANSACTION,
            value: web3.utils.toWei(value, 'ether')
        };
        const unlock = await web3.eth.personal.unlockAccount(
            account,
            password,
            200
        );
        if (!unlock) {
            return;
        }
        console.log('<bet> account unlocked');
        const result = await contract.methods.bet(number).send(transactionData);
        console.log('<bet> got result');
        await web3.eth.personal.lockAccount(account);
        console.log('<bet> account re-locked');

        return result;
    },
    distribute: async (contract, account, password) => {
        if (!contract || !account || !password) {
            return;
        }
        const transactionData = {
            from: account,
            gas: GAS_PER_TRANSACTION
        };
        const unlock = await web3.eth.personal.unlockAccount(
            account,
            password,
            20
        );
        if (!unlock) {
            return;
        }
        console.log('<distribute> account unlocked');
        const result = await contract.methods
            .distributePrizes()
            .send(transactionData);
        console.log('<distribute> got result', result);
        await web3.eth.personal.lockAccount(account);
        console.log('<distribute> account re-locked');
        return result;
    }
};

export default BetMinimun;
