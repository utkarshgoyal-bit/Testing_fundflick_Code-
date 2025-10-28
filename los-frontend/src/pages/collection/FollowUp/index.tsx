import PageHeader from '@/components/shared/pageHeader';
import { FormFollowupInputs } from '@/pages/collection/main/types';
import { FETCH_COLLECTION_FOLLOWUP_CASE_ID, FETCH_COLLECTION_FOLLOWUP_DATA } from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import FollowUps from './FollowUp';

export default function Index({
  hideBack,
  title,
  paymentCaseNo,
  casePaymentData,
  isDonotNavigate,
}: {
  hideBack?: boolean;
  title?: string;
  paymentCaseNo?: string;
  casePaymentData?: any;
  isDonotNavigate?: boolean;
}) {
  const { caseNo: caseIdParamsNo } = useParams<{ caseNo: string }>();
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const { refCaseId } = useSelector((state: RootState) => state.followUpAddData);
  const { loading } = useSelector((state: RootState) => state.publicSlice);

  const caseNo = paymentCaseNo || caseIdParamsNo;

  useEffect(() => {
    if (caseNo) {
      dispatch({
        type: FETCH_COLLECTION_FOLLOWUP_CASE_ID,
        payload: caseNo,
      });
    }
  }, [caseNo, dispatch]);

  const onSubmit = (data: FormFollowupInputs) => {
    const payload = {
      data: {
        attitude: data.attitude,
        remarks: data.remarks,
        date: data.date,
        noReply: data.noReply,
        commit: !data.noReply ? data.commit : undefined,
        selfie: data?.selfie?.[0] || null,
        visitType: data.visitType,
        refCaseId: refCaseId || null,
        casePaymentData: casePaymentData || null,
        latitude: data.latitude,
        longitude: data.longitude,
      },
      caseIdParams: caseNo,
      navigation,
      isDonotNavigate,
    };
    dispatch({
      type: FETCH_COLLECTION_FOLLOWUP_DATA,
      payload,
    });
  };

  return (
    <>
      <PageHeader title={title || 'followUp'} hideBack={hideBack} />
      <FollowUps loading={loading} onSubmit={onSubmit} />
    </>
  );
}
