/**
 * Blockchain Council Demo
 * Demonstrates the functionality of the Blockchain Council module
 */

const { BlockchainCouncil, MEMBER_ROLES, PROPOSAL_STATUS } = require('./blockchain-council.js');

console.log('='.repeat(70));
console.log('🏛️  Blockchain Council Governance Demo');
console.log('='.repeat(70));

// Create a blockchain council
const council = new BlockchainCouncil('Web3 Foundation Council', {
  votingThreshold: 0.6,  // 60% approval needed
  quorumPercentage: 0.4  // 40% participation required
});

console.log('\n✨ Council Created!');
console.log(`Name: ${council.councilName}`);
console.log(`Voting Threshold: ${council.votingThreshold * 100}%`);
console.log(`Quorum Requirement: ${council.quorumPercentage * 100}%`);

// Add council members
console.log('\n' + '='.repeat(70));
console.log('\n👥 Adding Council Members...\n');

const alice = council.addMember(
  '0x1111111111111111111111111111111111111111',
  'Alice Johnson',
  MEMBER_ROLES.FOUNDER,
  { bio: 'Blockchain pioneer and protocol architect' }
);
console.log(`✓ Added ${alice.name} as ${alice.role}`);

const bob = council.addMember(
  '0x2222222222222222222222222222222222222222',
  'Bob Smith',
  MEMBER_ROLES.CORE_DEVELOPER,
  { bio: 'Smart contract expert' }
);
console.log(`✓ Added ${bob.name} as ${bob.role}`);

const carol = council.addMember(
  '0x3333333333333333333333333333333333333333',
  'Carol Williams',
  MEMBER_ROLES.VALIDATOR,
  { bio: 'Network security specialist' }
);
console.log(`✓ Added ${carol.name} as ${carol.role}`);

const david = council.addMember(
  '0x4444444444444444444444444444444444444444',
  'David Brown',
  MEMBER_ROLES.SECURITY_AUDITOR,
  { bio: 'Security researcher and auditor' }
);
console.log(`✓ Added ${david.name} as ${david.role}`);

const eve = council.addMember(
  '0x5555555555555555555555555555555555555555',
  'Eve Davis',
  MEMBER_ROLES.COMMUNITY_LEAD,
  { bio: 'Community engagement and governance' }
);
console.log(`✓ Added ${eve.name} as ${eve.role}`);

// Display all members
console.log('\n' + '='.repeat(70));
console.log('\n📋 Council Members:\n');
const allMembers = council.getAllMembers();
allMembers.forEach((member, index) => {
  console.log(`${index + 1}. ${member.name}`);
  console.log(`   Address: ${member.address}`);
  console.log(`   Role: ${member.role}`);
  console.log(`   Joined: ${member.joinedAt}`);
  console.log(`   Voting Power: ${member.votingPower}`);
  if (member.metadata.bio) {
    console.log(`   Bio: ${member.metadata.bio}`);
  }
  console.log('');
});

// Create proposals
console.log('='.repeat(70));
console.log('\n📝 Creating Proposals...\n');

const proposal1 = council.createProposal(
  alice.address,
  'Upgrade Protocol to V2',
  'Proposal to upgrade the protocol to version 2.0 with improved gas efficiency and new features.',
  { metadata: { type: 'technical', priority: 'high' } }
);
console.log(`✓ Proposal #${proposal1.id}: "${proposal1.title}"`);
console.log(`  Created by: ${alice.name}`);
console.log(`  Status: ${proposal1.status}`);

const proposal2 = council.createProposal(
  eve.address,
  'Community Grant Program',
  'Establish a community grant program with 100 ETH budget for ecosystem development.',
  { metadata: { type: 'funding', priority: 'medium' } }
);
console.log(`\n✓ Proposal #${proposal2.id}: "${proposal2.title}"`);
console.log(`  Created by: ${eve.name}`);
console.log(`  Status: ${proposal2.status}`);

// Voting on Proposal 1
console.log('\n' + '='.repeat(70));
console.log('\n🗳️  Voting on Proposal #1: "Upgrade Protocol to V2"\n');

council.vote(proposal1.id, bob.address, 'for');
console.log(`✓ ${bob.name} voted FOR`);

council.vote(proposal1.id, carol.address, 'for');
console.log(`✓ ${carol.name} voted FOR`);

council.vote(proposal1.id, david.address, 'for');
console.log(`✓ ${david.name} voted FOR`);

council.vote(proposal1.id, eve.address, 'abstain');
console.log(`✓ ${eve.name} voted ABSTAIN`);

const proposal1State = council.getProposal(proposal1.id);
console.log('\nCurrent Votes:');
console.log(`  For: ${proposal1State.votes.for}`);
console.log(`  Against: ${proposal1State.votes.against}`);
console.log(`  Abstain: ${proposal1State.votes.abstain}`);
console.log(`  Total Voters: ${proposal1State.voters.length}/${council.getActiveMemberCount()}`);

// Close voting on Proposal 1
console.log('\n' + '='.repeat(70));
console.log('\n✅ Closing Vote on Proposal #1...\n');

