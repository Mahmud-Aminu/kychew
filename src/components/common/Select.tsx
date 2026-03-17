import { type SelectHTMLAttributes } from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: SelectOption[];
    error?: string;
    placeholder?: string;
}

export default function Select({
    label,
    options,
    error,
    placeholder = 'Select an option',
    id,
    className = '',
    ...rest
}: SelectProps) {
    const selectId = id ?? label.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            <label
                htmlFor={selectId}
                className="text-sm font-medium text-surface-700"
            >
                {label}
            </label>
            <select
                id={selectId}
                className={`
          w-full rounded-lg border px-4 py-2.5 text-sm text-surface-800
          transition-colors duration-200 bg-white appearance-none
          focus:outline-none focus:ring-2 focus:ring-offset-1
          ${error
                        ? 'border-red-400 focus:ring-red-400 bg-red-50'
                        : 'border-surface-300 focus:ring-primary-500'
                    }
        `}
                aria-invalid={!!error}
                aria-describedby={error ? `${selectId}-error` : undefined}
                {...rest}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && (
                <p id={`${selectId}-error`} className="text-xs text-red-600" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
