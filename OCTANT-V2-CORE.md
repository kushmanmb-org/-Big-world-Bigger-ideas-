# Octant V2 Core Integration Guide

## Overview

[Octant V2 Core](https://github.com/golemfoundation/octant-v2-core) is an advanced blockchain protocol developed by the Golem Foundation, providing a comprehensive suite of yield strategies, allocation mechanisms, and Safe integration through the Dragon Protocol.

This guide helps you clone, set up, and work with the Octant V2 Core repository for blockchain development and integration purposes.

## Prerequisites

Before working with Octant V2 Core, ensure you have the following installed:

- **Node.js 22.16.0** - JavaScript runtime
- **Foundry Stable** - Ethereum development toolkit
- **Git** - Version control system

## Quick Start

### 1. Clone the Repository

```bash
# Clone repository
git clone https://github.com/golemfoundation/octant-v2-core.git
cd octant-v2-core
```

### 2. Install Dependencies

```bash
# Enable corepack for yarn
corepack enable

# Install Node.js dependencies
yarn install

# Install Solidity dependencies using soldeer
forge soldeer install
```

**Note**: Octant V2 uses `soldeer` as the dependency manager for Solidity contracts, which provides consistent management of Solidity versions and dependencies.

### 3. Configure Environment

```bash
# Setup lint hooks
yarn init

# Copy the environment template
cp .env.template .env

# Edit .env with your configuration
# Required fields:
# - RPC_URL: Your RPC endpoint
# - PRIVATE_KEY: Your wallet private key
# - ETHERSCAN_API_KEY: For contract verification
```

## Project Architecture

### Core Components

1. **Yield Strategies** (`src/strategies/`)
   - Generate yield from external protocols (Lido, Sky, Morpho, etc.)
   - Yield Donating strategies: Donate generated yield
   - Yield Skimming strategies: Capture yield for protocol benefit

2. **Allocation Mechanisms**
   - Democratic systems for resource distribution
   - Voting strategies for community governance

3. **Dragon Protocol** (`src/zodiac-core/`)
   - Advanced Safe integration for automated cross-protocol operations
   - Cross-protocol routing and coordination
   - Linear allowance execution with controlled spending limits

4. **Factories** (`src/factories/`)
   - Standardized deployment contracts
   - Parameter validation
   - Vault and strategy creation

5. **Utilities** (`src/utils/`)
   - Shared libraries and helper contracts
   - Address set management
   - Hats protocol integration

### Data Flow

```
                        Vaults   
                          ↓   
External Protocols → Strategies → Dragon Routers → Allocation Mechanisms
                          ↓   
                    Safe Modules
```

## Key Features

### Multi-Strategy Vaults
- **MultistrategyVault.sol**: Main vault managing multiple strategies with risk distribution
- **MultistrategyLockedVault.sol**: Vault with lockup periods and non-transferable shares
- ERC-4626 compliant tokenized strategies

### Yield Generation
- **Lido Strategy**: Staking through Lido protocol
- **Morpho Compounder**: Compounding strategies on Morpho
- **Sky Compounder**: Sky protocol integration
- **USDS Farmer**: USDS farming strategies

### Safe Integration
- Linear allowance execution modules
- Anti-loophole transaction guards
- Split checking for fund distribution
- Modular Safe extensions

## Development Workflows

### Running Tests

```bash
# Run all tests
forge test

# Run specific test file
forge test --match-path test/unit/core/vaults/MultistrategyVault.t.sol

# Run with gas reporting
forge test --gas-report

# Run integration tests
forge test --match-path test/integration/
```

### Building Contracts

```bash
# Build all contracts
forge build

# Build with optimization
forge build --optimize --optimizer-runs 200
```

### Deploying Contracts

```bash
# Deploy using forge scripts
forge script script/Deploy.s.sol:DeployScript --rpc-url $RPC_URL --broadcast

# Verify on Etherscan
forge verify-contract <CONTRACT_ADDRESS> <CONTRACT_NAME> --chain-id <CHAIN_ID>
```

## Contract Inheritance Hierarchy

```
TokenizedStrategy (Implementation)
├── DragonTokenizedStrategy (Adds lockup + non-transferable shares)
└── YieldBearingDragonTokenizedStrategy (Adds yield distribution)

BaseStrategy (Abstract)
├── DragonBaseStrategy (Adds router integration)
├── YieldDonatingTokenizedStrategy (Donates yield)
└── YieldSkimmingTokenizedStrategy (Skims yield)
```

## Adding New Strategies

1. Inherit from the appropriate base strategy contract:
   - `BaseStrategy` in `src/core/` for standard strategies
   - `DragonBaseStrategy` in `src/zodiac-core/` for Dragon-integrated strategies

2. Implement required functions:
   - `_deployFunds()`: Deploy capital to external protocol
   - `_freeFunds()`: Withdraw capital from protocol
   - `_harvestAndReport()`: Collect yield and report results

3. Create a factory contract for standardized deployment

4. Write comprehensive tests in `test/unit/` and `test/integration/`

## Integration with Big World Bigger Ideas

This repository can be integrated with the Big World Bigger Ideas blockchain utilities:

- Use `ERC721Fetcher` to track NFTs from Octant vaults
- Leverage `AddressTracker` for multi-chain address management
- Integrate with `ConsensusTracker` for monitoring protocol governance

## Useful Commands

```bash
# Format code
forge fmt

# Check for issues
forge check

# Generate documentation
forge doc

# Deploy to local testnet
anvil  # In one terminal
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast  # In another
```

## Resources

- **Repository**: https://github.com/golemfoundation/octant-v2-core
- **Golem Foundation**: https://golem.foundation/
- **Foundry Book**: https://book.getfoundry.sh/
- **ERC-4626**: https://eips.ethereum.org/EIPS/eip-4626
- **Safe (Gnosis)**: https://safe.global/

## Security Considerations

- Always audit strategies before deploying to mainnet
- Use testnet deployments for initial testing
- Review all external protocol integrations
- Implement proper access controls
- Monitor vault health with BaseHealthCheck
- Use multi-sig for privileged operations

## Troubleshooting

### Common Issues

**Soldeer Installation Fails**
```bash
# Ensure Foundry is up to date
foundryup
forge soldeer install
```

**Yarn Dependencies Issues**
```bash
# Clear cache and reinstall
yarn cache clean
rm -rf node_modules
yarn install
```

**RPC Connection Errors**
```bash
# Check .env configuration
# Ensure RPC_URL is correctly set
# Try alternative RPC endpoints
```

## Contributing

When contributing to Octant V2 Core:
1. Follow the existing code structure
2. Write comprehensive tests
3. Document new features
4. Run all checks before submitting PRs
5. Follow Solidity style guidelines

## License

Check the repository for specific license information.
