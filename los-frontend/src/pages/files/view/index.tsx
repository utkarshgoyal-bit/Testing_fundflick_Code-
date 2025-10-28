import { FETCH_CUSTOMER_FILES_BY_ID_DATA } from '@/redux/actions/types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ArrowLeft, ArrowUpRight, CheckCircle, Clock, Dot, HelpCircle, RefreshCw, Eye, ClipboardList, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DocumentTable from './documentsTable';
import BalanceOvertime from './balanceOvertime';
import { Foir, Ltv } from '@/pages/files/view/FoirAndLtv';
import IncomeTabs from './incomeTabes';
import Collaterals from './collaterals';
import { Link, useNavigate } from 'react-router-dom';
import { ROLES_ENUM, ROUTES, STEPS_NAMES } from '@/lib/enums';
import { setActiveStep, setStepsData } from '@/redux/slices/files';
import { isAdmin, isSalesMan, isSuperAdmin } from '@/helpers/checkUserRole';
import { isFileStatusPending } from '@/utils/checkFileStatus';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import moment from 'moment';
import { buildOrgRoute } from '@/helpers/routeHelper';
import Stepper from './stepper';
import { exportCustomerToExcel } from '@/utils/excelSheet';




function calculateAge(dob: string) {
  const dobDate = moment(dob);
  const today = moment();

  const age = today.diff(dobDate, 'years');

  return age;
}

