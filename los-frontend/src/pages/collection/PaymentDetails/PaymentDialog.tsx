import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FollowUp from '../FollowUp';
const PaymentDialog = ({
  openFollowUp,
  onCloseFollowUpModal,
  paymentCaseNo,
  casePaymentData,
}: {
  openFollowUp?: boolean;
  onCloseFollowUpModal?: () => void;
  paymentCaseNo?: string;
  casePaymentData: any;
}) => {
  return (
    <Dialog
      open={openFollowUp}
      onOpenChange={onCloseFollowUpModal}
      defaultOpen={openFollowUp}
      key={0}
      modal={openFollowUp}
    >
      <DialogContent className="sm:max-w-[725px]  max-h-[95vh] overflow-auto  scroll-m-0">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FollowUp
            hideBack={true}
            title={'enterFollowUpDateForRemainingAmount'}
            paymentCaseNo={paymentCaseNo}
            casePaymentData={casePaymentData}
            isDonotNavigate={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
