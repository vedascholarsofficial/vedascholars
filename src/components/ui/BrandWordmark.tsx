import React from 'react';
import Image from 'next/image';

interface BrandWordmarkProps {
    inverted?: boolean;
    className?: string;
    priority?: boolean;
}

export default function BrandWordmark({ inverted = false, className = '', priority = false }: BrandWordmarkProps) {
    return (
        <Image
            src={inverted ? '/images/veda-logo-light.png' : '/images/veda-logo.png'}
            alt="Veda Scholars"
            width={1392}
            height={196}
            priority={priority}
            sizes="(max-width: 768px) 224px, 250px"
            className={`h-8 md:h-9 w-auto object-contain ${className}`}
        />
    );
}
