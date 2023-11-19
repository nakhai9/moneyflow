import { OPTIONS_MENU_ON_APPBAR } from "@/common/constants/routes";
import { FirestoreCollections } from "@/common/drafts/prisma";
import { firestoreService } from "@/common/services/firestore";
import { clearUserAndToken, setUser } from "@/store/features/user/userSlice";
import { RootState } from "@/store/store";
import { AppBar, Avatar, Backdrop, Box, Button, CircularProgress, Container, MenuItem, MenuList, Paper, Skeleton, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
type DefaultLayoutProps = {
  children: React.ReactNode
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {

  const router = useRouter();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.user)

  const [isToggle, setIsToggle] = useState<boolean>(false);

  const { isOpen } = useSelector((state: RootState) => state.backdrop)

  const fecthUserById = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        router.push("/auth/login");
      } else {
        const user = await firestoreService.getDocById(FirestoreCollections.USERS, userId);
        dispatch(setUser(user));
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, router])

  useEffect(() => {
    fecthUserById()
  }, [fecthUserById])


  const toggleContextMenu = () => {
    setIsToggle(!isToggle);
  }

  const selectMenuItem = (path: string) => {
    router.push(path);
  }

  const logout = () => {
    localStorage.clear();
    dispatch(clearUserAndToken());
    router.push("/");
  }

  return <>
    <Backdrop className="vdt-z-50" open={isOpen}
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
              <Link className="vdt-no-underline vdt-text-white" href="/components">Components</Link>
            </div>

            <Box>
              <div className="vdt-relative">
                <div className="vdt-flex vdt-gap-4 vdt-items-center vdt-relative" onClick={toggleContextMenu}>
                  <Avatar src={user?.photoUrl} alt="KD" />
                  <span className="vdt-text-sm vdt-font-semibold">{user?.firstName} {user?.lastName}</span>
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
                    <MenuItem className="vdt-min-w-md vdt-w-40" key="logout" onClick={logout}>
                      <Link className="vdt-no-underline vdt-text-slate-500" href={"/logout"} passHref>Log out</Link>
                    </MenuItem>
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
    </Box >
  </>
}

export default DefaultLayout;