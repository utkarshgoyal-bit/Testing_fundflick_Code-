/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoanType } from '@prisma/client';
import { Request, Response } from 'express';
import NP from 'number-precision';
import Logger from '../../lib/logger';
import { CustomerDetails, CustomerFile } from '../../schema';
import { LoanModel } from '../models/loan.model';
import { EMICalculationService } from '../service/emiCalculation.service';
import { EMIScheduleService } from '../service/emiSchedule.service';

export class LoanController {
  static async createLoan(req: Request, res: Response): Promise<void> {
    try {
      const { processingFee, fileId, loanType } = req.body;
      const { loginUser } = req;
      const loginUserId = loginUser._id || '';
      const isLoanAlreadyCreated = await LoanModel.findById(fileId);
      if (isLoanAlreadyCreated) {
        res.status(400).json({
          success: false,
          message: 'Loan is already created!!!',
        });
        return;
      }
      if (!loginUserId) {
        res.status(400).json({
          success: false,
          message: 'Login User Id no available!!!',
        });
        return;
      }
      const fileDetails = await CustomerFile.findOne({ loanApplicationNumber: fileId }).lean();

      if (!fileDetails) {
        res.status(400).json({
          success: false,
          message: 'File not found',
        });
        return;
      }
      const {
        orgName,
        organization,
        customerDetails: customerId,
        finalApproveReport,
        endUseOfMoney,
        address,
        customerEmploymentDetails,
        isActive,
        loanApplicationNumber,
      } = fileDetails;

      const { city, state, pinCode, country } = address?.[0] || {};
      const { income, monthlyOtherIncome } = customerEmploymentDetails || {};

      const customerDetails = await CustomerDetails.findOne({ _id: customerId }).lean();
      if (!customerDetails) {
        res.status(400).json({
          success: false,
          message: 'Customer details not found',
        });
        return;
      }
      const {
        personalPan,
        aadhaarNumber,
        firstName,
        lastName,
        phone,
        email,
        isActive: isActiveCustomer,
        _id: customerIdFromDetails,
      } = customerDetails;

      if (!aadhaarNumber) {
        res.status(400).json({
          success: false,
          message: 'Aadhaar not found',
        });
        return;
      }
      if (!personalPan) {
        res.status(400).json({
          success: false,
          message: 'PAN not found',
        });
        return;
      }
      if (!finalApproveReport) {
        res.status(400).json({
          success: false,
          message: 'Sales man report not found',
        });
        return;
      }
      const { interestRate, principalAmount, loanTenure: tenure } = finalApproveReport;

      // if (cibilDetails.length) {
      //   res.status(400).json({
      //     success: false,
      //     message: 'CIBIL Details not available',
      //   });
      //   return;
      // }

      if (!principalAmount || !interestRate || !tenure || !loanType || !fileId) {
        res.status(400).json({
          success: false,
          message:
            'Missing required fields: customerId, principalAmount, interestRate, tenure, loanType, fileId',
        });
        return;
      }

      if (!Object.values(LoanType).includes(loanType as LoanType)) {
        res.status(400).json({
          success: false,
          message: 'Invalid loan type',
        });
        return;
      }

      // Validate amounts
      if (principalAmount <= 0 || interestRate <= 0 || tenure <= 0) {
        res.status(400).json({
          success: false,
          message: 'Principal amount, interest rate, and tenure must be positive numbers',
        });
        return;
      }

      // Validate EMI inputs using EMICalculationService
      const emiValidationErrors = EMICalculationService.validateEMIInputs({
        principalAmount: principalAmount,
        interestRate: interestRate,
        tenure: tenure,
      });

      if (emiValidationErrors.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid EMI parameters',
          errors: emiValidationErrors,
        });
        return;
      }
      const monthlyIncome = NP.plus(income || 0, monthlyOtherIncome || 0);

      if (!isActive && !isActiveCustomer) {
        res.status(400).json({
          success: false,
          message: 'Customer is not active',
        });
        return;
      }
      if (!customerId) {
        res.status(400).json({
          success: false,
          message: 'Customer ID is missing',
        });
        return;
      }
      if (fileId !== loanApplicationNumber) {
        res.status(400).json({
          success: false,
          message: 'File ID does not match with loan application number',
        });
        return;
      }

      // Create loan data
      const loanData = {
        principalAmount: principalAmount,
        interestRate: interestRate,
        tenure: tenure,
        loanType: loanType as LoanType,
        purpose: endUseOfMoney || 'NOT_SPECIFIED',
        processingFee: NP.round(processingFee || 0, 2),
        orgName,
        organization: organization.toString(),
        fileId: loanApplicationNumber || fileId,
        userDetails: {
          city: city || 'N/A',
          state: state || 'N/A',
          pinCode: pinCode || 'N/A',
          country: country || 'N/A',
          panNumber: personalPan,
          aadharNumber: aadhaarNumber,
          customerName:
            firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || 'N/A',
          phoneNumber: phone || '',
          email: email || '',
          monthlyIncome: monthlyIncome || 0,
          isActive: (isActive && isActiveCustomer) || false,
          customerId: customerIdFromDetails.toString(),
        },
      };

      // Calculate EMI details for response
      const emiCalculation = EMICalculationService.generateEMISchedule({
        principalAmount: principalAmount,
        interestRate: interestRate,
        tenure: tenure,
      });

      // Create the loan
      const newLoan = await LoanModel.create({ loanData, createdBy: loginUserId });

