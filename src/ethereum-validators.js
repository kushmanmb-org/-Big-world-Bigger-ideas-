/**
 * Ethereum Validators Module
 * Provides functionality to fetch Ethereum validator data from Beaconcha.in API
 * 
 * API Documentation: https://beaconcha.in/api/v2/docs
 */

const https = require('https');

class EthereumValidatorsFetcher {
  /**
   * Creates a new Ethereum Validators fetcher instance
   * @param {string} apiKey - The Beaconcha.in API key (Bearer token)
   * @param {string} baseUrl - The base API URL (default: beaconcha.in)
   */
  constructor(apiKey = null, baseUrl = 'beaconcha.in') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.cache = new Map();
    this.cacheTimeout = 60000; // 60 seconds cache
  }

  /**
   * Makes an HTTPS POST request to the API
   * @param {string} endpoint - The API endpoint path
   * @param {object} body - The request body
   * @returns {Promise<any>} Parsed JSON response
   * @private
   */
  _makeRequest(endpoint, body = {}) {
    return new Promise((resolve, reject) => {
      const bodyString = JSON.stringify(body);
      
      const options = {
        hostname: this.baseUrl,
        port: 443,
        path: endpoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(bodyString),
          'User-Agent': 'EthereumValidatorsFetcher/1.0'
        }
      };

      // Add Authorization header if API key is provided
      if (this.apiKey) {
        options.headers['Authorization'] = `Bearer ${this.apiKey}`;
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

      req.write(bodyString);
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
   * Validates validator identifiers (indices or public keys)
   * @param {string|number|array} validators - Validator index, pubkey, or array of them
   * @returns {array} Array of validator identifiers
   * @throws {Error} If validators are invalid
   * @private
   */
  _validateValidators(validators) {
    if (validators === null || validators === undefined) {
      throw new Error('Validators parameter is required');
    }

    // Convert to array if not already
    const validatorArray = Array.isArray(validators) ? validators : [validators];

    if (validatorArray.length === 0) {
      throw new Error('At least one validator must be specified');
    }

    // Validate each validator
    for (const validator of validatorArray) {
      if (typeof validator === 'number') {
        // Validator index must be non-negative
        if (validator < 0 || !Number.isInteger(validator)) {
          throw new Error(`Invalid validator index: ${validator}. Must be a non-negative integer.`);
        }
      } else if (typeof validator === 'string') {
        // If string, could be index as string or public key (48 bytes = 96 hex chars + 0x prefix = 98 chars)
        const isNumericString = /^\d+$/.test(validator);
        const isPubkey = /^0x[0-9a-fA-F]{96}$/.test(validator);
        
        if (!isNumericString && !isPubkey) {
          throw new Error(`Invalid validator identifier: ${validator}. Must be an index (number) or public key (0x + 96 hex chars).`);
        }
      } else {
        throw new Error(`Invalid validator type: ${typeof validator}. Must be number or string.`);
      }
    }

    return validatorArray;
  }

  /**
   * Fetches validator information for specified validators
   * @param {string|number|array} validators - Validator index, pubkey, or array of them
   * @returns {Promise<object>} Validator data
   * @throws {Error} If validators are invalid or request fails
   */
  async getValidators(validators) {
    const validatorArray = this._validateValidators(validators);
    
    const endpoint = '/api/v2/ethereum/validators';
    const cacheKey = `validators-${validatorArray.join(',')}`;

    return await this._getWithCache(cacheKey, () => 
      this._makeRequest(endpoint, { validators: validatorArray })
    );
  }

  /**
   * Fetches validator performance data
   * @param {string|number|array} validators - Validator index, pubkey, or array of them
   * @returns {Promise<object>} Performance data
   */
  async getValidatorPerformance(validators) {
    const validatorArray = this._validateValidators(validators);
    
    const endpoint = '/api/v2/ethereum/validators/performance';
    const cacheKey = `performance-${validatorArray.join(',')}`;

    return await this._getWithCache(cacheKey, () => 
      this._makeRequest(endpoint, { validators: validatorArray })
    );
  }

  /**
   * Fetches validator attestation performance
   * @param {string|number|array} validators - Validator index, pubkey, or array of them
   * @returns {Promise<object>} Attestation performance data
   */
  async getAttestationPerformance(validators) {
    const validatorArray = this._validateValidators(validators);
    
    const endpoint = '/api/v2/ethereum/validators/attestations';
    const cacheKey = `attestations-${validatorArray.join(',')}`;

    return await this._getWithCache(cacheKey, () => 
      this._makeRequest(endpoint, { validators: validatorArray })
    );
  }

  /**
   * Fetches validator balance history
   * @param {string|number|array} validators - Validator index, pubkey, or array of them
   * @returns {Promise<object>} Balance history data
   */
  async getBalanceHistory(validators) {
    const validatorArray = this._validateValidators(validators);
    
    const endpoint = '/api/v2/ethereum/validators/balances';
    const cacheKey = `balances-${validatorArray.join(',')}`;

    return await this._getWithCache(cacheKey, () => 
      this._makeRequest(endpoint, { validators: validatorArray })
    );
  }

  /**
   * Formats validator information for display
   * @param {object} data - Raw validator data
   * @returns {string} Formatted output
   */
  formatValidators(data) {
    if (!data || typeof data !== 'object') {
      return 'No data available';
    }

    let output = 'Ethereum Validator Information\n';
    output += '================================\n\n';

    // Handle data property if it exists
    const validators = data.data || data;

    if (Array.isArray(validators)) {
      output += `Total validators: ${validators.length}\n\n`;
      
      validators.forEach((validator, index) => {
        output += `Validator ${index + 1}:\n`;
        if (validator.validatorindex !== undefined) output += `  Index: ${validator.validatorindex}\n`;
        if (validator.pubkey) output += `  Public Key: ${validator.pubkey.substring(0, 20)}...\n`;
        if (validator.status) output += `  Status: ${validator.status}\n`;
        if (validator.balance !== undefined) output += `  Balance: ${validator.balance} Gwei\n`;
        if (validator.effectivebalance !== undefined) output += `  Effective Balance: ${validator.effectivebalance} Gwei\n`;
        if (validator.slashed !== undefined) output += `  Slashed: ${validator.slashed}\n`;
        if (validator.activationepoch !== undefined) output += `  Activation Epoch: ${validator.activationepoch}\n`;
        if (validator.exitepoch !== undefined) output += `  Exit Epoch: ${validator.exitepoch}\n`;
        output += '\n';
      });
    } else if (typeof validators === 'object') {
      // Single validator or object response
      for (const [key, value] of Object.entries(validators)) {
        if (typeof value === 'object' && value !== null) {
          output += `${key}: ${JSON.stringify(value, null, 2)}\n`;
        } else {
          output += `${key}: ${value}\n`;
        }
      }
    }

    return output;
  }

  /**
   * Formats performance data for display
   * @param {object} data - Raw performance data
   * @returns {string} Formatted output
   */
  formatPerformance(data) {
    if (!data || typeof data !== 'object') {
      return 'No performance data available';
    }

    let output = 'Validator Performance\n';
    output += '================================\n\n';

    const performance = data.data || data;

    if (Array.isArray(performance)) {
      output += `Total entries: ${performance.length}\n\n`;
      
      performance.forEach((perf, index) => {
        output += `Performance ${index + 1}:\n`;
        if (perf.validatorindex !== undefined) output += `  Validator Index: ${perf.validatorindex}\n`;
        if (perf.attestation_efficiency !== undefined) output += `  Attestation Efficiency: ${perf.attestation_efficiency}%\n`;
        if (perf.proposal_efficiency !== undefined) output += `  Proposal Efficiency: ${perf.proposal_efficiency}%\n`;
        if (perf.income !== undefined) output += `  Income: ${perf.income} Gwei\n`;
        output += '\n';
      });
    } else {
      for (const [key, value] of Object.entries(performance)) {
        output += `${key}: ${value}\n`;
      }
    }

    return output;
  }

  /**
   * Clears the cache
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
   * Sets a custom cache timeout
   * @param {number} timeout - Cache timeout in milliseconds
   */
  setCacheTimeout(timeout) {
    if (typeof timeout !== 'number' || timeout < 0) {
      throw new Error('Cache timeout must be a non-negative number');
    }
    this.cacheTimeout = timeout;
  }
}

// Export the class
module.exports = EthereumValidatorsFetcher;
