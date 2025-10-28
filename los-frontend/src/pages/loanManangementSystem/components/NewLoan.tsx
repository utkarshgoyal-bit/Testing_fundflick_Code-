import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { FETCH_CUSTOMER_FILES_DATA } from '@/redux/actions/types';
import { LOANTYPES } from '@/lib/enums';
import NP from 'number-precision';
import I8nCurrencyWrapper from '@/translations/i8nCurrencyWrapper';
import { Dispatch } from 'redux';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import monthsToYear from '@/components/shared/monthsToYear';
import numberToWords from '@/components/shared/numberToWords';
import { CreateLoanPayload } from '@/lib/interfaces';

const NewLoan = ({
  handleSearchCustomer,
  loading,
  dispatch,
  customers,
  setShowCreateLoan,
  showCreateLoan,
  handleCreateLoan,
}: {
  handleSearchCustomer: (searchValue: string) => void;
  loading: boolean;
  dispatch: Dispatch;
  customers: any[];
  setShowCreateLoan: (value: boolean) => void;
  showCreateLoan: boolean;
  handleCreateLoan: ({ newLoanData }: { newLoanData: CreateLoanPayload }) => void;
}) => {
  const createLoanLoading = false;
  const createLoanError = null;
  const createdLoan = null;

  const [newLoanData, setNewLoanData] = useState({
    customer: '',
    fileId: 0,
    principalAmount: 0,
    interestRate: 0,
    loanTenure: 0,
    loanType: '',
    emi: 0,
    tenureType: '',
    purpose: '',
    collateralDetails: '',
    processingFee: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const searchCustomerHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchedValue = e.target.value;
    setSearchQuery(searchedValue);
    handleSearchCustomer(searchedValue);
  };

  const filteredCustomers = customers?.filter((customer) =>
    customer.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (searchQuery) {
      dispatch({ type: FETCH_CUSTOMER_FILES_DATA });
    }
  }, [dispatch, searchQuery]);

  const handleNewLoanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLoanData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewLoanSelectChange = (value: string) => {
    setNewLoanData((prev) => ({ ...prev, loanType: value }));
  };

  const handleCustomerSelect = (customer: {
    value: number;
    label: string;
    loanApplicationNumber: number;
    loanType: string;
    loanTenure: number;
    loanAmount: number;
    interestRate: number;
    emi: number;
    tenureType: string;
  }) => {
    const selectedLoanType = customer?.loanType;
    const selectedLoanTenure = customer?.loanTenure;
    const selectedCustomer = customer.label;
    const selectedCustomerId = customer?.value;
    const selectedPrincipalAmount = customer?.loanAmount;
    const selectedInterestRate = customer?.interestRate;
    const selectedEmi = NP.round(customer?.emi || 0, 2);
    const selectedTenureType = customer?.tenureType;

    setNewLoanData((prev) => ({
      ...prev,
      loanType: selectedLoanType,
      loanTenure: selectedLoanTenure,
      customer: selectedCustomer,
      fileId: selectedCustomerId,
      principalAmount: selectedPrincipalAmount,
      interestRate: selectedInterestRate,
      emi: selectedEmi,
      tenureType: selectedTenureType?.toUpperCase() || '',
    }));
    setIsOpen(false);
    setSearchQuery('');
  };

  // Handle loan creation
  const onHandleCreateLoan = () => {
    const loanPayload: CreateLoanPayload = {
      fileId: newLoanData.fileId,
      loanType: newLoanData.loanType,
      processingFee: newLoanData.processingFee || undefined,
    };
    handleCreateLoan({ newLoanData: loanPayload });
  };

  // Reset form when loan is created successfully
  useEffect(() => {
    if (createdLoan && !createLoanLoading) {
      setNewLoanData({
        customer: '',
        fileId: 0,
        principalAmount: 0,
        interestRate: 0,
        loanTenure: 0,
        loanType: '',
        emi: 0,
        tenureType: '',
        purpose: '',
        collateralDetails: '',
        processingFee: 0,
      });
      setShowCreateLoan(false);
    }
  }, [createdLoan, createLoanLoading, setShowCreateLoan]);

  return (
    <Dialog open={showCreateLoan} onOpenChange={setShowCreateLoan}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Loan</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new loan. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer" className="text-right">
              Customer
            </Label>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={isOpen} className="col-span-3 justify-between">
                  {newLoanData.customer || 'Select customer...'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="col-span-3 p-0">
                <div className="p-2">
                  <Input
                    placeholder={loading ? 'searching' : 'Search customers...'}
                    value={searchQuery}
                    onChange={searchCustomerHandler}
                    className="mb-2"
                  />
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <div
                        key={customer.fileId}
                        className="px-2 py-1 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                        onClick={() => handleCustomerSelect(customer)}
                      >
                        {customer.label}
                      </div>
                    ))
                  ) : (
                    <div className="px-2 py-1 text-muted-foreground">No customers found</div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="principalAmount" className="text-right">
              Principal
            </Label>
            <div className="col-span-3 space-y-2">
              <Input
                id="principalAmount"
                name="principalAmount"
                type="number"
                placeholder="e.g., 500000"
                value={newLoanData.principalAmount}
                onChange={handleNewLoanChange}
              />
              <span className="text-sm text-muted-foreground block">
                {newLoanData.principalAmount ? numberToWords(newLoanData.principalAmount) : ''}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="interestRate" className="text-right">
              Interest Rate (%)
            </Label>
            <Input
              id="interestRate"
              name="interestRate"
              type="number"
              placeholder="e.g., 8.5"
              className="col-span-3"
              value={newLoanData.interestRate}
              onChange={handleNewLoanChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="loanTenure" className="text-right">
              Tenure (Months)
            </Label>
            <div className="col-span-3 space-y-2">
              <Input
                id="loanTenure"
                name="loanTenure"
                type="number"
                placeholder="e.g., 60"
                value={newLoanData.loanTenure}
                onChange={handleNewLoanChange}
              />
              <span className="text-sm text-muted-foreground block">
                {newLoanData.loanTenure ? monthsToYear(newLoanData.loanTenure) : ''}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="loanType" className="text-right">
              Loan Type
            </Label>
            <Select onValueChange={handleNewLoanSelectChange} value={newLoanData.loanType}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a loan type" />
              </SelectTrigger>
              <SelectContent>
                {LOANTYPES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="purpose" className="text-right">
              Purpose
            </Label>
            <Input
              id="purpose"
              name="purpose"
              placeholder="e.g., Home renovation"
              className="col-span-3"
              value={newLoanData.purpose}
              onChange={handleNewLoanChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="collateralDetails" className="text-right">
              Collateral Details
            </Label>
            <Input
              id="collateralDetails"
              name="collateralDetails"
              placeholder="e.g., Property documents"
              className="col-span-3"
              value={newLoanData.collateralDetails}
              onChange={handleNewLoanChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="processingFee" className="text-right">
              Processing Fee
            </Label>
            <Input
              id="processingFee"
              name="processingFee"
              type="number"
              placeholder="e.g., 5000"
              className="col-span-3"
              value={newLoanData.processingFee}
              onChange={handleNewLoanChange}
            />
          </div>
          {createLoanError && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">{createLoanError}</div>
          )}
          <div className="text-sm text-muted-foreground flex flex-row w-100 justify-evenly items-center bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">EMI:</span>
              <I8nCurrencyWrapper value={newLoanData.emi} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Tenure Type:</span>
              <span>{newLoanData.tenureType}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowCreateLoan(false)}>
            Cancel
          </Button>
          <Button onClick={onHandleCreateLoan} disabled={!newLoanData.customer || createLoanLoading}>
            {createLoanLoading ? 'Creating...' : 'Create Loan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewLoan;
