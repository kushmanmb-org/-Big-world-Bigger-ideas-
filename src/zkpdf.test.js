/**
 * zkpdf.test.js - Tests for Zero-Knowledge PDF Verification Module
 * 
 * @author Matthew Brace (Kushmanmb)
 * @license ISC
 */

const ZKPDFVerifier = require('./zkpdf.js');

// Test utilities
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ ${message}`);
    passedTests++;
  } else {
    console.error(`✗ ${message}`);
    failedTests++;
  }
}

function assertEqual(actual, expected, message) {
  if (actual === expected) {
    console.log(`✓ ${message}`);
    passedTests++;
  } else {
    console.error(`✗ ${message}`);
    console.error(`  Expected: ${expected}`);
    console.error(`  Actual: ${actual}`);
    failedTests++;
  }
}

function assertNotNull(value, message) {
  if (value !== null && value !== undefined) {
    console.log(`✓ ${message}`);
    passedTests++;
  } else {
    console.error(`✗ ${message}`);
    failedTests++;
  }
}

console.log('🧪 Running zkpdf verification tests...\n');

// Test 1: Create verifier instance
console.log('Test 1: Create verifier instance');
const verifier = new ZKPDFVerifier('kushmanmb');
assert(verifier instanceof ZKPDFVerifier, 'Should create ZKPDFVerifier instance');
assertEqual(verifier.owner, 'kushmanmb', 'Owner should be kushmanmb');

// Test 2: Register a document
console.log('\nTest 2: Register a document');
const pdfContent = 'This is a sample PDF document content';
const result = verifier.registerDocument('doc-001', pdfContent, {
  title: 'Test Document',
  type: 'application/pdf'
});
assert(result.success, 'Document registration should succeed');
assertNotNull(result.hash, 'Document hash should be generated');
assertNotNull(result.documentId, 'Document ID should be returned');

// Test 3: Get document information
console.log('\nTest 3: Get document information');
const docInfo = verifier.getDocumentInfo('doc-001');
assert(docInfo.success, 'Should retrieve document info');
assertEqual(docInfo.id, 'doc-001', 'Document ID should match');
assertEqual(docInfo.metadata.title, 'Test Document', 'Document title should match');

// Test 4: Generate proof
console.log('\nTest 4: Generate zero-knowledge proof');
const proof = verifier.generateProof('doc-001', {
  customClaim: 'test-claim'
});
assert(proof.success, 'Proof generation should succeed');
assertNotNull(proof.proofId, 'Proof ID should be generated');
assertNotNull(proof.commitment, 'Commitment should be generated');

// Test 5: Verify proof
console.log('\nTest 5: Verify zero-knowledge proof');
const verification = verifier.verifyProof(proof.proofId);
assert(verification.success, 'Verification should succeed');
assert(verification.isValid, 'Proof should be valid');
assert(verification.commitmentValid, 'Commitment should be valid');
assert(verification.documentValid, 'Document should be valid');

// Test 6: Get proof information
console.log('\nTest 6: Get proof information');
const proofInfo = verifier.getProofInfo(proof.proofId);
assert(proofInfo.success, 'Should retrieve proof info');
assertEqual(proofInfo.proofId, proof.proofId, 'Proof ID should match');

// Test 7: Submit document for verification
console.log('\nTest 7: Submit document for verification');
const submission = verifier.submitForVerification('doc-001', {
  type: 'integrity-check',
  requester: 'test-user'
});
assert(submission.success, 'Submission should succeed');
assertNotNull(submission.submissionId, 'Submission ID should be generated');
assertEqual(submission.status, 'submitted', 'Status should be submitted');

// Test 8: List documents
console.log('\nTest 8: List all documents');
const docs = verifier.listDocuments();
assert(Array.isArray(docs), 'Should return an array of documents');
assert(docs.length > 0, 'Should have at least one document');

// Test 9: List proofs
console.log('\nTest 9: List all proofs');
const proofs = verifier.listProofs();
assert(Array.isArray(proofs), 'Should return an array of proofs');
assert(proofs.length > 0, 'Should have at least one proof');

// Test 10: Get statistics
console.log('\nTest 10: Get statistics');
const stats = verifier.getStatistics();
assertNotNull(stats.totalDocuments, 'Should have total documents count');
assertNotNull(stats.totalProofs, 'Should have total proofs count');
assertEqual(stats.owner, 'kushmanmb', 'Owner should be kushmanmb');

// Test 11: Register multiple documents
console.log('\nTest 11: Register multiple documents');
const result2 = verifier.registerDocument('doc-002', 'Another document', {
  title: 'Second Document'
});
assert(result2.success, 'Second document registration should succeed');
const statsAfter = verifier.getStatistics();
assert(statsAfter.totalDocuments === 2, 'Should have 2 documents registered');

// Test 12: Invalid document ID
console.log('\nTest 12: Handle invalid document ID');
try {
  verifier.registerDocument('', 'content');
  assert(false, 'Should throw error for empty document ID');
} catch (error) {
  assert(error.message.includes('Document ID'), 'Should throw error for invalid document ID');
}

// Test 13: Document not found
console.log('\nTest 13: Handle document not found');
try {
  verifier.getDocumentInfo('non-existent');
  assert(false, 'Should throw error for non-existent document');
} catch (error) {
  assert(error.message.includes('not found'), 'Should throw error for document not found');
}

// Test 14: Proof not found
console.log('\nTest 14: Handle proof not found');
try {
  verifier.verifyProof('non-existent-proof');
  assert(false, 'Should throw error for non-existent proof');
} catch (error) {
  assert(error.message.includes('not found'), 'Should throw error for proof not found');
}

// Test 15: Verify proof with expected hash
console.log('\nTest 15: Verify proof with expected hash');
const newProof = verifier.generateProof('doc-001');
const verifyWithHash = verifier.verifyProof(newProof.proofId, {
  expectedHash: docInfo.hash
});
assert(verifyWithHash.isValid, 'Proof should be valid with correct expected hash');
assert(verifyWithHash.dataMatches, 'Data should match expected hash');

// Test 16: Verify proof with wrong expected hash
console.log('\nTest 16: Verify proof with wrong expected hash');
const verifyWithWrongHash = verifier.verifyProof(newProof.proofId, {
  expectedHash: 'wrong-hash'
});
assert(!verifyWithWrongHash.isValid, 'Proof should be invalid with wrong expected hash');
assert(!verifyWithWrongHash.dataMatches, 'Data should not match wrong expected hash');

// Test 17: Format document info
console.log('\nTest 17: Format document information');
const formatted = verifier.formatDocumentInfo(docInfo);
assert(formatted.includes('doc-001'), 'Formatted output should include document ID');
assert(formatted.includes('Test Document'), 'Formatted output should include document title');

// Test 18: Format proof info
console.log('\nTest 18: Format proof information');
const formattedProof = verifier.formatProofInfo(proofInfo);
assert(formattedProof.includes('Zero-Knowledge Proof'), 'Formatted output should include title');
assert(formattedProof.includes(proofInfo.proofId), 'Formatted output should include proof ID');

// Test 19: Format verification result
console.log('\nTest 19: Format verification result');
const formattedVerification = verifier.formatVerificationResult(verification);
assert(formattedVerification.includes('VALID'), 'Formatted output should show validity status');
assert(formattedVerification.includes('✓'), 'Formatted output should include checkmarks');

// Test 20: Clear all data
console.log('\nTest 20: Clear all data');
verifier.clearAll();
const statsCleared = verifier.getStatistics();
assertEqual(statsCleared.totalDocuments, 0, 'Should have 0 documents after clear');
assertEqual(statsCleared.totalProofs, 0, 'Should have 0 proofs after clear');

// Test 21: Buffer input support
console.log('\nTest 21: Register document with Buffer input');
const bufferContent = Buffer.from('PDF content as buffer');
const bufferResult = verifier.registerDocument('doc-buffer', bufferContent);
assert(bufferResult.success, 'Should register document with Buffer input');

// Summary
console.log('\n' + '='.repeat(50));
console.log(`✅ Tests passed: ${passedTests}`);
console.log(`❌ Tests failed: ${failedTests}`);
console.log('='.repeat(50));

if (failedTests === 0) {
  console.log('\n🎉 All tests passed!');
  process.exit(0);
} else {
  console.log('\n❌ Some tests failed!');
  process.exit(1);
}
