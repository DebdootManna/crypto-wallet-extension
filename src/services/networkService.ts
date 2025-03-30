import { useState, useEffect } from 'react';
import { Network } from '../types';
import { saveCurrentNetwork, getCurrentNetwork } from './storageService';
import { ethers } from 'ethers';

// Default networks
export const networks: Network[] = [
  {
    id: 'ethereum-mainnet',
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/your-infura-project-id',
    symbol: 'ETH',
    explorer: 'https://etherscan.io',
    chainId: 1
  },
  {
    id: 'ethereum-goerli',
    name: 'Ethereum Goerli',
    rpcUrl: 'https://goerli.infura.io/v3/your-infura-project-id',
    symbol: 'ETH',
    explorer: 'https://goerli.etherscan.io',
    chainId: 5
  },
  {
    id: 'bsc-mainnet',
    name: 'BSC Mainnet',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    symbol: 'BNB',
    explorer: 'https://bscscan.com',
    chainId: 56
  },
  {
    id: 'polygon-mainnet',
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com',
    chainId: 137
  }
];

// Create provider for current network
export const getProvider = (network: Network): ethers.providers.JsonRpcProvider => {
  return new ethers.providers.JsonRpcProvider(network.rpcUrl);
};

// Hook for network selection
export const useNetworkService = () => {
  const [currentNetwork, setCurrentNetwork] = useState<Network | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadNetwork = async () => {
      setLoading(true);
      try {
        let network = await getCurrentNetwork();
        if (!network) {
          network = networks[0]; // Default to Ethereum Mainnet
          await saveCurrentNetwork(network);
        }
        setCurrentNetwork(network);
      } catch (error) {
        console.error('Failed to load network:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNetwork();
  }, []);

  const changeNetwork = async (networkId: string) => {
    try {
      const network = networks.find(n => n.id === networkId);
      if (network) {
        await saveCurrentNetwork(network);
        setCurrentNetwork(network);
      }
    } catch (error) {
      console.error('Failed to change network:', error);
    }
  };

  return {
    currentNetwork,
    networks,
    changeNetwork,
    loading
  };
};