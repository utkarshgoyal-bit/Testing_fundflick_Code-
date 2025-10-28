/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { toFormatDate } from '@/helpers/dateFormater';
import generateGoogleMapsURL from '@/helpers/generateGoogleMapsURL';
import { COLLECTION_ROUTES, PAYMENT_STATUS } from '@/lib/enums';
import { cn } from '@/lib/utils';
import { setPage } from '@/redux/slices/collection';
import { AppDispatch, RootState } from '@/redux/store';
import { FETCH_COLLECTION_BY_CASE_NO, FLAG_CASE } from '@/redux/store/actionTypes';
import {
  AlertCircle,
  Building,
  Calendar,
  Car,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  ExternalLink,
  Eye,
  FileText,
  Flag,
  Home,
  IndianRupee,
  MapPin,
  MessageCircle,
  Phone,
  TrendingUp,
  User,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UpdateLocationForm from '../loanDetails/updateLocationForm';

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case PAYMENT_STATUS.PAID:
      return <CheckCircle className="h-4 w-4" />;
    case PAYMENT_STATUS.DUE_PAYMENT:
      return <Clock className="h-4 w-4" />;
    case PAYMENT_STATUS.EXPIRED:
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case PAYMENT_STATUS.PAID:
      return 'bg-color-success/10 text-color-success border-color-success/20';
    case PAYMENT_STATUS.DUE_PAYMENT:
      return 'bg-color-warning/10 text-color-warning border-color-warning/20';
    case PAYMENT_STATUS.EXPIRED:
      return 'bg-color-error/10 text-color-error border-color-error/20';
    default:
      return 'bg-color-surface-muted text-fg-secondary border-fg-border';
  }
};

