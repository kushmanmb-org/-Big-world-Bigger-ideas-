// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

/* solhint-disable no-inline-assembly */

/**
 * Helper functions for working with calldata.
 */

/**
 * @notice Keccak function over calldata.
 * @dev Copy calldata into memory, do keccak and drop allocated memory. Strangely, this is more efficient than letting solidity do it.
 * @return ret The keccak256 hash of the calldata
 */
function calldataKeccak(bytes calldata data) pure returns (bytes32 ret) {
    assembly {
        let mem := mload(0x40)
        let len := data.length
        calldatacopy(mem, data.offset, len)
        ret := keccak256(mem, len)
    }
}
