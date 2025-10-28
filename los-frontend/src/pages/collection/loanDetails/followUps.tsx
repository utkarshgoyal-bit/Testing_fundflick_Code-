import { RootState } from '@/redux/store';
import { FETCH_COLLECTION_FOLLOW_UP_VIEW } from '@/redux/actions/types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { formatDate } from '@/helpers/dateFormater';
import { ArrowUpRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IFollowUpPayment } from '@/lib/interfaces';

function FollowUpPayment() {
  const { caseNo } = useParams<{ caseNo: any }>();
  const dispatch = useDispatch();

  const { payments, error } = useSelector((state: RootState) => state.FollowUpsliceDetails);

  useEffect(() => {
    if (caseNo) {
      dispatch({ type: FETCH_COLLECTION_FOLLOW_UP_VIEW, payload: { caseNo } });
    }
  }, [caseNo, dispatch]);

  const filteredPayments = payments
    ? payments.filter((payment: IFollowUpPayment) => payment.refCaseId?.caseNo === caseNo)
    : [];
  return (
    <div className="p-4 sm:p-6">
      <div className="mt-6 bg-gray-100 p-4 rounded">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-600 mb-4">Follow Up</h4>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="ml-2 border-none shadow-none bg-transparent px-2 py-1">
                <ArrowUpRight />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Follow-UP Details</DialogTitle>
              </DialogHeader>
              <div className="overflow-y-auto max-h-64 border rounded-lg">
                <table className="min-w-full border-collapse text-sm sm:text-base rounded-lg shadow-md">
                  <thead className="text-black sticky top-0 z-10">
                    <tr>
                      <th className="sticky left-0 px-3 sm:px-4 py-2 text-left">Case No</th>
                      <th className="px-3 sm:px-4 py-2 text-left">Type</th>
                      <th className="px-3 sm:px-4 py-2 text-left">Date</th>
                      <th className="px-3 sm:px-4 py-2 text-left">P2P Date</th>
                      <th className="px-3 sm:px-4 py-2 text-left">Remarks</th>
                      <th className="px-3 sm:px-4 py-2 text-left">Attitude</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment: IFollowUpPayment, index: number) => (
                      <tr key={index} className="border-b border-gray-300">
                        <td className="sticky left-0 text-left px-4 py-2">{payment.refCaseId?.caseNo || 'N/A'}</td>
                        <td className="px-3 sm:px-4 py-2">{payment.visitType}</td>
                        <td className="px-3 sm:px-4 py-2">{formatDate(payment.date)}</td>
                        <td className="px-3 sm:px-4 py-2">{payment.commit}</td>
                        <td className="px-3 sm:px-4 py-2">{payment.remarks || 'N/A'}</td>
                        <td className="px-3 sm:px-4 py-2">{payment.attitude || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : Array.isArray(payments) && payments.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="border sticky left-0 border-gray-300 bg-white px-4 py-2">Case No</th>
                    <th className="border bg-white border-gray-300 px-4 py-2">Type</th>
                    <th className="border bg-white border-gray-300 px-4 py-2">Date</th>
                    <th className="border bg-white border-gray-300 px-4 py-2">P2P Date</th>
                    <th className="border bg-white border-gray-300 px-4 py-2">Remarks</th>
                    <th className="border bg-white border-gray-300 px-4 py-2">Attitude</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.slice(0, 3).map((payment: IFollowUpPayment, index: number) => (
                    <tr key={index} className="odd:bg-white even:bg-gray-50 bg-white">
                      <td className="border bg-white text-center sticky left-0 border-gray-300 px-4 py-2">
                        {payment.refCaseId?.caseNo || 'N/A'}
                      </td>
                      <td className="border bg-white text-center border-gray-300 px-4 py-2">{payment.visitType}</td>
                      <td className="border bg-white text-center border-gray-300 px-4 py-2">
                        {formatDate(payment.date)}
                      </td>
                      <td className="border bg-white text-center border-gray-300 px-4 py-2">{payment.commit}</td>
                      <td className="border bg-white text-center border-gray-300 px-4 py-2">
                        {payment.remarks || 'N/A'}
                      </td>
                      <td className="border bg-white text-center border-gray-300 px-4 py-2">
                        {payment.attitude || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <p className="text-gray-600">
                <strong>Last Commit:</strong> {filteredPayments[0]?.commit || 'N/A'}
              </p>
            </div>
          </>
        ) : (
          <p className="text-gray-500">No payment records found for case number {caseNo}.</p>
        )}
      </div>
    </div>
  );
}

export default FollowUpPayment;
