import { useState } from 'react'

type useToggleProps = {
    customOpen?: () => void;
    customClose?: () => void;
}

export default function useToggle(props?: useToggleProps) {
    const { customOpen = () => { }, customClose = () => { } } = props || {};
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
        customOpen && customOpen()
    }
    const handleClose = () => {
        setOpen(false);
        customClose && customClose()
    }
    return {
        open,
        handleOpen,
        handleClose
    }
}
