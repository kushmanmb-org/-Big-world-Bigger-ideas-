/**
 * Token History Example
 * Demonstrates the Token Ownership History tracking functionality
 */

const { TokenHistoryTracker, OwnershipEvent } = require('./token-history');

console.log('🔍 Token Ownership History Demo for kushmanmb\n');
console.log('='.repeat(70));
console.log();

// Example: Bored Ape Yacht Club contract
const boredApeContract = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D';
// Note: This is a placeholder address for demonstration purposes
// Replace with actual kushmanmb address in production usage
const kushmanmbAddress = '0x1234567890123456789012345678901234567890';

// Create a history tracker for kushmanmb
const tracker = new TokenHistoryTracker(boredApeContract, 'kushmanmb');

console.log('📝 Creating Token History Tracker');
console.log(`Contract: ${boredApeContract}`);
console.log(`Owner: kushmanmb (${kushmanmbAddress})`);
console.log();

// Simulate some token transfer events
console.log('🔄 Recording Token Transfer Events...\n');

// Example 1: Minting event (from zero address)
tracker.recordTransfer(
  '1234',
  '0x0000000000000000000000000000000000000000',
  kushmanmbAddress,
  1609459200, // Jan 1, 2021
  '0xabc123def456789012345678901234567890abcdef1234567890123456789012',
  11565019
);
console.log('✅ Event 1: Token #1234 minted to kushmanmb');

// Example 2: Transfer to another address
tracker.recordTransfer(
  '1234',
  kushmanmbAddress,
  '0x9876543210987654321098765432109876543210',
  1625097600, // Jul 1, 2021
  '0xdef456789012345678901234567890abcdef1234567890123456789012345678',
  12765432
);
console.log('✅ Event 2: Token #1234 transferred from kushmanmb');

// Example 3: Receive another token
tracker.recordTransfer(
  '5678',
  '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
  kushmanmbAddress,
  1640995200, // Jan 1, 2022
  '0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234',
  13890123
);
console.log('✅ Event 3: Token #5678 received by kushmanmb');

// Example 4: Receive yet another token
tracker.recordTransfer(
  '9012',
  '0xfedcbafedcbafedcbafedcbafedcbafedcbafed',
  kushmanmbAddress,
  1656633600, // Jul 1, 2022
  '0x56789abcdef123456789abcdef123456789abcdef123456789abcdef12345678',
  14567890
);
console.log('✅ Event 4: Token #9012 received by kushmanmb\n');

console.log('='.repeat(70));
console.log();

// Display git-style log
console.log('📜 Git-Style Ownership History:\n');
console.log(tracker.toGitLog());
console.log();

console.log('='.repeat(70));
console.log();

// Display short log
console.log('📋 Short Log Format:\n');
console.log(tracker.toShortLog());
console.log();

console.log('='.repeat(70));
console.log();

// Display statistics
console.log('📊 History Statistics:\n');
const stats = tracker.getStatistics();
console.log(`Total Transfers:    ${stats.totalTransfers}`);
console.log(`Unique Tokens:      ${stats.uniqueTokens}`);
console.log(`Unique Addresses:   ${stats.uniqueAddresses}`);
console.log(`Current Owners:     ${stats.currentOwners}`);
console.log(`Contract:           ${stats.contract}`);
console.log(`Tracked Owner:      ${stats.trackedOwner}`);
console.log();

console.log('='.repeat(70));
console.log();

// Display tokens currently owned by kushmanmb
console.log('🎨 Tokens Currently Owned by kushmanmb:\n');
const ownedTokens = tracker.getTokensByOwner(kushmanmbAddress);
if (ownedTokens.length > 0) {
  ownedTokens.forEach(tokenId => {
    console.log(`  • Token #${tokenId}`);
  });
} else {
  console.log('  No tokens currently owned');
}
console.log();

console.log('='.repeat(70));
console.log();

// Display history for specific token
console.log('🔍 Ownership History for Token #1234:\n');
const token1234History = tracker.getTokenHistory('1234');
token1234History.forEach((event, index) => {
  console.log(`  ${index + 1}. ${event.toShortLog()}`);
});
console.log();

console.log('='.repeat(70));
console.log();

// Display history for kushmanmb
console.log('👤 All Events Involving kushmanmb:\n');
const ownerHistory = tracker.getHistoryForOwner(kushmanmbAddress);
ownerHistory.forEach((event, index) => {
  const direction = event.to.toLowerCase() === kushmanmbAddress.toLowerCase() ? '⬅️  Received' : '➡️  Sent';
  console.log(`  ${index + 1}. ${direction}: Token #${event.tokenId}`);
});
console.log();

console.log('='.repeat(70));
console.log();

// Export to JSON
console.log('💾 Exporting History to JSON:\n');
const jsonData = tracker.toJSON();
console.log(JSON.stringify(jsonData, null, 2));
console.log();

console.log('='.repeat(70));
console.log();
console.log('✨ Demo Complete! Token ownership history tracked successfully.');
console.log();
