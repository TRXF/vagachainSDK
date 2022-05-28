import { BankTxClient, BankQueryClient, TxMisc, Token } from "./vagachain/bank";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";

import { VagaWalletService } from "./VagaWalletService";
import { VagaConfig } from "./VagaConfig";
import { DefaultTxMisc, VagaUtil, getSignAndBroadcastOption } from "./VagaUtil";
import { BroadcastTxResponse } from "./vagachain/common/stargateclient";

export class VagaBankService {

    constructor(private readonly config: VagaConfig) { }

    async getGasEstimationSend(wallet: VagaWalletService,
        targetAddress: string,
        amount: number,
        txMisc: TxMisc = DefaultTxMisc): Promise<number> {

        try {
            const txRaw = await this.getSignedTxSend(wallet, targetAddress, this.config.denom, VagaUtil.getUFCTStringFromFCT(amount), txMisc);
            return await VagaUtil.estimateGas(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getGasEstimationSendToken(wallet: VagaWalletService, targetAddress: string, tokenID: string, amount: number, decimal: number, txMisc: TxMisc = DefaultTxMisc): Promise<number> {

        try {
            const txRaw = await this.getSignedTxSend(wallet, targetAddress, tokenID, VagaUtil.getUTokenStringFromToken(amount, decimal), txMisc);
            return await VagaUtil.estimateGas(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async sendToken(wallet: VagaWalletService, targetAddress: string, tokenID: string, amount: number, decimal: number, txMisc: TxMisc = DefaultTxMisc):
        Promise<BroadcastTxResponse> {
        try {

            const txRaw = await this.getSignedTxSend(wallet, targetAddress, tokenID, VagaUtil.getUTokenStringFromToken(amount, decimal), txMisc);

            const bankTxClient = new BankTxClient(wallet, this.config.rpcAddress);
            return await bankTxClient.broadcast(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async send(wallet: VagaWalletService, targetAddress: string, amount: number, txMisc: TxMisc = DefaultTxMisc):
        Promise<BroadcastTxResponse> {
        try {
            const txRaw = await this.getSignedTxSend(wallet, targetAddress, this.config.denom, VagaUtil.getUFCTStringFromFCT(amount), txMisc);

            const bankTxClient = new BankTxClient(wallet, this.config.rpcAddress);
            return await bankTxClient.broadcast(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getTokenBalanceList(address: string): Promise<Token[]> {
        try {
            const bankQueryClient = new BankQueryClient(this.config.restApiAddress);
            const result = await bankQueryClient.queryBalanceList(address);

            let tokenList: Token[] = [];

            for (let i = 0; i < result.length; i++) {

                // ignore config.denom
                if (result[i].denom === this.config.denom)
                    continue;

                tokenList.push(result[i]);
            }

            return tokenList;

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getTokenBalance(address: string, tokenID: string): Promise<string> {
        try {
            const bankQueryClient = new BankQueryClient(this.config.restApiAddress);
            const result = await bankQueryClient.queryTokenBalance(address, tokenID);

            return result.amount;

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getBalance(address: string): Promise<string> {
        try {
            const bankQueryClient = new BankQueryClient(this.config.restApiAddress);
            const result = await bankQueryClient.queryBalance(address, this.config.denom);

            return result.amount;

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    private async getSignedTxSend(wallet: VagaWalletService,
        targetAddress: string,
        denom: string,
        amount: string,
        txMisc: TxMisc = DefaultTxMisc): Promise<TxRaw> {
        try {
            const bankTxClient = new BankTxClient(wallet, this.config.rpcAddress);

            const address = await wallet.getAddress();
            const sendAmount = { denom: denom, amount: amount };

            const message = bankTxClient.msgSend({ fromAddress: address, toAddress: targetAddress, amount: [sendAmount] });

            return await bankTxClient.sign([message], getSignAndBroadcastOption(this.config.denom, txMisc));

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }
}