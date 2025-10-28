import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { RootState } from '@/redux/slices';
import { ArrowUpRight } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function Collateral() {
  const { data } = useSelector((state: RootState) => state.branchCollectionCaseNoData);
  const loanDetails = data?.data;
  return (
    <div>
      {loanDetails && (
        <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded-[16px] self-start">
          {loanDetails?.customer?.trim() !== '' && (
            <div className="flex items-center">
              <p className="text-[14px] font-semibold text-primary leading-[24px]">{loanDetails?.customer}</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="ml-2 border-none shadow-none bg-transparent px-2 py-1">
                    <ArrowUpRight />
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-6 max-w-lg">
                  <h2 className="text-2xl font-semibold">Loan Details</h2>
                  <div className="mt-4 space-y-2 text-[16px] text-[#475467]">
                    {loanDetails.vechicleNO?.trim() !== '' && <p>Vehicle No: {loanDetails.vechicleNO}</p>}
                    {loanDetails.chasisNo?.trim() !== '' && <p>Chassis No: {loanDetails.chasisNo}</p>}
                    {loanDetails.vehicleModel?.trim() !== '' && <p>Vehicle Model: {loanDetails.vehicleModel}</p>}
                    {loanDetails.vehicleMake?.trim() !== '' && <p>Vehicle Make: {loanDetails.vehicleMake}</p>}
                    {loanDetails.vehicleStatus?.trim() !== '' && <p>Vehicle Status: {loanDetails.vehicleStatus}</p>}
                    {loanDetails.Year?.trim() !== '' && <p>Year: {loanDetails.Year}</p>}
                    {loanDetails.subcategory?.trim() !== '' && <p>Subcategory: {loanDetails.subcategory}</p>}
                    {loanDetails.type?.trim() !== '' && <p>Type: {loanDetails.type}</p>}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          <h3 className="text-[18px] font-[600] leading-[28px] mt-4">Collateral</h3>
          <div className="mt-2 space-y-2 text-[16px] text-[#475467]">
            {loanDetails.vechicleNO?.trim() !== '' && <p>Vehicle No: {loanDetails.vechicleNO}</p>}
            {loanDetails.chasisNo?.trim() !== '' && <p>Chassis No: {loanDetails.chasisNo}</p>}
            {loanDetails.vehicleModel?.trim() !== '' && <p>Vehicle Model: {loanDetails.vehicleModel}</p>}
            {loanDetails.vehicleMake?.trim() !== '' && <p>Vehicle Make: {loanDetails.vehicleMake}</p>}
            {loanDetails.vehicleStatus?.trim() !== '' && <p>Vehicle Status: {loanDetails.vehicleStatus}</p>}
            {loanDetails.Year?.trim() !== '' && <p>Year: {loanDetails.Year}</p>}
            {loanDetails.subcategory?.trim() !== '' && <p>Subcategory: {loanDetails.subcategory}</p>}
            {loanDetails.type?.trim() !== '' && <p>Type: {loanDetails.type}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
