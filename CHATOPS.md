# ChatOps Feature Flags

This repository includes a ChatOps command system for managing feature flags directly from GitHub issues and pull requests.

## Overview

Feature flags allow you to enable or disable features in your application without deploying new code. This is useful for:
- Gradual feature rollouts
- A/B testing
- Emergency feature toggles
- Development and staging environments

## ChatOps Commands

You can manage feature flags using ChatOps commands in GitHub issues or pull requests by commenting with special commands:

### Enable a Feature Flag

```
/chatops run feature set <flag_name>
```

**Example:**
```
/chatops run feature set dark_mode
```

This will enable the `dark_mode` feature flag.

### Disable a Feature Flag

```
/chatops run feature unset <flag_name>
```

**Example:**
```
/chatops run feature unset experimental_ui
```

This will disable the `experimental_ui` feature flag.

### List All Feature Flags

```
/chatops run feature list
```

This will display all current feature flags and their states.

## Feature Flag Naming Conventions

- Use lowercase letters, numbers, underscores, and hyphens
- Be descriptive: `dark_mode` instead of `dm`
- Use underscores to separate words: `new_checkout_flow`
- Valid examples: `feature_x`, `beta-ui`, `analytics_v2`

## Using Feature Flags in Code

### JavaScript/Node.js

```javascript
const featureFlags = require('./src/feature-flags');

// Check if a feature is enabled
if (featureFlags.getFlag('dark_mode')) {
  // Apply dark mode styling
  applyDarkMode();
}

// Set a feature flag programmatically
featureFlags.setFlag('beta_feature', true);

// List all flags
const allFlags = featureFlags.listFlags();
console.log(allFlags);

// Check if flag exists
if (featureFlags.hasFlag('new_ui')) {
  // Feature flag is defined
}

// Remove a feature flag
featureFlags.removeFlag('deprecated_feature');
```

## Feature Flags Storage

Feature flags are stored in `feature-flags.json` in the repository root:

```json
{
  "flags": {
    "dark_mode": {
      "enabled": true,
      "updatedAt": "2026-02-18T12:00:00.000Z"
    },
    "new_ui": {
      "enabled": false,
      "updatedAt": "2026-02-18T12:00:00.000Z"
    }
  },
  "lastUpdated": "2026-02-18T12:00:00.000Z"
}
```

## GitHub Actions Workflow

The ChatOps functionality is powered by a GitHub Actions workflow (`.github/workflows/chatops.yml`) that:

1. Listens for issue/PR comments
2. Parses ChatOps commands
3. Executes feature flag operations
4. Commits changes back to the repository
5. Posts results as comments

## Testing

Run the feature flags test suite:

```bash
npm run test:feature-flags
```

Or test all modules:

```bash
npm test
```

## Demo

See feature flags in action:

```bash
npm run feature-flags:demo
```

## API Reference

### `setFlag(flagName, value)`
- **Parameters:**
  - `flagName` (string): Name of the feature flag
  - `value` (boolean): Enable (true) or disable (false)
- **Returns:** Updated feature flags object
- **Throws:** Error if invalid parameters

### `getFlag(flagName)`
- **Parameters:**
  - `flagName` (string): Name of the feature flag
- **Returns:** Boolean value (defaults to false if flag doesn't exist)

### `listFlags()`
- **Returns:** Object containing all feature flags and metadata

### `removeFlag(flagName)`
- **Parameters:**
  - `flagName` (string): Name of the feature flag to remove
- **Returns:** Updated feature flags object

### `hasFlag(flagName)`
- **Parameters:**
  - `flagName` (string): Name of the feature flag
- **Returns:** Boolean indicating if the flag exists

## Permissions

The ChatOps workflow requires the following GitHub permissions:
- `contents: write` - To commit feature flag changes
- `issues: write` - To post comments on issues
- `pull-requests: write` - To post comments on pull requests

## Security Considerations

- Only repository collaborators with write access can execute ChatOps commands
- Feature flag changes are committed with the `github-actions[bot]` account
- All changes are tracked in git history
- Invalid commands are rejected with helpful error messages

## Troubleshooting

### Command not working
- Ensure you have write access to the repository
- Check that the command syntax is correct
- Look at the GitHub Actions logs for errors

### Changes not committed
- Check the workflow run logs in the Actions tab
- Ensure the workflow has proper permissions
- Verify `feature-flags.json` exists in the repository

## Examples

### Use Case 1: Dark Mode Toggle
```
/chatops run feature set dark_mode
```

In your code:
```javascript
if (featureFlags.getFlag('dark_mode')) {
  document.body.classList.add('dark-theme');
}
```

### Use Case 2: Beta Features
```
/chatops run feature set beta_program
```

In your code:
```javascript
if (featureFlags.getFlag('beta_program')) {
  showBetaFeatures();
}
```

### Use Case 3: Gradual Rollout
```
/chatops run feature set new_checkout_v2
```

Then monitor, and if issues arise:
```
/chatops run feature unset new_checkout_v2
```

## Contributing

When adding new features, consider adding corresponding feature flags to allow easy enable/disable without code changes.

## License

ISC
