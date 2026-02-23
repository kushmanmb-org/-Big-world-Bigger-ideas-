/**
 * Blockchain Council Module Tests
 * Tests for council management, member operations, and voting
 */

const { BlockchainCouncil, MEMBER_ROLES, PROPOSAL_STATUS } = require('./blockchain-council.js');

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
    console.error(`✗ ${message}`);
    console.error(`  Expected: ${expected}`);
    console.error(`  Actual: ${actual}`);
    testsFailed++;
  }
}

async function runTests() {
  console.log('Running Blockchain Council Module Tests...\n');
  console.log('='.repeat(50));

  // Test 1: Constructor
  console.log('\n📦 Testing Constructor...');
  try {
    const council = new BlockchainCouncil('Test Council');
    assert(council !== null, 'Should create council instance');
    assertEqual(council.councilName, 'Test Council', 'Council name should be set');
    assert(council.members.size === 0, 'Should start with no members');
    assert(council.proposals.size === 0, 'Should start with no proposals');
  } catch (error) {
    assert(false, `Constructor test failed: ${error.message}`);
  }

  // Test 2: Constructor with invalid name
  console.log('\n⚠️  Testing Constructor with Invalid Name...');
  try {
    new BlockchainCouncil('');
    assert(false, 'Should throw error for empty council name');
  } catch (error) {
    assert(error.message.includes('non-empty string'), 'Should throw appropriate error');
  }

  // Test 3: Add Member
  console.log('\n👤 Testing Add Member...');
  try {
    const council = new BlockchainCouncil('Test Council');
    const member = council.addMember(
      '0x1234567890123456789012345678901234567890',
      'Alice',
      MEMBER_ROLES.FOUNDER
    );
    assert(member !== null, 'Should return member object');
    assertEqual(member.name, 'Alice', 'Member name should be correct');
    assertEqual(member.role, MEMBER_ROLES.FOUNDER, 'Member role should be correct');
    assert(member.active === true, 'Member should be active by default');
    assertEqual(council.members.size, 1, 'Council should have 1 member');
  } catch (error) {
    assert(false, `Add member test failed: ${error.message}`);
  }

  // Test 4: Add Member with Invalid Address
  console.log('\n⚠️  Testing Add Member with Invalid Address...');
  try {
    const council = new BlockchainCouncil('Test Council');
    council.addMember('invalid-address', 'Bob', MEMBER_ROLES.CORE_DEVELOPER);
    assert(false, 'Should throw error for invalid address');
  } catch (error) {
    assert(error.message.includes('Invalid blockchain address'), 'Should throw address validation error');
  }

  // Test 5: Add Duplicate Member
  console.log('\n⚠️  Testing Add Duplicate Member...');
  try {
    const council = new BlockchainCouncil('Test Council');
    const address = '0x1234567890123456789012345678901234567890';
    council.addMember(address, 'Alice', MEMBER_ROLES.FOUNDER);
    council.addMember(address, 'Alice Again', MEMBER_ROLES.CORE_DEVELOPER);
    assert(false, 'Should throw error for duplicate member');
  } catch (error) {
    assert(error.message.includes('already exists'), 'Should throw duplicate error');
  }

  // Test 6: Add Member with Invalid Role
  console.log('\n⚠️  Testing Add Member with Invalid Role...');
  try {
    const council = new BlockchainCouncil('Test Council');
    council.addMember('0x1234567890123456789012345678901234567890', 'Bob', 'Invalid Role');
    assert(false, 'Should throw error for invalid role');
  } catch (error) {
    assert(error.message.includes('Invalid role'), 'Should throw role validation error');
  }

  // Test 7: Get Member
  console.log('\n🔍 Testing Get Member...');
  try {
    const council = new BlockchainCouncil('Test Council');
    const address = '0x1234567890123456789012345678901234567890';
    council.addMember(address, 'Alice', MEMBER_ROLES.FOUNDER);
    const member = council.getMember(address);
    assertEqual(member.name, 'Alice', 'Should retrieve correct member');
    assertEqual(member.address, address, 'Address should match');
  } catch (error) {
    assert(false, `Get member test failed: ${error.message}`);
  }

  // Test 8: Get Non-existent Member
  console.log('\n⚠️  Testing Get Non-existent Member...');
  try {
    const council = new BlockchainCouncil('Test Council');
    council.getMember('0x9999999999999999999999999999999999999999');
    assert(false, 'Should throw error for non-existent member');
  } catch (error) {
    assert(error.message.includes('not found'), 'Should throw not found error');
  }

  // Test 9: Remove Member
  console.log('\n🗑️  Testing Remove Member...');
  try {
    const council = new BlockchainCouncil('Test Council');
    const address = '0x1234567890123456789012345678901234567890';
    council.addMember(address, 'Alice', MEMBER_ROLES.FOUNDER);
    const removed = council.removeMember(address);
    assert(removed === true, 'Should return true when member is removed');
    assertEqual(council.members.size, 0, 'Council should have no members');
  } catch (error) {
    assert(false, `Remove member test failed: ${error.message}`);
  }

  // Test 10: Get All Members
  console.log('\n👥 Testing Get All Members...');
  try {
    const council = new BlockchainCouncil('Test Council');
    council.addMember('0x1111111111111111111111111111111111111111', 'Alice', MEMBER_ROLES.FOUNDER);
    council.addMember('0x2222222222222222222222222222222222222222', 'Bob', MEMBER_ROLES.CORE_DEVELOPER);
    council.addMember('0x3333333333333333333333333333333333333333', 'Carol', MEMBER_ROLES.VALIDATOR);
    const members = council.getAllMembers();
    assertEqual(members.length, 3, 'Should return all 3 members');
  } catch (error) {
    assert(false, `Get all members test failed: ${error.message}`);
  }

  // Test 11: Get Members with Filter
  console.log('\n🔍 Testing Get Members with Role Filter...');
  try {
    const council = new BlockchainCouncil('Test Council');
    council.addMember('0x1111111111111111111111111111111111111111', 'Alice', MEMBER_ROLES.FOUNDER);
    council.addMember('0x2222222222222222222222222222222222222222', 'Bob', MEMBER_ROLES.VALIDATOR);
    council.addMember('0x3333333333333333333333333333333333333333', 'Carol', MEMBER_ROLES.VALIDATOR);
    const validators = council.getAllMembers({ role: MEMBER_ROLES.VALIDATOR });
    assertEqual(validators.length, 2, 'Should return 2 validators');
  } catch (error) {
    assert(false, `Get members with filter test failed: ${error.message}`);
  }

  // Test 12: Update Member
  console.log('\n✏️  Testing Update Member...');
  try {
    const council = new BlockchainCouncil('Test Council');
    const address = '0x1234567890123456789012345678901234567890';
    council.addMember(address, 'Alice', MEMBER_ROLES.FOUNDER);
    const updated = council.updateMember(address, { role: MEMBER_ROLES.CORE_DEVELOPER });
    assertEqual(updated.role, MEMBER_ROLES.CORE_DEVELOPER, 'Role should be updated');
    assertEqual(updated.name, 'Alice', 'Name should remain unchanged');
  } catch (error) {
    assert(false, `Update member test failed: ${error.message}`);
  }

  // Test 13: Update Protected Field
  console.log('\n⚠️  Testing Update Protected Field...');
  try {
    const council = new BlockchainCouncil('Test Council');
    const address = '0x1234567890123456789012345678901234567890';
    council.addMember(address, 'Alice', MEMBER_ROLES.FOUNDER);
    council.updateMember(address, { address: '0x9999999999999999999999999999999999999999' });
    assert(false, 'Should throw error for updating protected field');
  } catch (error) {
    assert(error.message.includes('protected field'), 'Should throw protected field error');
  }

  // Test 14: Create Proposal
  console.log('\n📝 Testing Create Proposal...');
  try {
    const council = new BlockchainCouncil('Test Council');
    const address = '0x1234567890123456789012345678901234567890';
    council.addMember(address, 'Alice', MEMBER_ROLES.FOUNDER);
    const proposal = council.createProposal(
      address,
      'Test Proposal',
      'This is a test proposal'
    );
    assert(proposal !== null, 'Should return proposal object');
    assertEqual(proposal.title, 'Test Proposal', 'Proposal title should be correct');
    assertEqual(proposal.status, PROPOSAL_STATUS.ACTIVE, 'Proposal should be active');
    assertEqual(proposal.creator, address, 'Creator should be set correctly');
    assertEqual(council.proposals.size, 1, 'Council should have 1 proposal');
  } catch (error) {
    assert(false, `Create proposal test failed: ${error.message}`);
  }

  // Test 15: Create Proposal by Non-member
  console.log('\n⚠️  Testing Create Proposal by Non-member...');
  try {
    const council = new BlockchainCouncil('Test Council');
    council.createProposal(
      '0x9999999999999999999999999999999999999999',
      'Test Proposal',
      'This should fail'
    );
    assert(false, 'Should throw error for non-member creating proposal');
  } catch (error) {
    assert(error.message.includes('not found'), 'Should throw member not found error');
  }

  // Test 16: Vote on Proposal
  console.log('\n🗳️  Testing Vote on Proposal...');
  try {
    const council = new BlockchainCouncil('Test Council');
    const creator = '0x1111111111111111111111111111111111111111';
    const voter = '0x2222222222222222222222222222222222222222';
    council.addMember(creator, 'Alice', MEMBER_ROLES.FOUNDER);
    council.addMember(voter, 'Bob', MEMBER_ROLES.VALIDATOR);
    const proposal = council.createProposal(creator, 'Test Proposal', 'Description');
    const voted = council.vote(proposal.id, voter, 'for');
    assertEqual(voted.votes.for, 1, 'Vote should be recorded');
    assert(voted.voters.includes(voter), 'Voter should be in voters list');
  } catch (error) {
    assert(false, `Vote test failed: ${error.message}`);
  }

  // Test 17: Duplicate Vote
  console.log('\n⚠️  Testing Duplicate Vote...');
  try {
    const council = new BlockchainCouncil('Test Council');
    const creator = '0x1111111111111111111111111111111111111111';
    const voter = '0x2222222222222222222222222222222222222222';
    council.addMember(creator, 'Alice', MEMBER_ROLES.FOUNDER);
    council.addMember(voter, 'Bob', MEMBER_ROLES.VALIDATOR);
    const proposal = council.createProposal(creator, 'Test Proposal', 'Description');
    council.vote(proposal.id, voter, 'for');
    council.vote(proposal.id, voter, 'against');
    assert(false, 'Should throw error for duplicate vote');
  } catch (error) {
    assert(error.message.includes('already voted'), 'Should throw already voted error');
  }

  // Test 18: Invalid Vote Choice
  console.log('\n⚠️  Testing Invalid Vote Choice...');
  try {
    const council = new BlockchainCouncil('Test Council');
    const creator = '0x1111111111111111111111111111111111111111';
    const voter = '0x2222222222222222222222222222222222222222';
    council.addMember(creator, 'Alice', MEMBER_ROLES.FOUNDER);
    council.addMember(voter, 'Bob', MEMBER_ROLES.VALIDATOR);
    const proposal = council.createProposal(creator, 'Test Proposal', 'Description');
    council.vote(proposal.id, voter, 'invalid');
    assert(false, 'Should throw error for invalid vote choice');
  } catch (error) {
    assert(error.message.includes('Invalid vote'), 'Should throw invalid vote error');
  }

  // Test 19: Close Voting - Passed
  console.log('\n✅ Testing Close Voting (Passed)...');
  try {
    const council = new BlockchainCouncil('Test Council', { votingThreshold: 0.5, quorumPercentage: 0.3 });
    const creator = '0x1111111111111111111111111111111111111111';
    const voter1 = '0x2222222222222222222222222222222222222222';
    const voter2 = '0x3333333333333333333333333333333333333333';
    council.addMember(creator, 'Alice', MEMBER_ROLES.FOUNDER);
    council.addMember(voter1, 'Bob', MEMBER_ROLES.VALIDATOR);
    council.addMember(voter2, 'Carol', MEMBER_ROLES.VALIDATOR);
    const proposal = council.createProposal(creator, 'Test Proposal', 'Description');
    council.vote(proposal.id, voter1, 'for');
    council.vote(proposal.id, voter2, 'for');
    const closed = council.closeVoting(proposal.id);
    assertEqual(closed.status, PROPOSAL_STATUS.PASSED, 'Proposal should pass');
    assert(closed.outcome.includes('Passed'), 'Outcome should indicate passed');
  } catch (error) {
    assert(false, `Close voting (passed) test failed: ${error.message}`);
  }

  // Test 20: Close Voting - Rejected
  console.log('\n❌ Testing Close Voting (Rejected)...');
  try {
    const council = new BlockchainCouncil('Test Council', { votingThreshold: 0.5 });
    const creator = '0x1111111111111111111111111111111111111111';
    const voter1 = '0x2222222222222222222222222222222222222222';
    const voter2 = '0x3333333333333333333333333333333333333333';
    council.addMember(creator, 'Alice', MEMBER_ROLES.FOUNDER);
    council.addMember(voter1, 'Bob', MEMBER_ROLES.VALIDATOR);
    council.addMember(voter2, 'Carol', MEMBER_ROLES.VALIDATOR);
    const proposal = council.createProposal(creator, 'Test Proposal', 'Description');
    council.vote(proposal.id, voter1, 'against');
    council.vote(proposal.id, voter2, 'against');
    const closed = council.closeVoting(proposal.id);
    assertEqual(closed.status, PROPOSAL_STATUS.REJECTED, 'Proposal should be rejected');
  } catch (error) {
    assert(false, `Close voting (rejected) test failed: ${error.message}`);
  }

  // Test 21: Execute Proposal
  console.log('\n⚡ Testing Execute Proposal...');
  try {
    const council = new BlockchainCouncil('Test Council');
    const creator = '0x1111111111111111111111111111111111111111';
    const voter = '0x2222222222222222222222222222222222222222';
    council.addMember(creator, 'Alice', MEMBER_ROLES.FOUNDER);
    council.addMember(voter, 'Bob', MEMBER_ROLES.VALIDATOR);
    const proposal = council.createProposal(creator, 'Test Proposal', 'Description');
    council.vote(proposal.id, voter, 'for');
    council.closeVoting(proposal.id);
    const executed = council.executeProposal(proposal.id);
    assertEqual(executed.status, PROPOSAL_STATUS.EXECUTED, 'Proposal should be executed');
    assert(executed.executed === true, 'Executed flag should be true');
    assert(executed.executedAt !== null, 'Executed timestamp should be set');
  } catch (error) {
    assert(false, `Execute proposal test failed: ${error.message}`);
  }

  // Test 22: Execute Non-passed Proposal
  console.log('\n⚠️  Testing Execute Non-passed Proposal...');
  try {
    const council = new BlockchainCouncil('Test Council');
    const creator = '0x1111111111111111111111111111111111111111';
    council.addMember(creator, 'Alice', MEMBER_ROLES.FOUNDER);
    const proposal = council.createProposal(creator, 'Test Proposal', 'Description');
    council.executeProposal(proposal.id);
    assert(false, 'Should throw error for executing non-passed proposal');
  } catch (error) {
    assert(error.message.includes('has not passed'), 'Should throw appropriate error');
  }

  // Test 23: Get Statistics
  console.log('\n📊 Testing Get Statistics...');
  try {
    const council = new BlockchainCouncil('Test Council');
    council.addMember('0x1111111111111111111111111111111111111111', 'Alice', MEMBER_ROLES.FOUNDER);
    council.addMember('0x2222222222222222222222222222222222222222', 'Bob', MEMBER_ROLES.VALIDATOR);
    const stats = council.getStatistics();
    assertEqual(stats.totalMembers, 2, 'Should have correct member count');
    assertEqual(stats.activeMembers, 2, 'Should have correct active member count');
    assertEqual(stats.councilName, 'Test Council', 'Should have correct council name');
    assert(stats.roleDistribution !== undefined, 'Should have role distribution');
  } catch (error) {
    assert(false, `Get statistics test failed: ${error.message}`);
  }

  // Test 24: Get Member Participation
  console.log('\n📈 Testing Get Member Participation...');
  try {
    const council = new BlockchainCouncil('Test Council');
    const address = '0x1111111111111111111111111111111111111111';
    const voter = '0x2222222222222222222222222222222222222222';
    council.addMember(address, 'Alice', MEMBER_ROLES.FOUNDER);
    council.addMember(voter, 'Bob', MEMBER_ROLES.VALIDATOR);
    council.createProposal(address, 'Proposal 1', 'Description 1');
    council.createProposal(address, 'Proposal 2', 'Description 2');
    council.vote(1, voter, 'for');
    const participation = council.getMemberParticipation(voter);
    assertEqual(participation.votesParticipated, 1, 'Should have correct votes participated');
    assert(participation.participationRate !== undefined, 'Should have participation rate');
  } catch (error) {
    assert(false, `Get member participation test failed: ${error.message}`);
  }

  // Test 25: JSON Export
  console.log('\n💾 Testing JSON Export...');
  try {
    const council = new BlockchainCouncil('Test Council');
    council.addMember('0x1111111111111111111111111111111111111111', 'Alice', MEMBER_ROLES.FOUNDER);
    const json = council.toJSON();
    assert(typeof json === 'string', 'Should return JSON string');
    const parsed = JSON.parse(json);
    assertEqual(parsed.councilName, 'Test Council', 'Should include council name');
    assert(Array.isArray(parsed.members), 'Should include members array');
    assert(Array.isArray(parsed.proposals), 'Should include proposals array');
  } catch (error) {
    assert(false, `JSON export test failed: ${error.message}`);
  }

  // Test 26: Address Without 0x Prefix
  console.log('\n🔤 Testing Address Without 0x Prefix...');
  try {
    const council = new BlockchainCouncil('Test Council');
    const member = council.addMember(
      '1234567890123456789012345678901234567890',
      'Alice',
      MEMBER_ROLES.FOUNDER
    );
    assert(member !== null, 'Should accept address without 0x prefix');
  } catch (error) {
    assert(false, `Address without prefix test failed: ${error.message}`);
  }

  // Test 27: Get Active Member Count
  console.log('\n📊 Testing Get Active Member Count...');
  try {
    const council = new BlockchainCouncil('Test Council');
    council.addMember('0x1111111111111111111111111111111111111111', 'Alice', MEMBER_ROLES.FOUNDER);
    council.addMember('0x2222222222222222222222222222222222222222', 'Bob', MEMBER_ROLES.VALIDATOR);
    council.updateMember('0x2222222222222222222222222222222222222222', { active: false });
    const count = council.getActiveMemberCount();
    assertEqual(count, 1, 'Should return correct active member count');
  } catch (error) {
    assert(false, `Get active member count test failed: ${error.message}`);
  }

  // Test 28: Get All Proposals with Filters
  console.log('\n🔍 Testing Get All Proposals with Filters...');
  try {
    const council = new BlockchainCouncil('Test Council');
    const creator = '0x1111111111111111111111111111111111111111';
    council.addMember(creator, 'Alice', MEMBER_ROLES.FOUNDER);
    council.createProposal(creator, 'Proposal 1', 'Description 1');
    council.createProposal(creator, 'Proposal 2', 'Description 2');
    const proposals = council.getAllProposals({ status: PROPOSAL_STATUS.ACTIVE });
    assertEqual(proposals.length, 2, 'Should return all active proposals');
  } catch (error) {
    assert(false, `Get all proposals with filters test failed: ${error.message}`);
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
