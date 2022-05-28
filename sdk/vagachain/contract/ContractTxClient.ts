import { Registry, EncodeObject, OfflineDirectSigner } from "@cosmjs/proto-signing";
import { MsgCreateContractFile, MsgAddContractLog } from "./ContractTxTypes";
import { ITxClient } from "../common/ITxClient";
import { VagaWalletService } from "../../VagaWalletService";

const types = [
    ["/vagachain.vagachain.contract.MsgCreateContractFile", MsgCreateContractFile],
    ["/vagachain.vagachain.contract.MsgAddContractLog", MsgAddContractLog]
];

const registry = new Registry(types as any);

export interface MsgAddContractLogEncodeObject extends EncodeObject {
    readonly typeUrl: "/vagachain.vagachain.contract.MsgAddContractLog";
    readonly value: Partial<MsgAddContractLog>;
}

export interface MsgCreateContractFileEncodeObject extends EncodeObject {
    readonly typeUrl: "/vagachain.vagachain.contract.MsgCreateContractFile";
    readonly value: Partial<MsgCreateContractFile>;
}

export class ContractTxClient extends ITxClient {

    constructor(wallet: VagaWalletService, serverUrl: string) {
        super(wallet, serverUrl, registry);
    }

    msgAddContractLog(data: MsgAddContractLog): MsgAddContractLogEncodeObject {
        return { typeUrl: "/vagachain.vagachain.contract.MsgAddContractLog", value: data };
    }

    msgCreateContractFile(data: MsgCreateContractFile): MsgCreateContractFileEncodeObject {
        return { typeUrl: "/vagachain.vagachain.contract.MsgCreateContractFile", value: data };
    }
}