const CustomerDetailPage = () => {
  const dispatch = useDispatch();
  const [reportCard, setReportCard] = useState('customer');
  const { selectedFile: customer } = useSelector((state: RootState) => state.customerFiles);
  const { role } = useSelector((state: RootState) => state.login);
  const { loading } = useSelector((state: RootState) => state.publicSlice);

  useEffect(() => {
    dispatch({ type: FETCH_CUSTOMER_FILES_BY_ID_DATA });
  }, []);

  const loanAmount = customer?.loanAmount ?? 0;
  const totalLandValue = customer?.collateralDetails?.reduce(
    (sum: number, collateral: any) => sum + (collateral?.landDetails?.totalLandValue ?? 0),
    0
  );
  const ltvPercentage = totalLandValue > 0 ? Number(((loanAmount / totalLandValue) * 100).toFixed(2)) : 0;

  const calculatePercentage = () => {
    const principalAmount = customer.salesManReport?.principalAmount || 0;
    const totalLandValue = customer.collateralDetails?.reduce(
      (acc: number, collateral: any) => acc + (collateral.landDetails?.totalLandValue || 0),
      0
    );

    return totalLandValue > 0 ? ((principalAmount / totalLandValue) * 100).toFixed(2) : '0.00';
  };

  const [percentage, setPercentage] = useState<number>(0);
  const [ltvDisplay, setLtvDisplay] = useState<number>(ltvPercentage);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCaseDetails, setIsOpenCaseDetails] = useState(false);
  const [isOpenLoanDetails, setIsOpenLoanDetails] = useState(false);

  useEffect(() => {
    if (reportCard === 'customer') {
      setLtvDisplay(ltvPercentage);
    } else {
      setLtvDisplay(parseFloat(calculatePercentage()));
    }
  }, [reportCard, ltvPercentage]);

  const navigate = useNavigate();

  const insuranceExp = customer.loanApplicationFilePayment?.insuranceAmount || 0;
  const valuationExp = customer.loanApplicationFilePayment?.valuationAmount || 0;
  const legalExp = customer.loanApplicationFilePayment?.legalAmount || 0;

  const totalExp = insuranceExp + valuationExp + legalExp;

  const loginCharges = customer.loanApplicationFilePayment?.amount || 0;
  const fileCharges = customer.emiComfort || 0;
  const otherCharges = customer.loanTenure || 0;

  const totalCharges = loginCharges + fileCharges + otherCharges;
  const statusOptions = [
    { label: 'pending', value: 'pending', icon: <Clock size={20} color='gray' /> },
    { label: 'review', value: 'review', icon: <Eye size={20} color='gray' /> },
    { label: 'task pending', value: 'task pending', icon: <ClipboardList size={20} color='gray' /> },
    { label: 'approved', value: 'approved', icon: <CheckCircle size={20} color='gray' /> },
    { label: 'rejected', value: 'rejected', icon: <XCircle size={20} color='gray' /> }
  ];


  return (
    <>
      {!loading && customer && (
        <div>
          <div className="relative flex items-center w-full">
            {/* Back & Reload Buttons (left aligned) */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center p-2 text-primary"
                aria-label="Go Back"
              >
                <ArrowLeft size={20} />
              </button>

              <button
                onClick={() => window.location.reload()}
                className="flex items-center text-primary justify-center p-2"
                aria-label="Reload Page"
              >
                <RefreshCw size={20} />
              </button>
            </div>

            {/* Stepper centered with more width */}
            <Stepper currentStatus={customer?.status ?? ""} steps={statusOptions} />


          </div>

          <header className="flex flex-wrap items-center justify-between mt-6 mb-6 px-4 sm:px-6 lg:px-10">
            <h1 className="text-[20px] sm:text-[24px] lg:text-[30px] font-[600] leading-[28px] sm:leading-[30px] lg:leading-[38px] mb-4 sm:mb-0">
              <I8nTextWrapper text="overview" />
            </h1>
            <div className="flex gap-4 flex-wrap">
              <Button
                className="flex items-center justify-center gap-2 bg-white text-[#344054] font-semibold border border-gray-300 rounded-md px-2 py-2 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 w-auto sm:w-[101px] lg:w-[120px] h-auto sm:h-[30px] lg:h-[33px]"
                aria-label="Import data"
                 onClick={() => customer && exportCustomerToExcel(customer)}
              >
                <img src="/uploadcloud.png" alt="Upload Icon" className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5" />
                <span className="text-[12px] sm:text-[14px] lg:text-[16px]">Download</span>
              </Button>
              <div className="flex relative">
                {((isSalesMan(role as ROLES_ENUM) && isFileStatusPending(customer?.status)) ||
                  isAdmin(role as ROLES_ENUM) ||
                  isSuperAdmin(role as ROLES_ENUM)) && (
                    <Button
                      className="flex items-center justify-center gap-2 bg-primary text-white font-semibold border border-transparent rounded-md 
                  px-2 py-1 sm:px-2 sm:py-1.5 lg:px-3 lg:py-2 w-auto sm:w-[130px] lg:w-[150px] h-auto sm:h-[34px] lg:h-[30px]"
                    aria-label="Allocated to"
                    onClick={() => {
                      dispatch(setStepsData(customer));
                      dispatch(setActiveStep(STEPS_NAMES.ASSOCIATE));
                      navigate(
                        buildOrgRoute(`${ROUTES.CUSTOMER_FILE_MANAGEMENT_REGISTER}?edit=true&id=${customer?._id}`)
                      );
                    }}
                  >
                    <span className="text-[12px] sm:text-[13px] lg:text-[14px]">+ Add Associate</span>
                  </Button>
                )}
              </div>
            </div>
          </header>
          <div className=" w-full  p-5">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-[1%] ">
              <div className="w-full sm:w-[55%]">
                <img src="/das.png" alt="Dashboard Cover" className="w-full h-[7rem] sm:h-60 object-cover rounded-lg" />
                <div className="mt-5 ">
                  <div className="flex items-center">
                    <p className="font-semibold text-primary leading-7 text-sm sm:text-lgx">
                      <I8nTextWrapper text="fileId" />: {String(customer.loanApplicationNumber).padStart(4, '0')}
                    </p>
                    <Link to="#" className="ml-10 sm:ml-[4rem]" onClick={() => setIsOpen(true)}>
                      <ArrowUpRight />
                    </Link>

                    {isOpen && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white w-full h-full p-6 relative">
                          {/* Close Button */}
                          <button className="absolute top-4 right-6 text-xl font-bold" onClick={() => setIsOpen(false)}>
                            ✖
                          </button>

                          {/* File ID */}
                          <p className="font-semibold text-primary leading-7 text-xl sm:text-lgx">
                            <I8nTextWrapper text="fileId" />: {String(customer.loanApplicationNumber).padStart(4, '0')}
                          </p>

                          {/* Customer Info */}
                          <h2 className="text-2xl font-semibold mb-4">
                            {' '}
                            <I8nTextWrapper text="customerDetails" />
                          </h2>
                          <div className="flex flex-wrap items-center text-sm sm:text-md md:text-lg mb-4">
                            <h2 className="font-semibold text-lg sm:text-xl">
                              <I8nTextWrapper text="applicant" />:{'  '}
                              {customer.customerDetails?.firstName} {customer.customerDetails?.middleName}{' '}
                              {customer.customerDetails?.lastName} ({calculateAge(customer.customerDetails?.dob)})
                            </h2>
                          </div>

                          <h2>
                            <span>
                              <I8nTextWrapper text="phone" />:
                            </span>{' '}
                            <a
                              href={`tel:+${customer.customerDetails?.phone}`}
                              className="text-blue-600 hover:underline"
                            >
                              {customer.customerDetails?.phone
                                ? `+${customer.customerDetails?.phone.replace(/^(91)(\d{5})(\d+)/, '$1 $2-$3')}`
                                : 'N/A'}
                            </a>
                            <br />
                            <span>
                              <I8nTextWrapper text="email" />:
                            </span>{' '}
                            <a
                              href={`mailto:${customer.customerDetails?.email}`}
                              className="text-blue-600 hover:underline"
                            >
                              {customer.customerDetails?.email || 'N/A'}
                            </a>
                          </h2>

                          {/* Address Section */}
                          {customer.address?.map((addr: any, index: number) => (
                            <div key={index} className="mt-2 p-4 border-b bg-gray-100 rounded-lg">
                              <p>
                                <strong>
                                  <I8nTextWrapper text="plotNo" />:
                                </strong>{' '}
                                {addr.pltNo}
                              </p>
                              <p>
                                <strong>
                                  <I8nTextWrapper text="fullAddress" />:
                                </strong>{' '}
                                {addr.addressLine}
                              </p>
                              <p>
                                <strong>
                                  <I8nTextWrapper text="gpsCoordinates" />:
                                </strong>{' '}
                                {addr.gpsCoordinates}
                              </p>
                              <Link
                                to={`https://www.google.com/maps?q=${addr.gpsCoordinates}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                              >
                                <I8nTextWrapper text="viewMap" />
                              </Link>
                            </div>
                          ))}

                          {/* Other Family Members */}
                          <h2 className="text-xl font-semibold mt-6">
                            <I8nTextWrapper text="familyMembers" />{' '}
                          </h2>
                          <div className="mt-2">
                            {customer?.customerOtherFamilyDetails?.map((person: any, index: number) => (
                              <p key={index} className="text-[16px] text-[#727272] mt-2">
                                <strong>
                                  {person.customerType.charAt(0).toUpperCase() + person.customerType.slice(1)}
                                </strong>{' '}
                                - {person.customerDetails.firstName} {person.customerDetails.middleName}{' '}
                                {person.customerDetails.lastName} ({calculateAge(person.customerDetails.dob)}){' '}
                                <strong>
                                  <I8nTextWrapper text="phone" />:
                                </strong>{' '}
                                <a
                                  href={`tel:+${person.customerDetails.phone}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {person.customerDetails?.phone
                                    ? `+${person.customerDetails.phone.replace(/^(91)(\d{5})(\d+)/, '$1 $2-$3')}`
                                    : 'N/A'}
                                </a>
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <h2 className="flex font-semibold text-[#101828] text-base sm:text-lgx lg:text-xl leading-8">
                    <I8nTextWrapper text="applicant" /> - {customer.customerDetails?.firstName}{' '}
                    {customer.customerDetails?.middleName} {customer.customerDetails?.lastName}(
                    {calculateAge(customer.customerDetails?.dob)})
                  </h2>
                  {customer?.customerOtherFamilyDetails?.map((person: any, index: number) => (
                    <p key={index} className="text-[16px] text-[#727272]">
                      {person.customerType.charAt(0).toUpperCase() + person.customerType.slice(1)} -{' '}
                      {person.customerDetails.firstName} {person.customerDetails.middleName}{' '}
                      {person.customerDetails.lastName}({calculateAge(person.customerDetails.dob)})
                    </p>
                  ))}
                  <div className="mt-5 flex flex-col sm:flex-row gap-2">
                    <p className="flex border border-gray-300 py-1 px-2 w-full sm:w-fit items-center rounded-md">
                      <Dot size={10} className="bg-secondary text-secondary rounded-full mr-2" />
                      <I8nTextWrapper text="branch" /> - {customer.fileBranch}
                    </p>

                    <p className="flex border border-gray-300 py-1 px-2 w-full sm:w-fit items-center rounded-md">
                      <Dot size={10} className="bg-secondary text-secondary rounded-full mr-2" />
                      <I8nTextWrapper text="familyMembers" />
                      Case created by - {customer.createdBy?.firstName} {customer.createdBy?.lastName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-[55%] flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/2 flex justify-center">
                  <Foir percentage={percentage} />
                </div>
                <div className="w-full sm:w-1/2 flex justify-center">
                  <Ltv ltvPercentage={ltvDisplay} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="bg-gray-50 p-4 w-full rounded-[16px] md:p-6">
              <div>
                <h2 className="my-1 font-semibold flex justify-between text-lg">
                  <I8nTextWrapper text="caseDetails" />
                  <Link to="#" className="ml-10 sm:ml-[4rem]" onClick={() => setIsOpenCaseDetails(true)}>
                    <ArrowUpRight />
                  </Link>
                </h2>
                {isOpenCaseDetails && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-full h-full p-6 relative">
                      {/* Close Button */}
                      <button
                        className="absolute top-4 right-6 text-xl font-bold"
                        onClick={() => setIsOpenCaseDetails(false)}
                      >
                        ✖
                      </button>
                      <p className="text-[14px] md:text-[16px] text-[#475467] leading-[24px] md:leading-[28px]">
                        <I8nTextWrapper text="caseDate" /> -{' '}
                        {customer.createdAt && moment(customer.createdAt).format('DD/MM/YYYY')}
                      </p>
                    </div>
                  </div>
                )}
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
              <div>
                <h2 className="my-1 font-semibold flex justify-between text-lg">
                  <I8nTextWrapper text="caseDetails" />
                  <Link to="#" className="ml-10 sm:ml-[4rem]" onClick={() => setIsOpenLoanDetails(true)}>
                    <ArrowUpRight />
                  </Link>
                </h2>
                {isOpenLoanDetails && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 sm:p-6">
                    <div className="bg-white w-full max-w-4xl h-auto max-h-[90vh] overflow-y-auto p-6 relative rounded-lg shadow-lg">
                      <button
                        className="absolute top-4 right-6 text-xl font-bold"
                        onClick={() => setIsOpenLoanDetails(false)}
                      >
                        ✖
                      </button>

                      <p className="font-semibold text-primary leading-7 text-lg sm:text-xl">
                        <I8nTextWrapper text="fileId" />: {String(customer.loanApplicationNumber).padStart(4, '0')}
                      </p>
                      <hr className="my-4" />

                      <h1 className="underline text-lg sm:text-xl">
                        <I8nTextWrapper text="customerDemand" />
                      </h1>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-1 gap-4">
                        <div>
                          <p className="font-light text-[#475467] text-base sm:text-lg">
                            <I8nTextWrapper text="loanAmount" />- {customer.loanAmount}
                          </p>
                          <p className="font-light text-[#475467] text-base sm:text-lg">
                            <I8nTextWrapper text="emiComfort" /> - {customer.emiComfort}
                          </p>
                          <p className="font-light text-[#475467] text-base sm:text-lg">
                            <I8nTextWrapper text="tenure" /> - {customer.loanTenure}
                          </p>
                          <p className="font-light text-[#475467] text-base sm:text-lg">
                            <I8nTextWrapper text="emi" /> - {customer.endUseOfMoney ?? 'N/A'}
                          </p>
                        </div>

                        <div className="w-full p-4 bg-white shadow-lg rounded-lg border border-gray-200">
                          <h2 className="text-lg font-semibold text-gray-700">
                            <I8nTextWrapper text="charges" />
                          </h2>

                          <p className="text-sm text-gray-500 mt-2">
                            <I8nTextWrapper text="loginCharges" />: <span className="font-medium">{loginCharges}</span>{' '}
                            + GST
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            <I8nTextWrapper text="fileCharges" />: <span className="font-medium">{fileCharges}</span> +
                            GST
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            <I8nTextWrapper text="otherCharges" />: <span className="font-medium">{otherCharges}</span>{' '}
                            + GST
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            <span className="font-medium">
                              <I8nTextWrapper text="totalCharges" />:
                            </span>{' '}
                            {totalCharges} + GST
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-1 gap-4">
                        <div className="w-full p-4 bg-white shadow-lg rounded-lg border border-gray-200">
                          <h2 className="text-lg font-semibold text-gray-700">
                            <I8nTextWrapper text="expenses" />
                          </h2>

                          <p className="text-sm text-gray-500 mt-2">
                            <I8nTextWrapper text="insuranceExp" />: <span className="font-medium">{insuranceExp}</span>{' '}
                            + GST
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            <I8nTextWrapper text="valuationExp" />: <span className="font-medium">{valuationExp}</span>{' '}
                            + GST
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            <I8nTextWrapper text="legalExp" />: <span className="font-medium">{legalExp}</span> + GST
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            <span className="font-medium">
                              {' '}
                              <I8nTextWrapper text="totalExp" />:
                            </span>{' '}
                            {totalExp} + GST
                          </p>
                        </div>
                      </div>

                      <hr className="my-6" />
                      <h1 className="underline text-lg sm:text-xl">
                        <I8nTextWrapper text="salesRecommendation" />
                      </h1>
                      <div className="mt-3 space-y-2">
                        <p className="font-light text-[#475467] text-base sm:text-lg">
                          <I8nTextWrapper text="principalAmount" /> - {customer.salesManReport?.principalAmount ?? 0}
                        </p>
                        <p className="font-light text-[#475467] text-base sm:text-lg">
                          <I8nTextWrapper text="interestRate" /> - {customer.salesManReport?.interestRate ?? 0}
                        </p>
                        <p className="font-light text-[#475467] text-base sm:text-lg">
                          <I8nTextWrapper text="emi" /> - {(customer.salesManReport?.emi ?? 0).toFixed(2)}
                        </p>
                        <p className="flex font-light text-[#475467] text-base sm:text-lg">
                          IIR - {customer.salesManReport?.loanTenure ?? 0}{' '}
                          {customer.salesManReport?.tenureType ?? 'months'}
                          <HelpCircle className="ml-1 w-4" />
                        </p>
                        <p className="flex font-light text-[#475467] text-base sm:text-lg">
                          APR - {customer.salesManReport?.loanTenure ?? 0}{' '}
                          {customer.salesManReport?.tenureType ?? 'months'}
                          <HelpCircle className="ml-1 w-4" />
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {reportCard === 'customer' && (
                <div className="space-y-1">
                  <p className="font-light text-[#475467] text-lg">
                    {' '}
                    <I8nTextWrapper text="loanAmount" /> - {customer.loanAmount}
                  </p>
                  <p className="font-light text-[#475467] text-lg">
                    {' '}
                    <I8nTextWrapper text="emiComfort" /> - {customer.emiComfort}
                  </p>
                  <p className="font-light text-[#475467] text-lg">
                    {' '}
                    <I8nTextWrapper text="tenure" /> - {customer.loanTenure}
                  </p>
                  <p className="font-light text-[#475467] text-lg">
                    {' '}
                    <I8nTextWrapper text="emi" /> - {customer.endUseOfMoney ?? 'N/A'}
                  </p>
                </div>
              )}
              {reportCard !== 'customer' && (
                <div className="space-y-2">
                  <p className="font-light text-[#475467] text-lg">
                    <I8nTextWrapper text="principalAmount" /> - {customer.salesManReport?.principalAmount ?? 0}
                  </p>
                  <p className="font-light text-[#475467] text-lg">
                    <I8nTextWrapper text="interestRate" /> - {customer.salesManReport?.interestRate ?? 0}
                  </p>
                  <p className="font-light text-[#475467] text-lg">
                    <I8nTextWrapper text="tenure" /> - {customer.salesManReport?.loanTenure ?? 0}{' '}
                    {customer.salesManReport?.tenureType ?? 'months'}
                  </p>
                  <p className="font-light text-[#475467] text-lg">
                    <I8nTextWrapper text="emi" /> - {(customer.salesManReport?.emi ?? 0).toFixed(2)}
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
              <IncomeTabs customer={customer} setPercentage={setPercentage} />
            </div>
          </div>

          <div className=" sm:px-6 lg:px-8 mt-5">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-65%] ">
                <DocumentTable customer={customer} />
              </div>
              <div className="w-full md:w-[45%]">
                <BalanceOvertime />
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col  mt-10 lg:flex-row gap-6">
            <div className="w-full lg:w-2/3 bg-[#F1F3F5] p-7 rounded-md h-fit">
              <p className="font-sans text-lg font-semibold leading-7 text-left">Comments</p>
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
