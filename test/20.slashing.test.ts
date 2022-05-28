import { VagaSDK } from "../sdk/VagaSDK"
import { TestChainConfig } from './config_test';

describe('[20. Slashing Test]', () => {

	const vaga = new VagaSDK(TestChainConfig);

	it('getSlashingParam test', async () => {
		const result = await vaga.Slashing.getSlashingParam();
		//console.log(result)
	})

	it('getSigningInfos test', async () => {
		const result = await vaga.Slashing.getSigningInfos();
		//console.log(result)
	})

	it('getSigningInfo test', async () => {
		const infos = await vaga.Slashing.getSigningInfos();
		const result = await vaga.Slashing.getSigningInfo(infos[0].address);
		//console.log(result)
	})
});