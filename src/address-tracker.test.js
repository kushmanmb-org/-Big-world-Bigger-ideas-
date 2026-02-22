/**
 * Address Tracker Module Tests
 * Tests for crypto address tracking across blockchain networks
 */

const { AddressTracker, AddressInfo } = require('./address-tracker.js');

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
  console.log('Running Address Tracker Module Tests...\n');
  console.log('='.repeat(50));

  // Test 1: Constructor
  console.log('\n📦 Testing Constructor...');
  try {
    const tracker = new AddressTracker();
    assert(tracker !== null, 'Should create tracker instance');
    assertEqual(tracker.owner, 'kushmanmb', 'Should use default owner');
    assert(tracker.addresses instanceof Map, 'Should initialize addresses map');
  } catch (error) {
    assert(false, `Constructor test failed: ${error.message}`);
  }

  // Test 2: Constructor with custom owner
  console.log('\n👤 Testing Constructor with Custom Owner...');
  try {
    const tracker = new AddressTracker('testuser');
    assertEqual(tracker.owner, 'testuser', 'Should use custom owner');
  } catch (error) {
    assert(false, `Custom owner test failed: ${error.message}`);
  }

  // Test 3: Add address
  console.log('\n➕ Testing Add Address...');
  try {
    const tracker = new AddressTracker();
    const address = '0x1234567890123456789012345678901234567890';
    const addressInfo = tracker.addAddress(address, 'ethereum', 'My Wallet');
    assert(addressInfo instanceof AddressInfo, 'Should return AddressInfo');
    assert(tracker.isTracking(address), 'Should track the address');
  } catch (error) {
    assert(false, `Add address test failed: ${error.message}`);
  }

  // Test 4: Validate address format
  console.log('\n✅ Testing Address Validation...');
  try {
    const tracker = new AddressTracker();
    const address1 = tracker.validateAddress('0x1234567890123456789012345678901234567890');
    assert(address1.startsWith('0x'), 'Should normalize with 0x prefix');
    const address2 = tracker.validateAddress('1234567890123456789012345678901234567890');
    assert(address2.startsWith('0x'), 'Should add 0x prefix if missing');
  } catch (error) {
    assert(false, `Address validation test failed: ${error.message}`);
  }

  // Test 5: Invalid address
  console.log('\n⚠️  Testing Invalid Address...');
  try {
    const tracker = new AddressTracker();
    tracker.addAddress('invalid', 'ethereum');
    assert(false, 'Should throw error for invalid address');
  } catch (error) {
    assert(error.message.includes('Invalid'), 'Should throw validation error');
  }

  // Test 6: Duplicate address
  console.log('\n🔄 Testing Duplicate Address...');
  try {
    const tracker = new AddressTracker();
    const address = '0x1234567890123456789012345678901234567890';
    tracker.addAddress(address, 'ethereum');
    tracker.addAddress(address, 'ethereum');
    assert(false, 'Should throw error for duplicate address');
  } catch (error) {
    assert(error.message.includes('already'), 'Should throw duplicate error');
  }

  // Test 7: Remove address
  console.log('\n➖ Testing Remove Address...');
  try {
    const tracker = new AddressTracker();
    const address = '0x1234567890123456789012345678901234567890';
    tracker.addAddress(address, 'ethereum');
    const removed = tracker.removeAddress(address);
    assertEqual(removed, true, 'Should return true on successful removal');
    assert(!tracker.isTracking(address), 'Should no longer track address');
  } catch (error) {
    assert(false, `Remove address test failed: ${error.message}`);
  }

  // Test 8: Remove non-existent address
  console.log('\n❌ Testing Remove Non-existent Address...');
  try {
    const tracker = new AddressTracker();
    const removed = tracker.removeAddress('0x1234567890123456789012345678901234567890');
    assertEqual(removed, false, 'Should return false for non-existent address');
  } catch (error) {
    assert(false, `Remove non-existent test failed: ${error.message}`);
  }

  // Test 9: Get address
  console.log('\n🔍 Testing Get Address...');
  try {
    const tracker = new AddressTracker();
    const address = '0x1234567890123456789012345678901234567890';
    tracker.addAddress(address, 'ethereum', 'Test Wallet');
    const addressInfo = tracker.getAddress(address);
    assertEqual(addressInfo.label, 'Test Wallet', 'Should retrieve correct label');
    assertEqual(addressInfo.network, 'ethereum', 'Should retrieve correct network');
  } catch (error) {
    assert(false, `Get address test failed: ${error.message}`);
  }

  // Test 10: Get non-tracked address
  console.log('\n⚠️  Testing Get Non-tracked Address...');
  try {
    const tracker = new AddressTracker();
    tracker.getAddress('0x1234567890123456789012345678901234567890');
    assert(false, 'Should throw error for non-tracked address');
  } catch (error) {
    assert(error.message.includes('not being tracked'), 'Should throw tracking error');
  }

  // Test 11: Get all addresses
  console.log('\n📋 Testing Get All Addresses...');
  try {
    const tracker = new AddressTracker();
    tracker.addAddress('0x1234567890123456789012345678901234567890', 'ethereum');
    tracker.addAddress('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', 'base');
    const allAddresses = tracker.getAllAddresses();
    assertEqual(allAddresses.length, 2, 'Should return all tracked addresses');
  } catch (error) {
    assert(false, `Get all addresses test failed: ${error.message}`);
  }

  // Test 12: Get addresses by network
  console.log('\n🌐 Testing Get Addresses by Network...');
  try {
    const tracker = new AddressTracker();
    tracker.addAddress('0x1234567890123456789012345678901234567890', 'ethereum');
    tracker.addAddress('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', 'ethereum');
    tracker.addAddress('0x9876543210987654321098765432109876543210', 'base');
    
    const ethAddresses = tracker.getAddressesByNetwork('ethereum');
    assertEqual(ethAddresses.length, 2, 'Should return 2 Ethereum addresses');
    
    const baseAddresses = tracker.getAddressesByNetwork('base');
    assertEqual(baseAddresses.length, 1, 'Should return 1 Base address');
  } catch (error) {
    assert(false, `Get addresses by network test failed: ${error.message}`);
  }

  // Test 13: Record token
  console.log('\n🎨 Testing Record Token...');
  try {
    const tracker = new AddressTracker();
    const address = '0x1234567890123456789012345678901234567890';
    tracker.addAddress(address, 'ethereum');
    
    tracker.recordToken(address, {
      tokenId: '123',
      contract: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
      name: 'BAYC'
    });
    
    const tokens = tracker.getTokensForAddress(address);
    assertEqual(tokens.length, 1, 'Should have 1 token');
    assertEqual(tokens[0].tokenId, '123', 'Should record correct token ID');
  } catch (error) {
    assert(false, `Record token test failed: ${error.message}`);
  }

  // Test 14: Record transaction
  console.log('\n💸 Testing Record Transaction...');
  try {
    const tracker = new AddressTracker();
    const address = '0x1234567890123456789012345678901234567890';
    tracker.addAddress(address, 'ethereum');
    
    tracker.recordTransaction(address, {
      hash: '0xabc123',
      from: address,
      to: '0x9876543210987654321098765432109876543210',
      value: '1000000000000000000'
    });
    
    const txCount = tracker.getTransactionCount(address);
    assertEqual(txCount, 1, 'Should have 1 transaction');
  } catch (error) {
    assert(false, `Record transaction test failed: ${error.message}`);
  }

  // Test 15: Get statistics
  console.log('\n📊 Testing Get Statistics...');
  try {
    const tracker = new AddressTracker('testuser');
    tracker.addAddress('0x1234567890123456789012345678901234567890', 'ethereum');
    tracker.addAddress('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', 'base');
    
    tracker.recordToken('0x1234567890123456789012345678901234567890', {
      tokenId: '1'
    });
    
    const stats = tracker.getStatistics();
    assertEqual(stats.owner, 'testuser', 'Should track correct owner');
    assertEqual(stats.totalAddresses, 2, 'Should count 2 addresses');
    assertEqual(stats.networksTracked, 2, 'Should track 2 networks');
    assertEqual(stats.totalTokens, 1, 'Should count 1 token');
  } catch (error) {
    assert(false, `Statistics test failed: ${error.message}`);
  }

  // Test 16: JSON export
  console.log('\n💾 Testing JSON Export...');
  try {
    const tracker = new AddressTracker('testuser');
    tracker.addAddress('0x1234567890123456789012345678901234567890', 'ethereum', 'Wallet 1');
    
    const json = tracker.toJSON();
    assertEqual(json.owner, 'testuser', 'Should export owner');
    assert(Array.isArray(json.addresses), 'Should export addresses as array');
    assertEqual(json.addresses.length, 1, 'Should export 1 address');
    assert(json.statistics !== undefined, 'Should include statistics');
  } catch (error) {
    assert(false, `JSON export test failed: ${error.message}`);
  }

  // Test 17: JSON import
  console.log('\n📥 Testing JSON Import...');
  try {
    const tracker1 = new AddressTracker('user1');
    tracker1.addAddress('0x1234567890123456789012345678901234567890', 'ethereum', 'Test');
    tracker1.recordToken('0x1234567890123456789012345678901234567890', { tokenId: '1' });
    
    const json = tracker1.toJSON();
    
    const tracker2 = new AddressTracker();
    tracker2.fromJSON(json);
    
    assertEqual(tracker2.owner, 'user1', 'Should import owner');
    assert(tracker2.isTracking('0x1234567890123456789012345678901234567890'), 'Should import address');
    
    const tokens = tracker2.getTokensForAddress('0x1234567890123456789012345678901234567890');
    assertEqual(tokens.length, 1, 'Should import tokens');
  } catch (error) {
    assert(false, `JSON import test failed: ${error.message}`);
  }

  // Test 18: Format statistics
  console.log('\n📝 Testing Format Statistics...');
  try {
    const tracker = new AddressTracker();
    tracker.addAddress('0x1234567890123456789012345678901234567890', 'ethereum');
    
    const formatted = tracker.formatStatistics();
    assert(typeof formatted === 'string', 'Should return string');
    assert(formatted.includes('kushmanmb'), 'Should include owner');
    assert(formatted.includes('Total Addresses'), 'Should include address count');
  } catch (error) {
    assert(false, `Format statistics test failed: ${error.message}`);
  }

  // Test 19: Format addresses
  console.log('\n📄 Testing Format Addresses...');
  try {
    const tracker = new AddressTracker();
    tracker.addAddress('0x1234567890123456789012345678901234567890', 'ethereum', 'My Wallet');
    
    const formatted = tracker.formatAddresses();
    assert(typeof formatted === 'string', 'Should return string');
    assert(formatted.includes('0x1234567890'), 'Should include address');
    assert(formatted.includes('My Wallet'), 'Should include label');
  } catch (error) {
    assert(false, `Format addresses test failed: ${error.message}`);
  }

  // Test 20: AddressInfo class
  console.log('\n🏷️  Testing AddressInfo Class...');
  try {
    const addressInfo = new AddressInfo(
      '0x1234567890123456789012345678901234567890',
      'ethereum',
      'Test Address'
    );
    
    assertEqual(addressInfo.address, '0x1234567890123456789012345678901234567890', 'Should set address');
    assertEqual(addressInfo.network, 'ethereum', 'Should set network');
    assertEqual(addressInfo.label, 'Test Address', 'Should set label');
    assert(addressInfo.trackedSince > 0, 'Should set tracked since timestamp');
  } catch (error) {
    assert(false, `AddressInfo test failed: ${error.message}`);
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
