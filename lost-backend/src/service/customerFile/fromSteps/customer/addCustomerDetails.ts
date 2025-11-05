import { Types } from 'mongoose';
import { uploadFileToS3 } from '../../../../aws/s3';
import CustomerFileModel from '../../../../schema/customerFile';
import CustomersModel from '../../../../schema/customerFile/customers';
import { ERROR, STEPS_NAMES } from '../../../../shared/enums';
import generateLoanNumber from '../../generateLoanNumber';

const addCustomerDetails = async ({
  files,
  body,
  loginUser,
}: {
  body: any;
  files: any;
  loginUser: any;
}) => {
  if (!loginUser) {
    throw ERROR.USER_NOT_FOUND;
  }
  const loanApplicationNumber = await generateLoanNumber(loginUser.organization._id);
  if (files) {
    const { 'customerDetails[uidBack]': uidBackImage, 'customerDetails[uidFront]': uidFrontImage } =
      files;
    if (uidFrontImage) {
      const uidFront = await uploadFileToS3(
        uidFrontImage[0].path,
        `${loanApplicationNumber}/${'uidFront' + new Date()}`,
        uidFrontImage[0].mimetype
      );
      body.customerDetails.uidFront = uidFront;
    }
    if (uidBackImage) {
      const uidBack = await uploadFileToS3(
        uidBackImage[0].path,
        `${loanApplicationNumber}/${'uidBack' + new Date()}`,
        uidBackImage[0].mimetype
      );
      body.customerDetails.uidBack = uidBack;
    }
  }

  body.loanApplicationNumber = loanApplicationNumber;
  body.createdBy = new Types.ObjectId(loginUser.employeeId);
  body.updatedBy = new Types.ObjectId(loginUser.employeeId);
  body.updatedAt = new Date();
  body.stepsDone = [STEPS_NAMES.CUSTOMER];
  body.organization = loginUser.organization._id;
  body.customerDetails.organization = loginUser.organization._id;
  const customer = await CustomersModel.findOneAndUpdate(
    { aadhaarNumber: body.customerDetails.aadhaarNumber, organization: loginUser.organization._id },
    body.customerDetails,
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );
  body.customerDetails = customer._id;
  const loanFile = new CustomerFileModel(body);
  const loanFileResponse = await loanFile.save();
  return {
    _id: loanFileResponse ? loanFileResponse._id : null,
    loanApplicationNumber: loanFileResponse ? loanFileResponse.loanApplicationNumber : null,
  };
};

export default addCustomerDetails;
