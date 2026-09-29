import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    href?: string;
    fullWidth?: boolean;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    href,
    className = '',
    fullWidth = false,
    type = "button",
    ...props
}: ButtonProps) {

    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95 group hover:-translate-y-0.5";

    const variants = {
        // Primary: Gold background, Navy text (Premium call to action)
        primary: "bg-secondary text-primary font-bold hover:bg-[#bfa13a] focus:ring-secondary shadow-md hover:shadow-lg",
        // Secondary: Navy background, White text
        secondary: "bg-primary text-white font-medium hover:bg-[#0f3057] focus:ring-primary shadow-md",
        // Outline: Navy border, Navy text
        outline: "border-2 border-primary text-white hover:bg-primary/5 focus:ring-primary",
        // Ghost: Transparent, Navy text
        ghost: "text-white hover:bg-primary/5"
    };

    const sizes = {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg"
    };

    const widthClass = fullWidth ? "w-full" : "";

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`;

    if (href) {
        return (
            <Link href={href} className={combinedClassName} {...(props as any)}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} className={combinedClassName} {...props}>
            {children}
        </button>
    );
}
