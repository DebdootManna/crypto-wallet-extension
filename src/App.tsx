import React, { useState } from 'react';
import Header from './components/Header';
import WalletCreate from './components/WalletCreate';
import WalletImport from './components/WalletImport';
import Balance from './components/Balance';
import NetworkSelector from './components/NetworkSelector';
import SendReceive from './components/SendReceive';
import TransactionHistory from './components/TransactionHistory';
import { useWalletService } from './services/walletService';

function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [hasWallet, setHasWallet] = useState<boolean>(false);
  const { wallet, loading } = useWalletService();

  React.useEffect(() => {
    setHasWallet(!!wallet);
  }, [wallet]);

  // Check if wallet exists on load
  React.useEffect(() => {
    const checkWallet = async () => {
      const walletExists = await chrome.storage.local.get('walletExists');
      setHasWallet(!!walletExists.walletExists);
    };
    
    checkWallet();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-full">Loading...</div>;
    }

    if (!hasWallet) {
      return (
        <div className="p-4">
          <div className="mb-4">
            <button 
              className={`px-4 py-2 rounded-t-lg ${activeTab === 'create' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('create')}
            >
              Create Wallet
            </button>
            <button 
              className={`px-4 py-2 rounded-t-lg ${activeTab === 'import' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('import')}
            >
              Import Wallet
            </button>
          </div>
          
          {activeTab === 'create' ? <WalletCreate onSuccess={() => setHasWallet(true)} /> : <WalletImport onSuccess={() => setHasWallet(true)} />}
        </div>
      );
    }

    return (
      <div className="p-4">
        <div className="mb-4">
          <NetworkSelector />
        </div>
        <Balance />
        <div className="my-4">
          <SendReceive />
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-medium mb-2">Transaction History</h2>
          <TransactionHistory />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <Header />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
