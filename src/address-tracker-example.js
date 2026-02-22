/**
 * Address Tracker Demo
 * Demonstrates the functionality of the Address Tracker module
 */

const { AddressTracker } = require('./address-tracker.js');

console.log('='.repeat(70));
console.log('📍 Crypto Address Tracker Demo');
console.log('='.repeat(70));

// Create an address tracker for kushmanmb
const tracker = new AddressTracker('kushmanmb');

// Demo 1: Add addresses to track
console.log('\n➕ Adding Addresses to Track:\n');

const ethereumAddress = '0x1234567890123456789012345678901234567890';
const baseAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
const polygonAddress = '0x9876543210987654321098765432109876543210';

tracker.addAddress(ethereumAddress, 'ethereum', 'Main Ethereum Wallet');
console.log(`✓ Added Ethereum address: ${ethereumAddress}`);

tracker.addAddress(baseAddress, 'base', 'Base L2 Wallet');
console.log(`✓ Added Base address: ${baseAddress}`);

tracker.addAddress(polygonAddress, 'polygon', 'Polygon Wallet');
console.log(`✓ Added Polygon address: ${polygonAddress}`);

// Demo 2: Record some tokens
console.log('\n' + '='.repeat(70));
console.log('\n🎨 Recording NFT Tokens:\n');

tracker.recordToken(ethereumAddress, {
  tokenId: '1234',
  contract: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
  name: 'Bored Ape Yacht Club',
  symbol: 'BAYC'
});
console.log('✓ Recorded BAYC #1234 on Ethereum address');

tracker.recordToken(ethereumAddress, {
  tokenId: '5678',
  contract: '0xED5AF388653567Af2F388E6224dC7C4b3241C544',
  name: 'Azuki',
  symbol: 'AZUKI'
});
console.log('✓ Recorded Azuki #5678 on Ethereum address');

tracker.recordToken(baseAddress, {
  tokenId: '999',
  contract: '0x1111111111111111111111111111111111111111',
  name: 'Base NFT Collection',
  symbol: 'BNC'
});
console.log('✓ Recorded Base NFT #999 on Base address');

// Demo 3: Record some transactions
console.log('\n' + '='.repeat(70));
console.log('\n💸 Recording Transactions:\n');

tracker.recordTransaction(ethereumAddress, {
  hash: '0xabc123def456',
  from: ethereumAddress,
  to: '0x9999999999999999999999999999999999999999',
  value: '1000000000000000000', // 1 ETH
  blockNumber: 18000000
});
console.log('✓ Recorded transaction: 1 ETH sent from Ethereum address');

tracker.recordTransaction(ethereumAddress, {
  hash: '0xdef789abc123',
  from: '0x8888888888888888888888888888888888888888',
  to: ethereumAddress,
  value: '500000000000000000', // 0.5 ETH
  blockNumber: 18000001
});
console.log('✓ Recorded transaction: 0.5 ETH received to Ethereum address');

// Demo 4: Get tokens for an address
console.log('\n' + '='.repeat(70));
console.log('\n🔍 Tokens Owned by Ethereum Address:\n');

const tokens = tracker.getTokensForAddress(ethereumAddress);
console.log(`Total Tokens: ${tokens.length}\n`);
tokens.forEach((token, index) => {
  console.log(`Token ${index + 1}:`);
  console.log(`  Name: ${token.name} (${token.symbol})`);
  console.log(`  Token ID: #${token.tokenId}`);
  console.log(`  Contract: ${token.contract}`);
  console.log('');
});

// Demo 5: Get transaction count
console.log('='.repeat(70));
console.log('\n📊 Transaction Count:\n');

const ethTxCount = tracker.getTransactionCount(ethereumAddress);
console.log(`Ethereum Address: ${ethTxCount} transactions`);

const baseTxCount = tracker.getTransactionCount(baseAddress);
console.log(`Base Address: ${baseTxCount} transactions`);

const polygonTxCount = tracker.getTransactionCount(polygonAddress);
console.log(`Polygon Address: ${polygonTxCount} transactions`);

