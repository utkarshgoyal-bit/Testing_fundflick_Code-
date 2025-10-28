import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { LOANTYPES, STATUS } from '@/lib/enums';
import { Search, Eye, Users, FileText, Phone, Mail, Receipt } from 'lucide-react';
import GetLoanTypeIcon from '@/components/shared/GetLoanIcon';
import getStatusColor from '@/helpers/getStatusColor';
import { Badge } from '@/components/ui/badge';
import I8nCurrencyWrapper from '@/translations/i8nCurrencyWrapper';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import { IAllLoansProps } from '@/lib/interfaces';

const AllLoans = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  loanTypeFilter,
  setLoanTypeFilter,
  filteredLoans,
  setSelectedLoan,
  setShowPaymentModal,
  viewFileDetailsHandler,
}: IAllLoansProps) => {
  return (
    <div>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-fg-tertiary" />
              <Input
                placeholder="Search by loan number, borrower name, or phone..."
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
                {Object.keys(STATUS).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={loanTypeFilter} onValueChange={setLoanTypeFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Loan Type" />
              </SelectTrigger>
              <SelectContent>
                {LOANTYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredLoans.map((loan: any) => (
          <Card key={loan.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-color-primary/10 rounded-lg">{GetLoanTypeIcon(loan.loanType)}</div>
                  <div>
                    <CardTitle className="text-lg">{loan.loanNumber}</CardTitle>
                    <CardDescription>{loan.loanType.replace('_', ' ')}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(loan.status)}>{loan.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Borrower Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-fg-tertiary" />
                  <span className="text-sm font-medium">{loan.borrowerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-fg-tertiary" />
                  <span className="text-sm text-fg-secondary">{loan.borrowerPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-fg-tertiary" />
                  <span className="text-sm text-fg-secondary">{loan.borrowerEmail}</span>
                </div>
              </div>

              {/* Loan Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-fg-secondary">Principal Amount</p>
                  <p className="font-medium">
                    <I8nCurrencyWrapper value={loan.principalAmount} precision={0} />
                  </p>
                </div>
                <div>
                  <p className="text-xs text-fg-secondary">Outstanding</p>
                  <p className="font-medium">
                    <I8nCurrencyWrapper value={loan.outstandingAmount} precision={0} />
                  </p>
                </div>
                <div>
                  <p className="text-xs text-fg-secondary">EMI Amount</p>
                  <p className="font-medium">
                    <I8nCurrencyWrapper value={loan.emiAmount} precision={0} />
                  </p>
                </div>
                <div>
                  <p className="text-xs text-fg-secondary">Next Due</p>
                  <p className="font-medium">{moment(loan.nextEMIDueDate).format('DD MMM')}</p>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-fg-secondary">Completion</span>
                  <span className="text-xs font-medium">{loan.completionPercentage}%</span>
                </div>
                <Progress value={loan.completionPercentage} className="h-2" />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" size="sm" onClick={() => viewFileDetailsHandler(loan.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedLoan(loan);
                    setShowPaymentModal(true);
                  }}
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLoans.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <FileText className="h-12 w-12 text-fg-tertiary mx-auto mb-4" />
            <p className="text-fg-secondary">No loans found matching your criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AllLoans;
