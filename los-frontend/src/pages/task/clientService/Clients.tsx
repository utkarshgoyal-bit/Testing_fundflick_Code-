import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { IClientTable } from '@/lib/interfaces';
import { cn } from '@/lib/utils';
import { DELETE_CLIENT, FETCH_CLIENTS } from '@/redux/actions/types';
import { RootState } from '@/redux/slices';
import { Eye, Mail, Pencil, Phone, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import ClientDetailsDialog from './CreateDetailsDialog';

function Clients() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: clientsData } = useSelector((state: RootState) => state.client);
  const [selectedClient, setSelectedClient] = useState<IClientTable | null>(null);

  const getClientInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return `${names[0].substring(0, 2)}`.toUpperCase();
  };

  useEffect(() => {
    dispatch({ type: FETCH_CLIENTS });
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clientsData && clientsData.length > 0 ? (
        clientsData.map((client) => (
          <Card
            key={client._id}
            className="bg-color-surface border-fg-border rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-color-accent to-color-secondary flex items-center justify-center text-white font-semibold">
                    {getClientInitials(client.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-fg-primary truncate">{client.name || '-'}</p>
                    <p className="text-xs text-fg-secondary truncate">{client.clientType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setSelectedClient(client)}
                          className="h-7 w-7 text-color-info/80 hover:bg-color-info/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => navigate(buildOrgRoute('/service-client/addClient?id=' + client._id))}
                          className="h-7 w-7 text-color-secondary/80 hover:bg-color-secondary/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => dispatch({ type: DELETE_CLIENT, payload: { id: client._id } })}
                          className="h-7 w-7 text-color-error/80 hover:bg-color-error/10"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="space-y-1.5 text-xs mb-4">
                <div className="flex items-center gap-2 text-fg-secondary">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{client.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-fg-secondary">
                  <Phone className="h-3.5 w-3.5" />
                  <span className="truncate">{client.mobile || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-fg-secondary">
                  <span className="truncate">No of Services : {client.services.length}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-fg-tertiary">
                  Created: {new Date(client.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Link
                    to={buildOrgRoute(`/task-management/client-ledger/${client._id}`)}
                    className={cn(
                      buttonVariants({ variant: 'default', size: 'sm' }),
                      'bg-color-primary text-white hover:bg-color-primary/90'
                    )}
                  >
                    View Ledger
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center text-fg-secondary py-10">
          <p>No clients found.</p>
        </div>
      )}

      <ClientDetailsDialog client={selectedClient} onOpenChange={() => setSelectedClient(null)} />
    </div>
  );
}
export default Clients;
