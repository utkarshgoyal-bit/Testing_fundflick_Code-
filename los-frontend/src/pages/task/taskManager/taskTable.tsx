import { RTable } from '@/components/shared/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import NoTaskFound from '@/components/ui/notTaskFound';
import camelToTitle from '@/helpers/camelToTitle';
import hasPermission from '@/helpers/hasPermission';
import { PERMISSIONS } from '@/helpers/permissions';
import { REPEAT_STATUS } from '@/lib/enums/task';
import { cn } from '@/lib/utils';
import { ACCEPT_TASK, DELETE_TASK, MARK_AS_COMPLETED_TASK, STOP_REPEAT_TASK } from '@/redux/actions/types';
import { setTaskActivePage } from '@/redux/slices/tasks';
import { RootState } from '@/redux/store';
import { ColumnDef } from '@tanstack/react-table';
import { CheckCheck, RefreshCwOff, Trash } from 'lucide-react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
export default function TaskTable() {
  const { data, loading, activePage, total } = useSelector((state: RootState) => state.tasks);
  const { data: userData } = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch();
  const statusBackgrounds = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Completed: 'bg-green-100 text-green-800',
    Expired: 'bg-destructive text-destructive-foreground',
    Rejected: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-800',
  };
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: (props) => props.row.original?.title || 'N/A',
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: (props) => (
        <p className="line-clamp-2 max-w-[300px] text-sm text-muted-foreground">
          {props.row.original?.description || 'N/A'}
        </p>
      ),
    },
    {
      accessorKey: 'createdBy',
      header: 'Created By',
      cell: (props) => {
        const user = props.row.original?.createdBy;
        return user ? `${user.firstName} ${user.lastName}` : 'N/A';
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (props) => (
        <Badge
          className={cn(statusBackgrounds[(props.row.original?.status as keyof typeof statusBackgrounds) || 'Pending'])}
        >
          {camelToTitle(props.row.original?.status || 'Pending')}
        </Badge>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: (props) => camelToTitle(props.row.original?.type || '-'),
    },
    {
      accessorKey: 'repeat',
      header: 'Repeat',
      cell: (props) => camelToTitle(props.row.original?.repeat || '-'),
    },
    {
      accessorKey: 'paymentType',
      header: 'Payment Type',
      cell: (props) => camelToTitle(props.row.original?.paymentType || '-'),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: (props) => props.row.original?.amount || '-',
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      cell: (props) =>
        moment(props.row.original?.startDate)
          .add(props.row.original?.dueAfterDays || 0, 'days')
          .format('Do MMM YYYY'),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (props) => {
        const item = props.row.original;
        return (
          <div className="flex gap-1.5">
            {item.acceptedBy && item.status === 'Pending' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch({ type: MARK_AS_COMPLETED_TASK, payload: { _id: item._id } })}
              >
                <CheckCheck className="h-3.5 w-3.5" />
              </Button>
            )}
            {item.repeat !== REPEAT_STATUS.NO_REPEAT && hasPermission(PERMISSIONS.TASK_REPEAT) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch({ type: STOP_REPEAT_TASK, payload: { taskId: item.taskId } })}
              >
                <RefreshCwOff className="h-3.5 w-3.5" />
              </Button>
            )}
            {userData?.employment._id === item.createdBy?._id && hasPermission(PERMISSIONS.TASK_DELETE) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch({ type: DELETE_TASK, payload: { _id: item._id } })}
              >
                <Trash className="h-3.5 w-3.5 text-red-600" />
              </Button>
            )}
            {!item.acceptedBy && item.status === 'Pending' && (
              <Button size="sm" onClick={() => dispatch({ type: ACCEPT_TASK, payload: { taskId: item._id } })}>
                Accept
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="mt-8">
      {data.length > 0 && !loading ? (
        <RTable
          columns={columns}
          data={data || []}
          handlePageChange={(page: number) => dispatch(setTaskActivePage(page))}
          page={activePage}
          total={total}
        />
      ) : (
        <NoTaskFound />
      )}
    </div>
  );
}
