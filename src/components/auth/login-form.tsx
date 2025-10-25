'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authMutations } from '@/features/auth/hooks.query';

const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { mutate: login, isError, error, isPending } = authMutations.login();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center mb-[50px]">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={'w-full max-w-md mx-auto space-y-4'}
        noValidate
      >
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Input
              label="Email"
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              error={errors.password?.message}
              {...register('password')}
            />
          </div>

          <Button
            variant={isPending ? 'disabled' : 'default'}
            type="submit"
            className="w-full"
            loading={isPending}
            loadingText="Logging in..."
          >
            Login
          </Button>
        </div>

        <div className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </>
  );
}
