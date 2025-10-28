import PageHeader from '@/components/shared/pageHeader';
import { ICasePaymentData } from '@/lib/interfaces';
import { formSchema } from '@/pages/collection/main/types';
import { FETCH_COLLECTION_PAYMENT_CASE_ID, FETCH_COLLECTION_PAYMENT_DATA } from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import { format, subDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as z from 'zod';
import PaymentDetails from './PaymentDetails';
import PaymentDialog from './PaymentDialog';

type FormInputs = z.infer<typeof formSchema>;

export default function Index() {
  const { caseNo: caseIdParams } = useParams<{ caseNo: string }>();
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const { loading } = useSelector((state: RootState) => state.publicSlice);
  const { refCaseId, dueEmiAmount = 0 } = useSelector((state: RootState) => state.collectionPayment);
  const [openFollowUp, setFollowUp] = useState(false);
  const [casePaymentData, setCasePaymentData] = useState<ICasePaymentData | null>(null);

  const onSubmit = (data: FormInputs) => {
    const collectedAmount = data.amount || 0;
    setCasePaymentData(data);
    if (dueEmiAmount === collectedAmount) {
      onDispatchPaymentsUps({ data });
    } else if (collectedAmount > dueEmiAmount) {
      console.error('Collected amount is greater than due amount');
      toast.error('Collected amount is greater than due amount');
    } else {
      setFollowUp(true);
    }
  };

  const onDispatchPaymentsUps = ({ data }: { data: any }) => {
    let payload = { ...data, refCaseId };
    if (data?.selfie?.[0]) {
      payload = { ...payload, selfie: data?.selfie?.[0] };
    }
    dispatch({
      type: FETCH_COLLECTION_PAYMENT_DATA,
      payload: {
        data: payload,
        caseIdParams,
        navigation,
      },
    });
  };

  const onCloseFollowUpModal = () => {
    setFollowUp(false);
  };

  const today = format(new Date(), 'dd-MM-yyyy');
  const yesterday = format(subDays(new Date(), 1), 'dd-MM-yyyy');

  useEffect(() => {
    if (caseIdParams) {
      dispatch({
        type: FETCH_COLLECTION_PAYMENT_CASE_ID,
        payload: caseIdParams,
      });
    }
  }, [caseIdParams, dispatch]);

  return (
    <>
      <div className="container mx-auto p-4">
        <PageHeader title="paymentDetails" />
        <PaymentDetails
          onSubmit={onSubmit}
          // register={register}
          // errors={errors}
          // watch={watch}
          // setValue={setValue}
          dueEmiAmount={dueEmiAmount}
          today={today}
          yesterday={yesterday}
          loading={loading}
        />
        <PaymentDialog
          openFollowUp={openFollowUp}
          onCloseFollowUpModal={onCloseFollowUpModal}
          paymentCaseNo={caseIdParams}
          casePaymentData={casePaymentData}
        />
      </div>
    </>
  );
}
