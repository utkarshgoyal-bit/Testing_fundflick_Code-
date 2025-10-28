import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CUSTOMER_TYPE } from '@/lib/enums';
import { GET_CREDIT_INCOME_DETAILS, GET_CUSTOMER_ASSOCIATES_DATA } from '@/redux/actions/types';
import { RootState } from '@/redux/slices';
import { calculateIncomeProgress } from '@/utils/progress';
import { NotepadTextDashed } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProgressBar from '../progressBar';
import IncomeDetails from './income';
import LiabilityDetails from './liabilityDetails';
import ApplicantDetailsCard from './personal';

function NoDataAvailable() {
  return (
    <div className="h-full w-full flex flex-col gap-3 justify-center items-center mt-10 border p-9 rounded-md">
      <NotepadTextDashed />
      <h1 className="text-xl">Please add Co-Applicant</h1>
    </div>
  );
}
export default function Income() {
  const { incomeDetails, liabilityDetails } = useSelector((state: RootState) => state.credit);
  const [activeCoApplicantIndex, setActiveCoApplicantIndex] = useState(0);
  const [activeGrantorIndex, setActiveGrantorIndex] = useState(0);
  const dispatch = useDispatch();
  const { associates } = useSelector((state: RootState) => state.fileAssociates);
  const coApplicants = associates?.customerOtherFamilyDetails?.filter(
    (associate: any) => associate.customerType === CUSTOMER_TYPE['co-applicant']?.toLocaleLowerCase()
  );

  const guarantors = associates?.customerOtherFamilyDetails?.filter(
    (associate: any) => associate.customerType === CUSTOMER_TYPE.guarantor?.toLocaleLowerCase()
  );
  useEffect(() => {
    dispatch({ type: GET_CUSTOMER_ASSOCIATES_DATA });
    dispatch({ type: GET_CREDIT_INCOME_DETAILS });
  }, []);

  const customerIds = [
    associates.customerDetails?._id,
    ...(coApplicants?.map((a: { customerDetails: { _id: any } }) => a.customerDetails?._id) || []),
    ...(guarantors?.map((g: { customerDetails: { _id: any } }) => g.customerDetails?._id) || []),
  ].filter(Boolean);
  const progress = calculateIncomeProgress(incomeDetails, liabilityDetails, customerIds);
  return (
    <div>
      <div>
        <div className="mb-4">
          <ProgressBar percentage={progress} label={''} />
        </div>
        <Tabs defaultValue="applicant" className="w-full">
          <TabsList className="h-12 px-4">
            <TabsTrigger value="applicant" className="px-3 py-2">
              Applicant
            </TabsTrigger>
            <TabsTrigger value="co-applicant" className="px-3 py-2">
              Co-Applicant
            </TabsTrigger>
            <TabsTrigger value="guarantor" className="px-3 py-2">
              Guarantor
            </TabsTrigger>
          </TabsList>
          <TabsContent value="applicant">
            <ApplicantDetailsCard data={associates.customerDetails} />
            <IncomeDetails customer_id={associates.customerDetails?._id} />
            <LiabilityDetails customer_id={associates.customerDetails?._id} />
          </TabsContent>
          <TabsContent value="co-applicant">
            {coApplicants?.length > 0 ? (
              <>
                <div className="flex justify-center flex-col items-center gap-4">
                  <ApplicantDetailsCard data={coApplicants[activeGrantorIndex]?.customerDetails} />
                  <div className="flex gap-3">
                    <Button
                      disabled={activeGrantorIndex < 1}
                      onClick={() => setActiveGrantorIndex(activeGrantorIndex - 1)}
                    >
                      Pervious
                    </Button>
                    <Button
                      disabled={coApplicants.length - 1 === activeGrantorIndex}
                      onClick={() => setActiveGrantorIndex(activeGrantorIndex + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
                <IncomeDetails customer_id={coApplicants[activeGrantorIndex]?.customerDetails?._id} />
                <LiabilityDetails customer_id={coApplicants[activeGrantorIndex]?.customerDetails?._id} />
              </>
            ) : (
              <NoDataAvailable />
            )}
          </TabsContent>
          <TabsContent value="guarantor">
            {guarantors?.length > 0 ? (
              <>
                <div className="flex justify-center flex-col items-center gap-4">
                  <ApplicantDetailsCard data={guarantors[activeCoApplicantIndex]?.customerDetails} />
                  <div className="flex gap-3">
                    <Button
                      disabled={activeCoApplicantIndex < 1}
                      onClick={() => setActiveCoApplicantIndex(activeCoApplicantIndex - 1)}
                    >
                      Pervious
                    </Button>
                    <Button
                      disabled={guarantors.length - 1 === activeCoApplicantIndex}
                      onClick={() => setActiveCoApplicantIndex(activeCoApplicantIndex + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
                <IncomeDetails customer_id={guarantors[activeCoApplicantIndex]?.customerDetails?._id} />
                <LiabilityDetails customer_id={guarantors[activeCoApplicantIndex]?.customerDetails?._id} />
              </>
            ) : (
              <NoDataAvailable />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
