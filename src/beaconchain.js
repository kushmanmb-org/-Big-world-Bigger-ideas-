/**
 * Beacon Chain Fetcher Module
 * Provides functionality to fetch Ethereum Beacon Chain (ETH 2.0) data with pagination
 * 
 * API Documentation: https://beaconcha.in/api/v1/docs/index.html
 * 
 * This module supports querying validator data, block information, and other
 * Beacon Chain metrics with pagination support for kushmanmb.eth and other addresses.
 */

const https = require('https');

class BeaconChainFetcher {
  /**
   * Creates a new Beacon Chain fetcher instance
   * @param {string} baseUrl - The base API URL (default: beaconcha.in)
   * @param {string} apiKey - Optional API key for higher rate limits
   */
  constructor(baseUrl = 'beaconcha.in', apiKey = null) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.cache = new Map();
    this.cacheTimeout = 60000; // 1 minute cache
  }

  /**
   * Validates an Ethereum address
   * @param {string} address - The address to validate
   * @returns {string} Validated address
   * @throws {Error} If address is invalid
   */
  validateAddress(address) {
    if (!address || typeof address !== 'string') {
      throw new Error('Address must be a non-empty string');
    }
    
    // Remove 0x prefix if present
    const cleanAddress = address.toLowerCase().replace(/^0x/, '');
    
    // Check if address is 40 hex characters
    if (!/^[0-9a-f]{40}$/i.test(cleanAddress)) {
      throw new Error('Invalid Ethereum address format');
    }
    
    return '0x' + cleanAddress;
  }

  /**
   * Makes an HTTPS GET request to the API
   * @param {string} endpoint - The API endpoint path
   * @returns {Promise<any>} Parsed JSON response
   * @private
   */
  _makeRequest(endpoint) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.baseUrl,
        port: 443,
        path: endpoint,
        method: 'GET',
        headers: {
          'User-Agent': 'BeaconChainFetcher/1.0'
        }
      };

      // Add API key to headers if provided
      if (this.apiKey) {
        options.headers['apikey'] = this.apiKey;
      }

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              const parsed = JSON.parse(data);
              resolve(parsed);
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${data}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });

      req.setTimeout(15000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  /**
   * Gets data from cache or fetches if not cached
   * @param {string} cacheKey - The cache key
   * @param {Function} fetcher - Function that returns a promise to fetch data
   * @returns {Promise<any>} Cached or fetched data
   * @private
   */
  async _getWithCache(cacheKey, fetcher) {
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const data = await fetcher();
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    return data;
  }

  /**
   * Fetches validator information for an Ethereum address with pagination
   * @param {string} address - The Ethereum address (supports ENS like kushmanmb.eth)
   * @param {number} page - Page number (default: 0)
   * @param {number} limit - Results per page (default: 100, max: 100)
   * @returns {Promise<object>} Validator data with pagination info
   * @throws {Error} If address is invalid or request fails
   */
  async getValidatorsByAddress(address, page = 0, limit = 100) {
    // Validate address format if it's not an ENS name
    let validatedAddress = address;
    if (!address.endsWith('.eth')) {
      validatedAddress = this.validateAddress(address);
    }

    // Validate pagination parameters
    if (!Number.isInteger(page) || page < 0) {
      throw new Error('Page must be a non-negative integer');
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    const cacheKey = `validators_${validatedAddress}_${page}_${limit}`;

    return await this._getWithCache(cacheKey, async () => {
      try {
        const endpoint = `/api/v1/validator/eth1/${validatedAddress}?limit=${limit}&offset=${page * limit}`;
        const response = await this._makeRequest(endpoint);

        if (!response || response.status === 'ERROR') {
          throw new Error(response.message || 'Failed to fetch validator data');
        }

        const result = {
          address: validatedAddress,
          page: page,
          limit: limit,
          offset: page * limit,
          validators: response.data || [],
          status: response.status,
          timestamp: Date.now()
        };

        return result;
      } catch (error) {
        throw new Error(`Error fetching validators: ${error.message}`);
      }
    });
  }

  /**
   * Fetches detailed information about a specific validator by index
   * @param {number|string} validatorIndex - The validator index
   * @returns {Promise<object>} Validator details
   * @throws {Error} If validator index is invalid or request fails
   */
  async getValidatorByIndex(validatorIndex) {
    if (!validatorIndex && validatorIndex !== 0) {
      throw new Error('Validator index is required');
    }

    const cacheKey = `validator_${validatorIndex}`;

    return await this._getWithCache(cacheKey, async () => {
      try {
        const endpoint = `/api/v1/validator/${validatorIndex}`;
        const response = await this._makeRequest(endpoint);

        if (!response || response.status === 'ERROR') {
          throw new Error(response.message || 'Failed to fetch validator details');
        }

        return {
          validatorIndex: validatorIndex,
          data: response.data,
          status: response.status,
          timestamp: Date.now()
        };
      } catch (error) {
        throw new Error(`Error fetching validator details: ${error.message}`);
      }
    });
  }

  /**
   * Fetches validator performance data with pagination
   * @param {number|string} validatorIndex - The validator index
   * @param {number} page - Page number (default: 0)
   * @param {number} limit - Results per page (default: 100, max: 100)
   * @returns {Promise<object>} Validator performance data
   * @throws {Error} If parameters are invalid or request fails
   */
  async getValidatorPerformance(validatorIndex, page = 0, limit = 100) {
    if (!validatorIndex && validatorIndex !== 0) {
      throw new Error('Validator index is required');
    }

    // Validate pagination parameters
    if (!Number.isInteger(page) || page < 0) {
      throw new Error('Page must be a non-negative integer');
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    const cacheKey = `performance_${validatorIndex}_${page}_${limit}`;

    return await this._getWithCache(cacheKey, async () => {
      try {
        const endpoint = `/api/v1/validator/${validatorIndex}/performance?limit=${limit}&offset=${page * limit}`;
        const response = await this._makeRequest(endpoint);

        if (!response || response.status === 'ERROR') {
          throw new Error(response.message || 'Failed to fetch performance data');
        }

        return {
          validatorIndex: validatorIndex,
          page: page,
          limit: limit,
          offset: page * limit,
          performance: response.data || [],
          status: response.status,
          timestamp: Date.now()
        };
      } catch (error) {
        throw new Error(`Error fetching validator performance: ${error.message}`);
      }
    });
  }

  /**
   * Fetches recent blocks with pagination
   * @param {number} page - Page number (default: 0)
   * @param {number} limit - Results per page (default: 10, max: 100)
   * @returns {Promise<object>} Block data with pagination
   * @throws {Error} If parameters are invalid or request fails
   */
  async getRecentBlocks(page = 0, limit = 10) {
    // Validate pagination parameters
    if (!Number.isInteger(page) || page < 0) {
      throw new Error('Page must be a non-negative integer');
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    const cacheKey = `blocks_${page}_${limit}`;

    return await this._getWithCache(cacheKey, async () => {
      try {
        const endpoint = `/api/v1/blocks?limit=${limit}&offset=${page * limit}`;
        const response = await this._makeRequest(endpoint);

        if (!response || response.status === 'ERROR') {
          throw new Error(response.message || 'Failed to fetch blocks');
        }

        return {
          page: page,
          limit: limit,
          offset: page * limit,
          blocks: response.data || [],
          status: response.status,
          timestamp: Date.now()
        };
      } catch (error) {
        throw new Error(`Error fetching blocks: ${error.message}`);
      }
    });
  }

  /**
   * Formats validator data for display
   * @param {object} data - Validator data from getValidatorsByAddress
   * @returns {string} Formatted output
   */
  formatValidatorData(data) {
    if (!data || typeof data !== 'object') {
      return 'No data available';
    }

    let output = 'Beacon Chain Validator Data\n';
    output += '================================\n\n';
    output += `Address: ${data.address}\n`;
    output += `Page: ${data.page}\n`;
    output += `Limit: ${data.limit}\n`;
    output += `Offset: ${data.offset}\n`;
    output += `Total Validators: ${data.validators ? data.validators.length : 0}\n\n`;

    if (data.validators && Array.isArray(data.validators) && data.validators.length > 0) {
      output += 'Validator Details:\n';
      output += '-'.repeat(70) + '\n\n';

      data.validators.forEach((validator, index) => {
        output += `Validator ${index + 1}:\n`;
        if (validator.validatorindex !== undefined) output += `  Index: ${validator.validatorindex}\n`;
        if (validator.pubkey) output += `  Public Key: ${validator.pubkey.substring(0, 20)}...\n`;
        if (validator.balance !== undefined) output += `  Balance: ${validator.balance}\n`;
        if (validator.status) output += `  Status: ${validator.status}\n`;
        if (validator.activationepoch !== undefined) output += `  Activation Epoch: ${validator.activationepoch}\n`;
        output += '\n';
      });
    } else {
      output += 'No validators found for this address.\n';
    }

    return output;
  }

  /**
   * Filters validators by status
   * @param {Array} validators - Array of validator objects
   * @param {string} status - Status to filter by (e.g., 'active', 'pending', 'exited')
   * @returns {Array} Filtered validators
   */
  static filterValidatorsByStatus(validators, status) {
    if (!Array.isArray(validators)) {
      throw new Error('Validators must be an array');
    }

    if (!status || typeof status !== 'string') {
      throw new Error('Status must be a non-empty string');
    }

    return validators.filter(v => v.status && v.status.toLowerCase() === status.toLowerCase());
  }

  /**
   * Gets total validator count
   * @param {object} data - Validator data
   * @returns {number} Total validator count
   */
  static getTotalValidatorCount(data) {
    if (!data || !data.validators || !Array.isArray(data.validators)) {
      return 0;
    }

    return data.validators.length;
  }

  /**
   * Clears the internal cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Gets cache statistics
   * @returns {object} Cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      timeout: this.cacheTimeout,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Gets API information
   * @returns {object} API configuration
   */
  getAPIInfo() {
    return {
      baseUrl: this.baseUrl,
      hasApiKey: !!this.apiKey,
      cacheTimeout: this.cacheTimeout
    };
  }
}

module.exports = BeaconChainFetcher;
