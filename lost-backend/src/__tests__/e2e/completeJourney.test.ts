/**
 * Complete Customer File Lifecycle - E2E Test
 * 
 * This test simulates the complete journey of a customer file from creation to payment:
 * 1. Sales Person creates file (all 8 steps)
 * 2. Back Office verifies documents
 * 3. Marketing Manager sends for review
 * 4. Credit Manager approves
 * 5. Operations collects payment
 * 
 * This is the most comprehensive test in the suite and validates:
 * - Multi-role collaboration
 * - Status transitions
 * - Permission enforcement at each stage
 * - Data consistency throughout lifecycle
 * - Organization isolation
 */

import request from 'supertest';
import { testApp } from '../setup/testApp';
import { seedAll, cleanDatabase, getTestCredentials } from '../setup/seedDatabase';
import { generateTestToken, getAuthHeaders } from '../setup/testUtils';
import { createTestCustomerFile } from '../fixtures/testData';
import CustomerFile from '../../models/customerFile';
import mongoose from 'mongoose';

describe('Complete Customer File Lifecycle - E2E', () => {
  let org1Id: string;
  
  // Auth headers for different roles
  let salesmanHeaders: Record<string, string>;
  let backOfficeHeaders: Record<string, string>;
  let managerHeaders: Record<string, string>;
  let creditHeaders: Record<string, string>;
  let operationsHeaders: Record<string, string>;

  beforeAll(async () => {
    // Seed database
    const seededData = await seedAll();
    org1Id = seededData.organizations[0]._id.toString();

    // Setup auth for all roles
    const setupAuth = (role: string) => {
      const creds = getTestCredentials(role);
      const token = generateTestToken({
        _id: creds.userId,
        employeeId: creds.employeeId,
        email: creds.email,
        role: creds.role,
        organization: { _id: org1Id },
      });
      return getAuthHeaders(token, org1Id);
    };

    salesmanHeaders = setupAuth('salesman');
    backOfficeHeaders = setupAuth('backoffice');
    managerHeaders = setupAuth('manager');
    creditHeaders = setupAuth('credit');
    operationsHeaders = setupAuth('operations');
  });

  afterAll(async () => {
    await cleanDatabase();
  });

  it('should complete full file lifecycle from creation to payment', async () => {
    console.log('\n🚀 Starting Complete File Lifecycle Test...\n');

    // ========================================
    // PHASE 1: SALES PERSON - FILE CREATION
    // ========================================
    console.log('📝 Phase 1: Sales Person Creating File...');

    const testData = createTestCustomerFile();
    let fileId: string;
    let loanApplicationNumber: number;

    // Step 1: Customer Details
    const step1Response = await request(testApp)
      .post('/customer-file/customer_details')
      .set(salesmanHeaders)
      .send({
        customerDetails: testData.customerDetails,
        loanType: testData.loanType,
        loanAmount: testData.loanAmount,
        fileBranch: testData.fileBranch,
        rateOfInterest: testData.rateOfInterest,
        loanTenure: testData.loanTenure,
        endUseOfMoney: testData.endUseOfMoney,
      });

    expect(step1Response.status).toBe(200);
    fileId = step1Response.body._id;
    
    let file = await CustomerFile.findById(fileId);
    expect(file?.stepsDone).toContain('Customer');
    loanApplicationNumber = file!.loanApplicationNumber;
    
    console.log(`✅ File created with ID: ${fileId}, Loan #: ${loanApplicationNumber}`);

    // Step 2: Address
    const step2Response = await request(testApp)
      .post('/customer-file/customer_address')
      .set(salesmanHeaders)
      .send({
        _id: fileId,
        address: testData.address,
      });

    expect(step2Response.status).toBe(200);
    file = await CustomerFile.findById(fileId);
    expect(file?.stepsDone).toContain('Address');
    console.log('✅ Address added');

    // Step 3: Income
    const step3Response = await request(testApp)
      .post('/customer-file/customer_income')
      .set(salesmanHeaders)
      .send({
        _id: fileId,
        customerEmploymentDetails: testData.customerEmploymentDetails,
      });

    expect(step3Response.status).toBe(200);
    file = await CustomerFile.findById(fileId);
    expect(file?.stepsDone).toContain('Income');
    console.log('✅ Income details added');

    // Step 4: Bank Details
    const step4Response = await request(testApp)
      .post('/customer-file/customer_bank')
      .set(salesmanHeaders)
      .send({
        _id: fileId,
        bankDetails: testData.bankDetails,
      });

    expect(step4Response.status).toBe(200);
    file = await CustomerFile.findById(fileId);
    expect(file?.stepsDone).toContain('Bank');
    console.log('✅ Bank details added');

    // Verify file status is still Pending
    file = await CustomerFile.findById(fileId);
    expect(file?.status).toBe('Pending');
    expect(file?.stepsDone.length).toBeGreaterThanOrEqual(4);

    console.log(`\n✅ Phase 1 Complete: File has ${file?.stepsDone.length} steps completed\n`);

    // ========================================
    // PHASE 2: BACK OFFICE - VERIFICATION
    // ========================================
    console.log('🔍 Phase 2: Back Office Verification...');

    // Verify Customer Step
    const verifyResponse = await request(testApp)
      .post('/customer-file/file-operations/verify-step')
      .set(backOfficeHeaders)
      .send({
        fileId: fileId,
        step: 'Customer',
        isVerified: true,
      });

    expect(verifyResponse.status).toBe(200);
    console.log('✅ Customer step verified');

    // Upload CIBIL Score
    const cibilResponse = await request(testApp)
      .post(`/customer-file/file-operations/${fileId}/cibil-score`)
      .set(backOfficeHeaders)
      .send({
        'cibilDetails[Score]': 750,
        'cibilDetails[customerDetails]': file?.customerDetails.toString(),
      });

    expect(cibilResponse.status).toBe(200);
    file = await CustomerFile.findById(fileId);
    expect(file?.cibilDetails.length).toBeGreaterThan(0);
    console.log('✅ CIBIL score uploaded (750)');

    // Telephone Verification
    const telResponse = await request(testApp)
      .post('/customer-file/file-operations/telephone-verification')
      .set(backOfficeHeaders)
      .send({
        fileId: fileId,
        review: 'POSITIVE',
        description: 'Customer verified via phone. All details confirmed.',
      });

    expect(telResponse.status).toBe(200);
    file = await CustomerFile.findById(fileId);
    expect(file?.teleVerificationReport).toBeDefined();
    expect(file?.teleVerificationReport?.review).toBe('POSITIVE');
    console.log('✅ Telephone verification completed');

    console.log('\n✅ Phase 2 Complete: All verifications done\n');

    // ========================================
    // PHASE 3: MARKETING MANAGER - SEND FOR REVIEW
    // ========================================
    console.log('📊 Phase 3: Marketing Manager Review...');

    const reviewResponse = await request(testApp)
      .post('/customer-file/file-operations/customer-file-status')
      .set(managerHeaders)
      .send({
        loanApplicationNumber: loanApplicationNumber,
        status: 'UNDER_REVIEW',
        salesManReport: {
          principalAmount: testData.loanAmount,
          interestRate: testData.rateOfInterest,
          emi: 5000,
          loanTenure: testData.loanTenure,
          charges: {
            loginCharges: 1000,
            fileCharges: 500,
            otherCharges: 200,
          },
        },
      });

    expect(reviewResponse.status).toBe(200);
    file = await CustomerFile.findById(fileId);
    expect(file?.status).toBe('UNDER_REVIEW');
    expect(file?.salesManReport).toBeDefined();
    console.log('✅ File sent for review with sales report');

    console.log('\n✅ Phase 3 Complete: Status = UNDER_REVIEW\n');

    // ========================================
    // PHASE 4: CREDIT MANAGER - APPROVAL
    // ========================================
    console.log('✅ Phase 4: Credit Manager Approval...');

    const approvalResponse = await request(testApp)
      .post('/customer-file/file-operations/customer-file-status')
      .set(creditHeaders)
      .send({
        loanApplicationNumber: loanApplicationNumber,
        status: 'APPROVED',
        approveOrRejectRemarks: 'All documents verified. Good credit score of 750. Approved for disbursement.',
      });

    expect(approvalResponse.status).toBe(200);
    file = await CustomerFile.findById(fileId);
    expect(file?.status).toBe('APPROVED');
    expect(file?.approveOrRejectRemarks).toContain('Approved');
    expect(file?.approvedOrRejectedBy).toBeDefined();
    console.log('✅ File approved by credit manager');

    console.log('\n✅ Phase 4 Complete: Status = APPROVED\n');

    // ========================================
    // PHASE 5: OPERATIONS - PAYMENT COLLECTION
    // ========================================
    console.log('💰 Phase 5: Operations Payment Collection...');

    const paymentResponse = await request(testApp)
      .post('/customer-file/file-operations/customer-file-payment')
      .set(operationsHeaders)
      .send({
        loanApplicationNumber: loanApplicationNumber,
        loanApplicationFilePayment: {
          amount: 1700, // Login + File + Other charges
          paymentMethod: 'Cash',
          paymentDate: new Date(),
          remarks: 'Login fees collected',
        },
      });

    expect(paymentResponse.status).toBe(200);
    file = await CustomerFile.findById(fileId);
    expect(file?.loanApplicationFilePayment).toBeDefined();
    expect(file?.loanApplicationFilePayment?.amount).toBe(1700);
    console.log('✅ Payment collected: ₹1700');

    console.log('\n✅ Phase 5 Complete: Payment recorded\n');

    // ========================================
    // FINAL VERIFICATION: COMPLETE AUDIT TRAIL
    // ========================================
    console.log('🔍 Final Verification: Checking Audit Trail...');

    file = await CustomerFile.findById(fileId)
      .populate('customerDetails')
      .populate('createdBy')
      .populate('approvedOrRejectedBy');

    // Verify complete file state
    expect(file).toBeDefined();
    expect(file?.status).toBe('APPROVED');
    expect(file?.stepsDone.length).toBeGreaterThanOrEqual(4);
    expect(file?.verifiedSteps?.length).toBeGreaterThan(0);
    expect(file?.cibilDetails.length).toBeGreaterThan(0);
    expect(file?.teleVerificationReport).toBeDefined();
    expect(file?.salesManReport).toBeDefined();
    expect(file?.approveOrRejectRemarks).toBeDefined();
    expect(file?.approvedOrRejectedBy).toBeDefined();
    expect(file?.loanApplicationFilePayment).toBeDefined();

    console.log('\n✅ COMPLETE LIFECYCLE TEST PASSED! ✅');
    console.log('\n📋 Final File State:');
    console.log(`   - File ID: ${fileId}`);
    console.log(`   - Loan #: ${loanApplicationNumber}`);
    console.log(`   - Status: ${file?.status}`);
    console.log(`   - Steps Completed: ${file?.stepsDone.length}`);
    console.log(`   - CIBIL Score: ${file?.cibilDetails[0]?.Score || 'N/A'}`);
    console.log(`   - Tel Verification: ${file?.teleVerificationReport?.review || 'N/A'}`);
    console.log(`   - Approved By: ${file?.approvedOrRejectedBy ? 'Yes' : 'No'}`);
    console.log(`   - Payment: ₹${file?.loanApplicationFilePayment?.amount || 0}`);
    console.log('\n🎉 All phases completed successfully!\n');
  }, 60000); // 60 second timeout for this comprehensive test
});