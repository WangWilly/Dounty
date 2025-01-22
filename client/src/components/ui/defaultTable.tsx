// https://nextui.org/docs/components/table
// https://dev.to/franciscolunadev82/getting-start-with-tables-using-nextjs-tanstack-table-and-typescript-2aig
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";

////////////////////////////////////////////////////////////////////////////////
// https://tanstack.com/table/v8/docs/framework/react/examples/sorting

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
};

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (!data.length) {
    return <div className="h-24 text-center">No results.</div>;
  }

  return (
    <div className="overflow-x-auto p-4 max-h-dvh overflow-y-scroll">
      <Table aria-label="Default Data Table">
        <TableHeader>
          {table.getFlatHeaders().map((header) => (
            <TableColumn
              key={header.id}
              allowsSorting={header.column.getCanSort()}
              onClick={header.column.getToggleSortingHandler()}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
              {{
                asc: " ▲",
                desc: " ▼",
              }[header.column.getIsSorted() as string] ?? null}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
