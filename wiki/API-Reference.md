# API Reference

Complete API documentation for all modules in Big World Bigger Ideas.

## 📚 Module Overview

- [ERC-721 Token Fetcher](#erc-721-token-fetcher)
- [Bitcoin Mining Fetcher](#bitcoin-mining-fetcher)
- [Token History Tracker](#token-history-tracker)
- [Feature Flags](#feature-flags)
- [Wallet Utilities](#wallet-utilities)
- [Consensus Tracker](#consensus-tracker)
- [Address Tracker](#address-tracker)
- [Blockchain Council](#blockchain-council)
- [ZK-PDF Verifier](#zk-pdf-verifier)
- [ISO 27001 Manager](#iso-27001-manager)
- [Litecoin Blockchair](#litecoin-blockchair)
- [Contract ABI](#contract-abi)

---

## ERC-721 Token Fetcher

### Constructor

```javascript
new ERC721Fetcher(contractAddress, rpcUrl?)
```

**Parameters:**
- `contractAddress` (string): ERC-721 contract address
- `rpcUrl` (string, optional): Custom RPC URL

### Methods

#### `getOwner(tokenId)`
Get the owner of a token.

**Returns:** `Promise<{owner: string, contractAddress: string, tokenId: string}>`

#### `getBalance(address)`
Get token balance for an address.

**Returns:** `Promise<{address: string, balance: string, contractAddress: string}>`

#### `getTokenMetadata(tokenId)`
Get comprehensive token metadata.

**Returns:** `Promise<{tokenId: string, name: string, symbol: string, tokenURI: string, contractAddress: string}>`

#### `getName()`
Get collection name.

**Returns:** `Promise<{name: string, contractAddress: string}>`

#### `getSymbol()`
Get collection symbol.

**Returns:** `Promise<{symbol: string, contractAddress: string}>`

#### `getTokenURI(tokenId)`
Get token URI.

**Returns:** `Promise<{tokenURI: string, tokenId: string, contractAddress: string}>`

---

## Bitcoin Mining Fetcher

### Constructor

```javascript
new BitcoinMiningFetcher(cacheTimeout?)
```

**Parameters:**
- `cacheTimeout` (number, optional): Cache timeout in seconds (default: 60)

### Methods

#### `getHashRate(timePeriod)`
Get hash rate statistics.

**Parameters:**
- `timePeriod` (string): '1d', '3d', '1w', '1m', '3m', '6m', '1y', '2y', '3y', 'all'

**Returns:** `Promise<{currentHashRate: number, avgHashRate: number, timestamp: number, timePeriod: string}>`

#### `getDifficulty(timePeriod)`
Get mining difficulty statistics.

**Returns:** `Promise<{currentDifficulty: number, difficultyChange: number, timestamp: number, timePeriod: string}>`

#### `getBlockStats(timePeriod)`
Get block production statistics.

**Returns:** `Promise<{blockCount: number, avgBlockTime: number, timestamp: number, timePeriod: string}>`

#### `getAllStats(timePeriod)`
Get comprehensive mining statistics.

**Returns:** `Promise<{hashRate: object, difficulty: object, blocks: object, timePeriod: string, timestamp: number}>`

#### `clearCache()`
Clear cached data.

---

## Token History Tracker

### Constructor

```javascript
new TokenHistoryTracker(contractAddress, tokenId, rpcUrl?)
```

**Parameters:**
- `contractAddress` (string): ERC-721 contract address
- `tokenId` (number|string): Token ID
- `rpcUrl` (string, optional): Custom RPC URL

### Methods

#### `trackOwnership()`
Track ownership changes over time.

**Returns:** `Promise<{history: Array, currentOwner: string, totalTransfers: number}>`

#### `getOwnershipHistory()`
Get complete ownership history.

**Returns:** `Array<{owner: string, timestamp: number, blockNumber: number}>`

#### `getCurrentOwner()`
Get current token owner.

**Returns:** `Promise<string>`

---

## Feature Flags

### Methods

#### `setFlag(flagName, value)`
Set a feature flag.

**Parameters:**
- `flagName` (string): Flag name
- `value` (boolean): Enable (true) or disable (false)

**Returns:** `object` - Updated flags

#### `getFlag(flagName)`
Get feature flag value.

**Parameters:**
- `flagName` (string): Flag name

**Returns:** `boolean` - Flag value (defaults to false)

#### `listFlags()`
List all feature flags.

**Returns:** `object` - All flags and metadata

#### `removeFlag(flagName)`
Remove a feature flag.

**Parameters:**
- `flagName` (string): Flag name

**Returns:** `object` - Updated flags

#### `hasFlag(flagName)`
Check if flag exists.

**Parameters:**
- `flagName` (string): Flag name

**Returns:** `boolean`

---

## Wallet Utilities

### Methods

#### `encryptWallet(privateKey, password)`
Encrypt a wallet private key.

**Parameters:**
- `privateKey` (string): Wallet private key
- `password` (string): Encryption password

**Returns:** `string` - Encrypted wallet data

#### `decryptWallet(encryptedData, password)`
Decrypt wallet data.

**Parameters:**
- `encryptedData` (string): Encrypted wallet data
- `password` (string): Decryption password

**Returns:** `string` - Decrypted private key

---

## Consensus Tracker

### Constructor

```javascript
new ConsensusTracker()
```

### Methods

#### `addChain(chainName, consensusType, details)`
Add a blockchain to track.

**Parameters:**
- `chainName` (string): Chain name
- `consensusType` (string): 'PoW', 'PoS', 'PoA', etc.
- `details` (object): Additional details

#### `getChain(chainName)`
Get chain information.

**Returns:** `object` - Chain details

#### `listChains()`
List all tracked chains.

**Returns:** `Array<object>`

#### `updateConsensus(chainName, newConsensusType)`
Update consensus mechanism.

**Parameters:**
- `chainName` (string): Chain name
- `newConsensusType` (string): New consensus type

---

## Address Tracker

### Constructor

```javascript
new AddressTracker()
```

### Methods

#### `addAddress(address, label, chains)`
Add an address to track.

**Parameters:**
- `address` (string): Blockchain address
- `label` (string): Address label
- `chains` (Array<string>): Chains to track

#### `getAddress(address)`
Get address information.

**Returns:** `object` - Address details

#### `listAddresses()`
List all tracked addresses.

**Returns:** `Array<object>`

#### `removeAddress(address)`
Remove an address.

**Parameters:**
- `address` (string): Address to remove

---

## Blockchain Council

### Constructor

```javascript
new BlockchainCouncil(name)
```

**Parameters:**
- `name` (string): Council name

### Methods

#### `addMember(address, name, role)`
Add council member.

**Parameters:**
- `address` (string): Member address
- `name` (string): Member name
- `role` (string): Member role

#### `createProposal(proposer, title, description)`
Create a proposal.

**Parameters:**
- `proposer` (string): Proposer address
- `title` (string): Proposal title
- `description` (string): Proposal description

**Returns:** `string` - Proposal ID

#### `vote(proposalId, voter, inFavor)`
Vote on proposal.

**Parameters:**
- `proposalId` (string): Proposal ID
- `voter` (string): Voter address
- `inFavor` (boolean): Vote yes/no

#### `getProposal(proposalId)`
Get proposal details.

**Returns:** `object` - Proposal information

---

## ZK-PDF Verifier

### Constructor

```javascript
new ZKPDFVerifier(issuerName)
```

**Parameters:**
- `issuerName` (string): Document issuer name

### Methods

#### `registerDocument(docId, pdfBuffer, metadata)`
Register a PDF document.

**Parameters:**
- `docId` (string): Document ID
- `pdfBuffer` (Buffer): PDF file buffer
- `metadata` (object): Document metadata

**Returns:** `object` - Document proof

#### `verifyDocument(docId, proof)`
Verify a document.

**Parameters:**
- `docId` (string): Document ID
- `proof` (object): Document proof

**Returns:** `boolean` - Verification result

---

## ISO 27001 Manager

### Constructor

```javascript
new ISO27001Manager(organizationName)
```

**Parameters:**
- `organizationName` (string): Organization name

### Methods

#### `addControl(controlId, description, status)`
Add ISO 27001 control.

**Parameters:**
- `controlId` (string): Control ID
- `description` (string): Control description
- `status` (string): Implementation status

#### `getControl(controlId)`
Get control details.

**Returns:** `object` - Control information

#### `listControls()`
List all controls.

**Returns:** `Array<object>`

#### `updateControlStatus(controlId, newStatus)`
Update control status.

**Parameters:**
- `controlId` (string): Control ID
- `newStatus` (string): New status

---

## Litecoin Blockchair

### Constructor

```javascript
new LitecoinBlockchairFetcher(apiKey?)
```

**Parameters:**
- `apiKey` (string, optional): Blockchair API key

### Methods

#### `getBlockchainStats()`
Get Litecoin blockchain statistics.

**Returns:** `Promise<object>` - Blockchain stats

#### `getAddressInfo(address)`
Get address information.

**Parameters:**
- `address` (string): Litecoin address

**Returns:** `Promise<object>` - Address details

#### `getTransaction(txHash)`
Get transaction details.

**Parameters:**
- `txHash` (string): Transaction hash

**Returns:** `Promise<object>` - Transaction information

---

## Contract ABI

### Methods

#### `getABI(contractAddress)`
Get contract ABI.

**Parameters:**
- `contractAddress` (string): Contract address

**Returns:** `Promise<Array>` - Contract ABI

#### `parseABI(abi)`
Parse ABI structure.

**Parameters:**
- `abi` (Array): Contract ABI

**Returns:** `object` - Parsed ABI functions and events

---

## 🔗 Related Documentation

- [Getting Started](Getting-Started) - Installation and setup
- [Examples & Use Cases](Examples-and-Use-Cases) - Real-world examples
- [Testing Guide](Testing-Guide) - Testing documentation

---

For detailed module documentation, see the individual module pages linked from the [Home](Home) page.
