import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { STEPS_NAMES } from '@/lib/enums';
import { RootState } from '@/redux/store';
import { setActiveStep } from '@/redux/slices/files';
import { setAddAssociateFormDialog } from '@/redux/slices/files/associates';
import { ChevronRight, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import VerifyStepData from '@/pages/files/steps/verifyStepData';
import AssociateForm from './form';
import AssociatesTable from './table';

export default function Associate() {
  const dispatch = useDispatch();
  const { associates, addAssociateFormDialog } = useSelector((state: RootState) => state.fileAssociates);
  return (
    <div className="w-full space-y-3 gap-3 md:p-5  relative">
      <div className="col-span-2 flex w-full  mt-4">
        <Dialog
          open={addAssociateFormDialog}
          onOpenChange={(open) => {
            dispatch(setAddAssociateFormDialog(open));
          }}
        >
          <DialogTrigger>
            <Button>
              <Plus /> New Associate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add New Associate</DialogTitle>
            </DialogHeader>
            <AssociateForm address={associates.address} status={associates.status} />
          </DialogContent>
        </Dialog>
      </div>
      <AssociatesTable />

      <div className="flex  w-full justify-end items-center gap-5  ">
        <VerifyStepData stepName={STEPS_NAMES.ASSOCIATE} stepsData={associates} />
        <div className="flex justify-end col-span-2 gap-4 my-3">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                dispatch(setActiveStep(STEPS_NAMES.INCOME));
              }}
            >
              {'Save and next'} <ChevronRight />{' '}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
