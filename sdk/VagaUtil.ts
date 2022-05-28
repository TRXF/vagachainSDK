import { promises as fs } from "fs";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { TendermintQueryClient } from "./vagachain/common/TendermintQueryClient";
import { VagaConfig } from "./VagaConfig";

import { Bech32 } from "@cosmjs/encoding";
import { LedgerSigningStargateClient, SignerData } from "./vagachain/common/LedgerSigningStargateClient";
import { SignAndBroadcastOptions, TxMisc } from "./vagachain/common";

const CryptoJS = require("crypto-js");
const sha1 = require("crypto-js/sha1");
const sha256 = require("crypto-js/sha256");
const encHex = require("crypto-js/enc-hex");

export class VagaUtil {

    static config: VagaConfig;

    static readonly FctDecimal: number = 6;

    constructor(vagaConfig: VagaConfig) {
        VagaUtil.config = vagaConfig;
    }

    static getSignAndBroadcastOption(denom: string, txMisc: TxMisc): SignAndBroadcastOptions {

        if (txMisc.memo == null)
            txMisc.memo = "";

        // INFO: if fee or gas data is not set default, those value will be null. So we have to double check it.

        if (txMisc.fee == 0 || txMisc.fee == null)
            txMisc.fee = VagaUtil.config.defaultFee;
        if (txMisc.gas == 0 || txMisc.gas == null)
            txMisc.gas = VagaUtil.config.defaultGas;
        if (txMisc.feeGranter == null)
            txMisc.feeGranter = "";
    
        const gasFeeAmount = { denom: denom, amount: txMisc.fee!.toString() };
        const defaultFee = { amount: [gasFeeAmount], gas: txMisc.gas!.toString(), granter: txMisc.feeGranter! };
    
        return { fee: defaultFee, memo: txMisc.memo! };
    }

    static getUTokenStringFromTokenStr(tokenAmount: string, decimal: number): string {
        const fct = Number.parseFloat(tokenAmount);
        const decimalMutiplyer = Math.pow(10, decimal);
        const big = fct * decimalMutiplyer;

        return big.toFixed(0);
    }

    static getTokenStringFromUTokenStr(uTokenAmount: string, decimal: number): string {
        const ufct = Number.parseInt(uTokenAmount);
        const decimalMutiplyer = Math.pow(10, decimal);

        return (ufct / decimalMutiplyer).toString();
    }

    static getUTokenStringFromToken(tokenAmount: number, decimal: number): string {
        const decimalMutiplyer = Math.pow(10, decimal);
        const big = tokenAmount * decimalMutiplyer;

        return big.toFixed(0);
    }

    static getUTokenFromToken(tokenAmount: number, decimal: number): number {
        const decimalMutiplyer = Math.pow(10, decimal);
        const big = tokenAmount * decimalMutiplyer;
        const newBig = big.toFixed(0);

        return Number.parseInt(newBig);
    }

    static getTokenStringFromUToken(uTokenAmount: number, decimal: number): string {

        const fixedUTokenAmount = Math.floor(uTokenAmount);

        const decimalMutiplyer = Math.pow(10, decimal);
        return (fixedUTokenAmount / decimalMutiplyer).toString();
    }

    static getUFCTStringFromFCTStr(fctAmount: string): string {
        return this.getUTokenStringFromTokenStr(fctAmount, this.FctDecimal);
    }

    static getFCTStringFromUFCTStr(uFctAmount: string): string {
        return this.getTokenStringFromUTokenStr(uFctAmount, this.FctDecimal);
    }

    static getUFCTStringFromFCT(fctAmount: number): string {
        return this.getUTokenStringFromToken(fctAmount, this.FctDecimal);
    }

    static getFCTStringFromUFCT(uFctAmount: number): string {
        return this.getTokenStringFromUToken(uFctAmount, this.FctDecimal);
    }

    static async getFileHash(filePath: string): Promise<string> {
        const fileData = await fs.readFile(filePath);
        const data = CryptoJS.lib.WordArray.create(fileData.buffer);

        return sha256(data).toString(encHex);
    }

    static getFileHashFromBuffer(buffer: Uint8Array): string {
        const data = CryptoJS.lib.WordArray.create(buffer);
        return sha256(data).toString(encHex);
    }

    static getSha1HashFromString(text: string): string {
        const data = CryptoJS.lib.WordArray.create(text);
        return sha1(data).toString(encHex);
    }

    static getHashFromString(text: string): string {
        const data = CryptoJS.lib.WordArray.create(text);
        return sha256(data).toString(encHex);
    }


    static isValidAddress(address: string): boolean {

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            Bech32.decode(address).data;
            return true;
        }
        catch (e) {

        }

        return false;
    }

    static getValOperAddressFromAccAddress(address: string): string {
        const data = Bech32.decode(address).data;
        return Bech32.encode(VagaUtil.config.prefix + "valoper", data);
    }

    static getAccAddressFromValOperAddress(address: string): string {
        const data = Bech32.decode(address).data;
        return Bech32.encode(VagaUtil.config.prefix, data);
    }

    static async getSignerDataForLedger(address: string): Promise<SignerData> {

        try {

            let signingClient = await LedgerSigningStargateClient.connectWithSigner(VagaUtil.config.rpcAddress);
            let sequence = await signingClient.getSignerData(address);

            return sequence;

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    static async estimateGas(txRaw: TxRaw): Promise<number> {

        try {
            const encodedTx = Uint8Array.from(TxRaw.encode(txRaw).finish());
            const hexTx = `0x${Buffer.from(encodedTx).toString("hex")}`;

            const queryClient = new TendermintQueryClient(VagaUtil.config.rpcAddress);
            const gas = await queryClient.queryEstimateGas(hexTx);

            const multiplier = 1.25;

            return Math.ceil(gas * multiplier);
        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    static async estimateGasRaw(txRaw: Uint8Array): Promise<number> {

        try {
            const encodedTx = Uint8Array.from(txRaw);
            const hexTx = `0x${Buffer.from(encodedTx).toString("hex")}`;

            console.log("hexTx:" + hexTx);

            const queryClient = new TendermintQueryClient(VagaUtil.config.rpcAddress);
            const gas = await queryClient.queryEstimateGas(hexTx);

            const multiplier = 1.25;

            return Math.ceil(gas * multiplier);
        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    static printLog(log: any) {
        if (VagaUtil.config.isShowLog === false)
            return;

        console.log(`[VagaSDK] ${log}`);
    }
}

export const DefaultTxMisc = { memo: "", fee: 0, gas: 0, feeGranter: "" };
export const getSignAndBroadcastOption = VagaUtil.getSignAndBroadcastOption;