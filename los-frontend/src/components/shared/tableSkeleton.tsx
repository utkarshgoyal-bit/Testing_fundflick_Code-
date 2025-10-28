import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
const TableSkeleton: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border  border-gray-300">
        <thead>
          <tr>
            <th className="p-4 border-b text-[#475467]">
              <Skeleton className="h-6 w-32" />
            </th>
            <th className="p-4 border-b">
              <Skeleton className="h-6 w-32" />
            </th>
            <th className="p-4 border-b">
              <Skeleton className="h-6 w-32" />
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 2}).map((_, index) => (
            <tr key={index}>
              <td className="p-4 border-b">
                <Skeleton className="h-20 w-full" />
              </td>
              <td className="p-4 border-b">
                <Skeleton className="h-20 w-full" />
              </td>
              <td className="p-4 border-b">
                <Skeleton className="h-20 w-full" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
