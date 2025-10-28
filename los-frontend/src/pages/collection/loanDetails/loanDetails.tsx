import DetailsSection from './caseDetails/detailsSection';
import CaseRemark from './caseRemarks';
import Header from './header';
import Back from '@/components/shared/Back';
import { FolderX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { FC } from 'react';
import { isBackOffice, isCollectionHead, isSuperAdmin } from '@/helpers/checkUserRole';
import { ILoanDetails } from '@/lib/interfaces';
const LoanDetails: FC<ILoanDetails> = ({ loanDetails, loading, error, role }: ILoanDetails) => {
  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <>
      {!!loanDetails && (
        <div>
          <Card>
            <CardContent>
              <Header loanDetails={loanDetails} isSuperAdmin={isSuperAdmin(role)} isBackOffice={isBackOffice(role)} />
            </CardContent>
          </Card>
          <Card className="my-3 p-0">
            <CardContent className="p-3">
              <DetailsSection
                loanDetails={loanDetails}
                isSuperAdmin={isSuperAdmin(role)}
                isCollectionHead={isCollectionHead(role)}
              />
            </CardContent>
          </Card>
          <CaseRemark />
        </div>
      )}
      {!loanDetails && !loading && (
        <div className="flex flex-col items-center justify-center h-screen">
          <FolderX className="w-24 h-24 text-primary" />
          <h1 className="text-xl md:text-3xl lg:text-5xl font-bold text-primary">No loan details found</h1>
          <p className="mt-4 text-md">Please check the case number and try again.</p>
          <Link to="/collection" className="mt-6 text-secondary hover:underline flex items-center gap-2">
            <Back /> Go back to home
          </Link>
        </div>
      )}
    </>
  );
};

export default LoanDetails;
