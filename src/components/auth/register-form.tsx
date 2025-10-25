'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authMutations } from '@/features/auth/hooks.query';
import Link from 'next/link';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupValues = z.infer<typeof signupSchema>;

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate: registerUser, isPending } = authMutations.register();

  const onSubmit = async (data: SignupValues) => {
    registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto space-y-4"
      noValidate
    >
      <div className="flex flex-col items-center gap-2 text-center font-primary ">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your <br /> account
        </p>
      </div>
      <Input
        label="Full Name"
        id="name"
        type="text"
        placeholder="John Doe"
        {...register('name')}
        error={errors.name?.message}
      />
      <Input
        label="Email"
        id="email"
        type="email"
        placeholder="you@example.com"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        id="password"
        type="password"
        placeholder="Enter password"
        {...register('password')}
        error={errors.password?.message}
      />
      <Input
        label="Confirm Password"
        id="confirmPassword"
        type="password"
        placeholder="Enter confirm password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || isPending}
      >
        {isSubmitting || isPending ? 'Registering...' : 'Sign Up'}
      </Button>
      <div className="text-center text-sm">
        have an account?{' '}
        <Link href="/auth/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
}
