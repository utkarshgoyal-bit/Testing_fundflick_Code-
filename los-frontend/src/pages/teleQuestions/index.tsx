import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/enums';
import hasPermission from '@/helpers/hasPermission';
import { PERMISSIONS } from '@/helpers/permissions';
import { ITelephoneTable } from '@/lib/interfaces/tables';
import PageHeader from '@/components/shared/pageHeader';
import { RootState } from '@/redux/store';
import { DELETE_QUESTION, FETCH_QUESTIONS_DATA } from '@/redux/actions/types';
import { setTableFilters } from '@/redux/slices/teleVerification';
import {
  Plus,
  HelpCircle,
  Edit3,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  FileText,
  Phone,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { buildOrgRoute } from '@/helpers/routeHelper';

export default function TelManagement() {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const { tableConfiguration, loading } = useSelector((state: RootState) => state.questionsSlice);
  const { data, page, total } = tableConfiguration;
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<ITelephoneTable[]>([]);

  const handlePageChange = (newPage: number) => {
    dispatch(setTableFilters({ ...tableConfiguration, page: newPage }));
  };

  const handleEdit = (id: string) => {
    navigation({
      pathname: buildOrgRoute(`${ROUTES.TELEPHONE_MANAGEMENT}${ROUTES.CREATE}`),
      search: `?edit=true&id=${id}`,
    });
  };

  const handleDelete = (id: string) => {
    dispatch({
      type: DELETE_QUESTION,
      payload: { id },
    });
  };

  useEffect(() => {
    dispatch({ type: FETCH_QUESTIONS_DATA });
  }, [page, dispatch]);

  useEffect(() => {
    if (data) {
      const filtered = data.filter(
        (item) =>
          item.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [data, searchTerm]);

  const totalPages = Math.ceil(total / 10);
  const startItem = (page - 1) * 10 + 1;
  const endItem = Math.min(page * 10, total);

  return (
    <div>
      <Helmet>
        <title>LOS | Telephone Questions</title>
      </Helmet>
      {/* Page Header */}
      <PageHeader
        title="Telephone Questions"
        subtitle="Manage verification questions for telephone calls"
        actions={
          hasPermission(PERMISSIONS.TELEPHONE_QUESTION_CREATE) && (
            <Link to={buildOrgRoute(`${ROUTES.TELEPHONE_MANAGEMENT}${ROUTES.CREATE}`)}>
              <Button className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent">
                <Plus className="h-4 w-4 mr-2" />
                Create Question
              </Button>
            </Link>
          )
        }
      />

      {/* Stats & Search Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Stats Cards */}
        <div className="bg-color-surface border border-fg-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-color-primary/10 rounded-lg">
              <HelpCircle className="h-5 w-5 text-color-primary" />
            </div>
            <div>
              <p className="text-sm text-fg-tertiary">Total Questions</p>
              <p className="text-2xl font-bold text-fg-primary">{total}</p>
            </div>
          </div>
        </div>

        <div className="bg-color-surface border border-fg-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-color-success/10 rounded-lg">
              <Phone className="h-5 w-5 text-color-success" />
            </div>
            <div>
              <p className="text-sm text-fg-tertiary">Active</p>
              <p className="text-2xl font-bold text-fg-primary">{data?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-color-surface border-fg-border focus:border-color-primary/50 w-full"
              aria-label="Search questions"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-fg-border hover:bg-color-surface-muted"
            aria-label="Filter questions"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-color-surface border border-fg-border rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full bg-color-surface-muted" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48 bg-color-surface-muted" />
                        <Skeleton className="h-3 w-32 bg-color-surface-muted" />
                      </div>
                    </div>
                    <Skeleton className="h-16 w-full bg-color-surface-muted" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 bg-color-surface-muted" />
                    <Skeleton className="h-8 w-8 bg-color-surface-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredData.length > 0 ? (
          <div className="space-y-4">
            {filteredData.map((item, index) => (
              <div
                key={item._id}
                className="bg-color-surface border border-fg-border rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-color-primary/30 group"
              >
                <div className="flex items-start justify-between">
                  {/* Left Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-color-primary/10 flex items-center justify-center">
                        <span className="text-color-primary font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-color-primary" />
                          <span className="text-xs text-fg-tertiary">Question #{index + 1}</span>
                        </div>
                        <h3 className="font-semibold text-fg-primary text-lg leading-tight mt-1">
                          {item.question || 'No question provided'}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="bg-color-surface-muted/50 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-fg-tertiary" />
                        <span className="text-sm font-medium text-fg-tertiary">Description</span>
                      </div>
                      <p className="text-sm text-fg-secondary leading-relaxed">
                        {item.description || 'No description provided'}
                      </p>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-fg-tertiary">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-color-success rounded-full"></div>
                        <span>Active</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>Telephone Verification</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {hasPermission(PERMISSIONS.TELEPHONE_QUESTION_UPDATE) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item._id)}
                        className="hover:bg-color-primary/10 hover:text-color-primary hover:border-color-primary/30"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    )}
                    {hasPermission(PERMISSIONS.TELEPHONE_QUESTION_DELETE) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item._id)}
                        className="hover:bg-color-error/10 hover:text-color-error hover:border-color-error/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto bg-color-surface-muted rounded-full flex items-center justify-center mb-4">
                <HelpCircle className="w-8 h-8 text-fg-tertiary" />
              </div>
              <h3 className="text-lg font-semibold text-fg-primary mb-2">No Questions Found</h3>
              <p className="text-fg-secondary mb-6">
                {searchTerm
                  ? 'No questions match your search criteria.'
                  : 'Get started by creating your first telephone verification question.'}
              </p>
              {hasPermission(PERMISSIONS.TELEPHONE_QUESTION_CREATE) && (
                <Link to={buildOrgRoute(`${ROUTES.TELEPHONE_MANAGEMENT}${ROUTES.CREATE}`)}>
                  <Button className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Question
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredData.length > 0 && (
        <div className="mt-8 flex items-center justify-between bg-color-surface border border-fg-border rounded-lg p-4">
          <div className="text-sm text-fg-secondary">
            Showing {startItem} to {endItem} of {total} questions
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="border-fg-border hover:bg-color-surface-muted"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={
                      page === pageNum
                        ? 'bg-color-primary text-fg-on-accent'
                        : 'border-fg-border hover:bg-color-surface-muted'
                    }
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="border-fg-border hover:bg-color-surface-muted"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
