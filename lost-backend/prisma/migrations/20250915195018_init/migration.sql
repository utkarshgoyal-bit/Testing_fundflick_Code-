-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('BORROWER', 'ADMIN', 'LOAN_OFFICER', 'MANAGER');

-- CreateEnum
CREATE TYPE "public"."LoanType" AS ENUM ('PERSONAL_LOAN', 'HOME_LOAN', 'CAR_LOAN', 'BUSINESS_LOAN', 'EDUCATION_LOAN', 'GOLD_LOAN', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."LoanStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'DISBURSED', 'ACTIVE', 'COMPLETED', 'DEFAULTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."EMIStatus" AS ENUM ('PENDING', 'PAID', 'PARTIAL_PAID', 'OVERDUE', 'DEFAULTED');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CASH', 'CHEQUE', 'BANK_TRANSFER', 'UPI', 'NEFT', 'RTGS', 'ONLINE', 'AUTO_DEBIT');

-- CreateEnum
CREATE TYPE "public"."PaymentType" AS ENUM ('EMI_PAYMENT', 'PRINCIPAL_PREPAYMENT', 'PROCESSING_FEE', 'PENALTY_PAYMENT', 'BULK_PAYMENT', 'ADVANCE_PAYMENT', 'EXCESS_ADJUSTMENT', 'REVERSAL', 'CLOSURE_PAYMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'REVERSED', 'VERIFIED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phoneNumber" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pinCode" TEXT,
    "panNumber" TEXT,
    "aadharNumber" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "occupation" TEXT,
    "monthlyIncome" DECIMAL(12,2),
    "cibilScore" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userType" "public"."UserType" NOT NULL DEFAULT 'BORROWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."loans" (
    "id" INTEGER NOT NULL,
    "loanNumber" TEXT NOT NULL,
    "borrowerId" INTEGER NOT NULL,
    "principalAmount" DECIMAL(15,2) NOT NULL,
    "roundedPrincipalAmount" INTEGER NOT NULL,
    "interestRate" DECIMAL(6,4) NOT NULL,
    "tenure" INTEGER NOT NULL,
    "emiAmount" DECIMAL(12,2) NOT NULL,
    "roundedEmiAmount" INTEGER NOT NULL,
    "loanType" "public"."LoanType" NOT NULL,
    "loanStatus" "public"."LoanStatus" NOT NULL DEFAULT 'PENDING',
    "applicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvalDate" TIMESTAMP(3),
    "disbursementDate" TIMESTAMP(3),
    "maturityDate" TIMESTAMP(3),
    "outstandingAmount" DECIMAL(15,2),
    "roundedOutstandingAmount" INTEGER,
    "totalPaidAmount" DECIMAL(15,2) DEFAULT 0,
    "roundedTotalPaidAmount" INTEGER,
    "processingFee" DECIMAL(10,2) DEFAULT 0,
    "roundedProcessingFee" INTEGER,
    "penaltyAmount" DECIMAL(10,2) DEFAULT 0,
    "rounedPenaltyAmount" INTEGER,
    "purpose" TEXT,
    "remarks" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orgName" TEXT NOT NULL,
    "organization" TEXT NOT NULL,

    CONSTRAINT "loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."emis" (
    "id" SERIAL NOT NULL,
    "loanId" INTEGER NOT NULL,
    "emiNumber" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "principalAmount" DECIMAL(12,2) NOT NULL,
    "roundedPrincipalAmount" INTEGER,
    "interestAmount" DECIMAL(12,2) NOT NULL,
    "roundedInterestAmount" INTEGER,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "roundedTotalAmount" INTEGER,
    "paidAmount" DECIMAL(12,2) DEFAULT 0,
    "roundedPaidAmount" INTEGER,
    "balanceAmount" DECIMAL(12,2),
    "roundedBalanceAmount" INTEGER,
    "penaltyAmount" DECIMAL(10,2) DEFAULT 0,
    "roundedPenaltyAmount" INTEGER,
    "outstandingPrincipal" DECIMAL(15,2) NOT NULL,
    "roundedOutstandingPrincipal" INTEGER,
    "cumulativePrincipalPaid" DECIMAL(15,2) NOT NULL,
    "roundedCumulativePrincipalPaid" INTEGER,
    "cumulativeInterestPaid" DECIMAL(15,2) NOT NULL,
    "roundedCumulativeInterestPaid" INTEGER,
    "status" "public"."EMIStatus" NOT NULL DEFAULT 'PENDING',
    "paidDate" TIMESTAMP(3),
    "lateDays" INTEGER DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" SERIAL NOT NULL,
    "paymentNumber" TEXT NOT NULL,
    "loanId" INTEGER NOT NULL,
    "emiId" INTEGER,
    "borrowerId" INTEGER NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "paymentMethod" "public"."PaymentMethod" NOT NULL,
    "paymentType" "public"."PaymentType" NOT NULL DEFAULT 'EMI_PAYMENT',
    "transactionId" TEXT,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "principalPaid" DECIMAL(12,2) DEFAULT 0,
    "interestPaid" DECIMAL(12,2) DEFAULT 0,
    "penaltyPaid" DECIMAL(10,2) DEFAULT 0,
    "processingFeePaid" DECIMAL(10,2) DEFAULT 0,
    "excessAmount" DECIMAL(12,2) DEFAULT 0,
    "adjustedAmount" DECIMAL(12,2) DEFAULT 0,
    "outstandingBeforePayment" DECIMAL(15,2),
    "outstandingAfterPayment" DECIMAL(15,2),
    "allocatedEMIs" JSONB,
    "reversalPaymentId" INTEGER,
    "isReversal" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'COMPLETED',
    "remarks" TEXT,
    "receiptNumber" TEXT,
    "bankName" TEXT,
    "chequeNumber" TEXT,
    "chequeDate" TIMESTAMP(3),
    "processedBy" INTEGER,
    "verifiedBy" INTEGER,
    "verifiedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_userId_key" ON "public"."users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "public"."users"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_panNumber_key" ON "public"."users"("panNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_aadharNumber_key" ON "public"."users"("aadharNumber");

-- CreateIndex
CREATE UNIQUE INDEX "loans_id_key" ON "public"."loans"("id");

-- CreateIndex
CREATE UNIQUE INDEX "loans_loanNumber_key" ON "public"."loans"("loanNumber");

-- CreateIndex
CREATE UNIQUE INDEX "emis_loanId_emiNumber_key" ON "public"."emis"("loanId", "emiNumber");

-- CreateIndex
CREATE UNIQUE INDEX "payments_paymentNumber_key" ON "public"."payments"("paymentNumber");

-- AddForeignKey
ALTER TABLE "public"."loans" ADD CONSTRAINT "loans_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."emis" ADD CONSTRAINT "emis_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "public"."loans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "public"."loans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_emiId_fkey" FOREIGN KEY ("emiId") REFERENCES "public"."emis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_reversalPaymentId_fkey" FOREIGN KEY ("reversalPaymentId") REFERENCES "public"."payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
