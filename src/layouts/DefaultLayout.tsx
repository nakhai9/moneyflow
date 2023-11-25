'use client'
import { auth } from "@/common/configs/firebaseConfig";
// import { OPTIONS_MENU_ON_APPBAR } from "@/common/constants/routes";
import { FirestoreCollections, IUser } from "@/common/drafts/prisma";
import { firestoreService } from "@/common/services/firestore";
import { ExpenseTrackerToolbar } from "@/components";
import { setCurrentUser } from "@/store/features/auth/authSlice";
import { toggle } from "@/store/features/backdrop/backdropSlice";
import { RootState } from "@/store/store";
import { Backdrop, Box, CircularProgress, Container } from "@mui/material";
import { onAuthStateChanged, signOut } from "firebase/auth";
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
  const { isOpen } = useSelector((state: RootState) => state.backdrop)

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
    <Backdrop className="vdt-z-50" open={isOpen}>
      <CircularProgress color="primary" />
    </Backdrop>
    <Box className="vdt-flex-1 vdt-w-100">
      <ExpenseTrackerToolbar user={user} logout={logout}/>
      <main className='vdt-overflow-auto'>
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