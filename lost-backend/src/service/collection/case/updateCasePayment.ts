import NP from "number-precision";
import { toFormatDateToUnix, uploadFileToS3 } from "../../../helper";
import { UserSchema } from "../../../models";
import CollectionModel from "../../../models/collection/dataModel";
import PaymentData from "../../../models/collection/payment";
import { CURRENCY_SYMBOLS, PAYMENT_MODE } from "../../../shared/enums";
const updateCasePayment = async ({
  caseId,
  payload,
  file,
  loginUser,
  employee,
}: {
  caseId: string;
  payload: any;
  file: any;
  loginUser: any;
  employee: any;
}) => {
  try {
    const caseData = await CollectionModel.findOne({
      _id: payload.refCaseId,
      organization: loginUser.organization._id,
    });
    const userData = await UserSchema.findOne({
      _id: loginUser._id,
      organization: loginUser.organization._id,
    });
    const employeeName = employee?.firstName + " " + employee?.lastName;
    const employeeId = employee?._id;
    if (!caseData) {
      throw new Error("Case not found.");
    }
    if (file) {
      const selfie = await uploadFileToS3(file.path, `${caseId}/${"selfie" + new Date()}`, file.mimetype);
      payload.selfie = selfie;
    }
    if (caseData.dueEmiAmount > 0 && +caseData.dueEmiAmount >= +payload.amount) {
      const dueEmiAmount = NP.round(NP.minus(caseData?.dueEmiAmount || 0, payload?.amount || 0), 2);
      const remainingEmiAmount = Math.ceil(NP.divide(dueEmiAmount || 0, caseData?.emiAmount || 0));
      const dueEmi = caseData.emiAmount && dueEmiAmount ? NP.round(remainingEmiAmount || 0, 2) : NP.round(0, 2);
      await CollectionModel.updateOne(
        { _id: payload.refCaseId, organization: loginUser.organization._id },
        {
          $set: {
            dueEmiAmount: dueEmiAmount,
            lastPaymentDetail: payload.date,
            dueEmi,
          },
        }
      );
    }
    const upsertPaymentDetailsPayload = {
      refCaseId: payload.refCaseId,
      amount: payload.amount,
      date: payload.date,
      dateTimeStamp: toFormatDateToUnix({ date: payload.date, dateFormat: "YYYY-MM-DD" }),
      dateEndTimeStamp: toFormatDateToUnix({ date: payload.date, dateFormat: "YYYY-MM-DD", withFullTimeStamp: true }),
      paymentMode: payload.paymentMode,
      remarks: payload.remarks,
      isExtraCharges: payload.isExtraCharges,
      extraCharges: payload.extraCharges,
      createdBy: loginUser.employeeId,
      selfie: payload.selfie,
      caseNo: caseId,
      userId: loginUser?.employeeId,
      os: userData?.os,
      currencySymbol: CURRENCY_SYMBOLS.INR,
      employeeName,
      employeeId,
      organization: loginUser.organization._id,
    };
    const savedPaymentDetails = await PaymentData.insertOne(upsertPaymentDetailsPayload);
    const savePaymentDetailsInCase = await CollectionModel.updateOne(
      { _id: payload.refCaseId, organization: loginUser.organization._id },
      { $push: { paymentDetails: savedPaymentDetails._id } }
    );
    const paymentMode = payload?.paymentMode?.toLowerCase();

    if (paymentMode == PAYMENT_MODE.CASH) {
      if (!userData || !caseData) {
        throw new Error("User or Case not found.");
      }
      userData.ledgerBalance = NP.plus(userData.ledgerBalance, payload.amount, caseData.dueEmiAmount);
      userData.ledgerBalanceHistory.push({
        date: new Date(),
        dateTimeStamp: new Date().getTime(),
        ledgerBalance: payload.amount,
        type: "debit",
        remarks: `Rs. ${payload.amount} received for file no ${caseData.caseNo} (Collection)`,
      });
      await userData.save();
    }
    return {
      caseId,
      payload,
      message: "Data updated successfully and payment saved.",
      savedPaymentDetails,
      savePaymentDetailsInCase,
    };
  } catch (error) {
    console.error("Error in paymentCollection:", error);
    throw error;
  }
};
export default updateCasePayment;
