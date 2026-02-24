# Testing Guide

Comprehensive guide to testing in Big World Bigger Ideas.

## 🧪 Test Infrastructure

This project uses Node.js for testing without external test frameworks. Each module has:
- `*.test.js` - Test file
- `*-example.js` - Demo/example file
- `*.md` - Module documentation

## 🚀 Running Tests

### Run All Tests

Execute the complete test suite:

```bash
npm test
```

This runs all module tests sequentially.

### Run Individual Module Tests

Test specific modules:

```bash
# ERC-721 Token Fetcher
npm run test:erc721

# Bitcoin Mining
npm run test:bitcoin-mining

# Token History
npm run test:token-history

# Feature Flags
npm run test:feature-flags

# Wallet
npm run test:wallet

# Consensus Tracker
npm run test:consensus-tracker

# Address Tracker
npm run test:address-tracker

# Litecoin Blockchair
npm run test:litecoin-blockchair

# ISO 27001
npm run test:iso27001

# ZK-PDF Verifier
npm run test:zkpdf

# Contract ABI
npm run test:contract-abi

# Blockchain Council
npm run test:blockchain-council
```

## 📝 Test Output

Tests output results in a readable format:

```
Running ERC-721 Tests...
✓ Constructor accepts valid address
✓ getOwner returns correct owner
✓ getBalance validates address
✓ getTokenMetadata returns metadata
✗ Invalid token ID throws error

Tests: 4 passed, 1 failed
```

## 🎮 Running Demos

Each module includes a demo script showcasing functionality:

```bash
# ERC-721 demo
npm run erc721:demo

# Bitcoin mining demo
npm run bitcoin-mining:demo

# Feature flags demo
npm run feature-flags:demo

# Token history demo
npm run token-history:demo

# Wallet demo
npm run wallet:demo

# Consensus tracker demo
npm run consensus-tracker:demo

# Address tracker demo
npm run address-tracker:demo

# Litecoin demo
npm run litecoin-blockchair:demo

# ISO 27001 demo
npm run iso27001:demo

# ZK-PDF demo
npm run zkpdf:demo

# Contract ABI demo
npm run contract-abi:demo

# Blockchain council demo
npm run blockchain-council:demo
```

## 🏗️ Test Structure

### Test File Template

```javascript
// Module imports
const ModuleName = require('./module-name');

// Test tracking
let passed = 0;
let failed = 0;

// Test helper functions
function test(description, fn) {
  try {
    fn();
    console.log(`✓ ${description}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${description}`);
    console.error(error.message);
    failed++;
  }
}

// Async test helper
async function testAsync(description, fn) {
  try {
    await fn();
    console.log(`✓ ${description}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${description}`);
    console.error(error.message);
    failed++;
  }
}

// Test cases
test('Should do something', () => {
  // Test implementation
  const result = doSomething();
  if (result !== expected) {
    throw new Error('Result does not match expected');
  }
});

// Summary
console.log(`\nTests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
```

## ✅ Test Coverage

Each module includes tests for:

### Input Validation
- Valid inputs accepted
- Invalid inputs rejected with descriptive errors
- Edge cases handled

### Core Functionality
- Primary methods work correctly
- Return values match expected format
- Error handling works as intended

### Integration
- External API calls work (where applicable)
- Caching functions properly
- Multi-chain support (where applicable)

## 🔍 Writing Tests

### Best Practices

1. **Test One Thing**: Each test should verify a single behavior
2. **Descriptive Names**: Use clear, descriptive test names
3. **Arrange-Act-Assert**: Structure tests with setup, execution, verification
4. **Error Cases**: Test both success and failure scenarios
5. **Isolated Tests**: Tests should not depend on each other

### Example Test

```javascript
// Good test example
test('getOwner validates token ID format', () => {
  const fetcher = new ERC721Fetcher(validAddress);
  
  try {
    fetcher.getOwner('invalid');
    throw new Error('Should have thrown error');
  } catch (error) {
    if (!error.message.includes('Invalid token ID')) {
      throw new Error('Wrong error message');
    }
  }
});
```

## 🌐 Testing with Real APIs

Some tests make real API calls:

```javascript
// Bitcoin Mining tests use mempool.space API
testAsync('getHashRate fetches real data', async () => {
  const fetcher = new BitcoinMiningFetcher();
  const data = await fetcher.getHashRate('1d');
  
  if (typeof data.avgHashRate !== 'number') {
    throw new Error('Invalid hash rate data');
  }
});
```

**Note**: API tests may fail if:
- Network is unavailable
- API is down or rate-limited
- Data format changes

## 🧰 Testing Utilities

### Address Validation

```javascript
function isValidAddress(address) {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}
```

### Token ID Validation

```javascript
function isValidTokenId(tokenId) {
  const num = Number(tokenId);
  return Number.isInteger(num) && num >= 0;
}
```

## 🐛 Debugging Tests

### Enable Verbose Output

Add console logs to understand test flow:

```javascript
test('Some test', () => {
  console.log('Input:', input);
  const result = doSomething(input);
  console.log('Result:', result);
  // assertions...
});
```

### Run Single Test

Comment out other tests to focus on one:

```javascript
// test('Other test', () => { ... });
test('Focus on this test', () => { ... });
// test('Another test', () => { ... });
```

### Check Test Output

Review error messages for clues:

```bash
npm run test:erc721 2>&1 | less
```

## ⚠️ Common Issues

### API Rate Limits

**Problem**: Tests fail with rate limit errors

**Solution**: 
- Add delays between API calls
- Use caching features
- Run tests less frequently

### Network Errors

**Problem**: Tests fail due to network issues

**Solution**:
- Check internet connection
- Verify API endpoints are accessible
- Use fallback RPC endpoints

### Invalid Addresses

**Problem**: Tests use invalid blockchain addresses

**Solution**:
- Use valid test addresses
- Verify address format (0x + 40 hex chars)

## 📊 Test Metrics

Current test coverage:

| Module | Tests | Status |
|--------|-------|--------|
| ERC-721 | 15+ | ✅ Passing |
| Bitcoin Mining | 10+ | ✅ Passing |
| Token History | 12+ | ✅ Passing |
| Feature Flags | 20+ | ✅ Passing |
| Wallet | 8+ | ✅ Passing |
| Consensus Tracker | 10+ | ✅ Passing |
| Address Tracker | 12+ | ✅ Passing |
| Litecoin | 8+ | ✅ Passing |
| ISO 27001 | 10+ | ✅ Passing |
| ZK-PDF | 10+ | ✅ Passing |
| Contract ABI | 8+ | ✅ Passing |
| Blockchain Council | 15+ | ✅ Passing |

## 🔗 Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Scheduled runs (daily)

See [GitHub Actions](GitHub-Actions) for CI/CD details.

## 💡 Tips

1. **Run tests before committing** - Catch issues early
2. **Update tests with code changes** - Keep tests in sync
3. **Add tests for bug fixes** - Prevent regressions
4. **Test edge cases** - Null, undefined, empty values
5. **Mock external dependencies** - For faster, more reliable tests

## 🔗 Related Documentation

- [Development Workflow](Development-Workflow) - Development best practices
- [Contributing](Contributing) - How to contribute
- [API Reference](API-Reference) - Complete API documentation

---

**Next**: [Examples & Use Cases](Examples-and-Use-Cases)
