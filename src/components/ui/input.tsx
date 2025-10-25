'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Eye, EyeOff } from 'lucide-react';

const inputVariants = cva(
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-[2px]',
  {
    variants: {
      state: {
        default:
          'border-input focus-visible:border-ring focus-visible:ring-ring/50',
        error:
          'border-destructive/50 text-destructive focus-visible:ring-destructive/30',
        disabled:
          'bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-70',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
}

function Input({
  className,
  type,
  state,
  error,
  label,
  id,
  disabled,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const inputId = id || React.useId();

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type={inputType}
          data-slot="input"
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            inputVariants({ state: error ? 'error' : state }),
            isPassword && 'pr-10', // padding for icon
            className
          )}
          disabled={disabled}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute inset-y-0 right-3 inline-flex items-center hover:text-foreground text-muted-foreground"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export { Input };
