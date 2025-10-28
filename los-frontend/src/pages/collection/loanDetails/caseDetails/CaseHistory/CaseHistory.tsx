import FollowUp from './FollowUp';
import Payments from './Payments';

const CaseHistory = ({ loanDetails }: { loanDetails: any }) => {
  const followUpData = loanDetails?.followUpData || [];
  const paymentsData = loanDetails?.paymentsData || [];
  return (
    <div>
      <FollowUp followUpData={followUpData} />
      <hr />
      <Payments paymentsData={paymentsData} />
    </div>
  );
};

export default CaseHistory;
