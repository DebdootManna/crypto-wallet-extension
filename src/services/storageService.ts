import { Wallet, Transaction, Network } from '../types';

// Save wallet data
export const saveWallet = async (wallet: Wallet, encryptedPrivateKey: string): Promise<void> => {
  await chrome.storage.local.set({
    wallet,
    encryptedPrivateKey,
    walletExists: true
  });
};
// Get wallet data
export const getWallet = async (): Promise<{ wallet: Wallet | null; encryptedPrivateKey: string | null }> => {
  const result = await chrome.storage.local.get(['wallet', 'encryptedPrivateKey']);
  return {
    wallet: result.wallet || null,
    encryptedPrivateKey: result.encryptedPrivateKey || null
  };
};

// Save current network
export const saveCurrentNetwork = async (network: Network): Promise<void> => {
  await chrome.storage.local.set({ currentNetwork: network });
};

// Get current network
export const getCurrentNetwork = async (): Promise<Network | null> => {
  const result = await chrome.storage.local.get('currentNetwork');
  return result.currentNetwork || null;
};

// Save transactions
export const saveTransactions = async (transactions: Transaction[]): Promise<void> => {
  await chrome.storage.local.set({ transactions });
};

// Get transactions
export const getTransactions = async (): Promise<Transaction[]> => {
  const result = await chrome.storage.local.get('transactions');
  return result.transactions || [];
};

// Add a new transaction
export const addTransaction = async (transaction: Transaction): Promise<void> => {
  const transactions = await getTransactions();
  transactions.unshift(transaction); // Add to beginning of array
  await saveTransactions(transactions);
};

// Clear all wallet data (for resetting the wallet)
export const clearWalletData = async (): Promise<void> => {
  await chrome.storage.local.clear();
};

// Save password hash (not the actual password)
export const savePasswordHash = async (passwordHash: string): Promise<void> => {
  await chrome.storage.local.set({ passwordHash });
};

// Get password hash for verification
export const getPasswordHash = async (): Promise<string | null> => {
  const result = await chrome.storage.local.get('passwordHash');
  return result.passwordHash || null;
};