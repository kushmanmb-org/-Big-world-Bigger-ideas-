/**
 * zkpdf-example.js - Example usage of Zero-Knowledge PDF Verification Module
 * 
 * @author Matthew Brace (Kushmanmb)
 * @license ISC
 */

const ZKPDFVerifier = require('./zkpdf.js');

async function main() {
  console.log('🔐 Zero-Knowledge PDF Verification Demo\n');
  console.log('='.repeat(60));

  // Create a verifier instance
  console.log('\n📋 Step 1: Initialize ZK-PDF Verifier');
  const verifier = new ZKPDFVerifier('kushmanmb');
  console.log('✓ Verifier created for owner: kushmanmb');

  // Register a document
  console.log('\n📄 Step 2: Register a PDF Document');
  const pdfContent = `
This is a sample PDF document that contains important information.
In a real-world scenario, this would be the binary content of a PDF file.
The zero-knowledge proof system allows verification without revealing content.
`;
  
  const docResult = verifier.registerDocument(
    'contract-2024-001',
    pdfContent,
    {
      title: 'Service Agreement Contract',
      type: 'application/pdf',
      category: 'legal',
      date: '2024-02-21'
    }
  );

  console.log('✓ Document registered successfully');
  console.log(`  Document ID: ${docResult.documentId}`);
  console.log(`  Hash: ${docResult.hash.substring(0, 16)}...`);
  console.log(`  Size: ${docResult.size} bytes`);

  // Get document information
  console.log('\n📊 Step 3: Retrieve Document Information');
  const docInfo = verifier.getDocumentInfo('contract-2024-001');
  console.log(verifier.formatDocumentInfo(docInfo));

  // Generate a zero-knowledge proof
  console.log('🔑 Step 4: Generate Zero-Knowledge Proof');
  const proof = verifier.generateProof('contract-2024-001', {
    purpose: 'contract-verification',
    timestamp: new Date().toISOString(),
    authorized: true
  });

  console.log('✓ Proof generated successfully');
  console.log(`  Proof ID: ${proof.proofId}`);
  console.log(`  Commitment: ${proof.commitment.substring(0, 32)}...`);
  console.log('  Claims:');
  Object.entries(proof.claims).forEach(([key, value]) => {
    console.log(`    - ${key}: ${value}`);
  });

  // Verify the proof
  console.log('\n✅ Step 5: Verify Zero-Knowledge Proof');
  const verification = verifier.verifyProof(proof.proofId);
  console.log(verifier.formatVerificationResult(verification));

  // Submit document for verification
  console.log('📤 Step 6: Submit Document for Verification');
  const submission = verifier.submitForVerification('contract-2024-001', {
    type: 'integrity-check',
    requester: 'legal-department',
    purpose: 'audit-compliance',
    deadline: '2024-03-01'
  });

  console.log('✓ Document submitted for verification');
  console.log(`  Submission ID: ${submission.submissionId}`);
  console.log(`  Status: ${submission.status}`);
  console.log(`  Submitted At: ${submission.submittedAt}`);
  console.log(`  Associated Proof ID: ${submission.proofId}`);

  // Register another document
  console.log('\n📄 Step 7: Register Additional Documents');
  const doc2 = verifier.registerDocument(
    'invoice-2024-015',
    'Invoice content for February 2024 services',
    {
      title: 'Monthly Service Invoice',
      type: 'application/pdf',
      category: 'financial'
    }
  );
  console.log(`✓ Registered: ${doc2.documentId}`);

  const doc3 = verifier.registerDocument(
    'report-q1-2024',
    'Quarterly report with blockchain metrics and analysis',
    {
      title: 'Q1 2024 Blockchain Report',
      type: 'application/pdf',
      category: 'analytics'
    }
  );
  console.log(`✓ Registered: ${doc3.documentId}`);

  // List all documents
  console.log('\n📚 Step 8: List All Registered Documents');
  const allDocs = verifier.listDocuments();
  console.log(`\nTotal documents registered: ${allDocs.length}`);
  allDocs.forEach((doc, index) => {
    console.log(`\n${index + 1}. ${doc.metadata.title}`);
    console.log(`   ID: ${doc.id}`);
    console.log(`   Hash: ${doc.hash.substring(0, 32)}...`);
    console.log(`   Size: ${doc.size} bytes`);
    console.log(`   Category: ${doc.metadata.category || 'uncategorized'}`);
  });

  // Generate proofs for all documents
  console.log('\n🔑 Step 9: Generate Proofs for All Documents');
  allDocs.forEach(doc => {
    const p = verifier.generateProof(doc.id, {
      batchVerification: true,
      timestamp: new Date().toISOString()
    });
    console.log(`✓ Proof generated for ${doc.id}: ${p.proofId}`);
  });

  // List all proofs
  console.log('\n📜 Step 10: List All Generated Proofs');
  const allProofs = verifier.listProofs();
  console.log(`\nTotal proofs generated: ${allProofs.length}`);
  allProofs.forEach((proof, index) => {
    console.log(`\n${index + 1}. Proof ${proof.proofId}`);
    console.log(`   Document: ${proof.documentId}`);
    console.log(`   Commitment: ${proof.commitment.substring(0, 32)}...`);
    console.log(`   Created: ${proof.createdAt}`);
  });

  // Get statistics
  console.log('\n📊 Step 11: View Verifier Statistics');
  const stats = verifier.getStatistics();
  console.log('\nVerifier Statistics:');
  console.log('='.repeat(60));
  console.log(`Total Documents: ${stats.totalDocuments}`);
  console.log(`Total Proofs: ${stats.totalProofs}`);
  console.log(`Owner: ${stats.owner}`);
  console.log(`Cache Size: ${stats.cacheSize}`);

  // Demonstrate verification with expected hash
  console.log('\n🔍 Step 12: Advanced Verification with Hash Matching');
  const advancedProof = verifier.generateProof('contract-2024-001');
  const advancedVerification = verifier.verifyProof(advancedProof.proofId, {
    expectedHash: docInfo.hash
  });
  console.log(`✓ Verification with hash matching: ${advancedVerification.isValid ? 'VALID' : 'INVALID'}`);
  console.log(`  Commitment Valid: ${advancedVerification.commitmentValid ? '✓' : '✗'}`);
  console.log(`  Document Valid: ${advancedVerification.documentValid ? '✓' : '✗'}`);
  console.log(`  Hash Matches: ${advancedVerification.dataMatches ? '✓' : '✗'}`);

  // Use case example
  console.log('\n💡 Step 13: Real-World Use Case Example');
  console.log('\nScenario: Legal Contract Verification');
  console.log('-'.repeat(60));
  console.log('A company needs to prove they have a signed contract');
  console.log('without revealing the contract details to a third party.\n');
  
  const contractDoc = verifier.registerDocument(
    'confidential-contract-2024',
    'Confidential business agreement with proprietary terms',
    {
      title: 'Confidential Business Agreement',
      type: 'application/pdf',
      confidential: true,
      parties: ['Company A', 'Company B']
    }
  );
  console.log('✓ Contract registered with hash:', contractDoc.hash.substring(0, 32) + '...');

  const contractProof = verifier.generateProof('confidential-contract-2024', {
    contractSigned: true,
    signatureValid: true,
    dateVerified: true,
    partiesVerified: true
  });
  console.log('✓ Zero-knowledge proof generated');
  console.log('  The proof demonstrates contract existence and validity');
  console.log('  without revealing any confidential contract terms.');

  const contractVerification = verifier.verifyProof(contractProof.proofId);
  console.log(`✓ Third-party verification result: ${contractVerification.isValid ? 'VALID' : 'INVALID'}`);
  console.log('  Third party can now trust the claims without seeing the document!');

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Demo Complete!');
  console.log('='.repeat(60));
  console.log('\nKey Features Demonstrated:');
  console.log('✓ Document registration with metadata');
  console.log('✓ Zero-knowledge proof generation');
  console.log('✓ Proof verification');
  console.log('✓ Document submission workflow');
  console.log('✓ Multi-document management');
  console.log('✓ Statistics and reporting');
  console.log('✓ Real-world use case (confidential contracts)');
  console.log('\nFor more information, see src/ZKPDF.md');
}

// Run the demo
main().catch(error => {
  console.error('Error running demo:', error);
  process.exit(1);
});
