# vaga-js

[![npm version](https://badge.fury.io/js/%40vagachain%2Fvaga-js.svg)](https://badge.fury.io/js/%40vagachain%2Fvaga-js)
[![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/vagachain/vaga-js)](https://github.com/vagachain/vaga-js/releases)
[![license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/vagachain/vaga-js/blob/master/LICENSE)
![Lines of code](https://img.shields.io/tokei/lines/github/vagachain/vaga-js)

The Javascript & TypeScript SDK for VagaChain

Vaga-js is a SDK for writing applications based on javascript & typescript. You can use it client web app or Node.js. This SDK is created inspired by cosmjs and several sdk. All functions of the VagaChain can be accessed at the service level.

## Features
 Most cosmos sdk features are supported
- Wallet / Bank
- Nft / Contract
- Ipfs / Gov
- Staking / Distribution
- Feegrant ...and so one

</br>


## Install
You can install `vaga-js` using [NPM](https://www.npmjs.com/package/@vagachain/vaga-js)
```
yarn add @vagachain/vaga-js
```
or
```
npm i @vagachain/vaga-js
```

## Usage
### Initializing SDK
```js
import { VagaSDK } from "@vagachain/vaga-js"
import { VagaConfig } from "@vagachain/vaga-js"

// use preset config : testnet
const vaga = new VagaSDK(VagaConfig.TestNetConfig);

// use preset config : mainnet
const vaga = new VagaSDK(VagaConfig.MainNetConfig);

// or use custom set

let chainConfig = {
   chainID: "colosseum-1",
   rpcAddress: "https://lcd-mainnet.vagachain.dev:26657",
   restApiAddress: "https://lcd-mainnet.vagachain.dev:1317",
   ipfsNodeAddress: "https://ipfs-dev.vagachain.dev",
   ipfsNodePort: 5001,
   ipfsWebApiAddress: "https://ipfs-dev.vagachain.dev",
   hdPath: "m/44'/7777777'/",
   prefix: "vaga",
   denom: "ufct",
   defaultFee: 30000,
   defaultGas: 300000,
   isShowLog: false,
}

const vaga = new VagaSDK(chainConfig);

```

### Create wallet account
```js
// create new wallet
const newWallet = await vaga.Wallet.newWallet();

// generateMnemonic
const mnemonic = await vaga.Wallet.generateMnemonic();
const index = 0;

// or from mnemonic
const wallet = await vaga.Wallet.fromMnemonic(mnemonic, index);
console.log(await wallet.getAddress());
```

### Import account by private key
```js
const privateKey = wallet.getPrivateKey();
const wallet1 = await vaga.Wallet.fromPrivateKey(privateKey);
```

### Get chaion status (include height, time etc)
```js
const result = await vaga.Chain.getChainStatus();
console.log(result);
```

### Get FIRMA balance of specific account
```js
const address = await wallet.getAddress();
const balance = await vaga.Bank.getBalance(address);
console.log("balance: " + balance);
```

### Get transaction by hash
```js
const txHash = "0xC5509A32CF57798F8C3185DFAF03BD2D09DFC04FE842283ECA9298F5F60E340F";
const result = await vaga.Chain.getTransactionByHash(txHash);
console.log(result);
```

### Bank send - create tx and broadcast
```js
const fctAmount = 10;
let result = await vaga.Bank.send(wallet, address, fctAmount);
```

### Bank send - extended version
```js
const fctAmount = 10;
let result = await vaga.Bank.send(wallet, address, fctAmount, { memo: "", fee: 30000, gas: 300000 });
```

### Calculate gas
```js
let gas = await vaga.Bank.getGasEstimationSend(wallet, address, fctAmount);
```

### Mint NFT
```js
const tokenURI = "https://ipfs-vaga-devnet.vagachain.org/ipfs/QmYsezxzunake9EmyoU4HsWKEyHQLgE3syTEpTSQEhNChA";
let result = await vaga.Nft.mint(wallet, tokenURI);
```

### Transfer NFT
```js
const tokenId = 1;
let result = await vaga.Nft.transfer(wallet, address, tokenId);
```

### Burn NFT
```js
const tokenId = 1;
let result = await vaga.Nft.burn(wallet, tokenId);
```

You can see everything usage of vaga-js on the test folder.
</br>
https://github.com/VagaChain/vaga-js/tree/main/test
