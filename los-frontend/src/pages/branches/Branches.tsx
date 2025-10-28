import PageHeader from '@/components/shared/pageHeader';
import { RTable } from '@/components/shared/table';
import TableSkeleton from '@/components/shared/tableSkeleton';
import { buttonVariants } from '@/components/ui/button';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import { ROUTES } from '@/lib/enums';
import { cn } from '@/lib/utils';
import { Link, useParams } from 'react-router-dom';
import { RefreshCcw } from 'lucide-react';
import { getRowByColor } from '@/components/shared/evenColor';
import { buildOrgRoute } from '@/helpers/routeHelper';

const Branches = ({
  columns,
  data,
  loading,
  handlePageChange,
  page,
  total,
  handleSortingChange,
  sort,
  hasBranchCreatePermission,
  handleRefresh,
}: {
  columns: any;
  data: any;
  loading: boolean;
  handlePageChange: any;
  page: number;
  total: number;
  handleSortingChange: any;
  sort: any;
  hasBranchCreatePermission: boolean;
  handleRefresh: any;
}) => {
  const { organization } = useParams();
  console.log(organization);
  return (
    <div className="space-y-4 w-full">
      <div>
        <PageHeader title="branches" />
        <div className="flex flex-row justify-end w-full items-end gap-5">
          <RefreshCcw className="w-5 h-5 mb-1" cursor={'pointer'} onClick={handleRefresh} />
          {hasBranchCreatePermission && (
            <Link
              to={buildOrgRoute(ROUTES.BRANCH_MANAGEMENT_REGISTER)}
              className={cn(buttonVariants({ variant: 'outline' }), 'bg-primary text-white')}
            >
              <I8nTextWrapper text="newBranch" />
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="my-3">
          <RTable
            columns={columns}
            getRowClass={getRowByColor}
            data={data || []}
            handlePageChange={handlePageChange}
            page={page}
            tableView={{}}
            total={total}
            handleSortingChange={handleSortingChange}
            sort={sort}
          />
        </div>
      )}
    </div>
  );
};

export default Branches;
