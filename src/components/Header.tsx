import React from 'react';
import { useWalletService } from '../services/walletService';
import { shortenAddress } from '../utils/helpers';

const Header: React.FC = () => {
  const { wallet } = useWalletService();
  
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Simple Wallet</h1>
        {wallet && (
          <div className="font-mono text-sm bg-blue-700 px-2 py-1 rounded">
            {shortenAddress(wallet.address)}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;