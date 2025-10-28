import { ROUTES, STEPS_NAMES } from '@/lib/enums';
import PageHeader from '@/components/shared/pageHeader';
import { RootState } from '@/redux/store';
import { resetStepperForm, setActiveStep } from '@/redux/slices/files';
import { BookOpen, HandCoins, Image, IndianRupee, Landmark, MapPinHouse, User, Users } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Address from './address';
import Associate from './associate';
import Bank from './bank';
import CollateralsAndLoans from './collateralsAndLoans';
import Customer from './customer';
import Income from './income';
import Liability from './liability';
import Photos from './photos';
import { StepBarDesktop, StepBarMobile } from './stepbar';
import { buildOrgRoute } from '@/helpers/routeHelper';

export default function FileSteps() {
  const { activeStep, completedSteps, stepsData } = useSelector((state: RootState) => state.customerFiles);

  const steps = [
    { name: 'Customer', icon: <User width={17} /> },
    { name: 'Address', icon: <MapPinHouse width={17} /> },
    { name: 'Associate', icon: <Users width={17} /> },
    { name: 'Income', icon: <IndianRupee width={17} /> },
    { name: 'Liability', icon: <BookOpen width={17} /> },
    { name: 'Collateral', icon: <HandCoins width={17} /> },
    { name: 'Bank', icon: <Landmark width={17} /> },
    { name: 'Photos', icon: <Image width={17} /> },
  ];
  const dispatch = useDispatch();
  const handleStepChange = (step: string) => {
    dispatch(setActiveStep(step));
  };
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const isEditForm = queryParams.get('edit');
  const formId = queryParams.get('id');
  useEffect(() => {
    if (isEditForm && !formId) {
      navigate({
        pathname: buildOrgRoute(ROUTES.CUSTOMER_FILE_MANAGEMENT),
      });
    }
    if (!isEditForm) {
      dispatch(resetStepperForm());
    }
  }, [dispatch, formId, isEditForm, navigate]);
  return (
    <div className="md:space-y-20 space-y-5 h-full w-full">
      <PageHeader
        title={`Customer Details  ${stepsData?.loanApplicationNumber ? `(FI :${String(stepsData.loanApplicationNumber).padStart(4, '0')})` : ''}`}
      />
      <StepBarMobile
        steps={steps}
        activeStep={activeStep}
        completedSteps={completedSteps}
        handleStepChange={handleStepChange}
        stepsData={stepsData}
      />
      <StepBarDesktop
        steps={steps}
        activeStep={activeStep}
        completedSteps={completedSteps}
        handleStepChange={handleStepChange}
        stepsData={stepsData}
        STEPS_NAMES={STEPS_NAMES}
      />
      <div className=" max-md:gap-3 flex justify-between md:items-center relative">
        <div className="h-[80%] md:h-[70%]  max-md:h-[70vh] overflow-auto w-full">
          {activeStep == STEPS_NAMES.CUSTOMER && <Customer />}
          {activeStep == STEPS_NAMES.ADDRESS && <Address />}
          {activeStep == STEPS_NAMES.INCOME && <Income />}
          {activeStep == STEPS_NAMES.ASSOCIATE && <Associate />}
          {activeStep == STEPS_NAMES.LIABILITY && <Liability />}
          {activeStep == STEPS_NAMES.COLLATERAL && <CollateralsAndLoans />}
          {activeStep == STEPS_NAMES.BANK && <Bank />}
          {activeStep == STEPS_NAMES.PHOTOS && <Photos />}
        </div>
      </div>
    </div>
  );
}