// Demo 6: Get addresses by network
console.log('\n' + '='.repeat(70));
console.log('\n🌐 Addresses by Network:\n');

const ethAddresses = tracker.getAddressesByNetwork('ethereum');
console.log(`Ethereum Network: ${ethAddresses.length} address(es)`);
ethAddresses.forEach(addr => {
  console.log(`  • ${addr.address} (${addr.label})`);
});

const baseAddresses = tracker.getAddressesByNetwork('base');
console.log(`\nBase Network: ${baseAddresses.length} address(es)`);
baseAddresses.forEach(addr => {
  console.log(`  • ${addr.address} (${addr.label})`);
});

const polygonAddresses = tracker.getAddressesByNetwork('polygon');
console.log(`\nPolygon Network: ${polygonAddresses.length} address(es)`);
polygonAddresses.forEach(addr => {
  console.log(`  • ${addr.address} (${addr.label})`);
});

// Demo 7: Get all addresses
console.log('\n' + '='.repeat(70));
console.log('\n📋 All Tracked Addresses:\n');

const allAddresses = tracker.getAllAddresses();
console.log(`Total Addresses Tracked: ${allAddresses.length}\n`);
allAddresses.forEach((addr, index) => {
  console.log(`Address ${index + 1}:`);
  console.log(`  Address: ${addr.address}`);
  console.log(`  Network: ${addr.network}`);
  console.log(`  Label: ${addr.label}`);
  console.log(`  Tokens: ${addr.tokens.length}`);
  console.log(`  Transactions: ${addr.transactions.length}`);
  console.log('');
});

// Demo 8: Get statistics
console.log('='.repeat(70));
console.log(tracker.formatStatistics());

// Demo 9: Check if tracking
console.log('='.repeat(70));
console.log('\n✅ Address Tracking Status:\n');

console.log(`Is tracking Ethereum address: ${tracker.isTracking(ethereumAddress)}`);
console.log(`Is tracking Base address: ${tracker.isTracking(baseAddress)}`);
console.log(`Is tracking random address: ${tracker.isTracking('0x0000000000000000000000000000000000000000')}`);

// Demo 10: JSON export/import
console.log('\n' + '='.repeat(70));
console.log('\n💾 JSON Export/Import:\n');

const jsonData = tracker.toJSON();
console.log('✓ Exported tracking data to JSON');
console.log(`  Owner: ${jsonData.owner}`);
console.log(`  Addresses: ${jsonData.addresses.length}`);
console.log(`  Total Tokens: ${jsonData.statistics.totalTokens}`);
console.log(`  Total Transactions: ${jsonData.statistics.totalTransactions}`);

// Create a new tracker and import the data
const newTracker = new AddressTracker();
newTracker.fromJSON(jsonData);
console.log('\n✓ Imported tracking data to new tracker');
console.log(`  Owner: ${newTracker.owner}`);
console.log(`  Addresses: ${newTracker.getAllAddresses().length}`);

// Demo 11: Remove an address
console.log('\n' + '='.repeat(70));
console.log('\n➖ Removing an Address:\n');

console.log(`Addresses before removal: ${tracker.getAllAddresses().length}`);
const removed = tracker.removeAddress(polygonAddress);
console.log(`✓ Removed Polygon address: ${removed}`);
console.log(`Addresses after removal: ${tracker.getAllAddresses().length}`);
console.log(`Still tracking Polygon address: ${tracker.isTracking(polygonAddress)}`);

// Demo 12: Final statistics
console.log('\n' + '='.repeat(70));
console.log('\n📈 Final Statistics:\n');

const finalStats = tracker.getStatistics();
console.log(`Owner: ${finalStats.owner}`);
console.log(`Total Addresses: ${finalStats.totalAddresses}`);
console.log(`Networks Tracked: ${finalStats.networksTracked}`);
console.log(`Total Tokens: ${finalStats.totalTokens}`);
console.log(`Total Transactions: ${finalStats.totalTransactions}`);

console.log('\n' + '='.repeat(70));
console.log('\n✨ Demo Complete!');
console.log('='.repeat(70));
