import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import authReducer from "./features/auth/authSlice";
import globalReducer from "./features/global/globalSlice";

const rootReducer = {
  global: globalReducer,
  auth: authReducer
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false
    })
  ],
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch