import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import generateGoogleMapsURL from '@/helpers/generateGoogleMapsURL';
import hasPermission from '@/helpers/hasPermission';
import { PERMISSIONS } from '@/helpers/permissions';
import { RootState } from '@/redux/slices';
import {
  MapPin,
  Plus,
  User,
  Phone,
  FileText,
  Users,
  Edit3,
  ExternalLink,
  Search,
  Crown,
  UserCheck,
  Settings,
  ChevronDown,
  ChevronRight,
  Globe,
  Home,
  Sparkles,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import UpdateLocationForm from '@/pages/collection/loanDetails/updateLocationForm';
import { Link } from 'react-router-dom';
import PhoneNumberForm from './phoneNumberForm';
import { useState, useMemo } from 'react';

export default function CollectionCoApplicantView() {
  const {
    data: { data: loanDetails },
  } = useSelector((state: RootState) => state.branchCollectionCaseNoData);

  const [selectedApplicant, setSelectedApplicant] = useState<'primary' | number>('primary');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['applicant', 'contact', 'location']));

  const getApplicantIcon = (type: string, name?: string) => {
    if (type === 'primary') return <Crown className="h-4 w-4 text-color-primary" />;
    const nameStr = name?.toLowerCase() || '';
    if (nameStr.includes('co')) return <UserCheck className="h-4 w-4 text-color-secondary" />;
    return <User className="h-4 w-4 text-color-info" />;
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'applicant':
        return <User className="h-4 w-4 text-color-primary" />;
      case 'contact':
        return <Phone className="h-4 w-4 text-color-success" />;
      case 'location':
        return <MapPin className="h-4 w-4 text-color-info" />;
      default:
        return <Settings className="h-4 w-4 text-color-secondary" />;
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const getCurrentApplicantData = () => {
    if (selectedApplicant === 'primary') {
      return {
        name: loanDetails?.customer,
        fileId: loanDetails?.caseNo,
        address: loanDetails?.address,
        contactNo: loanDetails?.contactNo,
        latitude: loanDetails?.latitude,
        longitude: loanDetails?.longitude,
        type: 'Primary Applicant',
      };
    } else {
      const coApplicant = loanDetails?.coApplicantsData?.[selectedApplicant as number];
      return {
        name: coApplicant?.name,
        fileId: loanDetails?.caseNo,
        address: coApplicant?.address || loanDetails?.address,
        contactNo: coApplicant?.contactNo,
        latitude: coApplicant?.latitude,
        longitude: coApplicant?.longitude,
        type: coApplicant?.ownershipIndicator || 'Co-Applicant',
        coApplicantData: coApplicant,
      };
    }
  };

  const currentApplicant = getCurrentApplicantData();

  const filteredApplicants = useMemo(() => {
    const applicants = [
      { type: 'primary', data: { name: loanDetails?.customer, type: 'Primary Applicant' } },
      ...(loanDetails?.coApplicantsData || []).map((coApp: any, index: number) => ({
        type: index,
        data: { name: coApp.name, type: coApp.ownershipIndicator || 'Co-Applicant' },
      })),
    ];

    if (!searchTerm) return applicants;

    return applicants.filter(
      (app) =>
        app.data.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.data.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [loanDetails, searchTerm]);

  const getApplicantStats = () => {
    const totalApplicants = 1 + (loanDetails?.coApplicantsData?.length || 0);
    const withContacts = [loanDetails, ...(loanDetails?.coApplicantsData || [])].filter(
      (app) => app?.contactNo?.length > 0
    ).length;
    const withLocation = [loanDetails, ...(loanDetails?.coApplicantsData || [])].filter(
      (app) => app?.latitude && app?.longitude
    ).length;

    return { total: totalApplicants, withContacts, withLocation };
  };

  const stats = getApplicantStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-color-background via-color-surface to-color-surface-muted p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-color-primary/5 via-color-secondary/5 to-color-accent/5 rounded-2xl -z-10" />
          <Card className="border-0 shadow-lg bg-color-surface/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-color-primary/10 rounded-xl">
                    <Users className="h-6 w-6 text-color-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-color-primary">Applicant Management</CardTitle>
                    <CardDescription className="text-fg-secondary">
                      Manage applicant and co-applicant details for case {loanDetails?.caseNo}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-color-primary/20 text-color-primary">
                    {stats.total} Applicants
                  </Badge>
                  <Badge variant="outline" className="border-color-success/20 text-color-success">
                    {stats.withContacts} with Contacts
                  </Badge>
                  <Badge variant="outline" className="border-color-info/20 text-color-info">
                    {stats.withLocation} with Location
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applicants Sidebar */}
          <Card className="lg:col-span-1 shadow-lg border-0 bg-color-surface/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-color-primary" />
                  <CardTitle className="text-lg text-color-primary">Applicants</CardTitle>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Plus className="h-4 w-4 text-color-primary" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add co-applicant</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Search */}
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-tertiary" />
                <Input
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-color-surface border-fg-border"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-2">
                  {filteredApplicants.map((applicant) => {
                    const isSelected = selectedApplicant === applicant.type;
                    const contactCount =
                      applicant.type === 'primary'
                        ? loanDetails?.contactNo?.length || 0
                        : loanDetails?.coApplicantsData?.[applicant.type as number]?.contactNo?.length || 0;

                    return (
                      <div
                        key={applicant.type}
                        onClick={() => setSelectedApplicant(applicant.type)}
                        className={cn(
                          'group relative p-4 rounded-lg border transition-all duration-200 cursor-pointer',
                          'hover:shadow-md hover:border-color-primary/30',
                          isSelected
                            ? 'border-color-primary bg-gradient-to-r from-color-primary/10 via-color-primary/5 to-transparent shadow-sm'
                            : 'border-fg-border bg-color-surface hover:bg-color-surface-muted/50'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {getApplicantIcon(applicant.type === 'primary' ? 'primary' : 'co', applicant.data.name)}
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-fg-primary truncate">
                                {applicant.data.name || 'N/A'}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {contactCount} contacts
                                </Badge>
                                {applicant.type === 'primary' && (
                                  <Badge variant="destructive" className="text-xs">
                                    Primary
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-fg-secondary mt-1 truncate">{applicant.data.type}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Edit3 className="h-4 w-4 text-color-secondary" />
                            </Button>
                          </div>
                        </div>

                        {/* Active indicator */}
                        {isSelected && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-color-primary rounded-r-full" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Details Panel */}
          <Card className="lg:col-span-2 shadow-lg border-0 bg-color-surface/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-color-primary/10 rounded-lg">
                    {getApplicantIcon(selectedApplicant === 'primary' ? 'primary' : 'co', currentApplicant.name)}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-color-primary">{currentApplicant.name || 'N/A'}</CardTitle>
                    <CardDescription className="text-fg-secondary">
                      {currentApplicant.type} - File ID: {currentApplicant.fileId}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="border-fg-border">
                    <Edit3 className="h-4 w-4 mr-2 text-color-info" />
                    Edit Details
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {/* Applicant Information Section */}
                  <Card className="border border-fg-border/50 bg-color-surface-muted/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          onClick={() => toggleSection('applicant')}
                          className="flex items-center gap-2 p-0 h-auto hover:bg-transparent"
                        >
                          {expandedSections.has('applicant') ? (
                            <ChevronDown className="h-4 w-4 text-color-primary" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-color-primary" />
                          )}
                          {getSectionIcon('applicant')}
                          <span className="font-semibold text-fg-primary">Applicant Information</span>
                        </Button>
                      </div>
                    </CardHeader>

                    {expandedSections.has('applicant') && (
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2 p-4 bg-color-surface-muted/30 rounded-lg border border-fg-border">
                            <div className="flex items-center gap-2 text-fg-primary font-medium">
                              <FileText size={16} className="text-color-primary" />
                              File ID
                            </div>
                            <p className="text-fg-secondary pl-6">{currentApplicant.fileId || 'Not provided'}</p>
                          </div>

                          <div className="space-y-2 p-4 bg-color-surface-muted/30 rounded-lg border border-fg-border">
                            <div className="flex items-center gap-2 text-fg-primary font-medium">
                              <User size={16} className="text-color-success" />
                              Full Name
                            </div>
                            <p className="text-fg-secondary pl-6">{currentApplicant.name || 'Not provided'}</p>
                          </div>

                          <div className="space-y-2 p-4 bg-color-surface-muted/30 rounded-lg border border-fg-border md:col-span-2">
                            <div className="flex items-center gap-2 text-fg-primary font-medium">
                              <Home size={16} className="text-color-info" />
                              Address
                            </div>
                            <p className="text-fg-secondary pl-6">{currentApplicant.address || 'Not provided'}</p>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>

                  {/* Contact Information Section */}
                  <Card className="border border-fg-border/50 bg-color-surface-muted/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          onClick={() => toggleSection('contact')}
                          className="flex items-center gap-2 p-0 h-auto hover:bg-transparent"
                        >
                          {expandedSections.has('contact') ? (
                            <ChevronDown className="h-4 w-4 text-color-primary" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-color-primary" />
                          )}
                          {getSectionIcon('contact')}
                          <span className="font-semibold text-fg-primary">Contact Information</span>
                          <Badge variant="secondary" className="ml-2">
                            {currentApplicant.contactNo?.length || 0} contacts
                          </Badge>
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-color-success hover:bg-color-success/10"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-3">
                                <span className="p-2.5 bg-color-success/10 rounded-lg border border-color-success/20">
                                  <Plus className="w-5 h-5 text-color-success" />
                                </span>
                                Add Phone Number
                              </DialogTitle>
                              <DialogDescription>
                                Add a new contact number for {currentApplicant.name}
                              </DialogDescription>
                              <PhoneNumberForm
                                isCoApplicant={selectedApplicant !== 'primary'}
                                coApplicantName={selectedApplicant !== 'primary' ? currentApplicant.name : undefined}
                                caseNo={loanDetails?.caseNo}
                              />
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>

                    {expandedSections.has('contact') && (
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {currentApplicant.contactNo?.length > 0 ? (
                            currentApplicant.contactNo.map((contact: string, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-lg border border-fg-border bg-color-surface hover:border-color-success/30 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-color-success/10 rounded-lg border border-color-success/20">
                                    <Phone className="h-4 w-4 text-color-success" />
                                  </div>
                                  <div>
                                    <span className="font-medium text-fg-primary">{contact}</span>
                                    <div className="flex items-center gap-1 mt-1">
                                      <Sparkles className="h-3 w-3 text-color-success" />
                                      <span className="text-xs text-color-success">Active</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <a
                                      href={`tel:${contact}`}
                                      className="text-color-primary hover:text-color-primary-light"
                                    >
                                      <Phone className="h-4 w-4" />
                                    </a>
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Edit3 className="h-4 w-4 text-color-secondary" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <Phone className="h-8 w-8 text-fg-tertiary mx-auto mb-2" />
                              <p className="text-fg-secondary">No contact numbers available</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>

                  {/* Location Information Section */}
                  <Card className="border border-fg-border/50 bg-color-surface-muted/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          onClick={() => toggleSection('location')}
                          className="flex items-center gap-2 p-0 h-auto hover:bg-transparent"
                        >
                          {expandedSections.has('location') ? (
                            <ChevronDown className="h-4 w-4 text-color-primary" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-color-primary" />
                          )}
                          {getSectionIcon('location')}
                          <span className="font-semibold text-fg-primary">Location Information</span>
                        </Button>

                        {hasPermission(PERMISSIONS.COLLECTION_UPDATE_LOCATION) && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-color-info hover:bg-color-info/10"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-3">
                                  <span className="p-2.5 bg-color-info/10 rounded-lg border border-color-info/20">
                                    <MapPin className="w-5 h-5 text-color-info" />
                                  </span>
                                  Update Location for {currentApplicant.name}
                                </DialogTitle>
                                <DialogDescription>Update the latitude and longitude coordinates.</DialogDescription>
                              </DialogHeader>
                              <UpdateLocationForm
                                caseNo={loanDetails.caseNo}
                                name={selectedApplicant !== 'primary' ? currentApplicant.name : undefined}
                                defaultValues={{
                                  latitude: currentApplicant.latitude,
                                  longitude: currentApplicant.longitude,
                                }}
                              />
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </CardHeader>

                    {expandedSections.has('location') && (
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {currentApplicant.latitude && currentApplicant.longitude ? (
                            <div className="flex items-center justify-between p-3 rounded-lg border border-fg-border bg-color-surface hover:border-color-info/30 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-color-info/10 rounded-lg border border-color-info/20">
                                  <Globe className="h-4 w-4 text-color-info" />
                                </div>
                                <div>
                                  <span className="font-medium text-fg-primary">
                                    {currentApplicant.latitude}, {currentApplicant.longitude}
                                  </span>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Sparkles className="h-3 w-3 text-color-info" />
                                    <span className="text-xs text-color-info">GPS Coordinates</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <Link
                                    target="_blank"
                                    to={generateGoogleMapsURL(currentApplicant.latitude, currentApplicant.longitude)}
                                    className="text-color-info hover:text-color-info-light"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <MapPin className="h-8 w-8 text-fg-tertiary mx-auto mb-2" />
                              <p className="text-fg-secondary">No location coordinates available</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
