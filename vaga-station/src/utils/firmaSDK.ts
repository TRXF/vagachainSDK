import { VagaSDK } from "@vagachain/vaga-js";
import { VagaWebLedgerWallet, VagaBridgeLedgerWallet } from "@vagachain/vaga-js-ledger";
import TransportHID from "@ledgerhq/hw-transport-webhid";

import { FIRMACHAIN_CONFIG, IS_DEFAULT_GAS } from "../config";
import { getFeesFromGas, isElectron } from "./common";

declare global {
  interface Window {
    require: NodeRequire;
    electron: any;
  }
}

const webLedgerWallet = new VagaWebLedgerWallet(TransportHID);
const bridgeLedgerWallet = new VagaBridgeLedgerWallet();

const VagaSDKInternal = ({ isLedger, getDecryptPrivateKey }: any) => {
  const vagaSDK = new VagaSDK(FIRMACHAIN_CONFIG);

  if (isElectron) {
    bridgeLedgerWallet.registerShowAddressOnDevice(async (): Promise<void> => {
      window.electron.sendSync("ledger-showAddressOnDevice", {});
    });

    bridgeLedgerWallet.registerGetAddressAndPublicKeyCallback(
      async (): Promise<{ address: string; publicKey: Uint8Array }> => {
        return window.electron.sendSync("ledger-getAddressAndPublicKey", {});
      }
    );

    bridgeLedgerWallet.registerGetAddressCallback(async (): Promise<string> => {
      return window.electron.sendSync("ledger-getAddress", {});
    });

    bridgeLedgerWallet.registerGetPublicKeyCallback(async (): Promise<Uint8Array> => {
      return window.electron.sendSync("ledger-getPublicKey", {});
    });

    bridgeLedgerWallet.registerGetSignCallback(async (message: string): Promise<Uint8Array> => {
      return window.electron.sendSync("ledger-sign", { message: message });
    });
  }

  const showAddressOnDevice = async () => {
    if (isElectron) {
      return await bridgeLedgerWallet.showAddressOnDevice();
    } else {
      return await webLedgerWallet.showAddressOnDevice();
    }
  };

  const connectLedger = async () => {
    if (isElectron) {
      return await bridgeLedgerWallet.getAddress();
    } else {
      return await webLedgerWallet.getAddress();
    }
  };

  const getSDK = () => {
    return vagaSDK;
  };

  const getFees = (estimatedGas: number) => {
    return getFeesFromGas(estimatedGas);
  };

  const getWallet = async () => {
    if (isLedger) {
      if (isElectron) {
        return await vagaSDK.Wallet.initFromLedger(bridgeLedgerWallet);
      } else {
        return await vagaSDK.Wallet.initFromLedger(webLedgerWallet);
      }
    } else {
      const privateKey = getDecryptPrivateKey();

      return await vagaSDK.Wallet.fromPrivateKey(privateKey);
    }
  };

  const send = async (address: string, amount: number, memo = "", estimatedGas: number) => {
    const wallet = await getWallet();
    const result = await vagaSDK.Bank.send(wallet, address, amount, {
      memo,
      gas: estimatedGas,
      fee: getFees(estimatedGas),
    });

    return result;
  };

  const getGasEstimationSend = async (address: string, amount: number, memo = "") => {
    if (IS_DEFAULT_GAS) return FIRMACHAIN_CONFIG.defaultGas;

    const wallet = await getWallet();
    const gasEstimation = await vagaSDK.Bank.getGasEstimationSend(wallet, address, amount, { memo });

    return gasEstimation;
  };

  const sendToken = async (
    address: string,
    tokenID: string,
    amount: number,
    decimal: number,
    memo = "",
    estimatedGas: number
  ) => {
    const wallet = await getWallet();
    const result = await vagaSDK.Bank.sendToken(wallet, address, tokenID, amount, decimal, {
      memo,
      gas: estimatedGas,
      fee: getFees(estimatedGas),
    });

    return result;
  };

  const getGasEstimationSendToken = async (
    address: string,
    tokenID: string,
    amount: number,
    decimal: number,
    memo = ""
  ) => {
    if (IS_DEFAULT_GAS) return FIRMACHAIN_CONFIG.defaultGas;

    const wallet = await getWallet();
    const gasEstimation = await vagaSDK.Bank.getGasEstimationSendToken(wallet, address, tokenID, amount, decimal, {
      memo,
    });

    return gasEstimation;
  };

  const delegate = async (validatorAddress: string, amount: number, estimatedGas: number) => {
    const wallet = await getWallet();
    const result = await vagaSDK.Staking.delegate(wallet, validatorAddress, amount, {
      gas: estimatedGas,
      fee: getFees(estimatedGas),
    });

    return result;
  };

  const getGasEstimationDelegate = async (validatorAddress: string, amount: number) => {
    if (IS_DEFAULT_GAS) return FIRMACHAIN_CONFIG.defaultGas;

    const wallet = await getWallet();
    const result = await vagaSDK.Staking.getGasEstimationDelegate(wallet, validatorAddress, amount);

    return result;
  };

  const redelegate = async (
    validatorAddressSrc: string,
    validatorAddressDst: string,
    amount: number,
    estimatedGas: number
  ) => {
    const wallet = await getWallet();
    const result = await vagaSDK.Staking.redelegate(wallet, validatorAddressSrc, validatorAddressDst, amount, {
      gas: estimatedGas,
      fee: getFees(estimatedGas),
    });
    return result;
  };

  const getGasEstimationRedelegate = async (
    validatorAddressSrc: string,
    validatorAddressDst: string,
    amount: number
  ) => {
    const wallet = await getWallet();
    const result = await vagaSDK.Staking.getGasEstimationRedelegate(
      wallet,
      validatorAddressSrc,
      validatorAddressDst,
      amount
    );

    return result;
  };

  const undelegate = async (validatorAddress: string, amount: number, estimatedGas: number) => {
    const wallet = await getWallet();
    const result = await vagaSDK.Staking.undelegate(wallet, validatorAddress, amount, {
      gas: estimatedGas,
      fee: getFees(estimatedGas),
    });

    return result;
  };

  const getGasEstimationUndelegate = async (validatorAddress: string, amount: number) => {
    if (IS_DEFAULT_GAS) return FIRMACHAIN_CONFIG.defaultGas;

    const wallet = await getWallet();
    const result = await vagaSDK.Staking.getGasEstimationUndelegate(wallet, validatorAddress, amount);

    return result;
  };

  const withdrawAllRewards = async (validatorAddress: string, estimatedGas: number) => {
    const wallet = await getWallet();
    const result = await vagaSDK.Distribution.withdrawAllRewards(wallet, validatorAddress, {
      gas: estimatedGas,
      fee: getFees(estimatedGas),
    });

    return result;
  };

  const getGasEstimationWithdrawAllRewards = async (validatorAddress: string) => {
    if (IS_DEFAULT_GAS) return FIRMACHAIN_CONFIG.defaultGas;

    const wallet = await getWallet();
    const result = await vagaSDK.Distribution.getGasEstimationWithdrawAllRewards(wallet, validatorAddress);

    return result;
  };

  const withdrawAllRewardsFromAllValidator = async (estimatedGas: number) => {
    const wallet = await getWallet();
    const delegationList = await vagaSDK.Staking.getTotalDelegationInfo(await wallet.getAddress());

    const result = await vagaSDK.Distribution.withdrawAllRewardsFromAllValidator(wallet, delegationList, {
      gas: estimatedGas,
      fee: getFees(estimatedGas),
    });

    return result;
  };

  const getGasEstimationWithdrawAllRewardsFromAllValidator = async () => {
    const wallet = await getWallet();
    const delegationList = await vagaSDK.Staking.getTotalDelegationInfo(await wallet.getAddress());
    const gasEstimation = await vagaSDK.Distribution.getGasEstimationWithdrawAllRewardsFromAllValidator(
      wallet,
      delegationList
    );

    return gasEstimation;
  };

  const vote = async (proposalId: number, votingType: number, estimatedGas: number) => {
    const wallet = await getWallet();
    const result = await vagaSDK.Gov.vote(wallet, proposalId, votingType, {
      gas: estimatedGas,
      fee: getFees(estimatedGas),
    });

    return result;
  };

  const getGasEstimationVote = async (proposalId: number, votingType: number) => {
    if (IS_DEFAULT_GAS) return FIRMACHAIN_CONFIG.defaultGas;

    const wallet = await getWallet();
    const result = await vagaSDK.Gov.getGasEstimationVote(wallet, proposalId, votingType);

    return result;
  };

  const deposit = async (proposalId: number, amount: number, estimatedGas: number) => {
    const wallet = await getWallet();
    const result = await vagaSDK.Gov.deposit(wallet, proposalId, amount, {
      gas: estimatedGas,
      fee: getFees(estimatedGas),
    });

    return result;
  };

  const getGasEstimationDeposit = async (proposalId: number, amount: number) => {
    if (IS_DEFAULT_GAS) return FIRMACHAIN_CONFIG.defaultGas;

    const wallet = await getWallet();
    const result = await vagaSDK.Gov.getGasEstimationDeposit(wallet, proposalId, amount);

    return result;
  };

  const submitParameterChangeProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    paramList: Array<any>,
    estimatedGas: number
  ) => {
    const wallet = await getWallet();
    const result = await vagaSDK.Gov.submitParameterChangeProposal(
      wallet,
      title,
      description,
      initialDeposit,
      paramList,
      {
        gas: estimatedGas,
        fee: getFees(estimatedGas),
      }
    );

    return result;
  };

  const getGasEstimationSubmitParameterChangeProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    paramList: Array<any>
  ) => {
    if (IS_DEFAULT_GAS) return FIRMACHAIN_CONFIG.defaultGas;

    const wallet = await getWallet();
    const result = await vagaSDK.Gov.getGasEstimationSubmitParameterChangeProposal(
      wallet,
      title,
      description,
      initialDeposit,
      paramList
    );

    return result;
  };

  const submitCommunityPoolSpendProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    amount: number,
    recipient: string,
    estimatedGas: number
  ) => {
    const wallet = await getWallet();
    const result = await vagaSDK.Gov.submitCommunityPoolSpendProposal(
      wallet,
      title,
      description,
      initialDeposit,
      amount,
      recipient,
      {
        gas: estimatedGas,
        fee: getFees(estimatedGas),
      }
    );

    return result;
  };

  const getGasEstimationSubmitCommunityPoolSpendProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    amount: number,
    recipient: string
  ) => {
    if (IS_DEFAULT_GAS) return FIRMACHAIN_CONFIG.defaultGas;

    const wallet = await getWallet();
    const result = await vagaSDK.Gov.getGasEstimationSubmitCommunityPoolSpendProposal(
      wallet,
      title,
      description,
      initialDeposit,
      amount,
      recipient
    );

    return result;
  };

  const submitTextProposal = async (
    title: string,
    description: string,
    initialDeposit: number,
    estimatedGas: number
  ) => {
    const wallet = await getWallet();
    const result = await vagaSDK.Gov.submitTextProposal(wallet, title, description, initialDeposit, {
      gas: estimatedGas,
      fee: getFees(estimatedGas),
    });

    return result;
  };

  const getGasEstimationSubmitTextProposal = async (title: string, description: string, initialDeposit: number) => {
    if (IS_DEFAULT_GAS) return FIRMACHAIN_CONFIG.defaultGas;

    const wallet = await getWallet();
    const result = await vagaSDK.Gov.getGasEstimationSubmitTextProposal(wallet, title, description, initialDeposit);

    return result;
  };

  const submitSoftwareUpgradeProposalByHeight = async (
    title: string,
    description: string,
    initialDeposit: number,
    upgradeName: string,
    height: number,
    estimatedGas: number
  ) => {
    const wallet = await getWallet();
    const result = await vagaSDK.Gov.submitSoftwareUpgradeProposalByHeight(
      wallet,
      title,
      description,
      initialDeposit,
      upgradeName,
      height,
      {
        gas: estimatedGas,
        fee: getFees(estimatedGas),
      }
    );

    return result;
  };

  const getGasEstimationSubmitSoftwareUpgradeProposalByHeight = async (
    title: string,
    description: string,
    initialDeposit: number,
    upgradeName: string,
    height: number
  ) => {
    if (IS_DEFAULT_GAS) return FIRMACHAIN_CONFIG.defaultGas;

    const wallet = await getWallet();
    const result = await vagaSDK.Gov.getGasEstimationSubmitSoftwareUpgradeProposalByHeight(
      wallet,
      title,
      description,
      initialDeposit,
      upgradeName,
      height
    );

    return result;
  };

  return {
    getSDK,
    showAddressOnDevice,
    connectLedger,
    getWallet,
    send,
    sendToken,
    delegate,
    redelegate,
    undelegate,
    withdrawAllRewards,
    withdrawAllRewardsFromAllValidator,
    vote,
    deposit,
    submitParameterChangeProposal,
    submitCommunityPoolSpendProposal,
    submitTextProposal,
    submitSoftwareUpgradeProposalByHeight,

    getGasEstimationSend,
    getGasEstimationSendToken,
    getGasEstimationDelegate,
    getGasEstimationRedelegate,
    getGasEstimationUndelegate,
    getGasEstimationWithdrawAllRewards,
    getGasEstimationWithdrawAllRewardsFromAllValidator,
    getGasEstimationVote,
    getGasEstimationDeposit,
    getGasEstimationSubmitParameterChangeProposal,
    getGasEstimationSubmitCommunityPoolSpendProposal,
    getGasEstimationSubmitTextProposal,
    getGasEstimationSubmitSoftwareUpgradeProposalByHeight,
  };
};

export { VagaSDKInternal };
