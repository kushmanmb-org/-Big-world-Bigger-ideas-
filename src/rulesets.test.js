/**
 * GitHub Rulesets Configuration Validation Tests
 * 
 * This test validates that the branch protection rulesets are valid JSON
 * and contain the expected structure.
 */

const fs = require('fs');
const path = require('path');

console.log('Running GitHub Rulesets Validation Tests...\n');

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

// Test 1: Validate branch-protection.json exists
test('should have branch-protection.json file', () => {
  const filePath = path.join(__dirname, '..', '.github', 'rulesets', 'branch-protection.json');
  if (!fs.existsSync(filePath)) {
    throw new Error('branch-protection.json not found');
  }
});

// Test 2: Validate branch-protection.json is valid JSON
test('should have valid JSON in branch-protection.json', () => {
  const filePath = path.join(__dirname, '..', '.github', 'rulesets', 'branch-protection.json');
  const content = fs.readFileSync(filePath, 'utf8');
  JSON.parse(content);
});

// Test 3: Validate branch-protection.json has required fields
test('should have required fields in branch-protection.json', () => {
  const filePath = path.join(__dirname, '..', '.github', 'rulesets', 'branch-protection.json');
  const content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);
  
  if (!data.name) throw new Error('Missing "name" field');
  if (!data.target) throw new Error('Missing "target" field');
  if (!data.enforcement) throw new Error('Missing "enforcement" field');
  if (!data.conditions) throw new Error('Missing "conditions" field');
  if (!data.rules || !Array.isArray(data.rules)) throw new Error('Missing or invalid "rules" field');
  if (data.rules.length === 0) throw new Error('Rules array is empty');
});

// Test 4: Validate release-protection.json exists
test('should have release-protection.json file', () => {
  const filePath = path.join(__dirname, '..', '.github', 'rulesets', 'release-protection.json');
  if (!fs.existsSync(filePath)) {
    throw new Error('release-protection.json not found');
  }
});

// Test 5: Validate release-protection.json is valid JSON
test('should have valid JSON in release-protection.json', () => {
  const filePath = path.join(__dirname, '..', '.github', 'rulesets', 'release-protection.json');
  const content = fs.readFileSync(filePath, 'utf8');
  JSON.parse(content);
});

// Test 6: Validate release-protection.json has required fields
test('should have required fields in release-protection.json', () => {
  const filePath = path.join(__dirname, '..', '.github', 'rulesets', 'release-protection.json');
  const content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);
  
  if (!data.name) throw new Error('Missing "name" field');
  if (!data.target) throw new Error('Missing "target" field');
  if (!data.enforcement) throw new Error('Missing "enforcement" field');
  if (!data.conditions) throw new Error('Missing "conditions" field');
  if (!data.rules || !Array.isArray(data.rules)) throw new Error('Missing or invalid "rules" field');
  if (data.rules.length === 0) throw new Error('Rules array is empty');
});

// Test 7: Validate release-protection.json protects release branches
test('should protect release/** branches in release-protection.json', () => {
  const filePath = path.join(__dirname, '..', '.github', 'rulesets', 'release-protection.json');
  const content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);
  
  const includes = data.conditions.ref_name.include || [];
  const hasRelease = includes.some(ref => ref.includes('release'));
  
  if (!hasRelease) {
    throw new Error('release-protection.json should include release/** branches');
  }
});

// Test 8: Validate release-protection.json protects hotfix branches
test('should protect hotfix/** branches in release-protection.json', () => {
  const filePath = path.join(__dirname, '..', '.github', 'rulesets', 'release-protection.json');
  const content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);
  
  const includes = data.conditions.ref_name.include || [];
  const hasHotfix = includes.some(ref => ref.includes('hotfix'));
  
  if (!hasHotfix) {
    throw new Error('release-protection.json should include hotfix/** branches');
  }
});

// Test 9: Validate release-protection.json requires pull requests
test('should require pull requests in release-protection.json', () => {
  const filePath = path.join(__dirname, '..', '.github', 'rulesets', 'release-protection.json');
  const content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);
  
  const hasPullRequestRule = data.rules.some(rule => rule.type === 'pull_request');
  
  if (!hasPullRequestRule) {
    throw new Error('release-protection.json should have a pull_request rule');
  }
});

// Test 10: Validate release-protection.json requires 2 approvals
test('should require 2 approvals in release-protection.json', () => {
  const filePath = path.join(__dirname, '..', '.github', 'rulesets', 'release-protection.json');
  const content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);
  
  const prRule = data.rules.find(rule => rule.type === 'pull_request');
  
  if (!prRule || !prRule.parameters) {
    throw new Error('Pull request rule missing parameters');
  }
  
  if (prRule.parameters.required_approving_review_count !== 2) {
    throw new Error('release-protection.json should require 2 approvals');
  }
});

// Test 11: Validate enforcement is active
test('should have active enforcement in release-protection.json', () => {
  const filePath = path.join(__dirname, '..', '.github', 'rulesets', 'release-protection.json');
  const content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);
  
  if (data.enforcement !== 'active') {
    throw new Error('Enforcement should be "active"');
  }
});

// Test 12: Validate target is branch
test('should target branches in release-protection.json', () => {
  const filePath = path.join(__dirname, '..', '.github', 'rulesets', 'release-protection.json');
  const content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);
  
  if (data.target !== 'branch') {
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
