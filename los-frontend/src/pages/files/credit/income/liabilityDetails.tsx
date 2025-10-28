import { RTable } from '@/components/shared/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { DELETE_CREDIT_LIABILITY_DETAILS } from '@/redux/actions/types';
import { RootState } from '@/redux/slices';
import { ColumnDef } from '@tanstack/react-table';
import { Paperclip, Trash } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import LiabilityForm from './addLiability';
export default function LiabilityDetails({ customer_id }: { customer_id: string }) {
  const dispatch = useDispatch();
  const { liabilityDetails } = useSelector((state: RootState) => state.credit);
  const liabilityDetailsArray = liabilityDetails?.filter((associate: any) => associate.customerDetails === customer_id);
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'loanType',
      header: 'Loan Type',
      maxSize: 90,
    },
    {
      accessorKey: 'loanAmount',
      header: 'Loan Amount',
      minSize: 200,
    },
    {
      accessorKey: 'tenure',
      header: 'Tenure',
    },
    {
      accessorKey: 'emi',
      header: 'EMI',
    },
    {
      accessorKey: 'irr',
      header: 'IRR',
    },
    {
      accessorKey: 'paymentsMade',
      header: 'Payment Method',
    },
    {
      accessorKey: 'foreclosure',
      header: 'Foreclosure',
    },
    {
      accessorKey: 'comments',
      header: 'Comments',
    },
    {
      accessorKey: 'noOfemiLeft',
      header: 'No of EMI Left',
    },
    {
      accessorKey: 'noOfEmiPaid',
      header: 'No of EMI Paid',
    },

    {
      accessorKey: 'Action',
      header: 'Action',
      minSize: 70,
      cell: (props) => (
        <div className="flex justify-center items-center w-full">
          <AlertDialog>
            <AlertDialogTrigger>
              <Trash className="text-destructive" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this liability
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    dispatch({
                      type: DELETE_CREDIT_LIABILITY_DETAILS,
                      payload: props.row.original._id,
                    });
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];
  return (
    <div className="py-10">
      <div className="flex justify-between">
        <h2 className="text-lg">Liability</h2>
        <Dialog>
          <DialogTrigger className={cn(buttonVariants({ variant: 'default' }))}>Add Liability</DialogTrigger>
          <DialogContent className="w-full max-w-[100vw]  md:max-w-[60vw] lg:max-w-[75vw] xl:max-w-[50vw] max-h-[90vh]  overflow-auto">
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <LiabilityForm customer_id={customer_id} />
          </DialogContent>
        </Dialog>
      </div>
      {liabilityDetailsArray.length > 0 ? (
        <Card className="my-2">
          <CardContent className="p-3">
            <RTable
              columns={columns}
              handlePageChange={() => true}
              data={liabilityDetailsArray || []}
              page={0}
              total={10}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="my-2">
          <CardContent className="min-h-[200px] flex justify-center items-center">
            <Paperclip />
            <h2>No data Available</h2>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
