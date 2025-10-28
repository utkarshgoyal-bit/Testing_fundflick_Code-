import PageHeader from '@/components/shared/pageHeader';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import hasPermission from '@/helpers/hasPermission';
import { PERMISSIONS } from '@/helpers/permissions';
import { ROUTES } from '@/lib/enums';
import { cn } from '@/lib/utils';
import { EXPORT_CASES, FETCH_COLLECTION } from '@/redux/actions/types';
import { setActiveUploadSection, setActiveView } from '@/redux/slices/collection';
import { AppDispatch, RootState } from '@/redux/store';
import { CloudDownload, Eye, FileChartColumn, Grid2x2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaTable } from 'react-icons/fa';
import 'react-modern-drawer/dist/index.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CardReview from './cardView';
import Filters from './filters';
import TableView from './tableView';
import UploadCsvFile from './uploadCsvFile';
import { buildOrgRoute } from '@/helpers/routeHelper';
const Home: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { tableConfiguration, loading, error, activeView, activeUploadSection, branches, meta } = useSelector(
    (state: RootState) => state.collectionData
  );
  const { page, filters, total, data = [] } = tableConfiguration;

  const onFetchCollections = useCallback(() => {
    dispatch({
      type: FETCH_COLLECTION,
      payload: {
        page: page,
        filters: filters,
      },
    });
  }, [dispatch, page, filters]);

  useEffect(() => {
    dispatch({ type: FETCH_COLLECTION });
  }, [page, filters, dispatch]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePhoneClick = (contactNo: string) => {
    if (isMobile) {
      window.location.href = `tel:${contactNo}`;
    } else {
      const sendOnWhatsApp = window.confirm('Do you want to send message on WhatsApp or want to make a call?');
      if (sendOnWhatsApp) {
        window.open(`https://wa.me/${contactNo}`, '_blank');
      } else {
        window.location.href = `tel:${contactNo}`;
      }
    }
  };

  const handleNavigation = (caseNo: string, type: string) => {
    const path = type.replace(':caseNo', caseNo);
    navigate(path);
  };

  const handleViewToggle = (mode: 'card' | 'table') => {
    dispatch(setActiveView(mode));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Helmet>
        <title>LOS | Collections</title>
      </Helmet>
      <PageHeader
        title="collections"
        actions={
          <div className="flex justify-end p-4 max-md:p-0 max-md:mt-2 space-x-4 flex-grow flex-wrap max-md:gap-4 ">
            <Button
              variant={activeView === 'table' ? 'default' : 'outline'}
              onClick={() => handleViewToggle('table')}
              className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent"
            >
              <FaTable size={15} />
            </Button>
            <Button
              variant={activeView === 'card' ? 'default' : 'outline'}
              onClick={() => handleViewToggle('card')}
              className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent"
            >
              <Grid2x2 size={15} />
            </Button>
            {hasPermission(PERMISSIONS.COLLECTION_UPLOAD) && (
              <Dialog>
                <DialogTrigger
                  className={cn(
                    buttonVariants({ variant: 'default' }),
                    'bg-color-primary hover:bg-color-primary-light text-fg-on-accent'
                  )}
                >
                  <FileChartColumn className="w-5 h-5" />
                  Upload CSV
                </DialogTrigger>
                <DialogContent className="w-fit p-4 ">
                  <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col md:flex-row border border-gray-300  shadow-sm overflow-hidden">
                    <div className="md:w-[30%]">
                      <Button
                        onClick={() => dispatch(setActiveUploadSection(0))}
                        className="w-full h-12 rounded-none"
                        variant={activeUploadSection == 0 ? 'default' : 'outline'}
                      >
                        Collection Data
                      </Button>
                      <Button
                        onClick={() => dispatch(setActiveUploadSection(1))}
                        className="w-full h-12 rounded-none"
                        variant={activeUploadSection == 1 ? 'default' : 'outline'}
                      >
                        Co-applicants Data
                      </Button>
                    </div>
                    <div className="p-4 md:w-[70%]">
                      <UploadCsvFile />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <a className="text-blue-600" href="/sample_collection.csv">
                      Sample collection file
                    </a>
                    <a className="text-blue-600" href="/sample_coapplicants.csv">
                      Sample co-applicants file
                    </a>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            {hasPermission(PERMISSIONS.COLLECTION_VIEW_DAILY) && (
              <Button
                className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent"
                onClick={() => navigate(buildOrgRoute(ROUTES.DAILY_VIEW))}
              >
                <Eye /> <span>Daily View</span>
              </Button>
            )}
            {hasPermission(PERMISSIONS.COLLECTION_EXPORT_CASES) && (
              <Button
                onClick={() => dispatch({ type: EXPORT_CASES, payload: data })}
                className={cn(
                  buttonVariants({ variant: 'default' }),
                  'bg-color-primary hover:bg-color-primary-light text-fg-on-accent'
                )}
              >
                <CloudDownload />
                <span>Download</span>
              </Button>
            )}
          </div>
        }
      />
      <div className="flex gap-5  w-full my-4  justify-between items-center">
        <Filters branches={branches} filters={filters} onFetchCollections={onFetchCollections} />
      </div>
      <div className="bg-background">
        {activeView === 'card' ? (
          <CardReview onPhoneClick={handlePhoneClick} handleNavigation={handleNavigation} />
        ) : activeView === 'table' ? (
          <TableView
            onPhoneClick={handlePhoneClick}
            handleNavigation={handleNavigation}
            totalRecords={total}
            data={data}
            page={page}
            total={total}
            meta={meta}
            branches={branches}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Home;
