// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

/**
 * @title UserOperation
 * @notice User Operation struct as defined in ERC-4337 Account Abstraction standard
 * @dev This struct represents a user operation to be executed via the EntryPoint contract
 */
struct UserOperation {
    address sender;              // The account making the operation
    uint256 nonce;               // Anti-replay parameter
    bytes initCode;              // Account creation code (for new accounts)
    bytes callData;              // The data to pass to the sender during main execution call
    uint256 callGasLimit;        // Gas limit for the main execution call
    uint256 verificationGasLimit; // Gas limit for the verification step
    uint256 preVerificationGas;  // Gas to pay for bundler overhead
    uint256 maxFeePerGas;        // Maximum fee per gas (similar to EIP-1559)
    uint256 maxPriorityFeePerGas; // Maximum priority fee per gas (similar to EIP-1559)
    bytes paymasterAndData;      // Address of paymaster sponsoring the transaction, followed by extra data
    bytes signature;             // Signature over the entire request
}
