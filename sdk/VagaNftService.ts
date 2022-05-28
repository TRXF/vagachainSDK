import { NftTxClient, NftQueryClient, NftItemType, Pagination, TxMisc } from "./vagachain/nft";
import { VagaConfig } from "./VagaConfig";
import { VagaWalletService } from "./VagaWalletService";
import { DefaultTxMisc, VagaUtil, getSignAndBroadcastOption } from "./VagaUtil";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { BroadcastTxResponse } from "./vagachain/common/stargateclient";

export class NftService {

    constructor(private readonly config: VagaConfig) { }

    async getNftItemAll(paginationKey: string = ""): Promise<{ dataList: NftItemType[], pagination: Pagination }> {
        try {

            const nftQueryClient = new NftQueryClient(this.config.restApiAddress);
            return await nftQueryClient.queryNftItemAll(paginationKey);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getNftItem(nftId: string): Promise<NftItemType> {

        try {
            const nftQueryClient = new NftQueryClient(this.config.restApiAddress);
            const nftItem = await nftQueryClient.queryNftItem(nftId);

            return nftItem;

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getNftItemAllFromAddress(ownerAddress: string, paginationKey: string = ""): Promise<{
        dataList: NftItemType[],
        pagination: Pagination;
    }> {

        try {

            let result = await this.getNftIdListOfOwner(ownerAddress, paginationKey)

            const nftItemList: NftItemType[] = [];
            const nftQueryClient = new NftQueryClient(this.config.restApiAddress);

            for (let i = 0; i < result.nftIdList.length; i++) {
                const nftItem = await nftQueryClient.queryNftItem(result.nftIdList[i]);
                nftItemList.push(nftItem);
            }

            return { dataList: nftItemList, pagination: { next_key: result.pagination.next_key, total: result.pagination.total} };

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }

    }

    async getNftIdListOfOwner(ownerAddress: string, paginationKey: string = ""): Promise<{
        nftIdList: string[],
        pagination: Pagination;
    }> {

        try {
            const nftQueryClient = new NftQueryClient(this.config.restApiAddress);
            return await nftQueryClient.queryNftIdListOfOwner(ownerAddress, paginationKey);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getBalanceOf(ownerAddress: string): Promise<number> {

        try {
            const nftQueryClient = new NftQueryClient(this.config.restApiAddress);
            const total = await nftQueryClient.queryBalanceOf(ownerAddress);
            return parseInt(total);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getGasEstimationTransfer(wallet: VagaWalletService,
        toAddress: string,
        nftID: string,
        txMisc: TxMisc = DefaultTxMisc): Promise<number> {

        try {
            const txRaw = await this.getSignedTxTransfer(wallet, toAddress, nftID, txMisc);
            return await VagaUtil.estimateGas(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    private async getSignedTxTransfer(wallet: VagaWalletService,
        toAddress: string,
        nftID: string,
        txMisc: TxMisc = DefaultTxMisc): Promise<TxRaw> {

        try {
            const address = await wallet.getAddress();

            const nftTxClient = new NftTxClient(wallet, this.config.rpcAddress);
            const message = nftTxClient.msgTransfer({ owner: address, toAddress: toAddress, nftId: parseInt(nftID) });
            return await nftTxClient.sign([message], getSignAndBroadcastOption(this.config.denom, txMisc));

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async transfer(wallet: VagaWalletService, toAddress: string, nftID: string, txMisc: TxMisc = DefaultTxMisc):
        Promise<BroadcastTxResponse> {

        try {
            const txRaw = await this.getSignedTxTransfer(wallet, toAddress, nftID, txMisc);

            const nftTxClient = new NftTxClient(wallet, this.config.rpcAddress);
            return await nftTxClient.broadcast(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getGasEstimationBurn(wallet: VagaWalletService, nftID: string, txMisc: TxMisc = DefaultTxMisc):
        Promise<number> {

        try {
            const txRaw = await this.getSignedTxBurn(wallet, nftID, txMisc);
            return await VagaUtil.estimateGas(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    private async getSignedTxBurn(wallet: VagaWalletService, nftID: string, txMisc: TxMisc = DefaultTxMisc):
        Promise<TxRaw> {

        try {
            const address = await wallet.getAddress();
            const nftTxClient = new NftTxClient(wallet, this.config.rpcAddress);

            const message = nftTxClient.msgBurn({ owner: address, nftId: parseInt(nftID) });
            return await nftTxClient.sign([message], getSignAndBroadcastOption(this.config.denom, txMisc));

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }


    async burn(wallet: VagaWalletService, nftID: string, txMisc: TxMisc = DefaultTxMisc):
        Promise<BroadcastTxResponse> {

        try {
            const txRaw = await this.getSignedTxBurn(wallet, nftID, txMisc);

            const nftTxClient = new NftTxClient(wallet, this.config.rpcAddress);
            return await nftTxClient.broadcast(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getGasEstimationMint(wallet: VagaWalletService, tokenURI: string, txMisc: TxMisc = DefaultTxMisc):
        Promise<number> {

        try {
            const txRaw = await this.getSignedTxMint(wallet, tokenURI, txMisc);
            return await VagaUtil.estimateGas(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    private async getSignedTxMint(wallet: VagaWalletService, tokenURI: string, txMisc: TxMisc = DefaultTxMisc):
        Promise<TxRaw> {

        try {
            const address = await wallet.getAddress();

            const nftTxClient = new NftTxClient(wallet, this.config.rpcAddress);

            const message = nftTxClient.msgMint({ owner: address, tokenURI: tokenURI });
            return await nftTxClient.sign([message], getSignAndBroadcastOption(this.config.denom, txMisc));

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async mint(wallet: VagaWalletService, tokenURI: string, txMisc: TxMisc = DefaultTxMisc):
        Promise<BroadcastTxResponse> {

        try {
            const txRaw = await this.getSignedTxMint(wallet, tokenURI, txMisc);

            const nftTxClient = new NftTxClient(wallet, this.config.rpcAddress);
            return await nftTxClient.broadcast(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }
}