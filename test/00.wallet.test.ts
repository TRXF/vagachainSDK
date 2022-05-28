import { expect } from 'chai';
import { VagaSDK } from "../sdk/VagaSDK"
import { aliceMnemonic, bobMnemonic, TestChainConfig } from './config_test';

describe('[00. Wallet Test]', () => {

	const vaga = new VagaSDK(TestChainConfig);

	it('fromMnemonic check', async () => {
		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		expect(wallet.getMnemonic()).to.equal(aliceMnemonic);
	});

	it('Wallet.fromPrivateKey check', async () => {
		const privateKey = "0x15bc0d2e445ef5b13f9d3c6d227f21524fd05d5afda713d1aff1ecc8db49a62d";
		const privateKeyFromWallet = (await vaga.Wallet.fromPrivateKey(privateKey)).getPrivateKey();

		expect(privateKeyFromWallet).to.equal(privateKey);
	});
});