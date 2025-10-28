import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RootState } from '@/redux/store';
import { GET_CUSTOMER_ASSOCIATES_DATA } from '@/redux/actions/types';
import { setEditAssociateFormDialog } from '@/redux/slices/files/associates';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AssociateForm from './form';

export default function AssociatesCardView() {
  const dispatch = useDispatch();
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const {
    editAssociateFormDialog,
    associates: { customerOtherFamilyDetails, status, address },
  } = useSelector((state: RootState) => state.fileAssociates);

  const order = {
    'co-applicant': 0,
    guarantor: 1,
    reference: 2,
  };

  // Create a shallow copy of the array and then sort it
  const sortedAssociates = customerOtherFamilyDetails
    ? [...customerOtherFamilyDetails].sort((a: any, b: any) => {
        return (order as any)[a.customerType] - (order as any)[b.customerType];
      })
    : [];
  useEffect(() => {
    dispatch({ type: GET_CUSTOMER_ASSOCIATES_DATA });
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
      {sortedAssociates.length > 0 ? (
        sortedAssociates.map((associate: any, index: number) => (
          <div
            key={'associate' + index}
            className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-all flex justify-between items-center"
          >
            <div className="flex flex-col items-start">
              <h3 className="text-lg font-semibold">
                {`${associate.customerDetails.firstName ?? ''} ${associate.customerDetails.middleName ?? ''} ${associate.customerDetails.lastName ?? ''}`
                  .trim()
                  .slice(0, 13)}
                {`${associate.customerDetails.firstName ?? ''} ${associate.customerDetails.middleName ?? ''} ${associate.customerDetails.lastName ?? ''}`
                  .length > 13
                  ? '...'
                  : ''}
              </h3>
              <p className="text-sm text-gray-500">{associate.customerType}</p>
              <p className="text-sm text-gray-500">{associate.relation}</p>
            </div>
            <Button
              className="rounded-full h-12 p-0 w-12"
              variant={'outline'}
              onClick={() => {
                setSelectedRow(associate);
                dispatch(setEditAssociateFormDialog(true));
              }}
            >
              <Pencil className="cursor-pointer text-secondary" size={20} />
            </Button>
          </div>
        ))
      ) : (
        <div className="text-center py-4 border-2 border-dashed border-gray-300 w-full col-span-7">
          <p className="text-gray-500">No data available</p>
        </div>
      )}

      {/* Dialog for editing associate */}
      {selectedRow && Object.keys(selectedRow).length && (
        <Dialog open={editAssociateFormDialog} onOpenChange={(open) => dispatch(setEditAssociateFormDialog(open))}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Associate</DialogTitle>
            </DialogHeader>
            {selectedRow && Object.keys(selectedRow).length && (
              <AssociateForm defaultValuesData={{ associate: selectedRow }} address={address} status={status} />
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
