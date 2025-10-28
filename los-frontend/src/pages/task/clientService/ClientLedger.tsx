import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Download, Eye } from 'lucide-react';

type LedgerItem = {
  id: number;
  service: string;
  dateOfCompletion: string;
  completedBy: string;
  paymentStatus: 'Pending' | 'Invoice Sent' | 'Received';
};

type Client = {
  name: string;
  departments?: string[];
};

type ClientLedgerProps = {
  client: Client;
};

export default function ClientLedger({ client }: ClientLedgerProps) {
  const [open, setOpen] = useState(false);
  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    type: 'Invoice Sent' | 'Received' | null;
    id: number | null;
  }>({
    open: false,
    type: null,
    id: null,
  });

  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>();
  const [receivedDate, setReceivedDate] = useState<Date | undefined>();
  const [remark, setRemark] = useState('');
  const [amount, setAmount] = useState<string>('');

  const [ledgerData, setLedgerData] = useState<LedgerItem[]>([
    {
      id: 1,
      service: 'Website Development',
      dateOfCompletion: '2025-01-12',
      completedBy: 'Riya Sharma',
      paymentStatus: 'Pending',
    },
    {
      id: 2,
      service: 'SEO Optimization',
      dateOfCompletion: '2025-02-08',
      completedBy: 'Ankit Kumar',
      paymentStatus: 'Pending',
    },
  ]);

  const handleStatusChange = (id: number, newStatus: 'Pending' | 'Invoice Sent' | 'Received') => {
    if (newStatus === 'Pending') {
      setLedgerData((prev) => prev.map((item) => (item.id === id ? { ...item, paymentStatus: 'Pending' } : item)));
    } else {
      setStatusDialog({ open: true, type: newStatus, id });
    }
  };

  const handleStatusSubmit = () => {
    const isInvoice = statusDialog.type === 'Invoice Sent';

    if ((isInvoice && !invoiceDate) || (!isInvoice && !receivedDate) || remark.trim() === '') {
      alert('Date and remark are required.');
      return;
    }

    setLedgerData((prev) =>
      prev.map((item) => (item.id === statusDialog.id ? { ...item, paymentStatus: statusDialog.type! } : item))
    );

    setStatusDialog({ open: false, type: null, id: null });
    setInvoiceDate(undefined);
    setReceivedDate(undefined);
    setRemark('');
    setAmount('');
  };

  return (
    <>
      {/* Main Ledger Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="bg-color-primary text-white hover:bg-color-primary/90">
            View Ledger
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl rounded-xl">
          <DialogHeader className="flex  justify-between">
            <DialogTitle className="text-lg font-semibold text-fg-primary flex-shrink-0">
              {client.name} - Ledger
            </DialogTitle>

            <div className="ml-auto">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" /> Download
              </Button>
            </div>
          </DialogHeader>

          <Card className="shadow-md border border-border rounded-xl">
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label>From</Label>
                  <Input type="date" />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label>To</Label>
                  <Input type="date" />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label>Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {client.departments?.length ? (
                        client.departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none">No Departments</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-fg-secondary uppercase text-xs tracking-wider">
                    <tr>
                      <th className="p-3 text-left">S.No</th>
                      <th className="p-3 text-left">Service</th>
                      <th className="p-3 text-left">Date of Completion</th>
                      <th className="p-3 text-left">Completed By</th>
                      <th className="p-3 text-left">Payment Status</th>
                     
                    </tr>
                  </thead>
                  <tbody>
                    {ledgerData.map((item, index) => (
                      <tr key={item.id} className="border-t hover:bg-muted/30 transition-colors">
                        <td className="p-3 text-fg-secondary">{index + 1}</td>
                        <td className="p-3 font-medium text-fg-primary">{item.service}</td>
                        <td className="p-3 text-fg-secondary">
                          {format(new Date(item.dateOfCompletion), 'dd/MM/yyyy')}
                        </td>
                        <td className="p-3 text-fg-secondary">{item.completedBy}</td>
                        <td className="p-3">
                          <Select
                            value={item.paymentStatus}
                            onValueChange={(value) =>
                              handleStatusChange(item.id, value as 'Pending' | 'Invoice Sent' | 'Received')
                            }
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Invoice Sent">Invoice Sent</SelectItem>
                              <SelectItem value="Received">Received</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3">
                          <Button size="sm" variant="ghost" className="text-color-info/80 hover:bg-color-info/10">
                           <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      <Dialog
        open={statusDialog.open}
        onOpenChange={(open) => !open && setStatusDialog({ open: false, type: null, id: null })}
      >
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>
              {statusDialog.type === 'Invoice Sent' ? 'Invoice Details' : 'Payment Received Details'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex flex-col space-y-1.5">
              <Label>{statusDialog.type === 'Invoice Sent' ? 'Date of Invoice Sent *' : 'Date of Received *'}</Label>
              <Input
                type="date"
                value={
                  statusDialog.type === 'Invoice Sent'
                    ? invoiceDate
                      ? format(invoiceDate, 'yyyy-MM-dd')
                      : ''
                    : receivedDate
                      ? format(receivedDate, 'yyyy-MM-dd')
                      : ''
                }
                onChange={(e) => {
                  const d = new Date(e.target.value);
                  statusDialog.type === 'Invoice Sent' ? setInvoiceDate(d) : setReceivedDate(d);
                }}
              />
            </div>

            {statusDialog.type === 'Received' && (
              <div className="flex flex-col space-y-1.5">
                <Label>Amount Received (optional)</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            )}

            <div className="flex flex-col space-y-1.5">
              <Label>Remark *</Label>
              <Textarea placeholder="Enter remark..." value={remark} onChange={(e) => setRemark(e.target.value)} />
            </div>

            <div className="pt-2">
              <Button
                className="w-full bg-color-primary text-white hover:bg-color-primary/90"
                onClick={handleStatusSubmit}
              >
                Change Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
