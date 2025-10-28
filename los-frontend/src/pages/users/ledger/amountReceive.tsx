import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { RECEIVE_LEDGER_BALANCE } from "@/redux/actions/types";

const FormSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Amount is required" })
    .nonnegative({ message: "Amount must be a positive number" })
    .min(1, { message: "Amount must be at least 1" }),
});
export function AmountReceive({ userId }: { userId: string }) {
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: 0,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch({
      type: RECEIVE_LEDGER_BALANCE,
      payload: { ...data, _id: userId },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-between items-center mb-4"
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="w-[85%]">
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Received Amount"
                  type="number"
                  {...field}
                  onChange={(e) => {
                    e.target.value === ""
                      ? field.onChange(null)
                      : field.onChange(Number(e.target.value));
                  }}
                />
              </FormControl>
              <FormDescription>
                This is the amount received from the employee
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
