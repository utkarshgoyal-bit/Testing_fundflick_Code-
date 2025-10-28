import { Checkbox } from '@/components/ui/checkbox';
import { ROUTES } from '@/lib/enums';
import { RootState } from '@/redux/store';
import { setActiveStep } from '@/redux/slices/files';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { steps } from '@/constants/constants';
import { buildOrgRoute } from '@/helpers/routeHelper';
import ProgressBar from './progressbar';
import { calculateFileVerificationProgress } from '@/utils/progress';

export default function FileVerification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedFile } = useSelector((state: RootState) => state.customerFiles);
  const isVerified = (stepName: string) =>
    selectedFile?.verifiedSteps?.find((item: { step: string; isVerified: boolean }) => item.step === stepName)
      ?.isVerified;
  const navigateToCustomerFile = (stepName: string) => {
    dispatch(setActiveStep(stepName));
    navigate({
      pathname: buildOrgRoute(ROUTES.CUSTOMER_FILE_MANAGEMENT_REGISTER),
      search: `?edit=true&id=${selectedFile?._id}&component=back_office`,
    });
  };
  const verificationPercent = calculateFileVerificationProgress(selectedFile, steps);
  return (
    <div className="space-y-4">
       <ProgressBar label="Verification Progress" percentage={verificationPercent} />
    <div className="grid grid-cols-2 gap-4">
      {steps.map((step) => (
        <div key={step.name} className="flex items-top space-x-3">
          <Checkbox
            id={step.name}
            checked={isVerified(step.name)}
            className="w-6 h-6 text-xl"
            onClick={() => navigateToCustomerFile(step.name)}
          />
          <div className="grid gap-1 leading-none">
            <label
              htmlFor={step.name}
              className="text-sm cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {step.label}
            </label>
            <p className="text-sm cursor-pointer text-muted-foreground">{step.label} details are verified</p>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}
