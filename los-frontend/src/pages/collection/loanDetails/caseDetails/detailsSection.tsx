import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IDetailsSection, IFollowUpPayment, IPayment } from '@/lib/interfaces/';
import { RootState } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import UserDetails from './userDetails';
import UserPaymentDetails from './userPaymentDetails';
import {
  setFilter as setFollowUpFilter,
  resetFilters as resetFollowUpFilters,
} from '@/redux/slices/collection/folllowUpSlice';
import {
  setFilter as setPaymentSliceFilter,
  resetFilters as resetPaymentSliceFilters,
} from '@/redux/slices/collection/paymentSliceCollection';
import {
  ActivityIcon,
  HandCoins,
  History,
  Notebook,
  Clock,
  FileText,
  Users,
  DollarSign,
  Target,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';
import CollectionCoApplicantView from '@/pages/collection/loanDetails/collectionCoapplicantsView';
import DocumentTable from '@/pages/collection/loanDetails/documents';
import Actions from './actions';
import DueEmi from './dueEmi';
import Emi from './emi';
import CaseHistory from './CaseHistory';

const DetailsSection: React.FC<IDetailsSection> = ({ loanDetails, isSuperAdmin, isCollectionHead }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCaseDetailsOpen, setIsCaseDetailsOpen] = useState(false);
  const paymentSlicePayments = useSelector((state: RootState) => state.paymentSliceDetails.payments);
  const followUpPayments = useSelector((state: RootState) => state.FollowUpsliceDetails.payments);
  const { caseNo } = useParams<{ caseNo: string }>();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setFollowUpFilter({
        caseId: caseNo,
      })
    );
    dispatch(
      setPaymentSliceFilter({
        caseId: caseNo,
      })
    );
    return () => {
      dispatch(resetFollowUpFilters());
      dispatch(resetPaymentSliceFilters());
    };
  }, [caseNo, dispatch]);

  if (!loanDetails) {
    return (
      <div className="min-h-[400px] bg-color-surface rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-color-primary/20 border-t-color-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-fg-secondary">Loading loan details...</p>
        </div>
      </div>
    );
  }

  const filteredFollowUpPayments = followUpPayments
    ? followUpPayments.filter((payment: IFollowUpPayment) => payment.refCaseId?.caseNo === caseNo)
    : [];

  const filteredPaymentSlicePayments = paymentSlicePayments
    ? paymentSlicePayments.filter((payment: IPayment) => payment.refCaseId?.caseNo === caseNo)
    : [];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-color-primary/10 text-color-primary border-color-primary/20';
      case 'secondary':
        return 'bg-color-secondary/10 text-color-secondary border-color-secondary/20';
      case 'success':
        return 'bg-color-success/10 text-color-success border-color-success/20';
      case 'warning':
        return 'bg-color-warning/10 text-color-warning border-color-warning/20';
      case 'info':
        return 'bg-color-info/10 text-color-info border-color-info/20';
      default:
        return 'bg-color-primary/10 text-color-primary border-color-primary/20';
    }
  };

  const tabItems = [
    {
      value: 'dueEmi',
      label: 'Due EMI',
      icon: HandCoins,
      color: 'warning',
      description: 'Outstanding EMI details',
    },
    {
      value: 'history',
      label: 'History',
      icon: History,
      color: 'info',
      description: 'Case activity timeline',
    },
    {
      value: 'caseDetails',
      label: 'Case Details',
      icon: Notebook,
      color: 'primary',
      description: 'Customer information',
    },
    ...(isSuperAdmin || isCollectionHead
      ? [
          {
            value: 'action',
            label: 'Action',
            icon: ActivityIcon,
            color: 'success',
            description: 'Administrative actions',
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dueEmi" className="w-full">
        {/* Enhanced Tab Navigation */}
        <div className="bg-color-surface border border-fg-border rounded-xl p-4 mb-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-3 bg-transparent h-auto p-0">
            {tabItems.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="relative group data-[state=active]:bg-color-primary data-[state=active]:text-white border border-fg-border rounded-lg p-4 h-auto transition-all duration-200 hover:border-color-primary/50"
                >
                  <div className="flex items-center gap-3">
                    {/* Desktop Layout */}
                    <div className="hidden md:flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg border ${getColorClasses(tab.color)} group-data-[state=active]:bg-white/20 group-data-[state=active]:border-white/30 group-data-[state=active]:text-white`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{tab.label}</div>
                        <div className="text-xs text-fg-secondary group-data-[state=active]:text-white/80">
                          {tab.description}
                        </div>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden flex flex-col items-center gap-2">
                      <div
                        className={`p-2 rounded-lg border ${getColorClasses(tab.color)} group-data-[state=active]:bg-white/20 group-data-[state=active]:border-white/30 group-data-[state=active]:text-white`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium">{tab.label}</span>
                    </div>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Case Details Tab */}
        <TabsContent value="caseDetails" className="space-y-6">
          {/* Customer Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Details Card */}
            <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-xl overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-3">
                {/* <div className="absolute top-0 right-0 w-16 h-16 bg-color-primary rounded-full -translate-y-8 translate-x-8"></div> */}
                <div className="absolute bottom-0 left-0 w-12 h-12 bg-color-secondary rounded-full translate-y-6 -translate-x-6"></div>
              </div>

              {/* Grid Pattern */}
              <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
                  backgroundSize: '12px 12px',
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-color-primary/3 via-transparent to-color-secondary/3"></div>

              <div className="relative z-10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-color-primary/10 rounded-lg border border-color-primary/20">
                    <Users className="w-5 h-5 text-color-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-fg-primary">Customer Details</h3>
                    <p className="text-sm text-fg-secondary">Personal and contact information</p>
                  </div>
                </div>

                <UserDetails
                  filteredFollowUpPayments={filteredFollowUpPayments}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  loanDetails={loanDetails}
                />
              </div>
            </div>

            {/* Payment Details Card */}
            <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-xl overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-3">
                <div className="absolute top-0 right-0 w-16 h-16 bg-color-success rounded-full -translate-y-8 translate-x-8"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 bg-color-warning rounded-full translate-y-6 -translate-x-6"></div>
              </div>

              {/* Grid Pattern */}
              <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
                  backgroundSize: '12px 12px',
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-color-success/3 via-transparent to-color-warning/3"></div>

              <div className="relative z-10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-color-success/10 rounded-lg border border-color-success/20">
                    <DollarSign className="w-5 h-5 text-color-success" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-fg-primary">Payment Details</h3>
                    <p className="text-sm text-fg-secondary">Transaction history and records</p>
                  </div>
                </div>

                <UserPaymentDetails
                  filteredPaymentSlicePayments={filteredPaymentSlicePayments}
                  isCaseDetailsOpen={isCaseDetailsOpen}
                  setIsCaseDetailsOpen={setIsCaseDetailsOpen}
                  loanDetails={loanDetails}
                />
              </div>
            </div>
          </div>

          {/* Co-Applicants Section */}
          <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-3">
              <div className="absolute top-0 right-0 w-20 h-20 bg-color-secondary rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-color-accent rounded-full translate-y-8 -translate-x-8"></div>
            </div>

            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
                backgroundSize: '12px 12px',
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-color-secondary/3 via-transparent to-color-accent/3"></div>

            <div className="relative z-10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-color-secondary/10 rounded-lg border border-color-secondary/20">
                    <Users className="w-5 h-5 text-color-secondary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-fg-primary">Co-Applicants</h3>
                    <p className="text-sm text-fg-secondary">Additional applicant information</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-fg-tertiary" />
              </div>

              <CollectionCoApplicantView />
            </div>
          </div>

          {/* Documents Section */}
          <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-3">
              <div className="absolute top-0 right-0 w-16 h-16 bg-color-info rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-color-primary rounded-full translate-y-6 -translate-x-6"></div>
            </div>

            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
                backgroundSize: '12px 12px',
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-color-info/3 via-transparent to-color-primary/3"></div>

            <div className="relative z-10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-color-info/10 rounded-lg border border-color-info/20">
                  <FileText className="w-5 h-5 text-color-info" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-fg-primary">Documents</h3>
                  <p className="text-sm text-fg-secondary">Case related documents and files</p>
                </div>
              </div>

              <DocumentTable />
            </div>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-3">
              <div className="absolute top-0 right-0 w-20 h-20 bg-color-info rounded-full -translate-y-10 translate-x-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-color-primary rounded-full translate-y-8 -translate-x-8"></div>
            </div>

            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
                backgroundSize: '12px 12px',
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-color-info/3 via-transparent to-color-primary/3"></div>

            <div className="relative z-10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-color-info/10 rounded-lg border border-color-info/20">
                  <Clock className="w-5 h-5 text-color-info" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-fg-primary">Case History</h3>
                  <p className="text-sm text-fg-secondary">Complete timeline of case activities</p>
                </div>
              </div>

              <CaseHistory loanDetails={loanDetails} />
            </div>
          </div>
        </TabsContent>

        {/* Due EMI Tab */}
        <TabsContent value="dueEmi" className="space-y-6">
          {/* Due EMI Amount Card */}
          <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-3">
              <div className="absolute top-0 right-0 w-16 h-16 bg-color-warning rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-color-error rounded-full translate-y-6 -translate-x-6"></div>
            </div>

            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
                backgroundSize: '12px 12px',
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-color-warning/3 via-transparent to-color-error/3"></div>

            <div className="relative z-10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-color-warning/10 rounded-lg border border-color-warning/20">
                  <Target className="w-5 h-5 text-color-warning" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-fg-primary">Due EMI Amount</h3>
                  <p className="text-sm text-fg-secondary">Outstanding EMI payment details</p>
                </div>
              </div>

              <DueEmi loanDetails={loanDetails} />
            </div>
          </div>

          {/* Number of Due EMI Card */}
          <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-3">
              <div className="absolute top-0 right-0 w-16 h-16 bg-color-error rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-color-warning rounded-full translate-y-6 -translate-x-6"></div>
            </div>

            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
                backgroundSize: '12px 12px',
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-color-error/3 via-transparent to-color-warning/3"></div>

            <div className="relative z-10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-color-error/10 rounded-lg border border-color-error/20">
                  <BarChart3 className="w-5 h-5 text-color-error" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-fg-primary">Number of Due EMI</h3>
                  <p className="text-sm text-fg-secondary">Count of outstanding EMI payments</p>
                </div>
              </div>

              <Emi loanDetails={loanDetails} />
            </div>
          </div>
        </TabsContent>

        {/* EMI Tab (Legacy) */}
        <TabsContent value="emi">
          <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-xl overflow-hidden">
            <div className="p-6">
              <Emi loanDetails={loanDetails} />
            </div>
          </div>
        </TabsContent>

        {/* Action Tab */}
        {(isSuperAdmin || isCollectionHead) && (
          <TabsContent value="action">
            <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-xl overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-3">
                <div className="absolute top-0 right-0 w-16 h-16 bg-color-success rounded-full -translate-y-8 translate-x-8"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 bg-color-primary rounded-full translate-y-6 -translate-x-6"></div>
              </div>

              {/* Grid Pattern */}
              <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
                  backgroundSize: '12px 12px',
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-color-success/3 via-transparent to-color-primary/3"></div>

              <div className="relative z-10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-color-success/10 rounded-lg border border-color-success/20">
                    <ActivityIcon className="w-5 h-5 text-color-success" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-fg-primary">Administrative Actions</h3>
                    <p className="text-sm text-fg-secondary">Case management and administrative tools</p>
                  </div>
                </div>

                <Actions />
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default DetailsSection;
