import PageHeader from '@/components/shared/pageHeader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ForgotPasswordForm } from '@/pages/auth/forgotPassword/form';
import { UPDATE_PASSWORD } from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import {
  BadgeCheck,
  Building2,
  Calendar,
  Key,
  CloudUpload,
  CreditCard,
  IndianRupee,
  Mail,
  MapPin,
  Phone,
  Plus,
  Shield,
  User,
} from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { data } = useSelector((state: RootState) => state.login);
  const employment = data?.employment;

  function formatDate(data: { oldPassword: string; newPassword: string }) {
    dispatch({ type: UPDATE_PASSWORD, payload: data });
    setOpen(false);
  }

  return (
    <div className="w-full">
      <Helmet>
        <title>LOS | Profile</title>
      </Helmet>
      <div className="min-h-screen bg-color-background w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <PageHeader title="profile" />
        </div>

        {/* Profile Overview Card */}
        <div className="bg-color-surface border border-fg-border rounded-xl shadow-lg mb-6 overflow-hidden transition-shadow duration-300">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <img
                  src="/avtar.jpeg"
                  alt="Profile"
                  className="h-20 w-20 rounded-full border-4 border-color-accent shadow-lg transition-shadow duration-300"
                />
                <div className="absolute -bottom-1 -right-1 bg-color-success rounded-full p-1 border-2 border-color-surface">
                  <BadgeCheck size={16} className="text-fg-on-accent" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-text-color-primary mb-1">
                      {employment?.firstName} {employment?.lastName}
                    </h1>
                    <p className="text-sm text-text-color-secondary mb-2">
                      Employee ID: {employment?._id} ({employment?.eId})
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-color-accent text-color-primary px-3 py-1 rounded-full font-medium border border-color-accent shadow-sm">
                        {employment?.role}
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium shadow-sm ${
                          employment?.isActive
                            ? 'bg-color-success text-fg-on-accent border border-color-success'
                            : 'bg-color-error text-fg-on-accent border border-color-error'
                        }`}
                      >
                        {employment?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-fg-border px-6 py-4 bg-color-surface-muted/50">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-color-surface rounded-lg border border-fg-border">
                <Building2 size={16} className="text-color-info" />
                <span className="text-sm text-text-color-primary font-medium">{employment?.designation}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-color-surface rounded-lg border border-fg-border">
                <Shield size={16} className="text-color-warning" />
                <span className="text-sm text-text-color-primary font-medium">{employment?.qualification}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-fg-border px-6 py-4 bg-color-surface-muted">
            <div className="flex flex-wrap gap-3 justify-end">
              {/* <button className="px-4 py-2 text-sm font-medium text-text-color-primary border border-fg-border rounded-lg bg-color-surface hover:bg-color-surface-muted hover:border-color-primary transition-all duration-200 shadow-sm">
                View full report
              </button> */}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="px-4 py-2 text-sm font-medium text-fg-on-accent bg-color-primary rounded-lg hover:bg-color-primary-light transition-all duration-200 shadow-md flex items-center gap-2">
                  <Key size={16} />
                  Update Password
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update password</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <ForgotPasswordForm onSubmit={formatDate} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="bg-color-surface border border-fg-border rounded-xl shadow-lg mb-6 transition-shadow duration-300">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-text-color-primary mb-1">Personal Details</h2>
                <p className="text-sm text-text-color-secondary">
                  Manage your personal information and contact details
                </p>
              </div>
              {/* <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-color-primary bg-color-surface border border-fg-border rounded-lg hover:bg-color-surface-muted hover:border-color-secondary transition-all duration-200 shadow-sm">
                  <CloudUpload size={16} className="text-color-info2" />
                  Upload
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-fg-on-accent bg-color-primary rounded-lg hover:bg-color-primary-light transition-all duration-200 shadow-md">
                  <Plus size={16} />
                  Edit details
                </button>
              </div> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2 p-4 bg-color-surface-muted/30 rounded-lg border border-fg-border hover:border-color-info transition-colors">
                <div className="flex items-center gap-2 text-text-color-primary font-medium">
                  <Phone size={16} className="text-color-success" />
                  Phone Number
                </div>
                <p className="text-text-color-secondary pl-6">{employment?.mobile || 'Not provided'}</p>
              </div>

              <div className="space-y-2 p-4 bg-color-surface-muted/30 rounded-lg border border-fg-border hover:border-color-error transition-colors">
                <div className="flex items-center gap-2 text-text-color-primary font-medium">
                  <Mail size={16} className="text-color-error" />
                  Email Address
                </div>
                <p className="text-text-color-secondary pl-6">{employment?.email || 'Not provided'}</p>
              </div>

              <div className="space-y-2 p-4 bg-color-surface-muted/30 rounded-lg border border-fg-border hover:border-color-warning transition-colors">
                <div className="flex items-center gap-2 text-text-color-primary font-medium">
                  <Calendar size={16} className="text-color-warning" />
                  Date of Birth
                </div>
                <p className="text-text-color-secondary pl-6">
                  {employment?.dob ? moment(employment?.dob).format('DD/MM/YYYY') : 'Not provided'}
                </p>
              </div>

              <div className="space-y-2 p-4 bg-color-surface-muted/30 rounded-lg border border-fg-border hover:border-color-info2 transition-colors">
                <div className="flex items-center gap-2 text-text-color-primary font-medium">
                  <User size={16} className="text-color-info2" />
                  Gender
                </div>
                <p className="text-text-color-secondary pl-6">{employment?.sex || 'Not provided'}</p>
              </div>

              <div className="space-y-2 p-4 bg-color-surface-muted/30 rounded-lg border border-fg-border hover:border-color-secondary transition-colors">
                <div className="flex items-center gap-2 text-text-color-primary font-medium">
                  <User size={16} className="text-color-secondary" />
                  Marital Status
                </div>
                <p className="text-text-color-secondary pl-6">{employment?.maritalStatus || 'Not provided'}</p>
              </div>

              <div className="space-y-2 p-4 bg-color-surface-muted/30 rounded-lg border border-fg-border hover:border-color-accent transition-colors">
                <div className="flex items-center gap-2 text-text-color-primary font-medium">
                  <Calendar size={16} className="text-color-accent" />
                  Joining Date
                </div>
                <p className="text-text-color-secondary pl-6">{employment?.joiningDate || 'Not provided'}</p>
              </div>

              <div className="space-y-2 md:col-span-2 p-4 bg-color-surface-muted/30 rounded-lg border border-fg-border hover:border-color-primary transition-colors">
                <div className="flex items-center gap-2 text-text-color-primary font-medium">
                  <MapPin size={16} className="text-color-primary" />
                  Address
                </div>
                <p className="text-text-color-secondary pl-6">
                  {employment?.addressLine1 && employment?.addressLine2
                    ? `${employment.addressLine1}, ${employment.addressLine2}`
                    : 'Not provided'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial & Documentation Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Financial Information */}
          <div className="bg-color-surface border border-fg-border rounded-xl shadow-lg  transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-text-color-primary mb-1">Financial Information</h2>
                  <p className="text-sm text-text-color-secondary">Salary structure and financial details</p>
                </div>
                <div className="flex gap-3">
                  <button
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-color-primary bg-color-surface border border-fg-border rounded-lg hover:bg-color-surface-muted hover:border-color-info transition-all duration-200 shadow-sm"
                    disabled={true}
                  >
                    <CloudUpload size={14} className="text-color-info" />
                    Upload
                  </button>
                  <button
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-fg-on-accent bg-color-primary rounded-lg hover:bg-color-primary-light transition-all duration-200 shadow-md "
                    disabled={true}
                  >
                    <Plus size={14} />
                    Edit details
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-color-success/10 border border-color-success/30 rounded-lg hover:bg-color-success/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-color-success rounded-lg">
                      <IndianRupee size={20} className="text-fg-on-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-text-color-primary">Base Salary</p>
                      <p className="text-sm text-text-color-secondary">Monthly base pay</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-color-success">₹{employment?.baseSalary || '0'}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-color-info/10 border border-color-info/30 rounded-lg hover:bg-color-info/20 transition-colors">
                    <p className="text-sm font-medium text-color-info flex items-center gap-1">
                      <Building2 size={14} />
                      HRA
                    </p>
                    <p className="text-lg font-semibold text-text-color-primary">₹{employment?.hra || '0'}</p>
                  </div>
                  <div className="p-3 bg-color-warning/10 border border-color-warning/30 rounded-lg hover:bg-color-warning/20 transition-colors">
                    <p className="text-sm font-medium text-color-warning flex items-center gap-1">
                      <MapPin size={14} />
                      Conveyance
                    </p>
                    <p className="text-lg font-semibold text-text-color-primary">₹{employment?.conveyance || '0'}</p>
                  </div>
                  <div className="p-3 bg-color-error/10 border border-color-error/30 rounded-lg hover:bg-color-error/20 transition-colors">
                    <p className="text-sm font-medium text-color-error flex items-center gap-1">
                      <IndianRupee size={14} />
                      Incentive
                    </p>
                    <p className="text-lg font-semibold text-text-color-primary">₹{employment?.incentive || '0'}</p>
                  </div>
                  <div className="p-3 bg-color-secondary/10 border border-color-secondary/30 rounded-lg hover:bg-color-secondary/20 transition-colors">
                    <p className="text-sm font-medium text-color-secondary flex items-center gap-1">
                      <CreditCard size={14} />
                      Commission
                    </p>
                    <p className="text-lg font-semibold text-text-color-primary">₹{employment?.commission || '0'}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-color-accent/20 border border-color-accent/40 rounded-lg hover:bg-color-accent/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-color-accent rounded-lg">
                      <IndianRupee size={20} className="text-color-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-text-color-primary">Current Ledger Balance</p>
                      <p className="text-sm text-text-color-secondary">Available balance</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-color-accent">₹{employment?.ledger || '0'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Documentation & Banking */}
          <div className="bg-color-surface border border-fg-border rounded-xl shadow-lg  transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-1">Documentation & Banking</h2>
                  <p className="text-sm text-text-color-secondary">Identity documents and banking information</p>
                </div>
                <div className="flex gap-3">
                  <button
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-color-primary bg-color-surface border border-fg-border rounded-lg hover:bg-color-surface-muted hover:border-color-info transition-all duration-200 shadow-sm"
                    disabled={true}
                  >
                    <CloudUpload size={14} className="text-color-info" />
                    Upload
                  </button>
                  <button
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-fg-on-accent bg-color-primary rounded-lg hover:bg-color-primary-light transition-all duration-200 shadow-md"
                    disabled={true}
                  >
                    <Plus size={14} />
                    Edit details
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                {/* Identity Documents */}
                <div>
                  <h3 className="text-lg font-semibold text-text-color-secondary mb-4">Identity Documents</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-fg-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard size={16} className="text-fg-secondary" />
                        <div>
                          <p className="font-medium text-text-color-primary">PAN Card</p>
                          <p className="text-sm text-text-color-secondary">{employment?.pan || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-fg-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard size={16} className="text-fg-secondary" />
                        <div>
                          <p className="font-medium text-text-color-primary">Aadhar Card</p>
                          <p className="text-sm text-text-color-secondary">{employment?.uid || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Banking Details */}
                <div>
                  <h3 className="text-lg font-semibold text-text-color-secondary mb-4">Banking Details</h3>
                  <div className="p-4 bg-color-surface-muted rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-text-color-secondary">Account Number</span>
                        <span className="text-sm font-medium text-text-color-primary">
                          {employment?.accountNumber || 'Not provided'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-text-color-secondary">IFSC</span>
                        <span className="text-sm font-medium text-text-color-primary">
                          {employment?.ifsc || 'Not provided'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-text-color-secondary">Account Name</span>
                        <span className="text-sm font-medium text-text-color-primary">
                          {employment?.accountName || 'Not provided'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-text-color-secondary">Bank Name</span>
                        <span className="text-sm text-text-color-secondary">
                          {employment?.bankName || 'Not provided'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
