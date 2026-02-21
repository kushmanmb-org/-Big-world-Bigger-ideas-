/**
 * Address Tracker Module
 * Tracks crypto addresses for owner token tracking across multiple blockchains
 * Provides comprehensive address monitoring, balance tracking, and transaction history
 */

/**
 * Address information structure
 */
class AddressInfo {
  /**
   * Creates a new address info object
   * @param {string} address - The blockchain address
   * @param {string} network - The network name (e.g., 'ethereum', 'bitcoin')
   * @param {string} label - Optional label for the address
   */
  constructor(address, network, label = '') {
    this.address = address;
    this.network = network;
    this.label = label;
    this.trackedSince = Date.now();
    this.tokens = [];
    this.transactions = [];
    this.metadata = {};
  }

  /**
   * Adds a token to this address
   * @param {object} token - Token information
   */
  addToken(token) {
    this.tokens.push({
      ...token,
      addedAt: Date.now()
    });
  }

  /**
   * Adds a transaction to this address
   * @param {object} transaction - Transaction information
   */
  addTransaction(transaction) {
    this.transactions.push({
      ...transaction,
      recordedAt: Date.now()
    });
  }

  /**
   * Gets all tokens for this address
   * @returns {array} Array of tokens
   */
  getTokens() {
    return this.tokens;
  }

  /**
   * Gets transaction count
   * @returns {number} Number of transactions
   */
  getTransactionCount() {
    return this.transactions.length;
  }

  /**
   * Exports address info as JSON
   * @returns {object} JSON representation
   */
  toJSON() {
    return {
      address: this.address,
      network: this.network,
      label: this.label,
      trackedSince: this.trackedSince,
      tokenCount: this.tokens.length,
      transactionCount: this.transactions.length,
      tokens: this.tokens,
      transactions: this.transactions,
      metadata: this.metadata
    };
  }
}

/**
 * Address Tracker Class
 * Manages and tracks multiple crypto addresses across different blockchains
 */
class AddressTracker {
  /**
   * Creates a new Address Tracker instance
   * @param {string} owner - The owner identifier (e.g., "kushmanmb")
   */
  constructor(owner = 'kushmanmb') {
    this.owner = owner;
    this.addresses = new Map(); // Key: address, Value: AddressInfo
    this.networkAddresses = new Map(); // Key: network, Value: Set of addresses
  }

  /**
   * Validates an Ethereum-style address
   * @param {string} address - The address to validate
   * @returns {string} Validated and normalized address
   * @throws {Error} If address is invalid
   */
  validateAddress(address) {
    if (!address || typeof address !== 'string') {
      throw new Error('Address must be a non-empty string');
    }
    
    // Remove 0x prefix if present
    const cleanAddress = address.toLowerCase().replace(/^0x/, '');
    
    // Check if address is 40 hex characters (Ethereum-style)
    if (!/^[0-9a-f]{40}$/i.test(cleanAddress)) {
      throw new Error('Invalid Ethereum address format');
    }
    
    return '0x' + cleanAddress;
  }

  /**
   * Validates a network name
   * @param {string} network - The network name
   * @returns {string} Validated network name
   * @throws {Error} If network is invalid
   */
  validateNetwork(network) {
    if (!network || typeof network !== 'string') {
      throw new Error('Network must be a non-empty string');
    }
    return network.toLowerCase();
  }

  /**
   * Adds an address to track
   * @param {string} address - The blockchain address
   * @param {string} network - The network name
   * @param {string} label - Optional label for the address
   * @returns {AddressInfo} The created address info
   */
  addAddress(address, network, label = '') {
    const validatedAddress = this.validateAddress(address);
    const validatedNetwork = this.validateNetwork(network);
    
    // Check if address is already tracked
    if (this.addresses.has(validatedAddress)) {
      throw new Error(`Address ${validatedAddress} is already being tracked`);
    }

    const addressInfo = new AddressInfo(validatedAddress, validatedNetwork, label);
    this.addresses.set(validatedAddress, addressInfo);

    // Add to network index
    if (!this.networkAddresses.has(validatedNetwork)) {
      this.networkAddresses.set(validatedNetwork, new Set());
    }
    this.networkAddresses.get(validatedNetwork).add(validatedAddress);

    return addressInfo;
  }

  /**
   * Removes an address from tracking
   * @param {string} address - The address to remove
   * @returns {boolean} True if removed, false if not found
   */
  removeAddress(address) {
    const validatedAddress = this.validateAddress(address);
    
    if (!this.addresses.has(validatedAddress)) {
      return false;
    }

    const addressInfo = this.addresses.get(validatedAddress);
    const network = addressInfo.network;

    // Remove from main map
    this.addresses.delete(validatedAddress);

    // Remove from network index
    if (this.networkAddresses.has(network)) {
      this.networkAddresses.get(network).delete(validatedAddress);
      if (this.networkAddresses.get(network).size === 0) {
        this.networkAddresses.delete(network);
      }
    }

    return true;
  }

  /**
   * Gets address information
   * @param {string} address - The address to query
   * @returns {AddressInfo} Address information
   * @throws {Error} If address is not tracked
   */
  getAddress(address) {
    const validatedAddress = this.validateAddress(address);
    
    if (!this.addresses.has(validatedAddress)) {
      throw new Error(`Address ${validatedAddress} is not being tracked`);
    }

    return this.addresses.get(validatedAddress);
  }

