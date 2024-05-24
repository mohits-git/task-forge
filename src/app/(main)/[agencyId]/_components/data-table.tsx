'use client';

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow
} from '@/components/ui/table';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useModal } from "@/providers/modal-provider";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/global/custom-modal";
import { Separator } from "@/components/ui/separator";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterValue: string;
  actionButtonText?: React.ReactNode;
  modalChildren?: React.ReactNode;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  filterValue,
  actionButtonText,
  modalChildren,
}: DataTableProps<TData, TValue>) {

  const { setOpen } = useModal();
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Team Members:</h2>
        <Button
          onClick={() => {
            if (modalChildren) {
              setOpen(
                <CustomModal
                  title="Add a New Team Member"
                  subheading="Send an invitation."
                >
                  {modalChildren}
                </CustomModal>
              )
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-md"
        >
          {actionButtonText}
        </Button>
      </div>

      <div className="flex items-center mt-6 mb-1 gap-2">
        <Search className="text-muted-foreground/80" size={15} />
        <Input placeholder="Search Name..."
          value={(table.getColumn(filterValue)?.getFilterValue() as string) ?? ''}
          onChange={(e) => {
            table.getColumn(filterValue)?.setFilterValue(e.target.value);
          }}
          className="placeholder:text-muted-foreground/90 border-none focus:outline-0 outline-0 focus:border-none focus-visible:ring-0"
        />
      </div>
      <Separator />
      <p className="text-muted-foreground text-[0.80rem] py-3">Team</p>
      <div className="border bg-background rounded-lg">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return <TableHead key={header.id} >
                    {header.isPlaceholder ? null : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No Team Member.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
