# BetMinimum - Blockchain Cloud Application - server

The server of this interesting game application powered by `NodeJS`, `Express`, `Web3` and `Blockchain` (`Ethereum`), which serves as a bridge between client and the smart contract in blockchain.


## Get Started


### Start the server in dev mode

```bash
npm run dev
```

---

## File Structure

```bash
- controllers # Restful API
- utils
  - betMinimun.js # bridge between web3 and BetMinimun
  - contract.js #bridge between web3 and private
- routes
- app.js
- abi/BetMinimun.json #Config of BetMinimun functions. While Remix can generate it automatically, connecting contract from web3 requires reading ABI
```