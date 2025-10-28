import { Button } from '@/components/ui/button';
import CollapsibleGroupHandler from '@/components/ui/collapsible-group-handler';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import FilePreview from '@/helpers/imgPdfView';
import handleLoadLocalFile from '@/helpers/loadCompressFile';
import { RootState } from '@/redux/store';
import { UPDATE_CIBIL_SCORE } from '@/redux/actions/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { calculateCibilProgress } from '@/utils/progress';
import ProgressBar from './progressbar';

// Form validation schema
const FormSchema = z.object({
  cibilDetails: z.object({
    Score: z.number(),
    file: z.any(),
  }),
});

function CibilScoreForms({ customerId }: { customerId: string }) {
  const { selectedFile } = useSelector((state: RootState) => state.customerFiles);

  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      cibilDetails: {
        Score: 0,
      },
    },
  });

  // Handle form submission
  function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch({
      type: UPDATE_CIBIL_SCORE,
      payload: {
        cibilDetails: {
          ...data.cibilDetails,
          customerDetails: customerId,
        },
      },
    });
  }
  useEffect(() => {
    const cibil = selectedFile.cibilDetails?.find((item: any) => item.customerDetails === customerId);
    if (selectedFile.cibilDetails) {
      form.reset({ cibilDetails: cibil });
    }
  }, [selectedFile]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex max-md:flex-col gap-3">
        {selectedFile?.cibilDetails && (
          <FilePreview
            url={selectedFile.cibilDetails.find((item: any) => item.customerDetails === customerId)?.file || ''}
          />
        )}

        <div className="flex flex-col gap-3">
          <FormField
            control={form.control}
            name="cibilDetails.file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cibil File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*, .pdf"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        const processedFile = await handleLoadLocalFile(event);
                        field.onChange(processedFile); // Update the form field
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cibilDetails.Score"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cibil Score</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter your Cibil Score"
                    {...field}
                    onChange={(e) => {
                      e.target.value === '' ? field.onChange(null) : field.onChange(Number(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}

export default function CibilScore() {
  const { selectedFile } = useSelector((state: RootState) => state.customerFiles);
  const [allFamilyMembers, setAllFamilyMembers] = useState<any[]>([]);

  // Update family members when selectedFile changes
  useEffect(() => {
    if (selectedFile) {
      setAllFamilyMembers([
        { ...selectedFile.customerDetails, customerType: 'self' },
        ...(selectedFile.customerOtherFamilyDetails || []),
      ]);
    }
  }, [selectedFile]);
      const overallPercent = calculateCibilProgress(selectedFile, selectedFile.customerDetails?._id);


  return (
    <div className="space-y-2 h-full w-full relative">
       <ProgressBar label="CIBIL Progress" percentage={overallPercent} />
      {allFamilyMembers.map(
        (item, index) =>
          item.customerType !== 'reference' && (
            <CollapsibleGroupHandler
              title={`${item.firstName ?? item.customerDetails?.firstName ?? ''} ${
                item.middleName ?? item.customerDetails?.middleName ?? ''
              } ${item.lastName ?? item.customerDetails?.lastName ?? ''} (${item.customerType})`}
              key={`${index}`}
            >
              <table className="table-auto w-full border-collapse border border-gray-300 my-3">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Document Name</th>
                    <th className="border border-gray-300 px-4 py-2">Copy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="border border-gray-300 px-4 py-2">Aadhar Number</td>
                    <td
                      className="border border-gray-300 px-4 py-2 text-blue-300 underline cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(item.aadhaarNumber || item.customerDetails?.aadhaarNumber);
                        toast.success('Aadhaar Number copied to clipboard');
                      }}
                    >
                      {item.aadhaarNumber || item.customerDetails?.aadhaarNumber}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="border border-gray-300 px-4 py-2">Pan Number</td>
                    <td
                      className="border border-gray-300 px-4 py-2 text-blue-300 underline cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(item.personalPan || item.customerDetails?.personalPan);
                        toast.success('Pan Number copied to clipboard');
                      }}
                    >
                      {item.personalPan || item.customerDetails?.personalPan}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="border border-gray-300 px-4 py-2">DOB</td>
                    <td
                      className="border border-gray-300 px-4 py-2 text-blue-300 underline cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(item.dob || item.customerDetails?.dob);
                        toast.success('DOB copied to clipboard');
                      }}
                    >
                      {item.dob || item.customerDetails?.dob}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="border border-gray-300 px-4 py-2">Other Id</td>
                    <td
                      className="border border-gray-300 px-4 py-2 text-blue-300 underline cursor-pointer"
                      onClick={() => {
                        if (!item.otherId && !item.customerDetails?.otherId) return;
                        navigator.clipboard.writeText(item.otherId || item.customerDetails?.otherId);
                        toast.success('Other ID copied to clipboard');
                      }}
                    >
                      {item.otherId || item.customerDetails?.otherId}
                    </td>
                  </tr>
                </tbody>
              </table>
              <CibilScoreForms customerId={item?._id || item.customerDetails?._id} />
            </CollapsibleGroupHandler>
          )
      )}
    </div>
  );
}
