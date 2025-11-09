import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isLoggedIn = true
      state.error = null
      // Also store in localStorage
      localStorage.setItem('user', JSON.stringify(action.payload))
      localStorage.setItem('isLoggedIn', 'true')
    },
    updateUser: (state, action) => {
      if (state.user) {
        // Merge new data with existing user data
        const updatedUser = { ...state.user, ...action.payload }
        state.user = updatedUser
        console.log('Redux updateUser - New state:', updatedUser)
        // Update localStorage with the updated user
        localStorage.setItem('user', JSON.stringify(updatedUser))
      } else {
        console.warn('Redux updateUser - No user in state to update')
      }
    },
    clearUser: (state) => {
      state.user = null
      state.isLoggedIn = false
      state.error = null
      // Clear localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    initializeUser: (state) => {
      // Load user from localStorage on app start
      const userDataString = localStorage.getItem('user')
      const isUserLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
      
      if (userDataString && isUserLoggedIn) {
        try {
          state.user = JSON.parse(userDataString)
          state.isLoggedIn = true
        } catch (error) {
          console.error('Error parsing user data:', error)
          localStorage.removeItem('user')
          localStorage.removeItem('isLoggedIn')
        }
      }
    }
  }
})

export const { setUser, updateUser, clearUser, setLoading, setError, initializeUser } = userSlice.actions
export default userSlice.reducer
