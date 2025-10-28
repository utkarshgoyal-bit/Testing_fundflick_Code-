import { z } from "zod";
import { isTrim, toFormatDateToUnix, toFormatLastPaymentDate } from "../../../helper";
import logger from "../../../lib/logger";
import CollectionModel from "../../../models/collection/dataModel";
import FollowUpData from "../../../models/collection/followUpData";
import PaymentData from "../../../models/collection/payment";
import CollectionRevisions from "../../../models/collectionRevisions/dataModel";
import FollowUpDataRevisions from "../../../models/collectionRevisions/followUpData";
import PaymentDataRevisions from "../../../models/collectionRevisions/payment";
import timeUtils from "../../../util/time";

const rawRowSchema = z.array(
  z.object({
    "Case No": z.string().trim().min(1, "Case No is required"),
    "Loan Type": z.string().trim().min(1, "Loan Type is required"),
    "Due EMI Amt": z.coerce.number().int("Due EMI Amt should be a number").min(1, "Due EMI Amt is required"),
    "EMI Amt": z.coerce.number().int("EMI Amt should be a number").min(1, "EMI Amt is required"),
    Area: z.string().trim().min(1, "Area is required"),
    Customer: z.any(),
    "Contact No.": z.any(),
    "DMA Name": z.any(),
    "Last Payment Detail": z.any(),
    "Case Date": z.any(),
    "Circle Number": z.any(),
    "Employee Name": z.any(),
    "Employee Number": z.any(),
    Gender: z.any(),
    Caste: z.any(),
    "Father's Name": z.any(),
    Address: z.any(),
    "Repayment mode": z.any(),
    "Vehicle No": z.any(),
    "Chasis No": z.any(),
    Sub_category: z.any(),
    Type: z.any(),
    "Vehicle Make": z.any(),
    "Vehicle Model": z.any(),
    Year: z.any(),
    Supplier: z.any(),
    "Vehicle Status": z.any(),
    "Last Repossesed on": z.any(),
    "Last Released on": z.any(),
    "Expiry Date": z.any(),
    "Age By(Days)": z.any(),
    "Ledger Balance": z.any(),
    "Over Due": z.any(),
    Status: z.any(),
    "Due Bounce Charge": z.any(),
    "Agent Name": z.any(),
    "Marketing Mgr/Exec": z.any(),
    "Purpose Of Loan": z.any(),
    "Priority Sector": z.any(),
    "Finance amount": z.any(),
    Tenure: z.any(),
    "No. Received EMI": z.any(),
    "No. of Remaining EMIs": z.any(),
  })
);
type rawRowType = z.infer<typeof rawRowSchema>;

const cleanupAndRevisions = async (
  loginUser: any,
  bulkOps: {
    updateOne: {
      filter: {
        caseNo: string | null;
        organization: any;
      };
      update: {
        $set: any;
      };
      upsert: boolean;
    };
  }[]
) => {
  const currentTime = timeUtils.now().toISOString();
  const revisionId = `${currentTime}-${Math.floor(Math.random() * 1000)}`;
  const todayEnd = timeUtils.now().endOf("day").toDate().toISOString();
  const uploadedFiles = bulkOps.map((op) => op.updateOne.filter.caseNo);
  const [collections, followUps, payments] = await Promise.all([
    CollectionModel.find({ organization: loginUser.organization._id }).lean(),
    FollowUpData.find({
      organization: loginUser.organization._id,
      commit: { $lt: todayEnd },
    }).lean(),
    PaymentData.find({ organization: loginUser.organization._id }).lean(),
  ]);
  const collectionOps = collections.map(({ _id, ...doc }) => ({
    insertOne: {
      document: {
        ...doc,
        revisionId,
        organization: loginUser.organization._id,
      },
    },
  }));

  const followUpOps = followUps.map(({ _id, ...doc }) => ({
    insertOne: {
      document: {
        ...doc,
        revisionId,
        organization: loginUser.organization._id,
      },
    },
  }));

  const paymentOps = payments.map(({ _id, ...doc }) => ({
    insertOne: {
      document: {
        ...doc,
        revisionId,
        organization: loginUser.organization._id,
      },
    },
  }));

  await Promise.all([
    CollectionRevisions.bulkWrite(collectionOps),
    FollowUpDataRevisions.bulkWrite(followUpOps),
    PaymentDataRevisions.bulkWrite(paymentOps),
  ]);

  await Promise.all([
    CollectionModel.deleteMany({
      organization: loginUser.organization._id,
      caseNo: {
        $nin: uploadedFiles,
      },
    }),
    FollowUpData.deleteMany({
      organization: loginUser.organization._id,
      commit: { $lt: todayEnd },
    }),
    PaymentData.deleteMany({
      organization: loginUser.organization._id,
    }),
  ]);
};

