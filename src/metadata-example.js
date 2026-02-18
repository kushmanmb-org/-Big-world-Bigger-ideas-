/**
 * Example usage of the Package Metadata module
 * Demonstrates how to use the metadata retrieval functionality
 */

const PackageMetadata = require('./metadata');

console.log('Package Metadata Example\n');
console.log('Similar to Rust\'s "cargo metadata" command, this tool');
console.log('retrieves structured metadata about the package.\n');
console.log('='.repeat(60));

// Create metadata instance
const metadata = new PackageMetadata();

// Example 1: Get complete metadata object
console.log('\n📦 Package Information:');
const data = metadata.getMetadata();
console.log(`   Name: ${data.package.name}`);
console.log(`   Version: ${data.package.version}`);
console.log(`   Description: ${data.package.description}`);
console.log(`   License: ${data.package.license}`);
console.log(`   Author: ${data.package.author}`);

// Example 2: Show dependencies
console.log('\n📚 Dependencies:');
const regularDeps = data.dependencies.filter(d => d.type === 'dependency');
const devDeps = data.dependencies.filter(d => d.type === 'devDependency');

if (regularDeps.length > 0) {
  console.log('\n   Production Dependencies:');
  regularDeps.forEach(dep => {
    console.log(`   - ${dep.name}: ${dep.version} (resolved: ${dep.resolved || 'N/A'})`);
  });
}

if (devDeps.length > 0) {
  console.log('\n   Development Dependencies:');
  devDeps.forEach(dep => {
    console.log(`   - ${dep.name}: ${dep.version} (resolved: ${dep.resolved || 'N/A'})`);
  });
}

// Example 3: Show workspace information
console.log('\n🗂️  Workspace Information:');
console.log(`   Root: ${data.workspace_root}`);
console.log(`   Node modules: ${data.target_directory}`);
console.log(`   Metadata version: ${data.metadata_version}`);

// Example 4: Show available scripts
console.log('\n🚀 Available Scripts:');
Object.entries(data.package.scripts).forEach(([name, command]) => {
  console.log(`   npm run ${name}`);
  console.log(`      → ${command}`);
});

// Example 5: Export as JSON
console.log('\n📄 JSON Export:');
console.log('   To export metadata as JSON, run:');
console.log('   npm run metadata > metadata.json');
console.log('\n   Or programmatically:');
console.log('   const json = metadata.toJSON();');

console.log('\n' + '='.repeat(60));
console.log('✅ Example completed!\n');
console.log('To get raw JSON output, run: npm run metadata');
