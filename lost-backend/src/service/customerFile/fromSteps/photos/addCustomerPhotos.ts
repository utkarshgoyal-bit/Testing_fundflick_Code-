import { Types } from "mongoose";
import { uploadFileToS3 } from "../../../../aws/s3";
import { User } from "../../../../interfaces/user.interface";
import { EmployeeSchema } from "../../../../models";
import customerFileSchema from "../../../../models/customerFile";
import { ERROR, STEPS_NAMES } from "../../../../shared/enums";
import CustomerFileStatusNotification from "../../../../socket/sendNotification";
const addCustomerPhotos = async ({
  id,
  body,
  loginUser,
  files,
}: {
  id: string;
  body: any;
  loginUser: any;
  files: { [fieldname: string]: Express.Multer.File[] };
}) => {
  const customerFile = await customerFileSchema.findOne({
    _id: id,
    organization: loginUser.organization._id,
  });
  if (!customerFile) {
    throw ERROR.NOT_FOUND;
  }
  const { photo } = files;

  if (photo?.length > 0 && photo[0].path) {
    const newFilePath = `${customerFile.loanApplicationNumber}/photos/${body.title}_${new Date().getTime()}`;
    const newFileUrl = await uploadFileToS3(photo[0].path, newFilePath, photo[0].mimetype);
    const existingPhotoIndex = customerFile.photos.findIndex((p) => p.title === body.title);
    if (existingPhotoIndex !== -1) {
      customerFile.photos[existingPhotoIndex].photo = newFileUrl;
    } else {
      body.photo = newFileUrl;
      customerFile.photos.push(body);
    }
  }
  if (!customerFile.stepsDone.includes(STEPS_NAMES.PHOTOS)) {
    customerFile.stepsDone.push(STEPS_NAMES.PHOTOS);
  }
  await customerFile.save();
  const loginUserDetails = await EmployeeSchema.findOne({
    _id: new Types.ObjectId(loginUser.employeeId),
    organization: loginUser.organization._id,
  });
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
        message: `${loginUserDetails.firstName} ${loginUserDetails.lastName} (${loginUser.roleRef?.name || loginUser.role}) has added a photo to the file`,
        title: `File FI-${customerFile.loanApplicationNumber} - A new photo is added`,
      },
      organization: loginUser.organization._id,
    });
  }
  return true;
};

export default addCustomerPhotos;
