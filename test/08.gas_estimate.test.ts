import { VagaSDK } from "../sdk/VagaSDK"
import { VagaUtil } from '../sdk/VagaUtil';
import { aliceMnemonic, bobMnemonic, validatorMnemonic, TestChainConfig } from './config_test';
import { VotingOption } from '../sdk/vagachain/common';

describe.skip('[08. Gas Estimation Test]', () => {

	const vaga = new VagaSDK(TestChainConfig);

	it("1-1. bank send gas estimation", async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		const targetWallet = await vaga.Wallet.fromMnemonic(bobMnemonic);
		const amount = 1;

		try {
			const gas = await vaga.Bank.getGasEstimationSend(wallet, await targetWallet.getAddress(), amount);
			console.log("estimateGas : " + gas);
			
		} catch (error) {
			console.log(error);
		}
		
	});

	it("1-2. bank sendToken gas estimation", async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		const targetWallet = await vaga.Wallet.fromMnemonic(bobMnemonic);
		const amount = 1;
		
		const tokenID = "ukomx";
		const decimal = 6;
		
		try {
			const gas = await vaga.Bank.getGasEstimationSendToken(wallet, await targetWallet.getAddress(), tokenID, amount, decimal);
			console.log("estimateGas : " + gas);
			
		} catch (error) {
			console.log(error);
		}
		
	});

	it("2-1. Contract addContractLog getGasEstimationFromUnSignedTxList gas estimation", async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);

		const contractHash = "0xsalkdjfasldkjf2";
		const timeStamp = Math.round(+new Date() / 1000);;
		const eventName = "CreateContract";
		const ownerAddress = await wallet.getAddress();
		const jsonString = "{}";

		const tx1 = await vaga.Contract.getUnsignedTxAddContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress, jsonString);
		const gas = await vaga.Contract.getGasEstimationFromUnSignedTxList(wallet, [tx1, tx1, tx1, tx1, tx1]);

		console.log("estimateGas : " + gas);
	});

	it("2-2. Contract addContractLog gas estimation", async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);

		const contractHash = "0xsalkdjfasldkjf2";
		const timeStamp = Math.round(+new Date() / 1000);;
		const eventName = "CreateContract";
		const ownerAddress = await wallet.getAddress();
		const jsonString = "{}";

		const gas = await vaga.Contract.getGasEstimationAddContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress, jsonString);
		console.log("estimateGas : " + gas);
	});

	it("2-3. Contract createContractFile gas estimation", async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);

		const timeStamp = Math.round(+new Date() / 1000);
		const fileHash = "0xklsdjflaksjflaksjf" + timeStamp; // random time

		const ownerAddress = await wallet.getAddress();
		const ownerList = [ownerAddress, ownerAddress];
		const jsonString = "{}";

		const gas = await vaga.Contract.getGasEstimationCreateContractFile(wallet, fileHash, timeStamp, ownerList, jsonString);
		console.log("estimateGas : " + gas);
	});

	it("3-1. NFT Mint gas estimation", async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		const gas = await vaga.Nft.getGasEstimationMint(wallet, "https://naver.com");

		console.log("estimateGas : " + gas);
	});

	it("3-2. NFT Transfer gas estimation", async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		const targetWallet = await vaga.Wallet.fromMnemonic(bobMnemonic);

		const result = await vaga.Nft.mint(wallet, "https://naver.com");

		const jsonData = JSON.parse(result.rawLog!);
		const nftId = jsonData[0]["events"][0]["attributes"][2]["value"];

		const gas = await vaga.Nft.getGasEstimationTransfer(wallet, await targetWallet.getAddress(), nftId);
		console.log("estimateGas : " + gas);
	});

	it("3-3. NFT Burn gas estimation", async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		var result = await vaga.Nft.mint(wallet, "https://naver.com");

		var jsonData = JSON.parse(result.rawLog!);
		var nftId = jsonData[0]["events"][0]["attributes"][2]["value"];

		const gas = await vaga.Nft.getGasEstimationBurn(wallet, nftId);
		console.log("estimateGas : " + gas);
	});

	it.skip("4-1. Feegrant GrantPeriodicAllowance gas estimation", async () => {

		const aliceWallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		const bobWallet = await vaga.Wallet.fromMnemonic(bobMnemonic);

		const spendLimit = 200000;
		const expirationDate = new Date();
		expirationDate.setMinutes(expirationDate.getMinutes() + 2);

		let periodicAllowanceData = {
			// basicSpendLimit: undefined,
			// basicExpiration: undefined,
			periodSeconds: 30,
			periodSpendLimit: 2000,
			periodCanSpend: 10000,
			periodReset: expirationDate
		};

		const gas = await vaga.FeeGrant.getGasEstimationGrantPeriodicAllowance(aliceWallet, await bobWallet.getAddress(), periodicAllowanceData);
		console.log("estimateGas : " + gas);
	});

	it.skip("4-2. Feegrant GrantBasicAllowance gas estimation", async () => {

		const aliceWallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		const bobWallet = await vaga.Wallet.fromMnemonic(bobMnemonic);

		var gas = await vaga.FeeGrant.getGasEstimationGrantBasicAllowance(aliceWallet, await bobWallet.getAddress());
		console.log("estimateGas : " + gas);
	});

	it("4-3. Feegrant revokeAllowance gas estimation", async () => {

		const aliceWallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		const bobWallet = await vaga.Wallet.fromMnemonic(bobMnemonic);

		const gas = await vaga.FeeGrant.getGasEstimationRevokeAllowance(aliceWallet, await bobWallet.getAddress());
		console.log("estimateGas : " + gas);
	});


	// var result = await vaga.Staking.delegate(wallet, validatorAddress, amountFCT);
	// var result = await vaga.Staking.undelegate(wallet, validatorAddress, amount);
	//let result1 = await vaga.Staking.redelegate(wallet, srcValidatorAddress, dstValidatorAddress, amount,{ gas: 300000, fee: 3000 });
	it("5-1. Staking delegate gas estimation", async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		const validatorWallet = await vaga.Wallet.fromMnemonic(validatorMnemonic);
		const validatorAddress = VagaUtil.getValOperAddressFromAccAddress(await validatorWallet.getAddress());

		const amountFCT = 60;

		const gas = await vaga.Staking.getGasEstimationDelegate(wallet, validatorAddress, amountFCT);
		console.log("estimateGas : " + gas);
	});

	it("5-2. Staking undelegate gas estimation", async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		const validatorWallet = await vaga.Wallet.fromMnemonic(validatorMnemonic);
		const validatorAddress = VagaUtil.getValOperAddressFromAccAddress(await validatorWallet.getAddress());

		const amount = 5;

		const gas = await vaga.Staking.getGasEstimationUndelegate(wallet, validatorAddress, amount);
		console.log("estimateGas : " + gas);
	});

	it("5-3. Staking redelegate gas estimation", async () => {

		let alice = "address nerve kid future spin october hip lonely smooth episode tattoo month invest away castle luxury sauce junk husband uncle bullet orbit this dismiss";

		const wallet = await vaga.Wallet.fromMnemonic(alice);
		const validatorList = await vaga.Staking.getValidatorList();

		if (validatorList.length < 2)
			return;

		const srcValidatorAddress = validatorList[0].operator_address;
		const dstValidatorAddress = validatorList[1].operator_address;

		const amount = 10;

		// NOTICE: there's a case for use more than 200000 gas here.

		try {
			const gas = await vaga.Staking.getGasEstimationRedelegate(wallet, srcValidatorAddress, dstValidatorAddress, amount,
				{ gas: 300000, fee: 30000 });
	
			console.log("estimateGas : " + gas);
			
		} catch (error) {
			console.log(error);
		}


		
	});

	it("6-1. Distribution withdrawAllRewards gas estimation", async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		const delegationList = await vaga.Staking.getTotalDelegationInfo(await wallet.getAddress());
		const validatorAddress = delegationList[0].delegation.validator_address;

		const gas = await vaga.Distribution.getGasEstimationWithdrawAllRewards(wallet, validatorAddress);
		console.log("estimateGas : " + gas);
	});

	it("6-2. Distribution withdrawValidatorCommission gas estimation", async () => {

		const wallet = await vaga.Wallet.fromMnemonic(validatorMnemonic);
		const address = await wallet.getAddress();
		const validatorAddress = VagaUtil.getValOperAddressFromAccAddress(address);

		const gas = await vaga.Distribution.getGasEstimationWithdrawValidatorCommission(wallet, validatorAddress);
		console.log("estimateGas : " + gas);
	});

	it("6-3. Distribution fundCommunityPool gas estimation", async () => {

		const wallet = await vaga.Wallet.fromMnemonic(validatorMnemonic);
		const amount = 1;

		const gas = await vaga.Distribution.getGasEstimationFundCommunityPool(wallet, amount);
		console.log("estimateGas : " + gas);
	});

	it("6-4. Distribution setWithdrawAddress gas estimation", async () => {

		const aliceWallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		const bobWallet = await vaga.Wallet.fromMnemonic(bobMnemonic);

		const gas = await vaga.Distribution.getGasEstimationSetWithdrawAddress(aliceWallet, await bobWallet.getAddress());
		console.log("estimateGas : " + gas);
	});

	// var result = await vaga.Gov.submitTextProposal(wallet, title, description, initialDepositFCT);
	// var result = await vaga.Gov.submitCommunityPoolSpendProposal(aliceWallet, title, description, initialDepositFCT, amount, recipient);
	// var result = await vaga.Gov.submitParameterChangeProposal(aliceWallet, title, description, initialDepositFCT, changeParamList);
	// var result = await vaga.Gov.submitSoftwareUpgradeProposalByHeight(aliceWallet, title, description, initialDepositFCT, upgradeName, upgradeHeight);
	// var result = await vaga.Gov.submitCancelSoftwareUpgradeProposal(aliceWallet, title, description, initialDepositFCT);
	// var result = await vaga.Gov.deposit(wallet, proposalId, amount);
	// var result = await vaga.Gov.vote(wallet, proposalId, VotingOption.VOTE_OPTION_YES);

	it("7-1. Gov submitTextProposal gas estimation", async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);

		const initialDepositFCT = 10;
		const title = "test submit proposal";
		const description = "test description";

		var result = await vaga.Gov.submitTextProposal(wallet, title, description, initialDepositFCT);

		const gas = await vaga.Gov.getGasEstimationSubmitTextProposal(wallet, title, description, initialDepositFCT);
		console.log("estimateGas : " + gas);
	});

	it("7-2. Gov submitCommunityPoolSpendProposal gas estimation", async () => {

		const aliceWallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		const bobWallet = await vaga.Wallet.fromMnemonic(bobMnemonic);

		const initialDepositFCT = 10;
		const title = "Community spend proposal1";
		const description = "This is a community spend proposal";
		const amount = 1000;
		const recipient = await bobWallet.getAddress();

		const gas = await vaga.Gov.getGasEstimationSubmitCommunityPoolSpendProposal(aliceWallet, title, description, initialDepositFCT, amount, recipient);
		console.log("estimateGas : " + gas);
	});

	it("7-3. Gov submitParameterChangeProposal gas estimation", async () => {

		const aliceWallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);

		const initialDepositFCT = 10;
		const title = "Parameter Change proposal1";
		const description = "This is a Parameter change proposal";

		const changeParamList = [{
			subspace: "staking",
			key: "MaxValidators",
			value: "100",
		}];

		const gas = await vaga.Gov.getGasEstimationSubmitParameterChangeProposal(aliceWallet, title, description, initialDepositFCT, changeParamList);
		console.log("estimateGas : " + gas);
	});

	it("7-4. Gov submitSoftwareUpgradeProposalByHeight gas estimation", async () => {

		const aliceWallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);

		const initialDepositFCT = 10000;
		const title = "Software Upgrade proposal1";
		const description = "This is a software upgrade proposal";

		const upgradeName = "v0.2.7";
		const upgradeHeight = 20000000;

		const gas = await vaga.Gov.getGasEstimationSubmitSoftwareUpgradeProposalByHeight(aliceWallet, title, description, initialDepositFCT, upgradeName, upgradeHeight);
		console.log("estimateGas : " + gas);
	});

	it("7-5. Gov submitCancelSoftwareUpgradeProposal gas estimation", async () => {

		const aliceWallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);

		const initialDepositFCT = 1000;
		const title = "Software Upgrade proposal1";
		const description = "This is a software upgrade proposal";

		const gas = await vaga.Gov.getGasEstimationSubmitCancelSoftwareUpgradeProposal(aliceWallet, title, description, initialDepositFCT);
		console.log("estimateGas : " + gas);
	});

	it("7-6. Gov deposit gas estimation", async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);

		const proposalId = 1;
		const amount = 1000;
		var result = await vaga.Gov.deposit(wallet, proposalId, amount);

		const gas = await vaga.Gov.getGasEstimationDeposit(wallet, proposalId, amount);
		console.log("estimateGas : " + gas);
	});

	it("7-7. Gov vote gas estimation", async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		const proposalId = 1;

		const gas = await vaga.Gov.getGasEstimationVote(wallet, proposalId, VotingOption.VOTE_OPTION_YES);
		console.log("estimateGas : " + gas);
	});

	it("8-1. Token createToken gas estimation", async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);

		const tokenName = "KOMX TOKEN";
		const symbol = "KOMX63232";
		const tokenURI = "https://naver.com";
		const totalSupply = 10000;
		const decimal = 6;
		const mintable = true;
		const burnable = true;

		const gas = await vaga.Token.getGasEstimationCreateToken(wallet, tokenName, symbol, tokenURI, totalSupply, decimal, mintable, burnable);
		console.log("estimateGas : " + gas);
	});

	it("8-2. Token mint gas estimation", async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);
		const bobAddress = await (await vaga.Wallet.fromMnemonic(bobMnemonic)).getAddress();

		const tokenID = "ukomx6";
		const amount = 10000;
		const decimal = 6;

		const gas = await vaga.Token.getGasEstimationMint(wallet, tokenID, amount, decimal, bobAddress);
		console.log("estimateGas : " + gas);
	});

	it("8-3. Token burn gas estimation", async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);

		const tokenID = "ukomx6";
		const amount = 10;
		const decimal = 6;

		const gas = await vaga.Token.getGasEstimationBurn(wallet, tokenID, amount, decimal);
		console.log("estimateGas : " + gas);
	});

	it("8-4. Token updateTokenURI gas estimation", async () => {

		const wallet = await vaga.Wallet.fromMnemonic(aliceMnemonic);

		const tokenID = "ukomx6";
		const tokenURI = "https://vagachain.org";

		const gas = await vaga.Token.getGasEstimationUpdateTokenURI(wallet, tokenID, tokenURI);
		console.log("estimateGas : " + gas);
	});
});