import React, { useState } from 'react';
import moment from 'moment';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import I8nCurrencyWrapper from '@/translations/i8nCurrencyWrapper';

import { Search, Eye, CheckCircle, Clock, AlertTriangle, DollarSign, Receipt } from 'lucide-react';
import getStatusColor from '@/helpers/getStatusColor';
import { EMI, EMIScheduleTableProps } from '@/lib/interfaces';

const EMIScheduleTable: React.FC<EMIScheduleTableProps> = ({
  loanNumber,
  borrowerName,
  onRecordPayment,
  emis,
  penaltyAmount,
  totalPaidAmount,
  outStandingAmount,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEMI, setSelectedEMI] = useState<EMI | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="h-4 w-4" />;
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'OVERDUE':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredEMIs = emis.filter((emi) => {
    const matchesSearch =
      emi.emiNumber.toString().includes(searchTerm) ||
      moment(emi.dueDate).format('MMM YYYY').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || emi.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scheduled</CardTitle>
            <DollarSign className="h-4 w-4 text-color-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <I8nCurrencyWrapper value={penaltyAmount} precision={0} />
            </div>
            <p className="text-xs text-fg-secondary">Including penalties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-color-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-color-success">
              <I8nCurrencyWrapper value={parseInt(totalPaidAmount)} precision={0} />
            </div>
            <p className="text-xs text-fg-secondary">{totalPaidAmount}% completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <Clock className="h-4 w-4 text-color-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-color-warning">
              <I8nCurrencyWrapper value={outStandingAmount} precision={0} />
            </div>
            <p className="text-xs text-fg-secondary">Remaining balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penalty</CardTitle>
            <AlertTriangle className="h-4 w-4 text-color-error" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-color-error">
              <I8nCurrencyWrapper value={penaltyAmount} precision={0} />
            </div>
            <p className="text-xs text-fg-secondary">Late payment charges</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Repayment Progress</span>
              <span className="text-sm font-medium">{60}%</span>
            </div>
            <Progress value={60} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-fg-tertiary" />
              <Input
                placeholder="Search by EMI number or month..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
                <SelectItem value="PARTIAL_PAID">Partial Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* EMI Table */}
      <Card>
        <CardHeader>
          <CardTitle>EMI Schedule - {loanNumber}</CardTitle>
          <CardDescription>Detailed EMI schedule for {borrowerName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>EMI #</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>EMI Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Penalty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-4">
                      Loading EMI schedule...
                    </TableCell>
                  </TableRow>
                ) : filteredEMIs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-4">
                      No EMIs found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEMIs.map((emi) => (
                    <TableRow key={emi.emiId}>
                      <TableCell className="font-medium">{emi.emiNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{moment(emi.dueDate).format('DD MMM YYYY')}</div>
                          {emi.lateDays > 0 && <div className="text-xs text-color-error">{emi.lateDays} days late</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <I8nCurrencyWrapper value={emi.principalAmount} precision={0} />
                      </TableCell>
                      <TableCell>
                        <I8nCurrencyWrapper value={emi.interestAmount} precision={0} />
                      </TableCell>
                      <TableCell className="font-medium">
                        <I8nCurrencyWrapper value={emi.totalAmount} precision={0} />
                      </TableCell>
                      <TableCell className="text-color-success">
                        <I8nCurrencyWrapper value={emi.paidAmount} precision={0} />
                        {emi.paidDate && (
                          <div className="text-xs text-fg-secondary">{moment(emi.paidDate).format('DD MMM')}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-color-warning">
                        <I8nCurrencyWrapper value={emi.balanceAmount} precision={0} />
                      </TableCell>
                      <TableCell className="text-color-error">
                        <I8nCurrencyWrapper value={emi.penaltyAmount} precision={0} />
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(emi.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(emi.status)}
                          {emi.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedEMI(emi)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {(emi.status === 'PENDING' || emi.status === 'OVERDUE' || emi.status === 'PARTIAL_PAID') && (
                            <Button size="sm" onClick={() => onRecordPayment?.(emi.emiId)}>
                              <Receipt className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* EMI Details Modal */}
      {selectedEMI && (
        <Dialog open={!!selectedEMI} onOpenChange={() => setSelectedEMI(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>EMI Details - #{selectedEMI.emiNumber}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* EMI Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">EMI Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-fg-secondary">Due Date</p>
                    <p className="font-medium">{moment(selectedEMI.dueDate).format('DD MMM YYYY')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-fg-secondary">Status</p>
                    <Badge className={getStatusColor(selectedEMI.status)}>{selectedEMI.status}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-fg-secondary">Principal Amount</p>
                    <p className="font-medium">
                      <I8nCurrencyWrapper value={selectedEMI.principalAmount} precision={0} />
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-fg-secondary">Interest Amount</p>
                    <p className="font-medium">
                      <I8nCurrencyWrapper value={selectedEMI.interestAmount} precision={0} />
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-fg-secondary">Total EMI</p>
                    <p className="text-lg font-bold">
                      <I8nCurrencyWrapper value={selectedEMI.totalAmount} precision={0} />
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-fg-secondary">Amount Paid</p>
                    <p className="text-lg font-bold text-color-success">
                      <I8nCurrencyWrapper value={selectedEMI.paidAmount} precision={0} />
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment History */}
              {selectedEMI?.payments?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedEMI.payments.map((payment) => (
                        <div
                          key={payment.paymentId}
                          className="flex items-center justify-between p-3 bg-color-surface-muted rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{payment.paymentNumber}</p>
                            <p className="text-sm text-fg-secondary">
                              {moment(payment.paymentDate).format('DD MMM YYYY')} • {payment.paymentMethod}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              <I8nCurrencyWrapper value={payment.amount} precision={0} />
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setSelectedEMI(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EMIScheduleTable;
