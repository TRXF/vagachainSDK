import { VagaConfig } from "../sdk/VagaConfig"

export let TestChainConfig: VagaConfig = {
	chainID: "imperium-2",
	rpcAddress: "http://127.0.0.1:26657",
	restApiAddress: "http://127.0.0.1:1317",
	ipfsNodeAddress: "ipfs-api-vaga-devnet.vagachain.org",
	ipfsNodePort: 5001,
	ipfsWebApiAddress: "https://ipfs-vaga-devnet.vagachain.org",
	hdPath: "m/44'/7777777'/",
	prefix: "vaga",
	denom: "ufct",
	isShowLog: true,
	defaultFee: 20000,
	defaultGas: 200000
}

//TestChainConfig = VagaConfig.DevNetConfig;

export const validatorMnemonic = "patrol three crash inmate myself soon hold merge tortoise leopard celery pill affair fall second print case ignore truly interest hammer mail short kit";
export const aliceMnemonic = "pizza venue kangaroo desert faculty circle benefit next snap buzz gas elite speed depart clown vicious country life game choice venture wealth shrimp fault";
export const bobMnemonic = "hope tip sick hour stamp submit coach crisp fragile plunge bargain print detect bitter lecture mouse addict until great barrel truck toilet chapter double";