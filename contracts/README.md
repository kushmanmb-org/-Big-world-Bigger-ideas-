# Smart Contracts

This directory contains Solidity smart contracts for the Big World Bigger Ideas project.

## Contracts

### UserOperation.sol

ERC-4337 Account Abstraction user operation struct definition.

**Features:**
- Standard ERC-4337 UserOperation struct
- Contains all parameters needed for account abstraction operations
- Used by IAccount interface for signature validation

**Key Fields:**
- `sender`: The account making the operation
- `nonce`: Anti-replay parameter
- `initCode`: Account creation code (for new accounts)
- `callData`: The data to pass to the sender during main execution
- `callGasLimit`: Gas limit for the main execution call
- `verificationGasLimit`: Gas limit for the verification step
- `preVerificationGas`: Gas to pay for bundler overhead
- `maxFeePerGas`: Maximum fee per gas (similar to EIP-1559)
- `maxPriorityFeePerGas`: Maximum priority fee per gas (similar to EIP-1559)
- `paymasterAndData`: Address of paymaster sponsoring the transaction
- `signature`: Signature over the entire request

**Solidity Version:** ^0.8.12

**License:** GPL-3.0

### IAccount.sol

ERC-4337 Account Abstraction interface for account contracts.

**Features:**
- Standard ERC-4337 IAccount interface
- Defines the `validateUserOp` function for signature validation
- Used by EntryPoint contract to validate user operations

**Key Function:**
- `validateUserOp()`: Validates user's signature and nonce before execution
  - Returns validation data with signature status and time range
  - SIG_VALIDATION_FAILED (1) indicates signature failure
  - Supports time-range validation with validUntil and validAfter
  - Handles missing account funds for gas payment

**Solidity Version:** ^0.8.12

**License:** GPL-3.0

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
