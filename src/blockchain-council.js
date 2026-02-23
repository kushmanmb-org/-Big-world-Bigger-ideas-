/**
 * Blockchain Council Module
 * Manages blockchain council members, proposals, and governance
 * Provides comprehensive council management and voting functionality
 */

/**
 * Council member roles
 */
const MEMBER_ROLES = {
  FOUNDER: 'Founder',
  CORE_DEVELOPER: 'Core Developer',
  VALIDATOR: 'Validator',
  ADVISOR: 'Advisor',
  COMMUNITY_LEAD: 'Community Lead',
  SECURITY_AUDITOR: 'Security Auditor',
  DOCUMENTATION_LEAD: 'Documentation Lead'
};

/**
 * Proposal status types
 */
const PROPOSAL_STATUS = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  PASSED: 'Passed',
  REJECTED: 'Rejected',
  EXECUTED: 'Executed',
  CANCELLED: 'Cancelled'
};

/**
 * Blockchain Council Class
 * Manages council members, proposals, and voting
 */
class BlockchainCouncil {
  /**
   * Creates a new Blockchain Council instance
   * @param {string} councilName - Name of the council
   * @param {object} options - Configuration options
   */
  constructor(councilName = 'Default Council', options = {}) {
    if (!councilName || typeof councilName !== 'string') {
      throw new Error('Council name must be a non-empty string');
    }

    this.councilName = councilName;
    this.members = new Map();
    this.proposals = new Map();
    this.proposalCounter = 0;
    this.votingThreshold = options.votingThreshold || 0.5; // 50% default
    this.quorumPercentage = options.quorumPercentage || 0.3; // 30% default
    this.createdAt = new Date().toISOString();
  }

  /**
   * Adds a member to the council
   * @param {string} address - Member's blockchain address
   * @param {string} name - Member's name
   * @param {string} role - Member's role
   * @param {object} metadata - Additional metadata
   * @returns {object} The added member
   * @throws {Error} If address is invalid or member already exists
   */
  addMember(address, name, role = MEMBER_ROLES.COMMUNITY_LEAD, metadata = {}) {
    // Validate address
    if (!this._isValidAddress(address)) {
      throw new Error('Invalid blockchain address format');
    }

    // Check if member already exists
    if (this.members.has(address)) {
      throw new Error(`Member with address ${address} already exists`);
    }

    // Validate role
    if (!Object.values(MEMBER_ROLES).includes(role)) {
      throw new Error(`Invalid role. Must be one of: ${Object.values(MEMBER_ROLES).join(', ')}`);
    }

    const member = {
      address,
      name,
      role,
      joinedAt: new Date().toISOString(),
      votingPower: 1,
      proposalsCreated: 0,
      votesParticipated: 0,
      active: true,
      metadata
    };

    this.members.set(address, member);
    return member;
  }

  /**
   * Removes a member from the council
   * @param {string} address - Member's blockchain address
   * @returns {boolean} True if member was removed
   */
  removeMember(address) {
    if (!this.members.has(address)) {
      throw new Error(`Member with address ${address} not found`);
    }

    return this.members.delete(address);
  }

  /**
   * Gets a member by address
   * @param {string} address - Member's blockchain address
   * @returns {object} The member object
   */
  getMember(address) {
    const member = this.members.get(address);
    if (!member) {
      throw new Error(`Member with address ${address} not found`);
    }
    return { ...member };
  }

  /**
   * Gets all council members
   * @param {object} filters - Optional filters
   * @returns {array} Array of members
   */
  getAllMembers(filters = {}) {
    let members = Array.from(this.members.values());

    if (filters.role) {
      members = members.filter(m => m.role === filters.role);
    }

    if (filters.active !== undefined) {
      members = members.filter(m => m.active === filters.active);
    }

    return members;
  }

  /**
   * Updates a member's information
   * @param {string} address - Member's blockchain address
   * @param {object} updates - Fields to update
   * @returns {object} Updated member
   */
  updateMember(address, updates) {
    const member = this.getMember(address);
    
    // Prevent updating certain fields
    const protectedFields = ['address', 'joinedAt', 'proposalsCreated', 'votesParticipated'];
    for (const field of protectedFields) {
      if (updates[field] !== undefined) {
        throw new Error(`Cannot update protected field: ${field}`);
      }
    }

    // Validate role if being updated
    if (updates.role && !Object.values(MEMBER_ROLES).includes(updates.role)) {
      throw new Error(`Invalid role. Must be one of: ${Object.values(MEMBER_ROLES).join(', ')}`);
    }

    const updatedMember = { ...member, ...updates };
    this.members.set(address, updatedMember);
    return updatedMember;
  }

