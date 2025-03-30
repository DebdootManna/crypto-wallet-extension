import { ethers } from 'ethers';

// Generate a new wallet
export const generateWallet = (): ethers.Wallet => {
  return ethers.Wallet.createRandom();
};

// Import wallet from private key
export const importWalletFromPrivateKey = (privateKey: string): ethers.Wallet => {
  return new ethers.Wallet(privateKey);
};

// Import wallet from mnemonic
export const importWalletFromMnemonic = (mnemonic: string): ethers.Wallet => {
  return ethers.Wallet.fromMnemonic(mnemonic);
};

// Encrypt private key
export const encryptPrivateKey = async (privateKey: string, password: string): Promise<string> => {
  const wallet = new ethers.Wallet(privateKey);
  return wallet.encrypt(password);
};

// Decrypt private key
export const decryptPrivateKey = async (encryptedJson: string, password: string): Promise<string> => {
  const wallet = await ethers.Wallet.fromEncryptedJson(encryptedJson, password);
  return wallet.privateKey;
};

// Sign a transaction
export const signTransaction = async (privateKey: string, transaction: ethers.providers.TransactionRequest): Promise<string> => {
  const wallet = new ethers.Wallet(privateKey);
  const signedTx = await wallet.signTransaction(transaction);
  return signedTx;
};

// Hash a message for extra security
export const hashMessage = (message: string): string => {
  return ethers.utils.id(message);
};