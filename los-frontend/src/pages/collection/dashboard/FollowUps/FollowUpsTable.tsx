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
import { CSSProperties, useEffect } from 'react';
export default function FollowUpsTable<TData, TValue>({
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
  const getCommonPinningStyles = (column: Column<TData>): CSSProperties => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');
    return {
      boxShadow: isLastLeftPinnedColumn
        ? '-4px 0 4px -4px gray inset'
        : isFirstRightPinnedColumn
          ? '4px 0 4px -4px gray inset'
          : undefined,
      left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
      right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
      opacity: isPinned ? 0.95 : 1,
      position: isPinned ? 'sticky' : 'relative',
      width: column.getSize(),
      zIndex: isPinned ? 1 : 0,
      background: 'white',
    };
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
    <div className="rounded-lg px-10 border">
      <Table className="rounded-lg max-w-full">
        <TableHeader className="bg-background rounded-md">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{
                      minWidth: header.column.columnDef.minSize,
                      ...getCommonPinningStyles(header.column),
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                    className="hover:cursor-pointer text-[#475467]"
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex gap-2 items-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <>
                          {{
                            asc: <ArrowUp size={15} />,
                            desc: <ArrowDown size={15} />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </>
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="even:bg-background ">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row: any) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={cn(
                  'cursor-pointer',
                  `${row?.original?.refCaseId?.dueEmiAmount === 0 ? 'bg-green-500 hover:bg-green-500' : ''}  ${getRowClass && getRowClass(row.original)}`
                )}
              >
                {row.getVisibleCells().map((cell: any) => (
                  <TableCell
                    key={cell.id}
                    // style={{ ...getCommonPinningStyles(cell.column) }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center ">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter className="w-full">
          <TableRow className="w-full">
            <TableCell colSpan={table.getAllFlatColumns().length} className="bg-background">
              {customFooter ? (
                customFooter
              ) : (
                <div className="w-full flex justify-between items-center ">
                  <p>
                    Page {page + 1} of {table.getPageCount() || 1}
                  </p>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={page <= 0}
                      className="mr-2"
                    >
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
