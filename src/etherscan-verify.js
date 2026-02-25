/**
 * Etherscan Contract Verification Module
 * Provides functionality to verify and publish smart contracts on Etherscan
 * using the Etherscan API with secure key management practices
 */

const { makeRequest, CacheManager } = require('./http-client');

class EtherscanVerifier {
  /**
   * Creates a new Etherscan Verifier instance
   * @param {string} apiKey - Etherscan API key (use environment variables)
   * @param {number} chainId - Chain ID (1 for Ethereum mainnet, 8453 for Base, etc.)
   */
  constructor(apiKey = null, chainId = 1) {
    // SECURITY: API key should come from environment variables, not hardcoded
    if (!apiKey) {
      // Try to load from environment
      apiKey = process.env.ETHERSCAN_API_KEY;
    }
    
    this.apiKey = apiKey;
    this.chainId = chainId;
    this.apiBaseUrl = this._getApiBaseUrl(chainId);
    this.cacheManager = new CacheManager(300000); // 5 minute cache
  }

  /**
   * Gets the appropriate API base URL for the chain ID
   * @param {number} chainId - Chain ID
   * @returns {string} API base URL
   * @private
   */
  _getApiBaseUrl(chainId) {
    const apiUrls = {
      1: 'api.etherscan.io',           // Ethereum Mainnet
      5: 'api-goerli.etherscan.io',    // Goerli Testnet
      11155111: 'api-sepolia.etherscan.io', // Sepolia Testnet
      56: 'api.bscscan.com',           // BSC Mainnet
      137: 'api.polygonscan.com',      // Polygon Mainnet
      8453: 'api.basescan.org',        // Base Mainnet
      42161: 'api.arbiscan.io',        // Arbitrum One
      10: 'api-optimistic.etherscan.io', // Optimism
      43114: 'api.snowtrace.io'        // Avalanche C-Chain
    };
    
    return apiUrls[chainId] || 'api.etherscan.io';
  }

  /**
   * Validates a contract address
   * @param {string} address - Contract address to validate
   * @returns {string} Validated address
   * @throws {Error} If address is invalid
   */
  validateAddress(address) {
    if (!address || typeof address !== 'string') {
      throw new Error('Address must be a non-empty string');
    }
    
    const cleanAddress = address.toLowerCase().replace(/^0x/, '');
    
    if (!/^[0-9a-f]{40}$/i.test(cleanAddress)) {
      throw new Error('Invalid contract address format');
    }
    
    return '0x' + cleanAddress;
  }

