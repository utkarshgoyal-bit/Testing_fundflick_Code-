import { Checkbox } from '@/components/ui/checkbox';
import hasPermission from '@/helpers/hasPermission';
import { PERMISSIONS } from '@/helpers/permissions';
import urlQueryParams from '@/helpers/urlQueryParams';
import { cn } from '@/lib/utils';
import { VERIFY_FORM_STEP } from '@/redux/actions/types';
import { useDispatch } from 'react-redux';

export default function VerifyStepData({ stepName, stepsData }: { stepName: string; stepsData: any }) {
  const dispatch = useDispatch();
  const isVerified = stepsData?.verifiedSteps?.find((item: any) => item.step === stepName)?.isVerified;
  const isBackOffice = urlQueryParams('component');
  if (!hasPermission(PERMISSIONS.CUSTOMER_FILE_BACK_OFFICE)) return null;
  if (isBackOffice !== 'back_office') return null;
  return (
    <div
      className={cn(
        'flex justify-center items-center gap-2 border px-5 rounded-md  h-11',
        isVerified ? 'bg-success text-white' : 'bg-destructive text-white'
      )}
    >
      <Checkbox
        id="terms8"
        className="w-6 h-6 text-xl border-white border-2"
        checked={isVerified}
        onCheckedChange={(status) => {
          dispatch({
            type: VERIFY_FORM_STEP,
            payload: {
              fileId: stepsData.loanApplicationNumber,
              step: stepName,
              isVerified: status,
            },
          });
        }}
      />
      <label
        htmlFor="terms8"
        className="text-sm cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {isVerified ? 'Verified' : 'Mark as verified'}
      </label>
    </div>
  );
}
