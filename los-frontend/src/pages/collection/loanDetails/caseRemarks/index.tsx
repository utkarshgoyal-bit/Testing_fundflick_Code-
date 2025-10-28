import { Card, CardContent, CardHeader } from '@/components/ui/card';
import CaseRemarkForm from './caseRemarkForm';
import RemarksList from './remarksList';

export default function CaseRemark() {
  return (
    <Card className="shadow-lg border-2 border-gray-100 hover:border-blue-200 transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-gray-800">Case Remarks</span>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <CaseRemarkForm />
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <RemarksList />
        </div>
      </CardContent>
    </Card>
  );
}
