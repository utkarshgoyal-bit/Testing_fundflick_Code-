/* eslint-disable no-unused-vars */
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CURRENCY_SYMBOLS, ROUTES } from '@/lib/enums';
import { IPaymentData } from '@/lib/interfaces';
import I8nCurrencyWrapper from '@/translations/i8nCurrencyWrapper';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { PaymentsTable } from './PaymentsTable';
import DailyPayments from './DailyPayments';
import { buildOrgRoute } from '@/helpers/routeHelper';

const getRowColor = (row: any) => {
  console.log(row);
  if (!!row.refCaseId.dueEmiAmount && !!row.refCaseId.dueEmi) {
    return 'bg-green-500 hover:bg-green-500';
  }
  return 'even:bg-gray';
};

const Payments = ({
  data,
  filters,
  onCollectionFilterChangeHandler,
}: {
  data: any;
  filters: any;
  onCollectionFilterChangeHandler: ({ day }: { day: string }) => void;
}) => {
  const navigate = useNavigate();
  const days = ['yesterday', 'today'];
  const toggleDetails = (caseNo: string) => {
    navigate(buildOrgRoute(ROUTES.COLLECTION + `/loan-details/${caseNo}`));
  };

  const columns: ColumnDef<IPaymentData>[] = [
    {
      accessorKey: 'caseId',
      header: 'Case Id',
      cell: (props) => (
        <span
          className="text-secondary cursor-pointer"
          onClick={() => {
            const caseNo = props.row.original?.refCaseId?.caseNo;
            if (caseNo) toggleDetails(caseNo);
          }}
        >
          {props.row.original?.refCaseId?.caseNo}
        </span>
      ),
      minSize: 100,
    },
    {
      accessorKey: 'customerName',
      header: 'Customer Name',
      cell: (props) => props.row.original.refCaseId?.customer,
    },
    {
      accessorKey: 'area',
      header: 'Branch',
      cell: (props) => props.row.original?.refCaseId?.area,
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: (props) => {
        const createdAtTimeStamp = props.row.original?.createdAt;
        const date = moment(createdAtTimeStamp).format('DD/MM/YYYY');
        return `${date}`;
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      minSize: 100,
      cell: (props) => (
        <span>
          <I8nCurrencyWrapper value={props.row.original.amount} decimal={'1'} separator={','} precision={0} />
        </span>
      ),
    },
    {
      accessorKey: 'paymentMode',
      header: 'Payment Mode',
      minSize: 100,
      cell: (props) => {
        const paymentMode = props.row.original.paymentMode;
        return paymentMode.toUpperCase();
      },
    },
    {
      accessorKey: 'collectionBy',
      header: 'Collected By',
      cell: (props) => (
        <span className="bg-secondary cursor-pointer text-xs text-white px-2 py-1 rounded-md">
          {props.row.original.createdBy?.firstName} {props.row.original.createdBy?.lastName}
        </span>
      ),
      minSize: 100,
    },
  ];

  return (
    <div className="p-3 shadow-md border rounded-md">
      <p className="text-lg md:text-2xl text-center my-2 font-bold md:my-4 text-secondary">Collections</p>
      <div className="my-3 space-x-2 flex justify-between">
        <div className="flex gap-2">
          {days.map((day: string) => (
            <Button
              key={day}
              variant={filters.collectionDay === day ? 'default' : 'outline'}
              className="h-6"
              onClick={() => onCollectionFilterChangeHandler({ day })}
            >
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </Button>
          ))}
        </div>
        <p className="flex gap-2 items-center">
          <span className="font-bold">Total Collection:</span>
          <span>
            {CURRENCY_SYMBOLS['INR']}
            {data?.todaysCollection?.total}
          </span>
        </p>
      </div>

      {data && (
        <PaymentsTable
          // pinnedColumns={{ left: ['caseId'] }}
          columns={columns}
          getRowClass={getRowColor}
          data={data?.todaysCollection?.data}
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
                    <DailyPayments />
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

export default Payments;
