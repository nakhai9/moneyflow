import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

type VButtonPros = {
    variant: "text" | "contained" | "outlined";
    type: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
    children: React.ReactNode
}

export default function VButton({ variant, type, children }: VButtonPros) {
    return (
        <Stack spacing={2} direction="row">
            <Button color={type} variant={variant}>{children}</Button>
        </Stack>
    );
}