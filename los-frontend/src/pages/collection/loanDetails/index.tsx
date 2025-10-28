import { FETCH_COLLECTION_BY_CASE_NO } from '@/redux/actions/types';
import { useEffect, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '@/redux/store';
import LoanDetails from './loanDetails';

const LoanDetailsPage: FC = () => {
  const { caseNo } = useParams<{ caseNo: string }>();
  const dispatch = useDispatch();
  const { role } = useSelector((state: RootState) => state.login);
  const { data, loading, error } = useSelector((state: RootState) => state.branchCollectionCaseNoData);
  const loanDetails = data?.data;
  useEffect(() => {
    if (caseNo) {
      dispatch({ type: FETCH_COLLECTION_BY_CASE_NO, payload: caseNo });
    }
    return () => {
      dispatch({ type: FETCH_COLLECTION_BY_CASE_NO, payload: null });
    };
  }, [caseNo, dispatch]);

  return <LoanDetails loading={loading} role={role} loanDetails={loanDetails} error={error} />;
};

export default LoanDetailsPage;
