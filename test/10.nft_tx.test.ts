import { expect } from 'chai';
import { VagaSDK } from "../sdk/VagaSDK"
import { aliceMnemonic, bobMnemonic, TestChainConfig } from './config_test';

describe('[10. NFT Tx Test]', () => {

	const vaga = new VagaSDK(TestChainConfig);

	it('NFT Mint', async () => {

		let wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		var result = await vaga.Nft.mint(wallet, "https://naver.com");

		// get nftId below code
		var jsonData = JSON.parse(result.rawLog!);
		var nftId = jsonData[0]["events"][0]["attributes"][2]["value"];

		expect(result.code).to.be.equal(0);
	});

	it('NFT Transfer', async () => {

		let wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		let targetWallet = await vaga.Wallet.fromMnemonic(bobMnemonic);

		var result = await vaga.Nft.mint(wallet, "https://naver.com");

		var jsonData = JSON.parse(result.rawLog!);
		var nftId = jsonData[0]["events"][0]["attributes"][2]["value"];

		var result = await vaga.Nft.transfer(wallet, await targetWallet.getAddress(), nftId);
		expect(result.code).to.be.equal(0);

	});

	it('NFT Burn', async () => {

		let wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		var result = await vaga.Nft.mint(wallet, "https://naver.com");

		var jsonData = JSON.parse(result.rawLog!);
		var nftId = jsonData[0]["events"][0]["attributes"][2]["value"];

		var result = await vaga.Nft.burn(wallet, nftId);
		expect(result.code).to.be.equal(0);
	});
});