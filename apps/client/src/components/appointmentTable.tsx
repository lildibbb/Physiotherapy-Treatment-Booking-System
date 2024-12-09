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
import { Badge } from "./ui/badge"; // ShadCN Badge component

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
        cell: (info) => {
          // Use badges for status display
          const status = info.getValue<string>();
          let badgeColor = "default";
          if (status === "Confirmed") badgeColor = "green";
          else if (status === "Pending") badgeColor = "yellow";
          else if (status === "Cancelled") badgeColor = "red";

          return <Badge variant={badgeColor}>{status}</Badge>;
        },
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
    <div className="rounded-lg border shadow-sm">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-gray-50">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
                >
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
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-gray-100 transition duration-150"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="px-4 py-2 text-sm text-gray-700"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-4 text-sm text-gray-500"
              >
                No appointments found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
