import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import BlogDetail from './pages/BlogDetail'
import CreateEdit from './pages/CreateEdit'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import MyProfile from './pages/MyProfile'
import MyPosts from './pages/MyPosts'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import About from './pages/About'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Guidelines from './pages/Guidelines'
import Cookies from './pages/Cookies'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import api from './utils/api'
import { setUser, initializeUser, setLoading } from './store/userSlice'

export default function App(){
  const dispatch = useDispatch()

  useEffect(() => {
    // Initialize from localStorage first
    dispatch(initializeUser())

    // Try to refresh user from server using cookie (sent via credentials)
    const fetchMe = async () => {
      try {
        dispatch(setLoading(true))
        const res = await api.get('/users/me')
        if (res.status === 200 && res.data && res.data.user) {
          dispatch(setUser(res.data.user))
        }
      } catch (err) {
        // ignore if not authenticated
        console.debug('Not authenticated or failed to fetch /users/me', err)
      } finally {
        dispatch(setLoading(false))
      }
    }

    fetchMe()
  }, [dispatch])
  return (
    <div className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100 bg-[radial-gradient(circle_at_top,rgba(14,165,164,0.10),transparent_32%),linear-gradient(180deg,#fbfaf8_0%,#f5f1ea_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(14,165,164,0.12),transparent_34%),linear-gradient(180deg,#07111f_0%,#0b1220_100%)]">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/post/:id" element={<BlogDetail/>} />
          <Route path="/create" element={<CreateEdit/>} />
          <Route path="/edit/:id" element={<CreateEdit/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/reset-password/:token" element={<ResetPassword/>} />
          <Route path="/profile" element={<MyProfile/>} />
          <Route path="/profile/:id" element={<Profile/>} />
          <Route path="/my-posts" element={<MyPosts/>} />
          <Route path="/settings" element={<Settings/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/terms" element={<Terms/>} />
          <Route path="/privacy" element={<Privacy/>} />
          <Route path="/guidelines" element={<Guidelines/>} />
          <Route path="/cookies" element={<Cookies/>} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}
