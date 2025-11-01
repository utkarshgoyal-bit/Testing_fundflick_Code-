import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import { Plus } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ADD_SERVICE, EDIT_SERVICE, FETCH_SERVICE_BY_ID } from '@/redux/actions/types';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import AddDepartment from './addDepartment';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { RootState } from '@/redux/slices';
import { AddServiceV2Props, IServiceFormValues } from '@/lib/interfaces/service.interface';

const AddServiceV2 = ({ open, onOpenChange, editService, showTrigger = true }: AddServiceV2Props) => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(window.location.search);
  const serviceId = searchParams.get('id') || '';
  const { selectedService } = useSelector((state: RootState) => state.service);
  const form = useForm<IServiceFormValues>({
    defaultValues: editService ||
      selectedService || {
        serviceName: '',
        departmentId: '',
        description: '',
        startDate: '',
      },
  });

  const onSubmit = (values: IServiceFormValues) => {
    if (editService || serviceId) {
      return dispatch({ type: EDIT_SERVICE, payload: { ...values, id: editService?._id || serviceId }, navigation });
    }
    dispatch({ type: ADD_SERVICE, payload: values, navigation });
  };

  useEffect(() => {
    if (serviceId && !editService) {
      dispatch({ type: FETCH_SERVICE_BY_ID, payload: { id: serviceId } });
    }
  }, [serviceId, editService]);
  useEffect(() => {
    const serviceData = editService || selectedService;
    if (serviceData) {
      form.reset({
        ...serviceData,
        departmentId: serviceData.departmentId?._id || serviceData.departmentId,
      });
    }
  }, [editService, selectedService]);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {showTrigger && !editService && (
        <SheetTrigger>
          <Button variant="outline" className="bg-color-primary text-fg-on-accent">
            <Plus className="h-4 w-4" />
            <I8nTextWrapper text="createNewService" />
          </Button>
        </SheetTrigger>
      )}
      <SheetContent className="w-[1000px] sm:w-[540px] overflow-y-auto max-h-[100vh]">
        <SheetHeader>
          <SheetTitle>{editService ? 'Edit Service' : 'Add Service'}</SheetTitle>
          <SheetDescription>
            {editService ? 'Edit the service details.' : 'Add a new service to the system.'}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="serviceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter service name" {...field} required />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Department Name</FormLabel>
                  <FormControl>
                    <AddDepartment onChange={field.onChange} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter>
              <Button type="submit">Save changes</Button>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default AddServiceV2;
