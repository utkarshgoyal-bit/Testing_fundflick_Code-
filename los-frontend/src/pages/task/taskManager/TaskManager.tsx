import PageHeader from '@/components/shared/pageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import hasPermission from '@/helpers/hasPermission';
import { PERMISSIONS } from '@/helpers/permissions';
import { cn } from '@/lib/utils';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import { Filter, ListTodo, RefreshCw } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { NewTask } from './newTask';
import TaskCards from './taskCards';
import { FILTER_BY_ASSIGN_OPTIONS, TASK_STATUS_OPTIONS } from '@/constants/constants';
import { ITaskFormType } from './formSchema';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { Link } from 'react-router-dom';

export default function TaskManager({
  activeFilter,
  statusFilter,
  activePage,
  total,
  hideTaskHeading,
  timezone,
  formatDate,
  isCAType,
  onSetActiveFilterHandler,
  onSetStatusFilterHandler,
  onSetActivePageHandler,
  onAddTaskHandler,
  onRefreshHandler,
}: {
  activeFilter?: string;
  statusFilter?: string;
  taskDialogOpen?: boolean;
  activePage: number;
  total: number;
  hideTaskHeading?: boolean;
  timezone: string;
  formatDate: string;
  isCAType: boolean;
  onSetActiveFilterHandler: (value: string) => void;
  onSetStatusFilterHandler: (value: string) => void;
  onSetTaskDialogOpenHandler: (value: boolean) => void;
  onSetActivePageHandler: (value: number) => void;
  onAddTaskHandler: (payload: ITaskFormType) => void;
  onRefreshHandler: () => void;
}) {
  const renderFilters = () => (
    <div className="flex items-center justify-between gap-4 flex-wrap w-full">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-sm font-medium text-fg-tertiary">
          <Filter size={16} />
          <span>Filter by:</span>
        </div>
        {FILTER_BY_ASSIGN_OPTIONS.map((status) => (
          <Button
            key={status.value}
            variant="ghost"
            className={cn(
              'group rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 border',
              activeFilter === status.value
                ? 'bg-color-primary text-fg-inverse border-color-primary shadow-lg scale-105'
                : 'border-fg-border text-fg-secondary hover:bg-color-surface-muted hover:border-fg-primary'
            )}
            onClick={() => onSetActiveFilterHandler(status?.value || '')}
          >
            <I8nTextWrapper text={status.label} />
            {activeFilter === status.value && (
              <span className="ml-2 h-2 w-2 rounded-full bg-fg-inverse animate-pulse" />
            )}
          </Button>
        ))}
        <Select value={statusFilter} onValueChange={(value) => onSetStatusFilterHandler(value)}>
          <SelectTrigger className="w-[180px] h-10 rounded-full">
            <SelectValue placeholder="Filter By Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Filter By Status</SelectLabel>

              {TASK_STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  <I8nTextWrapper text={status.label} />
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-fg-secondary bg-color-surface-muted px-3 py-2 rounded-full border border-fg-border">
          <span>Total Tasks:</span>
          <span className="font-semibold text-color-primary">{total}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefreshHandler}
          className="border-fg-border hover:bg-color-surface-muted"
          title="Refresh tasks"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>LOS | Task Manager</title>
      </Helmet>
      <Card className="bg-color-surface border-fg-border shadow-sm overflow-hidden">
        <PageHeader
          title={hideTaskHeading ? '' : 'taskManager'}
          subtitle="Manage all your tasks from one place and keep everything organized"
          actions={
            hasPermission(PERMISSIONS.TASK_CREATE) && (
              <div className="flex gap-2">
                <NewTask
                  timezone={timezone}
                  formatDate={formatDate}
                  onAddTaskHandler={onAddTaskHandler}
                  isCAType={isCAType}
                />

                <Link to={buildOrgRoute('/task-management/manage-tasks')}>
                  <Button variant="outline" className="bg-color-primary text-fg-on-accent">
                    <ListTodo className="h-4 w-4 mr-2" />
                    Manage Tasks
                  </Button>
                </Link>
              </div>
            )
          }
        />
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-fg-border">
            {renderFilters()}
          </div>
          <div className="mt-6">
            <TaskCards formatDate={formatDate} timezone={timezone} />
            <AdvancedPagination onSetActivePageHandler={onSetActivePageHandler} activePage={activePage} total={total} />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function AdvancedPagination({
  onSetActivePageHandler,
  activePage,
  total,
}: {
  onSetActivePageHandler: (value: number) => void;
  activePage: number;
  total: number;
}) {
  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onSetActivePageHandler(page);
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
