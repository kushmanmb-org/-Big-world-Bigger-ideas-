/**
 * ISO/IEC 27001:2013 Certification Fetcher - Example Usage
 * 
 * This example demonstrates how to use the ISO27001Fetcher module
 * to retrieve and display certification information for kushmanmb.
 */

const ISO27001Fetcher = require('./iso27001.js');

async function runExamples() {
  console.log('\n╔════════════════════════════════════════════════════════════════════╗');
  console.log('║     ISO/IEC 27001:2013 Certification Fetcher - Demo               ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');

  // Create a fetcher instance for kushmanmb
  const fetcher = new ISO27001Fetcher('kushmanmb');

  // Example 1: Get and display full certification information
  console.log('Example 1: Full Certification Information');
  console.log('─'.repeat(70));
  const info = fetcher.getCertificationInfo();
  console.log(fetcher.formatCertificationInfo(info));

  // Example 2: Get compliance status
  console.log('\nExample 2: Compliance Status Summary');
  console.log('─'.repeat(70));
  const status = fetcher.getComplianceStatus();
  console.log(`Owner: ${status.owner}`);
  console.log(`Total Controls: ${status.totalControls}`);
  console.log(`Implemented Controls: ${status.implementedControls}`);
  console.log(`Compliance Percentage: ${status.percentage}%`);
  console.log(`Overall Status: ${status.status}`);
  console.log(`Last Assessment: ${new Date(status.lastAssessment).toLocaleDateString()}`);

  // Example 3: Get detailed control status
  console.log('\n\nExample 3: Detailed Control Status by Domain');
  console.log('─'.repeat(70));
  const controlStatus = fetcher.getControlStatus();
  console.log(`\nSummary for ${controlStatus.owner}:`);
  console.log(`  Fully Implemented Domains: ${controlStatus.summary.fullyImplemented}`);
  console.log(`  Partially Implemented Domains: ${controlStatus.summary.partiallyImplemented}`);
  console.log(`  Not Implemented Domains: ${controlStatus.summary.notImplemented}`);
  console.log('\nControl Domains:');
  controlStatus.domains.forEach(domain => {
    const percentage = Math.round((domain.implemented / domain.controls) * 100);
    const bar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5));
    const statusIcon = percentage === 100 ? '✓' : percentage >= 80 ? '◐' : '○';
    console.log(`  ${statusIcon} ${domain.domain}`);
    console.log(`     [${bar}] ${percentage}% (${domain.implemented}/${domain.controls})`);
  });

  // Example 4: Repository-specific compliance areas
  console.log('\n\nExample 4: Repository Compliance Areas');
  console.log('─'.repeat(70));
  console.log('\nCompliance areas specific to this blockchain repository:');
  info.complianceAreas.forEach(area => {
    const statusIcon = area.status === 'Compliant' ? '✓' : '○';
    console.log(`\n  ${statusIcon} ${area.area}`);
    console.log(`     Status: ${area.status}`);
    console.log(`     ${area.description}`);
  });

  // Example 5: Generate full compliance report
  console.log('\n\nExample 5: Full Compliance Report');
  console.log('─'.repeat(70));
  const report = fetcher.generateComplianceReport();
  console.log(report);

  // Example 6: View standard clauses
  console.log('\nExample 6: ISO 27001:2013 Standard Clauses');
  console.log('─'.repeat(70));
  console.log('\nThe standard consists of the following main clauses:\n');
  info.clauses.forEach(clause => {
    console.log(`Clause ${clause.number}: ${clause.title}`);
    console.log(`  ${clause.description}\n`);
  });

  // Example 7: Benefits of certification
  console.log('\nExample 7: Benefits of ISO 27001:2013 Certification');
  console.log('─'.repeat(70));
  console.log('\nKey benefits for kushmanmb:\n');
  info.benefits.forEach((benefit, index) => {
    console.log(`  ${index + 1}. ${benefit}`);
  });

  // Example 8: Cache statistics
  console.log('\n\nExample 8: Cache Statistics');
  console.log('─'.repeat(70));
  const cacheStats = fetcher.getCacheStats();
  console.log(`Cache Size: ${cacheStats.size} entries`);
  console.log(`Cache Timeout: ${cacheStats.timeout / 1000} seconds`);
  console.log(`Cached Keys: ${cacheStats.entries.join(', ')}`);

  // Example 9: Clear cache and reload
  console.log('\n\nExample 9: Cache Management');
  console.log('─'.repeat(70));
  console.log('Clearing cache...');
  fetcher.clearCache();
  const statsAfterClear = fetcher.getCacheStats();
  console.log(`Cache Size After Clear: ${statsAfterClear.size} entries`);
  console.log('Reloading certification info...');
  const reloadedInfo = fetcher.getCertificationInfo();
  console.log(`✓ Information reloaded successfully`);
  console.log(`  Standard: ${reloadedInfo.standard}`);
  console.log(`  Owner: ${reloadedInfo.owner}`);

  // Example 10: Control implementation statistics
  console.log('\n\nExample 10: Control Implementation Statistics');
  console.log('─'.repeat(70));
  const controls = info.controls;
  let totalImplemented = 0;
  let totalControls = 0;
  controls.domains.forEach(domain => {
    totalImplemented += domain.implemented;
    totalControls += domain.controls;
  });
  const implementationRate = Math.round((totalImplemented / totalControls) * 100);
  console.log(`Total Controls in Standard: ${controls.totalControls}`);
  console.log(`Implemented Controls: ${totalImplemented}`);
  console.log(`Pending Controls: ${totalControls - totalImplemented}`);
  console.log(`Implementation Rate: ${implementationRate}%`);
  
  const bar = '█'.repeat(Math.floor(implementationRate / 2)) + '░'.repeat(50 - Math.floor(implementationRate / 2));
  console.log(`\n[${bar}] ${implementationRate}%`);

  console.log('\n╔════════════════════════════════════════════════════════════════════╗');
  console.log('║                    Demo Completed Successfully                     ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');
}

// Run the examples
runExamples().catch(error => {
  console.error('Error running examples:', error);
  process.exit(1);
});
