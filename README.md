    # 🌏-Big-world-Bigger-ideas-🗺️

<div align="center">

![GitHub Owner](https://img.shields.io/badge/Owner-Kushmanmb-blue?style=for-the-badge&logo=github)
![Maintained](https://img.shields.io/badge/Maintained-Yes-green?style=for-the-badge)
![Focus](https://img.shields.io/badge/Focus-Blockchain-orange?style=for-the-badge&logo=ethereum)

[![Profile](https://img.shields.io/badge/Profile-kushmanmb.org-informational?style=flat-square&logo=ethereum)](https://kushmanmb.org)
[![ENS](https://img.shields.io/badge/ENS-kushmanmb.eth-9cf?style=flat-square&logo=ethereum)](https://app.ens.domains/name/kushmanmb.eth)
[![Email](https://img.shields.io/badge/Contact-kushmanmb@gmx.com-red?style=flat-square&logo=gmail)](mailto:kushmanmb@gmx.com)

</div>

---

## 📦 NPM Package Installation & Usage

This package is available on npm as `big-world-bigger-ideas`, providing comprehensive blockchain utilities and crypto clarity tools.

### Installation

```bash
npm install big-world-bigger-ideas
```

### Quick Start

```javascript
// Import the entire package
const bigWorld = require('big-world-bigger-ideas');

// Or import specific modules
const { 
  ERC721Fetcher, 
  BitcoinMiningFetcher,
  ZKPDFVerifier,
  ConsensusTracker,
  AddressTracker 
} = require('big-world-bigger-ideas');

// Example: Fetch ERC-721 NFT data
const nftFetcher = new ERC721Fetcher('0x1234...abcd');
const owner = await nftFetcher.getOwner('1');

// Example: Track Bitcoin mining data
const btcFetcher = new BitcoinMiningFetcher();
const miningData = await btcFetcher.getHashRate('1w');

// Example: Zero-knowledge PDF verification
const zkVerifier = new ZKPDFVerifier('your-name');
const doc = zkVerifier.registerDocument('doc-id', pdfBuffer, { title: 'My Document' });
```

### Available Modules

This package includes the following modules:

- **`wallet`** - Wallet encryption and decryption utilities
- **`featureFlags`** - Feature flag management system
- **`ERC721Fetcher`** - ERC-721 NFT token data fetcher
- **`TokenHistoryTracker`** - Git-style NFT ownership history tracker
- **`BitcoinMiningFetcher`** - Bitcoin mining data from mempool.space
- **`LitecoinBlockchairFetcher`** - Litecoin blockchain data from Blockchair
- **`ISO27001Fetcher`** - ISO 27001 certification management
- **`ConsensusTracker`** - Blockchain consensus mechanism tracker
- **`AddressTracker`** - Multi-chain address tracking and management
- **`PackageMetadata`** - Metadata processing utilities
- **`ZKPDFVerifier`** - Zero-knowledge PDF verification system

### Package Structure

The published package includes only the essential files (60.6 kB):
- Main entry point (`index.js`)
- Core JavaScript modules (`src/*.js`)
- Module documentation (`src/*.md`)
- Main README

Test files, examples, and development files are excluded from the npm package to keep it lightweight.

### Publishing to NPM

**For maintainers:** This repository uses GitHub Actions for automated publishing with build provenance attestation.

#### Automated Publishing (Recommended)

The repository includes a GitHub Actions workflow that automatically publishes to npm with cryptographic build provenance attestation for enhanced security:

1. Ensure all tests pass:
```bash
npm test
```

2. Update the version in `package.json`:
```bash
npm version patch  # or minor, or major
```

3. Push the version tag and commit:
```bash
git push --follow-tags
```

4. Create a GitHub release from the tag:
   - Go to the repository's Releases page
   - Click "Draft a new release"
   - Select the version tag you just pushed
   - Publish the release

The workflow will automatically:
- Run all tests
- Build the package
- Create a cryptographic attestation of the build process
- Publish to npm with provenance information

**Note:** Ensure the `NPM_TOKEN` secret is configured in the repository settings:
1. Create an npm access token at https://www.npmjs.com/settings/[username]/tokens
2. Select "Automation" token type with "Publish" permission
3. Add the token to GitHub: Settings → Secrets and variables → Actions → New repository secret
4. Name it `NPM_TOKEN` and paste the token value

#### Manual Publishing (Alternative)

If you need to publish manually:

```bash
npm test
npm version patch  # or minor, or major
npm publish
git push --tags
```

---

## 🔐 Security & Branch Protection

This repository implements comprehensive security measures to protect sensitive data and maintain code quality.

### Branch Protection Rules

Branch protection rulesets are configured for:
- **Main/Master branches**: Require 1 approval, signed commits, linear history
- **Release/Hotfix branches**: Require 2 approvals, stricter review requirements

📖 **See [.github/APPLY-RULESETS.md](./.github/APPLY-RULESETS.md)** for instructions on applying these rules to your repository.

### Enhanced .gitignore

The `.gitignore` file includes comprehensive patterns to prevent accidental commits of:
- 🔑 Private keys and certificates
- 🔐 SSH keys
- 🔒 Environment variables and secrets
- 💰 Blockchain wallet files
- ☁️ Cloud provider credentials
- 🗄️ Database credentials
- 📝 Log files with sensitive data

📖 **See [.github/SECURITY.md](./.github/SECURITY.md)** for complete security documentation and best practices.

---

## 🔐 Zero-Knowledge PDF Verification (zkpdf)

This repository includes a powerful zero-knowledge proof-based PDF verification system that enables document authentication and integrity verification without revealing document contents.

### Quick Start

```javascript
const ZKPDFVerifier = require('./src/zkpdf.js');

// Create a verifier instance
const verifier = new ZKPDFVerifier('kushmanmb');

// Register a PDF document
const doc = verifier.registerDocument(
  'contract-001',
  pdfContentBuffer,
  { title: 'Service Agreement', type: 'application/pdf' }
);

// Generate a zero-knowledge proof
const proof = verifier.generateProof('contract-001', {
  contractSigned: true,
  authorized: true
});

// Verify the proof
const verification = verifier.verifyProof(proof.proofId);
console.log(`Proof is ${verification.isValid ? 'VALID' : 'INVALID'}`);

// Submit for verification
const submission = verifier.submitForVerification('contract-001', {
  type: 'integrity-check',
  requester: 'legal-department'
});
```

### Features

- 📄 **Document Registration**: Register PDF documents with cryptographic hashing
- 🔑 **Zero-Knowledge Proofs**: Generate proofs that verify document properties without revealing content
- ✅ **Proof Verification**: Verify proofs to confirm document authenticity and integrity
- 📤 **Submission Workflow**: Submit documents for verification with metadata tracking
- 📊 **Multi-Document Support**: Manage and track multiple documents simultaneously
- 💾 **Metadata Management**: Store and retrieve document metadata securely
- 🔒 **Commitment Schemes**: Use cryptographic commitments for proof generation

### Available Functions

- `registerDocument(documentId, documentData, metadata)` - Register a PDF document for verification
- `generateProof(documentId, claims)` - Generate a zero-knowledge proof
- `verifyProof(proofId, verificationData)` - Verify a zero-knowledge proof
- `submitForVerification(documentId, submissionData)` - Submit document for verification
- `getDocumentInfo(documentId)` - Get information about a registered document
- `getProofInfo(proofId)` - Get information about a proof
- `listDocuments()` - List all registered documents
- `listProofs()` - List all generated proofs
- `getStatistics()` - Get verifier statistics
- `formatDocumentInfo(docInfo)` - Format document info for display
- `formatProofInfo(proofInfo)` - Format proof info for display
- `formatVerificationResult(result)` - Format verification result for display

### Use Cases

**Confidential Contract Verification:**
Prove that a signed contract exists without revealing its terms.

**Document Integrity Checking:**
Verify document hasn't been tampered with using cryptographic hashes.

**Compliance & Audit Trail:**
Create verifiable audit trail for compliance requirements.

**Multi-Party Document Verification:**
Multiple parties verify document validity without sharing it.

### Testing & Demo

```bash
npm run test:zkpdf    # Run zkpdf tests
npm run zkpdf:demo    # See the zkpdf verifier in action
```

### Documentation

For complete documentation, see [src/ZKPDF.md](./src/ZKPDF.md)

### How It Works

1. **Document Hashing**: SHA-256 hash computed for each registered document
2. **Commitment Generation**: Cryptographic commitment created using hash, timestamp, and nonce
3. **Proof Creation**: Proof includes commitment and claims about the document
4. **Verification**: Anyone can verify the proof without seeing the original document

### Example Output

```
Zero-Knowledge Proof
================================

Proof ID: 9d4a38a130a405dea20df34d159ba5d0
Document ID: contract-2024-001
Document Hash: fc84c91ae2d656a1fbf94a19b1c78a01...
Commitment: 13c50dcae15097461e9193d0963566ee...
Created: 2026-02-21T19:19:58.611Z

Claims:
  owner: kushmanmb
  documentExists: true
  integrityVerified: true
  contractSigned: true
```

---

## 🏆 ISO/IEC 27001:2013 Certification

This repository includes comprehensive tools for tracking and managing ISO/IEC 27001:2013 Information Security Management System (ISMS) certification compliance.

### Quick Start

```javascript
const ISO27001Fetcher = require('./src/iso27001.js');

// Create a fetcher instance for kushmanmb
const fetcher = new ISO27001Fetcher('kushmanmb');

// Get certification information
const info = fetcher.getCertificationInfo();
console.log(fetcher.formatCertificationInfo(info));

// Get compliance status
const status = fetcher.getComplianceStatus();
console.log(`Compliance: ${status.percentage}%`);

// Generate compliance report
const report = fetcher.generateComplianceReport();
console.log(report);
```

### Features

- 📋 **Comprehensive Tracking**: Full ISO 27001:2013 standard coverage with all 7 main clauses (4-10)
- 🔒 **114 Security Controls**: Track implementation across 14 Annex A control domains
- 📊 **Compliance Reporting**: Generate detailed reports and status summaries
- ✅ **Repository-Specific**: Track security measures specific to this blockchain repository
- 💾 **Smart Caching**: Automatic caching with 1-hour timeout
- 📈 **Progress Monitoring**: Track implementation progress and compliance percentage
- 🎯 **Recommendations**: Get actionable recommendations based on compliance status

### Standard Coverage

**Main Clauses (4-10):**
- Context of the Organization
- Leadership
- Planning
- Support
- Operation
- Performance Evaluation
- Improvement

**Annex A Control Domains:**
- Information Security Policies (A.5)
- Organization of Information Security (A.6)
- Human Resource Security (A.7)
- Asset Management (A.8)
- Access Control (A.9)
- Cryptography (A.10)
- Physical and Environmental Security (A.11)
- Operations Security (A.12)
- Communications Security (A.13)
- System Development and Maintenance (A.14)
- Supplier Relationships (A.15)
- Incident Management (A.16)
- Business Continuity (A.17)
- Compliance (A.18)

### Repository Compliance Status

Current compliance areas for this repository:

| Area | Status | Description |
|------|--------|-------------|
| ✓ Cryptography | Compliant | Wallet encryption/decryption utilities implemented |
| ✓ Access Control | Compliant | Branch protection rules and secure authentication |
| ✓ Operations Security | Compliant | Secure development practices and code review |
| ✓ Information Security Policies | Compliant | Security documentation and policies in place |
| ✓ Communications Security | Compliant | Secure blockchain network communications |
| ✓ System Development | Compliant | Secure coding practices and testing infrastructure |
| ○ Asset Management | In Progress | Enhanced .gitignore for sensitive data protection |

**Current Compliance: 84%** (96 of 114 controls implemented)

### Available Functions

- `getCertificationInfo()` - Get comprehensive certification information
- `getComplianceStatus()` - Get compliance status summary with percentages
- `getControlStatus()` - Get detailed control implementation by domain
- `generateComplianceReport()` - Generate full compliance report
- `formatCertificationInfo()` - Format certification data for display
- `clearCache()` - Clear cached data
- `getCacheStats()` - Get cache statistics

### Testing & Demo

```bash
npm run test:iso27001    # Run ISO 27001 certification tests
npm run iso27001:demo    # See the certification fetcher in action
```

### Documentation

For complete documentation, see [src/ISO27001.md](./src/ISO27001.md)

### Example Output

```
ISO/IEC 27001:2013 Certification Information
Owner: kushmanmb
======================================================================

Standard: ISO/IEC 27001:2013
Name: Information Security Management System (ISMS)
Status: In Progress

Compliance Status:
  Total Controls: 114
  Implemented: 96
  Compliance: 84%
  Overall Status: Good
```

### Benefits

- ✓ Demonstrates commitment to information security
- ✓ Builds trust with stakeholders and customers
- ✓ Improves security posture and reduces risk
- ✓ Ensures compliance with legal and regulatory requirements
- ✓ Provides competitive advantage in the market
- ✓ Establishes systematic approach to security management
- ✓ Facilitates continuous improvement
- ✓ Reduces likelihood of security breaches

---

## 🌐 Web Interface

This repository includes a comprehensive web interface for viewing and editing blockchain documentation.

**Main Files:**
- `index.html` - Main HTML page with blockchain documentation and navigation
- `editor.html` - Interactive web editor with live preview
- `styles.css` - Stylesheet with background image configuration

### 🖊️ Web Editor

The **Web Editor** (`editor.html`) is a powerful, browser-based tool for creating and editing blockchain documentation, smart contracts, and markdown files.

**Features:**
- ✨ **Live Preview**: Real-time markdown rendering as you type
- 📝 **Templates**: Pre-built templates for blockchain docs, smart contracts, README files, and markdown guides
- 💾 **Export Options**: Download files or copy to clipboard
- 📊 **Character/Word Counter**: Live tracking of document length
- 🎨 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 👁️ **Dual-Pane View**: Side-by-side editor and preview panels

**To use the web editor:**
1. Open `editor.html` in a web browser
2. Select a template from the dropdown or start typing
3. Watch the live preview update automatically
4. Download your work or copy to clipboard

**Background Image Configuration:**
The web interface is configured with a custom background image located at:
`C:\Users\mattb\iCloudPhotos\Photos\IMG_0032.HEIC`

**Important Notes:**
- The configured path is an absolute Windows file path that only works on the local machine
- HEIC format has limited browser support (primarily Safari)
- For production deployment, consider:
  - Converting the image to JPEG, PNG, or WebP format
  - Using a relative path (e.g., `./images/background.jpg`)
  - Hosting the image on a web server or CDN

**To view the web interface:**
1. Open `index.html` in a web browser to see documentation
2. Click "Open Web Editor →" to launch the editor
3. Or run a local web server: `python3 -m http.server 8000` and navigate to `http://localhost:8000`

---

## ₿ Bitcoin Mining Block Rewards

This repository includes a powerful Bitcoin mining data fetcher that provides real-time and historical mining statistics from the mempool.space API.

### Quick Start

```javascript
const BitcoinMiningFetcher = require('./src/bitcoin-mining.js');

// Create a fetcher instance
const fetcher = new BitcoinMiningFetcher();

// Fetch 1-day block rewards
const rewards = await fetcher.getBlockRewards('1d');
console.log(fetcher.formatBlockRewards(rewards));

// Get mining pool statistics
const pools = await fetcher.getMiningPools('1w');

// Get network hashrate
const hashrate = await fetcher.getHashrate('1w');

// Get difficulty adjustments
const difficulty = await fetcher.getDifficultyAdjustment();
```

### Features

- 📊 **Block Rewards**: Fetch historical block reward data for various time periods
- ⛏️ **Mining Pools**: Get statistics about mining pool performance and market share
- 💪 **Hashrate Data**: Access network hashrate information over time
- 🎯 **Difficulty Adjustments**: Track Bitcoin network difficulty changes
- 💾 **Smart Caching**: Automatic caching with configurable timeout (default: 60 seconds)
- 📝 **Data Formatting**: Built-in formatting utilities for display
- ✅ **Error Handling**: Robust error handling with informative messages

### Available Functions

- `getBlockRewards(period)` - Fetch mining block rewards for a time period ('1d', '3d', '1w', '1m', '3m', '6m', '1y', '2y', '3y', 'all')
- `getMiningPools(period)` - Get mining pool statistics
- `getHashrate(period)` - Get network hashrate data
- `getDifficultyAdjustment()` - Get difficulty adjustment information
- `formatBlockRewards(data)` - Format data for display
- `clearCache()` - Clear cached data
- `getCacheStats()` - Get cache statistics

### Testing & Demo

```bash
npm run test:bitcoin-mining     # Run Bitcoin mining tests
npm run bitcoin-mining:demo     # See the Bitcoin mining fetcher in action
```

### Documentation

For complete documentation, see [src/BITCOIN-MINING.md](./src/BITCOIN-MINING.md)

### Example Output

```
Bitcoin Mining Block Rewards
================================

Total entries: 144

Entry 1:
  Average Rewards: 6.25 BTC
  Timestamp: 2024-02-21T00:00:00.000Z
  Total Rewards: 625 BTC
  Block Count: 100

Entry 2:
  Average Rewards: 6.24 BTC
  Timestamp: 2024-02-21T01:00:00.000Z
  Total Rewards: 624 BTC
  Block Count: 100
```

---

## 🪙 Litecoin Blockchair

This repository includes a comprehensive Litecoin blockchain data fetcher that provides real-time and historical blockchain statistics from the Blockchair API.

### Quick Start

```javascript
const LitecoinBlockchairFetcher = require('./src/litecoin-blockchair.js');

// Create a fetcher instance
const fetcher = new LitecoinBlockchairFetcher();

// Fetch blockchain statistics
const stats = await fetcher.getStats();
console.log(fetcher.formatStats(stats));

// Get specific block information
const block = await fetcher.getBlock(2500000);
console.log(fetcher.formatBlock(block));

// Get address information
const address = await fetcher.getAddress('LhKTpQgfcNPy3aL4xG3HCVc8mXb9qTbKJ1');
console.log(fetcher.formatAddress(address));

// Get recent blocks
const recentBlocks = await fetcher.getRecentBlocks(10);
```

### Features

- 📊 **Blockchain Statistics**: Comprehensive Litecoin blockchain stats including block count, transactions, and market data
- 🧱 **Block Information**: Get detailed information about specific blocks by height or hash
- 💼 **Address Data**: Query address balances, transaction counts, and history
- 📝 **Transaction Details**: Access detailed transaction information
- 📚 **Recent Blocks**: Fetch the most recent blocks on the blockchain
- 💾 **Smart Caching**: Automatic caching with configurable timeout (default: 60 seconds)
- ✅ **Validation**: Robust input validation for addresses and transaction hashes
- 📋 **Data Formatting**: Built-in formatting utilities for display

### Available Functions

- `getStats()` - Fetch general Litecoin blockchain statistics
- `getBlock(blockId)` - Get information about a specific block (by height or hash)
- `getAddress(address)` - Get address information (balance, transactions)
- `getTransaction(txHash)` - Get transaction details
- `getRecentBlocks(limit)` - Fetch recent blocks (1-100)
- `formatStats(data)` - Format statistics for display
- `formatBlock(data)` - Format block information for display
- `formatAddress(data)` - Format address information for display
- `clearCache()` - Clear cached data
- `getCacheStats()` - Get cache statistics

### Testing & Demo

```bash
npm run test:litecoin-blockchair     # Run Litecoin Blockchair tests
npm run litecoin-blockchair:demo     # See the Litecoin fetcher in action
```

### Documentation

For complete documentation, see [src/LITECOIN-BLOCKCHAIR.md](./src/LITECOIN-BLOCKCHAIR.md)

### Example Output

```
Litecoin Blockchain Statistics
================================

Latest Block: 2,500,000
Total Transactions: 50,000,000
Circulating Supply: 70,000,000 LTC
Difficulty: 15,000,000
24h Hashrate: 500 TH/s
Blockchain Size: 46.57 GB
Network Nodes: 1500
Market Price: $75.50 USD
Market Cap: $5500.00M USD
```

---

## 🔗 Consensus Mechanism Tracker

This repository includes a comprehensive consensus mechanism tracker that monitors Proof of Work (PoW) and Proof of Stake (PoS) across multiple blockchain networks.

### Quick Start

```javascript
const { ConsensusTracker } = require('./src/consensus-tracker.js');

// Create a consensus tracker
const tracker = new ConsensusTracker();

// Get all Proof of Work networks
const powNetworks = tracker.getPowNetworks();
console.log(`PoW: ${powNetworks.map(n => n.name).join(', ')}`);

// Get all Proof of Stake networks
const posNetworks = tracker.getPosNetworks();
console.log(`PoS: ${posNetworks.map(n => n.name).join(', ')}`);

// Compare networks
const comparison = tracker.compareNetworks('bitcoin', 'ethereum');
console.log(`Consensus: ${comparison.consensus.join(' vs ')}`);
```

### Supported Networks

**Proof of Work (PoW):**
- Bitcoin (SHA-256)
- Litecoin (Scrypt)

**Proof of Stake (PoS):**
- Ethereum (Post-Merge)
- Ethereum Beacon Chain
- Base (Layer 2)
- Polygon

### Features

- 🔍 **Multi-Chain Support**: Track consensus across Bitcoin, Ethereum, Base, Litecoin, Polygon, and more
- ⚡ **PoW/PoS Classification**: Easily identify which networks use Proof of Work vs Proof of Stake
- 📊 **Network Comparison**: Compare consensus mechanisms, block times, and energy efficiency
- 📈 **Statistics**: Get comprehensive statistics about tracked networks
- 🌐 **Network Details**: Access detailed information about each blockchain's consensus mechanism

### Available Functions

- `getNetworkInfo(networkName)` - Get detailed network information
- `getPowNetworks()` - Get all Proof of Work networks
- `getPosNetworks()` - Get all Proof of Stake networks
- `getAllNetworks()` - Get all tracked networks
- `getConsensusStatistics()` - Get comprehensive statistics
- `compareNetworks(network1, network2)` - Compare two networks
- `isProofOfWork(networkName)` - Check if network uses PoW
- `isProofOfStake(networkName)` - Check if network uses PoS
- `getConsensusSummary()` - Get formatted consensus summary

### Testing & Demo

```bash
npm run test:consensus-tracker      # Run consensus tracker tests
npm run consensus-tracker:demo      # See the tracker in action
```

### Documentation

For complete documentation, see [src/CONSENSUS-TRACKER.md](./src/CONSENSUS-TRACKER.md)

### Example Output

```
Blockchain Consensus Mechanism Summary
==================================================

Total Networks Tracked: 6
Average Block Time: 128 seconds

Consensus Distribution:
  Proof of Work (PoW): 2 networks
    - Bitcoin, Litecoin
  
  Proof of Stake (PoS): 4 networks
    - Ethereum, Ethereum Beacon Chain, Base, Polygon

Energy Profile:
  Energy Efficient: 4 networks
  Energy Intensive: 2 networks
```

---

## 📍 Crypto Address Tracker

This repository includes a powerful address tracking module for monitoring crypto addresses and owner token tracking across multiple blockchain networks.

### Quick Start

```javascript
const { AddressTracker } = require('./src/address-tracker.js');

// Create an address tracker
const tracker = new AddressTracker('kushmanmb');

// Add addresses to track
tracker.addAddress(
  '0x1234567890123456789012345678901234567890',
  'ethereum',
  'Main Ethereum Wallet'
);

// Record tokens
tracker.recordToken('0x1234567890123456789012345678901234567890', {
  tokenId: '123',
  contract: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
  name: 'Bored Ape Yacht Club',
  symbol: 'BAYC'
});

// Get tokens for an address
const tokens = tracker.getTokensForAddress('0x1234567890123456789012345678901234567890');
console.log(`Tokens owned: ${tokens.length}`);

// Get statistics
const stats = tracker.getStatistics();
console.log(`Tracking ${stats.totalAddresses} addresses`);
```

### Features

- 🔍 **Multi-Chain Address Tracking**: Track addresses across Ethereum, Base, Polygon, and other networks
- 🎨 **Token Management**: Record and track NFT tokens owned by addresses
- 💸 **Transaction History**: Monitor transaction activity for tracked addresses
- 📊 **Statistics**: Get comprehensive statistics about tracked addresses
- 🏷️ **Address Labeling**: Label addresses for easy identification
- 💾 **JSON Import/Export**: Save and restore tracking data
- 🌐 **Network Organization**: Group addresses by blockchain network

### Available Functions

- `addAddress(address, network, label)` - Add an address to track
- `removeAddress(address)` - Remove an address from tracking
- `getAddress(address)` - Get information about a tracked address
- `isTracking(address)` - Check if an address is being tracked
- `getAllAddresses()` - Get all tracked addresses
- `getAddressesByNetwork(network)` - Get addresses on a specific network
- `recordToken(address, tokenInfo)` - Record a token for an address
- `recordTransaction(address, transactionInfo)` - Record a transaction
- `getTokensForAddress(address)` - Get all tokens owned by an address
- `getTransactionCount(address)` - Get transaction count for an address
- `getStatistics()` - Get comprehensive statistics

### Testing & Demo

```bash
npm run test:address-tracker      # Run address tracker tests
npm run address-tracker:demo      # See the tracker in action
```

### Documentation

For complete documentation, see [src/ADDRESS-TRACKER.md](./src/ADDRESS-TRACKER.md)

### Use Cases

- **NFT Portfolio Tracking**: Track NFT holdings across multiple addresses and chains
- **Multi-Chain Wallet Monitoring**: Monitor wallet activity across different blockchains
- **Transaction History**: Record and monitor transaction activity
- **Portfolio Export/Import**: Save and restore tracking data

---

## 🤖 ChatOps & Feature Flags

This repository includes a powerful ChatOps system for managing feature flags directly from GitHub issues and pull requests.

### Quick Start

Use these commands in any issue or PR comment:

- **Enable a feature:** `/chatops run feature set <flag_name>`
- **Disable a feature:** `/chatops run feature unset <flag_name>`
- **List all flags:** `/chatops run feature list`

**Example:**
```
/chatops run feature set dark_mode
```

### Why Feature Flags?

- 🎯 Toggle features without code changes
- 🚀 Gradual feature rollouts
- 🔬 A/B testing capabilities
- 🛡️ Emergency feature disable

### Documentation

For complete documentation on ChatOps and feature flags, see [CHATOPS.md](./CHATOPS.md)

### Testing

```bash
npm test                    # Run all tests
npm run test:feature-flags  # Test feature flags only
npm run feature-flags:demo  # See feature flags in action
```

---

## 🔍 Contract ABI Fetcher

This repository includes a Contract ABI Fetcher module for fetching contract ABIs (Application Binary Interfaces) from the Etherscan API.
## 📜 Token Ownership History Tracker

This repository includes a powerful git-style ownership history tracker for ERC-721 tokens, designed specifically for tracking NFT ownership changes over time.

### Quick Start

```javascript
const ContractABIFetcher = require('./src/contract-abi');

// Create a fetcher with your API key
const fetcher = new ContractABIFetcher('YOUR_ETHERSCAN_API_KEY', 1);

// Fetch contract ABI
const result = await fetcher.getContractABI('0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43');
console.log(`Functions: ${result.abi.filter(item => item.type === 'function').length}`);

// Extract function signatures
const functions = ContractABIFetcher.extractFunctionSignatures(result.abi);
functions.forEach(func => console.log(func.signature));
const { TokenHistoryTracker } = require('./src/token-history');

// Create a history tracker for kushmanmb
const tracker = new TokenHistoryTracker(
  '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',  // Contract address
  'kushmanmb'  // Owner identifier
);

// Record token transfers
tracker.recordTransfer(
  '1234',  // Token ID
  '0x0000000000000000000000000000000000000000',  // From address
  '0x1234567890123456789012345678901234567890',  // To address (kushmanmb)
  1609459200,  // Timestamp
  '0xabc123...',  // Transaction hash
  11565019  // Block number
);

// View git-style history
console.log(tracker.toGitLog());

// Get tokens owned by kushmanmb
const ownedTokens = tracker.getTokensByOwner('0x1234567890...');
```

### Features

- 🔌 **Etherscan API Integration**: Direct integration with Etherscan API
- ✅ **Address Validation**: Built-in Ethereum address validation
- 🌐 **Multi-Chain Support**: Works with Ethereum, Base, Polygon, and more
- 💾 **Automatic Caching**: Caches ABIs for improved performance
- 📝 **Signature Extraction**: Extract function and event signatures from ABIs
- 🛡️ **Error Handling**: Comprehensive error handling for API failures

### Available Functions

- `getContractABI(address)` - Fetch contract ABI from Etherscan
- `validateAddress(address)` - Validate Ethereum address format
- `clearCache()` - Clear the internal cache
- `getAPIInfo()` - Get API configuration information
- `extractFunctionSignatures(abi)` - Extract function signatures (static)
- `extractEventSignatures(abi)` - Extract event signatures (static)
- 🔍 **Git-Style History**: Track ownership changes like git commits
- 📊 **Comprehensive Tracking**: Monitor all token transfers for a specific owner
- 🎯 **Ownership Verification**: Verify current and historical token ownership
- 📈 **Statistics**: Get insights into transfer patterns and ownership
- 💾 **JSON Export/Import**: Save and restore history data
- ✅ **Address Validation**: Built-in Ethereum address validation
- 📝 **Multiple Formats**: View history in git log, short log, or JSON format

### Available Functions

- `recordTransfer(tokenId, from, to, timestamp, txHash, blockNumber)` - Record a token transfer event
- `getTokenHistory(tokenId)` - Get complete ownership history for a token
- `getTokensByOwner(address)` - Get all tokens currently owned by an address
- `getCurrentOwner(tokenId)` - Get the current owner of a token
- `getHistoryForOwner(address)` - Get all transfers involving an owner
- `toGitLog(limit)` - Format history as git-style log
- `toShortLog(limit)` - Format history in compact format
- `getStatistics()` - Get comprehensive statistics about the history
- `toJSON()` - Export history as JSON
- `fromJSON(data)` - Import history from JSON

### Testing & Demo

```bash
npm run test:contract-abi   # Run Contract ABI tests
npm run contract-abi:demo   # See the Contract ABI fetcher in action
```

### Documentation

For complete documentation, see [src/CONTRACT-ABI.md](./src/CONTRACT-ABI.md)

### Chain Support

Works with any EVM-compatible blockchain with an Etherscan-compatible API:

```javascript
// Ethereum Mainnet
const ethFetcher = new ContractABIFetcher('YOUR_API_KEY', 1);

// Base Mainnet
const baseFetcher = new ContractABIFetcher('YOUR_API_KEY', 8453);

// Polygon Mainnet
const polygonFetcher = new ContractABIFetcher('YOUR_API_KEY', 137);
npm run test:token-history      # Run token history tests
npm run token-history:demo      # See the tracker in action
```

### Example Output

**Git-Style Log:**
```
commit 0000000059141cf6
Author: 0x1234567890123456789012345678901234567890
Date:   2021-01-01T00:00:00.000Z

    Transfer token #1234 from 0x0000... to 0x1234...
    
    Transaction: 0xabc123...
    Block: 11565019
```

**Short Log:**
```
00000000 - Token #1234: 0x00000000... → 0x12345678...
00000000 - Token #5678: 0xabcdefab... → 0x12345678...
```

**Statistics:**
```json
{
  "totalTransfers": 4,
  "uniqueTokens": 3,
  "uniqueAddresses": 5,
  "currentOwners": 3,
  "contract": "0xbc4ca0...",
  "trackedOwner": "kushmanmb"
}
```

---

## 🎨 ERC-721 Token Fetcher

This repository includes a comprehensive ERC-721 (NFT) token fetching module for interacting with Non-Fungible Tokens on blockchain networks.

### Quick Start

```javascript
const ERC721Fetcher = require('./src/erc721');

// Create a fetcher for an NFT contract
const fetcher = new ERC721Fetcher('0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D');

// Get token owner
const owner = await fetcher.getOwner(123);
console.log(`Token #123 owner: ${owner.owner}`);

// Get token metadata
const metadata = await fetcher.getTokenMetadata(123);
console.log(`Token name: ${metadata.name}`);

// Check balance
const balance = await fetcher.getBalance('0xYourAddress');
console.log(`Balance: ${balance.balance} tokens`);
```

### Features

- 🎯 **ERC-721 Standard**: Full support for ERC-721 read functions
- 🔍 **Token Information**: Fetch owner, URI, metadata, and more
- 📊 **Collection Data**: Get name, symbol, and total supply
- ✅ **Validation**: Built-in address and token ID validation
- 💾 **Caching**: Automatic metadata caching for performance
- 🌐 **Network Agnostic**: Works with Ethereum, Base, Polygon, and more
- 📚 **ABI Access**: Direct access to function ABIs and signatures

### Available Functions

- `getBalance(address)` - Get token balance for an address
- `getOwner(tokenId)` - Get the owner of a specific token
- `getTokenURI(tokenId)` - Get the metadata URI for a token
- `getTokenMetadata(tokenId)` - Fetch and parse token metadata
- `getCollectionName()` - Get the NFT collection name
- `getCollectionSymbol()` - Get the collection symbol
- `getTotalSupply()` - Get total supply of tokens
- `verifyOwnership(address, tokenId)` - Verify if an address owns a token
- `getTokenInfo(tokenId)` - Get comprehensive token information

### Testing & Demo

```bash
npm run test:erc721   # Run ERC-721 tests
npm run erc721:demo   # See the ERC-721 fetcher in action
```

### Documentation

For complete documentation, see [src/ERC721.md](./src/ERC721.md)

### Network Support

Works with any EVM-compatible blockchain:

```javascript
// Ethereum Mainnet
const ethFetcher = new ERC721Fetcher(
  '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
  'https://ethereum.publicnode.com'
);

// Base Mainnet
const baseFetcher = new ERC721Fetcher(
  '0x1234567890123456789012345678901234567890',
  'https://mainnet.base.org'
);
```

---

## 🔐 Ownership Status & Verification
**Name:** Matthew Brace  
**GitHub:** [@Kushmanmb](https://github.com/Kushmanmb)  
**Verification:** kushmanmb.eth | [kushmanmb.org](https://kushmanmb.org)  
**Contact:** [kushmanmb@gmx.com](mailto:kushmanmb@gmx.com)

**Mission Statement:** *Empowering crypto clarity, fueled by innovation and style—relaxing, investing and leveling up, one stat at a time*

---

## 📡 Blockchain Network Documentation

### Base Chain (Chain ID: 8453)
**Network:** Base Mainnet  
**Chain ID:** 8453  
**Network Type:** Layer 2 (Optimistic Rollup)  
**Built on:** Ethereum  
**Developed by:** Coinbase

**Verified RPC Endpoints:**
- `https://mainnet.base.org`
- `https://base.llamarpc.com`
- `https://base-mainnet.public.blastapi.io`

**Block Explorers:**
- [BaseScan](https://basescan.org) - Official Block Explorer
- [Base Explorer](https://base.blockscout.com)

**Network Details:**
- Native Currency: ETH (Ether)
- Block Time: ~2 seconds
- Status: Production (Mainnet)
- Launch Date: August 2023

**Key Features:**
- Low transaction fees
- Fast confirmation times
- EVM-compatible
- Secured by Ethereum mainnet
- Developer-friendly infrastructure

---

### Ethereum Mainnet
**Network:** Ethereum Mainnet  
**Chain ID:** 1  
**Consensus:** Proof of Stake (PoS)  
**Launch Date:** July 30, 2015

**Verified RPC Endpoints:**
- `https://ethereum.publicnode.com`
- `https://eth.llamarpc.com`
- `https://rpc.ankr.com/eth`
- `https://cloudflare-eth.com`

**Block Explorers:**
- [Etherscan](https://etherscan.io) - Primary Block Explorer
- [Blockscout](https://eth.blockscout.com)
- [Etherchain](https://etherchain.org)

**Network Details:**
- Native Currency: ETH (Ether)
- Block Time: ~12 seconds
- Total Supply: No fixed cap
- Consensus Layer: Beacon Chain

**Key Features:**
- Most established smart contract platform
- Largest developer ecosystem
- Proof of Stake consensus (post-Merge)
- Home to thousands of dApps and DeFi protocols
- EVM (Ethereum Virtual Machine) standard

---

### Beacon Chain (Ethereum Consensus Layer)
**Network:** Ethereum Beacon Chain  
**Type:** Consensus Layer (Proof of Stake)  
**Launch Date:** December 1, 2020  
**Merge Date:** September 15, 2022

**Verified Endpoints:**
- Beacon Chain API: `https://beaconcha.in`
- Consensus Node: Various client implementations (Prysm, Lighthouse, Teku, Nimbus, Lodestar)

**Block Explorers:**
- [Beaconcha.in](https://beaconcha.in) - Official Beacon Chain Explorer
- [BeaconScan](https://beaconscan.com)

**Network Details:**
- Consensus Mechanism: Proof of Stake (PoS)
- Slot Time: 12 seconds
- Epoch: 32 slots (~6.4 minutes)
- Minimum Stake: 32 ETH per validator
- Annual Staking Rewards: Variable (see [Beaconcha.in](https://beaconcha.in) for current APR)

**Key Features:**
- Coordinates network validators
- Manages staking and rewards
- Provides finality to Ethereum blocks
- Energy-efficient consensus (99.95% reduction vs PoW)
- Active validator network (see [Beaconcha.in](https://beaconcha.in) for current count)

**Staking Information:**
- Minimum: 32 ETH to run a validator
- Liquid Staking: Available through protocols (Lido, Rocket Pool, etc.)
- Withdrawal Address: Must be set for validator rewards
- Slashing: Penalties for validator misbehavior

---

## ✅ Verification Sources

All blockchain information has been verified through official documentation:
- **Base:** [base.org/docs](https://docs.base.org)
- **Ethereum:** [ethereum.org](https://ethereum.org)
- **Beacon Chain:** [ethereum.org/upgrades](https://ethereum.org/en/upgrades/)

**Chain Registry:**
- [ChainList](https://chainlist.org) - Verified chain IDs and RPC endpoints
- [Ethereum Lists](https://github.com/ethereum-lists/chains)

---

## 📢 Repository Announcement

**This repository is owned, maintained, and curated by Kushmanmb (Matthew Brace)**

All content, documentation, and blockchain information presented here represents verified research and careful curation by the owner. This project demonstrates commitment to:

- 🎯 **Accurate blockchain documentation**
- 🔒 **Verified network information**
- 🚀 **Innovation in crypto clarity**
- 📚 **Educational resources for the community**

For questions, collaborations, or inquiries, please reach out via:
- 📧 Email: [kushmanmb@gmx.com](mailto:kushmanmb@gmx.com)
- 🌐 Website: [kushmanmb.org](https://kushmanmb.org)
- 🏷️ ENS: kushmanmb.eth

---

<div align="center">

**-Big-world-Bigger-ideas-**  
*WWJD*

![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=flat-square)
![By Kushmanmb](https://img.shields.io/badge/By-Kushmanmb-blue?style=flat-square&logo=github)

**© 2024-2026 Matthew Brace (kushmanmb) | All Rights Reserved**

</div>
