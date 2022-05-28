import { TokenTxClient, TxMisc, TokenDataType, TokenQueryClient, Pagination } from "./vagachain/token";
import { VagaConfig } from "./VagaConfig";
import { VagaWalletService } from "./VagaWalletService";
import { DefaultTxMisc, VagaUtil, getSignAndBroadcastOption } from "./VagaUtil";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { BroadcastTxResponse } from "./vagachain/common/stargateclient";

export class TokenService {

    constructor(private readonly config: VagaConfig) { }

    async getGasEstimationCreateToken(wallet: VagaWalletService, tokenName: string, tokenSymbol: string, tokenURI: string, totalSupply: number, decimal: number, isMintable: boolean, isBurnable: boolean, txMisc: TxMisc = DefaultTxMisc):
        Promise<number> {

        try {
            const newTotalSupply = VagaUtil.getUTokenFromToken(totalSupply, decimal);

            const txRaw = await this.getSignedTxCreateToken(wallet, tokenName, tokenSymbol, tokenURI, newTotalSupply, decimal, isMintable, isBurnable, txMisc);
            return await VagaUtil.estimateGas(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getGasEstimationMint(wallet: VagaWalletService, tokenID: string, amount: number, decimal: number, toAddress: string, txMisc: TxMisc = DefaultTxMisc):
        Promise<number> {

        try {
            const newAmount = VagaUtil.getUTokenFromToken(amount, decimal);
            const txRaw = await this.getSignedTxMint(wallet, tokenID, amount, toAddress, txMisc);
            return await VagaUtil.estimateGas(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getGasEstimationBurn(wallet: VagaWalletService, tokenID: string, amount: number, decimal: number, txMisc: TxMisc = DefaultTxMisc): Promise<number> {

        try {
            const newAmount = VagaUtil.getUTokenFromToken(amount, decimal);
            const txRaw = await this.getSignedTxBurn(wallet, tokenID, newAmount, txMisc);
            return await VagaUtil.estimateGas(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getGasEstimationUpdateTokenURI(wallet: VagaWalletService, tokenID: string, tokenURI: string, txMisc: TxMisc = DefaultTxMisc): Promise<number> {

        try {
            const txRaw = await this.getSignedTxUpdateTokenURI(wallet, tokenID, tokenURI, txMisc);
            return await VagaUtil.estimateGas(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    private async getSignedTxUpdateTokenURI(wallet: VagaWalletService, tokenID: string, tokenURI: string, txMisc: TxMisc = DefaultTxMisc):
        Promise<TxRaw> {

        try {
            const address = await wallet.getAddress();

            const txClient = new TokenTxClient(wallet, this.config.rpcAddress);

            const message = txClient.msgUpdateTokenURI({
                owner: address,
                tokenID: tokenID,
                tokenURI: tokenURI
            });

            return await txClient.sign([message], getSignAndBroadcastOption(this.config.denom, txMisc));

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    private async getSignedTxBurn(wallet: VagaWalletService, tokenID: string, amount: number, txMisc: TxMisc = DefaultTxMisc):
        Promise<TxRaw> {

        try {
            const address = await wallet.getAddress();

            const txClient = new TokenTxClient(wallet, this.config.rpcAddress);

            const message = txClient.msgBurn({
                owner: address,
                tokenID: tokenID,
                amount: amount
            });

            return await txClient.sign([message], getSignAndBroadcastOption(this.config.denom, txMisc));

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    private async getSignedTxMint(wallet: VagaWalletService, tokenID: string, amount: number, toAddress: string, txMisc: TxMisc = DefaultTxMisc):
        Promise<TxRaw> {

        try {
            const address = await wallet.getAddress();

            const txClient = new TokenTxClient(wallet, this.config.rpcAddress);

            const message = txClient.msgMint({
                owner: address,
                tokenID: tokenID,
                amount: amount,
                toAddress: toAddress
            });

            return await txClient.sign([message], getSignAndBroadcastOption(this.config.denom, txMisc));

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    private async getSignedTxCreateToken(wallet: VagaWalletService, tokenName: string, tokenSymbol: string, tokenURI: string, totalSupply: number, decimal: number, isMintable: boolean, isBurnable: boolean, txMisc: TxMisc = DefaultTxMisc):
        Promise<TxRaw> {

        try {
            const address = await wallet.getAddress();

            const txClient = new TokenTxClient(wallet, this.config.rpcAddress);

            const message = txClient.msgCreateToken({
                owner: address,
                name: tokenName,
                symbol: tokenSymbol,
                tokenURI: tokenURI,
                totalSupply: totalSupply,
                decimal: decimal,
                mintable: isMintable,
                burnable: isBurnable
            });

            return await txClient.sign([message], getSignAndBroadcastOption(this.config.denom, txMisc));

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    //./vagachaind tx token mint ukai 1000000 vaga1jmg3kwy5hntx66nl93dyk2d92943394qsf6gcf  --from alice --fees 2000ufct --chain-id imperium-2

    async createToken(wallet: VagaWalletService, tokenName: string, tokenSymbol: string, tokenURI: string, totalSupply: number, decimal: number, isMintable: boolean, isBurnable: boolean, txMisc: TxMisc = DefaultTxMisc):
        Promise<BroadcastTxResponse> {

        try {

            const newTotalSupply = VagaUtil.getUTokenFromToken(totalSupply, decimal);
            const txRaw = await this.getSignedTxCreateToken(wallet, tokenName, tokenSymbol, tokenURI, newTotalSupply, decimal, isMintable, isBurnable, txMisc);

            const nftTxClient = new TokenTxClient(wallet, this.config.rpcAddress);
            return await nftTxClient.broadcast(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async mint(wallet: VagaWalletService, tokenID: string, amount: number, decimal: number, toAddress: string, txMisc: TxMisc = DefaultTxMisc):
        Promise<BroadcastTxResponse> {

        try {
            const newAmount = VagaUtil.getUTokenFromToken(amount, decimal);
            const txRaw = await this.getSignedTxMint(wallet, tokenID, newAmount, toAddress, txMisc);

            const nftTxClient = new TokenTxClient(wallet, this.config.rpcAddress);
            return await nftTxClient.broadcast(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async burn(wallet: VagaWalletService, tokenID: string, amount: number, decimal: number, txMisc: TxMisc = DefaultTxMisc):
        Promise<BroadcastTxResponse> {

        try {
            const newAmount = VagaUtil.getUTokenFromToken(amount, decimal);
            const txRaw = await this.getSignedTxBurn(wallet, tokenID, newAmount, txMisc);

            const nftTxClient = new TokenTxClient(wallet, this.config.rpcAddress);
            return await nftTxClient.broadcast(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async updateTokenURI(wallet: VagaWalletService, tokenID: string, tokenURI: string, txMisc: TxMisc = DefaultTxMisc):
        Promise<BroadcastTxResponse> {

        try {
            const txRaw = await this.getSignedTxUpdateTokenURI(wallet, tokenID, tokenURI, txMisc);

            const nftTxClient = new TokenTxClient(wallet, this.config.rpcAddress);
            return await nftTxClient.broadcast(txRaw);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }


    //  query
    async getGetTokenDataAll(paginationKey: string = ""): Promise<{ dataList: TokenDataType[], pagination: Pagination }> {
        try {

            const queryClient = new TokenQueryClient(this.config.restApiAddress);
            return await queryClient.queryTokenDataAll(paginationKey);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getTokenData(tokenID: string): Promise<TokenDataType> {

        try {
            const queryClient = new TokenQueryClient(this.config.restApiAddress);
            const tokenData = await queryClient.queryTokenData(tokenID);

            return tokenData;

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getTokenDataListFromOwner(ownerAddress: string): Promise<string[]> {

        try {
            const queryClient = new TokenQueryClient(this.config.restApiAddress);
            const tokenData = await queryClient.queryTokenDataFromOwner(ownerAddress);

            return tokenData;

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }
}