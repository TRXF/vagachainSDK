import { expect } from 'chai';
import { VagaSDK } from "../sdk/VagaSDK"
import { NftItemType } from '../sdk/vagachain/nft';
import { aliceMnemonic, bobMnemonic, TestChainConfig } from './config_test';

describe('[11. NFT Query Test]', () => {

	const vaga = new VagaSDK(TestChainConfig);

	it('NFT getBalanceOf', async () => {

		let wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		var totalNft = await vaga.Nft.getBalanceOf((await wallet.getAddress()));

		expect(totalNft).to.be.equal(totalNft);
		expect(totalNft).to.be.greaterThan(0);
	});

	it('NFT getNftIdListOfOwner', async () => {

		let wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);

		var result = await vaga.Nft.getNftIdListOfOwner(await wallet.getAddress());

		expect(result.nftIdList.length).to.be.greaterThan(0);
	});

	it('NFT getNftItemAllFromAddress-Pagination', async () => {

		let wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		var address = await wallet.getAddress();

		var result = await vaga.Nft.getNftItemAllFromAddress(address);
		const total = result.pagination.total;

		var current = result.dataList.length;

		while (result.pagination.next_key != "" && result.pagination.next_key != null) {
			result = await vaga.Nft.getNftItemAllFromAddress(address, result.pagination.next_key);
			current += result.dataList.length;
		}

		expect(current).to.be.equal(total);
	});

	it('NFT getNftItemAllFromAddress', async () => {

		let wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		var nftItemList = await vaga.Nft.getNftItemAllFromAddress(await wallet.getAddress());

		expect(nftItemList.dataList.length).to.be.greaterThan(0);
	});

	it('NFT getNftItemAll-pagination', async () => {

		var result = await vaga.Nft.getNftItemAll();

		const total = result.pagination.total;

		var totalItemList: NftItemType[] = [];
		var index = 0;

		while (result.pagination.next_key != null) {

			for (var i = 0; i < result.dataList.length; i++) {
				totalItemList[index++] = result.dataList[i];
			}

			result = await vaga.Nft.getNftItemAll(result.pagination.next_key);
		}

		for (var i = 0; i < result.dataList.length; i++) {
			totalItemList[index++] = result.dataList[i];
		}

		expect(totalItemList.length).to.be.equal(total);
	});

	it('NFT getNftItemAll', async () => {

		var result = await vaga.Nft.getNftItemAll();

		expect(result.dataList.length).to.be.equal(result.dataList.length);
		expect(result.dataList.length).to.be.greaterThan(0);
	});
});