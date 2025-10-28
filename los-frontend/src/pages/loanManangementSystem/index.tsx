import { useDispatch, useSelector } from 'react-redux';
import LoanManagementSystem from './LoanManagementSystem';
import { RootState } from '@/redux/store';
import { setFiltersData } from '@/redux/slices/files';
import { FETCH_LOANS } from '@/redux/actions/types';
import { useEffect } from 'react';
const index = () => {
  const dispatch = useDispatch();
  const {
    tableConfiguration,
    loading: customerLoading,
    filters,
  } = useSelector((state: RootState) => state.customerFiles);
  const {
    data: allLoansFiles,
    loading: loansFileLoading,
    error: loansFileError,
  } = useSelector((state: RootState) => state.allLoans);
  const { loading: globalLoading } = useSelector((state: RootState) => state.publicSlice);
  const { data } = tableConfiguration;
  const customers = data.map(
    ({ loanApplicationNumber, _id, customerDetails, loanType, status, loanAmount, finalApproveReport }) => ({
      value: loanApplicationNumber,
      label: `${customerDetails.firstName} ${customerDetails.lastName} (${loanApplicationNumber})`,
      fileId: _id,
      loanType: loanType,
      loanTenure: finalApproveReport?.loanTenure,
      status: status,
      loanAmount: loanAmount,
      interestRate: finalApproveReport?.interestRate,
      emi: finalApproveReport?.emi,
      tenureType: finalApproveReport?.tenureType,
    })
  );
  const { data: allLoansStatistics, loading: allLoansStatisticsLoading } = useSelector(
    (state: RootState) => state.allLoansStatistics
  );
  const handleSearchCustomer = (searchCustomerValue: string) => {
    dispatch(setFiltersData({ ...filters, search: searchCustomerValue, status: 'APPROVED' }));
  };
  const fetchAllFiles = () => {
    dispatch({ type: FETCH_LOANS });
  };
  useEffect(() => {
    fetchAllFiles();
  }, []);
  const loading = customerLoading || loansFileLoading || globalLoading || allLoansStatisticsLoading;

  return (
    <LoanManagementSystem
      handleSearchCustomer={handleSearchCustomer}
      loading={loading}
      dispatch={dispatch}
      customers={customers}
      fetchAllFiles={fetchAllFiles}
      allLoansFiles={allLoansFiles}
      loansFileLoading={loansFileLoading}
      loansFileError={loansFileError}
      allLoansStatistics={allLoansStatistics}
    />
  );
};

export default index;
