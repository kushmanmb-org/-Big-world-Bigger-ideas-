# Smart Contracts

This directory contains Solidity smart contracts for the Big World Bigger Ideas project.

## Contracts

### FCL_ecdsa.sol

ECDSA signature verification library using the sec256r1 (P-256) elliptic curve.

**Features:**
- ECDSA signature verification for sec256r1 curve
- Ethereum address recovery from P-256 signatures
- Precomputed verification using Shamir's trick for optimized gas usage
- Support for both standard and precomputed verification methods

**Key Functions:**
- `ecdsa_verify(bytes32 message, uint256 r, uint256 s, uint256 Qx, uint256 Qy)`: Standard ECDSA verification
- `ec_recover_r1(uint256 h, uint256 v, uint256 r, uint256 s)`: Recover Ethereum address from signature
- `ecdsa_precomputed_verify(bytes32 message, uint256 r, uint256 s, address Shamir8)`: Optimized verification using precomputed tables
- `ecdsa_precomputed_verify(bytes32 message, uint256[2] calldata rs, address Shamir8)`: Overloaded version with signature array

**Security Notes:**
- This code SHALL NOT be used for non-prime order curves
- Optimized specifically for curves with a=-3 (like sec256r1)
- All input parameters are validated before processing

**Solidity Version:** >=0.8.19 <0.9.0

**License:** MIT

**Source:** [Fresh CryptoLib (FCL)](https://github.com/rdubois-crypto/FreshCryptoLib)

**Academic Reference:** [IACR ePrint 2023/939](https://eprint.iacr.org/2023/939.pdf)

### FCL_elliptic.sol

Optimized elliptic curve cryptography library for the sec256r1 (P-256) curve using modified XYZZ coordinate system.

**Features:**
- Modified XYZZ coordinate system for efficient point operations
- Optimized point multiplication and addition
- Strauss-Shamir's trick for multi-scalar multiplication
- Support for both affine and projective coordinate representations
- Gas-optimized assembly implementations

**Key Functions:**
- `ecAff_isOnCurve(uint256 x, uint256 y)`: Check if point is on the curve
- `FCL_nModInv(uint256 u)`: Modular inverse in the curve order field
- `FCL_pModInv(uint256 u)`: Modular inverse in the curve prime field
- `ec_Decompress(uint256 x, uint256 parity)`: Point decompression
- `ecZZ_mulmuladd_S_asm(uint256 Q0, uint256 Q1, uint256 scalar_u, uint256 scalar_v)`: Optimized multi-scalar multiplication (returns x-coordinate only)
- `ecZZ_mulmuladd(uint256 Q0, uint256 Q1, uint256 scalar_u, uint256 scalar_v)`: Multi-scalar multiplication (returns full point)
- `ecZZ_mulmuladd_S8_extcode(uint256 scalar_u, uint256 scalar_v, address dataPointer)`: 8-dimensional Shamir trick using external contract storage

**Curve Parameters (sec256r1):**
- Prime field modulus (p): 0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF
- Curve parameter a: 0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC
- Curve parameter b: 0x5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B
- Base point G: (0x6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296, 0x4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5)
- Curve order (n): 0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551

**Security Notes:**
- WARNING: This code SHALL NOT be used for non-prime order curves
- Optimized for a=-3 curves with prime order (like sec256r1)
- Uses EVM precompiled contracts for modular exponentiation

**Solidity Version:** >=0.8.19 <0.9.0

**License:** MIT

**Source:** [Fresh CryptoLib (FCL)](https://github.com/rdubois-crypto/FreshCryptoLib)

**Academic Reference:** [IACR ePrint 2023/939](https://eprint.iacr.org/2023/939.pdf)

### Receiver.sol

An abstract receiver mixin contract for handling ETH and safe-transferred ERC721 and ERC1155 tokens.

**Features:**
- Handles all ERC721 and ERC1155 token safety callbacks
- Collapses function table gas overhead and minimizes code size
- Utilizes fallback pattern for efficient callback handling
- Accepts ETH transfers via `receive()` function
- Memory-safe assembly for optimal gas efficiency

**Key Components:**
- `receive()`: Virtual function for receiving ETH
- `fallback()`: Virtual fallback with `receiverFallback` modifier
- `receiverFallback`: Modifier that handles token callback signatures:
  - `onERC721Received(address,address,uint256,bytes)` (0x150b7a02)
  - `onERC1155Received(address,address,uint256,uint256,bytes)` (0xf23a6e61)
  - `onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)` (0xbc197c81)

**Usage:**
This is an abstract contract designed to be inherited by contracts that need to receive ERC721 and ERC1155 tokens safely. When inherited, the contract automatically handles the required callback functions without needing explicit implementations.

**Solidity Version:** ^0.8.4

**License:** MIT

**Source:** [Solady](https://github.com/Vectorized/solady/blob/main/src/accounts/Receiver.sol)

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
