import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import { LOAN_TYPE_LIST } from '@/lib/enums';
import { setTableFilters } from '@/redux/slices/collection';
import debounce from 'debounce';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Search,
  Check,
  X,
  Calendar,
  IndianRupee,
  Building,
  FileText,
  ChevronDown,
  ChevronUp,
  Home,
  Car,
  User,
  RefreshCw,
  SlidersHorizontal,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FETCH_COLLECTION } from '@/redux/actions/types';

export default function Filters({
  branches,
  filters,
  onFetchCollections,
}: {
  branches?: any[];
  filters?: any;
  onFetchCollections: () => void;
}) {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    loanType: filters.loanType || '',
    selectedBranches: filters.branch || ([] as string[]),
    dueEmiStart: filters.dueEmi?.start || '',
    dueEmiEnd: filters.dueEmi?.end || '',
    lastPaymentStart: filters.lastPaymentDetail?.start || '',
    lastPaymentEnd: filters.lastPaymentDetail?.end || '',
  });

  const handleBranchChange = (value: string) => {
    setFormData((prevData) => {
      const updatedBranches = prevData.selectedBranches.includes(value)
        ? prevData.selectedBranches.filter((branch: string) => branch !== value)
        : [...prevData.selectedBranches, value];
      return { ...prevData, selectedBranches: updatedBranches };
    });
  };

  const handleLoanTypeChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      loanType: value,
    }));
  };

  const handleApplyFilters = () => {
    const filtersToApply = {
      loanType: formData.loanType ? [formData.loanType] : undefined,
      branch: formData.selectedBranches.length > 0 ? formData.selectedBranches : undefined,
      dueEmi:
        formData.dueEmiStart || formData.dueEmiEnd
          ? {
              start: formData.dueEmiStart || undefined,
              end: formData.dueEmiEnd || undefined,
            }
          : undefined,
      lastPaymentDetail:
        formData.lastPaymentStart || formData.lastPaymentEnd
          ? {
              start: formData.lastPaymentStart || undefined,
              end: formData.lastPaymentEnd || undefined,
            }
          : undefined,
    };
    setIsExpanded(false);
    dispatch(setTableFilters(filtersToApply));
  };

  const handleClearFilters = () => {
    setFormData({
      loanType: '',
      selectedBranches: [],
      dueEmiStart: '',
      dueEmiEnd: '',
      lastPaymentStart: '',
      lastPaymentEnd: '',
    });
    dispatch(
      setTableFilters({
        loanType: '',
        branch: '',
        dueEmi: '',
        lastPaymentDetail: '',
        search: '',
      })
    );
    dispatch({ type: FETCH_COLLECTION });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onFetchCollections();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const debouncedFilter = debounce((value: string) => dispatch(setTableFilters({ search: value })), 400);
  const onSearchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedFilter(value);
  };

  const getLoanTypeIcon = (type: string) => {
    switch (type) {
      case 'hl':
        return <Home className="h-4 w-4" />;
      case 'vl':
        return <Car className="h-4 w-4" />;
      case 'cl':
        return <User className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const activeFiltersCount = [
    formData.loanType,
    formData.selectedBranches.length > 0,
    formData.dueEmiStart || formData.dueEmiEnd,
    formData.lastPaymentStart || formData.lastPaymentEnd,
  ].filter(Boolean).length;

  return (
    <div className="w-full">
      {/* Main Filter Bar */}
      <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-6 shadow-sm overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-3">
          {/* <div className="absolute top-0 right-0 w-20 h-20 bg-color-primary rounded-full -translate-y-10 translate-x-10"></div> */}
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-color-secondary rounded-full translate-y-8 -translate-x-8"></div>
        </div>

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
            backgroundSize: '12px 12px',
          }}
        ></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-color-primary/3 via-transparent to-color-secondary/3"></div>

        <div className="relative z-10">
          {/* Search and Actions Row */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
            {/* Search Section */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-tertiary" />
              <Input
                placeholder="Search by case number or customer name..."
                onChange={onSearchHandler}
                className="pl-10 bg-color-surface border-fg-border focus:border-color-primary/50 h-12"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="border-fg-border hover:bg-color-surface-muted h-12 px-4"
                    >
                      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh Data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="border-fg-border hover:bg-color-surface-muted h-12 px-4"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-2 bg-color-primary text-fg-on-accent text-xs px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
                {isExpanded ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.loanType && (
                <div className="flex items-center gap-2 px-3 py-1 bg-color-primary/10 text-color-primary rounded-full text-sm border border-color-primary/20">
                  {getLoanTypeIcon(formData.loanType)}
                  <span>Loan: {LOAN_TYPE_LIST.find((item) => item.value === formData.loanType)?.label}</span>
                  <button
                    onClick={() => {
                      setFormData({ ...formData, loanType: '' });
                      dispatch(
                        setTableFilters({
                          ...formData,
                          loanType: '',
                        })
                      );
                    }}
                    className="hover:bg-color-primary/20 rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {formData.selectedBranches.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-color-secondary/10 text-color-secondary rounded-full text-sm border border-color-secondary/20">
                  <Building className="h-3 w-3" />
                  <span>Branches: {formData.selectedBranches.length}</span>
                  <button
                    onClick={() => {
                      setFormData({ ...formData, selectedBranches: [] });
                      dispatch(
                        setTableFilters({
                          ...formData,
                          branch: [],
                        })
                      );
                    }}
                    className="hover:bg-color-secondary/20 rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {(formData.dueEmiStart || formData.dueEmiEnd) && (
                <div className="flex items-center gap-2 px-3 py-1 bg-color-accent/10 text-color-accent rounded-full text-sm border border-color-accent/20">
                  <IndianRupee className="h-3 w-3" />
                  <span>EMI Range</span>
                  <button
                    onClick={() => {
                      setFormData({ ...formData, dueEmiStart: '', dueEmiEnd: '' });
                      dispatch(
                        setTableFilters({
                          ...formData,
                          dueEmi: '',
                        })
                      );
                    }}
                    className="hover:bg-color-accent/20 rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {(formData.lastPaymentStart || formData.lastPaymentEnd) && (
                <div className="flex items-center gap-2 px-3 py-1 bg-color-info/10 text-color-info rounded-full text-sm border border-color-info/20">
                  <Calendar className="h-3 w-3" />
                  <span>Payment Period</span>
                  <button
                    onClick={() => {
                      setFormData({ ...formData, lastPaymentStart: '', lastPaymentEnd: '' });
                      dispatch(
                        setTableFilters({
                          ...formData,
                          lastPaymentDetail: '',
                        })
                      );
                    }}
                    className="hover:bg-color-info/20 rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expandable Filter Panel */}
      {isExpanded && (
        <div className="mt-4 bg-color-surface border border-fg-border rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Loan Type Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-fg-primary">
                <FileText className="h-4 w-4 text-color-primary" />
                Loan Type
              </label>
              <Select value={formData.loanType} onValueChange={handleLoanTypeChange}>
                <SelectTrigger className="bg-color-surface border-fg-border hover:border-color-primary/50 focus:border-color-primary h-12">
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent className="bg-color-surface border-fg-border">
                  {LOAN_TYPE_LIST.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      className="hover:bg-color-surface-muted focus:bg-color-surface-muted"
                    >
                      <div className="flex items-center gap-2">
                        {getLoanTypeIcon(item.value)}
                        {item.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Branch Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-fg-primary">
                <Building className="h-4 w-4 text-color-secondary" />
                Branches
              </label>
              <Select>
                <SelectTrigger className="bg-color-surface border-fg-border hover:border-color-primary/50 focus:border-color-primary h-12">
                  <SelectValue
                    placeholder={
                      formData.selectedBranches?.length > 0
                        ? `${formData.selectedBranches.length} selected`
                        : 'Select branches'
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-color-surface border-fg-border max-h-60 overflow-auto">
                  {branches?.map((branch: any) => (
                    <div
                      key={branch.label}
                      className="flex items-center p-3 hover:bg-color-surface-muted transition-colors cursor-pointer"
                      onClick={() => handleBranchChange(branch.value)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            formData.selectedBranches.includes(branch.value)
                              ? 'bg-color-primary border-color-primary'
                              : 'border-fg-border'
                          }`}
                        >
                          {formData.selectedBranches.includes(branch.value) && (
                            <Check className="h-3 w-3 text-fg-on-accent" />
                          )}
                        </div>
                        <span className="text-sm text-fg-primary">{branch.item}</span>
                      </div>
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* EMI Range */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-fg-primary">
                {/* <IndianRupee className="h-4 w-4 text-color-accent" /> */}
                EMI Range
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  {/* <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-tertiary" /> */}
                  <Input
                    type="number"
                    placeholder="Min"
                    value={formData.dueEmiStart}
                    onChange={(e) => setFormData({ ...formData, dueEmiStart: e.target.value })}
                    min={0}
                    className=" bg-color-surface border-fg-border focus:border-color-primary/50 h-12"
                  />
                </div>
                <div className="relative flex-1">
                  {/* <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-tertiary" /> */}
                  <Input
                    type="number"
                    placeholder="Max"
                    value={formData.dueEmiEnd}
                    onChange={(e) => setFormData({ ...formData, dueEmiEnd: e.target.value })}
                    min={formData.dueEmiStart}
                    className=" bg-color-surface border-fg-border focus:border-color-primary/50 h-12"
                  />
                </div>
              </div>
            </div>

            {/* Payment Period */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-fg-primary">
                <Calendar className="h-4 w-4 text-color-info" />
                Payment Period
              </label>
              <div className="flex gap-3">
                <Input
                  type="date"
                  value={formData.lastPaymentStart}
                  onChange={(e) => {
                    setFormData({ ...formData, lastPaymentStart: e.target.value });
                  }}
                  className="bg-color-surface border-fg-border focus:border-color-primary/50 h-12"
                />
                <Input
                  type="date"
                  value={formData.lastPaymentEnd}
                  onChange={(e) => setFormData({ ...formData, lastPaymentEnd: e.target.value })}
                  className="bg-color-surface border-fg-border focus:border-color-primary/50 h-12"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-fg-border">
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="border-fg-border hover:bg-color-surface-muted"
            >
              <XCircle className="h-4 w-4 mr-2" />
              <I8nTextWrapper text="clear" />
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              <I8nTextWrapper text="apply" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
