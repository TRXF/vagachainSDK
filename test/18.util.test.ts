import { expect } from 'chai';
import { VagaUtil } from '..';

describe('[18. util Test]', () => {

	// getHashFromString

	it('getSha1HashFromString test', async () => {

		const contractName = "testContract1234";

		let result = VagaUtil.getSha1HashFromString(contractName);

		expect(result).to.be.equal("c88753a797d1310b36673e3494005bc7485746b7");
	})

	it('getHashFromString test', async () => {

		const contractName = "testContract1234";

		let result = VagaUtil.getHashFromString(contractName);

		expect(result).to.be.equal("95e55f6b55ccf6b3988a6f9ee6d9c3c0011ea93a2489e7f05d10cada2613c17f");
	})

	it('isValidAddress test', async () => {

		const validAddress = "vaga134pp6s2nv7pl4mxu58aeufdd6fv5s2zujrrmsa";
		const wrongAddress1 = "vaga134pp6s2nv7pl4mxu58aeufdd6fv5s2zujrrmsb";
		const wrongAddress2 = "vaga134pp6s2nv7pl4mxu58aeufdd6fv5s2zujrrmsa1";

		let result = VagaUtil.isValidAddress(validAddress);
		expect(result).to.be.equal(true);

		result = VagaUtil.isValidAddress(wrongAddress1);
		expect(result).to.be.equal(false);

		result = VagaUtil.isValidAddress(wrongAddress2);
		expect(result).to.be.equal(false);
	})

	it('getValOperAddressFromAccAddress test', async () => {

		const accAddress = "vaga134pp6s2nv7pl4mxu58aeufdd6fv5s2zujrrmsa";
		const valoperAddress = "vagavaloper134pp6s2nv7pl4mxu58aeufdd6fv5s2zuvsgqsn";

		let result = VagaUtil.getValOperAddressFromAccAddress(accAddress);
		expect(result).to.be.equal(valoperAddress);
	})

	it('getAccAddressFromValOperAddress test', async () => {

		const accAddress = "vaga134pp6s2nv7pl4mxu58aeufdd6fv5s2zujrrmsa";
		const valoperAddress = "vagavaloper134pp6s2nv7pl4mxu58aeufdd6fv5s2zuvsgqsn";

		let result = VagaUtil.getAccAddressFromValOperAddress(valoperAddress);
		expect(result).to.be.equal(accAddress);
	})

	it('getFCTFromUFCTString test', async () => {

		let amountUFCT = 1000000;
		let fct = VagaUtil.getFCTStringFromUFCT(amountUFCT);

		expect(fct).to.be.equal("1");

		amountUFCT = 1234000;
		fct = VagaUtil.getFCTStringFromUFCT(amountUFCT);

		expect(fct).to.be.equal("1.234");
	})

	it('getUFCTStringFromFCT test', async () => {

		let amountUFCT = 1;
		let fct = VagaUtil.getUFCTStringFromFCT(amountUFCT);

		expect(fct).to.be.equal("1000000");

		amountUFCT = 1.23;
		fct = VagaUtil.getUFCTStringFromFCT(amountUFCT);

		expect(fct).to.be.equal("1230000");
	})

	it('getFCTFromUFCTString test', async () => {

		let amountUFCT = "1000000";
		let fct = VagaUtil.getFCTStringFromUFCTStr(amountUFCT);

		expect(fct).to.be.equal("1");

		amountUFCT = "1234000";
		fct = VagaUtil.getFCTStringFromUFCTStr(amountUFCT);

		expect(fct).to.be.equal("1.234");
	})

	it('getUFCTStringFromFCT test', async () => {

		let amountUFCT = "1";
		let fct = VagaUtil.getUFCTStringFromFCTStr(amountUFCT);

		expect(fct).to.be.equal("1000000");

		amountUFCT = "1.23";
		fct = VagaUtil.getUFCTStringFromFCTStr(amountUFCT);

		expect(fct).to.be.equal("1230000");
	})


	it('getTokenFromUTokenString test', async () => {

		const decimal = 6;

		let amountUToken = 1000000;
		let token = VagaUtil.getTokenStringFromUToken(amountUToken, decimal);

		expect(token).to.be.equal("1");

		amountUToken = 1234000;
		token = VagaUtil.getTokenStringFromUToken(amountUToken, decimal);

		expect(token).to.be.equal("1.234");
	})

	it('getUTokenStringFromToken test', async () => {

		const decimal = 6;

		let amountUToken = 1;
		let token = VagaUtil.getUTokenStringFromToken(amountUToken, decimal);

		expect(token).to.be.equal("1000000");

		amountUToken = 1.23;
		token = VagaUtil.getUTokenStringFromToken(amountUToken, decimal);

		expect(token).to.be.equal("1230000");
	})

	it('cutting the ufct decimal point test', async () => {

		const decimal = 6;
		
		const testUTokenValue = 533.827284;
		const testUTokenValueStr = "533.827284";

		const testTokenValueStr = "0.000533";

		expect(VagaUtil.getTokenStringFromUTokenStr(testUTokenValueStr, decimal)).to.be.equal(testTokenValueStr);
		expect(VagaUtil.getTokenStringFromUToken(testUTokenValue, decimal)).to.be.equal(testTokenValueStr);
	})


	it('cutting the decimal point test', async () => {

		const decimal = 6;
		
		const testTokenValue = 533.827284;
		const testTokenValueStr = "533.827284";
		const testUTokenValue = 533827284;
		const testUTokenValueStr = "533827284";

		expect(VagaUtil.getUTokenFromToken(testTokenValue, decimal)).to.be.equal(testUTokenValue);
		expect(VagaUtil.getUTokenStringFromTokenStr(testTokenValueStr, decimal)).to.be.equal(testUTokenValueStr);

		expect(VagaUtil.getTokenStringFromUTokenStr(testUTokenValueStr, decimal)).to.be.equal(testTokenValueStr);
		expect(VagaUtil.getTokenStringFromUToken(testUTokenValue, decimal)).to.be.equal(testTokenValueStr);
	})


	it('getTokenFromUTokenString test', async () => {

		const decimal = 6;

		let amountUToken = "1000000";
		let token = VagaUtil.getTokenStringFromUTokenStr(amountUToken, decimal);

		expect(token).to.be.equal("1");

		amountUToken = "1234000";
		token = VagaUtil.getTokenStringFromUTokenStr(amountUToken, decimal);

		expect(token).to.be.equal("1.234");
	})

	it('getUTokenStringFromToken test', async () => {

		const decimal = 6;

		let amountUToken = "1";
		let token = VagaUtil.getUTokenStringFromTokenStr(amountUToken, decimal);

		expect(token).to.be.equal("1000000");

		amountUToken = "1.23";
		token = VagaUtil.getUFCTStringFromFCTStr(amountUToken);

		expect(token).to.be.equal("1230000");
	})

	it('getFileHashFromBuffer test', async () => {

		let testString = "hello world";
		let enc = new TextEncoder();
		let buffer = enc.encode(testString);

		let hash = VagaUtil.getFileHashFromBuffer(buffer);

		// hash from sha256 online
		expect(hash).to.be.equal("b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");
	})
});