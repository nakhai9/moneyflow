import { PAGES, SETTINGS } from '@/common/constants/routes';
import { IBase, IUser } from '@/common/drafts/prisma';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import * as React from 'react';

type AppToolbarProps = {
    user: (IUser & IBase) | null,

    logout: () => void
}

const AppToolbar: React.FC<AppToolbarProps> = ({ user, logout }) => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static">
            <Container>
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/dashboard"
                        sx={{
                            mr: 4,
                            display: { xs: 'none', md: 'flex' },
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Spendee
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {PAGES.map((page) => (
                                <MenuItem key={page?.id} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">{page.text}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/dashboard"
                        sx={{
                            mr: 4,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Spendee
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: { md: 4 } }}>
                        {PAGES.map((page) => (
                            <Link key={page.id} href={page.path} passHref className='vdt-no-underline vdt-text-white'>{page.text}</Link>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        {
                            user && (<Box sx={{ display: 'flex', alignItems: "center", gap: 2, cursor: "pointer" }} onClick={handleOpenUserMenu}>
                                <Avatar alt={`${user.firstName} ${user?.lastName}`} src={`${user.photoUrl}`} />
                                <Typography sx={{ display: { xs: 'none', md: 'flex' }, mr: { xs: 'unset', md: 2 } }}>{`${user.firstName} ${user.lastName}`}</Typography>
                                <KeyboardArrowDownIcon fontSize='small' />
                            </Box>)
                        }
                        <Menu
                            sx={{ mt: '46px' }}
                            id="menu-appbar"
                            className='expense-tracker-menu-appbar'
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {SETTINGS.map((setting) => (
                                <MenuItem key={setting.id} onClick={handleCloseUserMenu}>
                                    <Typography component="a" href={setting.path} variant='subtitle2' className='vdt-no-underline vdt-text-inherit'>{setting.text}</Typography>
                                </MenuItem>
                            ))}
                            <MenuItem key="logout" onClick={logout}>
                                <Typography variant='subtitle2' >Log out</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default AppToolbar;