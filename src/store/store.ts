import { configureStore } from '@reduxjs/toolkit'
import backdropReducer from "./features/backdrop/backdropSlice";
const rootReducer = {
  backdrop: backdropReducer
}

export const store = configureStore({
  reducer: rootReducer,
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch