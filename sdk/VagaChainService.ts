import { VagaConfig } from "./VagaConfig";
import { VagaUtil } from "./VagaUtil";
import { ChainSyncInfo, TendermintQueryClient, TransactionHash } from "./vagachain/common/TendermintQueryClient";

export class ChainService {
    constructor(private readonly config: VagaConfig) { }

    async getChainSyncInfo(): Promise<ChainSyncInfo> {
        try {
            const queryClient = new TendermintQueryClient(this.config.rpcAddress);
            return await queryClient.queryChainSyncInfo();

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getTransactionByHash(txHash: string): Promise<TransactionHash> {
        try {
            const queryClient = new TendermintQueryClient(this.config.rpcAddress);
            return await queryClient.queryTransactionHash(txHash);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }
}