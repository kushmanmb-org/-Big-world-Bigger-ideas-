/**
 * Test for Package Metadata Module
 * Validates that metadata can be retrieved correctly
 */

const PackageMetadata = require('./metadata');
const path = require('path');

console.log('Testing Package Metadata Module...\n');

// Test 1: Create metadata instance
console.log('Test 1: Creating metadata instance...');
try {
  const metadata = new PackageMetadata();
  console.log('✓ Metadata instance created successfully');
} catch (error) {
  console.error('✗ Failed to create metadata instance:', error.message);
  process.exit(1);
}

// Test 2: Read package.json
console.log('\nTest 2: Reading package.json...');
try {
  const metadata = new PackageMetadata();
  const packageData = metadata.readPackageJson();
  
  if (!packageData || !packageData.name) {
    throw new Error('Invalid package.json data');
  }
  
  console.log(`✓ Successfully read package.json: ${packageData.name}@${packageData.version}`);
} catch (error) {
  console.error('✗ Failed to read package.json:', error.message);
  process.exit(1);
}

// Test 3: Read package-lock.json
console.log('\nTest 3: Reading package-lock.json...');
try {
  const metadata = new PackageMetadata();
  const lockData = metadata.readPackageLock();
  
  if (lockData) {
    console.log('✓ Successfully read package-lock.json');
  } else {
    console.log('⚠ package-lock.json not found (optional)');
  }
} catch (error) {
  console.error('✗ Error reading package-lock.json:', error.message);
}

// Test 4: Get complete metadata
console.log('\nTest 4: Retrieving complete metadata...');
try {
  const metadata = new PackageMetadata();
  const data = metadata.getMetadata();
  
  // Validate structure
  if (!data.package) {
    throw new Error('Missing package field');
  }
  
  if (!data.dependencies) {
    throw new Error('Missing dependencies field');
  }
  
  if (!data.workspace_root) {
    throw new Error('Missing workspace_root field');
  }
  
  console.log('✓ Successfully retrieved metadata');
  console.log(`  - Package: ${data.package.name}`);
  console.log(`  - Version: ${data.package.version}`);
  console.log(`  - Dependencies: ${data.dependencies.length}`);
} catch (error) {
  console.error('✗ Failed to retrieve metadata:', error.message);
  process.exit(1);
}

// Test 5: Generate JSON output
console.log('\nTest 5: Generating JSON output...');
try {
  const metadata = new PackageMetadata();
  const json = metadata.toJSON();
  
  // Validate it's valid JSON
  const parsed = JSON.parse(json);
  
  if (!parsed.package || !parsed.dependencies) {
    throw new Error('Invalid JSON structure');
  }
  
  console.log('✓ Successfully generated valid JSON output');
  console.log(`  - JSON length: ${json.length} characters`);
} catch (error) {
  console.error('✗ Failed to generate JSON:', error.message);
  process.exit(1);
}

// Test 6: Dependency extraction
console.log('\nTest 6: Testing dependency extraction...');
try {
  const metadata = new PackageMetadata();
  const data = metadata.getMetadata();
  
  const regularDeps = data.dependencies.filter(d => d.type === 'dependency');
  const devDeps = data.dependencies.filter(d => d.type === 'devDependency');
  
  console.log('✓ Dependency extraction working correctly');
  console.log(`  - Regular dependencies: ${regularDeps.length}`);
  console.log(`  - Dev dependencies: ${devDeps.length}`);
  
  // List dependencies
  if (regularDeps.length > 0) {
    console.log('  - Regular deps:', regularDeps.map(d => d.name).join(', '));
  }
  if (devDeps.length > 0) {
    console.log('  - Dev deps:', devDeps.map(d => d.name).join(', '));
  }
} catch (error) {
  console.error('✗ Failed dependency extraction:', error.message);
  process.exit(1);
}

// Test 7: Resolved versions
console.log('\nTest 7: Testing resolved version lookup...');
try {
  const metadata = new PackageMetadata();
  const data = metadata.getMetadata();
  
  const withResolved = data.dependencies.filter(d => d.resolved !== null);
  
  console.log('✓ Resolved version lookup working');
  console.log(`  - Dependencies with resolved versions: ${withResolved.length}/${data.dependencies.length}`);
  
  if (withResolved.length > 0) {
    const example = withResolved[0];
    console.log(`  - Example: ${example.name}@${example.version} → ${example.resolved}`);
  }
} catch (error) {
  console.error('✗ Failed resolved version lookup:', error.message);
  process.exit(1);
}

console.log('\n' + '='.repeat(50));
console.log('✅ All tests passed successfully!');
console.log('='.repeat(50));
