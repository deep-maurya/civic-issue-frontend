import { ForgotPassword } from '@/components/auth/forget-password';
import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { notFound } from 'next/navigation';

type AuthStepPageProps = {
  params: Promise<{ step: string }>;
};

export default async function AuthStepPage({ params }: AuthStepPageProps) {
  const { step } = await params;

  if (step === 'login') return <LoginForm />;
  if (step === 'forgot-password') return <ForgotPassword />;
  // if (step === 'otp') return <OtpForm />;
  if (step === 'signup') return <RegisterForm />;

  return notFound();
}
