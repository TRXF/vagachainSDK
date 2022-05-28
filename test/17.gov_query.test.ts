import { ProposalStatus } from '../sdk/vagachain/gov';
import { VagaSDK } from "../sdk/VagaSDK"
import { TestChainConfig } from './config_test';

describe('[17. Gov Query Test]', () => {

	const vaga = new VagaSDK(TestChainConfig);

	it('get getProposalList', async () => {

		let proposalList = await vaga.Gov.getProposalList();
		//console.log(proposalList);
	})

	it('get getProposalListByStatus', async () => {

		let status = ProposalStatus.PROPOSAL_STATUS_REJECTED;
		let proposalList = await vaga.Gov.getProposalListByStatus(status);

		//console.log(proposalList);
	})

	it('get getProposal', async () => {

		let proposalList = await vaga.Gov.getProposalList();

		if (proposalList.length > 0) {
			const id = "1";
			let proposal = await vaga.Gov.getProposal(id);
			//console.log(proposal);
		}
	})

	// integrated function with params/voting, params/deposit, params/tallying
	it('get params', async () => {

		let param = await vaga.Gov.getParam();
		//console.log(param);
	})

	// current tally info
	it('get getCurrentVoteInfo', async () => {

		let proposalList = await vaga.Gov.getProposalList();

		if (proposalList.length > 0) {
			const proposalId = "1";
			let param = await vaga.Gov.getCurrentVoteInfo(proposalId);
			//	console.log(param);
		}
	})
});