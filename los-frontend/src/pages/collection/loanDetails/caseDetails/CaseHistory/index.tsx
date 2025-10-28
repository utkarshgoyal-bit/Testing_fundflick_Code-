import CaseHistory from './CaseHistory';

const index = ({ loanDetails }: { loanDetails: any }) => {
  return (
    <div>
      <CaseHistory loanDetails={loanDetails} />
    </div>
  );
};

export default index;
