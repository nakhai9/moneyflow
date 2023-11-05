import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVertIcon } from '../common/VIcons';

type DropdownMoreProps = {
  actions: React.ReactNode[]
}

export default function DropdownMore({ actions }: DropdownMoreProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-controls="more-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="more-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          padding: 0,
          margin: 0
        }}
      >
        {
          actions?.map((action, idx) => (
            <MenuItem key={idx} onClick={handleClose}>{action}</MenuItem>
          ))
        }
      </Menu>
    </div>
  );
}

