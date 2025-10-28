import { Button } from '@/components/ui/button';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import { ArrowUpRight, Dot } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Collaterals({ customer }: { customer: any }) {
  const [collateral, setCollateral] = useState<any>({});
  useEffect(() => {
    customer?.collateralDetails &&
      setCollateral(
        customer.collateralDetails[0]?.collateralType == 'land'
          ? customer.collateralDetails[0]?.landDetails
          : customer.collateralDetails[0]?.vehicleDetails
      );
  }, []);

  return (
    <>
      {collateral && (
        <div className="p-5 bg-[#F1F3F5] rounded-2xl m-auto  px-12">
          <h1 className="font-inter font-semibold text-lg leading-7 my-7 flex justify-between">
            <I8nTextWrapper text="collateral" />
            <ArrowUpRight />
          </h1>
          <div className="text-sm space-y-3 mb-3">
            <p className="my-2 text-secondary text-[14px] font-bold">
              <I8nTextWrapper text="ownerName" />: {collateral?.ownerName?.firstName}
            </p>
            <p className="text-lg font-semibold font-inter leading-28 text-left my-4">
              <I8nTextWrapper text="associateType" />:{' '}
              {customer?.customerOtherFamilyDetails?.find(
                (item: any) => item?.customerDetails == collateral?.ownerName?._id
              )?.relation || 'Self'}
            </p>
            {collateral?.documentType && (
              <div>
                <p>
                  <I8nTextWrapper text="documentType" />: {collateral?.documentType}
                </p>
                <p>
                  <I8nTextWrapper text="valuation" />: ₹ {collateral?.totalLandValue}
                </p>
                <p>
                  <I8nTextWrapper text="constructionArea" />: {collateral?.constructionArea}{' '}
                  {collateral?.constructionAreaUnit}
                </p>
              </div>
            )}
            {collateral?.vehicleDetails && (
              <div>
                <p>
                  <I8nTextWrapper text="companyName" />: {collateral?.vehicleDetails.companyName}
                </p>
                <p>
                  {' '}
                  <I8nTextWrapper text="valuation" />: ₹ {collateral?.value}
                </p>
                <p>
                  {' '}
                  <I8nTextWrapper text="registrationNumber" />: {collateral?.vehicleDetails?.registrationNumber}{' '}
                </p>
              </div>
            )}
          </div>
          <div className="max-w-xl overflow-x-auto space-x-3">
            {customer.collateralDetails &&
              customer.collateralDetails?.map((item: any, index: number) => (
                <Button
                  key={index}
                  variant={'outline'}
                  onClick={() => setCollateral(item.collateralType == 'land' ? item.landDetails : item.vehicleDetails)}
                  className={'my-2'}
                >
                  <Dot size={10} className="text-secondary bg-secondary  rounded-full mr-2 " />{' '}
                  {item.collateralType == 'land'
                    ? `${item?.landDetails?.ownerName?.firstName} ${item.landDetails?.ownerName?.lastName || ''}`
                    : `${item?.vehicleDetails?.ownerName?.firstName} ${item.vehicleDetails?.ownerName?.lastName || ''}`}
                </Button>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
