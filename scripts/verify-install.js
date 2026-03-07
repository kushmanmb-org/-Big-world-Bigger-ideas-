#!/usr/bin/env node

/**
 * Package Installation Verification Script
 *
 * Verifies that the big-world-bigger-ideas package loads correctly and
 * exposes the expected exports. Run after `npm ci` to validate the installation.
 *
 * Usage: node scripts/verify-install.js
 */

'use strict';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ ${message}`);
    failed++;
  }
}

console.log('\n🔍 Verifying big-world-bigger-ideas installation...\n');

// ── Load the package ──────────────────────────────────────────────────────────
let pkg;
try {
  pkg = require('../index.js');
  console.log('✅ Package loaded successfully\n');
} catch (err) {
  console.error('❌ Failed to load package:', err.message);
  process.exit(1);
}

// ── Core exports ──────────────────────────────────────────────────────────────
console.log('Checking core exports...');
assert(typeof pkg === 'object' && pkg !== null, 'package exports an object');

const expectedExports = [
  'wallet',
  'featureFlags',
  'ERC721Fetcher',
  'ERC20Fetcher',
  'TokenHistoryTracker',
  'BitcoinMiningFetcher',
  'LitecoinBlockchairFetcher',
  'ISO27001Fetcher',
  'ConsensusTracker',
  'AddressTracker',
  'AddressConsolidator',
  'PackageMetadata',
  'ZKPDFVerifier',
  'ContractABIFetcher',
  'BlockchainCouncil',
  'OPReturnFetcher',
  'EthCallClient',
  'WithdrawalCredentials',
  'BlockchairFetcher',
  'EthereumBlockchairFetcher',
  'EtherscanTokenBalanceFetcher',
  'HelloBitcoin',
  'TokenUUID',
  'Resolver',
  'TokenManager',
];

console.log('\nChecking expected module exports...');
for (const name of expectedExports) {
  assert(name in pkg, `exports '${name}'`);
}

// ── Spot-check a few modules ──────────────────────────────────────────────────
console.log('\nSpot-checking module types...');
assert(typeof pkg.wallet === 'function', 'wallet is a constructor (class Wallet)');
assert(typeof pkg.ERC721Fetcher === 'function', 'ERC721Fetcher is a constructor/class');
assert(typeof pkg.ERC20Fetcher === 'function', 'ERC20Fetcher is a constructor/class');
assert(typeof pkg.BitcoinMiningFetcher === 'function', 'BitcoinMiningFetcher is a constructor/class');
assert(typeof pkg.HelloBitcoin === 'function', 'HelloBitcoin is a constructor/class');
assert(typeof pkg.TokenUUID === 'function', 'TokenUUID is a constructor/class');

// ── Summary ───────────────────────────────────────────────────────────────────
console.log('\n================================================');
console.log(`Total Checks: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log('================================================\n');

if (failed > 0) {
  console.error(`❌ ${failed} check(s) failed. Installation may be incomplete.`);
  process.exit(1);
}

console.log('✅ All installation checks passed!');
