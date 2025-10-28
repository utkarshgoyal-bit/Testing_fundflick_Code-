import { buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { RootState } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AssociateForm from '@/pages/files/steps/associate/form';
import { GET_CUSTOMER_ASSOCIATES_DATA } from '@/redux/actions/types';
import CustomerDetails from '@/pages/files/steps/customer';
import { setBackOfficeAssociateDialog } from '@/redux/slices/files';
import ProgressBar from './progressbar';
import { calculateAssociatesKYCProgress } from '@/utils/progress';
// const maskAadhar = (aadhar: string) => {
//   return aadhar ? aadhar.slice(0, 8) + " ****" : "****";
// };

function MaksedAadharsAssociates({ associate }: { associate: any }) {
  const [aadharInput, setAadharInput] = useState<string>('');
  const [isValid, setIsValid] = useState(false);
  console.log(associate);
  const validateAadhar = (masked: string, original: string) => {
    if (original === masked) {
      return setIsValid(true);
    }
    return setIsValid(false);
  };

  const handleAadhaarInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4 && value.length <= 8) {
      value = value.replace(/(\d{4})(\d+)/, '$1-$2');
    } else if (value.length > 8) {
      value = value.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3');
    }
    setAadharInput(value);
    if (value.length === 14) {
      validateAadhar(value, associate.customerDetails.aadhaarNumber);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-all">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-lg font-semibold">
              {associate.customerDetails.firstName || ''} {associate.customerDetails.middleName || ''}{' '}
              {associate.customerDetails.lastName || ''}
            </p>
            <p className="text-sm text-gray-500">
              {associate.customerType[0]?.toUpperCase() + associate.customerType.slice(1)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 text-right">
              {associate.relation[0]?.toUpperCase() + associate.relation.slice(1)}
            </p>
            <p className="text-sm text-gray-500">DOB: {associate.dob || 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
          <p className="font-medium">Aadhar: </p>
          <p className="font-medium text-gray-700">
            {isValid ? associate.customerDetails.aadhaarNumber : '**** - ****- ****'}
          </p>
        </div>

        <div className="mb-2">
          <label
            htmlFor={`aadhar-input-${associate.customerDetails.aadhaarNumber}`}
            className="block text-sm text-gray-600"
          >
            Enter Full Aadhaar Number:
          </label>
          <input
            id={`aadhar-input-${associate.customerDetails.aadhaarNumber}`}
            placeholder="Enter Full Aadhaar Number"
            type="text"
            maxLength={14}
            value={aadharInput}
            onChange={handleAadhaarInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-1/2 text-sm"
          />
        </div>

        <div className="text-xs mt-2">
          {aadharInput.length === 14 && (
            <p className={`font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
              IValidation: {isValid ? 'Valid' : 'Invalid'}
            </p>
          )}
          {aadharInput.length === 14 && !isValid && (
            <Dialog>
              <DialogTrigger className={cn(buttonVariants({ variant: 'default' }))}>Edit Details</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Details</DialogTitle>
                  <DialogDescription>Edit associate details</DialogDescription>
                  <AssociateForm
                    address={associate.address}
                    status={associate.status}
                    defaultValuesData={{ associate }}
                  />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}
function MaksedAadharsCustomer({ customer }: { customer: any }) {
  const dispatch = useDispatch();
  const [aadharInput, setAadharInput] = useState<string>('');
  const [isValid, setIsValid] = useState(false);
  const { backOfficeAssociateDialog } = useSelector((state: RootState) => state.customerFiles);

  const validateAadhar = (masked: string, original: string) => {
    if (original === masked) {
      return setIsValid(true);
    }
    return setIsValid(false);
  };

  const handleAadhaarInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4 && value.length <= 8) {
      value = value.replace(/(\d{4})(\d+)/, '$1-$2');
    } else if (value.length > 8) {
      value = value.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3');
    }
    setAadharInput(value);
    if (value.length === 14) {
      validateAadhar(value, customer.aadhaarNumber);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-all">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-lg font-semibold">
              {customer?.firstName || ''} {customer?.middleName || ''} {customer?.lastName || ''}
            </p>
            <p className="text-sm text-gray-500">Self</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 text-right">Self</p>
            <p className="text-sm text-gray-500">DOB: {customer?.dob || 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
          <p className="font-medium">Aadhar: </p>
          <p className="font-medium text-gray-700">{isValid ? customer?.aadhaarNumber : '**** - ****- ****'}</p>
        </div>

        <div className="mb-2">
          <label htmlFor={`aadhar-input-${customer?.aadhaarNumber}`} className="block text-sm text-gray-600">
            Enter Full Aadhaar Number:
          </label>
          <input
            id={`aadhar-input-${customer?.aadhaarNumber}`}
            placeholder="Enter Full Aadhaar Number"
            type="text"
            maxLength={14}
            value={aadharInput}
            onChange={handleAadhaarInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-1/2 text-sm"
          />
        </div>

        <div className="text-xs mt-2">
          {aadharInput.length === 14 && (
            <p className={`font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
              IValidation: {isValid ? 'Valid' : 'Invalid'}
            </p>
          )}
          {aadharInput.length === 14 && !isValid && (
            <Dialog
              open={backOfficeAssociateDialog}
              onOpenChange={(open) => dispatch(setBackOfficeAssociateDialog(open))}
            >
              <DialogTrigger className={cn(buttonVariants({ variant: 'default' }))}>Edit Details</DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-auto ">
                <DialogHeader>
                  <DialogTitle>Edit Details</DialogTitle>
                  <DialogDescription>Edit associate details</DialogDescription>
                </DialogHeader>
                <CustomerDetails />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Associates() {
  const dispatch = useDispatch();
  const { associates } = useSelector((state: RootState) => state.fileAssociates);
  useEffect(() => {
    dispatch({ type: GET_CUSTOMER_ASSOCIATES_DATA });
  }, []);
  const kycPercent  = calculateAssociatesKYCProgress(associates); 
  const order = {
    'co-applicant': 0,
    guarantor: 1,
    reference: 2,
  };

  // Create a shallow copy of the array and then sort it
  const sortedAssociates = associates?.customerOtherFamilyDetails
    ? [...associates.customerOtherFamilyDetails].sort((a: any, b: any) => {
        return (order as any)[a.customerType] - (order as any)[b.customerType];
      })
    : [];

  return (
    <div className="space-y-2">
      <ProgressBar label="KYC Progress" percentage={kycPercent} />
      <MaksedAadharsCustomer customer={associates.customerDetails} />
      {sortedAssociates?.map((associate: any, index: number) => (
        <MaksedAadharsAssociates key={index} associate={{ ...associate, status: associates.status }} />
      ))}
    </div>
  );
}


