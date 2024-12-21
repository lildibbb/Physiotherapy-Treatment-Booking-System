"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui//button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-option";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}
export const priorities = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

export const statuses = [
  { label: "Ongoing", value: "Ongoing" },
  { label: "Pending", value: "Pending" },
  { label: "Cancelled", value: "Cancelled" },
];
export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={
            (table.getColumn("patientName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("patientName")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
