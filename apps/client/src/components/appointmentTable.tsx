import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface AppointmentData {
  appointmentDate: string;
  time: string;
  patientName: string;
  therapistName: string;
  status: string;
}

interface AppointmentTableProps {
  data: AppointmentData[];
}

export const AppointmentTable = ({ data }: AppointmentTableProps) => {
  const columns = React.useMemo<ColumnDef<AppointmentData>[]>(
    () => [
      {
        accessorKey: "appointmentDate",
        header: () => "Date",
      },
      {
        accessorKey: "time",
        header: () => "Time",
      },
      {
        accessorKey: "patientName",
        header: () => "Patient Name",
      },
      {
        accessorKey: "therapistName",
        header: () => "Therapist Name",
      },
      {
        accessorKey: "status",
        header: () => "Status",
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
