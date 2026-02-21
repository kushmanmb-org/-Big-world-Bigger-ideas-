/**
 * Consensus Tracker Module Tests
 * Tests for consensus mechanism tracking across blockchain networks
 */

const { ConsensusTracker, CONSENSUS_TYPES } = require('./consensus-tracker.js');

// Test utilities
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ ${message}`);
    testsPassed++;
  } else {
    console.error(`✗ ${message}`);
    testsFailed++;
  }
}

function assertEqual(actual, expected, message) {
  if (actual === expected) {
    console.log(`✓ ${message}`);
    testsPassed++;
  } else {
    console.error(`✗ ${message}`);
    console.error(`  Expected: ${expected}`);
    console.error(`  Actual: ${actual}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log('Running Consensus Tracker Module Tests...\n');
  console.log('='.repeat(50));

  // Test 1: Constructor
  console.log('\n📦 Testing Constructor...');
  try {
    const tracker = new ConsensusTracker();
    assert(tracker !== null, 'Should create tracker instance');
    assert(tracker.networks !== null, 'Should have networks object');
    assert(tracker.consensusTypes !== null, 'Should have consensus types');
  } catch (error) {
    assert(false, `Constructor test failed: ${error.message}`);
  }

  // Test 2: Get Network Info - Bitcoin (PoW)
  console.log('\n₿ Testing Bitcoin Network Info (PoW)...');
  try {
    const tracker = new ConsensusTracker();
    const bitcoin = tracker.getNetworkInfo('bitcoin');
    assert(bitcoin !== null, 'Should return Bitcoin network info');
    assertEqual(bitcoin.name, 'Bitcoin', 'Bitcoin name should be correct');
    assertEqual(bitcoin.consensus, CONSENSUS_TYPES.POW, 'Bitcoin should use PoW');
    assertEqual(bitcoin.symbol, 'BTC', 'Bitcoin symbol should be BTC');
    assert(bitcoin.details.energyIntensive === true, 'Bitcoin should be energy intensive');
  } catch (error) {
    assert(false, `Bitcoin test failed: ${error.message}`);
  }

  // Test 3: Get Network Info - Ethereum (PoS)
  console.log('\n⟠ Testing Ethereum Network Info (PoS)...');
  try {
    const tracker = new ConsensusTracker();
    const ethereum = tracker.getNetworkInfo('ethereum');
    assert(ethereum !== null, 'Should return Ethereum network info');
    assertEqual(ethereum.name, 'Ethereum', 'Ethereum name should be correct');
    assertEqual(ethereum.consensus, CONSENSUS_TYPES.POS, 'Ethereum should use PoS');
    assertEqual(ethereum.symbol, 'ETH', 'Ethereum symbol should be ETH');
    assertEqual(ethereum.chainId, 1, 'Ethereum chain ID should be 1');
    assert(ethereum.details.energyEfficient === true, 'Ethereum should be energy efficient');
    assert(ethereum.mergeDate !== undefined, 'Ethereum should have merge date');
  } catch (error) {
    assert(false, `Ethereum test failed: ${error.message}`);
  }

  // Test 4: Invalid Network
  console.log('\n⚠️  Testing Invalid Network...');
  try {
    const tracker = new ConsensusTracker();
    tracker.getNetworkInfo('invalid_network');
    assert(false, 'Should throw error for invalid network');
  } catch (error) {
    assert(error.message.includes('not found'), 'Should throw "not found" error');
  }

  // Test 5: Get PoW Networks
  console.log('\n⛏️  Testing Get PoW Networks...');
  try {
    const tracker = new ConsensusTracker();
    const powNetworks = tracker.getPowNetworks();
    assert(Array.isArray(powNetworks), 'Should return an array');
    assert(powNetworks.length > 0, 'Should have at least one PoW network');
    const bitcoinInList = powNetworks.some(n => n.name === 'Bitcoin');
    assert(bitcoinInList, 'Bitcoin should be in PoW networks');
    const allPoW = powNetworks.every(n => n.consensus === CONSENSUS_TYPES.POW);
    assert(allPoW, 'All networks should use PoW');
  } catch (error) {
    assert(false, `PoW networks test failed: ${error.message}`);
  }

  // Test 6: Get PoS Networks
  console.log('\n🔒 Testing Get PoS Networks...');
  try {
    const tracker = new ConsensusTracker();
    const posNetworks = tracker.getPosNetworks();
    assert(Array.isArray(posNetworks), 'Should return an array');
    assert(posNetworks.length > 0, 'Should have at least one PoS network');
    const ethereumInList = posNetworks.some(n => n.name === 'Ethereum');
    assert(ethereumInList, 'Ethereum should be in PoS networks');
    const allPoS = posNetworks.every(n => n.consensus === CONSENSUS_TYPES.POS);
    assert(allPoS, 'All networks should use PoS');
  } catch (error) {
    assert(false, `PoS networks test failed: ${error.message}`);
  }

  // Test 7: Get All Networks
  console.log('\n🌐 Testing Get All Networks...');
  try {
    const tracker = new ConsensusTracker();
    const allNetworks = tracker.getAllNetworks();
    assert(Array.isArray(allNetworks), 'Should return an array');
    assert(allNetworks.length > 0, 'Should have multiple networks');
    assert(allNetworks.every(n => n.id !== undefined), 'All networks should have an id');
    assert(allNetworks.every(n => n.name !== undefined), 'All networks should have a name');
    assert(allNetworks.every(n => n.consensus !== undefined), 'All networks should have consensus');
  } catch (error) {
    assert(false, `Get all networks test failed: ${error.message}`);
  }

  // Test 8: Get Consensus Statistics
  console.log('\n📊 Testing Consensus Statistics...');
  try {
    const tracker = new ConsensusTracker();
    const stats = tracker.getConsensusStatistics();
    assert(stats.totalNetworks > 0, 'Should have total networks count');
    assert(stats.byConsensus !== undefined, 'Should have consensus breakdown');
    assert(stats.averageBlockTime >= 0, 'Should calculate average block time');
    assert(stats.energyEfficient >= 0, 'Should count energy efficient networks');
    assert(stats.energyIntensive >= 0, 'Should count energy intensive networks');
  } catch (error) {
    assert(false, `Statistics test failed: ${error.message}`);
  }

  // Test 9: Compare Networks
  console.log('\n🔄 Testing Network Comparison...');
  try {
    const tracker = new ConsensusTracker();
    const comparison = tracker.compareNetworks('bitcoin', 'ethereum');
    assert(comparison.networks.length === 2, 'Should compare two networks');
    assert(comparison.consensus.length === 2, 'Should have two consensus types');
    assertEqual(comparison.sameConsensus, false, 'Bitcoin and Ethereum should have different consensus');
    assert(comparison.blockTime !== undefined, 'Should compare block times');
    assert(comparison.comparison !== undefined, 'Should have comparison details');
  } catch (error) {
    assert(false, `Comparison test failed: ${error.message}`);
  }

  // Test 10: Is Proof of Work
  console.log('\n✅ Testing isProofOfWork...');
  try {
    const tracker = new ConsensusTracker();
    assertEqual(tracker.isProofOfWork('bitcoin'), true, 'Bitcoin should be PoW');
    assertEqual(tracker.isProofOfWork('ethereum'), false, 'Ethereum should not be PoW');
    assertEqual(tracker.isProofOfWork('litecoin'), true, 'Litecoin should be PoW');
  } catch (error) {
    assert(false, `isProofOfWork test failed: ${error.message}`);
  }

  // Test 11: Is Proof of Stake
  console.log('\n✅ Testing isProofOfStake...');
  try {
    const tracker = new ConsensusTracker();
    assertEqual(tracker.isProofOfStake('ethereum'), true, 'Ethereum should be PoS');
    assertEqual(tracker.isProofOfStake('bitcoin'), false, 'Bitcoin should not be PoS');
    assertEqual(tracker.isProofOfStake('base'), true, 'Base should be PoS');
  } catch (error) {
    assert(false, `isProofOfStake test failed: ${error.message}`);
  }

  // Test 12: Format Network Info
  console.log('\n📝 Testing Format Network Info...');
  try {
    const tracker = new ConsensusTracker();
    const formatted = tracker.formatNetworkInfo('bitcoin');
    assert(typeof formatted === 'string', 'Should return a string');
    assert(formatted.includes('Bitcoin'), 'Should include network name');
    assert(formatted.includes('Proof of Work'), 'Should include consensus type');
    assert(formatted.includes('Details:'), 'Should include details section');
  } catch (error) {
    assert(false, `Format network info test failed: ${error.message}`);
  }

  // Test 13: Get Consensus Summary
  console.log('\n📋 Testing Consensus Summary...');
  try {
    const tracker = new ConsensusTracker();
    const summary = tracker.getConsensusSummary();
    assert(typeof summary === 'string', 'Should return a string');
    assert(summary.includes('Total Networks'), 'Should include total networks');
    assert(summary.includes('Proof of Work'), 'Should include PoW information');
    assert(summary.includes('Proof of Stake'), 'Should include PoS information');
  } catch (error) {
    assert(false, `Consensus summary test failed: ${error.message}`);
  }

  // Test 14: JSON Export
  console.log('\n💾 Testing JSON Export...');
  try {
    const tracker = new ConsensusTracker();
    const json = tracker.toJSON();
    assert(typeof json === 'string', 'Should return JSON string');
    const parsed = JSON.parse(json);
    assert(typeof parsed === 'object', 'Should parse to object');
    assert(parsed.bitcoin !== undefined, 'Should include Bitcoin');
    assert(parsed.ethereum !== undefined, 'Should include Ethereum');
  } catch (error) {
    assert(false, `JSON export test failed: ${error.message}`);
  }

  // Test 15: Case Insensitive Network Names
  console.log('\n🔤 Testing Case Insensitive Network Names...');
  try {
    const tracker = new ConsensusTracker();
    const bitcoin1 = tracker.getNetworkInfo('Bitcoin');
    const bitcoin2 = tracker.getNetworkInfo('BITCOIN');
    const bitcoin3 = tracker.getNetworkInfo('bitcoin');
    assertEqual(bitcoin1.name, bitcoin2.name, 'Should handle uppercase');
    assertEqual(bitcoin2.name, bitcoin3.name, 'Should handle lowercase');
  } catch (error) {
    assert(false, `Case insensitive test failed: ${error.message}`);
  }

  // Test 16: Network with Chain ID
  console.log('\n🔗 Testing Networks with Chain IDs...');
  try {
    const tracker = new ConsensusTracker();
    const ethereum = tracker.getNetworkInfo('ethereum');
    const base = tracker.getNetworkInfo('base');
    assert(ethereum.chainId === 1, 'Ethereum should have chain ID 1');
    assert(base.chainId === 8453, 'Base should have chain ID 8453');
  } catch (error) {
    assert(false, `Chain ID test failed: ${error.message}`);
  }

  // Test 17: Beacon Chain Specifics
  console.log('\n🔗 Testing Beacon Chain Network...');
  try {
    const tracker = new ConsensusTracker();
    const beacon = tracker.getNetworkInfo('beacon');
    assertEqual(beacon.consensus, CONSENSUS_TYPES.POS, 'Beacon should use PoS');
    assert(beacon.details.slotsPerEpoch === 32, 'Should have 32 slots per epoch');
    assert(beacon.details.minimumStake === 32, 'Should require 32 ETH minimum stake');
  } catch (error) {
    assert(false, `Beacon chain test failed: ${error.message}`);
  }

  // Final Summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Summary:');
  console.log(`✓ Passed: ${testsPassed}`);
  console.log(`✗ Failed: ${testsFailed}`);
  console.log(`Total: ${testsPassed + testsFailed}`);
  console.log('\n' + '='.repeat(50));

  if (testsFailed === 0) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log(`\n❌ ${testsFailed} test(s) failed!`);
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
