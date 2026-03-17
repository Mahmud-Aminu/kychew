import { type ReactNode } from 'react';

type BadgeVariant = 'blue' | 'green' | 'amber' | 'red' | 'gray';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
    blue: 'bg-primary-100 text-primary-700',
    green: 'bg-accent-100 text-accent-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-surface-100 text-surface-600',
};

export default function Badge({
    children,
    variant = 'blue',
    className = '',
}: BadgeProps) {
    return (
        <span
            className={`
        inline-flex items-center rounded-full px-2.5 py-0.5
        text-xs font-semibold
        ${variantClasses[variant]}
        ${className}
      `}
        >
            {children}
        </span>
    );
}
