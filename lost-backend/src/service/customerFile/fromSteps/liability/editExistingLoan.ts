import { Types } from "mongoose";
import { uploadFileToS3 } from "../../../../aws/s3";
import { User } from "../../../../interfaces/user.interface";
import customerFileSchema from "../../../../models/customerFile";
import { ERROR } from "../../../../shared/enums";

const editExistingLoan = async ({
  body,
  id,
  files,
  loginUser,
}: {
  body: any;
  id: string;
  files: any;
  loginUser: any;
}) => {
  const customerFile = await customerFileSchema.findOne({
    _id: id,
    organization: loginUser.organization._id,
  });

  if (!customerFile) {
    throw ERROR.NOT_FOUND;
  }
  let photo = body.photo;
  if (files?.length) {
    photo = await uploadFileToS3(
      files[0].path,
      `${customerFile.loanApplicationNumber}/${"liability-photo" + new Date()}`,
      files[0].mimetype
    );
  }
  const index = customerFile.existingLoans.findIndex((loan: any) => loan._id.toString() === body.loan_id);
  if (index !== -1) {
    customerFile.existingLoans[index] = { ...body, photo };
  }
  customerFile.updatedBy = new Types.ObjectId(loginUser.employeeId);
  customerFile.updatedAt = new Date();
  await customerFile.save();
  return true;
};

export default editExistingLoan;
