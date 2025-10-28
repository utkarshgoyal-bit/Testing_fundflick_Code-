import PageHeader from '@/components/shared/pageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { buildOrgRoute } from '@/helpers/routeHelper';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import AddServiceV2 from './AddServiceV2';
import Services from './Services';
import Clients from './Clients';

function Index() {
  return (
    <div className="bg-color-background min-h-screen">
      <PageHeader
        title="clientAndService"
        subtitle="Manage your services and clients from here"
        actions={
          <div className="flex gap-3">
            <AddServiceV2 />
            <Link to={buildOrgRoute('/service-client/addClient')}>
              <Button variant="outline" className="bg-color-primary text-fg-on-accent">
                <Plus className="h-4 w-4" />
                <I8nTextWrapper text="createNewClient" />
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mt-6">
        <Tabs defaultValue="client" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-color-surface-muted rounded-lg p-1">
            <TabsTrigger
              value="client"
              className="data-[state=active]:bg-color-surface data-[state=active]:shadow-sm rounded-md"
            >
              Clients
            </TabsTrigger>
            <TabsTrigger
              value="service"
              className="data-[state=active]:bg-color-surface data-[state=active]:shadow-sm rounded-md"
            >
              Services
            </TabsTrigger>
          </TabsList>
          <TabsContent value="client" className="mt-4">
            <Clients />
          </TabsContent>
          <TabsContent value="service" className="mt-4">
            <Services />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Index;
