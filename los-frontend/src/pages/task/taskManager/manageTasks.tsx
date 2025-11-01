import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/shared/pageHeader';
import { Button } from '@/components/ui/button';
import { setStatusFilter, setTaskActivePage } from '@/redux/slices/tasks';
import { Calendar } from 'lucide-react';
import { FETCH_BULK_TASKS } from '@/redux/actions/types';
import { useEffect, useState } from 'react';
import NewBulkTask from './BulkTasks/NewBulkTask';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import ScheduleCards from './ScheduleCards';
import { getOrganizationSettings } from '@/redux/slices/organizationConfigs/fetchOrganizationConfigs';
const taskStatusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Upcoming', value: 'upcoming' },
];
export default function ManageTasks() {
  const dispatch = useDispatch();
  const { activeTab, activeFilter, statusFilter, activePage } = useSelector((state: RootState) => state.tasks);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const orgSettings = useSelector(getOrganizationSettings);
  const timezone = orgSettings.find(({ id }: { id: string }) => id === 'timezone')?.value || 'Asia/Kolkata';
  const formatDate = orgSettings.find(({ id }: { id: string }) => id === 'formatDate')?.value || 'DD/MM/YYYY';
  useEffect(() => {
    dispatch({ type: FETCH_BULK_TASKS });
  }, [activeTab, dispatch, activeFilter, statusFilter, activePage]);

  const renderFilters = () => (
    <div className="flex items-center flex-wrap flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-fg-border">
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search tasks"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>
      <div className="flex flex-row items-center gap-4">
        <Select value={statusFilter} onValueChange={(value) => dispatch(setStatusFilter(value))}>
          <SelectTrigger className="w-[120px] lg:w-[180px] h-10 rounded-full">
            <SelectValue placeholder="Filter By Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Filter By Status</SelectLabel>
              {taskStatusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  <I8nTextWrapper text={status.label} />
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal rounded-full h-10 px-4',
                !selectedDate && 'text-muted-foreground'
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
  return (
    <div className="p-6">
      <PageHeader
        title="manageBulkTasks"
        subtitle="Manage, view, and filter all your scheduled tasks here."
        actions={<NewBulkTask />}
      />
      <Card className="bg-color-surface border-fg-border shadow-sm overflow-hidden mt-6">
        <CardContent className="p-6">
          {renderFilters()}
          <ScheduleCards timezone={timezone} formatDate={formatDate} searchQuery={searchQuery} />
          <AdvancedPagination />
        </CardContent>
      </Card>
    </div>
  );
}
function AdvancedPagination() {
  const dispatch = useDispatch();
  const { total, activePage } = useSelector((state: RootState) => state.tasks);
  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setTaskActivePage(page));
    }
  };
  const getPageNumbers = () => {
    let start = Math.floor((activePage - 1) / 10) * 10 + 1;
    let end = Math.min(start + 9, totalPages);
    let pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return { pages, start, end };
  };
  const { pages, start, end } = getPageNumbers();
  return (
    <Pagination className="my-3 border-t pt-4 border-fg-border">
      <PaginationContent>
        {/* Prev */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => goToPage(activePage - 1)}
            className={activePage === 1 ? 'pointer-events-none opacity-50 cursor-pointer' : ' cursor-pointer'}
          />
        </PaginationItem>
        {start > 1 && (
          <>
            <PaginationItem>
              <PaginationLink className="cursor-pointer" onClick={() => goToPage(1)}>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis onClick={() => goToPage(start - 10)} className="cursor-pointer" />
            </PaginationItem>
          </>
        )}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink className="cursor-pointer" isActive={page === activePage} onClick={() => goToPage(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {end < totalPages && (
          <>
            <PaginationItem>
              <PaginationEllipsis onClick={() => goToPage(end + 1)} className="cursor-pointer" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink className="cursor-pointer" onClick={() => goToPage(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => goToPage(activePage + 1)}
            className={cn(activePage === totalPages ? 'pointer-events-none opacity-50' : '', ' cursor-pointer')}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
