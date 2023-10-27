import { IRoute, OPTIONS_MENU_ON_APPBAR } from "@/common/constants/routes";
import { IBase } from "@/common/interfaces/base";
import { IUser } from "@/common/interfaces/user";
import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
type DefaultLayoutProps = {
  children: React.ReactNode
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {

  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<IUser & IBase>();

  const [isToggle, setIsToggle] = useState<boolean>(false);


  const toggleContextMenu = () => {
    setIsToggle(!isToggle);
  }

  const selectMenuItem = (path: string) => {
    if (path === '/logout') {
      localStorage.clear();
    }
    router.push(path);
  }

  return <>
    <Box className="vdt-flex-1 vdt-w-100 vdt-h-screen">
      <AppBar position="static">
        <Container>
          <Toolbar disableGutters>
            <Typography variant="h6" color="inherit" component="div">
              vidientu
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <main style={{ height: `calc(100vh - 64px)` }} className='vdt-overflow-hidden vdt-bg-white-lilac'>
        <Container>
          <Box py={4}>
            {children}
          </Box>
        </Container>
      </main>
    </Box>
  </>
}

export default DefaultLayout;