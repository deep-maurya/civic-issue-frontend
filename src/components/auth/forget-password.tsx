import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export function ForgotPassword({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  return (
    <form className={cn('flex flex-col gap-6', className)} {...props}>
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Forgot your password?</h1>
        <p className="text-muted-foreground text-sm max-w-xs">
          Enter your email address and we’ll send you instructions to reset your
          password.
        </p>
      </div>

      {/* Email input */}
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        {/* Submit button */}
        <Button type="submit" className="w-full">
          Send reset link
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Remember your password?</span>{' '}
        <Link href="/auth/login" className="underline underline-offset-4">
          Back to login
        </Link>
      </div>
    </form>
  );
}
