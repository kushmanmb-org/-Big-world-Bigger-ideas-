/**
 * Consensus Tracker Demo
 * Demonstrates the functionality of the Consensus Tracker module
 */

const { ConsensusTracker } = require('./consensus-tracker.js');

console.log('='.repeat(70));
console.log('🌍 Blockchain Consensus Mechanism Tracker Demo');
console.log('='.repeat(70));

// Create a consensus tracker instance
const tracker = new ConsensusTracker();

// Demo 1: Get consensus summary
console.log('\n📊 Consensus Summary:');
console.log(tracker.getConsensusSummary());

// Demo 2: Get Bitcoin network info (Proof of Work)
console.log('\n' + '='.repeat(70));
console.log(tracker.formatNetworkInfo('bitcoin'));

// Demo 3: Get Ethereum network info (Proof of Stake)
console.log('='.repeat(70));
console.log(tracker.formatNetworkInfo('ethereum'));

// Demo 4: Get Beacon Chain info
console.log('='.repeat(70));
console.log(tracker.formatNetworkInfo('beacon'));

// Demo 5: Compare networks
console.log('='.repeat(70));
console.log('\n🔄 Network Comparison: Bitcoin vs Ethereum\n');
const comparison = tracker.compareNetworks('bitcoin', 'ethereum');
console.log(`Networks: ${comparison.networks.join(' vs ')}`);
console.log(`Consensus: ${comparison.consensus.join(' vs ')}`);
console.log(`Same Consensus: ${comparison.sameConsensus}`);
console.log(`Block Times: ${comparison.blockTime[comparison.networks[0]]}s vs ${comparison.blockTime[comparison.networks[1]]}s`);
console.log(`Faster Network: ${comparison.blockTime.faster}`);
console.log(`Block Time Difference: ${comparison.comparison.blockTimeDifference} seconds`);

// Demo 6: List all PoW networks
console.log('\n' + '='.repeat(70));
console.log('\n⛏️  Proof of Work Networks:\n');
const powNetworks = tracker.getPowNetworks();
powNetworks.forEach(network => {
  console.log(`  • ${network.name} (${network.symbol})`);
  console.log(`    Algorithm: ${network.algorithm}`);
  console.log(`    Block Time: ${network.blockTime}s`);
  console.log(`    Launched: ${network.launched}`);
  console.log('');
});

// Demo 7: List all PoS networks
console.log('='.repeat(70));
console.log('\n🔒 Proof of Stake Networks:\n');
const posNetworks = tracker.getPosNetworks();
posNetworks.forEach(network => {
  console.log(`  • ${network.name} (${network.symbol})`);
  console.log(`    Algorithm: ${network.algorithm}`);
  console.log(`    Block Time: ${network.blockTime}s`);
  console.log(`    Launched: ${network.launched}`);
  if (network.details.minimumStake) {
    console.log(`    Minimum Stake: ${network.details.minimumStake} ${network.symbol}`);
  }
  console.log('');
});

// Demo 8: Get consensus statistics
console.log('='.repeat(70));
console.log('\n📈 Consensus Statistics:\n');
const stats = tracker.getConsensusStatistics();
console.log(`Total Networks Tracked: ${stats.totalNetworks}`);
console.log(`Average Block Time: ${stats.averageBlockTime} seconds`);
console.log('\nConsensus Distribution:');
for (const [consensus, count] of Object.entries(stats.byConsensus)) {
  console.log(`  ${consensus}: ${count} networks`);
}
console.log(`\nEnergy Profile:`);
console.log(`  Energy Efficient Networks: ${stats.energyEfficient}`);
console.log(`  Energy Intensive Networks: ${stats.energyIntensive}`);

// Demo 9: Check consensus mechanisms
console.log('\n' + '='.repeat(70));
console.log('\n✅ Consensus Mechanism Checks:\n');
console.log(`Bitcoin is PoW: ${tracker.isProofOfWork('bitcoin')}`);
console.log(`Bitcoin is PoS: ${tracker.isProofOfStake('bitcoin')}`);
console.log(`Ethereum is PoW: ${tracker.isProofOfWork('ethereum')}`);
console.log(`Ethereum is PoS: ${tracker.isProofOfStake('ethereum')}`);
console.log(`Base is PoS: ${tracker.isProofOfStake('base')}`);
console.log(`Litecoin is PoW: ${tracker.isProofOfWork('litecoin')}`);

// Demo 10: Get all networks
console.log('\n' + '='.repeat(70));
console.log('\n🌐 All Tracked Networks:\n');
const allNetworks = tracker.getAllNetworks();
allNetworks.forEach(network => {
  console.log(`  • ${network.name} - ${network.consensus}`);
  if (network.chainId) {
    console.log(`    Chain ID: ${network.chainId}`);
  }
  console.log(`    Explorer: ${network.explorerUrl}`);
  console.log('');
});

console.log('='.repeat(70));
console.log('\n✨ Demo Complete!');
console.log('='.repeat(70));
