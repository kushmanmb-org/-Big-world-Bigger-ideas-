# Wallet Encryption Module

This module provides secure wallet encryption functionality for blockchain applications using industry-standard cryptographic algorithms.

## Features

- **AES-256-CBC Encryption**: Industry-standard symmetric encryption algorithm
- **PBKDF2 Key Derivation**: Secure password-based key derivation with 100,000 iterations
- **Random Salt Generation**: Unique salt for each encryption operation
- **Initialization Vector (IV)**: Random IV for each encryption to ensure security
- **Import/Export**: Easily export encrypted wallets and import them later
- **Error Handling**: Comprehensive error handling for invalid inputs and decryption failures

## Installation

The wallet module is included in the project. No additional dependencies are required beyond Node.js built-in `crypto` module.

## Usage

### Basic Example

```javascript
const Wallet = require('./src/wallet');

// Create a new wallet instance
const wallet = new Wallet();

// Generate a new wallet
const walletData = wallet.generate();
console.log('Address:', walletData.address);

// Encrypt the wallet with a password
const password = 'MySecurePassword123!';
const encryptedData = wallet.encrypt(password);
console.log('Wallet encrypted successfully');

// Export the encrypted wallet
const exported = wallet.export();

// Import and decrypt
const newWallet = new Wallet();
newWallet.import(exported);
const decrypted = newWallet.decrypt(password);
console.log('Wallet decrypted successfully');
```

### Running the Demo

Run the included example to see the wallet encryption in action:

```bash
npm run wallet:demo
```

## API Reference

### `wallet.generate()`

Generates a new wallet with a random private key and address.

**Returns:** `{ address: string, privateKey: string }`

### `wallet.encrypt(newPassword)`

Encrypts the wallet with the provided password.

**Parameters:**
- `newPassword` (string): Password to encrypt the wallet (minimum 8 characters)

**Returns:** Encrypted wallet data object containing:
- `data`: Encrypted wallet data (hex string)
- `salt`: Random salt used for key derivation (hex string)
- `iv`: Initialization vector (hex string)
- `algorithm`: Encryption algorithm used ('aes-256-cbc')
- `kdf`: Key derivation function ('pbkdf2')
- `iterations`: Number of PBKDF2 iterations (100000)

**Throws:** Error if password is invalid or too short

### `wallet.decrypt(password)`

Decrypts the wallet using the provided password.

**Parameters:**
- `password` (string): Password to decrypt the wallet

**Returns:** Decrypted wallet data object containing:
- `address`: Wallet address
- `privateKey`: Wallet private key
- `timestamp`: Encryption timestamp

**Throws:** Error if password is incorrect or data is corrupted

### `wallet.export()`

Exports the encrypted wallet data.

**Returns:** Encrypted wallet data object

**Throws:** Error if wallet has not been encrypted

### `wallet.import(encryptedData)`

Imports encrypted wallet data.

**Parameters:**
- `encryptedData` (object): Previously exported encrypted wallet data

**Throws:** Error if encrypted data is invalid

## Security Considerations

⚠️ **Important Security Notes:**

1. **Never store passwords in plain text** - This is a demonstration module. In production, use secure password management.

2. **Private key security** - Private keys should never be exposed. In a real application, consider using hardware wallets or secure enclaves.

3. **Password strength** - Use strong, unique passwords with at least 12 characters including uppercase, lowercase, numbers, and symbols.

4. **Backup encrypted wallets** - Always backup your encrypted wallet data in a secure location.

5. **Transport security** - When transmitting encrypted wallet data, always use secure channels (HTTPS, TLS).

## Algorithm Details

- **Encryption Algorithm**: AES-256-CBC
- **Key Derivation Function**: PBKDF2
- **PBKDF2 Iterations**: 100,000
- **Salt Size**: 32 bytes (256 bits)
- **IV Size**: 16 bytes (128 bits)
- **Key Size**: 32 bytes (256 bits)

## Testing

The module includes a comprehensive example that demonstrates:
- Wallet generation
- Encryption with a valid password
- Export and import of encrypted data
- Successful decryption
- Failed decryption with wrong password

Run the test with:

```bash
npm run wallet:demo
```

## License

ISC

## Author

Matthew Brace (kushmanmb)
- Email: kushmanmb@gmx.com
- Website: https://kushmanmb.org
- ENS: kushmanmb.eth

---

**© 2024-2026 Matthew Brace (kushmanmb) | All Rights Reserved**
