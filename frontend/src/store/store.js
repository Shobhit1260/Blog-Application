import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export const selectUser = (state) => state.user.user
export const selectIsLoggedIn = (state) => state.user.isLoggedIn
export const selectUserLoading = (state) => state.user.loading
export const selectUserError = (state) => state.user.error
