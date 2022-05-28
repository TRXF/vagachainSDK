import {
    DistributionTxClient,
    DistributionQueryClient,
    TxMisc,
    TotalRewardInfo,
    MsgWithdrawDelegatorRewardEncodeObject
} from "./vagachain/distribution";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";

import { VagaWalletService } from "./VagaWalletService";
import { VagaConfig } from "./VagaConfig";
import { DefaultTxMisc, VagaUtil, getSignAndBroadcastOption } from "./VagaUtil";
import { BroadcastTxResponse } from "./vagachain/common/stargateclient";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { DelegationInfo } from "./vagachain/staking";

export class VagaDistributionService {

    constructor(private readonly config: VagaConfig) { }

    async getGasEstimationSetWithdrawAddress(wallet: VagaWalletService,
        withdrawAddress: string,
        txMisc: TxMisc = DefaultTxMisc):
        Promise<number> {

        try {
            const txRaw = await this.getSignedTxSetWithdrawAddress(wallet, withdrawAddress, txMisc);
            return await VagaUtil.estimateGas(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getGasEstimationFundCommunityPool(wallet: VagaWalletService,
        amount: number,
        txMisc: TxMisc = DefaultTxMisc):
        Promise<number> {

        try {
            const txRaw = await this.getSignedTxFundCommunityPool(wallet, amount, txMisc);
            return await VagaUtil.estimateGas(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getGasEstimationWithdrawValidatorCommission(wallet: VagaWalletService,
        validatorAddress: string,
        txMisc: TxMisc = DefaultTxMisc):
        Promise<number> {

        try {
            const txRaw = await this.getSignedTxWithdrawValidatorCommission(wallet, validatorAddress, txMisc);
            return await VagaUtil.estimateGas(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getGasEstimationWithdrawAllRewardsFromAllValidator(wallet: VagaWalletService, delegationList: DelegationInfo[], txMisc: TxMisc = DefaultTxMisc): Promise<number> {

        try {
            const txRaw = await this.getSignedTxwithdrawAllRewardsFromAllValidator(wallet, delegationList, txMisc);
            return await VagaUtil.estimateGas(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }


    async getGasEstimationWithdrawAllRewards(wallet: VagaWalletService,
        validatorAddress: string,
        txMisc: TxMisc = DefaultTxMisc):
        Promise<number> {

        try {
            const txRaw = await this.getSignedTxWithdrawAllRewards(wallet, validatorAddress, txMisc);
            return await VagaUtil.estimateGas(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    private async getSignedTxWithdrawAllRewards(wallet: VagaWalletService,
        validatorAddress: string,
        txMisc: TxMisc = DefaultTxMisc): Promise<TxRaw> {

        try {
            const txClient = new DistributionTxClient(wallet, this.config.rpcAddress);

            const address = await wallet.getAddress();
            const message = txClient.msgWithdrawDelegatorReward({ delegatorAddress: address, validatorAddress: validatorAddress });

            return await txClient.sign([message], getSignAndBroadcastOption(this.config.denom, txMisc));

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    private async getSignedTxSetWithdrawAddress(wallet: VagaWalletService,
        withdrawAddress: string,
        txMisc: TxMisc = DefaultTxMisc): Promise<TxRaw> {
        try {
            const txClient = new DistributionTxClient(wallet, this.config.rpcAddress);

            const address = await wallet.getAddress();
            const message =
                txClient.msgSetWithdrawAddress({ delegatorAddress: address, withdrawAddress: withdrawAddress });

            return await txClient.sign([message], getSignAndBroadcastOption(this.config.denom, txMisc));

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    private async getSignedTxFundCommunityPool(wallet: VagaWalletService,
        amount: number,
        txMisc: TxMisc = DefaultTxMisc): Promise<TxRaw> {

        try {
            const txClient = new DistributionTxClient(wallet, this.config.rpcAddress);

            const address = await wallet.getAddress();
            const sendAmount = { denom: this.config.denom, amount: VagaUtil.getUFCTStringFromFCT(amount) };

            const message = txClient.msgFundCommunityPool({ depositor: address, amount: [sendAmount] });

            return await txClient.sign([message], getSignAndBroadcastOption(this.config.denom, txMisc));

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    private async getSignedTxWithdrawValidatorCommission(wallet: VagaWalletService,
        validatorAddres: string,
        txMisc: TxMisc = DefaultTxMisc): Promise<TxRaw> {

        try {
            const txClient = new DistributionTxClient(wallet, this.config.rpcAddress);

            const message = txClient.msgWithdrawValidatorCommission({ validatorAddress: validatorAddres });

            return await txClient.sign([message], getSignAndBroadcastOption(this.config.denom, txMisc));

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async setWithdrawAddress(wallet: VagaWalletService, withdrawAddress: string, txMisc: TxMisc = DefaultTxMisc):
        Promise<BroadcastTxResponse> {
        try {
            const txRaw = await this.getSignedTxSetWithdrawAddress(wallet, withdrawAddress, txMisc);

            const txClient = new DistributionTxClient(wallet, this.config.rpcAddress);
            return await txClient.broadcast(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async fundCommunityPool(wallet: VagaWalletService, amount: number, txMisc: TxMisc = DefaultTxMisc):
        Promise<BroadcastTxResponse> {
        try {
            const txRaw = await this.getSignedTxFundCommunityPool(wallet, amount, txMisc);

            const txClient = new DistributionTxClient(wallet, this.config.rpcAddress);
            return await txClient.broadcast(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }



    async withdrawValidatorCommission(wallet: VagaWalletService,
        validatorAddres: string,
        txMisc: TxMisc = DefaultTxMisc): Promise<BroadcastTxResponse> {
        try {
            const txRaw = await this.getSignedTxWithdrawValidatorCommission(wallet, validatorAddres, txMisc);

            const txClient = new DistributionTxClient(wallet, this.config.rpcAddress);
            return await txClient.broadcast(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    private async getSignedTxwithdrawAllRewardsFromAllValidator(wallet: VagaWalletService,
        delegationList: DelegationInfo[],
        txMisc: TxMisc = DefaultTxMisc): Promise<TxRaw> {

        try {

            const address = await wallet.getAddress();

            const txClient = new DistributionTxClient(wallet, this.config.rpcAddress);

            let messageList: MsgWithdrawDelegatorRewardEncodeObject[] = [];

            for (let i = 0; i < delegationList.length; i++) {

                const validatorAddress = delegationList[i].delegation.validator_address;
                const message = txClient.msgWithdrawDelegatorReward({ delegatorAddress: address, validatorAddress: validatorAddress });

                messageList.push(message);
            }

            return await txClient.sign(messageList, getSignAndBroadcastOption(this.config.denom, txMisc));

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }


    async withdrawAllRewardsFromAllValidator(wallet: VagaWalletService, delegationList: DelegationInfo[], txMisc: TxMisc = DefaultTxMisc):
        Promise<BroadcastTxResponse> {
        try {

            const txRaw = await this.getSignedTxwithdrawAllRewardsFromAllValidator(wallet, delegationList, txMisc);

            const txClient = new DistributionTxClient(wallet, this.config.rpcAddress);
            return await txClient.broadcast(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async withdrawAllRewards(wallet: VagaWalletService, validatorAddress: string, txMisc: TxMisc = DefaultTxMisc):
        Promise<BroadcastTxResponse> {
        try {
            const txRaw = await this.getSignedTxWithdrawAllRewards(wallet, validatorAddress, txMisc);

            const txClient = new DistributionTxClient(wallet, this.config.rpcAddress);
            return await txClient.broadcast(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    // query
    // 

    async getRewardInfo(address: string, validatorAddress: string): Promise<string> {
        try {
            const queryClient = new DistributionQueryClient(this.config.restApiAddress);
            const result = await queryClient.queryGetRewardInfo(address, validatorAddress);

            return result;

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getValidatorOutStandingReward(validatorAddress: string): Promise<Coin[]> {
        try {
            const queryClient = new DistributionQueryClient(this.config.restApiAddress);
            const result = await queryClient.queryGetValidatorOutStandingReward(validatorAddress);

            return result;

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getValidatorCommission(validatorAddress: string): Promise<Coin[]> {
        try {
            const queryClient = new DistributionQueryClient(this.config.restApiAddress);
            const result = await queryClient.queryGetValidatorCommission(validatorAddress);

            return result;

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getTotalRewardInfo(address: string): Promise<TotalRewardInfo> {
        try {
            const queryClient = new DistributionQueryClient(this.config.restApiAddress);
            const result = await queryClient.queryGetTotalRewardInfo(address);

            return result;

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getCommunityPool(): Promise<string> {
        try {
            const queryClient = new DistributionQueryClient(this.config.restApiAddress);
            const result = await queryClient.queryGetCommunityPool();

            return result;

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getWithdrawAddress(address: string): Promise<string> {
        try {
            const queryClient = new DistributionQueryClient(this.config.restApiAddress);
            const result = await queryClient.queryGetWithdrawAddress(address);

            return result;

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }
}