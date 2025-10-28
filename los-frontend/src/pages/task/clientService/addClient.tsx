import PageHeader from '@/components/shared/pageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ADD_CLIENT, EDIT_CLIENT, FETCH_CLIENT_BY_ID } from '@/redux/actions/types';
import { RootState } from '@/redux/slices';
import { AddClientFormValidation, addClientFormSchema } from '@/forms/validations';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MultiSelect } from '@/components/multi-select';

type FormValues = addClientFormSchema;

const BankDetails = ({ form }: any) => (
  <div className="border p-3 rounded-md">
    <h4 className="font-semibold mb-2">Bank Details</h4>
    <div className="grid md:grid-cols-2 gap-3">
      {[
        { name: 'bankName', label: 'Bank Name', placeholder: 'Enter Bank Name' },
        { name: 'accountNumber', label: 'Account Number', placeholder: 'Enter Account Number' },
        { name: 'ifsc', label: 'IFSC Code', placeholder: 'Enter IFSC Code' },
        { name: 'branch', label: 'Branch', placeholder: 'Enter Branch Name' },
      ].map((field) => (
        <FormField
          key={field.name}
          control={form.control}
          name={field.name}
          render={({ field: f }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <Input placeholder={field.placeholder} {...f} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  </div>
);

export default function AddClient() {
  const { selectedClient } = useSelector((state: RootState) => state.client);
  const { data: services } = useSelector((state: RootState) => state.service);
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(window.location.search);
  const clientId = searchParams.get('id');

  const navigation = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(AddClientFormValidation),
    defaultValues: selectedClient || {
      name: '',
      clientType: '',
      email: '',
      aadhaar: '',
      pan: '',
      gst: '',
      tan: '',
      cin: '',
      mobile: '',
      organizationName: '',
      organizationType: '',
      address: '',
      contactPerson: { name: '', mobile: '', email: '' },
      directors: [{ name: '', din: '', aadhaar: '' }],
      bankName: '',
      accountNumber: '',
      ifsc: '',
      branch: '',
      portalName: '',
      portalId: '',
      portalPassword: '',
      services: [],
    },
  });

  const selectedType = form.watch('clientType');
  const organizationType = form.watch('organizationType');
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'directors' });
  const onSubmit = (values: FormValues) => {
    if (clientId) {
      return dispatch({ type: EDIT_CLIENT, payload: { ...values, id: clientId }, navigation });
    }
    dispatch({ type: ADD_CLIENT, payload: values, navigation });
  };

  useEffect(() => {
    if (clientId) {
      dispatch({ type: FETCH_CLIENT_BY_ID, payload: { id: clientId } });
    }
  }, [clientId]);
  useEffect(() => {
    if (selectedClient) form.reset(selectedClient);
  }, [selectedClient]);
  return (
    <div className="space-y-6">
      <PageHeader title={clientId ? 'editClient' : 'createClient'} subtitle="Fill out client details below" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:p-6 max-md:px-3">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Client Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Conditional Sections */}
          {selectedType && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedType === 'individual' ? 'Individual Details' : 'Business Details'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Org Info */}
                <div className="border p-3 rounded-md space-y-3">
                  <h3 className="font-semibold text-lg">Primary Information</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name={selectedType === 'individual' ? 'name' : 'organizationName'}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{selectedType === 'individual' ? 'Name' : 'Organization Name'}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={selectedType === 'individual' ? 'Enter Name' : 'Enter Organization Name'}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {clientId && (
                      <FormField
                        control={form.control}
                        name="services"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Services</FormLabel>
                            <FormControl>
                              <MultiSelect
                                options={services?.map((item: any) => ({
                                  label: item.serviceName,
                                  value: item._id,
                                }))}
                                value={field.value || []}
                                onValueChange={field.onChange}
                                placeholder="Select users"
                                className="bg-white rounded-md"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Org Type changes slightly for business */}
                    {selectedType === 'business' && (
                      <FormField
                        control={form.control}
                        name="organizationType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value || ''}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select organization type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="limited">Limited</SelectItem>
                                  <SelectItem value="private-limited">Private Limited</SelectItem>
                                  <SelectItem value="proprietorship">Proprietorship</SelectItem>
                                  <SelectItem value="partnership">Partnership</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {/* Dynamic fields */}
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedType === 'business' && ['limited', 'private-limited'].includes(organizationType || '') && (
                      <FormField
                        control={form.control}
                        name="cin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CIN</FormLabel>
                            <FormControl>
                              <Input placeholder="L99999DL2000PLC123456" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {[
                      { name: 'pan', label: 'PAN', placeholder: 'AAAAA9999A', maxLength: 10 },
                      { name: 'gst', label: 'GST', placeholder: '22AAAAA9999A1Z5', maxLength: 15 },
                      { name: 'tan', label: 'TAN', placeholder: 'AAAA99999A', maxLength: 10 },
                    ].map((f) => (
                      <FormField
                        key={f.name}
                        control={form.control}
                        name={f.name as 'pan' | 'gst' | 'tan'}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{f.label}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={f.placeholder || `Enter ${f.label}`}
                                {...field}
                                onChange={(e) => {
                                  const upperValue = e.target.value.toUpperCase();
                                  if (upperValue.length <= f.maxLength!) {
                                    field.onChange(upperValue);
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  {/* Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Contact */}
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { name: 'mobile', label: 'Mobile Number', placeholder: 'Enter 10 Digit Number' },
                      { name: 'email', label: 'Email', placeholder: 'Enter Email Address' },
                    ].map((f) => (
                      <FormField
                        key={f.name}
                        control={form.control}
                        name={f.name as 'mobile' | 'email'}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{f.label}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={f.placeholder}
                                {...field}
                                type={f.name === 'mobile' ? 'tel' : 'text'}
                                maxLength={f.name === 'mobile' ? 10 : undefined}
                                onInput={(e) => {
                                  if (f.name === 'mobile') {
                                    const value = e.currentTarget.value.replace(/\D/g, '');
                                    e.currentTarget.value = value.slice(0, 10);
                                  }
                                  field.onChange(e);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  {selectedType === 'business' && (
                    <div className="border p-3 rounded-md space-y-3">
                      <h4 className="font-semibold">Contact Person Details</h4>
                      <div className="grid md:grid-cols-3 gap-3">
                        {['name', 'mobile', 'email'].map((field) => (
                          <FormField
                            key={field}
                            control={form.control}
                            name={
                              ('contactPerson.' + field) as
                                | 'contactPerson.name'
                                | 'contactPerson.mobile'
                                | 'contactPerson.email'
                            }
                            render={({ field: f }) => (
                              <FormItem>
                                <FormLabel>{field.charAt(0).toUpperCase() + field.slice(1)}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={`Enter ${field}`}
                                    {...f}
                                    type={field === 'mobile' ? 'tel' : 'text'}
                                    maxLength={field === 'mobile' ? 10 : undefined}
                                    onInput={(e) => {
                                      if (field === 'mobile') {
                                        const value = e.currentTarget.value.replace(/\D/g, '');
                                        e.currentTarget.value = value.slice(0, 10);
                                      }
                                      f.onChange(e);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                <div className="border p-3 rounded-md space-y-4">
                  <h3 className="font-semibold text-lg">Additional Information</h3>

                  {/* Directors only for business */}
                  {selectedType === 'business' && (
                    <div className="space-y-3 py-3">
                      <h4 className="font-semibold">
                        {(organizationType || '') === 'partnership'
                          ? 'Partners'
                          : (organizationType || '') === 'proprietorship'
                            ? 'Proprietor'
                            : 'Directors'}
                      </h4>
                      {fields.map((director, index) => (
                        <div key={director.id} className="grid md:grid-cols-2 gap-3 border p-3 rounded-md relative">
                          {['name', 'aadhaar'].map((f) => (
                            <FormField
                              key={f}
                              control={form.control}
                              name={`directors.${index}.${f}` as 'directors.0.name' | 'directors.0.aadhaar'}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{f.charAt(0).toUpperCase() + f.slice(1)}</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={`Enter ${f}`}
                                      {...field}
                                      maxLength={f === 'aadhaar' ? 12 : undefined}
                                      onInput={(e) => {
                                        if (f === 'aadhaar') {
                                          const value = e.currentTarget.value.replace(/\D/g, '');
                                          e.currentTarget.value = value.slice(0, 12);
                                        }
                                        field.onChange(e);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          ))}

                          {['limited', 'private-limited'].includes(organizationType || '') && (
                            <FormField
                              control={form.control}
                              name={`directors.${index}.din`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>DIN</FormLabel>
                                  <FormControl>
                                    <Input placeholder={`01234567`} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          <Button
                            type="button"
                            variant="link"
                            className="absolute top-1 right-2 text-destructive"
                            onClick={() => remove(index)}
                          >
                            <X />
                          </Button>
                        </div>
                      ))}
                      {organizationType !== 'proprietorship' && (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-dashed"
                          onClick={() => append({ name: '', din: '', aadhaar: '' })}
                        >
                          + Add {organizationType === 'partnership' ? 'Partner' : 'Director'}
                        </Button>
                      )}
                    </div>
                  )}

                  <BankDetails form={form} />
                  {/* <FileUpload form={form} /> */}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigation(-1)}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
