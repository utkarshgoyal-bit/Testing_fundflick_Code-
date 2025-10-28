import { Users, Building2, FileText, Activity, BarChart3 } from 'lucide-react';
const GetLoanTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'HOME_LOAN':
      return <Building2 className="h-4 w-4" />;
    case 'CAR_LOAN':
      return <Activity className="h-4 w-4" />;
    case 'PERSONAL_LOAN':
      return <Users className="h-4 w-4" />;
    case 'BUSINESS_LOAN':
      return <BarChart3 className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export default GetLoanTypeIcon;
