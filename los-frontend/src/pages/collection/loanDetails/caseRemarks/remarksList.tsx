import { Button } from '@/components/ui/button';
import { RootState } from '@/redux/slices';
import { DELETE_CASE_REMARK } from '@/redux/store/actionTypes';

import { Trash } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export default function RemarksList() {
  const {
    data: { data: loanDetails },
  } = useSelector((state: RootState) => state.branchCollectionCaseNoData);
  const dispatch = useDispatch();
  const params = useParams();
  function handleDeleteRemark(remarkId: string) {
    dispatch({ type: DELETE_CASE_REMARK, payload: { remarkId, caseNo: params.caseNo } });
  }
  return (
    <div className="flex flex-col gap-2">
      {loanDetails?.remarks?.map((item: { remark: string; _id: string }) => (
        <div
          key={item._id}
          className="bg-white rounded-lg p-4 flex flex-row gap-2 items-start justify-between border-b-2"
        >
          <p className="text-sm text-gray-600">{item.remark}</p>
          <Button onClick={() => handleDeleteRemark(item._id)} size={'icon'} variant={'link'}>
            <Trash className="text-destructive w-5 h-5" />
          </Button>
        </div>
      ))}
    </div>
  );
}
