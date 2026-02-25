# Examples & Use Cases

Real-world examples and use cases for Big World Bigger Ideas modules.

## 🎨 NFT Portfolio Tracker

Track NFT ownership across multiple wallets and collections.

```javascript
const { ERC721Fetcher, TokenHistoryTracker } = require('big-world-bigger-ideas');

async function trackNFTPortfolio(walletAddress) {
  const collections = [
    '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', // BAYC
    '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB', // CryptoPunks
    '0x60E4d786628Fea6478F785A6d7e704777c86a7c6'  // MAYC
  ];
  
  const portfolio = [];
  
  for (const contract of collections) {
    const fetcher = new ERC721Fetcher(contract);
    const balance = await fetcher.getBalance(walletAddress);
    const name = await fetcher.getName();
    
    portfolio.push({
      collection: name.name,
      contract: contract,
      balance: balance.balance
    });
  }
  
  return portfolio;
}

// Usage
trackNFTPortfolio('0x1234...').then(console.log);
// Output: [
//   { collection: 'BoredApeYachtClub', contract: '0xBC4C...', balance: '3' },
//   { collection: 'CryptoPunks', contract: '0xb47e...', balance: '1' },
//   ...
// ]
```

## ⛏️ Mining Dashboard

Real-time Bitcoin mining statistics dashboard.

```javascript
const { BitcoinMiningFetcher } = require('big-world-bigger-ideas');

class MiningDashboard {
  constructor() {
    this.fetcher = new BitcoinMiningFetcher(30); // 30s cache
  }
  
  async getStats() {
    const stats = await this.fetcher.getAllStats('1d');
    
    return {
      network: {
        hashRate: `${(stats.hashRate.avgHashRate / 1e9).toFixed(2)} EH/s`,
        difficulty: stats.difficulty.currentDifficulty.toExponential(2),
        blocks24h: stats.blocks.blockCount,
        avgBlockTime: `${Math.round(stats.blocks.avgBlockTime / 60)} min`
      },
      trends: {
        difficultyChange: `${stats.difficulty.difficultyChange > 0 ? '+' : ''}${stats.difficulty.difficultyChange.toFixed(2)}%`,
        hashRateChange: this.calculateChange(stats.hashRate)
      }
    };
  }
  
  calculateChange(hashRate) {
    const change = ((hashRate.currentHashRate - hashRate.avgHashRate) / hashRate.avgHashRate) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
  }
  
  async updateLoop(interval = 60000) {
    while (true) {
      const stats = await this.getStats();
      console.clear();
      console.log('⛏️  Bitcoin Mining Dashboard');
      console.log('============================');
      console.log(`Hash Rate: ${stats.network.hashRate} (${stats.trends.hashRateChange})`);
      console.log(`Difficulty: ${stats.network.difficulty} (${stats.trends.difficultyChange})`);
      console.log(`Blocks (24h): ${stats.network.blocks24h}`);
      console.log(`Avg Block Time: ${stats.network.avgBlockTime}`);
      
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
}

// Usage
const dashboard = new MiningDashboard();
dashboard.updateLoop();
```

## 🏛️ DAO Governance System

Complete DAO governance with voting.

```javascript
const { BlockchainCouncil } = require('big-world-bigger-ideas');

// Create DAO
const dao = new BlockchainCouncil('DeFi Protocol DAO');

// Add founding members
dao.addMember('0xAlice...', 'Alice', 'FOUNDER');
dao.addMember('0xBob...', 'Bob', 'CORE');
dao.addMember('0xCarol...', 'Carol', 'CORE');

// Create upgrade proposal
const proposalId = dao.createProposal(
  '0xAlice...',
  'Upgrade Protocol to V2',
  'Proposal to upgrade the protocol with new features including:\n' +
  '- Enhanced security\n' +
  '- Lower gas fees\n' +
  '- Better UX'
);

// Members vote
dao.vote(proposalId, '0xAlice...', true);
dao.vote(proposalId, '0xBob...', true);
dao.vote(proposalId, '0xCarol...', false);

// Check results
const proposal = dao.getProposal(proposalId);
console.log(`Votes: ${proposal.votesFor} for, ${proposal.votesAgainst} against`);
console.log(`Status: ${proposal.status}`);
```

