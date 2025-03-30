import React, { useEffect, useState } from 'react';
import { Transaction } from '../types';
import { formatDate, shortenAddress } from '../utils/helpers';
import { getTransactions } from '../services/storageService';
import { useNetworkService } from '../services/networkService';

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentNetwork } = useNetworkService();
  
  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        const allTransactions = await getTransactions();
        
        // Filter transactions for current network if available
        const filteredTransactions = currentNetwork 
          ? allTransactions.filter(tx => tx.network === currentNetwork.id)
          : allTransactions;
          
        setTransactions(filteredTransactions);
      } catch (error) {
        console.error('Failed to load transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTransactions();
  }, [currentNetwork]);
  
  if (loading) {
    return <div>Loading transactions...</div>;
  }
  
  if (transactions.length === 0) {
    return <div className="text-gray-500 text-center py-4">No transactions found</div>;
  }
  
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="divide-y">
        {transactions.map((tx) => (
          <div key={tx.id} className="p-3">
            <div className="flex justify-between items-center mb-1">
              <div className="font-medium">
                {shortenAddress(tx.to)}
              </div>
              <div className={`text-sm font-medium ${
                tx.status === 'confirmed' ? 'text-green-600' :
                tx.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <div>{formatDate(tx.timestamp)}</div>
              <div>-{tx.value} {currentNetwork?.symbol || 'ETH'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;