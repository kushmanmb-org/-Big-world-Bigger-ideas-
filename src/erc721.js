/**
 * ERC-721 Token Fetching Module
 * Provides functionality to interact with ERC-721 (NFT) tokens on blockchain networks
 */

/**
 * ERC-721 Standard ABI functions
 * These are the standard function signatures for ERC-721 tokens
 */
const ERC721_ABI = {
  // Read-only functions
  balanceOf: {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
    signature: '0x70a08231' // balanceOf(address)
  },
  ownerOf: {
    name: 'ownerOf',
    type: 'function',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: 'owner', type: 'address' }],
    signature: '0x6352211e' // ownerOf(uint256)
  },
  tokenURI: {
    name: 'tokenURI',
    type: 'function',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: 'uri', type: 'string' }],
    signature: '0xc87b56dd' // tokenURI(uint256)
  },
  name: {
    name: 'name',
    type: 'function',
    inputs: [],
    outputs: [{ name: 'name', type: 'string' }],
    signature: '0x06fdde03' // name()
  },
  symbol: {
    name: 'symbol',
    type: 'function',
    inputs: [],
    outputs: [{ name: 'symbol', type: 'string' }],
    signature: '0x95d89b41' // symbol()
  },
  totalSupply: {
    name: 'totalSupply',
    type: 'function',
    inputs: [],
    outputs: [{ name: 'supply', type: 'uint256' }],
    signature: '0x18160ddd' // totalSupply()
  }
};

