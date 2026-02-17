/**
 * Simple test suite for Wallet encryption functionality
 */

const Wallet = require('./wallet');

let testsPassed = 0;
let testsFailed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✓ ${description}`);
    testsPassed++;
  } catch (error) {
    console.error(`✗ ${description}`);
    console.error(`  Error: ${error.message}`);
    testsFailed++;
  }
}

function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`${message} - Expected ${expected}, got ${actual}`);
  }
}

function assertNotNull(value, message = '') {
  if (value === null || value === undefined) {
    throw new Error(`${message} - Value should not be null or undefined`);
  }
}

function assertThrows(fn, expectedError = null) {
  try {
    fn();
    throw new Error('Expected function to throw an error');
  } catch (error) {
    if (expectedError && !error.message.includes(expectedError)) {
      throw new Error(`Expected error message to include "${expectedError}", got "${error.message}"`);
    }
  }
}

console.log('Running Wallet Encryption Tests...\n');

// Test 1: Wallet generation
test('should generate a wallet with address and private key', () => {
  const wallet = new Wallet();
  const data = wallet.generate();
  
  assertNotNull(data.address, 'Address should not be null');
  assertNotNull(data.privateKey, 'Private key should not be null');
  assertEqual(data.address.substring(0, 2), '0x', 'Address should start with 0x');
  assertEqual(data.address.length, 42, 'Address should be 42 characters');
  assertEqual(data.privateKey.length, 64, 'Private key should be 64 characters');
});

// Test 2: Wallet encryption with valid password
test('should encrypt wallet with valid password', () => {
  const wallet = new Wallet();
  wallet.generate();
  
  const encryptedData = wallet.encrypt('SecurePassword123');
  
  assertNotNull(encryptedData, 'Encrypted data should not be null');
  assertNotNull(encryptedData.data, 'Encrypted data.data should not be null');
  assertNotNull(encryptedData.salt, 'Salt should not be null');
  assertNotNull(encryptedData.iv, 'IV should not be null');
  assertEqual(encryptedData.algorithm, 'aes-256-cbc', 'Algorithm should be aes-256-cbc');
  assertEqual(encryptedData.kdf, 'pbkdf2', 'KDF should be pbkdf2');
  assertEqual(encryptedData.iterations, 100000, 'Iterations should be 100000');
});

// Test 3: Password validation - empty password
test('should reject empty password', () => {
  const wallet = new Wallet();
  wallet.generate();
  
  assertThrows(() => wallet.encrypt(''), 'non-empty string');
});

// Test 4: Password validation - short password
test('should reject password shorter than 8 characters', () => {
  const wallet = new Wallet();
  wallet.generate();
  
  assertThrows(() => wallet.encrypt('short'), 'at least 8 characters');
});

// Test 5: Password validation - non-string password
test('should reject non-string password', () => {
  const wallet = new Wallet();
  wallet.generate();
  
  assertThrows(() => wallet.encrypt(12345), 'non-empty string');
});

// Test 6: Successful decryption with correct password
test('should decrypt wallet with correct password', () => {
  const wallet = new Wallet();
  const originalData = wallet.generate();
  const password = 'TestPassword123';
  
  wallet.encrypt(password);
  const decryptedData = wallet.decrypt(password);
  
  assertEqual(decryptedData.address, originalData.address, 'Decrypted address should match original');
  assertEqual(decryptedData.privateKey, originalData.privateKey, 'Decrypted private key should match original');
});

// Test 7: Failed decryption with wrong password
test('should fail to decrypt with wrong password', () => {
  const wallet = new Wallet();
  wallet.generate();
  wallet.encrypt('CorrectPassword123');
  
  assertThrows(() => wallet.decrypt('WrongPassword123'), 'Invalid password');
});

// Test 8: Export encrypted wallet
test('should export encrypted wallet', () => {
  const wallet = new Wallet();
  wallet.generate();
  wallet.encrypt('ExportPassword123');
  
  const exported = wallet.export();
  
  assertNotNull(exported, 'Exported data should not be null');
  assertNotNull(exported.data, 'Exported encrypted data should not be null');
});

// Test 9: Export before encryption should fail
test('should fail to export before encryption', () => {
  const wallet = new Wallet();
  wallet.generate();
  
  assertThrows(() => wallet.export(), 'must be encrypted before exporting');
});

// Test 10: Import and decrypt
test('should import and decrypt encrypted wallet', () => {
  const wallet1 = new Wallet();
  const originalData = wallet1.generate();
  const password = 'ImportPassword123';
  
  wallet1.encrypt(password);
  const exported = wallet1.export();
  
  const wallet2 = new Wallet();
  wallet2.import(exported);
  const decryptedData = wallet2.decrypt(password);
  
  assertEqual(decryptedData.address, originalData.address, 'Imported wallet address should match');
  assertEqual(decryptedData.privateKey, originalData.privateKey, 'Imported wallet private key should match');
});

// Test 11: Import invalid data
test('should fail to import invalid data', () => {
  const wallet = new Wallet();
  
  assertThrows(() => wallet.import(null), 'Invalid encrypted data');
  assertThrows(() => wallet.import('not an object'), 'Invalid encrypted data');
});

// Test 12: Decrypt without encrypted data
test('should fail to decrypt without encrypted data', () => {
  const wallet = new Wallet();
  
  assertThrows(() => wallet.decrypt('SomePassword123'), 'No encrypted data found');
});

// Test 13: Different passwords produce different encrypted data
test('should produce different encrypted data with different passwords', () => {
  const wallet1 = new Wallet();
  const wallet2 = new Wallet();
  
  const data = wallet1.generate();
  wallet2.address = data.address;
  wallet2.privateKey = data.privateKey;
  
  const encrypted1 = wallet1.encrypt('Password1');
  const encrypted2 = wallet2.encrypt('Password2');
  
  if (encrypted1.data === encrypted2.data) {
    throw new Error('Different passwords should produce different encrypted data');
  }
});

// Test 14: Same wallet encrypted twice produces different encrypted data (due to random salt/IV)
test('should produce different encrypted data on repeated encryption', () => {
  const wallet = new Wallet();
  const data = wallet.generate();
  const password = 'SamePassword123';
  
  const encrypted1 = wallet.encrypt(password);
  
  // Reset wallet to same state
  wallet.address = data.address;
  wallet.privateKey = data.privateKey;
  
  const encrypted2 = wallet.encrypt(password);
  
  if (encrypted1.data === encrypted2.data) {
    throw new Error('Repeated encryption should produce different encrypted data');
  }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Tests Passed: ${testsPassed}`);
console.log(`Tests Failed: ${testsFailed}`);
console.log('='.repeat(50));

if (testsFailed === 0) {
  console.log('✅ All tests passed!');
  process.exit(0);
} else {
  console.log('❌ Some tests failed');
  process.exit(1);
}