## 📜 Document Verification System

Zero-knowledge PDF verification for certificates.

```javascript
const { ZKPDFVerifier } = require('big-world-bigger-ideas');
const fs = require('fs');

// Issuer creates verifier
const university = new ZKPDFVerifier('State University');

// Register diploma
const pdfBuffer = fs.readFileSync('./diploma.pdf');
const proof = university.registerDocument(
  'DIPLOMA-2026-001',
  pdfBuffer,
  {
    title: 'Bachelor of Science in Computer Science',
    recipient: 'John Doe',
    date: '2026-05-15',
    honors: 'Summa Cum Laude'
  }
);

console.log('Diploma registered with proof:', proof.hash);

// Later, verify the diploma
const isValid = university.verifyDocument('DIPLOMA-2026-001', proof);
console.log(`Diploma is ${isValid ? 'VALID ✅' : 'INVALID ❌'}`);
```

## 🎯 Multi-Chain Address Manager

Track addresses across multiple blockchains.

```javascript
const { AddressTracker } = require('big-world-bigger-ideas');

const tracker = new AddressTracker();

// Add wallet addresses
tracker.addAddress(
  '0x1234...abcd',
  'Main Wallet',
  ['ethereum', 'polygon', 'arbitrum', 'base']
);

tracker.addAddress(
  '0x5678...efgh',
  'Trading Wallet',
  ['ethereum', 'optimism']
);

tracker.addAddress(
  'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  'Bitcoin Wallet',
  ['bitcoin']
);

// List all addresses
const addresses = tracker.listAddresses();
console.log('Tracked Addresses:');
addresses.forEach(addr => {
  console.log(`${addr.label}: ${addr.address}`);
  console.log(`  Chains: ${addr.chains.join(', ')}`);
});

// Get specific address
const mainWallet = tracker.getAddress('0x1234...abcd');
console.log(`Main wallet active on ${mainWallet.chains.length} chains`);
```

## 🔐 Secure Wallet Manager

Encrypt and manage multiple wallets.

```javascript
const { encryptWallet, decryptWallet } = require('big-world-bigger-ideas').wallet;

class SecureWalletManager {
  constructor(masterPassword) {
    this.masterPassword = masterPassword;
    this.wallets = new Map();
  }
  
  addWallet(name, privateKey) {
    const encrypted = encryptWallet(privateKey, this.masterPassword);
    this.wallets.set(name, encrypted);
  }
  
  getWallet(name) {
    const encrypted = this.wallets.get(name);
    if (!encrypted) throw new Error('Wallet not found');
    return decryptWallet(encrypted, this.masterPassword);
  }
  
  listWallets() {
    return Array.from(this.wallets.keys());
  }
  
  exportWallets() {
    return Array.from(this.wallets.entries()).map(([name, encrypted]) => ({
      name,
      encrypted
    }));
  }
}

// Usage
const manager = new SecureWalletManager('super-secret-password');
manager.addWallet('main', '0xprivatekey123...');
manager.addWallet('trading', '0xprivatekey456...');

console.log('Wallets:', manager.listWallets());
// Get wallet when needed
const mainKey = manager.getWallet('main');
```

## 🎚️ Feature Flag Based UI

Dynamic UI with feature flags.

```javascript
const featureFlags = require('big-world-bigger-ideas').featureFlags;

class DynamicUI {
  constructor() {
    this.flags = featureFlags;
  }
  
  render() {
    let html = '<div class="app">';
    
    // Header
    html += this.renderHeader();
    
    // Main content
    if (this.flags.getFlag('new_dashboard')) {
      html += this.renderNewDashboard();
    } else {
      html += this.renderClassicDashboard();
    }
    
    // Beta features
    if (this.flags.getFlag('beta_features')) {
      html += this.renderBetaSection();
    }
    
    // Dark mode
    if (this.flags.getFlag('dark_mode')) {
      html += '<style>.app { background: #1a1a1a; color: #fff; }</style>';
    }
    
    html += '</div>';
    return html;
  }
  
  renderHeader() {
    return '<header><h1>My DApp</h1></header>';
  }
  
  renderNewDashboard() {
    return '<main class="new-dashboard">Enhanced Dashboard</main>';
  }
  
  renderClassicDashboard() {
    return '<main class="classic-dashboard">Classic Dashboard</main>';
  }
  
  renderBetaSection() {
    return '<section class="beta">🧪 Beta Features Available</section>';
  }
}

// Usage
const ui = new DynamicUI();
const html = ui.render();
```

