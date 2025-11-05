'use client';

import React, { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
  ColumnDef,
  PaginationState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  pageSizeOptions?: number[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  showPagination?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 30, 50],
  isLoading = false,
  emptyMessage = 'No results found',
  emptyDescription = 'Try adjusting your filters',
  showPagination = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  if (isLoading) {
    return <DataTableSkeleton columns={columns} pageSize={pagination.pageSize} />;
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-lg border border-gray-800 bg-[#0f0f10] overflow-hidden shadow-lg">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-gray-800 bg-[#1a1a1b] hover:bg-[#1a1a1b]">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-xs font-bold text-gray-300 uppercase tracking-wider py-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                  className="border-b border-gray-800/50 hover:bg-[#1a1a1b] transition-colors duration-150"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <EmptyState message={emptyMessage} description={emptyDescription} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && data.length > 0 && (
        <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
      )}
    </div>
  );
}

// Empty State Component
function EmptyState({ message, description }: { message: string; description: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12">
      <div className="rounded-full bg-gray-800/50 p-4">
        <svg
          className="h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <div className="text-center space-y-1">
        <p className="font-semibold text-white text-base">{message}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );
}

// Pagination Component siguiendo guías de TanStack Table
function DataTablePagination<TData>({
  table,
  pageSizeOptions,
}: {
  table: ReturnType<typeof useReactTable<TData>>;
  pageSizeOptions: number[];
}) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;

  return (
    <div className="flex items-center justify-between px-2 py-2">
      <div className="flex items-center gap-6">
        <p className="text-sm text-gray-300">
          Showing{' '}
          <span className="font-semibold text-white">
            {table.getState().pagination.pageIndex * pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-white">
            {Math.min((table.getState().pagination.pageIndex + 1) * pageSize, table.getFilteredRowModel().rows.length)}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-white">
            {table.getFilteredRowModel().rows.length}
          </span>{' '}
          results
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-100">Rows:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-9 w-[75px] bg-[#1a1a1b] border-gray-600 text-white font-semibold hover:bg-[#252525] hover:border-[#fe6b24] transition-colors">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="bg-[#1a1a1b] border-gray-600">
              {pageSizeOptions.map((size) => (
                <SelectItem
                  key={size}
                  value={size.toString()}
                  className="text-white font-medium hover:bg-[#fe6b24] focus:bg-[#fe6b24] focus:text-white cursor-pointer"
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="h-9 w-9 border-gray-600 bg-[#1a1a1b] text-white hover:bg-[#fe6b24] hover:text-white hover:border-[#fe6b24] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#1a1a1b] disabled:hover:border-gray-600 transition-all"
            aria-label="Go to first page"
          >
            <DoubleArrowLeftIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-9 w-9 border-gray-600 bg-[#1a1a1b] text-white hover:bg-[#fe6b24] hover:text-white hover:border-[#fe6b24] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#1a1a1b] disabled:hover:border-gray-600 transition-all"
            aria-label="Go to previous page"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-1.5 min-w-[120px] justify-center px-3 py-1.5 rounded-md bg-[#1a1a1b] border border-gray-700">
          <span className="text-sm text-gray-100">
            Page{' '}
            <span className="font-bold text-[#fe6b24] text-base">{currentPage}</span> of{' '}
            <span className="font-bold text-white text-base">{totalPages}</span>
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-9 w-9 border-gray-600 bg-[#1a1a1b] text-white hover:bg-[#fe6b24] hover:text-white hover:border-[#fe6b24] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#1a1a1b] disabled:hover:border-gray-600 transition-all"
            aria-label="Go to next page"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="h-9 w-9 border-gray-600 bg-[#1a1a1b] text-white hover:bg-[#fe6b24] hover:text-white hover:border-[#fe6b24] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#1a1a1b] disabled:hover:border-gray-600 transition-all"
            aria-label="Go to last page"
          >
            <DoubleArrowRightIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function DataTableSkeleton<TData, TValue>({
  columns,
  pageSize = 10,
}: {
  columns: ColumnDef<TData, TValue>[];
  pageSize?: number;
}) {
  return (
    <div className="rounded-lg border border-gray-800 bg-[#0f0f10] overflow-hidden shadow-lg">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-800 bg-[#1a1a1b] hover:bg-[#1a1a1b]">
            {columns.map((_, index) => (
              <TableHead key={index} className="text-xs font-bold text-gray-300 uppercase py-4">
                <div className="h-4 w-24 bg-gray-700/40 rounded animate-pulse" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: pageSize }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="border-b border-gray-800/50 hover:bg-transparent">
              {columns.map((_, cellIndex) => (
                <TableCell key={cellIndex} className="py-4">
                  <div className={`h-4 bg-gray-700/60 rounded animate-pulse ${cellIndex % 3 === 0 ? 'w-3/4' : cellIndex % 3 === 1 ? 'w-2/3' : 'w-1/2'}`} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