      // Generate and save EMI schedule
      await EMIScheduleService.generateEMISchedule({
        loanId: newLoan.id,
      });

      res.status(200).json({
        data: {
          success: true,
          message: 'Loan created successfully',
          data: {
            loanId: newLoan.id,
            loanNumber: newLoan.loanNumber,
            principalAmount: newLoan.principalAmount,
            interestRate: newLoan.interestRate,
            tenure: newLoan.tenure,
            emiAmount: newLoan.emiAmount,
            loanType: newLoan.loanType,
            loanStatus: newLoan.loanStatus,
            createdAt: newLoan.createdAt,
            emiDetails: {
              monthlyEMI: emiCalculation.emiAmount,
              totalInterest: emiCalculation.totalInterest,
              totalAmount: emiCalculation.totalAmount,
            },
          },
        },
      });
    } catch (error: any) {
      console.error('Error creating loan:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while creating loan',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Get all loans with optional filtering
   */
  static async getAllLoans(req: Request, res: Response): Promise<void> {
    try {
      const { borrowerId, loanStatus, loanType, limit = '10', offset = '0' } = req.query;

      const filters = {
        borrowerId: borrowerId ? parseInt(borrowerId as string) : undefined,
        loanStatus: loanStatus as any,
        loanType: loanType as LoanType,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      };

      const loans = await LoanModel.findAll(filters);

      res.status(200).json({
        data: {
          success: true,
          message: 'Loans retrieved successfully',
          data: loans,
          meta: {
            limit: filters.limit,
            offset: filters.offset,
          },
        },
      });
    } catch (error: any) {
      Logger.error('Error fetching loans:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error while fetching loans',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  static async getLoanById(req: Request, res: Response): Promise<void> {
    try {
      const { loanId } = req.params;

      if (!loanId || isNaN(parseInt(loanId))) {
        res.status(400).json({
          success: false,
          message: 'Invalid loan ID',
        });
        return;
      }

      const loan = await LoanModel.findById(parseInt(loanId));

      if (!loan) {
        res.status(404).json({
          success: false,
          message: 'Loan not found',
        });
        return;
      }

      res.status(200).json({
        data: {
          success: true,
          message: 'Loan retrieved successfully',
          data: loan,
        },
      });
    } catch (error: any) {
      console.error('Error fetching loan by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching loan',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  static async approveLoan(req: Request, res: Response): Promise<void> {
    try {
      const { loanId } = req.params;
      const { disbursementDate } = req.body;

      if (!loanId || isNaN(parseInt(loanId))) {
        res.status(400).json({
          success: false,
          message: 'Invalid loan ID',
        });
        return;
      }

      const disbursementDateParsed = disbursementDate ? new Date(disbursementDate) : undefined;

      const { loan, emiSchedule } = await LoanModel.approveLoan(
        parseInt(loanId),
        disbursementDateParsed
      );

      res.status(200).json({
        success: true,
        message: 'Loan approved successfully and EMI schedule generated',
        data: {
          loan,
          emiSchedule,
        },
      });
    } catch (error: any) {
      console.error('Error approving loan:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while approving loan',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  static async calculateEMI(req: Request, res: Response): Promise<void> {
    try {
      const { principalAmount, interestRate, tenure } = req.body;

      // Validate required fields
      if (!principalAmount || !interestRate || !tenure) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields: principalAmount, interestRate, tenure',
        });
        return;
      }

      // Validate EMI inputs using EMICalculationService
      const emiValidationErrors = EMICalculationService.validateEMIInputs({
        principalAmount: parseFloat(principalAmount),
        interestRate: parseFloat(interestRate),
        tenure: parseInt(tenure),
      });

      if (emiValidationErrors.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid EMI parameters',
          errors: emiValidationErrors,
        });
        return;
      }

      // Calculate EMI details
      const emiCalculation = EMICalculationService.generateEMISchedule({
        principalAmount: parseFloat(principalAmount),
        interestRate: parseFloat(interestRate),
        tenure: parseInt(tenure),
      });

      // Get EMI summary
      const emiSummary = EMICalculationService.getEMISummary(emiCalculation.schedule);

      res.status(200).json({
        success: true,
        message: 'EMI calculated successfully',
        data: {
          emiAmount: emiCalculation.emiAmount,
          totalInterest: emiCalculation.totalInterest,
          totalAmount: emiCalculation.totalAmount,
          summary: emiSummary,
          schedule: emiCalculation.schedule, // Optional: include full schedule
        },
      });
    } catch (error: any) {
      console.error('Error calculating EMI:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while calculating EMI',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Get loan statistics
   */
  static async getLoanStatistics(req: Request, res: Response): Promise<void> {
    try {
      const statistics = await LoanModel.getStatistics();

      res.status(200).json({
        data: {
          success: true,
          message: 'Loan statistics retrieved successfully',
          data: statistics,
        },
      });
    } catch (error: any) {
      console.error('Error fetching loan statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching loan statistics',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * Get loan summary with payment details
   */
  static async getLoanSummary(req: Request, res: Response): Promise<void> {
    try {
      const { loanId } = req.params;

      if (!loanId || isNaN(parseInt(loanId))) {
        res.status(400).json({
          success: false,
          message: 'Invalid loan ID',
        });
        return;
      }

      const summary = await LoanModel.getLoanSummary(parseInt(loanId));

      res.status(200).json({
        success: true,
        message: 'Loan summary retrieved successfully',
        data: summary,
      });
    } catch (error: any) {
      console.error('Error fetching loan summary:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching loan summary',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
}
