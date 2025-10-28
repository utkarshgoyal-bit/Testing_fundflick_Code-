import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FETCH_COLLECTION_VIEW } from '@/redux/actions/types';
import { ROUTES } from '@/lib/enums';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Pen, Trash } from 'lucide-react';
import { IPayment } from '@/lib/interfaces';
import { buildOrgRoute } from '@/helpers/routeHelper';
function Paymentuserdata() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const casesPerPage = 5;

  const { payments } = useSelector((state: RootState) => state.paymentSliceDetails);
  useEffect(() => {
    dispatch({ type: FETCH_COLLECTION_VIEW, payload: { userId } });
  }, [dispatch, userId]);
  const filteredPayments = payments ? payments.filter((payment: IPayment) => payment.createdBy?._id === userId) : [];

  const totalPages = Math.ceil(filteredPayments.length / casesPerPage);

  const paginatedPayments = filteredPayments.slice(page * casesPerPage, (page + 1) * casesPerPage);

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const toggleDetails = (caseNo: string) => {
    if (caseNo) {
      navigate(buildOrgRoute(ROUTES.COLLECTION + `/loan-details/${caseNo}`));
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="overflow-x-auto px-10 ">
        <table className="w-full text-sm rounded-lg">
          <thead>
            <tr className="h-20 border-b border-gray-200 text-[#475467]">
              <th className="px-4 text-left text-base text-gray-600 font-medium">Case Id</th>
              <th className="px-4 text-left text-base text-gray-600 font-medium">amount</th>
              <th className="px-4 text-left text-base text-gray-600 font-medium">extraCharges</th>
              <th className="px-4 text-left text-base text-gray-600 font-medium">date</th>
              <th className="px-4 text-left text-base text-gray-600 font-medium">paymentMode</th>
              <th className="px-4 text-left text-base text-gray-600 font-medium">remarks</th>
              <th className="px-4 text-left text-base text-gray-600 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPayments.length > 0 ? (
              paginatedPayments.map((payment: any, index: number) => (
                <tr key={index} className="border-b text-sm h-20">
                  <td
                    className="px-4 text-left text-blue-500 cursor-pointer"
                    onClick={() => toggleDetails(payment?.refCaseId?.caseNo || '')}
                  >
                    {payment?.refCaseId?.caseNo || 'N/A'}
                  </td>
                  <td className="px-4 text-left text-gray-500">{payment.amount || 'N/A'}</td>
                  <td className="px-4 text-left text-gray-500">{payment.extraCharges || 'N/A'}</td>
                  <td className="px-4 text-left text-gray-500">{payment.date || 'N/A'}</td>
                  <td className="px-4 text-left text-gray-500">{payment.paymentMode || 'N/A'}</td>
                  <td className="px-4 text-left text-gray-500">{payment.remarks || 'N/A'}</td>
                  <td className="px-4 text-left text-gray-500 flex gap-4">
                    <button>
                      <Pen />
                    </button>
                    <button>
                      <Trash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center text-gray-500 py-4" colSpan={7}>
                  No matching payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4 mb-10">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={page === 0}
            className={`flex items-center gap-2 text-sm font-semibold  ${
              page === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#344054]'
            }`}
          >
            <ArrowLeft />
            Previous
          </Button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                variant="outline"
                key={index}
                onClick={() => setPage(index)}
                className={`text-sm font-semibold px-3 py-1 rounded-md ${
                  page === index ? 'bg-blue-500 text-white' : 'text-[#344054]'
                }`}
              >
                {index + 1}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
            className={`flex items-center gap-2 text-sm font-semibold ${
              page >= totalPages - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#344054]'
            }`}
          >
            Next
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Paymentuserdata;
