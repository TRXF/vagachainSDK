import { expect } from 'chai';
import { VagaUtil } from '..';
import { VagaSDK } from "../sdk/VagaSDK"
import { aliceMnemonic, bobMnemonic, TestChainConfig, validatorMnemonic } from './config_test';

describe('[14. Distribution Tx Test]', () => {

	const vaga = new VagaSDK(TestChainConfig);

	it('withdrawAllRewards for delegator side', async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		const delegationList = await vaga.Staking.getTotalDelegationInfo(await wallet.getAddress());
		const validatorAddress = delegationList[0].delegation.validator_address;

		var result = await vaga.Distribution.withdrawAllRewards(wallet, validatorAddress);
		expect(result.code).to.equal(0);
	});

	it('withdrawAllRewards for All Validators', async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		const delegationList = await vaga.Staking.getTotalDelegationInfo(await wallet.getAddress());

		// console.log(delegationList);

		var gasEstimation = await vaga.Distribution.getGasEstimationWithdrawAllRewardsFromAllValidator(wallet, delegationList);
		//console.log("gasEstimation: " + gasEstimation);

		var result = await vaga.Distribution.withdrawAllRewardsFromAllValidator(wallet, delegationList, { gas: gasEstimation, fee: gasEstimation });
		expect(result.code).to.equal(0);

		//console.log(result);

	});

	it('withdrawAllRewards for validator side', async () => {

		const wallet = await vaga.Wallet.fromMnemonic(validatorMnemonic);
		const address = await wallet.getAddress();

		let validatorAddress = VagaUtil.getValOperAddressFromAccAddress(address);

		var result = await vaga.Distribution.withdrawAllRewards(wallet, validatorAddress);

		expect(result.code).to.equal(0);
	});

	it('WithdrawValidatorCommission OK', async () => {

		// CHECK : validatorMnemonic only valid on dev stage.
		// this command is only valid for validator not delegator.

		const wallet = await vaga.Wallet.fromMnemonic(validatorMnemonic);
		const address = await wallet.getAddress();

		let validatorAddress = VagaUtil.getValOperAddressFromAccAddress(address);

		var result = await vaga.Distribution.withdrawValidatorCommission(wallet, validatorAddress);

		expect(result.code).to.equal(0);
	});

	it('FundCommunityPool OK', async () => {
		const wallet = await vaga.Wallet.fromMnemonic(validatorMnemonic);
		const amount = 1;

		var result = await vaga.Distribution.fundCommunityPool(wallet, amount);
		expect(result.code).to.equal(0);
	});

	it('SetWithdrawAddress OK', async () => {

		const aliceWallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		const bobWallet = await vaga.Wallet.fromMnemonic(bobMnemonic);

		//console.log(await aliceWallet.getAddress());
		//console.log(await bobWallet.getAddress());

		//console.log(await vaga.Bank.getBalance(await aliceWallet.getAddress()));
		//console.log(await vaga.Bank.getBalance(await bobWallet.getAddress()));

		var result = await vaga.Distribution.setWithdrawAddress(aliceWallet, await bobWallet.getAddress());
		expect(result.code).to.equal(0);

		const validatorWallet = await vaga.Wallet.fromMnemonic(validatorMnemonic);
		let validatorAddress = VagaUtil.getValOperAddressFromAccAddress(await validatorWallet.getAddress());

		var result1 = await vaga.Distribution.withdrawAllRewards(aliceWallet, validatorAddress);
		//console.log(result1);
		expect(result1.code).to.equal(0);

		//console.log(await vaga.Bank.getBalance(await aliceWallet.getAddress()));
		//console.log(await vaga.Bank.getBalance(await bobWallet.getAddress()));
	});
});