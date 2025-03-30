import { ethers } from 'ethers';

// Validate Ethereum address
export const isValidEthereumAddress = (address: string): boolean => {
    try {
      return ethers.utils.isAddress(address);
    } catch (error) {
      return false;
    }
  };
  
  // Validate private key
  export const isValidPrivateKey = (privateKey: string): boolean => {
    try {
      new ethers.Wallet(privateKey);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  // Validate mnemonic phrase
  export const isValidMnemonic = (mnemonic: string): boolean => {
    try {
      return ethers.utils.isValidMnemonic(mnemonic);
    } catch (error) {
      return false;
    }
  };
  
  // Validate transaction data
  export const isValidTransactionData = (
    to: string,
    value: string,
    gasLimit?: string,
    gasPrice?: string
  ): { valid: boolean; error?: string } => {
    if (!isValidEthereumAddress(to)) {
      return { valid: false, error: 'Invalid recipient address' };
    }
    
    try {
      // Check if value is a valid number
      ethers.utils.parseEther(value);
    } catch (error) {
      return { valid: false, error: 'Invalid amount' };
    }
    
    if (gasLimit) {
      try {
        ethers.BigNumber.from(gasLimit);
      } catch (error) {
        return { valid: false, error: 'Invalid gas limit' };
      }
    }
    
    if (gasPrice) {
      try {
        ethers.utils.parseUnits(gasPrice, 'gwei');
      } catch (error) {
        return { valid: false, error: 'Invalid gas price' };
      }
    }
    
    return { valid: true };
  };
  