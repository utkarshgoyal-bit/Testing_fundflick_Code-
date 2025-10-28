import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ROLES } from "@/lib/enums";
import PageHeader from "@/components/shared/pageHeader";
import { RootState } from "@/redux/store";
import {
  CREATE_NEW_QUESTION,
  EDIT_QUESTION,
  FETCH_QUESTION_BY_ID,
} from "@/redux/actions/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
const FormSchema = z.object({
  question: z.string({
    required_error: "Please write a question.",
  }),
  description: z
    .string({
      required_error: "Please write description of the question ",
    })
    .optional(),
});

export function QuestionForm() {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const isEditForm = queryParams.get("edit");
  const { SelectedQuestion } = useSelector(
    (state: RootState) => state.questionsSlice
  );
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  let questionId = queryParams.get("id");
  useEffect(() => {
    if (isEditForm) {
      dispatch({
        type: FETCH_QUESTION_BY_ID,
        payload: {
          id: questionId,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (isEditForm && SelectedQuestion) {
      form.reset(SelectedQuestion);
    }
  }, [SelectedQuestion, form]);
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (isEditForm) {
      return dispatch({
        type: EDIT_QUESTION,
        payload: { ...data, id: questionId },
        navigation,
      });
    }
    dispatch({
      type: CREATE_NEW_QUESTION,
      payload: { ...data },
      navigation,
    });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={isEditForm ? "Edit Question" : "Create New Question"}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <Input placeholder="Write a question" {...field} />

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <Textarea placeholder="Write a description" {...field} />
                  </FormControl>
                  <SelectContent>
                    {ROLES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