const getLoanTypeIcon = (loanType: string) => {
  switch (loanType?.trim().toLowerCase()) {
    case 'hl':
      return <Home className="h-5 w-5" />;
    case 'cl':
      return <User className="h-5 w-5" />;
    case 'vl':
      return <Car className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};
const CardView: React.FC<any> = ({ onPhoneClick, handleNavigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { tableConfiguration } = useSelector((state: RootState) => state.collectionData);
  const { data, total, page } = tableConfiguration;

  const toggleDetails = (caseNo: string) => {
    navigate(COLLECTION_ROUTES.LOAN_DETAILS_PAGE.replace(':caseNo', caseNo));
  };

  const updatePage = (page: number) => {
    if (page < 0) return;
    dispatch(setPage(page));
  };

  const { caseNo } = useParams<{ caseNo: string }>();

  useEffect(() => {
    if (caseNo) {
      dispatch({ type: FETCH_COLLECTION_BY_CASE_NO, payload: caseNo });
    }
  }, [caseNo, dispatch]);

  return (
    <div>
      {data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((record: any) => (
              <CaseCard
                key={record.caseNo}
                record={record}
                toggleDetails={toggleDetails}
                handleNavigation={handleNavigation}
                onPhoneClick={onPhoneClick}
              />
            ))}
          </div>

          {/* Enhanced Pagination */}
          <div className="mt-8 flex items-center justify-center gap-4 bg-color-surface border border-fg-border rounded-lg p-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => updatePage(page - 1)}
              className="border-fg-border hover:bg-color-surface-muted"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-fg-secondary">
                Page {page + 1} of {Math.ceil(total / 10) || 1}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={page === Math.ceil(total / 10) - 1 || Math.ceil(total / 10) === 0}
              onClick={() => updatePage(page + 1)}
              className="border-fg-border hover:bg-color-surface-muted"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto">
            <div className="w-16 h-16 mx-auto bg-color-surface-muted rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-fg-tertiary" />
            </div>
            <h3 className="text-lg font-semibold text-fg-primary mb-2">No Records Found</h3>
            <p className="text-fg-secondary">
              No collection records match your current criteria. Try adjusting your search or filters.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const CaseCard = ({
  record,
  toggleDetails,
  handleNavigation,
  onPhoneClick,
}: {
  record: any;
  toggleDetails: (caseNo: string) => void;
  handleNavigation: (caseNo: string, route: string) => void;
  onPhoneClick: (contactNo: string) => void;
}) => {
  const dispatch = useDispatch();
  const [flagRemark, setFlagRemark] = useState(record?.flagRemark || '');
  const [isFlagOpen, setIsFlagOpen] = useState(false);
  const handleFlagCase = (caseNo: string, isFlagged: boolean, flagRemark: string) => {
    dispatch({
      type: FLAG_CASE,
      payload: {
        caseNo: caseNo,
        isFlagged,
        flagRemark: flagRemark,
      },
    });
    setIsFlagOpen(false);
  };
  return (
    <div
      key={record.caseNo}
      className="group relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 overflow-hidden hover:border-color-primary/30"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        {/* <div className="absolute top-0 right-0 w-16 h-16 bg-color-primary rounded-full -translate-y-8 translate-x-8"></div> */}
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-color-secondary rounded-full translate-y-6 -translate-x-6"></div>
      </div>

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
          backgroundSize: '12px 12px',
        }}
      ></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-color-primary/3 via-transparent to-color-secondary/3"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-color-primary/10 rounded-lg border border-color-primary/20">
              {getLoanTypeIcon(record.loanType)}
            </div>
            <div>
              <h3 className="font-semibold text-fg-primary">{record.caseNo}</h3>
              <p className="text-sm text-fg-secondary">{record.customer || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.collectionStatus)}`}
            >
              <div className="flex items-center gap-1">
                {getStatusIcon(record.collectionStatus)}
                <span className="capitalize">{record.collectionStatus || 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location and Contact */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-color-secondary" />
              <span className="text-sm text-fg-secondary">{record.area || 'Location N/A'}</span>
            </div>

            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2 h-auto hover:bg-color-primary/10">
                    <MapPin className="h-4 w-4 text-color-primary" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-color-surface border-fg-border">
                  <DialogHeader>
                    <DialogTitle className="text-fg-primary">Address Details</DialogTitle>
                    <DialogDescription className="text-fg-secondary">
                      View complete address and location information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-color-surface-muted rounded-lg p-4">
                      <p className="text-fg-primary font-medium">{record.address || 'Address not available'}</p>
                    </div>
                    d
                    {record.latitude && record.longitude ? (
                      <Link
                        target="_blank"
                        to={generateGoogleMapsURL(record.latitude, record.longitude)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-color-primary text-fg-on-accent rounded-lg hover:bg-color-primary-light transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open in Google Maps
                      </Link>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3 bg-color-warning/10 rounded-lg border border-color-warning/20">
                          <AlertCircle className="h-4 w-4 text-color-warning" />
                          <span className="text-sm text-color-warning">Location needs to be set</span>
                        </div>
                        <UpdateLocationForm
                          caseNo={record.caseNo}
                          defaultValues={{
                            latitude: record?.latitude,
                            longitude: record?.longitude,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Popover open={isFlagOpen} onOpenChange={setIsFlagOpen}>
                <PopoverTrigger
                  className={cn(
                    // buttonVariants({ variant: record.isFlagged ? 'default' : 'outline', size: 'icon' }),

                    !record.isFlagged && 'bg-transparent'
                  )}
                >
                  <Flag className="w-4 h-4" color={record.isFlagged ? 'red' : 'gray'} enableBackground={10} />
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4 py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none my-2">Flag Case</p>
                      <Textarea
                        defaultValue={record.flagRemark}
                        onChange={(e) => {
                          setFlagRemark(e.target.value);
                        }}
                        className="h-8"
                        placeholder="Flag Remark"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleFlagCase(record.caseNo, !record.isFlagged, flagRemark)}
                        className="w-full"
                      >
                        {record.isFlagged ? 'Unflag Case' : 'Flag Case'}
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Contact Numbers */}
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-color-info" />
            {record.contactNo && Array.isArray(record.contactNo) ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => record?.contactNo[0] && onPhoneClick(record.contactNo[0])}
                  className="px-3 py-1 text-sm bg-color-info/10 text-color-info rounded-lg border border-color-info/20 hover:bg-color-info/20 transition-colors"
                >
                  {record?.contactNo[0]?.replace(/\D/g, '')}
                </button>
                {record.contactNo.length > 1 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="px-2 py-1 text-xs h-auto">
                        +{record.contactNo.length - 1}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-color-surface border-fg-border">
                      <DialogHeader>
                        <DialogTitle className="text-fg-primary">Contact Numbers</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2">
                        {record.contactNo.map((contact: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-color-surface-muted rounded-lg hover:bg-color-surface-muted/80 transition-colors group cursor-pointer"
                            onClick={() => onPhoneClick(contact)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-color-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-color-primary">{idx + 1}</span>
                              </div>
                              <span className="text-fg-primary">{contact.replace(/\D/g, '')}</span>
                            </div>
                            <Phone className="h-4 w-4 text-color-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            ) : (
              <span className="text-sm text-fg-tertiary">Not Available</span>
            )}
          </div>
        </div>

        {/* Amount Cards */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-color-surface-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <IndianRupee className="h-4 w-4 text-color-primary" />
              <span className="text-xs text-fg-tertiary">EMI Amount</span>
            </div>
            <div className="text-lg font-bold text-fg-primary">₹{record.loanAmount || record.emiAmount || '0'}</div>
          </div>
          <div className="bg-color-surface-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-color-error" />
              <span className="text-xs text-fg-tertiary">Due Amount</span>
            </div>
            <div className="text-lg font-bold text-color-error">₹{record.dueEmiAmount || '0'}</div>
          </div>
        </div>

        {/* EMI Due Info */}
        <div className="bg-color-info/10 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-color-info" />
            <span className="text-sm text-color-info">
              EMI's Due: <span className="font-semibold">{record.dueEmi || '0'}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button
            size="sm"
            className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent"
            onClick={() => handleNavigation(record.caseNo, COLLECTION_ROUTES.COLLECTION)}
          >
            <CreditCard className="h-4 w-4 mr-1" />
            Collect
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-fg-border hover:bg-color-surface-muted"
            onClick={() => handleNavigation(record.caseNo, COLLECTION_ROUTES.FOLLOWUP)}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Follow
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-fg-border hover:bg-color-surface-muted"
            onClick={() => toggleDetails(record.caseNo)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </div>

        {/* Last Payment Info */}
        <div className="pt-3 border-t border-fg-border">
          <div className="flex items-center gap-2 text-xs text-fg-tertiary">
            <Calendar className="h-3 w-3" />
            <span>Last Payment: </span>
            <span className="text-fg-secondary">
              {toFormatDate({ date: record.lastPaymentDetailsTimeStamp, toFormat: 'DD MMM YYYY' }) || 'Never'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CardView;
