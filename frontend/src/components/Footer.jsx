// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../store/store'
import api from '../utils/api'

export default function Footer(){
  const currentYear = new Date().getFullYear()
  const user = useSelector(selectUser)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    let mounted = true
    const fetchPosts = async () => {
      if (!user) return
      try {
        const res = await api.get('/blogs/myposts')
        if (res.status === 200 && mounted) {
          setPosts(res.data.blogs || [])
        }
      } catch (err) {
        // silent fail in footer
        console.debug('Footer: failed to fetch my posts', err)
      }
    }
    fetchPosts()
    return () => { mounted = false }
  }, [user])

  return (
    <footer className="mt-20 border-t border-slate-200/70 dark:border-slate-800/80 text-slate-700 dark:text-slate-200">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-6 lg:col-span-5">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-700 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md transition-transform group-hover:scale-105">
                B
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">Blogger</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Readable stories, crafted for people.</div>
              </div>
            </Link>
            <p className="max-w-md text-slate-600 dark:text-slate-400 leading-7">A calmer reading experience for long-form posts, with spacing and typography tuned to feel closer to an editorial product than a dashboard.</p>
          </div>

          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-4">Explore</h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li><Link to="/" className="hover:text-teal-700 dark:hover:text-teal-400">Discover</Link></li>
              <li><Link to="/create" className="hover:text-teal-700 dark:hover:text-teal-400">Write a story</Link></li>
              <li><Link to="/my-posts" className="hover:text-teal-700 dark:hover:text-teal-400">My Posts</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-4">Recent</h4>
            {!user && <div className="text-sm text-slate-500 dark:text-slate-400">Log in to see your recent posts.</div>}
            {user && posts.length === 0 && <div className="text-sm text-slate-500 dark:text-slate-400">No recent posts yet.</div>}
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 mt-3">
              {posts.slice(0,3).map(p => (
                <li key={p._id}>
                  <Link to={`/post/${p._id}`} className="block truncate hover:text-teal-700 dark:hover:text-teal-400">{p.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-12 lg:col-span-3">
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li><Link to="/privacy" className="hover:text-teal-700 dark:hover:text-teal-400">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-teal-700 dark:hover:text-teal-400">Terms</Link></li>
              <li><Link to="/cookies" className="hover:text-teal-700 dark:hover:text-teal-400">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-200/70 dark:border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">© {currentYear} Blogger. Built with care for readers and creators.</p>

          <nav className="flex items-center gap-4 text-sm">
            <Link to="/privacy" className="text-slate-500 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400">Privacy</Link>
            <span className="hidden md:block text-slate-300 dark:text-slate-700">•</span>
            <Link to="/terms" className="text-slate-500 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400">Terms</Link>
            <span className="hidden md:block text-slate-300 dark:text-slate-700">•</span>
            <Link to="/contact" className="text-slate-500 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
