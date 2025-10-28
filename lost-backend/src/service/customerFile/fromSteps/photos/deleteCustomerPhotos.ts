import { Types } from "mongoose";
import { EmployeeSchema } from "../../../../models";
import customerFileSchema from "../../../../models/customerFile";
import { ERROR } from "../../../../shared/enums";
import CustomerFileStatusNotification from "../../../../socket/sendNotification";
const deleteCustomerPhotos = async ({ loginUser, body, id }: { loginUser: any; body: any; id: string }) => {
  const customerFile = await customerFileSchema.findOne({
    _id: id,
    organization: loginUser.organization._id,
  });
  if (!customerFile || !body._id) {
    throw ERROR.USER_NOT_FOUND;
  }
  const customerPhotos = customerFile.photos.filter(
    (item: any) => !item._id.equals(new Types.ObjectId(body._id))
  ) as any;
  customerFile.photos = customerPhotos;
  // customerFile.photos = customerFile.photos.filter((item: any) => item._id.toString() !== body.customer_id)
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
        message: `${loginUserDetails.firstName + " " + loginUserDetails.lastName}(${loginUser.roleRef?.name || loginUser.role}) has deleted a photo of the file`,
        title: `File FI-${customerFile.loanApplicationNumber} A photo is deleted `,
      },
      organization: loginUser.organization._id,
    });
  }
  return true;
};

export default deleteCustomerPhotos;
