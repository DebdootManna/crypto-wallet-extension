import React from 'react';
import { useWalletService } from '../services/walletService';
import { useNetworkService } from '../services/networkService';
import { formatBalance } from '../utils/helpers';

const Balance: React.FC = () => {
  const { balance } = useWalletService();
  const { currentNetwork } = useNetworkService();
  
  return (
    <div className="p-4 border rounded-lg bg-white">
      <h2 className="text-lg font-medium mb-2">Balance</h2>
      <div className="flex items-center justify-center p-4">
        <div className="text-3xl font-bold">
          {formatBalance(balance)}
          <span className="text-lg ml-2">{currentNetwork?.symbol || 'ETH'}</span>
        </div>
      </div>
    </div>
  );
};

export default Balance;