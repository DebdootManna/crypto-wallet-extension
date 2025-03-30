import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Wallet, Transaction } from '../types';
import { 
  generateWallet, 
  importWalletFromPrivateKey, 
  importWalletFromMnemonic,
  encryptPrivateKey,
  decryptPrivateKey,
  signTransaction
} from '../utils/crypto';
import { 
  saveWallet, 
  getWallet, 
  savePasswordHash, 
  getPasswordHash, 
  addTransaction, 
  getTransactions 
} from './storageService';
import { hashMessage } from '../utils/crypto';
import { getProvider } from './networkService';
import { useNetworkService } from './networkService';

export const useWalletService = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [encryptedPrivateKey, setEncryptedPrivateKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { currentNetwork } = useNetworkService();

  // Load wallet on init
  useEffect(() => {
    const loadWallet = async () => {
      setLoading(true);
      try {
        const { wallet: savedWallet, encryptedPrivateKey: savedKey } = await getWallet();
        if (savedWallet) {
          setWallet(savedWallet);
          setEncryptedPrivateKey(savedKey);
          
          // Load transactions
          const savedTransactions = await getTransactions();
          setTransactions(savedTransactions);
        }
      } catch (error) {
        console.error('Failed to load wallet:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWallet();
  }, []);

  // Update balance when wallet or network changes
  useEffect(() => {
    const updateBalance = async () => {
      if (wallet && currentNetwork) {
        try {
          const provider = getProvider(currentNetwork);
          const balance = await provider.getBalance(wallet.address);
          setBalance(balance.toString());
        } catch (error) {
          console.error('Failed to get balance:', error);
        }
      }
    };

    updateBalance();
  }, [wallet, currentNetwork]);

  // Create new wallet
  const createWallet = async (password: string): Promise<boolean> => {
    try {
      // Generate new wallet
      const newWallet = generateWallet();
      
      // Encrypt private key with password
      const encrypted = await encryptPrivateKey(newWallet.privateKey, password);
      
      // Hash password for verification later
      const passwordHash = hashMessage(password);
      
      // Save wallet data
      const walletData: Wallet = {
        address: newWallet.address,
        publicKey: newWallet.publicKey
      };
      
      await saveWallet(walletData, encrypted);
      await savePasswordHash(passwordHash);
      
      // Update state
      setWallet(walletData);
      setEncryptedPrivateKey(encrypted);
      
      return true;
    } catch (error) {
      console.error('Failed to create wallet:', error);
      return false;
    }
  };

  // Import wallet from private key
  const importWallet = async (privateKey: string, password: string): Promise<boolean> => {
    try {
      const importedWallet = importWalletFromPrivateKey(privateKey);
      
      // Encrypt private key with password
      const encrypted = await encryptPrivateKey(importedWallet.privateKey, password);
      
      // Hash password for verification later
      const passwordHash = hashMessage(password);
      
      // Save wallet data
      const walletData: Wallet = {
        address: importedWallet.address,
        publicKey: importedWallet.publicKey
      };
      
      await saveWallet(walletData, encrypted);
      await savePasswordHash(passwordHash);
      
      // Update state
      setWallet(walletData);
      setEncryptedPrivateKey(encrypted);
      
      return true;
    } catch (error) {
      console.error('Failed to import wallet:', error);
      return false;
    }
  };

  // Import wallet from mnemonic
  const importWalletFromSeed = async (mnemonic: string, password: string): Promise<boolean> => {
    try {
      const importedWallet = importWalletFromMnemonic(mnemonic);
      
      // Encrypt private key with password
      const encrypted = await encryptPrivateKey(importedWallet.privateKey, password);
      
      // Hash password for verification later
      const passwordHash = hashMessage(password);
      
      // Save wallet data
      const walletData: Wallet = {
        address: importedWallet.address,
        publicKey: importedWallet.publicKey
      };
      
      await saveWallet(walletData, encrypted);
      await savePasswordHash(passwordHash);
      
      // Update state
      setWallet(walletData);
      setEncryptedPrivateKey(encrypted);
      
      return true;
    } catch (error) {
      console.error('Failed to import wallet from seed:', error);
      return false;
    }
  };

// Send transaction
const sendTransaction = async (
    to: string,
    amount: string,
    password: string
  ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
    if (!wallet || !encryptedPrivateKey || !currentNetwork) {
      return { success: false, error: 'Wallet not initialized' };
    }
    
    try {
      // Verify password and decrypt private key
      const savedPasswordHash = await getPasswordHash();
      const providedPasswordHash = hashMessage(password);
      
      if (savedPasswordHash !== providedPasswordHash) {
        return { success: false, error: 'Invalid password' };
      }
      
      const privateKey = await decryptPrivateKey(encryptedPrivateKey, password);
      
      // Setup provider and wallet instance
      const provider = getProvider(currentNetwork);
      const walletWithProvider = new ethers.Wallet(privateKey, provider);
      
      // Convert amount to wei
      const amountInWei = ethers.utils.parseEther(amount);
      
      // Get nonce for the transaction
      const nonce = await provider.getTransactionCount(wallet.address, 'latest');
      
      // Estimate gas price
      const gasPrice = await provider.getGasPrice();
      
      // Estimate gas limit
      const gasLimit = await provider.estimateGas({
        to,
        value: amountInWei
      });
      
      // Create transaction object
      const tx = {
        to,
        value: amountInWei,
        gasLimit,
        gasPrice,
        nonce,
        chainId: currentNetwork.chainId
      };
      
      // Send transaction
      const transaction = await walletWithProvider.sendTransaction(tx);
      
      // Create transaction record
      const newTransaction: Transaction = {
        id: transaction.hash,
        from: wallet.address,
        to,
        value: amount,
        timestamp: Date.now(),
        status: 'pending',
        network: currentNetwork.id
      };
      
      // Save transaction record
      await addTransaction(newTransaction);
      
      // Update state
      setTransactions([newTransaction, ...transactions]);
      
      return { success: true, txHash: transaction.hash };
    } catch (error) {
      console.error('Transaction failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  };
  
  return {
    wallet,
    balance,
    transactions,
    loading,
    createWallet,
    importWallet,
    importWalletFromSeed,
    sendTransaction
  };
};
