import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RootState } from '@/redux/store';
import { ADD_CUSTOMER_LIABILITY_DATA, GET_CUSTOMER_LIABILITY_DATA } from '@/redux/actions/types';
import { setLiabilityDialogAdd } from '@/redux/slices/files/liability';
import { zodResolver } from '@hookform/resolvers/zod';
// import { constants } from "buffer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { STEPS_NAMES } from '@/lib/enums';
import { ChevronRight, ChevronsUpDown, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import VerifyStepData from '@/pages/files/steps/verifyStepData';
import LiabilityForm from './form';
import LiabilityTable from './table';
import { useEffect } from 'react';
import urlQueryParams from '@/helpers/urlQueryParams';

const FormSchema = z.object({
  familyExpenses: z.object({
    familyExpenses: z.coerce.number().min(0, { message: 'Family Expenses is required' }),
    futureOutlays: z.coerce.number().optional(),
  }),
});

export default function Liability() {
  const dispatch = useDispatch();
  const isBackOffice = urlQueryParams('component') == 'back_office';
  const { liability, loading, liabilityDialogAdd } = useSelector((state: RootState) => state.fileLiability);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: liability,
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch({
      type: ADD_CUSTOMER_LIABILITY_DATA,
      payload: data,
    });
  }
  useEffect(() => {
    dispatch({ type: GET_CUSTOMER_LIABILITY_DATA });
  }, []);

  useEffect(() => {
    form.reset(liability);
  }, [liability]);
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full md:grid md:grid-cols-2 relative max-md:space-y-3 gap-3 md:p-5 max-md:px-3"
        >
          <Collapsible className="col-span-2 " defaultOpen>
            <CollapsibleTrigger className="w-full flex justify-between p-2">
              <h2 className="col-span-2 font-bold md:text-xl text-sm w-full text-left">Liability</h2>
              <Button type="button" variant={'ghost'}>
                {' '}
                <ChevronsUpDown />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="w-full md:grid md:grid-cols-2 relative max-md:space-y-3 gap-3 md:p-5 max-md:px-3">
              <FormField
                control={form.control}
                name="familyExpenses.familyExpenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {'Monthly Family Expenses'} <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isBackOffice}
                        type="number"
                        placeholder="Monthly Family Expenses"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value.length ? Number(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="familyExpenses.futureOutlays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{'Future Outlays (if any)'}</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isBackOffice}
                        type="number"
                        placeholder="Medical Exp/ Maretial Exp/ Construction Exp/ Other Exp "
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value.length ? Number(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CollapsibleContent>
          </Collapsible>
          <div className="col-span-2 flex px-3  justify-between">
            <h1 className="text-xl  font-bold my-2">Existing Loan</h1>
            <Button
              type="button"
              onClick={() => {
                dispatch(setLiabilityDialogAdd(true));
              }}
            >
              <Plus /> Add Existing Loan
            </Button>
          </div>
          <div className="col-span-2">
            <LiabilityTable />
          </div>
          <div className="flex col-span-2  w-full justify-end items-center gap-5  ">
            <VerifyStepData stepName={STEPS_NAMES.LIABILITY} stepsData={liability} />
            <div className="flex justify-end col-span-2 gap-4 my-3">
              <Button type="submit" disabled={loading}>
                {'Save and next'} <ChevronRight />{' '}
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <Dialog
        open={liabilityDialogAdd}
        onOpenChange={(open) => {
          dispatch(setLiabilityDialogAdd(open));
        }}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Add New Liability</DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <div>
            <LiabilityForm />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