## 🔍 NFT Ownership History

Track complete NFT ownership history.

```javascript
const { TokenHistoryTracker } = require('big-world-bigger-ideas');

async function analyzeNFTHistory(contractAddress, tokenId) {
  const tracker = new TokenHistoryTracker(contractAddress, tokenId);
  const history = await tracker.trackOwnership();
  
  console.log(`\n📊 NFT #${tokenId} History Analysis`);
  console.log('==================================');
  console.log(`Current Owner: ${history.currentOwner}`);
  console.log(`Total Transfers: ${history.totalTransfers}`);
  console.log(`\nOwnership History:`);
  
  history.history.forEach((record, index) => {
    console.log(`\n${index + 1}. ${record.owner}`);
    console.log(`   Block: ${record.blockNumber}`);
    console.log(`   Time: ${new Date(record.timestamp * 1000).toLocaleString()}`);
  });
  
  // Calculate holding periods
  const holdingPeriods = [];
  for (let i = 0; i < history.history.length - 1; i++) {
    const period = history.history[i + 1].timestamp - history.history[i].timestamp;
    holdingPeriods.push(period);
  }
  
  const avgHoldingTime = holdingPeriods.reduce((a, b) => a + b, 0) / holdingPeriods.length;
  console.log(`\nAverage Holding Time: ${Math.round(avgHoldingTime / 86400)} days`);
}

// Usage
analyzeNFTHistory('0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', 1);
```

## 📊 Cross-Chain Analytics

Analyze blockchain consensus mechanisms.

```javascript
const { ConsensusTracker } = require('big-world-bigger-ideas');

const tracker = new ConsensusTracker();

// Add major blockchains
tracker.addChain('Bitcoin', 'PoW', { algorithm: 'SHA-256', blockTime: 600 });
tracker.addChain('Ethereum', 'PoS', { algorithm: 'Casper FFG', blockTime: 12 });
tracker.addChain('Cardano', 'PoS', { algorithm: 'Ouroboros', blockTime: 20 });
tracker.addChain('Polygon', 'PoS', { algorithm: 'Bor', blockTime: 2 });

// Analyze consensus distribution
const chains = tracker.listChains();
const byConsensus = chains.reduce((acc, chain) => {
  acc[chain.consensusType] = (acc[chain.consensusType] || 0) + 1;
  return acc;
}, {});

console.log('Consensus Mechanism Distribution:');
Object.entries(byConsensus).forEach(([type, count]) => {
  console.log(`${type}: ${count} chains`);
});

// Track consensus change (Ethereum merge example)
tracker.updateConsensus('Ethereum', 'PoS');
console.log('Ethereum successfully transitioned from PoW to PoS');
```

## 🔗 Integration Examples

### Express.js API

```javascript
const express = require('express');
const { ERC721Fetcher } = require('big-world-bigger-ideas');

const app = express();

app.get('/nft/:contract/:tokenId/owner', async (req, res) => {
  try {
    const fetcher = new ERC721Fetcher(req.params.contract);
    const owner = await fetcher.getOwner(req.params.tokenId);
    res.json(owner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000);
```

### React Component

```javascript
import React, { useState, useEffect } from 'react';
const { BitcoinMiningFetcher } = require('big-world-bigger-ideas');

function MiningStats() {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    const fetcher = new BitcoinMiningFetcher();
    fetcher.getHashRate('1d').then(data => {
      setStats(data);
    });
  }, []);
  
  if (!stats) return <div>Loading...</div>;
  
  return (
    <div>
      <h2>Bitcoin Mining Stats</h2>
      <p>Hash Rate: {stats.avgHashRate} TH/s</p>
    </div>
  );
}
```

## 🔗 Related Documentation

- [API Reference](API-Reference) - Complete API documentation
- [Testing Guide](Testing-Guide) - Testing best practices
- [Getting Started](Getting-Started) - Installation and setup

---

**More examples available in the repository's `src/*-example.js` files.**