class ERC721Fetcher {
  /**
   * Creates a new ERC-721 fetcher instance
   * @param {string} contractAddress - The ERC-721 contract address
   * @param {string} rpcUrl - The RPC endpoint URL (optional, for documentation)
   */
  constructor(contractAddress, rpcUrl = null) {
    this.contractAddress = this.validateAddress(contractAddress);
    this.rpcUrl = rpcUrl;
    this.cache = new Map();
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
   * Validates a token ID
   * @param {string|number} tokenId - The token ID to validate
   * @returns {string} Validated token ID as string
   * @throws {Error} If token ID is invalid
   */
  validateTokenId(tokenId) {
    if (tokenId === null || tokenId === undefined) {
      throw new Error('Token ID must be provided');
    }
    
    const tokenIdStr = tokenId.toString();
    if (!/^\d+$/.test(tokenIdStr)) {
      throw new Error('Token ID must be a non-negative integer');
    }
    
    return tokenIdStr;
  }

  /**
   * Gets the balance of tokens owned by an address
   * @param {string} ownerAddress - The address to check
   * @returns {object} Balance information
   */
  async getBalance(ownerAddress) {
    const validatedOwner = this.validateAddress(ownerAddress);
    
    // In a real implementation, this would make an RPC call
    // For this demo/skeleton, we return a structured response
    return {
      owner: validatedOwner,
      balance: '0',
      contract: this.contractAddress,
      method: 'balanceOf',
      abi: ERC721_ABI.balanceOf,
      note: 'This is a skeleton implementation. Connect to an RPC endpoint to fetch real data.'
    };
  }

  /**
   * Gets the owner of a specific token
   * @param {string|number} tokenId - The token ID
   * @returns {object} Owner information
   */
  async getOwner(tokenId) {
    const validatedTokenId = this.validateTokenId(tokenId);
    
    return {
      tokenId: validatedTokenId,
      owner: '0x0000000000000000000000000000000000000000',
      contract: this.contractAddress,
      method: 'ownerOf',
      abi: ERC721_ABI.ownerOf,
      note: 'This is a skeleton implementation. Connect to an RPC endpoint to fetch real data.'
    };
  }

  /**
   * Gets the token URI (metadata location) for a token
   * @param {string|number} tokenId - The token ID
   * @returns {object} Token URI information
   */
  async getTokenURI(tokenId) {
    const validatedTokenId = this.validateTokenId(tokenId);
    
    return {
      tokenId: validatedTokenId,
      uri: '',
      contract: this.contractAddress,
      method: 'tokenURI',
      abi: ERC721_ABI.tokenURI,
      note: 'This is a skeleton implementation. Connect to an RPC endpoint to fetch real data.'
    };
  }

  /**
   * Fetches and parses token metadata from the token URI
   * @param {string|number} tokenId - The token ID
   * @returns {object} Token metadata
   */
  async getTokenMetadata(tokenId) {
    const validatedTokenId = this.validateTokenId(tokenId);
    const cacheKey = `metadata_${validatedTokenId}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    // In a real implementation, this would:
    // 1. Call getTokenURI to get the metadata URI
    // 2. Fetch the metadata from the URI (could be IPFS, HTTP, etc.)
    // 3. Parse and return the metadata
    
    const metadata = {
      tokenId: validatedTokenId,
      name: '',
      description: '',
      image: '',
      attributes: [],
      contract: this.contractAddress,
      note: 'This is a skeleton implementation. Connect to an RPC endpoint and metadata service to fetch real data.'
    };
    
    this.cache.set(cacheKey, metadata);
    return metadata;
  }

  /**
   * Gets the collection name
   * @returns {object} Collection name information
   */
  async getCollectionName() {
    return {
      name: '',
      contract: this.contractAddress,
      method: 'name',
      abi: ERC721_ABI.name,
      note: 'This is a skeleton implementation. Connect to an RPC endpoint to fetch real data.'
    };
  }

  /**
   * Gets the collection symbol
   * @returns {object} Collection symbol information
   */
  async getCollectionSymbol() {
    return {
      symbol: '',
      contract: this.contractAddress,
      method: 'symbol',
      abi: ERC721_ABI.symbol,
      note: 'This is a skeleton implementation. Connect to an RPC endpoint to fetch real data.'
    };
  }

  /**
   * Gets the total supply of tokens
   * @returns {object} Total supply information
   */
  async getTotalSupply() {
    return {
      totalSupply: '0',
      contract: this.contractAddress,
      method: 'totalSupply',
      abi: ERC721_ABI.totalSupply,
      note: 'This is a skeleton implementation. Connect to an RPC endpoint to fetch real data.'
    };
  }

  /**
   * Checks if an address owns a specific token
   * @param {string} ownerAddress - The address to check
   * @param {string|number} tokenId - The token ID
   * @returns {object} Ownership verification result
   */
  async verifyOwnership(ownerAddress, tokenId) {
    const validatedOwner = this.validateAddress(ownerAddress);
    const validatedTokenId = this.validateTokenId(tokenId);
    
    // In a real implementation, this would call getOwner and compare
    return {
      owner: validatedOwner,
      tokenId: validatedTokenId,
      isOwner: false,
      contract: this.contractAddress,
      note: 'This is a skeleton implementation. Connect to an RPC endpoint to fetch real data.'
    };
  }

  /**
   * Gets comprehensive token information
   * @param {string|number} tokenId - The token ID
   * @returns {object} Complete token information
   */
  async getTokenInfo(tokenId) {
    const validatedTokenId = this.validateTokenId(tokenId);
    
    // In a real implementation, this would fetch all info in parallel
    const [owner, uri, metadata] = await Promise.all([
      this.getOwner(validatedTokenId),
      this.getTokenURI(validatedTokenId),
      this.getTokenMetadata(validatedTokenId)
    ]);
    
    return {
      tokenId: validatedTokenId,
      owner: owner.owner,
      uri: uri.uri,
      metadata: metadata,
      contract: this.contractAddress,
      note: 'This is a skeleton implementation. Connect to an RPC endpoint to fetch real data.'
    };
  }

  /**
   * Clears the internal cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Gets the ABI for a specific function
   * @param {string} functionName - The function name
   * @returns {object|null} The ABI definition or null
   */
  static getABI(functionName) {
    return ERC721_ABI[functionName] || null;
  }

  /**
   * Gets all ERC-721 standard ABIs
   * @returns {object} All ABI definitions
   */
  static getAllABIs() {
    return { ...ERC721_ABI };
  }
}

module.exports = ERC721Fetcher;
