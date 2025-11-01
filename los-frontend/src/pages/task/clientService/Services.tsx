import { DELETE_SERVICE, FETCH_SERVICES } from '@/redux/actions/types';
import { RootState } from '@/redux/slices';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Briefcase, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddServiceV2 from './AddServiceV2';
function Services() {
  const dispatch = useDispatch();
  const { data: servicesData } = useSelector((state: RootState) => state.service);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editService, setEditService] = useState<any>(null);

  useEffect(() => {
    dispatch({ type: FETCH_SERVICES });
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {servicesData && servicesData.length > 0 ? (
        servicesData.map((service) => (
          <Card
            key={service._id}
            className="bg-color-surface border-fg-border rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            <CardContent className="p-4 flex-grow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-color-primary to-color-info flex items-center justify-center text-white">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-fg-primary truncate">{service.serviceName || '-'}</p>
                    <p className="text-xs text-fg-secondary truncate">{service?.departments?.departmentName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditService(service);
                            setIsEditSheetOpen(true);
                          }}
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
                          onClick={() => dispatch({ type: DELETE_SERVICE, payload: { id: service._id } })}
                          className="h-7 w-7 text-color-error/80 hover:bg-color-error/10"
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
            <div className="flex items-center justify-end text-xs text-fg-tertiary p-4 pt-0">
              <span>Created: {new Date(service.createdAt).toLocaleDateString()}</span>
            </div>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center text-fg-secondary py-10">
          <p>No services found.</p>
        </div>
      )}
      <AddServiceV2
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        editService={editService}
        showTrigger={false}
      />
    </div>
  );
}
export default Services;