  /**
   * Makes an HTTPS request to the Etherscan API
   * @param {object} params - Query parameters
   * @param {string} method - HTTP method (GET or POST)
   * @param {object} postData - POST data (for POST requests)
   * @returns {Promise<object>} API response
   * @private
   */
  async _makeRequest(params, method = 'GET', postData = null) {
    if (method === 'GET') {
      const queryParams = new URLSearchParams(params).toString();
      const url = `/api?${queryParams}`;
      
      return makeRequest({
        hostname: this.apiBaseUrl,
        path: url,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'EtherscanVerifier/1.0'
        }
      });
    } else {
      // POST request for contract verification
      const postDataString = JSON.stringify(postData);
      
      return makeRequest({
        hostname: this.apiBaseUrl,
        path: '/api',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'EtherscanVerifier/1.0',
          'Content-Length': Buffer.byteLength(postDataString)
        }
      }, postDataString);
    }
  }

  /**
   * Verifies a contract with source code on Etherscan
   * @param {object} options - Verification options
   * @param {string} options.contractAddress - Contract address to verify
   * @param {string} options.sourceCode - Contract source code
   * @param {string} options.contractName - Name of the contract
   * @param {string} options.compilerVersion - Solidity compiler version (e.g., 'v0.8.20+commit.a1b79de6')
   * @param {number} options.optimizationUsed - Whether optimization was used (0 or 1)
   * @param {number} options.runs - Number of optimization runs (default: 200)
   * @param {string} options.constructorArguments - ABI-encoded constructor arguments (hex without 0x)
   * @param {string} options.evmVersion - EVM version (default: 'default')
   * @param {string} options.licenseType - License type (1=No License, 3=MIT, etc.)
   * @returns {Promise<object>} Verification result
   */
  async verifyContract(options) {
    if (!this.apiKey) {
      throw new Error('API key is required. Set ETHERSCAN_API_KEY environment variable or pass to constructor.');
    }

    const {
      contractAddress,
      sourceCode,
      contractName,
      compilerVersion,
      optimizationUsed = 1,
      runs = 200,
      constructorArguments = '',
      evmVersion = 'default',
      licenseType = '3'
    } = options;

    // Validate required fields
    if (!contractAddress || !sourceCode || !contractName || !compilerVersion) {
      throw new Error('Missing required fields: contractAddress, sourceCode, contractName, compilerVersion');
    }

    const validatedAddress = this.validateAddress(contractAddress);

    try {
      const params = {
        apikey: this.apiKey,
        module: 'contract',
        action: 'verifysourcecode',
        contractaddress: validatedAddress,
        sourceCode: sourceCode,
        codeformat: 'solidity-single-file',
        contractname: contractName,
        compilerversion: compilerVersion,
        optimizationUsed: optimizationUsed.toString(),
        runs: runs.toString(),
        constructorArguements: constructorArguments, // Note: Etherscan API has this typo
        evmversion: evmVersion,
        licenseType: licenseType
      };

      const response = await this._makeRequest(params, 'POST', params);

      if (response.status === '0') {
        throw new Error(response.result || 'Contract verification failed');
      }

      return {
        status: 'success',
        message: response.message || 'Contract verification submitted',
        guid: response.result,
        contractAddress: validatedAddress,
        chainId: this.chainId,
        timestamp: Date.now()
      };
    } catch (error) {
      throw new Error(`Contract verification error: ${error.message}`);
    }
  }

  /**
   * Checks the status of a contract verification
   * @param {string} guid - Verification GUID returned from verifyContract
   * @returns {Promise<object>} Verification status
   */
  async checkVerificationStatus(guid) {
    if (!this.apiKey) {
      throw new Error('API key is required');
    }

    if (!guid || typeof guid !== 'string') {
      throw new Error('GUID must be a non-empty string');
    }

    try {
      const params = {
        apikey: this.apiKey,
        module: 'contract',
        action: 'checkverifystatus',
        guid: guid
      };

      const response = await this._makeRequest(params);

      return {
        status: response.status === '1' ? 'verified' : 'pending',
        message: response.result || response.message,
        guid: guid,
        timestamp: Date.now()
      };
    } catch (error) {
      throw new Error(`Error checking verification status: ${error.message}`);
    }
  }

  /**
   * Gets the contract ABI for a verified contract
   * @param {string} contractAddress - Contract address
   * @returns {Promise<object>} Contract ABI
   */
  async getContractABI(contractAddress) {
    const validatedAddress = this.validateAddress(contractAddress);
    
    const cacheKey = `abi_${this.chainId}_${validatedAddress}`;
    
    return await this.cacheManager.getWithCache(cacheKey, async () => {
      try {
        const params = {
          module: 'contract',
          action: 'getabi',
          address: validatedAddress
        };

        if (this.apiKey) {
          params.apikey = this.apiKey;
        }

        const response = await this._makeRequest(params);

        if (response.status !== '1') {
          throw new Error(response.result || 'Failed to fetch contract ABI');
        }

        return {
          address: validatedAddress,
          abi: JSON.parse(response.result),
          chainId: this.chainId,
          timestamp: Date.now()
        };
      } catch (error) {
        throw new Error(`Error fetching contract ABI: ${error.message}`);
      }
    });
  }

  /**
   * Gets the contract source code for a verified contract
   * @param {string} contractAddress - Contract address
   * @returns {Promise<object>} Contract source code and metadata
   */
  async getContractSourceCode(contractAddress) {
    const validatedAddress = this.validateAddress(contractAddress);
    
    const cacheKey = `source_${this.chainId}_${validatedAddress}`;
    
    return await this.cacheManager.getWithCache(cacheKey, async () => {
      try {
        const params = {
          module: 'contract',
          action: 'getsourcecode',
          address: validatedAddress
        };

        if (this.apiKey) {
          params.apikey = this.apiKey;
        }

        const response = await this._makeRequest(params);

        if (response.status !== '1') {
          throw new Error(response.result || 'Failed to fetch contract source code');
        }

        const result = response.result[0];

        return {
          address: validatedAddress,
          sourceCode: result.SourceCode,
          abi: result.ABI,
          contractName: result.ContractName,
          compilerVersion: result.CompilerVersion,
          optimizationUsed: result.OptimizationUsed,
          runs: result.Runs,
          constructorArguments: result.ConstructorArguments,
          evmVersion: result.EVMVersion,
          library: result.Library,
          licenseType: result.LicenseType,
          proxy: result.Proxy,
          implementation: result.Implementation,
          swarmSource: result.SwarmSource,
          chainId: this.chainId,
          timestamp: Date.now()
        };
      } catch (error) {
        throw new Error(`Error fetching contract source code: ${error.message}`);
      }
    });
  }

  /**
   * Verifies a contract using bytecode only (for contracts without source)
   * @param {string} contractAddress - Contract address
   * @param {string} bytecode - Contract bytecode
   * @returns {Promise<object>} Verification result
   */
  async verifyBytecode(contractAddress, bytecode) {
    const validatedAddress = this.validateAddress(contractAddress);

    if (!bytecode || typeof bytecode !== 'string') {
      throw new Error('Bytecode must be a non-empty string');
    }

    // Remove 0x prefix if present
    const cleanBytecode = bytecode.replace(/^0x/, '');

    if (!/^[0-9a-f]+$/i.test(cleanBytecode)) {
      throw new Error('Invalid bytecode format (must be hex)');
    }

    try {
      const params = {
        module: 'contract',
        action: 'getcode',
        address: validatedAddress
      };

      if (this.apiKey) {
        params.apikey = this.apiKey;
      }

      const response = await this._makeRequest(params);

      if (response.status !== '1') {
        throw new Error(response.result || 'Failed to fetch contract bytecode');
      }

      const onChainBytecode = response.result.replace(/^0x/, '');
      const providedBytecode = cleanBytecode;

      // Compare bytecodes
      const match = onChainBytecode === providedBytecode;

      return {
        address: validatedAddress,
        match: match,
        onChainBytecode: '0x' + onChainBytecode,
        providedBytecode: '0x' + providedBytecode,
        chainId: this.chainId,
        message: match ? 'Bytecode matches on-chain bytecode' : 'Bytecode does not match on-chain bytecode',
        timestamp: Date.now()
      };
    } catch (error) {
      throw new Error(`Bytecode verification error: ${error.message}`);
    }
  }

  /**
   * Encodes constructor arguments for verification
   * @param {Array} types - Array of parameter types (e.g., ['address', 'uint256'])
   * @param {Array} values - Array of parameter values
   * @returns {string} ABI-encoded constructor arguments (hex without 0x)
   */
  static encodeConstructorArguments(types, values) {
    if (!Array.isArray(types) || !Array.isArray(values)) {
      throw new Error('Types and values must be arrays');
    }

    if (types.length !== values.length) {
      throw new Error('Types and values arrays must have the same length');
    }

    // Simple encoding for basic types
    // For production use, consider using ethers.js or web3.js ABI encoder
    let encoded = '';

    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      const value = values[i];

      if (type === 'address') {
        // Remove 0x and pad to 32 bytes (64 hex chars)
        const cleanAddress = value.toString().toLowerCase().replace(/^0x/, '');
        encoded += cleanAddress.padStart(64, '0');
      } else if (type.startsWith('uint') || type.startsWith('int')) {
        // Convert number to hex and pad to 32 bytes
        const numValue = BigInt(value);
        const hex = numValue.toString(16);
        encoded += hex.padStart(64, '0');
      } else if (type === 'bool') {
        // Boolean: true = 1, false = 0
        encoded += (value ? '1' : '0').padStart(64, '0');
      } else if (type === 'bytes32' || type === 'string') {
        // For bytes32, just pad the hex string
        const cleanHex = value.toString().replace(/^0x/, '');
        encoded += cleanHex.padStart(64, '0');
      } else {
        throw new Error(`Unsupported type: ${type}. Use a proper ABI encoder for complex types.`);
      }
    }

    return encoded;
  }

  /**
   * Formats verification result for display
   * @param {object} result - Verification result
   * @returns {string} Formatted output
   */
  formatVerificationResult(result) {
    if (!result || typeof result !== 'object') {
      return 'No verification result available';
    }

    let output = 'Contract Verification Result\n';
    output += '================================\n\n';
    
    if (result.contractAddress) {
      output += `Contract Address: ${result.contractAddress}\n`;
    }
    
    if (result.chainId) {
      output += `Chain ID: ${result.chainId}\n`;
    }
    
    if (result.status) {
      output += `Status: ${result.status}\n`;
    }
    
    if (result.message) {
      output += `Message: ${result.message}\n`;
    }
    
    if (result.guid) {
      output += `Verification GUID: ${result.guid}\n`;
      output += `\nUse checkVerificationStatus("${result.guid}") to check status.\n`;
    }

    if (result.match !== undefined) {
      output += `Bytecode Match: ${result.match ? '✓ YES' : '✗ NO'}\n`;
    }

    return output;
  }

  /**
   * Gets API key information (without revealing the key)
   * SECURITY: Never log or display the actual API key
   * @returns {object} API key info
   */
  getAPIKeyInfo() {
    return {
      hasApiKey: !!this.apiKey,
      keyLength: this.apiKey ? this.apiKey.length : 0,
      keyPreview: this.apiKey ? `${this.apiKey.substring(0, 4)}...${this.apiKey.substring(this.apiKey.length - 4)}` : 'Not set',
      recommendation: 'Store API keys in environment variables (ETHERSCAN_API_KEY)'
    };
  }

  /**
   * Clears the internal cache
   */
  clearCache() {
    this.cacheManager.clearCache();
  }

  /**
   * Gets cache statistics
   * @returns {object} Cache statistics
   */
  getCacheStats() {
    return {
      size: this.cacheManager.cache.size,
      timeout: this.cacheManager.cacheTimeout,
      keys: Array.from(this.cacheManager.cache.keys())
    };
  }

  /**
   * Gets API configuration information
   * @returns {object} API configuration
   */
  getAPIInfo() {
    return {
      baseUrl: this.apiBaseUrl,
      chainId: this.chainId,
      hasApiKey: !!this.apiKey,
      cacheTimeout: this.cacheManager.cacheTimeout
    };
  }
}

module.exports = EtherscanVerifier;
