# Smart Contracts

This directory contains Solidity smart contracts for the Big World Bigger Ideas project.

## Contracts

### WebAuthn.sol

A library for verifying WebAuthn Authentication Assertions on-chain.

**Features:**
- WebAuthn signature verification using secp256r1 curve
- RIP-7212 precompile support for gas-efficient verification
- FreshCryptoLib fallback for network compatibility
- Support for biometric authentication (Face ID, Touch ID, Windows Hello)
- Hardware security key support (YubiKey, Titan, etc.)
- Signature malleability protection
- User presence (UP) and user verification (UV) flag checks
- Challenge and client data JSON validation

**Use Cases:**
- Passwordless authentication for smart contracts
- Account abstraction with biometric signatures
- Multi-factor authentication for DeFi protocols
- Secure transaction signing with hardware keys

**Dependencies:**
- `FreshCryptoLib/FCL_ecdsa.sol` - ECDSA signature verification
- `FreshCryptoLib/FCL_elliptic.sol` - Elliptic curve math for secp256r1
- `openzeppelin-contracts/contracts/utils/Base64.sol` - Base64URL encoding
- `solady/utils/LibString.sol` - String manipulation utilities

**Solidity Version:** ^0.8.0

**License:** MIT

**Documentation:** See [WebAuthn.md](./WebAuthn.md) for detailed usage examples and integration guide.

**Authors:**
- Coinbase ([base-org/webauthn-sol](https://github.com/base-org/webauthn-sol))
- Daimo ([daimo-eth/p256-verifier](https://github.com/daimo-eth/p256-verifier))

### Proxy.sol

A transparent proxy contract following the EIP-1967 standard.

**Features:**
- Transparent proxy pattern for upgradeable contracts
- EIP-1967 compliant storage slots
- Admin-only functions for upgrades and administration
- Delegatecall-based proxy functionality
- Support for both `upgradeTo` and `upgradeToAndCall` patterns

**Key Components:**
- `IMPLEMENTATION_KEY`: Storage slot for implementation address (EIP-1967)
- `OWNER_KEY`: Storage slot for admin/owner address (EIP-1967)
- `upgradeTo()`: Upgrade implementation contract
- `upgradeToAndCall()`: Upgrade and initialize in one transaction
- `changeAdmin()`: Change proxy admin
- `admin()`: Query current admin
- `implementation()`: Query current implementation

**Verification:**
This contract was submitted for verification at basescan.org on 2023-07-24.

**Solidity Version:** 0.8.20

**License:** MIT

## Verified Deployments

### Base Network (Chain ID: 8453)

**Contract Address:** `0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43`

- **Network:** Base Mainnet
- **Explorer:** [View on Basescan](https://basescan.org/address/0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43)
- **Verified:** 2023-07-24
- **Compiler:** Solidity 0.8.20 with optimization (200 runs)
- **Type:** Transparent Proxy (EIP-1967)

For detailed verification metadata, see `contracts/verification/0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43.json`

For complete verification documentation, see `contracts/verification/README.md`

## Recent Updates (2026-02-19)

**Improvements Made:**
1. **Upgraded Solidity Version**: Updated from 0.8.15 to 0.8.20 for better optimization and latest features
2. **Custom Error Handling**: Replaced `require()` statements with custom errors for gas efficiency:
   - `DelegatecallFailed()`: Thrown when delegatecall to implementation fails
   - `ImplementationIsZeroAddress()`: Thrown when trying to set implementation to zero address
   - `ImplementationNotInitialized()`: Thrown when implementation is not initialized
3. **Zero Address Validation**: Added validation in `_setImplementation()` to prevent setting implementation to zero address
4. **Gas Optimization**: Custom errors save approximately 200-400 gas per revert compared to require strings

**Testing Recommendations:**
If deploying this updated contract, ensure you test:
- Zero address validation in `_setImplementation()` reverts with `ImplementationIsZeroAddress()`
- Failed delegatecall in `upgradeToAndCall()` reverts with `DelegatecallFailed()`
- Uninitialized implementation access reverts with `ImplementationNotInitialized()`
- All existing functionality remains unchanged (upgradeTo, changeAdmin, admin, implementation queries)

**Deployment Notes:**
- This contract maintains full backward compatibility with EIP-1967
- The ABI will include the new custom errors
- Gas savings will be realized on error conditions
- Consider recompiling with Solidity 0.8.20 for full optimization benefits

## Recent Updates (2026-02-24)

**WebAuthn Library Added:**

1. **New Library**: Added WebAuthn.sol for on-chain WebAuthn signature verification
2. **Key Features**:
   - Verify WebAuthn authentication assertions on-chain
   - Support for biometric authentication (Face ID, Touch ID, Windows Hello)
   - Hardware security key support (YubiKey, Titan, etc.)
   - RIP-7212 precompile for gas-efficient verification (5K-10K gas)
   - FreshCryptoLib fallback for compatibility (100K-150K gas)
   - Signature malleability protection (secp256r1)
   - User presence and verification flag validation
3. **Use Cases**:
   - Passwordless smart contract authentication
   - Account abstraction with biometric signatures
   - Multi-factor authentication for DeFi
   - Secure hardware key transaction signing
4. **Dependencies**:
   - FreshCryptoLib (FCL_ecdsa, FCL_elliptic)
   - OpenZeppelin Contracts (Base64 utilities)
   - Solady (LibString utilities)
5. **Documentation**: Complete usage guide in `WebAuthn.md`

**Implementation Notes:**
- The library follows W3C WebAuthn Level 2 specification
- Supports both user presence (UP) and user verification (UV) modes
- Automatically falls back to FreshCryptoLib if RIP-7212 is unavailable
- Gas optimized for networks with RIP-7212 support (Base network)
- Includes security considerations and threat model documentation
