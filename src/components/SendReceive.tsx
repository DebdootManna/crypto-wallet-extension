import React, { useState } from 'react';
import { useWalletService } from '../services/walletService';
import { useNetworkService } from '../services/networkService';
import { isValidEthereumAddress } from '../utils/validation';
import { shortenAddress } from '../utils/helpers';

const SendReceive: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send');
  const { wallet, sendTransaction } = useWalletService();
  const { currentNetwork } = useNetworkService();
  
  // Send form state
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSend = async () => {
    // Reset states
    setError('');
    setSuccess('');
    
    // Validate inputs
    if (!isValidEthereumAddress(recipient)) {
      setError('Invalid recipient address');
      return;
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!password) {
      setError('Please enter your password');
      return;
    }
    
    setLoading(true);
    try {
      const result = await sendTransaction(recipient, amount, password);
      
      if (result.success) {
        setSuccess(`Transaction sent! TX Hash: ${result.txHash}`);
        // Clear form
        setRecipient('');
        setAmount('');
        setPassword('');
      } else {
        setError(result.error || 'Transaction failed');
      }
    } catch (err) {
      setError('An error occurred while sending the transaction');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <div className="flex border-b">
        <button
          className={`flex-1 py-2 px-4 ${activeTab === 'send' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('send')}
        >
          Send
        </button>
        <button
          className={`flex-1 py-2 px-4 ${activeTab === 'receive' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('receive')}
        >
          Receive
        </button>
      </div>
      
      <div className="p-4">
        {activeTab === 'send' ? (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Address
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount ({currentNetwork?.symbol || 'ETH'})
              </label>
              <input
                type="number"
                step="0.0001"
                min="0"
                className="w-full p-2 border rounded"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full p-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your wallet password"
              />
            </div>
            
            {error && <div className="text-red-600 mb-4">{error}</div>}
            {success && <div className="text-green-600 mb-4">{success}</div>}
            
            <button
              className="w-full bg-blue-600 text-white rounded py-2 font-medium hover:bg-blue-700 disabled:bg-blue-300"
              onClick={handleSend}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-4">
              <div className="text-sm text-gray-600 mb-2">Your address</div>
              <div className="bg-gray-100 p-2 rounded font-mono break-all">
                {wallet?.address || 'Wallet not loaded'}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1">Network</div>
              <div className="font-medium">{currentNetwork?.name || 'Unknown'}</div>
            </div>
            
            <p className="text-sm text-gray-600">
              Share this address to receive {currentNetwork?.symbol || 'tokens'} on the {currentNetwork?.name || 'current'} network.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendReceive;