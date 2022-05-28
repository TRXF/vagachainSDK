import { VagaConfig } from "./VagaConfig";
import { VagaUtil } from "./VagaUtil";
import { SigningInfo, SlashingParam, SlashingQueryClient } from "./vagachain/slashing/SlashingQueryClient";

export class SlashingService {
    constructor(private readonly config: VagaConfig) { }

    async getSlashingParam(): Promise<SlashingParam> {
        try {
            const queryClient = new SlashingQueryClient(this.config.restApiAddress);
            return await queryClient.queryGetSlashingParam();

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getSigningInfos(): Promise<SigningInfo[]> {
        try {
            const queryClient = new SlashingQueryClient(this.config.restApiAddress);
            return await queryClient.queryGetSigningInfos();

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }

    async getSigningInfo(consAddress: string): Promise<SigningInfo> {
        try {
            const queryClient = new SlashingQueryClient(this.config.restApiAddress);
            return await queryClient.queryGetSigningInfo(consAddress);

        } catch (error) {
            VagaUtil.printLog(error);
            throw error;
        }
    }
}