import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CUSTOMER_TYPE } from '@/lib/enums';
import { RootState } from '@/redux/store';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import {
  calculateFamilyProgress,
  calculateIncomeProgress,
  calculatePersonalDetailsProgress,
  calculatePhotosProgress,
  calculatePropertyDetailsProgress,
} from '@/utils/progress';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Pendencies from '../pendencies';
import PersonalDetails from './creditDetails';
import FamilyDetails from './familyDetails';
import Income from './income';
import PhotoGroup from './photos';
import PropertyDetails from './propertyDetails';

const steps = [
  { label: 'Credit Details', component: <PersonalDetails /> },
  { label: 'Property Details', component: <PropertyDetails /> },
  { label: 'Income Details', component: <Income /> },
  { label: 'Family Details', component: <FamilyDetails /> },
  { label: 'Documents Details', component: <PhotoGroup /> },
];

function getStepProgress(selectedFile: any, stepIndex: number, customerIds: string[]): number {
  if (!selectedFile) return 0;

  switch (stepIndex) {
    case 0:
      return calculatePersonalDetailsProgress(selectedFile.personalDetails);
    case 1:
      return calculatePropertyDetailsProgress(selectedFile.propertyDetails);
    case 2:
      return calculateIncomeProgress(selectedFile.incomeDetails, selectedFile.liabilityDetails, customerIds);
    case 3:
      return calculateFamilyProgress(selectedFile.familyDetails);
    case 4:
      return calculatePhotosProgress(selectedFile.photos);
    default:
      return 0;
  }
}

export default function Credit() {
  const [step, setStep] = useState(0);
  const { personalDetails, propertyDetails, incomeDetails, liabilityDetails, familyDetails } = useSelector(
    (state: RootState) => state.credit
  );
  const { photos } = useSelector((state: RootState) => state.filePhotos);
  const { associates } = useSelector((state: RootState) => state.fileAssociates);

  const selectedFile = {
    personalDetails,
    propertyDetails,
    incomeDetails,
    liabilityDetails,
    familyDetails,
    photos,
  };

  // Create customerIds array for consistent progress calculation
  const coApplicants = associates?.customerOtherFamilyDetails?.filter(
    (associate: any) => associate.customerType === CUSTOMER_TYPE['co-applicant']?.toLowerCase()
  );

  const guarantors = associates?.customerOtherFamilyDetails?.filter(
    (associate: any) => associate.customerType === CUSTOMER_TYPE.guarantor?.toLowerCase()
  );

  const customerIds = [
    associates?.customerDetails?._id,
    ...(coApplicants?.map((a: { customerDetails: { _id: any } }) => a.customerDetails?._id) || []),
    ...(guarantors?.map((g: { customerDetails: { _id: any } }) => g.customerDetails?._id) || []),
  ].filter(Boolean);

  return (
    <div className="flex flex-col md:flex-row overflow-auto">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r p-4 overflow-x-auto md:overflow-hidden flex flex-row md:flex-col gap-32 md:gap-0">
        {steps.map((s, i) => {
          const progress = getStepProgress(selectedFile, i, customerIds);

          return (
            <div
              key={i}
              className="flex items-center md:items-start relative mb-0 md:mb-8 mr-4 md:mr-0 cursor-pointer"
              onClick={() => setStep(i)}
            >
              <div
                className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold z-10
                  ${i === step ? 'bg-primary' : progress === 100 ? 'bg-primary' : 'bg-gray'}
                `}
              >
                {progress === 100 ? <CheckCircle size={20} /> : i + 1}
              </div>

              <div className="ml-2 md:ml-4 mt-0.5 text-sm font-medium">{s.label}</div>

              {/* Connector line */}
              {i !== steps.length - 1 && (
                <div
                  className={`flex-1 absolute md:top-9 md:left-3.5 top-5 left-32 md:w-0.5 md:h-full w-full h-0.5 ${
                    i < step ? 'bg-primary' : 'bg-gray'
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-end px-4 mb-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="whitespace-nowrap px-4 py-2 rounded cursor-pointer text-sm font-medium bg-primary text-white hover:bg-primary/70 hover:text-white"
              >
                Add Pendency
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>
                  <I8nTextWrapper text="manageFilePendencies" />
                </DialogTitle>
                <DialogDescription>
                  <I8nTextWrapper text="allPendencies" />
                </DialogDescription>
              </DialogHeader>
              <Pendencies loanApplicationNumber={'0001'} fileStatus={'Approved'} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex-1 overflow-y-auto p-4">{steps[step].component}</div>
      </div>
    </div>
  );
}
