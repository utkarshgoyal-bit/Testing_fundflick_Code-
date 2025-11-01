import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Timeline } from '@/components/ui/timeline';
import { toFormatDate } from '@/helpers/dateFormater';
import { ClientLedgerData } from '@/lib/interfaces';
import { FETCH_CLIENT_LEDGER, UPDATE_CLIENT_LEDGER } from '@/redux/actions/types';
import { RootState } from '@/redux/slices';
import { Download, Eye } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';

function exportLedgersToExcel(ledgers: ClientLedgerData[] = [], clientName: string, fromDate: string, toDate: string) {
  if (!Array.isArray(ledgers) || ledgers.length === 0) {
    console.error('No ledger data to export');
    return;
  }

  // ---- Prepare sheet data ----
  const ledgerSheetData: (string | undefined)[][] = [
    ['Client Name:', clientName],
    ['Period', `${fromDate}-${toDate}`],
    [], // empty row
    ['Ledger ID', 'Title', 'Service Name', 'Client Name', 'Completed By', 'Payment Status', 'Date of Completion'],
    ...ledgers.map((l) => [
      l._id,
      l.title || '',
      l.serviceId?.serviceName || '',
      l.clientId?.name || '',
      `${l.completedBy?.firstName || ''} ${l.completedBy?.lastName || ''}`.trim(),
      l.paymentStatus || '',
      String(toFormatDate({ date: l.dateOfCompletion })),
    ]),
  ];

  // ---- Create workbook ----
  const workbook = XLSX.utils.book_new();
  const ledgerSheet = XLSX.utils.aoa_to_sheet(ledgerSheetData);

  // ---- Apply bold style to "Client Name:" and "Period" ----
  const boldStyle = { font: { bold: true } };
  ledgerSheet['A1'].s = boldStyle;
  ledgerSheet['A2'].s = boldStyle;

  // ---- Also bold the table header row ----
  const headerRowIndex = 4; // 1-based Excel row index for header
  const headerCols = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  for (const col of headerCols) {
    const cellRef = `${col}${headerRowIndex}`;
    if (ledgerSheet[cellRef]) ledgerSheet[cellRef].s = boldStyle;
  }

  // ---- Timeline Sheet ----
  const timelineSheetData: (string | undefined)[][] = [
    ['Ledger ID', 'Ledger Title', 'Timeline Title', 'Date', 'Remark', 'Amount Received', 'Created At'],
  ];

  for (const l of ledgers) {
    if (Array.isArray(l.timeline)) {
      for (const t of l.timeline) {
        timelineSheetData.push([
          l._id,
          l.title,
          t.title,
          String(toFormatDate({ date: t.date })),
          t.remark,
          String(t.amountReceived),
          String(toFormatDate({ date: t.createdAt })),
        ]);
      }
    }
  }

  const timelineSheet = XLSX.utils.aoa_to_sheet(timelineSheetData);

  // ---- Add sheets to workbook ----
  XLSX.utils.book_append_sheet(workbook, ledgerSheet, 'Ledgers');
  XLSX.utils.book_append_sheet(workbook, timelineSheet, 'Timeline');

  // ---- Write file ----
  XLSX.writeFile(workbook, 'ledgers_export.xlsx');
}

export default function ClientLedger() {
  const { data: ledgerData } = useSelector((state: RootState) => state.clientLedger);
  const [fromDate, setFromDate] = useState<string | undefined>();
  const [toDate, setToDate] = useState<string | undefined>();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    type: string | null;
    id: string | null;
  }>({
    open: false,
    type: null,
    id: null,
  });

  const [invoiceDate, setInvoiceDate] = useState<string | undefined>();
  const [receivedDate, setReceivedDate] = useState<string | undefined>();
  const [remark, setRemark] = useState('');
  const [amount, setAmount] = useState<string>('');

  const handleStatusChange = (id: string, newStatus: string) => {
    if (newStatus === 'Pending') {
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

    dispatch({
      type: UPDATE_CLIENT_LEDGER,
      payload: {
        ledgerId: statusDialog.id,
        status: statusDialog.type,
        date: isInvoice ? moment(invoiceDate).unix() : moment(receivedDate).unix(),
        remark: remark,
        amountReceived: Number(amount),
      },
    });
    setStatusDialog({ open: false, type: null, id: null });
    setInvoiceDate(undefined);
    setReceivedDate(undefined);
    setRemark('');
    setAmount('');
  };

  function exportDataToCSV() {
    if (!ledgerData) return alert('No data to export');
    exportLedgersToExcel(ledgerData, ledgerData[0]?.clientId?.name || '', fromDate || '', toDate || '');
  }

  useEffect(() => {
    dispatch({
      type: FETCH_CLIENT_LEDGER,
      payload: {
        clientId: id,
        from: moment(fromDate).unix(),
        to: moment(toDate).unix(),
      },
    });
  }, [id, fromDate, toDate]);

  return (
    <>
      {/* Main Ledger Dialog */}
      <div className="flex  justify-between my-2">
        <p className="text-lg font-semibold text-fg-primary flex-shrink-0"> Ledger</p>

        <div className="ml-auto">
          <Button onClick={exportDataToCSV} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>
      </div>

      <Card className="shadow-md border border-border rounded-xl">
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label>From</Label>
              <Input type="date" onChange={(e) => setFromDate(e.target.value)} />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label>To</Label>
              <Input type="date" onChange={(e) => setToDate(e.target.value)} />
            </div>

            {/* <div className="flex flex-col space-y-1.5">
              <Label>Department</Label>
              <Select onValueChange={(value) => setDepartmentId(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments?.length ? (
                    departments.map((dept) => (
                      <SelectItem key={dept._id} value={dept._id}>
                        {dept.departmentName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none">No Departments</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div> */}
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-fg-secondary uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-3 text-left">S.No</th>
                  <th className="p-3 text-left">Service/Title</th>
                  <th className="p-3 text-left">Date of Completion</th>
                  <th className="p-3 text-left">Completed By</th>
                  <th className="p-3 text-left">Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {ledgerData &&
                  ledgerData?.map((item, index) => (
                    <tr className="border-t hover:bg-muted/30 transition-colors">
                      <td className="p-3 text-fg-secondary">{index + 1}</td>
                      <td className="p-3 font-medium text-fg-primary">{item?.serviceId?.serviceName || item.title}</td>
                      <td className="p-3 text-fg-secondary">
                        {toFormatDate({
                          date: item.dateOfCompletion,
                        })}
                      </td>
                      <td className="p-3 text-fg-secondary">
                        {item.completedBy.firstName || ''} {item.completedBy.lastName || ''}
                      </td>
                      <td className="p-3">
                        <Select
                          value={item.paymentStatus}
                          onValueChange={(value) => handleStatusChange(item._id, value)}
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
                        <Dialog>
                          <DialogTrigger>
                            <Eye className="h-4 w-4" />
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Timeline for {item.serviceId?.serviceName}</DialogTitle>
                              <DialogDescription>
                                <Timeline
                                  timelineData={item.timeline.map((item) => ({
                                    date: toFormatDate({ date: item.date }),
                                    title: item.title,
                                    content: item.remark,
                                    name: toFormatDate({ date: item.createdAt }) as string,
                                  }))}
                                />
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
                onChange={(e) => {
                  statusDialog.type === 'Invoice Sent'
                    ? setInvoiceDate(e.target.value)
                    : setReceivedDate(e.target.value);
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
