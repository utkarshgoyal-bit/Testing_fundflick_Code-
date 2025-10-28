import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import hasPermission from '@/helpers/hasPermission';
import { PERMISSIONS } from '@/helpers/permissions';
import { cn } from '@/lib/utils';
import { RootState } from '@/redux/store';
import { FETCH_PENDENCY_DATA, MARK_AS_COMPLETED_PENDENCY, REACTIVE_PENDENCY } from '@/redux/actions/types';
import { setActiveTab } from '@/redux/slices/pendency';
import { CheckCheck, Plus, Undo } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddPendency } from './form';
import moment from 'moment';

export default function Pendencies({
  loanApplicationNumber,
  fileStatus,
}: {
  loanApplicationNumber: string;
  fileStatus: string;
}) {
  const dispatch = useDispatch();
  const { data: userData } = useSelector((state: RootState) => state.login);
  const { activeTab, data, loading } = useSelector((state: RootState) => state.pendency);
  useEffect(() => {
    console.log(loanApplicationNumber);
    if (activeTab !== 'add') {
      dispatch({ type: FETCH_PENDENCY_DATA, loanApplicationNumber });
    }
  }, [activeTab]);
  return (
    <div>
      <h2 className="text-xl font-bold border w-fit px-3 py-1 border-primary  shadow-md rounded-md">
        File Status : {fileStatus}
      </h2>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 my-3">
          <Button
            variant={activeTab === 'active' ? 'secondary' : 'outline'}
            onClick={() => dispatch(setActiveTab('active'))}
            size={'sm'}
            className="border-primary"
          >
            Active
          </Button>
          <Button
            variant={activeTab === 'history' ? 'secondary' : 'outline'}
            onClick={() => dispatch(setActiveTab('history'))}
            size={'sm'}
            className="border-primary"
          >
            All Time
          </Button>
        </div>
        {hasPermission(PERMISSIONS.PENDENCY_CREATE) && (
          <Button
            variant={'outline'}
            size={'sm'}
            className={cn('border-primary ', activeTab === 'add' && 'hidden')}
            onClick={() => dispatch(setActiveTab('add'))}
          >
            <Plus size={18} /> Add
          </Button>
        )}
      </div>
      {activeTab !== 'add' ? (
        <div className="space-y-3">
          {loading && (
            <Skeleton className="text-sm text-gray-600  flex justify-center items-start border-dotted border-2 p-10" />
          )}
          {!loading && data.length === 0 && (
            <p className="text-sm text-gray-600  flex justify-center items-start border-dotted border-2 p-10">
              No Pendencies Found
            </p>
          )}
          {!loading &&
            data.map((item: any, index: number) => (
              <div className="max-h-[60vh] overflow-auto space-y-6" key={index}>
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                  {/* Status */}
                  <div className="w-full flex justify-end">
                    <h4
                      className={cn(
                        'text-xs font-bold text-white px-3 py-1 rounded-full w-fit',
                        item.status === 'Pending' ? 'bg-amber-500' : 'bg-green-500'
                      )}
                    >
                      {item.status}
                    </h4>
                  </div>

                  {/* Created By & Date */}
                  <h2 className="text-sm font-semibold text-gray-700">
                    {item.createdBy.firstName[0].toUpperCase() + item.createdBy.firstName.slice(1).toLowerCase()}{' '}
                    {item.createdBy.lastName.toLowerCase()} <span>{moment(item.createdAt).format('DD/MM/YYYY')}</span>
                  </h2>

                  {/* Title */}
                  <h3 className="text-2xl font-semibold text-gray-900 mt-2">{item.title}</h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                  {/* Action Button */}
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-white w-fit rounded-full px-3 bg-primary">
                      Assigned To: {item?.employeeId?.firstName || ''} {item?.employeeId?.lastName || ''}
                    </p>
                    <div className="space-x-3">
                      {hasPermission(PERMISSIONS.PENDENCY_COMPLETE) && item.status !== 'Completed' && (
                        <Tooltip>
                          <TooltipTrigger>
                            <span
                              aria-label="mark as completed"
                              className={cn(buttonVariants({ variant: 'outline' }), 'rounded-full p-0 w-9 h-9 ')}
                              onClick={() =>
                                dispatch({
                                  type: MARK_AS_COMPLETED_PENDENCY,
                                  payload: {
                                    _id: item._id,
                                    fileId: loanApplicationNumber,
                                  },
                                })
                              }
                            >
                              <CheckCheck />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Mark as Completed</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {item.status == 'Completed' &&
                        (item.createdBy._id == userData?.user.employeeId ||
                          hasPermission(PERMISSIONS.PENDENCY_REACTIVATE)) && (
                          <Tooltip>
                            <TooltipTrigger>
                              <span
                                aria-label="mark as completed"
                                className={cn(
                                  buttonVariants({ variant: 'outline' }),
                                  'rounded-full border-destructive text-destructive p-0 w-9 h-9 '
                                )}
                                onClick={() =>
                                  dispatch({
                                    type: REACTIVE_PENDENCY,
                                    payload: {
                                      _id: item._id,
                                      fileId: loanApplicationNumber,
                                    },
                                  })
                                }
                              >
                                <Undo />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Re-Activate</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="border p-3 rounded-lg">
          <h2 className="text-center font-semibold">Add Pendency</h2>
          <AddPendency loanApplicationNumber={loanApplicationNumber} />
        </div>
      )}
    </div>
  );
}
