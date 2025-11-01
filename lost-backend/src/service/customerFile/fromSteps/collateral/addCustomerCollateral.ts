import { Types } from 'mongoose';
import { EmployeeSchema } from '../../../../schema';
import customerFileSchema from '../../../../schema/customerFile';
import vehicleSchemaModel from '../../../../schema/customerFile/vehicle';
import { ERROR, STEPS_NAMES } from '../../../../shared/enums';
import CustomerFileStatusNotification from '../../../../socket/sendNotification';
const addCustomerCollateral = async ({
  fileId,
  body,
  loginUser,
}: {
  fileId: string;
  body: any;
  loginUser: any;
}) => {
  const customerFile = await customerFileSchema
    .findOne({
      _id: fileId,
      organization: loginUser.organization._id,
    })
    .populate('collateralDetails.vehicleDetails.vehicleDetails');
  if (!customerFile) {
    throw ERROR.USER_NOT_FOUND;
  }
  const collaterals: any = await Promise.all(
    body.collateralDetails.map(async (item: any) => {
      if (item.collateralType === 'vehicle' && !item.vehicleDetails.vehicleDetails._id) {
        const vehiclePayload = {
          ...item.vehicleDetails.vehicleDetails,
          createdBy: new Types.ObjectId(loginUser.employeeId),
        };
        const vehicleId = await vehicleSchemaModel.findOneAndUpdate(
          { chassisNumber: vehiclePayload.chassisNumber },
          vehiclePayload,
          {
            upsert: true,
            new: true,
          }
        );
        item.vehicleDetails.vehicleDetails = vehicleId._id; // Ensure you're updating the correct field here
        return {
          vehicleDetails: item.vehicleDetails,
          collateralType: item.collateralType,
        };
      } else {
        return item;
      }
    })
  );

  customerFile.collateralDetails = collaterals;
  customerFile.updatedBy = new Types.ObjectId(loginUser.employeeId);
  customerFile.updatedAt = new Date();
  if (!customerFile.stepsDone.includes(STEPS_NAMES.COLLATERAL)) {
    customerFile.stepsDone.push(STEPS_NAMES.COLLATERAL);
  }
  const updatedCustomerFile = await customerFile.save();
  await updatedCustomerFile.populate([
    { path: 'collateralDetails.vehicleDetails.vehicleDetails' },
    { path: 'customerOtherFamilyDetails.customerDetails' },
  ]);
  const responseUpdatedCollateralDetails = updatedCustomerFile
    .toObject()
    .collateralDetails.map((collateral: any) => {
      if (collateral.collateralType === 'vehicle' && collateral?.vehicleDetails?.vehicleDetails) {
        const { ...rest } = collateral.vehicleDetails.vehicleDetails as any;
        const { ...rest1 } = collateral.vehicleDetails as any;
        collateral.vehicleDetails = {
          ...rest1,
          ...rest,
        };
      }
      return collateral;
    });
  const customerOtherFamilyDetails = updatedCustomerFile
    ?.toObject()
    ?.customerOtherFamilyDetails.map((item: any) => {
      const { customerDetails, ...rest } = item;
      const { _id, ...customerRestDetails } = customerDetails;
      return { ...rest, ...customerRestDetails, customerDetails: _id };
    });
  const loginUserDetails = await EmployeeSchema.findOne({
    _id: new Types.ObjectId(loginUser.employeeId),
  });
  if (!loginUserDetails) {
    throw ERROR.USER_NOT_FOUND;
  }
  if (customerFile.status !== 'Pending') {
    CustomerFileStatusNotification({
      loanApplicationNumber: customerFile.loanApplicationNumber,
      creator: customerFile.createdBy,
      customerFileId: customerFile._id,
      updater: loginUser,
      message: {
        message: `${loginUserDetails.firstName + ' ' + loginUserDetails.lastName}(${loginUser.roleRef?.name || loginUser.role}) has updated collateral details of the file`,
        title: `File FI-${customerFile.loanApplicationNumber} collateral details is updated `,
      },
      organization: loginUser.organization._id,
    });
  }
  return {
    ...updatedCustomerFile?.toObject(),
    customerOtherFamilyDetails,
    collateralDetails: responseUpdatedCollateralDetails,
  };
};

export default addCustomerCollateral;
