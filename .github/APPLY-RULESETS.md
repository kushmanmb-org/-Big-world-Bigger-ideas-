# How to Apply Branch Protection Rulesets

This guide explains how to apply the branch protection rulesets to your GitHub repository.

## Important Note

The ruleset JSON files in `.github/rulesets/` are **configuration templates** that need to be applied to your repository through GitHub's web interface or API. They are **not automatically applied** just by having them in the repository.

## Option 1: Apply via GitHub Web Interface (Recommended)

### Step 1: Navigate to Repository Settings
1. Go to your repository on GitHub
2. Click **Settings** (top navigation)
3. In the left sidebar, click **Rules** → **Rulesets**

### Step 2: Create Main Branch Protection Ruleset
1. Click **New ruleset** → **New branch ruleset**
2. Configure the ruleset with these settings from `branch-protection.json`:

   **Basic Settings:**
   - Name: `Main Branch Protection`
   - Enforcement status: `Active`
   
   **Target branches:**
   - Include by pattern: `main` and `master`
   
   **Branch protections:**
   - ✅ Require a pull request before merging
     - Required approvals: `1`
     - ✅ Dismiss stale pull request approvals when new commits are pushed
     - ✅ Require review from Code Owners (optional)
     - ✅ Require approval of the most recent reviewable push (optional)
     - ✅ Require conversation resolution before merging
   
   - ✅ Require status checks to pass
     - ✅ Require branches to be up to date before merging
   
   - ✅ Block force pushes
   - ✅ Require linear history
   - ✅ Require signed commits
   - ✅ Restrict deletions
   
   **Bypass list:**
   - Repository administrators (if needed)

3. Click **Create** to save the ruleset

### Step 3: Create Release Branch Protection Ruleset
1. Click **New ruleset** → **New branch ruleset**
2. Configure with settings from `release-protection.json`:

   **Basic Settings:**
   - Name: `Release Branch Protection`
   - Enforcement status: `Active`
   
   **Target branches:**
   - Include by pattern: `release/**` and `hotfix/**`
   
   **Branch protections:**
   - ✅ Require a pull request before merging
     - Required approvals: `2`
     - ✅ Dismiss stale pull request approvals when new commits are pushed
     - ✅ Require approval of the most recent reviewable push
     - ✅ Require conversation resolution before merging
   
   - ✅ Block force pushes
   - ✅ Require linear history
   - ✅ Restrict deletions

3. Click **Create** to save the ruleset

## Option 2: Apply via GitHub CLI

### Prerequisites
```bash
# Install GitHub CLI if not already installed
# macOS: brew install gh
# Windows: winget install --id GitHub.cli
# Linux: See https://github.com/cli/cli/blob/trunk/docs/install_linux.md

# Authenticate with GitHub
gh auth login
```

### Apply Rulesets
```bash
# Note: As of now, GitHub CLI doesn't have direct commands for rulesets
# You need to use the API through gh cli

# Apply main branch protection
gh api repos/Kushmanmb/-Big-world-Bigger-ideas-/rulesets \
  --method POST \
  --input .github/rulesets/branch-protection.json

# Apply release branch protection
gh api repos/Kushmanmb/-Big-world-Bigger-ideas-/rulesets \
  --method POST \
  --input .github/rulesets/release-protection.json
```

## Option 3: Apply via GitHub REST API

### Using curl
```bash
# Set your GitHub token
export GITHUB_TOKEN="your_personal_access_token_here"

# Apply main branch protection
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/Kushmanmb/-Big-world-Bigger-ideas-/rulesets \
  -d @.github/rulesets/branch-protection.json

# Apply release branch protection
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/Kushmanmb/-Big-world-Bigger-ideas-/rulesets \
  -d @.github/rulesets/release-protection.json
```

### Required Token Permissions
Your personal access token needs these permissions:
- `repo` (Full control of private repositories)
- `admin:repo_hook` (Full control of repository hooks)

## Verify the Rulesets

After applying the rulesets:

1. **Via Web Interface:**
   - Go to **Settings** → **Rules** → **Rulesets**
   - You should see your rulesets listed

2. **Via GitHub CLI:**
   ```bash
   gh api repos/Kushmanmb/-Big-world-Bigger-ideas-/rulesets
   ```

3. **Test Protection:**
   - Try to push directly to main branch (should be blocked)
   - Try to create a PR without approval (should require review)

## Customizing the Rulesets

You can customize the rulesets by:

1. **Editing the JSON files** in `.github/rulesets/` 
2. **Adjusting settings** such as:
   - Number of required approvals
   - Which branches are protected
   - Whether to require status checks
   - Whether to require signed commits
   - Bypass permissions

3. **Re-applying** the rulesets through GitHub interface or API

## Troubleshooting

### Common Issues

**Issue: "Resource not accessible by integration"**
- Solution: Make sure you have admin access to the repository

**Issue: "Invalid ruleset configuration"**
- Solution: Verify the JSON files are valid and match GitHub's schema

**Issue: "Token doesn't have required permissions"**
- Solution: Create a new personal access token with `repo` and `admin:repo_hook` permissions

### Getting Help

For more information:
- [GitHub Rulesets Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [GitHub REST API - Rulesets](https://docs.github.com/en/rest/repos/rules)

## Next Steps

After applying the rulesets:

1. ✅ Test branch protection by trying to push to main
2. ✅ Create a test PR to verify review requirements
3. ✅ Review the enhanced `.gitignore` to ensure it meets your needs
4. ✅ Read `.github/SECURITY.md` for security best practices
5. ✅ Consider setting up automated secret scanning tools

---

**Note:** Remember to never commit sensitive data like API keys, private keys, or credentials to the repository, even before these protections are in place!
