/**
 * Etherscan Contract Verification Module
 * Verifies smart contracts on Etherscan using their verification API
 */

const { makeRequest } = require('./http-client');

class EtherscanVerifier {
  /**
   * Creates a new Etherscan Verifier instance
   * @param {string} apiKey - Etherscan API key (loads from ETHERSCAN_API_KEY env var if not provided)
   * @param {string} apiBaseUrl - Etherscan API base URL (defaults to api.etherscan.io)
   */
  constructor(apiKey = null, apiBaseUrl = 'api.etherscan.io') {
    // Load API key from environment if not provided
    this.apiKey = apiKey || process.env.ETHERSCAN_API_KEY;
    this.apiBaseUrl = apiBaseUrl;
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
   * Validates contract verification parameters
   * @param {object} params - Verification parameters
   * @throws {Error} If any parameter is invalid
   * @private
   */
  _validateVerificationParams(params) {
    if (!params || typeof params !== 'object') {
      throw new Error('Verification parameters must be an object');
    }

    // Required fields
    const required = ['contractAddress', 'sourceCode', 'contractName', 'compilerVersion'];
    for (const field of required) {
      if (!params[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate address
    this.validateAddress(params.contractAddress);

    // Validate compiler version format
    if (typeof params.compilerVersion !== 'string' || !params.compilerVersion.startsWith('v')) {
      throw new Error('Compiler version must be a string starting with "v" (e.g., v0.8.20+commit.a1b79de6)');
    }

    // Validate optimization flag (should be 0 or 1)
    if (params.optimizationUsed !== undefined) {
      if (params.optimizationUsed !== 0 && params.optimizationUsed !== 1) {
        throw new Error('optimizationUsed must be 0 or 1');
      }
    }

    // Validate runs (positive integer if optimization is enabled)
    if (params.optimizationUsed === 1 && params.runs !== undefined) {
      if (!Number.isInteger(params.runs) || params.runs < 0) {
        throw new Error('runs must be a non-negative integer');
      }
    }

    // Validate license type (1-14 are valid Etherscan license types)
    if (params.licenseType !== undefined) {
      const license = parseInt(params.licenseType);
      if (isNaN(license) || license < 1 || license > 14) {
        throw new Error('licenseType must be between 1 and 14');
      }
    }
  }

  /**
   * Makes an HTTPS request to the Etherscan API
   * @param {string} path - API path
   * @param {object} params - Query parameters
   * @returns {Promise<object>} API response
   * @private
   */
  async _makeRequest(path, params) {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${path}?${queryParams}`;
    
    return makeRequest({
      hostname: this.apiBaseUrl,
      path: url,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'EtherscanVerifier/1.0'
      }
    });
  }

  /**
   * Verifies a smart contract on Etherscan
   * @param {object} params - Contract verification parameters
   * @param {string} params.contractAddress - The contract address
   * @param {string} params.sourceCode - The contract source code
   * @param {string} params.contractName - The contract name
   * @param {string} params.compilerVersion - Compiler version (e.g., 'v0.8.20+commit.a1b79de6')
   * @param {number} [params.optimizationUsed=0] - Whether optimization was used (0 or 1)
   * @param {number} [params.runs=200] - Number of optimization runs
   * @param {string} [params.constructorArguments=''] - ABI-encoded constructor arguments
   * @param {string} [params.evmVersion='default'] - EVM version (e.g., 'paris', 'london', 'default')
   * @param {string} [params.licenseType='1'] - License type (1=No License, 3=MIT, etc.)
   * @returns {Promise<object>} Verification result with guid
   * @throws {Error} If verification submission fails
   */
  async verifyContract(params) {
    // Validate API key
    if (!this.apiKey) {
      throw new Error('API key is required. Set ETHERSCAN_API_KEY environment variable or pass it to constructor');
    }

    // Validate parameters
    this._validateVerificationParams(params);

    const validatedAddress = this.validateAddress(params.contractAddress);

    try {
      // Prepare API request parameters
      const apiParams = {
        apikey: this.apiKey,
        module: 'contract',
        action: 'verifysourcecode',
        contractaddress: validatedAddress,
        sourceCode: params.sourceCode,
        codeformat: 'solidity-single-file',
        contractname: params.contractName,
        compilerversion: params.compilerVersion,
        optimizationUsed: params.optimizationUsed !== undefined ? params.optimizationUsed : 0,
        runs: params.runs !== undefined ? params.runs : 200,
        constructorArguements: params.constructorArguments || '', // Note: Etherscan API uses 'Arguements' (typo)
        evmversion: params.evmVersion || 'default',
        licenseType: params.licenseType !== undefined ? params.licenseType : '1'
      };

      const response = await this._makeRequest('/api', apiParams);

      // Check if the API returned an error
      if (response.status !== '1') {
        throw new Error(response.result || 'Failed to submit contract for verification');
      }

      return {
        status: response.status,
        message: response.message,
        guid: response.result,
        timestamp: Date.now()
      };
    } catch (error) {
      throw new Error(`Contract verification failed: ${error.message}`);
    }
  }

  /**
   * Checks the verification status of a contract
   * @param {string} guid - The verification GUID returned by verifyContract
   * @returns {Promise<object>} Verification status
   * @throws {Error} If status check fails
   */
  async checkVerificationStatus(guid) {
    // Validate API key
    if (!this.apiKey) {
      throw new Error('API key is required. Set ETHERSCAN_API_KEY environment variable or pass it to constructor');
    }

    // Validate GUID
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

      const response = await this._makeRequest('/api', params);

      return {
        status: response.status,
        message: response.message,
        result: response.result,
        timestamp: Date.now()
      };
    } catch (error) {
      throw new Error(`Failed to check verification status: ${error.message}`);
    }
  }

  /**
   * Gets API information
   * @returns {object} API configuration
   */
  getAPIInfo() {
    return {
      baseUrl: this.apiBaseUrl,
      hasApiKey: !!this.apiKey
    };
  }
}

module.exports = EtherscanVerifier;
