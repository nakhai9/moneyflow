import { IRoute, OPTIONS_MENU_ON_APPBAR } from "@/common/constants/routes";
import { IBase } from "@/common/interfaces/base";
import { IUser } from "@/common/interfaces/user";
import { AppBar, Avatar, Backdrop, Box, Button, CircularProgress, Container, IconButton, Menu, MenuItem, MenuList, Paper, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
type DefaultLayoutProps = {
  children: React.ReactNode
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {

  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<IUser & IBase>();

  const [isToggle, setIsToggle] = useState<boolean>(false);

  const { isOpen } = useSelector((state: RootState) => state.backdrop)

  const dispatch = useDispatch();

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
    <Backdrop className="vdt-z-50" open={false}
    >
      <CircularProgress color="primary" />
    </Backdrop>
    <Box className="vdt-flex-1 vdt-w-100 vdt-h-screen">
      <AppBar position="static">
        <Container>
          <Toolbar disableGutters>
            <div className="vdt-flex vdt-items-center vdt-flex-1 vdt-gap-4">
              <Typography variant="h6" color="inherit" component="div" >
                vidientu
              </Typography>
              <Link className="vdt-no-underline vdt-text-white" href="/transactions">Transactions</Link>
            </div>

            <Box>
              <div className="vdt-relative">
                <div className="vdt-flex vdt-gap-4 vdt-items-center vdt-relative" onClick={toggleContextMenu}>
                  <Avatar src="https://scontent.fvca1-3.fna.fbcdn.net/v/t39.30808-6/273733125_968361504110187_3156377724812769692_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHjIFFE3YpeMkq844jJAbYLOY4_AJp1Yxw5jj8AmnVjHCUWondyUjeuSwuUIEBj4sRuwAh3qdxT6H4SjKQoTzVn&_nc_ohc=jvBAhMwYlOEAX9CJ7qg&_nc_ht=scontent.fvca1-3.fna&oh=00_AfCSHjmS07QYO0DtRZADPZ9LWKgqgvYZO-_fZb-sihs9qg&oe=6540CF16" alt="KD" />
                  <span className="vdt-text-sm vdt-font-semibold">Dev React Xịnnnn</span>
                </div>
                {
                  isToggle && <MenuList component={Paper} className="vdt-top-12 vdt-absolute vdt-bg-white vdt-z-30">
                    {
                      OPTIONS_MENU_ON_APPBAR.map((option, index) => (
                        <MenuItem className="vdt-min-w-md vdt-w-40 " key={index}>
                          <Link className="vdt-no-underline vdt-text-slate-500 " href={option.path} >{option.text}</Link>
                        </MenuItem>
                      ))
                    }
                  </MenuList>
                }
              </div>
            </Box>
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