"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./dashboard/staff/data-table-column-header";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Appointment = {
  appointmentDate: string;
  time: string;
  patientName: string;
  therapistName: string;
  status: string;
};

export const columns: ColumnDef<Appointment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "patientName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patient" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px] truncate">{row.getValue("patientName")}</div>
    ),
  },
  {
    accessorKey: "therapistName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Therapist" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px] truncate">{row.getValue("therapistName")}</div>
    ),
  },
  {
    accessorKey: "appointmentDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Appointment Date" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]">{row.getValue("appointmentDate")}</div>
    ),
  },
  {
    accessorKey: "time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time" />
    ),
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("time")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue<string>("status");
      let badgeVariant:
        | "default"
        | "secondary"
        | "destructive"
        | "outline"
        | undefined = "default";

      if (status === "Ongoing") badgeVariant = "secondary";
      else if (status === "Pending") badgeVariant = "outline";
      else if (status === "Cancelled") badgeVariant = "destructive";

      return <Badge variant={badgeVariant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View patient</DropdownMenuItem>
            <DropdownMenuItem>View appointment</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
