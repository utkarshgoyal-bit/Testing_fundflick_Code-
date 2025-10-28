import I8nCurrencyWrapper from '@/translations/i8nCurrencyWrapper';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import getStatusColor from '@/helpers/getStatusColor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const SelectedLoan = ({
  selectedLoan,
  setSelectedLoan,
}: {
  selectedLoan: any;
  setSelectedLoan: (value: any) => void;
}) => {
  return (
    <Dialog open={!!selectedLoan} onOpenChange={() => setSelectedLoan(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Loan Details - {selectedLoan.loanNumber}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Borrower Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-fg-secondary">Name</p>
                <p className="font-medium">{selectedLoan.borrowerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-fg-secondary">Email</p>
                <p className="font-medium">{selectedLoan.borrowerEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-fg-secondary">Phone</p>
                <p className="font-medium">{selectedLoan.borrowerPhone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-fg-secondary">Status</p>
                <Badge className={getStatusColor(selectedLoan.status)}>{selectedLoan.status}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loan Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-fg-secondary">Principal Amount</p>
                <p className="text-xl font-bold">
                  <I8nCurrencyWrapper value={selectedLoan.principalAmount} precision={0} />
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-fg-secondary">Outstanding</p>
                <p className="text-xl font-bold text-color-warning">
                  <I8nCurrencyWrapper value={selectedLoan.outstandingAmount} precision={0} />
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-fg-secondary">Paid Amount</p>
                <p className="text-xl font-bold text-color-success">
                  <I8nCurrencyWrapper value={selectedLoan.totalPaidAmount} precision={0} />
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-fg-secondary">EMI Amount</p>
                <p className="text-xl font-bold">
                  <I8nCurrencyWrapper value={selectedLoan.emiAmount} precision={0} />
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setSelectedLoan(null)}>
              Close
            </Button>
            <Button>Edit Loan</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectedLoan;