const closedProposal1 = council.closeVoting(proposal1.id);
console.log(`Status: ${closedProposal1.status}`);
console.log(`Outcome: ${closedProposal1.outcome}`);

// Execute passed proposal
if (closedProposal1.status === PROPOSAL_STATUS.PASSED) {
  console.log('\n⚡ Executing Proposal #1...');
  const executed = council.executeProposal(proposal1.id);
  console.log(`✓ Proposal executed successfully!`);
  console.log(`  Executed at: ${executed.executedAt}`);
}

// Voting on Proposal 2
console.log('\n' + '='.repeat(70));
console.log('\n🗳️  Voting on Proposal #2: "Community Grant Program"\n');

council.vote(proposal2.id, alice.address, 'for');
console.log(`✓ ${alice.name} voted FOR`);

council.vote(proposal2.id, bob.address, 'against');
console.log(`✓ ${bob.name} voted AGAINST`);

council.vote(proposal2.id, carol.address, 'for');
console.log(`✓ ${carol.name} voted FOR`);

const proposal2State = council.getProposal(proposal2.id);
console.log('\nCurrent Votes:');
console.log(`  For: ${proposal2State.votes.for}`);
console.log(`  Against: ${proposal2State.votes.against}`);
console.log(`  Abstain: ${proposal2State.votes.abstain}`);

// Close voting on Proposal 2
console.log('\n' + '='.repeat(70));
console.log('\n📊 Closing Vote on Proposal #2...\n');

const closedProposal2 = council.closeVoting(proposal2.id);
console.log(`Status: ${closedProposal2.status}`);
console.log(`Outcome: ${closedProposal2.outcome}`);

// Display council statistics
console.log('\n' + '='.repeat(70));
console.log('\n📈 Council Statistics:\n');

const stats = council.getStatistics();
console.log(`Council Name: ${stats.councilName}`);
console.log(`Total Members: ${stats.totalMembers}`);
console.log(`Active Members: ${stats.activeMembers}`);
console.log(`Total Proposals: ${stats.totalProposals}`);
console.log(`Voting Threshold: ${stats.votingThreshold * 100}%`);
console.log(`Quorum Requirement: ${stats.quorumPercentage * 100}%`);

console.log('\nRole Distribution:');
for (const [role, count] of Object.entries(stats.roleDistribution)) {
  console.log(`  ${role}: ${count}`);
}

console.log('\nProposal Status:');
for (const [status, count] of Object.entries(stats.proposalsByStatus)) {
  console.log(`  ${status}: ${count}`);
}

// Display member participation
console.log('\n' + '='.repeat(70));
console.log('\n👤 Member Participation Statistics:\n');

allMembers.forEach(member => {
  const participation = council.getMemberParticipation(member.address);
  console.log(`${participation.name} (${participation.role}):`);
  console.log(`  Proposals Created: ${participation.proposalsCreated}`);
  console.log(`  Votes Participated: ${participation.votesParticipated}`);
  console.log(`  Participation Rate: ${participation.participationRate}`);
  console.log('');
});

// Display all proposals
console.log('='.repeat(70));
console.log('\n📋 All Proposals:\n');

const allProposals = council.getAllProposals();
allProposals.forEach(proposal => {
  const creator = council.getMember(proposal.creator);
  console.log(`Proposal #${proposal.id}: ${proposal.title}`);
  console.log(`  Creator: ${creator.name}`);
  console.log(`  Status: ${proposal.status}`);
  console.log(`  Created: ${proposal.createdAt}`);
  if (proposal.outcome) {
    console.log(`  Outcome: ${proposal.outcome}`);
  }
  console.log(`  Votes - For: ${proposal.votes.for}, Against: ${proposal.votes.against}, Abstain: ${proposal.votes.abstain}`);
  console.log('');
});

// Filter proposals by status
console.log('='.repeat(70));
console.log('\n✅ Executed Proposals:\n');

const executedProposals = council.getAllProposals({ status: PROPOSAL_STATUS.EXECUTED });
if (executedProposals.length > 0) {
  executedProposals.forEach(proposal => {
    console.log(`  • ${proposal.title} (Executed at: ${proposal.executedAt})`);
  });
} else {
  console.log('  No executed proposals yet.');
}

// Update a member's role
console.log('\n' + '='.repeat(70));
console.log('\n✏️  Updating Member Role...\n');

const updatedBob = council.updateMember(bob.address, { 
  role: MEMBER_ROLES.ADVISOR 
});
console.log(`✓ Updated ${updatedBob.name}'s role from ${MEMBER_ROLES.CORE_DEVELOPER} to ${updatedBob.role}`);

// Export council data
console.log('\n' + '='.repeat(70));
console.log('\n💾 Exporting Council Data...\n');

const councilJSON = council.toJSON();
console.log('Council data exported successfully!');
console.log(`Total size: ${councilJSON.length} characters`);
console.log('\nPreview (first 200 characters):');
console.log(councilJSON.substring(0, 200) + '...');

console.log('\n' + '='.repeat(70));
console.log('\n✨ Demo Complete!');
console.log('='.repeat(70));
