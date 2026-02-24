/**
 * Big World Bigger Ideas - Blockchain Documentation and Crypto Clarity Platform
 * 
 * A comprehensive toolkit for working with blockchain networks, NFTs, 
 * cryptocurrency data, and ISO 27001 certification management.
 * 
 * @module big-world-bigger-ideas
 * @author Matthew Brace <kushmanmb@gmx.com>
 * @license ISC
 */

// Wallet utilities
const wallet = require('./src/wallet.js');

// Feature flags management
const featureFlags = require('./src/feature-flags.js');

// ERC-721 NFT token utilities
const ERC721Fetcher = require('./src/erc721.js');

// NFT ownership history tracker
const { TokenHistoryTracker, OwnershipEvent } = require('./src/token-history.js');

// Bitcoin mining data
const BitcoinMiningFetcher = require('./src/bitcoin-mining.js');

// Litecoin blockchain data
const LitecoinBlockchairFetcher = require('./src/litecoin-blockchair.js');

// ISO 27001 certification management
const ISO27001Fetcher = require('./src/iso27001.js');

// Consensus mechanism tracking
const { ConsensusTracker, CONSENSUS_TYPES, BLOCKCHAIN_NETWORKS } = require('./src/consensus-tracker.js');

// Address tracking and management
const { AddressTracker, AddressInfo } = require('./src/address-tracker.js');

// Metadata utilities
const PackageMetadata = require('./src/metadata.js');

// Zero-knowledge PDF verification
const ZKPDFVerifier = require('./src/zkpdf.js');

// Contract ABI fetcher
const ContractABIFetcher = require('./src/contract-abi.js');

// Blockchain Council governance
const { BlockchainCouncil, MEMBER_ROLES, PROPOSAL_STATUS } = require('./src/blockchain-council.js');

// Beacon Chain data
const BeaconChainFetcher = require('./src/beaconchain.js');

/**
 * Main exports for the package
 */
module.exports = {
  // Wallet utilities
  wallet,
  
  // Feature flags (exported as object with methods)
  featureFlags,
  
  // NFT and token utilities
  ERC721Fetcher,
  TokenHistoryTracker,
  OwnershipEvent,
  
  // Blockchain data fetchers
  BitcoinMiningFetcher,
  LitecoinBlockchairFetcher,
  
  // Compliance and certification
  ISO27001Fetcher,
  
  // Network and consensus tracking
  ConsensusTracker,
  CONSENSUS_TYPES,
  BLOCKCHAIN_NETWORKS,
  
  // Address tracking
  AddressTracker,
  AddressInfo,
  
  // Metadata utilities
  PackageMetadata,
  
  // Zero-knowledge proofs
  ZKPDFVerifier,
  
  // Contract utilities
  ContractABIFetcher,

  // Governance and council management
  BlockchainCouncil,
  MEMBER_ROLES,
  PROPOSAL_STATUS,

  // Beacon Chain (ETH 2.0) data
  BeaconChainFetcher
};
