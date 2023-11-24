'use client'
import { auth } from "@/common/configs/firebaseConfig";
import { OPTIONS_MENU_ON_APPBAR } from "@/common/constants/routes";
import { FirestoreCollections, IUser } from "@/common/drafts/prisma";
import { firestoreService } from "@/common/services/firestore";
import { setCurrentUser } from "@/store/features/auth/authSlice";
import { toggle } from "@/store/features/backdrop/backdropSlice";
import { RootState } from "@/store/store";
import { AppBar, Avatar, Backdrop, Box, CircularProgress, Container, MenuItem, MenuList, Paper, Toolbar, Typography } from "@mui/material";
import { onAuthStateChanged, signOut } from "firebase/auth";
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

  const { user } = useSelector((state: RootState) => state.auth)

  const [isToggle, setIsToggle] = useState<boolean>(false);

  const { isOpen } = useSelector((state: RootState) => state.backdrop)

  const toggleContextMenu = () => {
    setIsToggle(!isToggle);
  }

  const selectMenuItem = (path: string) => {
    router.push(path);
  }

  const navigateToDashboard = () => {
    router.push("/dashboard");
  }

  const logout = () => {
    signOut(auth);
    localStorage.clear();
    router.push("/auth/login");
  }

  const fetchUser = useCallback(async (userId: string) => {
    dispatch(toggle())
    try {
      const user = await firestoreService.getDocById<IUser>(FirestoreCollections.USERS, userId);
      if (user) {
        dispatch(setCurrentUser(user));
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(toggle())
    }
  }, [dispatch]);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUser(user.uid);
      } else {
        dispatch(setCurrentUser(null));
        router.push("/auth/login")
      }
    })
    return () => unsubscribe();
  }, [router]);

  return <>
    <Backdrop className="vdt-z-50" open={isOpen}
    >
      <CircularProgress color="primary" />
    </Backdrop>
    <Box className="vdt-flex-1 vdt-w-100">
      <AppBar position="static">
        <Container>
          <Toolbar disableGutters>
            <div className="vdt-flex vdt-items-center vdt-flex-1 vdt-gap-4">
              <div onClick={navigateToDashboard} className="vdt-cursor-pointer">
                <Typography variant="h6" color="inherit" component="div" >
                  Expense Tracker
                </Typography>
              </div>
              <Link className="vdt-no-underline vdt-text-white" href="/transactions">Transactions</Link>
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
                      <Link className="vdt-no-underline vdt-text-slate-500" href="" passHref>Log out</Link>
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