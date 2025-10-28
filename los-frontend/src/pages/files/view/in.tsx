import { FETCH_CUSTOMER_FILES_BY_ID_DATA } from '@/redux/actions/types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ArrowUpRight, Dot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DocumentTable from './documentsTable';
import BalanceOvertime from './balanceOvertime';
import { Foir, Ltv } from '@/pages/files/view/FoirAndLtv';
import Collaterals from './collaterals';
import IncomeTabs from './incomeTabes';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import PageHeader from '@/components/shared/pageHeader';
import { ICollaterals, IPerson } from '@/lib/interfaces';
import moment from 'moment';

const calculateAge = (dob: string) => {
  const date = moment(dob);
  const today = moment();
  return today.diff(date, 'years');
};

const CustomerDetailPage = () => {
  const [percentage, setPercentage] = useState<number>(0);
  const dispatch = useDispatch();
  const [reportCard, setReportCard] = useState('customer');
  const { stepsData: customer } = useSelector((state: RootState) => state.customerFiles);

  const { loading } = useSelector((state: RootState) => state.publicSlice);

  useEffect(() => {
    dispatch({ type: FETCH_CUSTOMER_FILES_BY_ID_DATA });
  }, [dispatch]);

  const loanAmount = customer?.loanAmount ?? 0;
  const totalLandValue = customer?.collateralDetails?.reduce(
    (sum: number, collateral: ICollaterals) => sum + (collateral?.landDetails?.totalLandValue ?? 0),
    0
  );
  const ltvPercentage = totalLandValue > 0 ? Number(((loanAmount / totalLandValue) * 100).toFixed(2)) : 0;

  const calculatePercentage = () => {
    const principalAmount = customer.salesManReport?.principalAmount || 0;

    const totalLandValue = customer.collateralDetails?.reduce(
      (acc: number, collateral: ICollaterals) => acc + (collateral.landDetails?.totalLandValue || 0),
      0
    );

    return totalLandValue > 0 ? ((principalAmount / totalLandValue) * 100).toFixed(2) : '0.00';
  };

  return (
    <>
      {!loading && customer && (
        <div>
          <p className="font-light text-[#475467] text-lg">
            <I8nTextWrapper text="salesManReportRatio" />: {calculatePercentage()}%
          </p>
          <PageHeader title="dashboard" />
          <div className=" w-full  p-5">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-[1%] ">
              {/* Left Section with Dashboard Cover and Content */}
              <div className="w-full sm:w-[55%]">
                <img src="/das.png" alt="Dashboard Cover" className="w-full h-[7rem] sm:h-60 object-cover rounded-lg" />

                <div className="mt-5">
                  <p className="font-semibold text-primary leading-7 text-sm sm:text-lgx">
                    <I8nTextWrapper text="fileId" />: {customer.loanApplicationNumber}
                  </p>
                  <h2 className="flex font-semibold text-[#101828] text-base sm:text-lgx lg:text-xl leading-8">
                    Applicant - {customer.customerDetails?.firstName} {customer.customerDetails?.middleName}{' '}
                    {customer.customerDetails?.lastName}({calculateAge(customer.customerDetails?.dob)})
                  </h2>
                  {customer?.customerOtherFamilyDetails?.map((person: IPerson, index: number) => (
                    <p key={index} className="text-[16px] text-[#727272]">
                      {person.customerType.charAt(0).toUpperCase() + person.customerType.slice(1)} - {person.firstName}{' '}
                      {person.middleName} {person.lastName}({calculateAge(person.dob)})
                    </p>
                  ))}
                  <div className="mt-5 flex flex-col sm:flex-row gap-2">
                    <p className="flex border border-gray-300 py-1 px-2 w-full sm:w-fit items-center rounded-md">
                      <Dot size={10} className="bg-secondary text-secondary rounded-full mr-2" />
                      Branch - {customer.fileBranch}
                    </p>

                    <p className="flex border border-gray-300 py-1 px-2 w-full sm:w-fit items-center rounded-md">
                      <Dot size={10} className="bg-secondary text-secondary rounded-full mr-2" />
                      Case created by - {customer.createdBy?.firstName} {customer.createdBy?.lastName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-[55%] flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/2 flex justify-center">
                  {/* <Foir percentage={percentage} /> */}
                  <Foir percentage={percentage} />
                </div>
                <div className="w-full sm:w-1/2 flex justify-center">
                  <Ltv ltvPercentage={ltvPercentage} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="bg-gray-50 p-4 w-full rounded-[16px] md:p-6">
              <div>
                <div className="flex">
                  <h3 className="text-[16px] md:text-[18px] font-semibold leading-[24px] md:leading-[28px]">
                    <I8nTextWrapper text="caseDetails" />
                  </h3>

                  <p>
                    <ArrowUpRight />
                  </p>
                </div>
              </div>

              <p className="text-[14px] md:text-[16px] text-[#475467] leading-[24px] md:leading-[28px]">
                <I8nTextWrapper text="caseDate" /> -{' '}
                {customer.createdAt && moment(customer.createdAt).format('DD/MM/YYYY')}
              </p>
            </div>
            <div className="bg-gray-50 p-4 w-[100%]  rounded-[16px]">
              <h1 className="text-sm text-secondary my-2">
                {customer.firstName} {customer.middleName} {customer.lastName}
              </h1>
              <h2 className="my-1 font-semibold flex justify-between text-lg">
                <I8nTextWrapper text="caseDetails" /> <ArrowUpRight />
              </h2>
              {reportCard === 'customer' && (
                <div className="space-y-1">
                  <p className="font-light text-[#475467] text-lg">
                    <I8nTextWrapper text="loanAmount" /> - {customer.loanAmount}
                  </p>

                  <p className="font-light text-[#475467] text-lg">
                    <I8nTextWrapper text="emiComfort" /> - {customer.emiComfort}
                  </p>
                  <p className="font-light text-[#475467] text-lg">
                    <I8nTextWrapper text="tenure" /> - {customer.loanTenure}
                  </p>
                  <p className="font-light text-[#475467] text-lg">
                    <I8nTextWrapper text="endUseOfMoney" /> - {customer.endUseOfMoney ?? 'N/A'}
                  </p>
                </div>
              )}
              {reportCard !== 'customer' && (
                <div className="space-y-2">
                  <p className="font-light text-[#475467] text-lg">
                    <I8nTextWrapper text="principalAmount" /> - {customer.loanAmount?.principalAmount ?? 0}
                  </p>
                  <p className="font-light text-[#475467] text-lg">
                    <I8nTextWrapper text="interestRate" />- {customer.loanAmount?.interestRate ?? 0}
                  </p>
                  <p className="font-light text-[#475467] text-lg">
                    <I8nTextWrapper text="tenure" /> - {customer.loanAmount?.loanTenure ?? 0}{' '}
                    {customer.loanAmount?.tenureType ?? 'months'}
                  </p>
                  <p className="font-light text-[#475467] text-lg">
                    <I8nTextWrapper text="EMI" /> - {customer.loanAmount?.emi ?? 0}
                  </p>
                </div>
              )}
              <Button
                variant={'outline'}
                className={' mt-3 mr-2 p-0 px-3 h-[24px]'}
                disabled={reportCard === 'customer'}
                onClick={() => setReportCard('customer')}
              >
                <Dot className="text-secondary bg-secondary rounded-full mr-2" size={7} />{' '}
                <I8nTextWrapper text="customer" />
              </Button>
              <Button
                variant={'outline'}
                className={' mt-3 mr-2 p-0 px-3 h-[24px]'}
                disabled={reportCard === 'loanAmount'}
                onClick={() => setReportCard('loanAmount')}
              >
                <Dot className="text-secondary bg-secondary rounded-full mr-2" size={7} />{' '}
                <I8nTextWrapper text="salesMan" />
              </Button>
            </div>
            <div className=" sm:top-[150%] md:top-[-18%] lg:top-[-20%] xl:top-[-26%] xl:left-[75%] sm:left-[67%] ">
              {/* <IncomeTabs customer={customer} /> */}
              <IncomeTabs customer={customer} setPercentage={setPercentage} />
            </div>
          </div>

          <div className=" sm:px-6 lg:px-8 mt-5">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2 ">
                <DocumentTable customer={customer} />
              </div>
              <div className="w-full md:w-1/2">
                <BalanceOvertime />
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col  mt-10 lg:flex-row gap-6">
            <div className="w-full lg:w-2/3 bg-[#F1F3F5] p-7 rounded-md h-fit">
              <p className="font-sans text-lg font-semibold leading-7 text-left">
                {' '}
                <I8nTextWrapper text="comments" />
              </p>
              <p className="text-md font-normal font-inter text-left leading-6">{customer?.approveOrRejectRemarks}</p>
            </div>

            <div className="w-full lg:w-1/3">
              <Collaterals customer={customer} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerDetailPage;
