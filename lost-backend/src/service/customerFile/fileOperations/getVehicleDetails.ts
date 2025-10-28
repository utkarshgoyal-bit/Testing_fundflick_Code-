import vehicleSchemaModel from "../../../models/customerFile/vehicle";

const getVehicleDetails = async (chassisNumber: string, loginUser: any) => {
  const vehicleRecords = await vehicleSchemaModel.findOne({ chassisNumber, organization: loginUser.organization._id });
  return vehicleRecords;
};
export default getVehicleDetails;
