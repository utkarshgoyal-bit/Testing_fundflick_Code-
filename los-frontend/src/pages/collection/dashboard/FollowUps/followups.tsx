/* eslint-disable no-unused-vars */
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import camelToTitle from '@/helpers/camelToTitle';
import { ROUTES } from '@/lib/enums';
import { RootState } from '@/redux/store';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DailyFollowups from './DailyFollowUps';
import FollowUpsTable from './FollowUpsTable';
import { buildOrgRoute } from '@/helpers/routeHelper';
const Followups = ({
  onFollowUpFilterChangeHandler,
}: {
  onFollowUpFilterChangeHandler: ({ day }: { day: string }) => void;
}) => {
  const navigate = useNavigate();
  const { filters, data } = useSelector((state: RootState) => state.collectionDashboard);
  const days = ['yesterday', 'today', 'tomorrow'] as const;
  const [showAll, setShowAll] = useState(false);
  const toggleDetails = useCallback(
    (caseNo: string) => {
      navigate(buildOrgRoute(`${ROUTES.COLLECTION}/loan-details/${caseNo}`));
    },
    [navigate]
  );

  const onChangeDayChangeHandler = ({ day }: { day: string }) => {
    onFollowUpFilterChangeHandler({ day });
  };

  const getCaseBgColor = (row: any) => {
    const commitStatus = row.commitStatus;
    const selectedDay = filters['followupDay'];
    const getCaseBg: any = {
      1: 'bg-red-300 hover:bg-red-300',
      2: 'bg-yellow-300 hover:bg-white-300',
      3: 'bg-green-400 hover:bg-white-400',
    };
    if (commitStatus == 3 && row.refCaseId.dueEmi > 0) {
      return 'bg-white';
    }
    return selectedDay == 'tomorrow'
      ? 'bg-white'
      : !row.idle && selectedDay == 'yesterday'
        ? 'bg-white'
        : getCaseBg[commitStatus];
  };

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        accessorKey: 'caseId',
        header: 'Case Id',
        cell: ({ row }) => (
          <span className="text-primary  cursor-pointer" onClick={() => toggleDetails(row.original?.refCaseId?.caseNo)}>
            {row.original?.refCaseId?.caseNo}
          </span>
        ),
        minSize: 100,
      },
      {
        accessorKey: 'customerName',
        header: 'Customer Name',
        cell: ({ row }) => row.original?.refCaseId?.customer,
      },
      {
        accessorKey: 'area',
        header: 'Branch',
        cell: (props) => props.row.original?.refCaseId?.area,
      },
      {
        accessorKey: 'visitType',
        header: 'Visit Type',
        cell: (props) => camelToTitle(props.row.original?.visitType),
      },
      {
        accessorKey: 'remarks',
        header: 'Remarks',
        cell: (props) => props.row.original?.remarks,
      },
      {
        accessorKey: 'mobile',
        header: 'Customer No',
        cell: ({ row }) => {
          const numbers = row.original?.refCaseId?.contactNo || [];
          const visibleNumbers = showAll ? numbers : numbers.slice(0, 1);
          const formatNumber = (number: string) => {
            return number.replace(/(\d{10})(?=\d)/g, '$1,');
          };
          return (
            <div className="text-primary cursor-pointer">
              <a href={`tel:${visibleNumbers.join(',')}`}>{visibleNumbers.map(formatNumber).join(',')}</a>
              {numbers.length > 1 && !showAll && (
                <button onClick={() => setShowAll(true)} className="text-sm text-blue-600 underline ml-2">
                  ...
                </button>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'dueEmi',
        header: 'Due Emi',
        cell: ({ row }) => row.original?.refCaseId?.dueEmi,
        minSize: 100,
      },
      {
        accessorKey: 'followupBy',
        header: 'Followed By',
        cell: ({ row }) => {
          const { firstName, lastName } = row.original?.createdBy || {};
          return (
            <span className="bg-secondary cursor-pointer text-xs text-white px-2 py-1 rounded-md">
              {firstName || 'NA'} {lastName || ''}
            </span>
          );
        },
        minSize: 100,
      },
    ],
    [showAll, toggleDetails]
  );
  return (
    <div className="p-3 border rounded-md">
      <I8nTextWrapper text="followUps" className="text-4xl" />
      <div className="my-3 space-x-2 ">
        {days.map((day) => (
          <Button
            key={day}
            variant={filters.followupDay === day ? 'default' : 'outline'}
            className="h-6"
            onClick={() => onChangeDayChangeHandler({ day })}
          >
            <span className="capitalize">{day}</span>
          </Button>
        ))}
      </div>
      {data && (
        <FollowUpsTable
          columns={columns}
          // pinnedColumns={{ left: ['caseId'] }}
          data={data?.todaysPromises?.data}
          getRowClass={getCaseBgColor}
          handlePageChange={() => {}}
          page={0}
          total={0}
          customFooter={
            <Dialog>
              <DialogTrigger className="hover:underline cursor-pointer">More records..</DialogTrigger>
              <DialogContent className="max-w-[80vw] max-h-[90vh] max-md:w-screen max-md:h-screen overflow-auto p-0 py-5">
                <DialogHeader>
                  <DialogTitle className="p-3">All Available Followups</DialogTitle>
                  <div className="max-w-[80vw] max-h-[90vh] max-md:w-screen max-md:h-screen p-3">
                    <DailyFollowups />
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          }
        />
      )}
    </div>
  );
};

export default Followups;
