import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { IDataTableProps } from '@/lib/interfaces';
import { cn } from '@/lib/utils';
import {
  Column,
  SortingState,
  Updater,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useEffect } from 'react';
export function RTable<TData, TValue>({
  columns,
  data,
  total,
  page,
  tableView,
  rowSelection,
  handleRowSelection,
  sort,
  handlePageChange,
  handleSortingChange,
  pinnedColumns,
  customFooter,
  getRowClass,
}: IDataTableProps<TData, TValue>) {
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnPinning: {
        left: pinnedColumns?.left || [],
        right: pinnedColumns?.right || [],
      },
      columnVisibility: tableView || {},
    },
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    state: {
      sorting: sort || [],
      rowSelection: rowSelection || {},
    },
    rowCount: total,
    enableRowSelection: true,
    onRowSelectionChange: handleRowSelectionChange,
    onSortingChange: (updaterOrValue: Updater<SortingState>) => {
      if (typeof updaterOrValue === 'function') {
        if (handleSortingChange) {
          handleSortingChange(updaterOrValue(sort || []));
        }
      } else {
        if (handleSortingChange) {
          handleSortingChange(updaterOrValue);
        }
      }
    },
  });
  function handleRowSelectionChange(selectedRowIds: any) {
    if (handleRowSelection) {
      handleRowSelection(selectedRowIds(rowSelection));
    }
  }
  function handleNextPage() {
    handlePageChange(page + 1);
  }
  function handlePreviousPage() {
    handlePageChange(page - 1);
  }
  const getCommonPinningClass = (column: Column<TData>): string => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');
    return cn(
      isLastLeftPinnedColumn ? 'shadow-l' : isFirstRightPinnedColumn ? 'shadow-r' : '',
      isPinned === 'left' ? `left-${column.getStart('left')}px` : '',
      isPinned === 'right' ? `right-${column.getAfter('right')}px` : '',
      isPinned ? 'opacity-95' : 'opacity-100',
      isPinned ? 'sticky' : 'relative',
      `w-${column.getSize()}px`,
      isPinned ? 'z-[60]' : 'z-0',
      'bg-white'
    );
  };
  useEffect(() => {
    if (!tableView || !Object.keys(tableView).length) {
      table.setColumnVisibility({});
    } else {
      const visible = columns.reduce((acc: { [key: string]: boolean }, item: any) => {
        acc[item.accessorKey] = false;
        return acc;
      }, {});
      table.setColumnVisibility({
        ...visible,
        ...tableView,
        action: true,
        isActiveKey: true,
      });
    }
  }, [columns, table, tableView]);
  useEffect(() => {
    table.setColumnPinning(pinnedColumns || {});
  }, [pinnedColumns, table]);
  return (
    <div className="rounded-2xl border">
      <Table className="w-full rounded-2xl relative">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{
                    minWidth: header.column.columnDef.minSize,
                    zIndex: header.column.getIsPinned() ? 99 : 0,
                  }}
                  onClick={header.column.getToggleSortingHandler()}
                  className={cn(
                    getCommonPinningClass(header.column),
                    'h-12 px-4 text-left align-middle font-medium text-muted-foreground hover:cursor-pointer'
                  )}
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() && (
                        <span>
                          {header.column.getIsSorted() === 'asc' ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={cn('cursor-pointer', ` ${getRowClass && getRowClass(row.original)}`)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{
                      minWidth: cell.column.columnDef.minSize,
                      zIndex: cell.column.getIsPinned() ? 99 : 0,
                    }}
                    className={cn(
                      getCommonPinningClass(cell.column),
                      'p-4',
                      `${getRowClass && getRowClass(row.original)}`
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter className="absolute z-10  w-full">
          <TableRow>
            <TableCell colSpan={table.getAllFlatColumns().length}>
              {customFooter ? (
                customFooter
              ) : (
                <div className="flex items-center justify-between px-2">
                  <div className="text-sm text-muted-foreground">
                    Page {page + 1} of {table.getPageCount() || 1}
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={page <= 0}>
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={page + 1 >= table.getPageCount()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