const uploadCasesCollection = async ({
  newData,
  employee,
  loginUser,
}: {
  newData: rawRowType;
  employee: any;
  loginUser: any;
}) => {
  const existingCases = await CollectionModel.find(
    { organization: loginUser.organization._id },
    { caseNo: 1, _id: 0, dueEmiAmount: 1 }
  );
  const existingCaseMap = new Map(existingCases.map((c) => [c.caseNo, c.dueEmiAmount]));
  const casesInFile = new Set(newData.map((row) => isTrim(row["Case No"])));
  const employeeId = employee._id;

  try {
    newData = rawRowSchema.parse(newData);
  } catch (error) {
    console.error("Data validation error:", error);
    throw new Error(
      "Data validation error: \n" +
        (error as z.ZodError).issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("\n")
    );
  }

  const bulkOps = newData
    .filter((row: any) => row["Case No"])
    .map((row: any) => {
      const caseNo = isTrim(row["Case No"]);
      const dueEmiAmount = parseFloat(isTrim(row["Due EMI Amt"]) || "0");
      const emiAmount = parseInt(isTrim(row["EMI Amt"]) || "0");
      const dueEmi = Math.ceil(Number(dueEmiAmount) / Number(emiAmount)) || 0;
      const mappedData: any = {
        organization: loginUser.organization._id,

        loanType: isTrim(row["Loan Type"]),
        customer: isTrim(row["Customer"]),
        contactNo: row["Contact No."]?.split("\n").map(isTrim) || [],
        emiAmount,
        dueEmiAmount,
        dueEmi,
        dmaName: isTrim(row["DMA Name"]),
        lastPaymentDetail: row["Last Payment Detail"] || null,
        lastPaymentDetailsTimeStamp: toFormatLastPaymentDate({
          date: row["Last Payment Detail"],
          dateFormat: "MMMM D, YYYY",
        }),
        lastPaymentDetailsEndTimeStamp: toFormatLastPaymentDate({
          date: row["Last Payment Detail"],
          dateFormat: "MMMM D, YYYY",
          withFullTimeStamp: true,
        }),
        caseDate: row["Case Date"],
        caseDateTimeStamp:
          toFormatDateToUnix({
            date: row["Case Date"],
            dateFormat: "D-MMM-YY",
          }) ?? null,
        caseDateEndTimeStamp:
          toFormatDateToUnix({
            date: row["Case Date"],
            dateFormat: "D-MMM-YY",
            withFullTimeStamp: true,
          }) ?? null,
        circleNumber: isTrim(row["Circle Number"]),
        employeeNumber: isTrim(row["Employee Number"]),
        gender: isTrim(row["Gender"])?.toUpperCase(),
        caste: isTrim(row["Caste"]) || "Others",
        fatherName: isTrim(row["Father's Name"]),
        address: isTrim(row["Address"]),
        area: isTrim(row["Area"]),
        repaymentMode: isTrim(row["Repayment mode"])?.toUpperCase(),
        vehicleNo: isTrim(row["Vehicle No"]),
        chasisNo: isTrim(row["Chasis No"]),
        subCategory: isTrim(row["Sub_category"]),
        type: isTrim(row["Type"]),
        vehicleMake: isTrim(row["Vehicle Make"]),
        vehicleModel: isTrim(row["Vehicle Model"]),
        year: parseInt(isTrim(row["Year"]) || "0"),
        supplier: isTrim(row["Supplier"]),
        vehicleStatus: isTrim(row["Vehicle Status"]),
        lastRepossesedOn: row["Last Repossesed on"],
        lastReleasedOn: row["Last Released on"],
        expiryDate: row["Expiry Date"],
        expiryDateTimeStamp: toFormatDateToUnix({
          date: row["Expiry Date"],
          dateFormat: "D-MMM-YY",
        }),
        expiryDateEndTimeStamp: toFormatDateToUnix({
          date: row["Expiry Date"],
          dateFormat: "D-MMM-YY",
          withFullTimeStamp: true,
        }),
        ageInDays: parseInt(isTrim(row["Age By(Days)"]) || "0"),
        ledgerBalance: parseFloat(isTrim(row["Ledger Balance"]) || "0"),
        overdue: parseFloat(isTrim(row["Over Due"]) || "0"),
        status: isTrim(row["Status"])?.toUpperCase(),
        dueBounceCharge: parseFloat(isTrim(row["Due Bounce Charge"]) || "0"),
        agentName: isTrim(row["Agent Name"]),
        marketingManagerExec: isTrim(row["Marketing Mgr/Exec"]),
        purposeOfLoan: isTrim(row["Purpose Of Loan"]),
        prioritySector: isTrim(row["Priority Sector"])?.toUpperCase(),
        financeAmount: parseFloat(isTrim(row["Finance amount"]) || "0"),
        tenure: parseInt(isTrim(row["Tenure"]) || "0"),
        receivedEmiCount: parseInt(isTrim(row["No. Received EMI"]) || "0"),
        remainingEmiCount: parseInt(isTrim(row["No. of Remaining EMIs"]) || "0"),
        expired: false,
        employeeId,
      };
      return {
        updateOne: {
          filter: { caseNo, organization: loginUser.organization._id },
          update: {
            $set: mappedData,
          },
          upsert: true,
        },
      };
    });
  await cleanupAndRevisions(loginUser, bulkOps);

  const casesToUpdate = Array.from(existingCaseMap.keys()).filter((caseNo) => !casesInFile.has(caseNo));
  const nullDueAmountOps = casesToUpdate.map((caseNo) => ({
    updateOne: {
      filter: { caseNo, organization: loginUser.organization._id },
      update: { $set: { dueEmiAmount: null, expired: true } },
    },
  }));

  const allBulkOps = [...bulkOps, ...nullDueAmountOps];
  if (allBulkOps.length > 0) {
    try {
      const result = await CollectionModel.bulkWrite(allBulkOps, { ordered: false });
      logger.info(result);
      return true;

    } catch (error: any) {
      console.error("Bulk write error:", error);
      throw new Error("Bulk write error: " + error.message) || error;
    }
  }
};

export default uploadCasesCollection;
