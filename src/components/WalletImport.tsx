import React, { useState } from 'react';
import { useWalletService } from '../services/walletService';
import { isValidPrivateKey, isValidMnemonic } from '../utils/validation';

interface WalletImportProps {
  onSuccess: () => void;
}

const WalletImport: React.FC<WalletImportProps> = ({ onSuccess }) => {
  const [importType, setImportType] = useState<'privateKey' | 'mnemonic'>('privateKey');
  const [privateKey, setPrivateKey] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { importWallet, importWalletFromSeed } = useWalletService();
  
  const handleImport = async () => {
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
      let success = false;
      
      if (importType === 'privateKey') {
        // Validate private key
        if (!isValidPrivateKey(privateKey)) {
          setError('Invalid private key');
          setLoading(false);
          return;
        }
        
        success = await importWallet(privateKey, password);
      } else {
        // Validate mnemonic
        if (!isValidMnemonic(mnemonic)) {
          setError('Invalid mnemonic phrase');
          setLoading(false);
          return;
        }
        
        success = await importWalletFromSeed(mnemonic, password);
      }
      
      if (success) {
        onSuccess();
      } else {
        setError(`Failed to import wallet from ${importType === 'privateKey' ? 'private key' : 'mnemonic'}`);
      }
    } catch (err) {
      setError('An error occurred while importing the wallet');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4 border rounded-lg bg-white">
      <h2 className="text-lg font-medium mb-4">Import Wallet</h2>
      
      <div className="mb-4">
        <div className="flex mb-2">
          <button
            className={`flex-1 py-2 ${importType === 'privateKey' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setImportType('privateKey')}
          >
            Private Key
          </button>
          <button
            className={`flex-1 py-2 ${importType === 'mnemonic' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setImportType('mnemonic')}
          >
            Seed Phrase
          </button>
        </div>
        
        {importType === 'privateKey' ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Private Key
            </label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder="Enter your private key"
            />
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seed Phrase
            </label>
            <textarea
              className="w-full p-2 border rounded"
              rows={3}
              value={mnemonic}
              onChange={(e) => setMnemonic(e.target.value)}
              placeholder="Enter your 12 or 24 word mnemonic phrase"
            />
          </div>
        )}
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
        onClick={handleImport}
        disabled={loading}
      >
        {loading ? 'Importing...' : 'Import Wallet'}
      </button>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Never share your private key or seed phrase with anyone!</p>
      </div>
    </div>
  );
};

export default WalletImport;
