import React, { useState } from 'react';
import { useWalletService } from '../services/walletService';

interface WalletCreateProps {
  onSuccess: () => void;
}

const WalletCreate: React.FC<WalletCreateProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { createWallet } = useWalletService();
  
  const handleCreate = async () => {
    // Reset error state
    setError('');
    
    // Validate password
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const success = await createWallet(password);
      if (success) {
        onSuccess();
      } else {
        setError('Failed to create wallet');
      }
    } catch (err) {
      setError('An error occurred while creating the wallet');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4 border rounded-lg bg-white">
      <h2 className="text-lg font-medium mb-4">Create New Wallet</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password (min 8 characters)"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          className="w-full p-2 border rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
        />
      </div>
      
      {error && <div className="text-red-600 mb-4">{error}</div>}
      
      <button
        className="w-full bg-blue-600 text-white rounded py-2 font-medium hover:bg-blue-700 disabled:bg-blue-300"
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Wallet'}
      </button>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Remember to save your password! You'll need it to access your wallet.</p>
      </div>
    </div>
  );
};

export default WalletCreate;
