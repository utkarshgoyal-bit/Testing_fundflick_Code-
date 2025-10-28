import { Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { uploadFileToS3 } from "../../../../aws/s3";
import { EmployeeSchema } from "../../../../models";
import customerFileSchema from "../../../../models/customerFile";
import customerSchema from "../../../../models/customerFile/customers";
import { ERROR } from "../../../../shared/enums";
import CustomerFileStatusNotification from "../../../../socket/sendNotification";
const editCustomerAssociate = async ({
  fileId,
  body,
  files,
  loginUser,
}: {
  fileId: string;
  body: any;
  files: any;
  loginUser: any;
}) => {
  const isCustomerFileExist = await customerFileSchema.findById(fileId).lean();
  if (!isCustomerFileExist) {
    throw ERROR.NOT_FOUND;
  }
  const photosPaths: Record<string, any>[] = [];
  if (Array.isArray(files) && files.length > 0) {
    for (const file of files as Express.Multer.File[]) {
      const fieldname = file.fieldname;

      if (body.associate && fieldname === "associate[customerDetails][uidFront]") {
        const uploadResult = await uploadFileToS3(
          file.path,
          `${isCustomerFileExist.loanApplicationNumber}/${"associate-uidFront" + new Date()}`,
          file.mimetype
        );
        body.associate.customerDetails.uidFront = uploadResult;
      } else if (body.associate && fieldname === "associate[customerDetails][uidBack]") {
        const uploadResult = await uploadFileToS3(
          file.path,
          `${isCustomerFileExist.loanApplicationNumber}/${"associate-uidBack" + new Date()}`,
          file.mimetype
        );
        body.associate.customerDetails.uidBack = uploadResult;
      } else {
        const match = fieldname.match(/customerOtherFamilyDetails\[\d+\]\[(.+)\]/);
        if (match) {
          const subField = match[1];
          const uploadResult = await uploadFileToS3(
            file.path,
            `${isCustomerFileExist.loanApplicationNumber}/${"associate-other" + new Date()}`,
            file.mimetype
          );
          const index = parseInt(fieldname.match(/\d+/)?.[0] ?? "0");
          if (!photosPaths[index]) photosPaths[index] = {};
          photosPaths[index][subField] = uploadResult;
        }
      }
    }
  }
  let searchAssociate: {} = {
    organization: loginUser.organization._id,
  };
  if (body.associate.customerDetails.aadhaarNumber) {
    searchAssociate = { aadhaarNumber: body.associate.customerDetails.aadhaarNumber };
  } else if (body.associate_customer_id) {
    searchAssociate = { _id: new Types.ObjectId(body.associate_customer_id) };
  }
  const updateAssociatePersonalDetails = await customerSchema.findOneAndUpdate(
    searchAssociate,
    {
      $set: {
        ...body.associate.customerDetails,
        aadhaarNumber: body.associate.customerDetails.aadhaarNumber || `TEMP-${uuidv4()}`,
        updatedBy: new Types.ObjectId(loginUser.employeeId),
        updatedAt: new Date(),
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );
  const { customerType, relation, address } = body.associate;
  const associateData = {
    customerDetails: updateAssociatePersonalDetails._id,
    customerType,
    relation,
    address,
  };
  const customerFile = await customerFileSchema.findOneAndUpdate(
    {
      _id: new Types.ObjectId(fileId),
      "customerOtherFamilyDetails._id": new Types.ObjectId(body.associate_id),
      organization: loginUser.organization._id,
    },
    {
      $set: {
        "customerOtherFamilyDetails.$.customerDetails": associateData.customerDetails,
        "customerOtherFamilyDetails.$.customerType": associateData.customerType,
        "customerOtherFamilyDetails.$.relation": associateData.relation,
        "customerOtherFamilyDetails.$.address": associateData.address,
        updatedBy: new Types.ObjectId(loginUser.employeeId),
        updatedAt: new Date(),
      },
    },
    {
      new: true,
      upsert: false,
      runValidators: true,
    }
  );
  if (!customerFile) {
    throw ERROR.NOT_FOUND;
  }
  const loginUserDetails = await EmployeeSchema.findOne({ _id: new Types.ObjectId(loginUser.employeeId) }).lean();
  if (!loginUserDetails) {
    throw ERROR.USER_NOT_FOUND;
  }
  if (customerFile.status !== "Pending") {
    CustomerFileStatusNotification({
      loanApplicationNumber: customerFile.loanApplicationNumber,
      creator: customerFile.createdBy,
      customerFileId: customerFile._id,
      updater: loginUser,
      message: {
        message: `${loginUserDetails.firstName + " " + loginUserDetails.lastName}(${loginUser.roleRef?.name || loginUser.role}) has updated Associates details of the file`,
        title: `File FI-${customerFile.loanApplicationNumber} Associates details is updated `,
      },
      organization: loginUser.organization._id,
    });
  }
  return true;
};

export default editCustomerAssociate;
