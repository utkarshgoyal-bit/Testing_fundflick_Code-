import CollectionTable from './CollectionTableView';
import { Button } from '@/components/ui/button';
import { COLLECTION_ROUTES, CURRENCY_SYMBOLS } from '@/lib/enums';
import { formatDate } from '@/helpers/dateFormater';
import hasPermission from '@/helpers/hasPermission';
import { PERMISSIONS } from '@/helpers/permissions';
import { ICollectionTable } from '@/lib/interfaces/tables';
import { setPage } from '@/redux/slices/collection';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, UserRoundCheck, Banknote, Folder } from 'lucide-react';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TableView: React.FC<any> = ({
  onPhoneClick,
  handleNavigation,
  totalRecords,
  data,
  total,
  page,
  branches,
  meta,
}: {
  onPhoneClick: any;
  handleNavigation: any;
  totalRecords: any;
  data: any[];
  total: number;
  page: number;
  branches: any[];
  meta: any;
}) => {
  const navigate = useNavigate();
  // const { role } = useSelector((state: RootState) => state.login);
  const dispatch = useDispatch();
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const tableData = data.map((item: ICollectionTable) => ({ ...item }));
  const toggleDetails = (caseNo: string) => {
    navigate(COLLECTION_ROUTES.LOAN_DETAILS_PAGE.replace(':caseNo', caseNo));
  };

  const cases = [...new Set(data.map(({ caseNo }: { caseNo: string }) => caseNo))].map((area: any) => ({
    item: area,
    value: area,
    label: area?.toUpperCase() || '',
  }));

  const loan = [...new Set(data.map(({ loanType }: { loanType: string }) => loanType))].map((area: any) => ({
    item: area,
    value: area,
    label: area?.toUpperCase() || '',
  }));

  const customers = [...new Set(data.map(({ customer }: { customer: string }) => customer))].map((area: any) => ({
    item: area,
    value: area,
    label: area?.toUpperCase() || '',
  }));
  const emis = [...new Set(data.map(({ emiAmount }: { emiAmount: number }) => emiAmount))].map((area) => ({
    item: area,
    value: area,
    label: area,
  }));

  const onSelectBranchHandler = (event: string) => {
    console.log(event);
  };
  const onSelectCaseHandler = (event: string) => {
    console.log(event);
  };
  const onSelectLoanHandler = (event: string) => {
    console.log(event);
  };
  const onSelectCustomerHandler = (event: string) => {
    console.log(event);
  };
  const onSelectEmiAmountHandler = (event: string) => {
    console.log(event);
  };

  const columns: ColumnDef<ICollectionTable>[] = [
    {
      accessorKey: 'caseNo',
      header: () => (
        <>
          <Select onValueChange={onSelectCaseHandler}>
            <SelectTrigger className="border-none">
              <SelectValue placeholder="Case No" className="placeholder:text-black placeholder:font-semibold" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="case" className="text-black font-semibold">
                Case No
              </SelectItem>
              {cases.map((item) => {
                if (!item.value) {
                  console.error(
                    `Select.Item value for label "${item.label}" is empty. Please provide a non-empty value.`
                  );
                  return null;
                }
                return (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </>
      ),
      minSize: 100,
    },
    {
      accessorKey: 'loanType',
      header: () => (
        <>
          <Select onValueChange={onSelectLoanHandler}>
            <SelectTrigger className="border-none">
              <SelectValue placeholder="Loan type" className="placeholder:text-black placeholder:font-semibold" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="loan" className="text-black font-semibold">
                Loan Type
              </SelectItem>
              {loan.map((item) => {
                if (!item.value) {
                  console.error(
                    `Select.Item value for label "${item.label}" is empty. Please provide a non-empty value.`
                  );
                  return null;
                }
                return (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </>
      ),
      minSize: 100,
    },
    {
      accessorKey: 'area',
      header: () => (
        <>
          <Select onValueChange={onSelectBranchHandler}>
            <SelectTrigger className="border-none">
              <SelectValue placeholder="Branch" className="placeholder:text-black placeholder:font-semibold" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="selectBranch" className="text-black font-semibold">
                Branch
              </SelectItem>
              {branches.map((item) => {
                if (!item.value) {
                  console.error(
                    `Select.Item value for label "${item.label}" is empty. Please provide a non-empty value.`
                  );
                  return null;
                }
                return (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </>
      ),
      minSize: 100,
    },
    {
      accessorKey: 'customer',
      header: () => (
        <>
          <Select onValueChange={onSelectCustomerHandler}>
            <SelectTrigger className="border-none">
              <SelectValue placeholder="Customer" className="placeholder:text-black placeholder:font-semibold" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer" className="text-black font-semibold">
                Customer
              </SelectItem>
              {customers.map((item) => {
                if (!item.value) {
                  console.error(
                    `Select.Item value for label "${item.label}" is empty. Please provide a non-empty value.`
                  );
                  return null;
                }
                return (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </>
      ),
      minSize: 100,
    },
    {
      accessorKey: 'contactNo',
      header: () => (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="text-black  font-semibold">
                Contact No
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-30 h-15">
              <Input className="h-full" />
            </PopoverContent>
          </Popover>
        </>
      ),
      minSize: 100,
      cell: (props) =>
        (Array.isArray(props.row.original.contactNo) ? props.row.original.contactNo : [props.row.original.contactNo])
          .filter(Boolean)
          .map((contact) => (
            <div key={contact} onClick={() => onPhoneClick(contact)} className="hover:text-blue-700 cursor-pointer">
              {contact.replace(/\D/g, '')}
            </div>
          )) || 'N/A',
    },
    {
      accessorKey: 'emiAmount',
      header: () => (
        <>
          <Select onValueChange={onSelectEmiAmountHandler}>
            <SelectTrigger className="border-none">
              <SelectValue placeholder="EMI Amount" className="placeholder:text-black placeholder:font-semibold" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emi" className="text-black font-semibold">
                EMI Amount
              </SelectItem>
              {emis.map((item) => {
                if (!item.value) {
                  console.error(
                    `Select.Item value for label "${item.label}" is empty. Please provide a non-empty value.`
                  );
                  return null;
                }
                return (
                  <SelectItem key={item.value} value={item.value.toString()}>
                    {item.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </>
      ),
      cell: (props) => (
        <span>
          {CURRENCY_SYMBOLS['INR']} {props.row.original.emiAmount}
        </span>
      ),
    },
    {
      accessorKey: 'dueEmiAmount',
      header: () => (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="text-black font-semibold">
                Due EMI Amount
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-30 h-15">
              <Input className="h-full" />
            </PopoverContent>
          </Popover>
        </>
      ),
      cell: (props) => (
        <span>
          {CURRENCY_SYMBOLS['INR']} {props.row.original.dueEmiAmount}
        </span>
      ),
    },
    {
      accessorKey: 'dueEmi',
      header: () => (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="text-black  font-semibold">
                Due EMI
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-30 h-15">
              <Input className="h-full" />
            </PopoverContent>
          </Popover>
        </>
      ),
    },
    {
      accessorKey: 'followUp',
      header: () => <span className="text-black font-semibold">Follow Up</span>,
      cell: (props) =>
        hasPermission(PERMISSIONS.COLLECTION_FOLLOWUP) && (
          <Button
            onClick={() => handleNavigation(props.row.original.caseNo, `${COLLECTION_ROUTES.FOLLOWUP}`)}
            className=" rounded-full p-0 w-9 h-9 opacity-60 hover:opacity-100 bg-white shadow-lg"
          >
            <UserRoundCheck className="h-5 w-5 flex justify-center items-center  text-[#1D3557] text-center" />
          </Button>
        ),
    },
    {
      accessorKey: 'lastPaymentDetail',
      header: () => <span className="text-black font-semibold">Last Payment</span>,
      cell: (props) => formatDate(props.row.original.lastPaymentDetail),
    },
    {
      accessorKey: 'collectionStatus',
      header: () => (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="text-black  font-semibold">
                Add Payment
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-30 h-15">
              <Input className="h-full" />
            </PopoverContent>
          </Popover>
        </>
      ),
      size: 100,
      cell: (props) => {
        return (
          <Button
            onClick={() => handleNavigation(props.row.original.caseNo, `${COLLECTION_ROUTES.COLLECTION}`)}
            className="rounded-full p-0 w-9 h-9 bg-white flex opacity-60 hover:opacity-100 justify-center items-center text-center shadow-lg"
          >
            <Banknote className="h-5 w-5 flex justify-center items-center  text-[#1D3557] text-center" />
          </Button>
        );
      },
    },
    {
      accessorKey: 'view',
      header: () => <span className="text-black font-semibold">View</span>,
      cell(props) {
        return (
          <Button
            onClick={() => toggleDetails(props.row.original.caseNo)}
            className="rounded-full p-0 w-9 h-9 opacity-60 hover:opacity-100 bg-white shadow-lg"
          >
            <Eye className="h-5 w-5 text-primary" />
          </Button>
        );
      },
    },
  ];

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      {totalRecords && (
        <div className="flex flex-wrap items-center gap-2 my-4">
          <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-4 overflow-hidden">
            <div className="absolute inset-0 opacity-3">
              <div className="absolute top-0 right-0 w-12 h-12 bg-color-primary rounded-full -translate-y-6 translate-x-6"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-color-primary/10 rounded-lg">
                    <Folder className="h-5 w-5 text-color-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-fg-primary">Total Cases</h3>
                    <p className="text-sm text-fg-secondary">Records found for current filters</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-color-primary mx-3">{total}</div>
              </div>
            </div>
          </div>
          <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-4 overflow-hidden">
            <div className="absolute inset-0 opacity-3">
              <div className="absolute top-0 right-0 w-12 h-12 bg-color-primary rounded-full -translate-y-6 translate-x-6"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-color-primary/10 rounded-lg">
                    <Folder className="h-5 w-5 text-color-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-fg-primary">Total Completed Cases</h3>
                    <p className="text-sm text-fg-secondary">Records found for current filters</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-color-primary mx-3">{meta.completedCases}</div>
              </div>
            </div>
          </div>
          <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-4 overflow-hidden">
            <div className="absolute inset-0 opacity-3">
              <div className="absolute top-0 right-0 w-12 h-12 bg-color-primary rounded-full -translate-y-6 translate-x-6"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-color-primary/10 rounded-lg">
                    <Folder className="h-5 w-5 text-color-primary" />
                  </div>
                  <div className="px-3">
                    <h3 className="font-semibold text-fg-primary">Loan Type Summary</h3>
                    <div className="text-sm text-color-primary">
                      {meta.loanTypeSummary?.map(
                        ({ count, loanType }: { count: number; loanType: string }, index: number) => (
                          <span key={index}>
                            {count} {loanType} {index < meta.loanTypeSummary.length - 1 ? ', ' : ''}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {data && (
        <CollectionTable
          pinnedColumns={windowWidth < 800 ? { left: ['caseNo'] } : {}}
          columns={columns}
          data={tableData}
          handlePageChange={handlePageChange}
          page={page}
          total={total}
        />
      )}
    </div>
  );
};

export default TableView;
