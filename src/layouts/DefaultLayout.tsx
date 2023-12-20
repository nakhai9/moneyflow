'use client'
import { auth } from "@/common/configs/firebaseConfig";
import { FirestoreCollections } from "@/common/enums/firestore-collections";
import { IUser } from "@/common/interfaces/user";
import { firestoreService } from "@/common/services/firestore";
import { AppToolbar } from "@/components";
import { setCurrentUser } from "@/store/features/auth/authSlice";
import { togglePageLoading } from "@/store/features/global/globalSlice";
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
  const [loading, setLoading] = useState(true);
  const { pageLoading } = useSelector((state: RootState) => state.global);
  const logout = () => {
    signOut(auth);
    localStorage.clear();
    router.push("/auth/login");
  }

  const fetchUser = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      dispatch(togglePageLoading(true));
      const user = await firestoreService.getDocById<IUser>(FirestoreCollections.USERS, userId);
      if (user) {
        dispatch(setCurrentUser(user));
      }
      setLoading(false);
      dispatch(togglePageLoading(false));
    } catch (error) {
      console.log(error);
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

  }, [router, dispatch]);

  return <>
    {
      pageLoading ? <Backdrop className="tw-z-50" sx={{ background: 'white' }} open={pageLoading}><CircularProgress color="primary" /></Backdrop> : (<Box className="tw-flex-1 tw-w-100"><AppToolbar user={user} logout={logout} />
        <main className='tw-overflow-auto'>
          <Container>
            <Box py={4}>
              {children}
            </Box>
          </Container>
        </main>
      </Box>)
    }
  </>
}

export default DefaultLayout;