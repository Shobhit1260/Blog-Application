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
    <footer className="mt-20 bg-white border-t border-gray-100 text-gray-700">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 items-start">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-3 group">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-600 to-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-md transition-transform transform group-hover:scale-105">
                B
              </div>
              <div>
                <div className="text-xl font-extrabold text-gray-900">Blogger</div>
                <div className="text-sm text-gray-500">Readable stories, crafted for people.</div>
              </div>
            </Link>
            <p className="text-gray-600 max-w-md mb-4">Publish long-form content with an emphasis on clarity, accessibility and delightful reading experience. Your words, clearly presented.</p>

            <div className="flex items-center gap-3 mt-4">
              <Link to="/about" className="text-sm text-gray-600 hover:text-teal-600">About</Link>
              <Link to="/contact" className="text-sm text-gray-600 hover:text-teal-600">Contact</Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="">
            <h4 className="font-semibold text-gray-900 mb-3">Explore</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/" className="hover:text-teal-600">Discover</Link></li>
              <li><Link to="/create" className="hover:text-teal-600">Write a story</Link></li>
              <li><Link to="/my-posts" className="hover:text-teal-600">My Posts</Link></li>
            </ul>
          </div>

          {/* Recent Posts (for logged-in user) */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Recent Posts</h4>
            {!user && (
              <div className="text-sm text-gray-600">Log in to see your recent posts</div>
            )}
            {user && posts.length === 0 && (
              <div className="text-sm text-gray-600">No recent posts</div>
            )}
            <ul className="space-y-2 text-gray-600">
              {posts.slice(0,3).map(p => (
                <li key={p._id} className="text-sm">
                  <Link to={`/post/${p._id}`} className="hover:text-teal-600 block truncate">{p.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/privacy" className="hover:text-teal-600">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-teal-600">Terms</Link></li>
              <li><Link to="/cookies" className="hover:text-teal-600">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">© {currentYear} Blogger — Built with care for readers and creators.</p>

          <nav className="flex items-center gap-4 text-sm">
            <Link to="/privacy" className="text-gray-600 hover:text-teal-600">Privacy</Link>
            <span className="hidden md:block text-gray-300">•</span>
            <Link to="/terms" className="text-gray-600 hover:text-teal-600">Terms</Link>
            <span className="hidden md:block text-gray-300">•</span>
            <Link to="/contact" className="text-gray-600 hover:text-teal-600">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
