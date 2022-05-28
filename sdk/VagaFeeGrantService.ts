import {
    FeeGrantTxClient,
    TxMisc,
    DefaultBasicFeeGrantOption,
    BasicFeeGrantOption,
    PeriodicFeeGrantOption
} from "./vagachain/feegrant";
import { VagaWalletService } from "./VagaWalletService";
import { VagaConfig } from "./VagaConfig";
import { DefaultTxMisc, VagaUtil, getSignAndBroadcastOption } from "./VagaUtil";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { BasicAllowance, PeriodicAllowance } from "./vagachain/feegrant/FeeGrantTxTypes";
import { FeeAllowanceType, FeeAllowanceType1, FeeGrantQueryClient } from "./vagachain/feegrant/FeeGrantQueryClient";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { BroadcastTxResponse } from "./vagachain/common/stargateclient";
import { Any } from "./vagachain/google/protobuf/any";

export class VagaFeeGrantService {

    constructor(private readonly config: VagaConfig) { }

    async getGasEstimationRevokeAllowance(wallet: VagaWalletService,
        granteeAddress: string,
        txMisc: TxMisc = DefaultTxMisc): Promise<number> {

        try {
            const txRaw = await this.getSignedTxRevokeAllowance(wallet,
                granteeAddress,
                txMisc);

            return await VagaUtil.estimateGas(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    private async getSignedTxRevokeAllowance(wallet: VagaWalletService,
        granteeAddress: string,
        txMisc: TxMisc = DefaultTxMisc): Promise<TxRaw> {

        try {
            const address = await wallet.getAddress();

            const feeGrantTxClient = new FeeGrantTxClient(wallet, this.config.rpcAddress);
            const message = feeGrantTxClient.msgRevokeAllowance({ granter: address, grantee: granteeAddress });

            return await feeGrantTxClient.sign([message], getSignAndBroadcastOption(this.config.denom, txMisc));

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async revokeAllowance(wallet: VagaWalletService, granteeAddress: string, txMisc: TxMisc = DefaultTxMisc):
        Promise<BroadcastTxResponse> {

        try {
            const txRaw = await this.getSignedTxRevokeAllowance(wallet, granteeAddress, txMisc);

            const feeGrantTxClient = new FeeGrantTxClient(wallet, this.config.rpcAddress);
            return await feeGrantTxClient.broadcast(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    private getCoinType(amount?: number): Coin[] {

        if (amount == undefined)
            return [];

        return [{ denom: this.config.denom, amount: amount!.toString() }];
    }

    async getGasEstimationGrantPeriodicAllowance(wallet: VagaWalletService,
        granteeAddress: string,
        feegrantOption: PeriodicFeeGrantOption,
        txMisc: TxMisc = DefaultTxMisc): Promise<number> {

        try {
            const txRaw = await this.getSignedTxGrantPeriodicAllowance(wallet,
                granteeAddress,
                feegrantOption,
                txMisc);
            return await VagaUtil.estimateGas(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    private async getSignedTxGrantPeriodicAllowance(wallet: VagaWalletService,
        granteeAddress: string,
        feegrantOption: PeriodicFeeGrantOption,
        txMisc: TxMisc = DefaultTxMisc): Promise<TxRaw> {

        try {
            const address = await wallet.getAddress();

            const feeGrantTxClient = new FeeGrantTxClient(wallet, this.config.rpcAddress);

            const periodicAllowanceData = {
                basic: {
                    spendLimit: this.getCoinType(feegrantOption.basicSpendLimit),
                    expiration: feegrantOption.basicExpiration
                },
                period: { seconds: feegrantOption.periodSeconds, nanos: 0 },
                periodSpendLimit: [{ denom: this.config.denom, amount: feegrantOption.periodSpendLimit.toString() }],
                periodCanSpend: [{ denom: this.config.denom, amount: feegrantOption.periodCanSpend.toString() }],
                periodReset: feegrantOption.periodReset
            };

            const bytes = PeriodicAllowance.encode(periodicAllowanceData).finish();

            const allowanceAnyData = {
                typeUrl: "/cosmos.feegrant.v1beta1.PeriodicAllowance",
                value: bytes
            };

            const message = feeGrantTxClient.msgGrantAllowance({
                granter: address,
                grantee: granteeAddress,
                allowance: Any.fromJSON(allowanceAnyData)
            });

            return await feeGrantTxClient.sign([message], getSignAndBroadcastOption(this.config.denom, txMisc));

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getGasEstimationGrantBasicAllowance(wallet: VagaWalletService,
        granteeAddress: string,
        feegrantOption: BasicFeeGrantOption = DefaultBasicFeeGrantOption,
        txMisc: TxMisc = DefaultTxMisc): Promise<number> {

        try {
            const txRaw = await this.getSignedTxGrantBasicAllowance(wallet,
                granteeAddress,
                feegrantOption,
                txMisc);
            return await VagaUtil.estimateGas(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    private async getSignedTxGrantBasicAllowance(wallet: VagaWalletService,
        granteeAddress: string,
        feegrantOption: BasicFeeGrantOption = DefaultBasicFeeGrantOption,
        txMisc: TxMisc = DefaultTxMisc): Promise<TxRaw> {

        try {
            const feeGrantTxClient = new FeeGrantTxClient(wallet, this.config.rpcAddress);

            const address = await wallet.getAddress();

            const basicAllowanceData = {
                spendLimit: this.getCoinType(feegrantOption.spendLimit),
                expiration: feegrantOption.expiration
            };

            const bytes = BasicAllowance.encode(basicAllowanceData).finish();

            const allowanceAnyData = {
                typeUrl: "/cosmos.feegrant.v1beta1.BasicAllowance",
                value: bytes
            };


            //console.log('Any.fromJSON(allowanceAnyData)');
            //console.log(Any.fromJSON(allowanceAnyData));
            //console.log('Any.fromJSON(allowanceAnyData)---');

            const message = feeGrantTxClient.msgGrantAllowance({
                granter: address,
                grantee: granteeAddress,
                allowance: Any.fromJSON(allowanceAnyData)
            });

            return await feeGrantTxClient.sign([message], getSignAndBroadcastOption(this.config.denom, txMisc));

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async grantPeriodicAllowance(wallet: VagaWalletService,
        granteeAddress: string,
        feegrantOption: PeriodicFeeGrantOption,
        txMisc: TxMisc = DefaultTxMisc): Promise<BroadcastTxResponse> {

        try {
            const txRaw = await this.getSignedTxGrantPeriodicAllowance(wallet, granteeAddress, feegrantOption, txMisc);

            const feeGrantTxClient = new FeeGrantTxClient(wallet, this.config.rpcAddress);
            return await feeGrantTxClient.broadcast(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }


    async grantBasicAllowance(wallet: VagaWalletService,
        granteeAddress: string,
        feegrantOption: BasicFeeGrantOption = DefaultBasicFeeGrantOption,
        txMisc: TxMisc = DefaultTxMisc): Promise<BroadcastTxResponse> {
        try {
            const txRaw = await this.getSignedTxGrantBasicAllowance(wallet, granteeAddress, feegrantOption, txMisc);

            const feeGrantTxClient = new FeeGrantTxClient(wallet, this.config.rpcAddress);
            return await feeGrantTxClient.broadcast(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    // query
    async getGranteeAllowance(granterAddress: string, granteeAddress: string): Promise<FeeAllowanceType1> {
        try {
            const queryClient = new FeeGrantQueryClient(this.config.restApiAddress);
            const result = await queryClient.getGranteeAllowance(granterAddress, granteeAddress);

            return result;

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getGranteeAllowanceAll(granteeAddress: string): Promise<FeeAllowanceType[]> {
        try {
            const queryClient = new FeeGrantQueryClient(this.config.restApiAddress);
            const result = await queryClient.getGranteeAllowanceAll(granteeAddress);

            return result;

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }
}