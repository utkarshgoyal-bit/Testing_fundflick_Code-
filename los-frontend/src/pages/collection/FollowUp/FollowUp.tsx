import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, MapPin, Phone, MessageSquare, Smile, Upload, LocateIcon, ArrowRight, ChevronDownIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import { useForm } from 'react-hook-form';
import { FormFollowupInputs, formSchemaFollowUp } from '../main/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import moment from 'moment';
import React from 'react';

const FollowUp = ({ onSubmit, loading }: { onSubmit: (data: FormFollowupInputs) => void; loading: boolean }) => {
  const form = useForm<FormFollowupInputs>({
    resolver: zodResolver(formSchemaFollowUp),
    defaultValues: {
      noReply: false,
    },
  });

  const noReplyChecked = form.watch('noReply') || false;
  const visitType = form.watch('visitType');

  const getLatLong = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue('latitude', position.coords.latitude.toString());
          form.setValue('longitude', position.coords.longitude.toString());
          toast.success('Location captured successfully');
        },
        () => {
          toast.error('Unable to get your location');
        }
      );
    }
  };

  const handleSubmit = (data: FormFollowupInputs) => {
    onSubmit(data);
  };

 const renderDateField = (
  name: keyof FormFollowupInputs,
  label: string,
  minDate?: string,
  maxDate?: string
) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => {
      const [open, setOpen] = React.useState(false)
      const selectedDate = field.value ? new Date(field.value) : undefined

      return (
        <FormItem className="flex flex-col">
          <FormLabel className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            {label}
          </FormLabel>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-between font-normal',
                    !field.value && 'text-muted-foreground'
                  )}
                  disabled={name === 'commit' && noReplyChecked}
                >
                  {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                  <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>

            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={selectedDate}
                onSelect={(date) => {
                  field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                  setOpen(false)
                }}
                disabled={(date) => {
                  if (minDate && date <= new Date(minDate)) return true
                  if (maxDate && date >= new Date(maxDate)) return true
                  return false
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )
    }}
  />
)

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Visit Type Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Visit Type</h3>
                </div>
                <FormField
                  control={form.control}
                  name="visitType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                            <RadioGroupItem value="telecall" id="telecall" />
                            <label htmlFor="telecall" className="flex items-center gap-2 cursor-pointer flex-1">
                              <Phone className="w-4 h-4" />
                              <span>Tel Calling</span>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                            <RadioGroupItem value="visit" id="visit" />
                            <label htmlFor="visit" className="flex items-center gap-2 cursor-pointer flex-1">
                              <MapPin className="w-4 h-4" />
                              <span>In-Person Visit</span>
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location Section - Only show when visit is selected */}
              {visitType === 'visit' && (
                <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Location Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input {...field} disabled placeholder="Auto-detected" value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input {...field} disabled placeholder="Auto-detected" value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-100 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700">
                      <LocateIcon className="w-4 h-4" />
                      <span className="text-sm">Get your current location</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <Button
                      type="button"
                      onClick={getLatLong}
                      size="sm"
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-200"
                    >
                      <LocateIcon className="w-4 h-4 mr-2" />
                      Capture
                    </Button>
                  </div>
                </div>
              )}

              <Separator />

              {/* No Reply Checkbox */}
              <FormField
                control={form.control}
                name="noReply"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-yellow-50">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-base font-medium text-yellow-800">No Reply Received</FormLabel>
                      <p className="text-sm text-yellow-600">
                        Check this if the customer did not respond to your contact attempt
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <Separator />

              {/* Date Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Date Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderDateField(
                    'date',
                    'Visit Date',
                    moment().subtract(2, 'days').format('YYYY-MM-DD'),
                    moment().format('YYYY-MM-DD')
                  )}
                  {renderDateField('commit', 'P2P Date', moment().subtract(1, 'days').format('YYYY-MM-DD'))}
                </div>
              </div>

              <Separator />

              {/* Remarks Section */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-lg font-semibold">
                        <MessageSquare className="w-5 h-5" />
                        Remarks
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your detailed remarks about the interaction..."
                          className="min-h-[100px] resize-none"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Attitude Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Smile className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Customer Attitude</h3>
                </div>
                <FormField
                  control={form.control}
                  name="attitude"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value || undefined}
                          disabled={noReplyChecked}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-green-50 disabled:opacity-50">
                            <RadioGroupItem value="polite" id="polite" disabled={noReplyChecked} />
                            <label htmlFor="polite" className="flex items-center gap-2 cursor-pointer flex-1">
                              <span className="text-lg">😊</span>
                              <span>Polite</span>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-yellow-50 disabled:opacity-50">
                            <RadioGroupItem value="medium" id="medium" disabled={noReplyChecked} />
                            <label htmlFor="medium" className="flex items-center gap-2 cursor-pointer flex-1">
                              <span className="text-lg">😐</span>
                              <span>Neutral</span>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-red-50 disabled:opacity-50">
                            <RadioGroupItem value="rude" id="rude" disabled={noReplyChecked} />
                            <label htmlFor="rude" className="flex items-center gap-2 cursor-pointer flex-1">
                              <span className="text-lg">😠</span>
                              <span>Rude</span>
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Selfie Upload Section */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="selfie"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-lg font-semibold">
                        <Upload className="w-5 h-8" />
                        Upload Selfie
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={(e) => field.onChange(e.target.files)}
                            className="file:bg-primary file:text-white file:border-0  file:rounded-lg file:cursor-pointer  file:text-sm file:font-semibold file:py-1 file:px-2 "
                          />
                        </div>
                      </FormControl>
                      <p className="text-sm text-muted-foreground">Capture or upload a selfie for verification</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="min-w-[160px]">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <I8nTextWrapper text="submit" />
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FollowUp;
