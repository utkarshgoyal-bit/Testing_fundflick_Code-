import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import PageHeader from '@/components/shared/pageHeader';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  EDIT_BRANCH_DATA,
  FETCH_BRANCHES_DATA,
  FETCH_BRANCHES_DATA_BY_ID,
  REGISTER_BRANCH_DATA,
} from '@/redux/actions/types';
import { RootState } from '@/redux/store';
import { branchFormSchema, BranchFormSchemaType } from './validations';

export function BranchForm() {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const isEditForm = queryParams.get('edit');
  const id = queryParams.get('id');

  const {
    selectedBranch,
    tableConfiguration: { data },
  } = useSelector((state: RootState) => state.branch);

  const form = useForm<BranchFormSchemaType>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: isEditForm
      ? { ...selectedBranch, isRoot: selectedBranch?.isRoot ? 'true' : 'false' }
      : {
          name: '',
          isRoot: 'true',
          parentBranch: '',
          landMark: '',
          country: '',
          state: '',
          city: '',
          postalCode: '',
        },
  });
  console.log(form.formState.errors);
  useEffect(() => {
    dispatch({ type: FETCH_BRANCHES_DATA });
    if (isEditForm && id) {
      dispatch({ type: FETCH_BRANCHES_DATA_BY_ID, payload: { id } });
    }
  }, [dispatch, id, isEditForm]);

  useEffect(() => {
    if (isEditForm && selectedBranch) {
      form.reset({
        ...selectedBranch,
        isRoot: selectedBranch.isRoot ? 'true' : 'false',
      });
    }
  }, [isEditForm, selectedBranch, form]);

  const onSubmit = (values: BranchFormSchemaType) => {
    if (values.isRoot === 'true') {
      delete values.parentBranch;
    }
    if (isEditForm) {
      dispatch({
        type: EDIT_BRANCH_DATA,
        payload: { ...values, id, isRoot: values.isRoot === 'true' },
        navigation,
      });
    } else {
      dispatch({
        type: REGISTER_BRANCH_DATA,
        payload: { ...values, isRoot: values.isRoot === 'true' },
        navigation,
      });
    }
  };
  return (
    <div className="space-y-4">
      <PageHeader title={isEditForm ? 'Edit Branch' : 'Register New Branch'} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Branch Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter branch name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isRoot"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Is this a root branch ?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value.toString()} className="flex ">
                    <FormItem className="flex items-end gap-2">
                      <FormControl>
                        <RadioGroupItem value={'true'} />
                      </FormControl>
                      <FormLabel className="font-normal m-0">Yes</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-end gap-2">
                      <FormControl>
                        <RadioGroupItem value={'false'} />
                      </FormControl>
                      <FormLabel className="font-normal m-0">No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Parent Branch */}
          {form.watch('isRoot') === 'false' && (
            <FormField
              control={form.control}
              name="parentBranch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Branch</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.map((item) => (
                          <SelectItem key={item._id} value={item._id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Complete Address */}
          <FormField
            control={form.control}
            name="landMark"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complete Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter complete address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Country */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Enter country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* State */}
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="Enter state" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* City */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Postal Code */}
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter postal code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">{isEditForm ? 'Update Branch' : 'Register Branch'}</Button>
        </form>
      </Form>
    </div>
  );
}
