/**
 * GitHub Rulesets Configuration Validation Tests
 * 
 * This test validates that the branch protection rulesets are valid JSON
 * and contain the expected structure.
 */

const fs = require('fs');
const path = require('path');

console.log('Running GitHub Rulesets Validation Tests...\n');

// File paths
const BRANCH_PROTECTION_PATH = path.join(__dirname, '..', '.github', 'rulesets', 'branch-protection.json');
const RELEASE_PROTECTION_PATH = path.join(__dirname, '..', '.github', 'rulesets', 'release-protection.json');

// Load and parse configurations once
let branchProtectionData = null;
let releaseProtectionData = null;

function loadConfigurations() {
  try {
    const branchContent = fs.readFileSync(BRANCH_PROTECTION_PATH, 'utf8');
    branchProtectionData = JSON.parse(branchContent);
  } catch (error) {
    // Will be caught in individual tests
  }
  
  try {
    const releaseContent = fs.readFileSync(RELEASE_PROTECTION_PATH, 'utf8');
    releaseProtectionData = JSON.parse(releaseContent);
  } catch (error) {
    // Will be caught in individual tests
  }
}

let passed = 0;
let failed = 0;

function test(description, fn) {
  try {
    fn();
    console.log('✓', description);
    passed++;
  } catch (error) {
    console.log('✗', description);
    console.error('  Error:', error.message);
    failed++;
  }
}

// Load configurations before running tests
loadConfigurations();

// Test 1: Validate branch-protection.json exists
test('should have branch-protection.json file', () => {
  if (!fs.existsSync(BRANCH_PROTECTION_PATH)) {
    throw new Error('branch-protection.json not found');
  }
});

// Test 2: Validate branch-protection.json is valid JSON
test('should have valid JSON in branch-protection.json', () => {
  if (!branchProtectionData) {
    throw new Error('Failed to parse branch-protection.json');
  }
});

// Test 3: Validate branch-protection.json has required fields
test('should have required fields in branch-protection.json', () => {
  if (!branchProtectionData.name) throw new Error('Missing "name" field');
  if (!branchProtectionData.target) throw new Error('Missing "target" field');
  if (!branchProtectionData.enforcement) throw new Error('Missing "enforcement" field');
  if (!branchProtectionData.conditions) throw new Error('Missing "conditions" field');
  if (!branchProtectionData.rules || !Array.isArray(branchProtectionData.rules)) throw new Error('Missing or invalid "rules" field');
  if (branchProtectionData.rules.length === 0) throw new Error('Rules array is empty');
});

// Test 4: Validate release-protection.json exists
test('should have release-protection.json file', () => {
  if (!fs.existsSync(RELEASE_PROTECTION_PATH)) {
    throw new Error('release-protection.json not found');
  }
});

// Test 5: Validate release-protection.json is valid JSON
test('should have valid JSON in release-protection.json', () => {
  if (!releaseProtectionData) {
    throw new Error('Failed to parse release-protection.json');
  }
});

// Test 6: Validate release-protection.json has required fields
test('should have required fields in release-protection.json', () => {
  if (!releaseProtectionData.name) throw new Error('Missing "name" field');
  if (!releaseProtectionData.target) throw new Error('Missing "target" field');
  if (!releaseProtectionData.enforcement) throw new Error('Missing "enforcement" field');
  if (!releaseProtectionData.conditions) throw new Error('Missing "conditions" field');
  if (!releaseProtectionData.rules || !Array.isArray(releaseProtectionData.rules)) throw new Error('Missing or invalid "rules" field');
  if (releaseProtectionData.rules.length === 0) throw new Error('Rules array is empty');
});

// Test 7: Validate release-protection.json protects release branches
test('should protect release/** branches in release-protection.json', () => {
  const includes = releaseProtectionData.conditions.ref_name.include || [];
  const hasRelease = includes.some(ref => ref.includes('release'));
  
  if (!hasRelease) {
    throw new Error('release-protection.json should include release/** branches');
  }
});

// Test 8: Validate release-protection.json protects hotfix branches
test('should protect hotfix/** branches in release-protection.json', () => {
  const includes = releaseProtectionData.conditions.ref_name.include || [];
  const hasHotfix = includes.some(ref => ref.includes('hotfix'));
  
  if (!hasHotfix) {
    throw new Error('release-protection.json should include hotfix/** branches');
  }
});

// Test 9: Validate release-protection.json requires pull requests
test('should require pull requests in release-protection.json', () => {
  const hasPullRequestRule = releaseProtectionData.rules.some(rule => rule.type === 'pull_request');
  
  if (!hasPullRequestRule) {
    throw new Error('release-protection.json should have a pull_request rule');
  }
});

// Test 10: Validate release-protection.json requires 2 approvals
test('should require 2 approvals in release-protection.json', () => {
  const prRule = releaseProtectionData.rules.find(rule => rule.type === 'pull_request');
  
  if (!prRule || !prRule.parameters) {
    throw new Error('Pull request rule missing parameters');
  }
  
  if (prRule.parameters.required_approving_review_count !== 2) {
    throw new Error('release-protection.json should require 2 approvals');
  }
});

// Test 11: Validate enforcement is active
test('should have active enforcement in release-protection.json', () => {
  if (releaseProtectionData.enforcement !== 'active') {
    throw new Error('Enforcement should be "active"');
  }
});

// Test 12: Validate target is branch
test('should target branches in release-protection.json', () => {
  if (releaseProtectionData.target !== 'branch') {
    throw new Error('Target should be "branch"');
  }
});

console.log('\n' + '='.repeat(50));
console.log(`Tests Passed: ${passed}`);
console.log(`Tests Failed: ${failed}`);
console.log('='.repeat(50));

if (failed > 0) {
  console.error('❌ Some tests failed!');
  process.exit(1);
} else {
  console.log('✅ All tests passed!');
  process.exit(0);
}
