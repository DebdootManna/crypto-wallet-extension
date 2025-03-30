import React from 'react';
import { useNetworkService } from '../services/networkService';

const NetworkSelector: React.FC = () => {
  const { currentNetwork, networks, changeNetwork, loading } = useNetworkService();
  
  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeNetwork(e.target.value);
  };
  
  if (loading) {
    return <div>Loading networks...</div>;
  }
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Network
      </label>
      <select
        className="w-full p-2 border rounded"
        value={currentNetwork?.id}
        onChange={handleNetworkChange}
      >
        {networks.map((network) => (
          <option key={network.id} value={network.id}>
            {network.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NetworkSelector;