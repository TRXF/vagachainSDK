import { Registry, OfflineDirectSigner, EncodeObject } from "@cosmjs/proto-signing";
import { MsgTransfer, MsgMint, MsgBurn } from "./NftTxTypes";
import { ITxClient } from "../common/ITxClient";
import { VagaWalletService } from "../../VagaWalletService";

const types = [
    ["/vagachain.vagachain.nft.MsgTransfer", MsgTransfer],
    ["/vagachain.vagachain.nft.MsgMint", MsgMint],
    ["/vagachain.vagachain.nft.MsgBurn", MsgBurn]
];

const registry = new Registry(types as any);

export interface MsgTransferEncodeObject extends EncodeObject {
    readonly typeUrl: "/vagachain.vagachain.nft.MsgTransfer";
    readonly value: Partial<MsgTransfer>;
}

export interface MsgMintEncodeObject extends EncodeObject {
    readonly typeUrl: "/vagachain.vagachain.nft.MsgMint";
    readonly value: Partial<MsgMint>;
}

export interface MsgBurnEncodeObject extends EncodeObject {
    readonly typeUrl: "/vagachain.vagachain.nft.MsgBurn";
    readonly value: Partial<MsgBurn>;
}

export class NftTxClient extends ITxClient {

    constructor(wallet: VagaWalletService, serverUrl: string) {
        super(wallet, serverUrl, registry);
    }

    msgTransfer(data: MsgTransfer): MsgTransferEncodeObject {
        return { typeUrl: "/vagachain.vagachain.nft.MsgTransfer", value: data };
    }

    msgMint(data: MsgMint): MsgMintEncodeObject {
        return { typeUrl: "/vagachain.vagachain.nft.MsgMint", value: data };
    }

    msgBurn(data: MsgBurn): MsgBurnEncodeObject {
        return { typeUrl: "/vagachain.vagachain.nft.MsgBurn", value: data };
    }
}