  /**
   * Checks if an address is being tracked
   * @param {string} address - The address to check
   * @returns {boolean} True if tracked
   */
  isTracking(address) {
    try {
      const validatedAddress = this.validateAddress(address);
      return this.addresses.has(validatedAddress);
    } catch (error) {
      return false;
    }
  }

  /**
   * Gets all tracked addresses
   * @returns {array} Array of AddressInfo objects
   */
  getAllAddresses() {
    return Array.from(this.addresses.values());
  }

  /**
   * Gets all addresses on a specific network
   * @param {string} network - The network name
   * @returns {array} Array of AddressInfo objects
   */
  getAddressesByNetwork(network) {
    const validatedNetwork = this.validateNetwork(network);
    
    if (!this.networkAddresses.has(validatedNetwork)) {
      return [];
    }

    const addresses = this.networkAddresses.get(validatedNetwork);
    return Array.from(addresses).map(addr => this.addresses.get(addr));
  }

  /**
   * Records a token for an address
   * @param {string} address - The address
   * @param {object} tokenInfo - Token information
   * @returns {void}
   */
  recordToken(address, tokenInfo) {
    const addressInfo = this.getAddress(address);
    addressInfo.addToken(tokenInfo);
  }

  /**
   * Records a transaction for an address
   * @param {string} address - The address
   * @param {object} transactionInfo - Transaction information
   * @returns {void}
   */
  recordTransaction(address, transactionInfo) {
    const addressInfo = this.getAddress(address);
    addressInfo.addTransaction(transactionInfo);
  }

  /**
   * Gets all tokens owned by an address
   * @param {string} address - The address
   * @returns {array} Array of tokens
   */
  getTokensForAddress(address) {
    const addressInfo = this.getAddress(address);
    return addressInfo.getTokens();
  }

  /**
   * Gets transaction count for an address
   * @param {string} address - The address
   * @returns {number} Transaction count
   */
  getTransactionCount(address) {
    const addressInfo = this.getAddress(address);
    return addressInfo.getTransactionCount();
  }

  /**
   * Gets statistics across all tracked addresses
   * @returns {object} Statistics object
   */
  getStatistics() {
    const stats = {
      owner: this.owner,
      totalAddresses: this.addresses.size,
      networkCounts: {},
      totalTokens: 0,
      totalTransactions: 0,
      networksTracked: this.networkAddresses.size
    };

    for (const [network, addresses] of this.networkAddresses.entries()) {
      stats.networkCounts[network] = addresses.size;
    }

    for (const addressInfo of this.addresses.values()) {
      stats.totalTokens += addressInfo.tokens.length;
      stats.totalTransactions += addressInfo.transactions.length;
    }

    return stats;
  }

  /**
   * Exports all tracked addresses as JSON
   * @returns {object} JSON representation
   */
  toJSON() {
    return {
      owner: this.owner,
      addresses: Array.from(this.addresses.values()).map(info => info.toJSON()),
      statistics: this.getStatistics()
    };
  }

  /**
   * Imports tracking data from JSON
   * @param {object} data - JSON data to import
   * @returns {void}
   */
  fromJSON(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON data');
    }

    this.owner = data.owner || 'kushmanmb';
    this.addresses.clear();
    this.networkAddresses.clear();

    if (data.addresses && Array.isArray(data.addresses)) {
      for (const addrData of data.addresses) {
        const addressInfo = new AddressInfo(
          addrData.address,
          addrData.network,
          addrData.label
        );
        addressInfo.trackedSince = addrData.trackedSince;
        addressInfo.tokens = addrData.tokens || [];
        addressInfo.transactions = addrData.transactions || [];
        addressInfo.metadata = addrData.metadata || {};

        this.addresses.set(addrData.address, addressInfo);

        // Update network index
        if (!this.networkAddresses.has(addrData.network)) {
          this.networkAddresses.set(addrData.network, new Set());
        }
        this.networkAddresses.get(addrData.network).add(addrData.address);
      }
    }
  }

  /**
   * Formats statistics for display
   * @returns {string} Formatted statistics
   */
  formatStatistics() {
    const stats = this.getStatistics();
    
    let output = `
Address Tracker Statistics for ${stats.owner}
${'='.repeat(50)}

Total Addresses Tracked: ${stats.totalAddresses}
Networks Tracked: ${stats.networksTracked}
Total Tokens: ${stats.totalTokens}
Total Transactions: ${stats.totalTransactions}

Addresses per Network:
`;

    for (const [network, count] of Object.entries(stats.networkCounts)) {
      output += `  ${network}: ${count} addresses\n`;
    }

    return output;
  }

  /**
   * Formats all addresses for display
   * @returns {string} Formatted address list
   */
  formatAddresses() {
    const addresses = this.getAllAddresses();
    
    let output = `
Tracked Addresses for ${this.owner}
${'='.repeat(50)}

Total Addresses: ${addresses.length}
`;

    for (const addressInfo of addresses) {
      output += `
Address: ${addressInfo.address}
Network: ${addressInfo.network}
Label: ${addressInfo.label || '(none)'}
Tracked Since: ${new Date(addressInfo.trackedSince).toISOString()}
Tokens: ${addressInfo.tokens.length}
Transactions: ${addressInfo.transactions.length}
`;
    }

    return output;
  }
}

module.exports = { AddressTracker, AddressInfo };
