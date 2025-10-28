import { FETCH_CUSTOMER_FILES_BY_ID_DATA } from '@/redux/actions/types';
import { RootState } from '@/redux/slices';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Associates from './associates';
import CibilScore from './cibilScore';
import FileVerification from './fileVerification';
import Photos from './photos';
import TelVerification from './telVerification';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import Pendencies from '../pendencies';
import { CheckCircle } from 'lucide-react';
import { calculateAssociatesKYCProgress, calculateCibilProgress, calculateFileVerificationProgress, calculateOverallProgress, calculateTeleVerificationProgress } from '@/utils/progress';

const steps = [
  { label: 'Photos and Documents', component: <Photos /> },
  { label: 'Associates', component: <Associates /> },
  { label: 'File Verification', component: <FileVerification /> },
  { label: 'CIBIL/CRIF/EQUIFLEX', component: <CibilScore /> },
  { label: 'Tel-Verification', component: <TelVerification /> },
];
function getStepProgress(selectedFile: any, stepIndex: number): number {
  if (!selectedFile) return 0;

  switch (stepIndex) {
    case 0:
      return calculateOverallProgress(selectedFile);
    case 1:
      return calculateAssociatesKYCProgress(selectedFile);
    case 2:
      return calculateFileVerificationProgress(selectedFile, selectedFile.verifiedSteps || []);
    case 3:
      return calculateCibilProgress(selectedFile, selectedFile.customerDetails?._id);
    case 4:
      return calculateTeleVerificationProgress(selectedFile);
    default:
      return 0;
  }
}

export default function BackOffice() {
  const [step, setStep] = useState(0);
  const { selectedFile } = useSelector((state: RootState) => state.customerFiles);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: FETCH_CUSTOMER_FILES_BY_ID_DATA });
  }, [dispatch]);

  return (
    <div className="flex flex-col md:flex-row overflow-auto gap-4">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 bg-gray-100 border-b md:border-b-0 md:border-r p-4 overflow-x-auto md:overflow-hidden flex flex-row md:flex-col gap-32 md:gap-0">
        {steps.map((s, i) => (
          <div
            key={i}
            className="flex items-center  md:items-start relative mb-0 md:mb-8 mr-4 md:mr-0 cursor-pointer "
            onClick={() => setStep(i)}
          >
            <div
              className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold z-10
    ${i === step ? 'bg-primary' : getStepProgress(selectedFile, i) === 100 ? 'bg-primary' : 'bg-gray'}
  `}
            >
              {getStepProgress(selectedFile, i) === 100 ? <CheckCircle size={20} /> : i + 1}
            </div>

            <div className="ml-2 md:ml-4 mt-0.5 text-sm font-medium">{s.label}</div>

            {/* Connector line */}
            {i !== steps.length - 1 && (
              <div
                className={`flex-1 absolute md:top-9 md:left-3.5 top-5 left-32 md:w-0.5 md:h-full w-full h-0.5 ${i < step ? 'bg-blue-900' : 'bg-gray'}`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="h-full w-full flex flex-col relative">
        <div className="flex justify-between items-center mb-6 px-4">
          <h1
            className="text-xl font-bold mb-6"
            style={{ color: selectedFile?.loanApplicationFilePayment?.amount ? '' : 'red' }}
          >
            Payment Status: <span>{selectedFile?.loanApplicationFilePayment?.amount ? 'Paid' : 'Unpaid'}</span>
          </h1>
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
        <div className="flex-1 overflow-y-auto p-4 max-h-[85%] overflow-auto relative">{steps[step].component}</div>
      </div>
    </div>

  );
}
