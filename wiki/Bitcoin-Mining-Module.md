# Bitcoin Mining Fetcher Module

The Bitcoin Mining module provides real-time and historical Bitcoin network mining statistics from mempool.space.

## ⛏️ Overview

The BitcoinMiningFetcher class provides:
- Real-time hash rate data
- Mining difficulty statistics
- Block production metrics
- Historical data for various time periods
- Built-in caching for performance

## 📦 Installation

```javascript
const { BitcoinMiningFetcher } = require('big-world-bigger-ideas');
// or
const BitcoinMiningFetcher = require('big-world-bigger-ideas/src/bitcoin-mining');
```

## 🚀 Usage

### Creating a Fetcher Instance

```javascript
// Default cache timeout (60 seconds)
const fetcher = new BitcoinMiningFetcher();

// Custom cache timeout (120 seconds)
const fetcher = new BitcoinMiningFetcher(120);
```

### Get Hash Rate

```javascript
// Last 24 hours
const data = await fetcher.getHashRate('1d');
console.log(`Average: ${data.avgHashRate} TH/s`);
console.log(`Current: ${data.currentHashRate} TH/s`);

// Last week
const weekData = await fetcher.getHashRate('1w');

// Last month
const monthData = await fetcher.getHashRate('1m');
```

### Get Mining Difficulty

```javascript
const difficulty = await fetcher.getDifficulty('1d');
console.log(`Current Difficulty: ${difficulty.currentDifficulty}`);
console.log(`Difficulty Change: ${difficulty.difficultyChange}%`);
```

### Get All Mining Stats

```javascript
const stats = await fetcher.getAllStats('1w');
console.log(`Hash Rate: ${stats.hashRate.avgHashRate} TH/s`);
console.log(`Difficulty: ${stats.difficulty.currentDifficulty}`);
console.log(`Blocks: ${stats.blocks.blockCount}`);
```

## 📊 API Reference

### Constructor

**`new BitcoinMiningFetcher(cacheTimeout?)`**

- `cacheTimeout` (number, optional): Cache timeout in seconds (default: 60)

### Methods

#### `getHashRate(timePeriod)`
Get hash rate statistics for a time period.

**Parameters:**
- `timePeriod` (string): Time period - '1d', '3d', '1w', '1m', '3m', '6m', '1y', '2y', '3y', 'all'

**Returns:**
```javascript
{
  currentHashRate: number,  // Current hash rate in TH/s
  avgHashRate: number,      // Average hash rate
  timestamp: number,        // Data timestamp
  timePeriod: string       // Queried period
}
```

#### `getDifficulty(timePeriod)`
Get mining difficulty statistics.

**Parameters:**
- `timePeriod` (string): Time period (same options as getHashRate)

**Returns:**
```javascript
{
  currentDifficulty: number,      // Current difficulty
  difficultyChange: number,       // % change
  timestamp: number,
  timePeriod: string
}
```

#### `getBlockStats(timePeriod)`
Get block production statistics.

**Parameters:**
- `timePeriod` (string): Time period

**Returns:**
```javascript
{
  blockCount: number,        // Number of blocks mined
  avgBlockTime: number,      // Average time between blocks (seconds)
  timestamp: number,
  timePeriod: string
}
```

#### `getAllStats(timePeriod)`
Get comprehensive mining statistics.

**Parameters:**
- `timePeriod` (string): Time period

**Returns:**
```javascript
{
  hashRate: {...},     // Hash rate data
  difficulty: {...},   // Difficulty data
  blocks: {...},       // Block stats
  timePeriod: string,
  timestamp: number
}
```

#### `clearCache()`
Clear the cached mining data.

```javascript
fetcher.clearCache();
```

## ⏱️ Time Periods

Supported time periods:
- `'1d'` - Last 24 hours
- `'3d'` - Last 3 days
- `'1w'` - Last week
- `'1m'` - Last month
- `'3m'` - Last 3 months
- `'6m'` - Last 6 months
- `'1y'` - Last year
- `'2y'` - Last 2 years
- `'3y'` - Last 3 years
- `'all'` - All available data

## 🗄️ Caching

The module includes built-in caching:

```javascript
// Data is cached for 60 seconds by default
const fetcher = new BitcoinMiningFetcher(60);

// First call fetches from API
const data1 = await fetcher.getHashRate('1d');

// Second call (within 60s) returns cached data
const data2 = await fetcher.getHashRate('1d');

// Clear cache manually
fetcher.clearCache();

// Next call will fetch fresh data
const data3 = await fetcher.getHashRate('1d');
```

## ⚠️ Error Handling

```javascript
try {
  const data = await fetcher.getHashRate('invalid');
} catch (error) {
  console.error(error.message);
  // "Invalid time period. Supported: 1d, 3d, 1w, 1m, 3m, 6m, 1y, 2y, 3y, all"
}
```

## 🌐 Data Source

This module uses the **mempool.space API**:
- Endpoint: `https://mempool.space/api/v1/mining/*`
- Real-time Bitcoin network data
- No API key required
- Rate limits apply

## 🧪 Testing

Run tests:

```bash
npm run test:bitcoin-mining
```

Run demo:

```bash
npm run bitcoin-mining:demo
```

## 💡 Use Cases

### Mining Pool Dashboard

```javascript
const fetcher = new BitcoinMiningFetcher();

async function updateDashboard() {
  const stats = await fetcher.getAllStats('1d');
  
  // Update UI with mining stats
  displayHashRate(stats.hashRate);
  displayDifficulty(stats.difficulty);
  displayBlockStats(stats.blocks);
}

// Update every minute
setInterval(updateDashboard, 60000);
```

### Mining Profitability Calculator

```javascript
async function calculateProfitability(minerHashRate) {
  const networkStats = await fetcher.getHashRate('1d');
  const difficulty = await fetcher.getDifficulty('1d');
  
  const shareOfNetwork = minerHashRate / networkStats.avgHashRate;
  const estimatedBlocks = 144 * shareOfNetwork; // 144 blocks per day
  const btcPerDay = estimatedBlocks * 6.25; // 6.25 BTC per block
  
  return btcPerDay;
}
```

### Difficulty Monitoring

```javascript
async function monitorDifficulty() {
  const current = await fetcher.getDifficulty('1d');
  const historical = await fetcher.getDifficulty('1m');
  
  if (current.difficultyChange > 10) {
    console.log('⚠️ Major difficulty increase detected!');
  }
}
```

## 📈 Example Output

```javascript
{
  currentHashRate: 450000000,  // 450 EH/s in TH/s
  avgHashRate: 445000000,
  currentDifficulty: 72000000000000,
  blockCount: 144,
  avgBlockTime: 600
}
```

## 🔗 Related Modules

- [Litecoin Blockchair](Litecoin-Blockchair-Module) - Litecoin mining data
- [Consensus Tracker](Consensus-Tracker-Module) - Track consensus mechanisms

---

**Next**: [Token History Module](Token-History-Module)
