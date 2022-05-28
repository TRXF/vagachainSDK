import { expect } from 'chai';
import { VagaSDK } from "../sdk/VagaSDK"
import { aliceMnemonic, bobMnemonic, TestChainConfig } from './config_test';

describe('[22. Token query Test]', () => {

	const vaga = new VagaSDK(TestChainConfig);

	it('Token getTokenDataListFromOwner', async () => {

		const address = await (await vaga.Wallet.fromMnemonic(aliceMnemonic)).getAddress();
		var tokenDataList = await vaga.Token.getTokenDataListFromOwner(address);
		//console.log(totalData);
		expect(tokenDataList.length).to.be.greaterThan(0);
	});

	it('Token getTokenData', async () => {

		const address = await (await vaga.Wallet.fromMnemonic(aliceMnemonic)).getAddress();
		var tokenDataList = await vaga.Token.getTokenDataListFromOwner(address);

		const tokenID = tokenDataList[0];

		var totalData = await vaga.Token.getTokenData(tokenID);
		//console.log(totalData);

		expect(totalData.tokenID).to.be.equal(tokenID);
	});

	it('Token getTokenDataAll', async () => {

		var totalDataList = await vaga.Token.getGetTokenDataAll();
		//console.log(totalDataList.dataList);
		//console.log(totalDataList.pagination);

		expect(totalDataList.dataList.length).to.be.greaterThan(0);
		//expect(totalNft).to.be.greaterThan(0);
	});
});