import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

type VButtonPros = {
    className?: string;
    children: React.ReactNode
    startIcon?: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
    variant?: "text" | "contained" | "outlined";
    onClick?: React.MouseEventHandler | undefined;
    type?: 'submit' | 'reset' | 'button' | undefined;
    color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
}

export default function VButton({ variant, type, size, color, onClick, className, children, startIcon }: VButtonPros) {
    return (
        <Stack spacing={2} direction="row">
            <Button
                size={size}
                type={type}
                color={color}
                variant={variant}
                onClick={onClick}
                className={className}
                startIcon={startIcon}
            >
                {children}
            </Button>
        </Stack>
    );
}