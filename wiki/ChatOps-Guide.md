# ChatOps Guide

Manage feature flags directly from GitHub issues and pull requests using ChatOps commands.

## 🤖 Overview

ChatOps integration allows you to control feature flags without touching code. Simply comment on issues or PRs with special commands, and the GitHub Actions workflow will automatically update your feature flags.

## 🚀 Available Commands

### Enable a Feature Flag

Enable a feature by setting its flag to `true`:

```
/chatops run feature set <flag_name>
```

**Example:**
```
/chatops run feature set dark_mode
```

This enables the `dark_mode` feature flag.

### Disable a Feature Flag

Disable a feature by setting its flag to `false`:

```
/chatops run feature unset <flag_name>
```

**Example:**
```
/chatops run feature unset experimental_ui
```

This disables the `experimental_ui` feature flag.

### List All Feature Flags

View all current feature flags and their states:

```
/chatops run feature list
```

This returns a formatted list of all flags with their enabled/disabled status and last update time.

## 📝 Feature Flag Naming

Follow these conventions for feature flag names:

✅ **Valid Names:**
- Use lowercase letters, numbers, underscores, and hyphens
- Be descriptive: `dark_mode` instead of `dm`
- Separate words with underscores: `new_checkout_flow`
- Examples: `beta_ui`, `analytics_v2`, `experimental-feature`

❌ **Invalid Names:**
- No spaces: ~~`dark mode`~~
- No special characters: ~~`feature@new`~~
- No uppercase: ~~`DarkMode`~~

## 🔧 How It Works

When you post a ChatOps command:

1. **GitHub Actions workflow triggers** (`.github/workflows/chatops.yml`)
2. **Command is parsed** and validated
3. **Feature flag file is updated** (`feature-flags.json`)
4. **Changes are committed** to the repository
5. **Result is posted** as a comment on your issue/PR

## 📂 Feature Flags Storage

Flags are stored in `feature-flags.json` at the repository root:

```json
{
  "flags": {
    "dark_mode": {
      "enabled": true,
      "updatedAt": "2026-02-23T12:00:00.000Z"
    },
    "new_ui": {
      "enabled": false,
      "updatedAt": "2026-02-23T12:00:00.000Z"
    }
  },
  "lastUpdated": "2026-02-23T12:00:00.000Z"
}
```

## 💻 Using Feature Flags in Code

### JavaScript/Node.js

```javascript
const featureFlags = require('big-world-bigger-ideas').featureFlags;

// Check if feature is enabled
if (featureFlags.getFlag('dark_mode')) {
  applyDarkMode();
}

// Set programmatically
featureFlags.setFlag('beta_feature', true);

// List all flags
const allFlags = featureFlags.listFlags();

// Remove a flag
featureFlags.removeFlag('deprecated_feature');
```

### In Web Applications

```javascript
// Load feature flags
fetch('/feature-flags.json')
  .then(res => res.json())
  .then(data => {
    if (data.flags.dark_mode?.enabled) {
      document.body.classList.add('dark-theme');
    }
  });
```

## 🎯 Use Cases

### Use Case 1: Dark Mode Toggle

**Enable dark mode:**
```
/chatops run feature set dark_mode
```

**In your code:**
```javascript
if (featureFlags.getFlag('dark_mode')) {
  document.body.classList.add('dark-theme');
}
```

### Use Case 2: Beta Program

**Enable beta features:**
```
/chatops run feature set beta_program
```

**In your code:**
```javascript
if (featureFlags.getFlag('beta_program')) {
  showBetaFeatures();
  enableAdvancedAnalytics();
}
```

### Use Case 3: Gradual Rollout

**Enable new feature:**
```
/chatops run feature set new_checkout_v2
```

**Monitor for issues, then if needed:**
```
/chatops run feature unset new_checkout_v2
```

### Use Case 4: A/B Testing

```javascript
// Route users to different experiences
if (featureFlags.getFlag('experiment_variant_a')) {
  showVariantA();
} else {
  showVariantB();
}
```

## 🔐 Permissions

To use ChatOps commands, you need:
- **Write access** to the repository
- Repository must have the ChatOps workflow enabled

The workflow requires these GitHub permissions:
- `contents: write` - To commit feature flag changes
- `issues: write` - To post comments on issues
- `pull-requests: write` - To post comments on PRs

## 🧪 Testing

Test the feature flags module:

```bash
npm run test:feature-flags
```

Run the demo:

```bash
npm run feature-flags:demo
```

## ⚠️ Troubleshooting

### Command Not Working

**Problem:** ChatOps command doesn't execute

**Solutions:**
1. Verify you have write access to the repository
2. Check command syntax (case-sensitive)
3. Review GitHub Actions logs in the Actions tab
4. Ensure the workflow file exists: `.github/workflows/chatops.yml`

### Changes Not Applied

**Problem:** Feature flag doesn't update

**Solutions:**
1. Check workflow run logs for errors
2. Verify `feature-flags.json` exists in repository root
3. Ensure workflow has proper permissions
4. Check for JSON syntax errors in `feature-flags.json`

### Comment Not Posted

**Problem:** No response comment appears

**Solutions:**
1. Check Actions logs for API errors
2. Verify workflow has `issues: write` permission
3. Ensure bot has access to repository

## 📊 Workflow Details

The ChatOps workflow (`.github/workflows/chatops.yml`) includes:

```yaml
name: ChatOps Feature Flags
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

permissions:
  contents: write
  issues: write
  pull-requests: write

jobs:
  chatops:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js
      - Install dependencies
      - Parse and execute command
      - Commit changes
      - Post result comment
```

## 💡 Best Practices

1. **Use Descriptive Names**: Make flag names self-explanatory
2. **Document Flags**: Comment in code what each flag controls
3. **Clean Up**: Remove deprecated flags when features are fully rolled out
4. **Test First**: Enable flags in staging before production
5. **Monitor**: Watch for issues after enabling flags
6. **Communicate**: Notify team when enabling/disabling important flags

## 📚 API Reference

See [Feature Flags Module](Feature-Flags-Module) for complete API documentation.

## 🔗 Related

- [Feature Flags Module](Feature-Flags-Module) - Module documentation
- [GitHub Actions](GitHub-Actions) - CI/CD workflows
- [Testing Guide](Testing-Guide) - Testing best practices

---

**Next**: [Feature Flags Module](Feature-Flags-Module)
