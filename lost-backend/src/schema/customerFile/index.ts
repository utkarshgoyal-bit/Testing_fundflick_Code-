import mongoose from 'mongoose';
const {
  Schema: { Types },
  model,
  Schema,
} = mongoose;

const customerFileSchema = new Schema(
  {
    organization: {
      type: Types.ObjectId,
      required: true,
      ref: 'organization',
    },
    customerDetails: {
      type: Types.ObjectId,
      required: true,
      ref: 'customerv2',
    },
    fileBranch: {
      type: Types.String,
      required: [true, 'File Branch is required'],
    },
    loanApplicationNumber: {
      type: Types.Number,
      required: [true, 'Loan Application Number is required'],
      unique: true,
    },
    loanType: {
      type: Types.String,
      required: [true, 'Loan Type is required'],
    },
    endUseOfMoney: {
      type: Types.String,
    },
    rateOfInterest: {
      type: Types.Number,
    },
    loanAmount: {
      type: Types.Number,
    },
    loanTenure: {
      type: Types.Number,
    },
    emiComfort: {
      type: Types.Number,
    },
    irrFlatRate: {
      type: Types.Number,
    },
    comments: {
      type: Types.String,
      default: 'na',
    },
    cibilDetails: [
      {
        Score: Types.Number,
        file: Types.String,
        customerDetails: {
          type: Types.ObjectId,
          ref: 'customerv2',
        },
      },
    ],

    fileCommentsAndReplays: [
      {
        replies: [{ type: Types.String }],
        text: { type: Types.String },
        type: { type: Types.String },
        createdAt: { type: Types.Date, default: Date.now },
      },
    ],
    fileCommentsReadStatus: {
      type: Types.Boolean,
      default: true,
    },
    //step 2
    address: {
      type: [
        {
          pltNo: Types.String,
          addressLine: Types.String,
          addressLineTwo: Types.String,
          city: Types.String,
          state: Types.String,
          country: Types.String,
          pinCode: Types.String,
          gpsCoordinates: Types.String,
        },
      ],
      required: false,
    },

    // step 3
    customerEmploymentDetails: {
      income: { type: Number },
      monthlyOtherIncome: { type: Number },
      occupation: { type: String, default: '' },
      occupationCategory: { type: String, default: '' },
      remarks: { type: String, default: '' },
    },
    customerOtherInformation: [
      {
        officeAddress: { type: String, default: '' },
        designation: { type: String, default: '' },
        department: { type: String, default: '' },
        employeeCode: { type: String, default: '' },
        website: { type: String, default: '' },
        officeContact: { type: String, default: '' },
        experienceWithCompany: { type: Number },
        retirementAge: { type: Number },
        incomeDetailsComments: { type: String, default: '' },
      },
    ],
    customerOtherFamilyDetails: [
      {
        customerType: { type: String, default: '' },
        relation: { type: String, default: '' },
        customerDetails: {
          type: Types.ObjectId,
          ref: 'customerv2',
          required: true,
        },
        address: {
          type: {
            pltNo: Types.String,
            addressLine: Types.String,
            addressLineTwo: Types.String,
            city: Types.String,
            state: Types.String,
            country: Types.String,
            pinCode: Types.String,
            gpsCoordinates: Types.String,
          },
          required: false,
        },
        income: { type: Number, default: 0 },
        education: { type: String, default: '' },
        occupation: { type: String, default: '' },
        occupationCategory: { type: String, default: '' },
        customerOtherFamilyComments: { type: String, default: '' },
      },
    ],

    credit: {
      personalDetails: {
        whoMet: { type: String, default: '' },
        married: { type: String, default: '' },
        siblings: { type: Number, default: 0 },
        education: { type: String, default: '' },
        totalMembers: { type: Number, default: 0 },
        earningMembers: { type: Number, default: 0 },
        monthlyEarning: { type: Number, default: 0 },
        neighborName: { type: String, default: '' },
        neighborFeedback: { type: String, default: '' },
        livingStandard: { type: String, default: '' },
        loanRequired: { type: String, default: '' },
        loanUse: { type: String, default: '' },
      },
      propertyDetails: {
        assetsSeen: { type: String, default: '' },
        estimatedCost: { type: Number, default: 0 },
        mismatchBoundaries: { type: String, default: '' },
        marketability: { type: String, default: '' },
        deviationSeen: { type: String, default: '' },
        eMeterInstalled: { type: String, default: '' },
        commonEntrance: { type: String, default: '' },
        neighborName: { type: String, default: '' },
        coordinates: { type: String, default: '' },
        remarks: { type: String, default: '' },
      },
      familyDetails: {
        isMarried: { type: String, default: '' },
        fatherLive: { type: String, default: '' },
        motherLive: { type: String, default: '' },
        children: { type: Number, default: 0 },
        siblings: { type: Number, default: 0 },
        earningMembers: { type: Number, default: 0 },
        monthlyEarning: { type: Number, default: 0 },
        remarks: { type: String, default: '' },
      },
      incomeDetails: [
        {
          customerDetails: {
            type: Types.ObjectId,
            ref: 'customerv2',
            required: true,
          },
          income: { type: Number, default: 0 },
          monthlyOtherIncome: { type: Number, default: 0 },
          occupation: { type: String, default: '' },
          occupationCategory: { type: String, default: '' },
          remarks: { type: String, default: '' },
        },
      ],
      liabilityDetails: [
        {
          loanCategory: Types.String,
          loanType: Types.String,
          loanAmount: Types.Number,
          tenure: Types.String,
          emi: Types.Number,
          irr: Types.Number,
          bankName: Types.String,
          emiPaid: Types.Number,
          monthsLeft: Types.Number,
          paymentsMade: Types.String,
          foreclosure: Types.String,
          photo: Types.String,
          comments: Types.String,
          noOfemiLeft: Types.Number,
          noOfEmiPaid: Types.Number,
          customerDetails: {
            type: Types.ObjectId,
            ref: 'customerv2',
          },
        },
      ],
    },

    // step 4

    familyExpenses: {
      education: Types.Number,
      familyExpenses: Types.Number,
      futureOutlays: Types.Number,
    },
    existingLoans: [
      {
        loanCategory: Types.String,
        loanType: Types.String,
        loanAmount: Types.Number,
        tenure: Types.String,
        emi: Types.Number,
        irr: Types.Number,
        bankName: Types.String,
        emiPaid: Types.Number,
        monthsLeft: Types.Number,
        paymentsMade: Types.String,
        foreclosure: Types.String,
        photo: Types.String,
        comments: Types.String,
        noOfemiLeft: Types.Number,
        noOfEmiPaid: Types.Number,
        customerDetails: {
          type: Types.ObjectId,
          ref: 'customerv2',
        },
      },
    ],

    // step 5
    collateralDetails: [
      {
        collateralType: Types.String,
        landDetails: {
          type: {
            purposeOfLoan: Types.String,
            landID: Types.String,
            ownerName: {
              type: Types.ObjectId,
              ref: 'customerv2',
            },

            existingOwner: Types.String,
            contactNumber: Types.String,
            relation: Types.String,
            propertyType: Types.String,
            documentType: Types.String,
            documentNumber: Types.String,
            documentDate: Types.Date,
            societyName: Types.String,
            colonyName: Types.String,
            colonyDeveloped: Types.String,
            areaUnit: Types.String,
            landArea: Types.Number,
            constructionArea: Types.Number,
            buildUpArea: Types.String,
            location: Types.String,
            addressLineTwo: Types.String,
            pltNo: Types.String,
            state: Types.String,
            city: Types.String,
            pinCode: Types.String,
            gpsCoordinates: Types.String,
            estimatedLandValue: Types.Number,
            estimatedBuildUpValue: Types.Number,
            totalLandValue: Types.Number,
            contact: Types.String,
            comments: Types.String,
            landAreaUnit: Types.String,
            constructionAreaUnit: Types.String,
          },
        },
        vehicleDetails: {
          type: {
            ownerName: {
              type: Types.ObjectId,
              ref: 'customerv2',
              required: true,
            },
            existingOwner: Types.String,
            purposeOfLoan: Types.String,
            value: Types.Number,
            vehicleDetails: {
              type: Types.ObjectId,
              ref: 'vehiclev2',
              required: true,
            },

            comments: Types.String,
          },
        },
      },
    ],
    // step  7
    bank: [
      {
        bankAccountType: Types.String,
        bankAccountNumber: Types.String,
        bankIFSCCode: Types.String,
        bankName: Types.String,
        branchName: Types.String,
        bankAccountHolder: {
          type: Types.ObjectId,
          ref: 'customerv2',
          required: true,
        },
      },
    ],
    creditCard: [
      {
        CreditCardHolderID: Types.String,
        CreditCardNumber: Types.String,
        CreditCardType: Types.String,
        CreditCardLimit: Types.String,
        CreditCardExpiryDate: Types.Date,
      },
    ],
    hasCreditCard: {
      type: Types.Boolean,
      required: true,
      default: false,
    },
    // step  8
    photos: [
      {
        photoGroup: Types.String,
        title: Types.String,
        photo: Types.String,
        description: Types.String,
        photoDate: {
          type: Types.Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: Types.String,
      required: true,
      default: 'Pending',
    },
    salesManReport: {
      principalAmount: { type: Types.Number, default: 0 },
      interestRate: { type: Types.Number, default: 0 },
      loanTenure: { type: Types.Number, default: 0 },
      emi: { type: Types.Number, default: 0 },
      tenureType: { type: Types.String, default: 'months' },
    },
    finalApproveReport: {
      principalAmount: { type: Types.Number, default: 0 },
      interestRate: { type: Types.Number, default: 0 },
      loanTenure: { type: Types.Number, default: 0 },
      emi: { type: Types.Number, default: 0 },
      tenureType: { type: Types.String, default: 'months' },
    },
    approveOrRejectRemarks: {
      type: Types.String,
    },
    approvedOrRejectedBy: {
      type: Types.ObjectId,
      ref: 'Employeesv2',
    },

    loanApplicationFilePayment: {
      type: {
        amount: {
          type: Types.Number,
        },
        paymentMethod: {
          type: Types.String,
        },
        remarks: {
          type: Types.String,
        },
        paymentDate: {
          type: Types.Date,
        },
      },
    },
    verifiedSteps: {
      type: [
        {
          step: {
            type: Types.String,
          },
          isVerified: {
            type: Types.Boolean,
          },
          verifiedBy: {
            type: Types.ObjectId,
            ref: 'Employeesv2',
          },
        },
      ],
      default: [],
    },
    teleVerificationReports: [
      {
        review: {
          type: Types.String,
        },
        description: {
          type: Types.String,
        },

        verifiedBy: {
          type: Types.ObjectId,
          ref: 'Employeesv2',
        },
        verifiedAt: {
          type: Types.String,
        },
      },
    ],
    //other
    isActive: {
      type: Types.Boolean,
      required: true,
      default: true,
    },
    createdAt: {
      type: Types.Date,
      required: true,
      default: Date.now,
    },
    createdBy: {
      type: Types.ObjectId,
      required: true,
      ref: 'Employeesv2',
    },

    updatedAt: {
      type: Types.Date,
      default: Date.now,
    },
    updatedBy: {
      type: Types.ObjectId,
    },
    stepsDone: {
      type: [Types.String],
      default: [],
    },
    orgName: {
      type: Types.String,
      required: true,
      default: 'maitrii',
    },
    timeline: [
      {
        field: String,
        previousValue: String,
        newValue: String,
        updatedBy: Types.ObjectId,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const CustomerFile = model('CustomerFilesv2', customerFileSchema);
export default CustomerFile;
