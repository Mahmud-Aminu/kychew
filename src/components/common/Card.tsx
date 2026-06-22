import { type ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    onClick?: () => void;
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
    onClick,
}: CardProps) {
    return (
        <div
            onClick={onClick}
            className={`
        bg-white rounded-xl border border-surface-200 shadow-sm dark:bg-surface-800 dark:border-surface-700 transition-colors duration-200
        ${paddingClasses[padding]}
        ${hover || onClick ? 'transition-all duration-200 hover:shadow-md cursor-pointer' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
}
