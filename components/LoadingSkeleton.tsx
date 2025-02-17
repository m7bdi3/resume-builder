import { Skeleton } from "@/components/ui/skeleton";

const TableRowSkeleton = () => (
  <tr className="border-b last:border-b-0 ">
    <td className="py-3 px-4">
      <Skeleton className="h-6 w-24" />
    </td>
    <td className="py-3 px-4">
      <Skeleton className="h-6 w-32" />
    </td>
    <td className="py-3 px-4">
      <Skeleton className="h-6 w-16" />
    </td>
    <td className="py-3 px-4">
      <Skeleton className="h-6 w-20" />
    </td>
  </tr>
);

export function TableSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-lg border  shadow-sm ">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="">
            <tr>
              <th className="py-3 px-4 text-left">
                <Skeleton className="h-6 w-24" />
              </th>
              <th className="py-3 px-4 text-left">
                <Skeleton className="h-6 w-32" />
              </th>
              <th className="py-3 px-4 text-left">
                <Skeleton className="h-6 w-16" />
              </th>
              <th className="py-3 px-4 text-left">
                <Skeleton className="h-6 w-20" />
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(15)].map((_, index) => (
              <TableRowSkeleton key={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
