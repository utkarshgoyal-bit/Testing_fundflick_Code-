import { Types } from 'mongoose';
import { uploadFileToS3 } from '../../../../aws/s3';
import customerFileSchema from '../../../../schema/customerFile';
import { ERROR } from '../../../../shared/enums';

const addExistingLoan = async ({
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
      `${customerFile.loanApplicationNumber}/${'liability-photo' + new Date()}`,
      files[0].mimetype
    );
  }
  customerFile.existingLoans.push({ ...body, photo });
  customerFile.updatedBy = new Types.ObjectId(loginUser.employeeId);
  customerFile.updatedAt = new Date();
  await customerFile.save();
  return true;
};

export default addExistingLoan;
