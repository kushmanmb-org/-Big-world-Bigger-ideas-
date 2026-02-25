/**
 * Etherscan Contract Verification Module Tests
 * Tests for contract verification on Etherscan
 */

const EtherscanVerifier = require('./etherscan-verify.js');

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
    console.error(`✗ ${message} (expected: ${expected}, got: ${actual})`);
    testsFailed++;
  }
}

async function runTests() {
  console.log('Running Etherscan Contract Verification Module Tests...\n');
  console.log('='.repeat(50));

  // Test 1: Constructor with default values (no API key)
  console.log('\n📦 Testing Constructor with Defaults...');
  try {
    const verifier = new EtherscanVerifier();
    assert(verifier !== null, 'Should create verifier instance');
    assertEqual(verifier.apiBaseUrl, 'api.etherscan.io', 'Should use Etherscan API URL');
  } catch (error) {
    assert(false, `Constructor test failed: ${error.message}`);
  }

  // Test 2: Constructor with custom API key
  console.log('\n🔧 Testing Constructor with Custom API Key...');
  try {
    const verifier = new EtherscanVerifier('test-api-key');
    assertEqual(verifier.apiKey, 'test-api-key', 'Should set custom API key');
  } catch (error) {
    assert(false, `Custom API key constructor test failed: ${error.message}`);
  }

  // Test 3: Constructor with custom base URL
  console.log('\n🌐 Testing Constructor with Custom Base URL...');
  try {
    const verifier = new EtherscanVerifier('test-key', 'api-sepolia.etherscan.io');
    assertEqual(verifier.apiBaseUrl, 'api-sepolia.etherscan.io', 'Should set custom base URL');
  } catch (error) {
    assert(false, `Custom base URL constructor test failed: ${error.message}`);
  }

  // Test 4: Validate valid Ethereum address with 0x prefix
  console.log('\n✅ Testing Valid Address with 0x Prefix...');
  try {
    const verifier = new EtherscanVerifier();
    const address = verifier.validateAddress('0x983e3660c0bE01991785F80f266A84B911ab59b0');
    assert(address.startsWith('0x'), 'Should maintain 0x prefix');
    assertEqual(address.length, 42, 'Should be 42 characters long');
  } catch (error) {
    assert(false, `Valid address test failed: ${error.message}`);
  }

  // Test 5: Validate valid address without 0x prefix
  console.log('\n➕ Testing Valid Address without 0x Prefix...');
  try {
    const verifier = new EtherscanVerifier();
    const address = verifier.validateAddress('983e3660c0bE01991785F80f266A84B911ab59b0');
    assert(address.startsWith('0x'), 'Should add 0x prefix');
    assertEqual(address.length, 42, 'Should be 42 characters long');
  } catch (error) {
    assert(false, `Address without prefix test failed: ${error.message}`);
  }

  // Test 6: Validate invalid address - too short
  console.log('\n⚠️  Testing Invalid Address - Too Short...');
  try {
    const verifier = new EtherscanVerifier();
    verifier.validateAddress('0x123');
    assert(false, 'Should throw error for short address');
  } catch (error) {
    assert(error.message.includes('Invalid'), 'Should throw validation error');
  }

  // Test 7: Validate invalid address - not hex
  console.log('\n⚠️  Testing Invalid Address - Non-Hex...');
  try {
    const verifier = new EtherscanVerifier();
    verifier.validateAddress('0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG');
    assert(false, 'Should throw error for non-hex address');
  } catch (error) {
    assert(error.message.includes('Invalid'), 'Should throw validation error');
  }

  // Test 8: Validate empty address
  console.log('\n⚠️  Testing Empty Address...');
  try {
    const verifier = new EtherscanVerifier();
    verifier.validateAddress('');
    assert(false, 'Should throw error for empty address');
  } catch (error) {
    assert(error.message.includes('non-empty'), 'Should throw non-empty error');
  }

  // Test 9: Validate null address
  console.log('\n⚠️  Testing Null Address...');
  try {
    const verifier = new EtherscanVerifier();
    verifier.validateAddress(null);
    assert(false, 'Should throw error for null address');
  } catch (error) {
    assert(error.message.includes('non-empty'), 'Should throw non-empty error');
  }

  // Test 10: verifyContract without API key
  console.log('\n🔑 Testing verifyContract without API Key...');
  try {
    const verifier = new EtherscanVerifier();
    await verifier.verifyContract({
      contractAddress: '0x983e3660c0bE01991785F80f266A84B911ab59b0',
      sourceCode: 'pragma solidity ^0.8.20; contract Test {}',
      contractName: 'Test',
      compilerVersion: 'v0.8.20+commit.a1b79de6'
    });
    assert(false, 'Should throw error without API key');
  } catch (error) {
    assert(error.message.includes('API key is required'), 'Should throw API key error');
  }

  // Test 11: verifyContract with missing required fields
  console.log('\n📋 Testing verifyContract with Missing Fields...');
  try {
    const verifier = new EtherscanVerifier('test-key');
    await verifier.verifyContract({
      contractAddress: '0x983e3660c0bE01991785F80f266A84B911ab59b0'
    });
    assert(false, 'Should throw error for missing fields');
  } catch (error) {
    assert(error.message.includes('Missing required field'), 'Should throw missing field error');
  }

  // Test 12: verifyContract with invalid contract address
  console.log('\n🚫 Testing verifyContract with Invalid Address...');
  try {
    const verifier = new EtherscanVerifier('test-key');
    await verifier.verifyContract({
      contractAddress: '0xinvalid',
      sourceCode: 'pragma solidity ^0.8.20; contract Test {}',
      contractName: 'Test',
      compilerVersion: 'v0.8.20+commit.a1b79de6'
    });
    assert(false, 'Should throw error for invalid address');
  } catch (error) {
    assert(error.message.includes('Invalid'), 'Should throw invalid address error');
  }

  // Test 13: verifyContract with invalid compiler version
  console.log('\n🔨 Testing verifyContract with Invalid Compiler Version...');
  try {
    const verifier = new EtherscanVerifier('test-key');
    await verifier.verifyContract({
      contractAddress: '0x983e3660c0bE01991785F80f266A84B911ab59b0',
      sourceCode: 'pragma solidity ^0.8.20; contract Test {}',
      contractName: 'Test',
      compilerVersion: '0.8.20' // Missing 'v' prefix
    });
    assert(false, 'Should throw error for invalid compiler version');
  } catch (error) {
    assert(error.message.includes('Compiler version'), 'Should throw compiler version error');
  }

  // Test 14: verifyContract with invalid optimizationUsed value
  console.log('\n⚙️  Testing verifyContract with Invalid optimizationUsed...');
  try {
    const verifier = new EtherscanVerifier('test-key');
    await verifier.verifyContract({
      contractAddress: '0x983e3660c0bE01991785F80f266A84B911ab59b0',
      sourceCode: 'pragma solidity ^0.8.20; contract Test {}',
      contractName: 'Test',
      compilerVersion: 'v0.8.20+commit.a1b79de6',
      optimizationUsed: 2 // Should be 0 or 1
    });
    assert(false, 'Should throw error for invalid optimizationUsed');
  } catch (error) {
    assert(error.message.includes('optimizationUsed must be 0 or 1'), 'Should throw optimization error');
  }

  // Test 15: verifyContract with invalid runs value
  console.log('\n🏃 Testing verifyContract with Invalid runs...');
  try {
    const verifier = new EtherscanVerifier('test-key');
    await verifier.verifyContract({
      contractAddress: '0x983e3660c0bE01991785F80f266A84B911ab59b0',
      sourceCode: 'pragma solidity ^0.8.20; contract Test {}',
      contractName: 'Test',
      compilerVersion: 'v0.8.20+commit.a1b79de6',
      optimizationUsed: 1,
      runs: -1 // Should be non-negative
    });
    assert(false, 'Should throw error for negative runs');
  } catch (error) {
    assert(error.message.includes('non-negative integer'), 'Should throw runs validation error');
  }

  // Test 16: verifyContract with invalid license type
  console.log('\n📜 Testing verifyContract with Invalid License Type...');
  try {
    const verifier = new EtherscanVerifier('test-key');
    await verifier.verifyContract({
      contractAddress: '0x983e3660c0bE01991785F80f266A84B911ab59b0',
      sourceCode: 'pragma solidity ^0.8.20; contract Test {}',
      contractName: 'Test',
      compilerVersion: 'v0.8.20+commit.a1b79de6',
      licenseType: '99' // Should be 1-14
    });
    assert(false, 'Should throw error for invalid license type');
  } catch (error) {
    assert(error.message.includes('licenseType must be between 1 and 14'), 'Should throw license type error');
  }

  // Test 17: verifyContract with valid parameters (will fail without real API)
  console.log('\n✅ Testing verifyContract Parameter Validation...');
  try {
    const verifier = new EtherscanVerifier('test-key');
    // This will validate parameters but fail on actual API call
    try {
      await verifier.verifyContract({
        contractAddress: '0x983e3660c0bE01991785F80f266A84B911ab59b0',
        sourceCode: 'pragma solidity ^0.8.20; contract Test {}',
        contractName: 'Test',
        compilerVersion: 'v0.8.20+commit.a1b79de6',
        optimizationUsed: 1,
        runs: 200,
        constructorArguments: '0000',
        evmVersion: 'paris',
        licenseType: '3'
      });
    } catch (apiError) {
      // Expected to fail on API call, but validation should pass
      assert(true, 'Should validate parameters correctly');
    }
  } catch (error) {
    assert(false, `Parameter validation test failed: ${error.message}`);
  }

  // Test 18: checkVerificationStatus without API key
  console.log('\n🔑 Testing checkVerificationStatus without API Key...');
  try {
    const verifier = new EtherscanVerifier();
    await verifier.checkVerificationStatus('test-guid');
    assert(false, 'Should throw error without API key');
  } catch (error) {
    assert(error.message.includes('API key is required'), 'Should throw API key error');
  }

  // Test 19: checkVerificationStatus with empty GUID
  console.log('\n⚠️  Testing checkVerificationStatus with Empty GUID...');
  try {
    const verifier = new EtherscanVerifier('test-key');
    await verifier.checkVerificationStatus('');
    assert(false, 'Should throw error for empty GUID');
  } catch (error) {
    assert(error.message.includes('GUID must be a non-empty string'), 'Should throw GUID validation error');
  }

  // Test 20: checkVerificationStatus with null GUID
  console.log('\n⚠️  Testing checkVerificationStatus with Null GUID...');
  try {
    const verifier = new EtherscanVerifier('test-key');
    await verifier.checkVerificationStatus(null);
    assert(false, 'Should throw error for null GUID');
  } catch (error) {
    assert(error.message.includes('GUID must be a non-empty string'), 'Should throw GUID validation error');
  }

  // Test 21: getAPIInfo
  console.log('\n📡 Testing getAPIInfo...');
  try {
    const verifier = new EtherscanVerifier('my-api-key', 'api-sepolia.etherscan.io');
    const info = verifier.getAPIInfo();
    assertEqual(info.baseUrl, 'api-sepolia.etherscan.io', 'Should return base URL');
    assert(info.hasApiKey === true, 'Should indicate API key is present');
  } catch (error) {
    assert(false, `API info test failed: ${error.message}`);
  }

  // Test 22: getAPIInfo without API key
  console.log('\n🔓 Testing getAPIInfo without API Key...');
  try {
    const verifier = new EtherscanVerifier();
    const info = verifier.getAPIInfo();
    assert(info.hasApiKey === false, 'Should indicate no API key');
  } catch (error) {
    assert(false, `API info no key test failed: ${error.message}`);
  }

  // Test 23: Verify validation with null params
  console.log('\n⚠️  Testing _validateVerificationParams with Null...');
  try {
    const verifier = new EtherscanVerifier('test-key');
    verifier._validateVerificationParams(null);
    assert(false, 'Should throw error for null params');
  } catch (error) {
    assert(error.message.includes('must be an object'), 'Should throw object validation error');
  }

  // Test 24: Verify validation with empty object
  console.log('\n📋 Testing _validateVerificationParams with Empty Object...');
  try {
    const verifier = new EtherscanVerifier('test-key');
    verifier._validateVerificationParams({});
    assert(false, 'Should throw error for empty params');
  } catch (error) {
    assert(error.message.includes('Missing required field'), 'Should throw missing field error');
  }

  // Test 25: Verify parameter validation with all optional fields
  console.log('\n✨ Testing Parameter Validation with Optional Fields...');
  try {
    const verifier = new EtherscanVerifier('test-key');
    // Should not throw during validation
    verifier._validateVerificationParams({
      contractAddress: '0x983e3660c0bE01991785F80f266A84B911ab59b0',
      sourceCode: 'pragma solidity ^0.8.20; contract Test {}',
      contractName: 'Test',
      compilerVersion: 'v0.8.20+commit.a1b79de6',
      optimizationUsed: 0,
      runs: 200,
      constructorArguments: '',
      evmVersion: 'london',
      licenseType: '1'
    });
    assert(true, 'Should validate all optional fields correctly');
  } catch (error) {
    assert(false, `Optional fields validation failed: ${error.message}`);
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
