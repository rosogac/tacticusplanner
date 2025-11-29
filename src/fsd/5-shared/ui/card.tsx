import React, { CSSProperties, ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    minHeight?: string;
    width?: string;
    style?: CSSProperties;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    onClick,
    minHeight = 'min-h-[235px]',
    width = 'w-full md:w-[280px]',
    style,
}) => {
    return (
        <div
            onClick={onClick}
            style={style}
            className={`${width} ${minHeight} ${
                onClick ? 'cursor-pointer' : ''
            } bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-[#ffffff1a] p-5 flex flex-col gap-3 shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}>
            {children}
        </div>
    );
};
