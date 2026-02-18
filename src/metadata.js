/**
 * Package Metadata Module
 * Similar to Rust's `cargo metadata` command, this module provides
 * structured metadata about the current package and its dependencies.
 */

const fs = require('fs');
const path = require('path');

class PackageMetadata {
  constructor(rootPath = process.cwd()) {
    this.rootPath = rootPath;
    this.packageJsonPath = path.join(rootPath, 'package.json');
  }

  /**
   * Reads and parses the package.json file
   * @returns {object} Parsed package.json data
   * @throws {Error} If package.json doesn't exist or is invalid
   */
  readPackageJson() {
    if (!fs.existsSync(this.packageJsonPath)) {
      throw new Error(`package.json not found at ${this.packageJsonPath}`);
    }

    try {
      const content = fs.readFileSync(this.packageJsonPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to parse package.json: ${error.message}`);
    }
  }

  /**
   * Reads package-lock.json if it exists
   * @returns {object|null} Parsed package-lock.json data or null if not found
   */
  readPackageLock() {
    const lockPath = path.join(this.rootPath, 'package-lock.json');
    
    if (!fs.existsSync(lockPath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(lockPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.warn(`Warning: Failed to parse package-lock.json: ${error.message}`);
      return null;
    }
  }

  /**
   * Extracts dependency information
   * @param {object} packageData - Parsed package.json
   * @param {object|null} lockData - Parsed package-lock.json
   * @returns {Array} Array of dependency objects
   */
  extractDependencies(packageData, lockData) {
    const dependencies = [];
    
    // Process regular dependencies
    if (packageData.dependencies) {
      for (const [name, version] of Object.entries(packageData.dependencies)) {
        dependencies.push({
          name,
          version,
          type: 'dependency',
          resolved: this.getResolvedVersion(name, lockData)
        });
      }
    }

    // Process dev dependencies
    if (packageData.devDependencies) {
      for (const [name, version] of Object.entries(packageData.devDependencies)) {
        dependencies.push({
          name,
          version,
          type: 'devDependency',
          resolved: this.getResolvedVersion(name, lockData)
        });
      }
    }

    return dependencies;
  }

  /**
   * Gets the resolved version from package-lock.json
   * @param {string} name - Package name
   * @param {object|null} lockData - Parsed package-lock.json
   * @returns {string|null} Resolved version or null
   */
  getResolvedVersion(name, lockData) {
    if (!lockData || !lockData.packages) {
      return null;
    }

    // Look for the package in the lock file
    const packageKey = `node_modules/${name}`;
    if (lockData.packages[packageKey]) {
      return lockData.packages[packageKey].version;
    }

    return null;
  }

  /**
   * Retrieves complete package metadata
   * @returns {object} Complete metadata object
   */
  getMetadata() {
    const packageData = this.readPackageJson();
    const lockData = this.readPackageLock();
    const dependencies = this.extractDependencies(packageData, lockData);

    return {
      package: {
        name: packageData.name,
        version: packageData.version,
        description: packageData.description || '',
        license: packageData.license || 'UNLICENSED',
        author: packageData.author || '',
        homepage: packageData.homepage || '',
        repository: packageData.repository || {},
        main: packageData.main || '',
        type: packageData.type || 'commonjs',
        keywords: packageData.keywords || [],
        scripts: packageData.scripts || {}
      },
      dependencies,
      workspace_root: this.rootPath,
      target_directory: path.join(this.rootPath, 'node_modules'),
      metadata_version: '1.0.0'
    };
  }

  /**
   * Returns metadata as formatted JSON string
   * @param {number} indent - Number of spaces for indentation (default: 2)
   * @returns {string} Formatted JSON string
   */
  toJSON(indent = 2) {
    const metadata = this.getMetadata();
    return JSON.stringify(metadata, null, indent);
  }
}

// CLI interface when run directly
if (require.main === module) {
  try {
    const metadata = new PackageMetadata();
    console.log(metadata.toJSON());
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

module.exports = PackageMetadata;