  /**
   * Creates a new proposal
   * @param {string} creatorAddress - Address of the member creating the proposal
   * @param {string} title - Proposal title
   * @param {string} description - Proposal description
   * @param {object} options - Additional options
   * @returns {object} The created proposal
   */
  createProposal(creatorAddress, title, description, options = {}) {
    // Verify creator is a member
    const creator = this.getMember(creatorAddress);
    if (!creator.active) {
      throw new Error('Only active members can create proposals');
    }

    const proposalId = ++this.proposalCounter;
    const proposal = {
      id: proposalId,
      title,
      description,
      creator: creatorAddress,
      status: PROPOSAL_STATUS.ACTIVE,
      createdAt: new Date().toISOString(),
      votingDeadline: options.votingDeadline || null,
      votes: {
        for: 0,
        against: 0,
        abstain: 0
      },
      voters: new Set(),
      executed: false,
      executedAt: null,
      metadata: options.metadata || {}
    };

    this.proposals.set(proposalId, proposal);
    
    // Update creator stats
    creator.proposalsCreated++;
    this.members.set(creatorAddress, creator);

    return { ...proposal, voters: Array.from(proposal.voters) };
  }

  /**
   * Casts a vote on a proposal
   * @param {number} proposalId - Proposal ID
   * @param {string} voterAddress - Address of the voting member
   * @param {string} vote - Vote choice: 'for', 'against', or 'abstain'
   * @returns {object} Updated proposal
   */
  vote(proposalId, voterAddress, vote) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found`);
    }

    // Check if proposal is active
    if (proposal.status !== PROPOSAL_STATUS.ACTIVE) {
      throw new Error(`Proposal ${proposalId} is not active (status: ${proposal.status})`);
    }

    // Verify voter is an active member
    const voter = this.getMember(voterAddress);
    if (!voter.active) {
      throw new Error('Only active members can vote');
    }

    // Check if member has already voted
    if (proposal.voters.has(voterAddress)) {
      throw new Error(`Member ${voterAddress} has already voted on this proposal`);
    }

    // Validate vote choice
    const validVotes = ['for', 'against', 'abstain'];
    if (!validVotes.includes(vote)) {
      throw new Error(`Invalid vote. Must be one of: ${validVotes.join(', ')}`);
    }

    // Record vote
    proposal.votes[vote] += voter.votingPower;
    proposal.voters.add(voterAddress);

    // Update voter stats
    voter.votesParticipated++;
    this.members.set(voterAddress, voter);

    return { ...proposal, voters: Array.from(proposal.voters) };
  }

  /**
   * Gets a proposal by ID
   * @param {number} proposalId - Proposal ID
   * @returns {object} The proposal
   */
  getProposal(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found`);
    }
    return { ...proposal, voters: Array.from(proposal.voters) };
  }

  /**
   * Gets all proposals
   * @param {object} filters - Optional filters
   * @returns {array} Array of proposals
   */
  getAllProposals(filters = {}) {
    let proposals = Array.from(this.proposals.values());

    if (filters.status) {
      proposals = proposals.filter(p => p.status === filters.status);
    }

    if (filters.creator) {
      proposals = proposals.filter(p => p.creator === filters.creator);
    }

    return proposals.map(p => ({ ...p, voters: Array.from(p.voters) }));
  }

  /**
   * Closes voting on a proposal and determines outcome
   * @param {number} proposalId - Proposal ID
   * @returns {object} Updated proposal with outcome
   */
  closeVoting(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found`);
    }

    if (proposal.status !== PROPOSAL_STATUS.ACTIVE) {
      throw new Error(`Proposal ${proposalId} is not active`);
    }

    const totalMembers = this.getActiveMemberCount();
    const totalVotes = proposal.votes.for + proposal.votes.against + proposal.votes.abstain;
    const quorum = totalVotes / totalMembers;

    // Check if quorum is met
    if (quorum < this.quorumPercentage) {
      proposal.status = PROPOSAL_STATUS.REJECTED;
      proposal.outcome = `Quorum not met (${(quorum * 100).toFixed(1)}% voted, ${(this.quorumPercentage * 100)}% required)`;
    } else {
      // Calculate approval percentage (excluding abstentions)
      const votesForOrAgainst = proposal.votes.for + proposal.votes.against;
      const approvalRate = votesForOrAgainst > 0 ? proposal.votes.for / votesForOrAgainst : 0;

      if (approvalRate >= this.votingThreshold) {
        proposal.status = PROPOSAL_STATUS.PASSED;
        proposal.outcome = `Passed with ${(approvalRate * 100).toFixed(1)}% approval`;
      } else {
        proposal.status = PROPOSAL_STATUS.REJECTED;
        proposal.outcome = `Rejected with ${(approvalRate * 100).toFixed(1)}% approval (${(this.votingThreshold * 100)}% required)`;
      }
    }

    proposal.closedAt = new Date().toISOString();
    return { ...proposal, voters: Array.from(proposal.voters) };
  }

  /**
   * Executes a passed proposal
   * @param {number} proposalId - Proposal ID
   * @returns {object} Executed proposal
   */
  executeProposal(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found`);
    }

    if (proposal.status !== PROPOSAL_STATUS.PASSED) {
      throw new Error(`Proposal ${proposalId} has not passed (status: ${proposal.status})`);
    }

    if (proposal.executed) {
      throw new Error(`Proposal ${proposalId} has already been executed`);
    }

    proposal.executed = true;
    proposal.executedAt = new Date().toISOString();
    proposal.status = PROPOSAL_STATUS.EXECUTED;

    return { ...proposal, voters: Array.from(proposal.voters) };
  }

  /**
   * Gets the count of active members
   * @returns {number} Number of active members
   */
  getActiveMemberCount() {
    return Array.from(this.members.values()).filter(m => m.active).length;
  }

  /**
   * Gets council statistics
   * @returns {object} Statistics object
   */
  getStatistics() {
    const members = Array.from(this.members.values());
    const proposals = Array.from(this.proposals.values());

    const roleDistribution = {};
    members.forEach(m => {
      roleDistribution[m.role] = (roleDistribution[m.role] || 0) + 1;
    });

    const proposalsByStatus = {};
    proposals.forEach(p => {
      proposalsByStatus[p.status] = (proposalsByStatus[p.status] || 0) + 1;
    });

    return {
      councilName: this.councilName,
      totalMembers: members.length,
      activeMembers: members.filter(m => m.active).length,
      inactiveMembers: members.filter(m => !m.active).length,
      roleDistribution,
      totalProposals: proposals.length,
      proposalsByStatus,
      votingThreshold: this.votingThreshold,
      quorumPercentage: this.quorumPercentage,
      createdAt: this.createdAt
    };
  }

  /**
   * Gets member participation statistics
   * @param {string} address - Member's blockchain address
   * @returns {object} Participation statistics
   */
  getMemberParticipation(address) {
    const member = this.getMember(address);
    const totalProposals = this.proposals.size;
    const participationRate = totalProposals > 0 
      ? (member.votesParticipated / totalProposals * 100).toFixed(1)
      : 0;

    return {
      address: member.address,
      name: member.name,
      role: member.role,
      proposalsCreated: member.proposalsCreated,
      votesParticipated: member.votesParticipated,
      totalProposals,
      participationRate: `${participationRate}%`,
      votingPower: member.votingPower,
      joinedAt: member.joinedAt
    };
  }

  /**
   * Exports council data as JSON
   * @returns {string} JSON string
   */
  toJSON() {
    return JSON.stringify({
      councilName: this.councilName,
      createdAt: this.createdAt,
      votingThreshold: this.votingThreshold,
      quorumPercentage: this.quorumPercentage,
      members: Array.from(this.members.entries()).map(([addr, member]) => ({
        address: addr,
        ...member
      })),
      proposals: Array.from(this.proposals.entries()).map(([id, proposal]) => ({
        id,
        ...proposal,
        voters: Array.from(proposal.voters)
      }))
    }, null, 2);
  }

  /**
   * Validates a blockchain address format
   * @private
   * @param {string} address - Address to validate
   * @returns {boolean} True if valid
   */
  _isValidAddress(address) {
    if (!address || typeof address !== 'string') {
      return false;
    }

    // Ethereum address format: 0x followed by 40 hex characters
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    
    // Also accept addresses without 0x prefix (40 hex characters)
    const addressWithoutPrefix = /^[a-fA-F0-9]{40}$/;

    return ethAddressRegex.test(address) || addressWithoutPrefix.test(address);
  }
}

module.exports = { 
  BlockchainCouncil, 
  MEMBER_ROLES, 
  PROPOSAL_STATUS 
};
