import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, id, className = '', ...rest }, ref) => {
        const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className={`flex flex-col gap-1.5 ${className}`}>
                <label
                    htmlFor={inputId}
                    className="text-sm font-medium text-surface-700"
                >
                    {label}
                </label>
                <input
                    ref={ref}
                    id={inputId}
                    className={`
            w-full rounded-lg border px-4 py-2.5 text-sm text-surface-800
            placeholder:text-surface-400 transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1
            ${error
                            ? 'border-red-400 focus:ring-red-400 bg-red-50'
                            : 'border-surface-300 focus:ring-primary-500 bg-white'
                        }
          `}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    {...rest}
                />
                {error && (
                    <p id={`${inputId}-error`} className="text-xs text-red-600" role="alert">
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p className="text-xs text-surface-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
