/**
 * Contract ABI Fetcher Tests
 * Tests for the Contract ABI Fetcher module
 */

const ContractABIFetcher = require('./contract-abi');

// Simple test runner
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log('🧪 Running Contract ABI Fetcher Tests\n');
    console.log('='.repeat(50));

    for (const test of this.tests) {
      try {
        await test.fn();
        this.passed++;
        console.log(`✅ ${test.name}`);
      } catch (error) {
        this.failed++;
        console.log(`❌ ${test.name}`);
        console.log(`   Error: ${error.message}\n`);
      }
    }

    console.log('='.repeat(50));
    console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed\n`);

    if (this.failed > 0) {
      process.exit(1);
    }
  }
}

// Helper function to assert
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Create test runner
const runner = new TestRunner();

// Test: Constructor
runner.test('Constructor initializes with default values', () => {
  const fetcher = new ContractABIFetcher();
  assert(fetcher.chainId === 1, 'Default chain ID should be 1');
  assert(fetcher.apiKey === null, 'Default API key should be null');
  assert(fetcher.apiBaseUrl === 'api.etherscan.io', 'API base URL should be correct');
});

runner.test('Constructor initializes with custom values', () => {
  const fetcher = new ContractABIFetcher('test-api-key', 8453);
  assert(fetcher.chainId === 8453, 'Chain ID should be 8453');
  assert(fetcher.apiKey === 'test-api-key', 'API key should be set');
  assert(fetcher.apiBaseUrl === 'api.basescan.org', 'Base mainnet API URL should be correct');
});

// Test: API endpoint mapping
runner.test('getApiEndpoint returns correct endpoint for Goerli testnet', () => {
  const fetcher = new ContractABIFetcher(null, 5);
  assert(fetcher.apiBaseUrl === 'api-goerli.etherscan.io', 'Goerli API endpoint should be correct');
});

runner.test('getApiEndpoint returns correct endpoint for Sepolia testnet', () => {
  const fetcher = new ContractABIFetcher(null, 11155111);
  assert(fetcher.apiBaseUrl === 'api-sepolia.etherscan.io', 'Sepolia API endpoint should be correct');
});

runner.test('getApiEndpoint returns correct endpoint for Polygon mainnet', () => {
  const fetcher = new ContractABIFetcher(null, 137);
  assert(fetcher.apiBaseUrl === 'api.polygonscan.com', 'Polygon API endpoint should be correct');
});

runner.test('getApiEndpoint returns correct endpoint for BSC mainnet', () => {
  const fetcher = new ContractABIFetcher(null, 56);
  assert(fetcher.apiBaseUrl === 'api.bscscan.com', 'BSC API endpoint should be correct');
});

runner.test('getApiEndpoint returns correct endpoint for Arbitrum One', () => {
  const fetcher = new ContractABIFetcher(null, 42161);
  assert(fetcher.apiBaseUrl === 'api.arbiscan.io', 'Arbitrum API endpoint should be correct');
});

runner.test('getApiEndpoint falls back to mainnet for unknown chain', () => {
  const fetcher = new ContractABIFetcher(null, 99999);
  assert(fetcher.apiBaseUrl === 'api.etherscan.io', 'Unknown chain should default to Ethereum mainnet API');
});

// Test: Address validation
runner.test('validateAddress accepts valid address with 0x prefix', () => {
  const fetcher = new ContractABIFetcher();
  const address = '0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43';
  const validated = fetcher.validateAddress(address);
  assert(validated === address, 'Address should be validated correctly');
});

runner.test('validateAddress accepts valid address without 0x prefix', () => {
  const fetcher = new ContractABIFetcher();
  const address = 'a9d1e08c7793af67e9d92fe308d5697fb81d3e43';
  const validated = fetcher.validateAddress(address);
  assert(validated === '0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43', 'Address should be prefixed with 0x');
});

runner.test('validateAddress rejects invalid address - wrong length', () => {
  const fetcher = new ContractABIFetcher();
  try {
    fetcher.validateAddress('0x123');
    assert(false, 'Should have thrown an error');
  } catch (error) {
    assert(error.message.includes('Invalid Ethereum address'), 'Error message should mention invalid address');
  }
});

runner.test('validateAddress rejects invalid address - non-hex characters', () => {
  const fetcher = new ContractABIFetcher();
  try {
    fetcher.validateAddress('0xzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
    assert(false, 'Should have thrown an error');
  } catch (error) {
    assert(error.message.includes('Invalid Ethereum address'), 'Error message should mention invalid address');
  }
});

runner.test('validateAddress rejects null address', () => {
  const fetcher = new ContractABIFetcher();
  try {
    fetcher.validateAddress(null);
    assert(false, 'Should have thrown an error');
  } catch (error) {
    assert(error.message.includes('non-empty string'), 'Error message should mention non-empty string');
  }
});

runner.test('validateAddress rejects empty string', () => {
  const fetcher = new ContractABIFetcher();
  try {
    fetcher.validateAddress('');
    assert(false, 'Should have thrown an error');
  } catch (error) {
    assert(error.message.includes('non-empty string'), 'Error message should mention non-empty string');
  }
});

// Test: getContractABI
runner.test('getContractABI requires API key', async () => {
  const fetcher = new ContractABIFetcher();
  try {
    await fetcher.getContractABI('0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43');
    assert(false, 'Should have thrown an error');
  } catch (error) {
    assert(error.message.includes('API key is required'), 'Error message should mention API key');
  }
});

runner.test('getContractABI validates address format', async () => {
  const fetcher = new ContractABIFetcher('test-key');
  try {
    await fetcher.getContractABI('invalid-address');
    assert(false, 'Should have thrown an error');
  } catch (error) {
    assert(error.message.includes('Invalid Ethereum address'), 'Error message should mention invalid address');
  }
});

// Test: extractFunctionSignatures
runner.test('extractFunctionSignatures extracts function signatures from ABI', () => {
  const mockABI = [
    {
      type: 'function',
      name: 'balanceOf',
      inputs: [{ name: 'owner', type: 'address' }],
      outputs: [{ name: 'balance', type: 'uint256' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'transfer',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ],
      outputs: [{ name: 'success', type: 'bool' }],
      stateMutability: 'nonpayable'
    },
    {
      type: 'event',
      name: 'Transfer',
      inputs: [
        { name: 'from', type: 'address', indexed: true },
        { name: 'to', type: 'address', indexed: true },
        { name: 'value', type: 'uint256', indexed: false }
      ]
    }
  ];

  const signatures = ContractABIFetcher.extractFunctionSignatures(mockABI);
  assert(signatures.length === 2, 'Should extract 2 function signatures');
  assert(signatures[0].name === 'balanceOf', 'First function should be balanceOf');
  assert(signatures[0].signature === 'balanceOf(address)', 'Signature should match');
  assert(signatures[1].name === 'transfer', 'Second function should be transfer');
  assert(signatures[1].signature === 'transfer(address,uint256)', 'Signature should match');
});

runner.test('extractFunctionSignatures handles empty ABI', () => {
  const signatures = ContractABIFetcher.extractFunctionSignatures([]);
  assert(signatures.length === 0, 'Should return empty array for empty ABI');
});

runner.test('extractFunctionSignatures throws error for non-array', () => {
  try {
    ContractABIFetcher.extractFunctionSignatures('not-an-array');
    assert(false, 'Should have thrown an error');
  } catch (error) {
    assert(error.message.includes('must be an array'), 'Error message should mention array');
  }
});

// Test: extractEventSignatures
runner.test('extractEventSignatures extracts event signatures from ABI', () => {
  const mockABI = [
    {
      type: 'event',
      name: 'Transfer',
      inputs: [
        { name: 'from', type: 'address', indexed: true },
        { name: 'to', type: 'address', indexed: true },
        { name: 'value', type: 'uint256', indexed: false }
      ]
    },
    {
      type: 'event',
      name: 'Approval',
      inputs: [
        { name: 'owner', type: 'address', indexed: true },
        { name: 'spender', type: 'address', indexed: true },
        { name: 'value', type: 'uint256', indexed: false }
      ]
    },
    {
      type: 'function',
      name: 'transfer',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ]
    }
  ];

  const signatures = ContractABIFetcher.extractEventSignatures(mockABI);
  assert(signatures.length === 2, 'Should extract 2 event signatures');
  assert(signatures[0].name === 'Transfer', 'First event should be Transfer');
  assert(signatures[0].signature === 'Transfer(address,address,uint256)', 'Signature should match');
  assert(signatures[1].name === 'Approval', 'Second event should be Approval');
});

runner.test('extractEventSignatures handles empty ABI', () => {
  const signatures = ContractABIFetcher.extractEventSignatures([]);
  assert(signatures.length === 0, 'Should return empty array for empty ABI');
});

// Test: Cache functionality
runner.test('clearCache clears the internal cache', () => {
  const fetcher = new ContractABIFetcher();
  fetcher.cache.set('test-key', 'test-value');
  assert(fetcher.cache.size === 1, 'Cache should have 1 item');
  fetcher.clearCache();
  assert(fetcher.cache.size === 0, 'Cache should be empty after clearing');
});

// Test: getAPIInfo
runner.test('getAPIInfo returns correct information', () => {
  const fetcher = new ContractABIFetcher('my-api-key', 8453);
  const info = fetcher.getAPIInfo();
  assert(info.baseUrl === 'api.basescan.org', 'Base URL should be correct for Base mainnet');
  assert(info.chainId === 8453, 'Chain ID should be correct');
  assert(info.hasApiKey === true, 'Should indicate API key is set');
});

runner.test('getAPIInfo indicates when API key is not set', () => {
  const fetcher = new ContractABIFetcher();
  const info = fetcher.getAPIInfo();
  assert(info.hasApiKey === false, 'Should indicate API key is not set');
});

// Run all tests
runner.run().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});
