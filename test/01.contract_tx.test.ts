import { expect } from 'chai';
import { VagaSDK } from "../sdk/VagaSDK"
import { aliceMnemonic, TestChainConfig } from './config_test';

describe('[01. Contract Tx Test]', () => {

	const vaga = new VagaSDK(TestChainConfig);

	it('Contract getUnsignedTxAddContractLog X 3 and signAndBroadcast', async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);

		let contractHash = "0xsalkdjfasldkjf2";
		let timeStamp = Math.round(+new Date() / 1000);;
		let eventName = "CreateContract";
		let ownerAddress = await wallet.getAddress();
		let jsonString = "{}";

		var tx = await vaga.Contract.getUnsignedTxAddContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress, jsonString);
		var result = await vaga.Contract.signAndBroadcast(wallet, [tx, tx, tx]);
		expect(result.code).equal(0);
	});

	it('Contract addContractLog', async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);

		let contractHash = "0xsalkdjfasldkjf2";
		let timeStamp = Math.round(+new Date() / 1000);;
		let eventName = "CreateContract";
		let ownerAddress = await wallet.getAddress();
		let jsonString = "{}";

		var result = await vaga.Contract.addContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress, jsonString);
		expect(result.code).equal(0);
	});

	it('Contract getUnsignedTxCreateContractFile x3 signAndBroadcast', async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);

		let timeStamp = Math.round(+new Date() / 1000);
		let fileHash = "0xklsdjflaksjflaksjf" + timeStamp; // random create

		let ownerAddress = await wallet.getAddress();
		let ownerList = [ownerAddress, ownerAddress];
		let jsonString = "{}";

		var tx1 = await vaga.Contract.getUnsignedTxCreateContractFile(wallet, fileHash, timeStamp, ownerList, jsonString);
		var tx2 = await vaga.Contract.getUnsignedTxCreateContractFile(wallet, fileHash + "a", timeStamp, ownerList, jsonString);
		var tx3 = await vaga.Contract.getUnsignedTxCreateContractFile(wallet, fileHash + "b", timeStamp, ownerList, jsonString);

		var result = await vaga.Contract.signAndBroadcast(wallet, [tx1, tx2, tx3]);
		expect(result.code).equal(0);
	});

	it('Contract createContractFile', async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);

		let timeStamp = Math.round(+new Date() / 1000);
		let fileHash = "0xklsdjflaksjflaksjf" + timeStamp;

		let ownerAddress = await wallet.getAddress();
		let ownerList = [ownerAddress, ownerAddress];
		let jsonString = "{}";

		var result = await vaga.Contract.createContractFile(wallet, fileHash, timeStamp, ownerList, jsonString);
		expect(result.code).equal(0);
	});
});