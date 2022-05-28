import { expect } from 'chai';
import { VagaSDK } from "../sdk/VagaSDK"
import { aliceMnemonic, TestChainConfig } from './config_test';

describe('[05. Bank test]', () => {

	const vaga = new VagaSDK(TestChainConfig);

	it('Bank getBalance() of a user who has never been created.', async () => {

		const wallet = await vaga.Wallet.newWallet();

		var result = await vaga.Bank.getBalance(await wallet.getAddress());
		expect(result).to.be.equal("0");

		var result2 = await vaga.Bank.getBalance(await wallet.getAddress());
		expect(result2).to.be.equal("0");
	});

	it('Bank getBalance()', async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		var result = await vaga.Bank.getBalance(await wallet.getAddress());

		//expect(result).to.be.equal("0");
	});

	it('Bank getTokenBalance()', async () => {

		// for single usage
		const tokenID = "ukomx6"

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		var result = await vaga.Bank.getTokenBalance(await wallet.getAddress(), tokenID);

		//console.log(result);

		//expect(result).to.be.equal("0");
	});

	it('Bank getTokenBalance() - not exist tokenID', async () => {

		// for single usage
		const tokenID = "ukomx6sdfakljfd"

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		var result = await vaga.Bank.getTokenBalance(await wallet.getAddress(), tokenID);
		expect(result).to.be.equal("0");

		//console.log(result);
		//expect(result).to.be.equal("0");
	});


	it('Bank getTokenBalanceList()', async () => {

		// for wallet application
		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		var result = await vaga.Bank.getTokenBalanceList(await wallet.getAddress());

		//console.log(result);
		//result[0].denom
		//result[0].amount
		//expect(result).to.be.equal("0");
	});
});