import { type ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export default function Card({
    children,
    className = '',
    padding = 'md',
    hover = false,
}: CardProps) {
    return (
        <div
            className={`
        bg-white rounded-xl border border-surface-200 shadow-sm
        ${paddingClasses[padding]}
        ${hover ? 'transition-shadow duration-200 hover:shadow-md' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
}
