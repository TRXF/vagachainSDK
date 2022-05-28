import { Registry, OfflineDirectSigner, EncodeObject } from "@cosmjs/proto-signing";
import { MsgUpdateTokenURI, MsgMint, MsgBurn, MsgCreateToken } from "./TokenTxTypes";
import { ITxClient } from "../common/ITxClient";
import { VagaWalletService } from "../../VagaWalletService";

const types = [
    ["/vagachain.vagachain.token.MsgCreateToken", MsgCreateToken],
    ["/vagachain.vagachain.token.MsgUpdateTokenURI", MsgUpdateTokenURI],
    ["/vagachain.vagachain.token.MsgMint", MsgMint],
    ["/vagachain.vagachain.token.MsgBurn", MsgBurn]
];

const registry = new Registry(types as any);

export interface MsgCreateTokenEncodeObject extends EncodeObject {
    readonly typeUrl: "/vagachain.vagachain.token.MsgCreateToken";
    readonly value: Partial<MsgCreateToken>;
}

export interface MsgUpdateTokenURIEncodeObject extends EncodeObject {
    readonly typeUrl: "/vagachain.vagachain.token.MsgUpdateTokenURI";
    readonly value: Partial<MsgUpdateTokenURI>;
}

export interface MsgMintEncodeObject extends EncodeObject {
    readonly typeUrl: "/vagachain.vagachain.token.MsgMint";
    readonly value: Partial<MsgMint>;
}

export interface MsgBurnEncodeObject extends EncodeObject {
    readonly typeUrl: "/vagachain.vagachain.token.MsgBurn";
    readonly value: Partial<MsgBurn>;
}

export class TokenTxClient extends ITxClient {

    constructor(wallet: VagaWalletService, serverUrl: string) {
        super(wallet, serverUrl, registry);
    }

    msgCreateToken(data: MsgCreateToken): MsgCreateTokenEncodeObject {
        return { typeUrl: "/vagachain.vagachain.token.MsgCreateToken", value: data };
    }

    msgUpdateTokenURI(data: MsgUpdateTokenURI): MsgUpdateTokenURIEncodeObject {
        return { typeUrl: "/vagachain.vagachain.token.MsgUpdateTokenURI", value: data };
    }

    msgMint(data: MsgMint): MsgMintEncodeObject {
        return { typeUrl: "/vagachain.vagachain.token.MsgMint", value: data };
    }

    msgBurn(data: MsgBurn): MsgBurnEncodeObject {
        return { typeUrl: "/vagachain.vagachain.token.MsgBurn", value: data };
    }
}