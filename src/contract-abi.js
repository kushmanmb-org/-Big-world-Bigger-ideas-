/**
 * Contract ABI Fetcher Module
 * Fetches contract ABIs from Etherscan API
 */

const https = require('https');

class ContractABIFetcher {
  /**
   * Creates a new Contract ABI Fetcher instance
   * @param {string} apiKey - Etherscan API key
   * @param {number} chainId - Chain ID (1 for Ethereum mainnet, 5 for Goerli, etc.)
   */
  constructor(apiKey = null, chainId = 1) {
    this.apiKey = apiKey;
    this.chainId = chainId;
    this.apiBaseUrl = this.getApiEndpoint(chainId);
    this.cache = new Map();
  }

  /**
   * Maps chain IDs to their respective Etherscan API endpoints
   * @param {number} chainId - The blockchain chain ID
   * @returns {string} API endpoint hostname
   */
  getApiEndpoint(chainId) {
    const endpointMap = {
      1: 'api.etherscan.io',           // Ethereum Mainnet
      5: 'api-goerli.etherscan.io',    // Goerli Testnet
      11155111: 'api-sepolia.etherscan.io', // Sepolia Testnet
      10: 'api-optimistic.etherscan.io', // Optimism
      420: 'api-goerli-optimistic.etherscan.io', // Optimism Goerli
      56: 'api.bscscan.com',           // BSC Mainnet
      97: 'api-testnet.bscscan.com',   // BSC Testnet
      137: 'api.polygonscan.com',      // Polygon Mainnet
      80001: 'api-testnet.polygonscan.com', // Mumbai Testnet
      42161: 'api.arbiscan.io',        // Arbitrum One
      421613: 'api-goerli.arbiscan.io', // Arbitrum Goerli
      43114: 'api.snowtrace.io',       // Avalanche C-Chain
      43113: 'api-testnet.snowtrace.io', // Avalanche Fuji
      250: 'api.ftmscan.com',          // Fantom Opera
      4002: 'api-testnet.ftmscan.com', // Fantom Testnet
      8453: 'api.basescan.org',        // Base Mainnet
      84531: 'api-goerli.basescan.org' // Base Goerli
    };

    return endpointMap[chainId] || 'api.etherscan.io';
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
   * Makes an HTTPS request to the Etherscan API
   * @param {object} params - Query parameters
   * @returns {Promise<object>} API response
   */
  async makeRequest(params) {
    return new Promise((resolve, reject) => {
      const queryParams = new URLSearchParams(params).toString();
      const url = `/v2/api?${queryParams}`;
      
      const options = {
        hostname: this.apiBaseUrl,
        path: url,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(new Error(`Failed to parse API response: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`API request failed: ${error.message}`));
      });

      req.end();
    });
  }

  /**
   * Fetches the ABI for a contract from Etherscan
   * @param {string} contractAddress - The contract address
   * @returns {Promise<object>} Contract ABI and related information
   */
  async getContractABI(contractAddress) {
    const validatedAddress = this.validateAddress(contractAddress);
    
    // Check cache first
    const cacheKey = `abi_${this.chainId}_${validatedAddress}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    if (!this.apiKey) {
      throw new Error('API key is required to fetch contract ABI from Etherscan');
    }

    try {
      const params = {
        chainid: this.chainId.toString(),
        module: 'contract',
        action: 'getabi',
        address: validatedAddress,
        apikey: this.apiKey
      };

      const response = await this.makeRequest(params);

      // Check if the API returned an error
      if (response.status !== '1') {
        throw new Error(response.message || 'Failed to fetch ABI from Etherscan');
      }

      // Parse the ABI
      let abi;
      try {
        abi = JSON.parse(response.result);
      } catch (error) {
        throw new Error(`Failed to parse ABI: ${error.message}`);
      }

      const result = {
        address: validatedAddress,
        chainId: this.chainId,
        abi: abi,
        status: response.status,
        message: response.message,
        timestamp: Date.now()
      };

      // Cache the result
      this.cache.set(cacheKey, result);

      return result;
    } catch (error) {
      throw new Error(`Error fetching contract ABI: ${error.message}`);
    }
  }

  /**
   * Extracts function signatures from ABI
   * @param {Array} abi - The contract ABI
   * @returns {Array} Array of function signatures
   */
  static extractFunctionSignatures(abi) {
    if (!Array.isArray(abi)) {
      throw new Error('ABI must be an array');
    }

    return abi
      .filter(item => item.type === 'function')
      .map(func => {
        const inputs = func.inputs.map(input => input.type).join(',');
        return {
          name: func.name,
          signature: `${func.name}(${inputs})`,
          stateMutability: func.stateMutability || 'nonpayable',
          type: func.type
        };
      });
  }

  /**
   * Extracts event signatures from ABI
   * @param {Array} abi - The contract ABI
   * @returns {Array} Array of event signatures
   */
  static extractEventSignatures(abi) {
    if (!Array.isArray(abi)) {
      throw new Error('ABI must be an array');
    }

    return abi
      .filter(item => item.type === 'event')
      .map(event => {
        const inputs = event.inputs.map(input => input.type).join(',');
        return {
          name: event.name,
          signature: `${event.name}(${inputs})`,
          type: event.type
        };
      });
  }

  /**
   * Clears the internal cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Gets API information
   * @returns {object} API configuration
   */
  getAPIInfo() {
    return {
      baseUrl: this.apiBaseUrl,
      chainId: this.chainId,
      hasApiKey: !!this.apiKey
    };
  }
}

module.exports = ContractABIFetcher;
