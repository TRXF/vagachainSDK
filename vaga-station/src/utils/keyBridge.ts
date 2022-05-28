import { clearKeys, storeKey, getStoredWallet, invalidateWallet } from "./localStorage";

import { Wallet } from "./types";

const USER_STORE = "USER_STORE";
const FIRMA_STORE = "FIRMA_STORE";

export const getRandomKey = () => {
  return new Date().getTime().toString();
};

export const clearKey = () => {
  clearKeys();
};

export const storeWallet = (key: string, wallet: Wallet, isVaga = false) => {
  storeKey(isVaga ? FIRMA_STORE : USER_STORE, key, wallet);
};

export const isInvalidWallet = () => {
  return invalidateWallet(FIRMA_STORE);
};

export const restoreWallet = (key: string, isVaga = false) => {
  return getStoredWallet(isVaga ? FIRMA_STORE : USER_STORE, key);
};
