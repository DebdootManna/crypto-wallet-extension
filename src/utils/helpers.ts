import { ethers } from 'ethers';

// Format balance with proper decimal places
export const formatBalance = (balance: string, decimals: number = 18): string => {
    const balanceInEth = ethers.utils.formatUnits(balance, decimals);
    // Limit to 6 decimal places for display
    return parseFloat(balanceInEth).toFixed(6);
  };
  
  // Shorten address for display
  export const shortenAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Format timestamp to readable date
  export const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };
  
  // Convert wei to ether
  export const weiToEther = (wei: string): string => {
    return ethers.utils.formatEther(wei);
  };
  
  // Convert ether to wei
  export const etherToWei = (ether: string): string => {
    return ethers.utils.parseEther(ether).toString();
  };