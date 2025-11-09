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
import { Toaster } from 'react-hot-toast'

export default function App(){
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/post/:id" element={<BlogDetail/>} />
          <Route path="/create" element={<CreateEdit/>} />
          <Route path="/edit/:id" element={<CreateEdit/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/reset-password/:token" element={<ResetPassword/>} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}
