import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import I8nTextWrapper from '@/translations/i8nTextWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { LoginFormValidation, loginFormSchema } from '@/forms/validations';
import { cn } from '@/lib/utils';

export function LoginForm({
  onSubmit,
  loading,
  className,
  error,
}: {
  onSubmit: (data: loginFormSchema) => void;
  loading: boolean;
  className?: string;
  error: any;
}) {
  const form = useForm<loginFormSchema>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('flex flex-col gap-3 ', className)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <I8nTextWrapper text="email" />
              </FormLabel>
              <FormControl>
                <Input placeholder="enter your email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <I8nTextWrapper text="password" />
              </FormLabel>
              <FormControl>
                <Input placeholder="enter your password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button name="login" type="submit" className="flex justify-center  w-full" disabled={loading}>
          {loading && !error ? <Loader className="animate-spin" /> : <I8nTextWrapper text="login" />}
        </Button>
      </form>
    </Form>
  );
}
