/**
 * Feature Flags Management Module
 * Provides functionality to manage feature flags for the application
 */

const fs = require('fs');
const path = require('path');

const FEATURE_FLAGS_FILE = path.join(__dirname, '..', 'feature-flags.json');

/**
 * Loads feature flags from the JSON file
 * @returns {object} Feature flags object
 */
function loadFlags() {
  try {
    if (fs.existsSync(FEATURE_FLAGS_FILE)) {
      const data = fs.readFileSync(FEATURE_FLAGS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading feature flags:', error.message);
  }
  return { flags: {}, lastUpdated: null };
}

/**
 * Saves feature flags to the JSON file
 * @param {object} flagsData - Feature flags data object
 */
function saveFlags(flagsData) {
  try {
    fs.writeFileSync(
      FEATURE_FLAGS_FILE,
      JSON.stringify(flagsData, null, 2),
      'utf8'
    );
  } catch (error) {
    console.error('Error saving feature flags:', error.message);
    throw error;
  }
}

/**
 * Sets a feature flag value
 * @param {string} flagName - Name of the feature flag
 * @param {boolean} value - Value to set (true/false)
 * @returns {object} Updated feature flags object
 */
function setFlag(flagName, value) {
  if (!flagName || typeof flagName !== 'string') {
    throw new Error('Flag name must be a non-empty string');
  }
  
  if (typeof value !== 'boolean') {
    throw new Error('Flag value must be a boolean');
  }
  
  const flagsData = loadFlags();
  flagsData.flags[flagName] = {
    enabled: value,
    updatedAt: new Date().toISOString()
  };
  flagsData.lastUpdated = new Date().toISOString();
  
  saveFlags(flagsData);
  return flagsData;
}

/**
 * Gets a feature flag value
 * @param {string} flagName - Name of the feature flag
 * @returns {boolean} Feature flag value (defaults to false if not found)
 */
function getFlag(flagName) {
  if (!flagName || typeof flagName !== 'string') {
    throw new Error('Flag name must be a non-empty string');
  }
  
  const flagsData = loadFlags();
  return flagsData.flags[flagName]?.enabled || false;
}

/**
 * Lists all feature flags
 * @returns {object} All feature flags with their values
 */
function listFlags() {
  const flagsData = loadFlags();
  return flagsData;
}

/**
 * Removes a feature flag
 * @param {string} flagName - Name of the feature flag to remove
 * @returns {object} Updated feature flags object
 */
function removeFlag(flagName) {
  if (!flagName || typeof flagName !== 'string') {
    throw new Error('Flag name must be a non-empty string');
  }
  
  const flagsData = loadFlags();
  if (flagsData.flags[flagName]) {
    delete flagsData.flags[flagName];
    flagsData.lastUpdated = new Date().toISOString();
    saveFlags(flagsData);
  }
  
  return flagsData;
}

/**
 * Checks if a feature flag exists
 * @param {string} flagName - Name of the feature flag
 * @returns {boolean} True if the flag exists
 */
function hasFlag(flagName) {
  if (!flagName || typeof flagName !== 'string') {
    throw new Error('Flag name must be a non-empty string');
  }
  
  const flagsData = loadFlags();
  return flagName in flagsData.flags;
}

module.exports = {
  setFlag,
  getFlag,
  listFlags,
  removeFlag,
  hasFlag
};
