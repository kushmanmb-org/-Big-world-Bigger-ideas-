/**
 * Simple Wallet Module with Encryption Capabilities
 * For use in blockchain applications
 */

const crypto = require('crypto');

class Wallet {
  constructor() {
    this.address = null;
    this.privateKey = null;
    this.encryptedData = null;
  }

  /**
   * Encrypts the wallet with a password
   * @param {string} newPassword - The password to encrypt the wallet with
   * @returns {object} Encrypted wallet data
   */
  encrypt(newPassword) {
    if (!newPassword || typeof newPassword !== 'string') {
      throw new Error('Password must be a non-empty string');
    }

    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Generate a random salt
    const salt = crypto.randomBytes(32);
    
    // Derive a key from the password using PBKDF2
    const key = crypto.pbkdf2Sync(newPassword, salt, 100000, 32, 'sha256');
    
    // Generate initialization vector
    const iv = crypto.randomBytes(16);
    
    // Create the wallet data to encrypt
    const walletData = JSON.stringify({
      address: this.address,
      privateKey: this.privateKey,
      timestamp: Date.now()
    });
    
    // Create cipher and encrypt the data
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(walletData, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Store the encrypted data
    this.encryptedData = {
      data: encrypted,
      salt: salt.toString('hex'),
      iv: iv.toString('hex'),
      algorithm: 'aes-256-cbc',
      kdf: 'pbkdf2',
      iterations: 100000
    };
    
    return this.encryptedData;
  }

  /**
   * Decrypts the wallet with a password
   * @param {string} password - The password to decrypt the wallet with
   * @returns {object} Decrypted wallet data
   */
  decrypt(password) {
    if (!this.encryptedData) {
      throw new Error('No encrypted data found');
    }

    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a non-empty string');
    }

    try {
      // Convert salt and IV from hex
      const salt = Buffer.from(this.encryptedData.salt, 'hex');
      const iv = Buffer.from(this.encryptedData.iv, 'hex');
      
      // Derive the key from the password
      const key = crypto.pbkdf2Sync(password, salt, this.encryptedData.iterations, 32, 'sha256');
      
      // Create decipher and decrypt the data
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(this.encryptedData.data, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      const walletData = JSON.parse(decrypted);
      
      // Restore wallet data
      this.address = walletData.address;
      this.privateKey = walletData.privateKey;
      
      return walletData;
    } catch (error) {
      throw new Error('Invalid password or corrupted data');
    }
  }

  /**
   * Generates a new wallet address and private key
   * @returns {object} Wallet address and private key
   */
  generate() {
    // Generate a random private key (32 bytes)
    this.privateKey = crypto.randomBytes(32).toString('hex');
    
    // Generate a wallet address (simplified - not a real blockchain address)
    const hash = crypto.createHash('sha256').update(this.privateKey).digest('hex');
    this.address = '0x' + hash.substring(0, 40);
    
    return {
      address: this.address,
      privateKey: this.privateKey
    };
  }

  /**
   * Exports the encrypted wallet
   * @returns {object} Encrypted wallet data
   */
  export() {
    if (!this.encryptedData) {
      throw new Error('Wallet must be encrypted before exporting');
    }
    return this.encryptedData;
  }

  /**
   * Imports an encrypted wallet
   * @param {object} encryptedData - The encrypted wallet data
   */
  import(encryptedData) {
    if (!encryptedData || typeof encryptedData !== 'object') {
      throw new Error('Invalid encrypted data');
    }
    this.encryptedData = encryptedData;
  }
}

module.exports = Wallet;
