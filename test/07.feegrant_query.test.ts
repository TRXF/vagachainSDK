
import { expect } from 'chai';
import { VagaSDK } from "../sdk/VagaSDK"
import { aliceMnemonic, bobMnemonic, TestChainConfig } from './config_test';

describe('[07. Feegrant Query Test]', () => {

	const vaga = new VagaSDK(TestChainConfig);

	it.skip('feegrant getGranteeAllowance', async () => {


		const aliceWallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		const bobWallet = await vaga.Wallet.fromMnemonic(bobMnemonic);

		var result = await vaga.FeeGrant.getGranteeAllowance(await aliceWallet.getAddress(), await bobWallet.getAddress());
		/*console.log(result['@type']);
		console.log(result.spendLimit);
		console.log(result.expiration);*/

	});

	it('feegrant getGranteeAllowanceAll', async () => {

		const bobWallet = await vaga.Wallet.fromMnemonic(bobMnemonic);

		var result = await vaga.FeeGrant.getGranteeAllowanceAll(await bobWallet.getAddress());
		/*console.log(result[0].granter);
		console.log(result[0].grantee);
		console.log("total: " + result.length);

		console.log(result[0].allowance["@type"]);
		console.log(result[0].allowance.spendLimit);
		console.log(result[0].allowance.expiration);*/

		//expect(result.code).to.equal(0);
	});
});