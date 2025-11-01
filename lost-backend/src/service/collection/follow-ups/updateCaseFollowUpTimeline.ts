import { Types } from 'mongoose';
import { toFormatDateToUnix, uploadFileToS3 } from '../../../helper';
import { IDbErrors } from '../../../interfaces';
import CollectionModel from '../../../schema/collection/dataModel';
import FollowUpData from '../../../schema/collection/followUpData';
import { CURRENCY_SYMBOLS } from '../../../shared/enums';
const updateCaseFollowUpTimeline = async ({
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
    }).lean();
    const employeeId = employee?._id;
    if (!caseData) {
      throw new Error('Case data not found');
    }
    if (file) {
      const selfie = await uploadFileToS3(
        file.path,
        `${caseId}/${'selfie' + new Date()}`,
        file.mimetype
      );
      payload.selfie = selfie;
    }

    const upsertPayload = {
      ...payload,
      dateTimeStamp: toFormatDateToUnix({ date: payload.date, dateFormat: 'YYYY-MM-DD' }),
      dateEndTimeStamp: toFormatDateToUnix({
        date: payload.date,
        dateFormat: 'YYYY-MM-DD',
        withFullTimeStamp: true,
      }),
      ...(!payload.commit
        ? { commitTimeStamp: null }
        : {
            commitTimeStamp: toFormatDateToUnix({ date: payload.commit, dateFormat: 'YYYY-MM-DD' }),
          }),
      ...(!payload.commit
        ? { commitEndTimeStamp: null }
        : {
            commitEndTimeStamp: toFormatDateToUnix({
              date: payload.commit,
              dateFormat: 'YYYY-MM-DD',
            }),
          }),
      createdBy: new Types.ObjectId(loginUser.employeeId),
      caseNo: caseData.caseNo,
      userId: loginUser?.employeeId,
      os: loginUser?.os,
      currency: CURRENCY_SYMBOLS.INR,
      employeeId,
      date: new Date(payload.date).toISOString(),
      ...(!payload.commit ? { commit: null } : { commit: new Date(payload.commit).toISOString() }),
      organization: loginUser.organization._id,
    };
    let addFollowUpData: any = {};
    let updatedCase: any = {};
    try {
      addFollowUpData = await FollowUpData.create(upsertPayload);
    } catch (error: unknown) {
      console.error('Error inserting follow-up data:', error);
      const dbError = error as IDbErrors;
      throw new Error(`${dbError.message || 'Failed to insert follow-up data'}`);
    }
    try {
      updatedCase = await CollectionModel.updateOne(
        { _id: addFollowUpData.refCaseId, organization: loginUser.organization._id },
        { $push: { followUps: addFollowUpData._id } }
      );
    } catch (error) {
      console.error('Error inserting Collection data:', error);
      throw new Error('Failed to update Collection data');
    }
    return {
      caseId,
      addFollowUpData,
      updatedCase,
      message: 'Timeline updated successfully.',
    };
  } catch (error) {
    console.error('Error in updateFollowUpTimeline:', error);
    throw error;
  }
};

export default updateCaseFollowUpTimeline;
