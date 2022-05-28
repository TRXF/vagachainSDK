import { expect } from 'chai';
import { VagaSDK } from "../sdk/VagaSDK"
import { VagaUtil } from "../sdk/VagaUtil"
import { ContractFileType, ContractLogType } from '../sdk/vagachain/contract';
import { TestChainConfig } from './config_test';

describe('[02. Contract Query Test]', () => {

	const vaga = new VagaSDK(TestChainConfig);

	it('Contract getContractLogAll-pagination', async () => {

		var result = await vaga.Contract.getContractLogAll();

		const total = result.pagination.total;

		var totalItemList: ContractLogType[] = [];
		var index = 0;

		while (result.pagination.next_key != null) {

			for (var i = 0; i < result.dataList.length; i++) {
				totalItemList[index++] = result.dataList[i];
			}

			result = await vaga.Contract.getContractLogAll(result.pagination.next_key);
		}

		for (var i = 0; i < result.dataList.length; i++) {
			totalItemList[index++] = result.dataList[i];
		}

		expect(totalItemList.length).to.be.equal(total);
	});


	it('Contract getContractLogAll', async () => {

		var contractLogList = await vaga.Contract.getContractLogAll();
		expect(contractLogList.dataList.length).to.be.equal(contractLogList.dataList.length);

		expect(contractLogList.dataList.length).to.be.greaterThan(0);
	});

	it('Contract getContractLog', async () => {

		const logId = "0";

		var contractLog = await vaga.Contract.getContractLog(logId);
		expect(contractLog.id).to.be.equal(logId);
	});


	it('Contract getContractFileAll-pagination', async () => {

		var result = await vaga.Contract.getContractFileAll();

		const total = result.pagination.total;

		var totalItemList: ContractFileType[] = [];
		var index = 0;

		while (result.pagination.next_key != null) {

			for (var i = 0; i < result.dataList.length; i++) {
				totalItemList[index++] = result.dataList[i];
			}

			result = await vaga.Contract.getContractFileAll(result.pagination.next_key);
		}

		for (var i = 0; i < result.dataList.length; i++) {
			totalItemList[index++] = result.dataList[i];
		}

		expect(totalItemList.length).to.be.equal(total);
	});


	it('Contract getContractFileAll', async () => {

		var contractFileList = await vaga.Contract.getContractFileAll();

		//  for(var i = 0; i < contractFileList.length; i++){
		//  	console.log(contractFileList[i]);
		//  }
		//console.log("contractFileList:" + contractFileList.length);

		expect(contractFileList.dataList.length).to.be.equal(contractFileList.dataList.length);
		expect(contractFileList.dataList.length).to.be.greaterThan(0);

	});

	it.skip('Contract getContractFile', async () => {

		const contractFileHash = "e3b0c44afbf4c8996fb92427ae41e4649b934ca495991b7852b85531231asddaqwqe";

		var contractFile = await vaga.Contract.getContractFile(contractFileHash);
		expect(contractFile.fileHash).to.be.equal(contractFileHash);
	});

	it('Contract getContractListFromHash', async () => {

		const contractHash = "0xsalkdjfasldkjf2";
		var idList = await vaga.Contract.getContractListFromHash(contractHash);

		for (let i = 0; i < idList.length; i++) {
			var data = await vaga.Contract.getContractLog(idList[i]);
			//console.log(data);
		}

		expect(idList.length).to.be.greaterThan(0);
	});

	it.skip('Contract isContractOwner', async () => {

		const contractFileHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b85531231asddaqwqe";
		const owner1 = "vaga1nssuz67am2uwc2hjgvphg0fmj3k9l6cx65ux9u0kdjaaldlq";
		const owner2 = "vaga106a9nzxcxu526z4cx6nq4zqpx7ctrx65a020yk23kdjaaldlq";

		var isOwner = await vaga.Contract.isContractOwner(contractFileHash, owner1);
		expect(isOwner).to.be.equal(true);

		isOwner = await vaga.Contract.isContractOwner(contractFileHash, owner2);
		expect(isOwner).to.be.equal(true);
	});

	it('Contract getFileHash', async () => {

		let fileHash = await VagaUtil.getFileHash("./test/sample/sample_contract.pdf");
		expect(fileHash).to.be.equal("61faa15f52f19fc4c4e32e1f1208bf8d6d8134ac0a4b15bcfe05bc420e1aedb0");
	});
});