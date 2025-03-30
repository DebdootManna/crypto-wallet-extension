# Cryptocurrency Wallet Chrome Extension

A basic cryptocurrency wallet Chrome extension built with React, TypeScript, Tailwind CSS, and Vite.js. This educational project demonstrates core wallet functionalities inspired by MetaMask and Brave Wallet.

![Extension Preview](public/icon-128.png)

## Features

- Create or import wallets using seed phrases
- Display cryptocurrency balances
- Send and receive transactions
- Switch between supported networks
- Secure encrypted storage for private keys
- Transaction history tracking

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Build Tool**: Vite.js
- **Crypto**: ethers.js v5.7.2, Web3
- **Storage**: Chrome Extension Storage API
- **Networking**: Custom network service

## Installation

### Prerequisites
- Node.js v16+
- Chrome browser

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/DebdootManna/crypto-wallet-extension.git
   cd crypto-wallet-extension
2. **Install dependencies**
   ```bash
   npm install
   npm install -D @types/chrome @vitejs/plugin-react autoprefixer postcss tailwindcss
3. **Build the extension**
   ```bash
   npm run build
4. **Load in Chrome**
   Open chrome://extensions
   Enable Developer mode
   Click Load unpacked and select the dist directory

### File Structure

crypto-wallet-extension/
├── public/            # Extension icons
├── src/
│   ├── assets/        # Static assets
│   ├── background/    # Background script logic
│   ├── components/    # React components
│   │   ├── Balance.tsx
│   │   ├── NetworkSelector.tsx
│   │   └── SendReceive.tsx
│   ├── pages/         # Extension UI pages
│   │   ├── Popup/     # Main wallet interface
│   │   └── Options/   # Settings page
│   └── services/      # Core functionality
│       ├── walletService.ts
│       └── cryptoService.ts
├── manifest.json      # Extension metadata
└── vite.config.ts     # Build configuration


