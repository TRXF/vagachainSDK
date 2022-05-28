import { VagaConfig } from "./VagaConfig";
import { VagaBankService } from "./VagaBankService";
import { VagaFeeGrantService } from "./VagaFeeGrantService";
import { VagaStakingService } from "./VagaStakingService";
import { VagaDistributionService } from "./VagaDistributionService";
import { NftService } from "./VagaNftService";
import { TokenService } from "./VagaTokenService";
import { ContractService } from "./VagaContractService";
import { IpfsService } from "./VagaIpfsService";
import { VagaWalletService } from "./VagaWalletService";
import { VagaUtil } from "./VagaUtil";
import { VagaGovService } from "./VagaGovService";
import { ChainService } from "./VagaChainService";
import { SlashingService } from "./VagaSlashingService";

export class VagaSDK {
    constructor(public Config: VagaConfig,
        public Wallet: VagaWalletService = new VagaWalletService(Config),
        public Bank: VagaBankService = new VagaBankService(Config),
        public FeeGrant: VagaFeeGrantService = new VagaFeeGrantService(Config),
        public Staking: VagaStakingService = new VagaStakingService(Config),
        public Distribution: VagaDistributionService = new VagaDistributionService(Config),
        public Gov: VagaGovService = new VagaGovService(Config),
        public Nft: NftService = new NftService(Config),
        public Token: TokenService = new TokenService(Config),
        public Contract: ContractService = new ContractService(Config),
        public Ipfs: IpfsService = new IpfsService(Config),
        public BlockChain: ChainService = new ChainService(Config),
        public Slashing: SlashingService = new SlashingService(Config)) {

        VagaUtil.config = Config;
    }
}


