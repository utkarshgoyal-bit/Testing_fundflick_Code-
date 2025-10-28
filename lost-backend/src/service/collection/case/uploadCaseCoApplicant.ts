import { z } from "zod";
import { coApplicantsData } from "../../../../src/interfaces";
import CollectionModel from "../../../models/collection/dataModel";

const uploadCaseCoApplicant = async (newData: coApplicantsData, loginUser: any) => {

  const schema = z.array(
    z.object({
      "Case No": z.string(),
      Name: z.string(),
      "Ownership Indicator": z.string(),
    })
  );
  try {
    newData = schema.parse(newData);
  } catch (e) {
    throw new Error("Invalid data format");
  }
  const bulkOperation = [];

  const groupedByCaseNo = new Map();
  for (const row of newData) {
    const caseNo = row["Case No"];
    if (!groupedByCaseNo.has(caseNo)) {
      groupedByCaseNo.set(caseNo, []);
    }
    groupedByCaseNo.get(caseNo).push({
      name: row["Name"],
      ownershipIndicator: Number(row["Ownership Indicator"]),
    });
  }

  if (groupedByCaseNo.size === 0) {
    throw new Error("No data found in the file.");
  }

  for (const [caseNo, applicants] of groupedByCaseNo.entries()) {
    bulkOperation.push({
      updateOne: {
        filter: { caseNo, organization: loginUser.organization._id },
        update: {
          $set: {
            coApplicantsData: applicants,
          },
        },
        upsert: false,
      },
    });
  }

  const result = await CollectionModel.bulkWrite(bulkOperation, {
    ordered: false,
  });
  return result;
};

export default uploadCaseCoApplicant;
