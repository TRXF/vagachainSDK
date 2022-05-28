import { expect } from 'chai';
import { VagaSDK } from "../sdk/VagaSDK"
import { TestChainConfig } from './config_test';

describe('[09. IPFS Test]', () => {

	const vaga = new VagaSDK(TestChainConfig);

	it('ipfs test', async () => {

		var hash = await vaga.Ipfs.addJson("hello world");
		expect(hash).to.equal("Qmf412jQZiuVUtdgnB36FXFX7xg5V6KEbSJ4dpQuhkLyfD");

		var ee = new ArrayBuffer(1000);
		var hash = await vaga.Ipfs.addBuffer(ee);
		var url = vaga.Ipfs.getURLFromHash(hash);

		let srcUrl = vaga.Config.ipfsWebApiAddress + "/ipfs/QmVRqQTWMy2gNtNd8i9ugz8STaoZmFGYg6fn5YyEBHp9Be";

		expect(srcUrl).to.equal(url);

		hash = await vaga.Ipfs.addFile("./test/sample/test-bear.jpg");
		url = vaga.Ipfs.getURLFromHash(hash);
		srcUrl = vaga.Config.ipfsWebApiAddress + "/ipfs/QmYsezxzunake9EmyoU4HsWKEyHQLgE3syTEpTSQEhNChA";

		expect(srcUrl).to.equal(url);
	});
});