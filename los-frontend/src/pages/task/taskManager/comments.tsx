import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronUp, Loader, Send, MessageCircle, Clock, User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ITaskTable } from '@/lib/interfaces/tables';
import { RootState } from '@/redux/store';
import { ADD_COMMENT } from '@/redux/actions/types';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Badge } from '@/components/ui/badge';

export default function Comments({ task }: { task: ITaskTable }) {
  const [open, setOpen] = useState(false);
  const commentCount = task.comments?.length || 0;

  return (
    <div className="w-full">
      {/* Toggle Button */}
      <div
        className="flex relative items-center gap-2 hover:cursor-pointer transition-all duration-200 hover:bg-color-surface-muted/50 p-2 rounded-lg group"
        onClick={() => setOpen(!open)}
        data-task-id={task._id}
      >
        <MessageCircle className="w-4 h-4 text-fg-tertiary group-hover:text-color-primary transition-colors" />
        <span className="text-sm relative font-medium text-fg-secondary group-hover:text-color-primary transition-colors">
          {open ? 'Hide comments' : 'View comments'}
          <Badge
            variant={'outline'}
            className="rounded-full  p-0 h-5 w-5 absolute -top-2 -right-6 flex justify-center items-center"
          >
            {commentCount > 9 ? '9+' : commentCount}
          </Badge>
        </span>

        <Button variant={'ghost'} className="p-1 h-auto hover:bg-transparent ml-auto">
          {open ? (
            <ChevronUp size={16} className="text-fg-tertiary" />
          ) : (
            <ChevronDown size={16} className="text-fg-tertiary" />
          )}
        </Button>
      </div>

      {/* Comments Section */}
      <div className="w-full" key={`comments-section-${task._id}`}>
        {open && (
          <div className="w-full mt-3 bg-color-surface-muted/30 border border-fg-border/50 rounded-lg overflow-hidden">
            {/* Comment Form */}
            <div className="p-4 border-b border-fg-border/50">
              <CommentForm task={task} />
            </div>

            {/* Comments List */}
            <div className="max-h-[40vh] overflow-y-auto">
              {task.comments?.length > 0 ? (
                <div className="space-y-0">
                  {task.comments.map((item, index) => (
                    <div
                      key={`${task._id}-comment-${index}`}
                      className="p-4 border-b border-fg-border/30 last:border-b-0 hover:bg-color-surface/50 transition-colors"
                    >
                      {/* Comment Header */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-full bg-color-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-color-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-fg-primary text-sm">
                              {[item.createdBy?.firstName, item.createdBy?.middleName, item.createdBy?.lastName]
                                .filter(Boolean)
                                .join(' ')}
                            </span>
                            <span className="text-xs text-fg-tertiary">•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-fg-tertiary" />
                              <span className="text-xs text-fg-tertiary">{moment(item.createdAt).fromNow()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Comment Content */}
                      <div className="ml-11">
                        <p className="text-sm leading-relaxed text-fg-secondary">{item.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 mx-auto text-fg-tertiary mb-3" />
                  <p className="text-sm text-fg-tertiary">No comments yet</p>
                  <p className="text-xs text-fg-tertiary mt-1">Be the first to add a comment</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const FormSchema = z
  .object({
    comment: z.string().min(2, {
      message: 'write replay',
    }),
  })
  .refine((data) => data.comment.trim().length > 0, {
    message: 'Empty space is not allowed',
    path: ['comment'],
  });

export function CommentForm({ task }: { task: ITaskTable }) {
  const dispatch = useDispatch();
  const { commentLoading } = useSelector((state: RootState) => state.tasks);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      comment: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    dispatch({
      type: ADD_COMMENT,
      payload: { comment: data.comment, _id: task._id },
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormControl>
                <div className="flex gap-2">
                  <Input
                    className="flex-1 h-10 bg-color-surface border-fg-border focus:border-color-primary/50 focus:ring-color-primary/20 placeholder:text-fg-tertiary"
                    placeholder="Add a comment..."
                    {...field}
                  />
                  <Button
                    type="submit"
                    disabled={commentLoading || !field.value.trim()}
                    className="h-10 px-4 bg-color-primary hover:bg-color-primary-light text-fg-on-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {commentLoading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage className="text-color-error text-xs" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
