import mongoose from "mongoose";
const {
  Schema: { Types },
  model,
  Schema,
} = mongoose;

const vehicleSchema = new Schema(
  {
    organization: {
      type: Types.ObjectId,
      required: true,
      ref: "organization",
    },
    vehicleType: Types.String,
    companyName: Types.String,
    modelVariant: Types.String,
    registrationNumber: {
      type: Types.String,
      unique: true,
      required: [true, "Registration Number is required"],
    },
    registrationDate: Types.Date,
    validityDate: Types.Date,
    chassisNumber: {
      type: Types.String,
      unique: true,
      required: [true, "Chassis Number is required"],
    },
    engineNumber: {
      type: Types.String,
      unique: true,
      required: [true, "Engine Number is required"],
    },
    yearOfManufacture: Types.String,
    engineSize: Types.String,
    fuelType: Types.String,
    createdAt: {
      type: Types.Date,
      required: true,
      default: Date.now,
    },
    createdBy: {
      type: Types.ObjectId,
      required: true,
    },
    updatedAt: {
      type: Types.Date,
      default: Date.now,
    },
    updatedBy: {
      type: Types.ObjectId,
    },
    orgName: {
      type: Types.String,
      required: true,
      default: "maitrii",
    },
  },
  { timestamps: true }
);
const vehicleSchemaModel = model("vehiclev2", vehicleSchema);
export default vehicleSchemaModel;
