export interface Wallet {
    address: string;
    publicKey: string;
  }
  
  export interface Transaction {
    id: string;
    from: string;
    to: string;
    value: string;
    timestamp: number;
    status: 'pending' | 'confirmed' | 'failed';
    network: string;
  }
  
  export interface Network {
    id: string;
    name: string;
    rpcUrl: string;
    symbol: string;
    explorer: string;
    chainId: number;
  }
  