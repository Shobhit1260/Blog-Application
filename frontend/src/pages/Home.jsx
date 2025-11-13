// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../store/store'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import BlogCard from '../components/BlogCard'
import Hero from '../components/Hero'
import { motion } from 'framer-motion'
import dummyBlogs from '../data/dummyBlogs'

export default function Home(){
  const [posts,setPosts]=useState([])
  const [loading,setLoading]=useState(true)
  const currentUser = useSelector(selectUser)

  useEffect(()=>{
    const load = async ()=>{
      try{
        
        const res = await api.get('/blogs/getblogs')
        const data = res.data?.blogs || res.blogs || res.data || []
        setPosts(data)
      }catch(e){
        console.error('API failed, falling back to dummy data', e)
        setPosts(dummyBlogs)
      }
      finally{setLoading(false)}
    }
    load()
  },[])

  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId))
  }

  // build filter sets
  const allCategories = Array.from(new Set(posts.flatMap(p=>p.categories || [])))
  const allTags = Array.from(new Set(posts.flatMap(p=>p.tags || [])))
  const [categoryFilter,setCategoryFilter] = useState('')
  const [tagFilter,setTagFilter] = useState('')
  const [search,setSearch] = useState('')

  const filtered = posts.filter(p=>{
    if(categoryFilter && !(p.categories||[]).includes(categoryFilter)) return false
    if(tagFilter && !(p.tags||[]).includes(tagFilter)) return false
    if(search){
      const s = search.toLowerCase()
      if(!(p.title.toLowerCase().includes(s) || p.content.toLowerCase().includes(s))) return false
    }
    return true
  })

  const featured = filtered.slice(0,3)

  return (
    <div>
      <Hero />

      <section className="container px-6 mt-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} className="border rounded px-3 py-2 bg-white dark:bg-gray-800">
              <option value="">All categories</option>
              {allCategories.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={tagFilter} onChange={e=>setTagFilter(e.target.value)} className="border rounded px-3 py-2 bg-white dark:bg-gray-800">
              <option value="">All tags</option>
              {allTags.map(t=> <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto w-full md:w-1/3">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search posts..." className="flex-1 border rounded px-3 py-2 bg-white dark:bg-gray-800" />
            <button onClick={()=>{setCategoryFilter(''); setTagFilter(''); setSearch('')}} className="px-3 py-2 bg-cyan-600 text-white rounded">Clear</button>
          </div>
        </div>
      </section>

      <section className="container px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured stories</h2>
          <a className="text-sm text-cyan-600" href="/feed">See all</a>
        </div>

        <motion.div layout className="grid md:grid-cols-3 gap-6">
          {featured.map(p=> <BlogCard key={p._id} post={p} onDelete={handlePostDeleted} />)}
        </motion.div>
      </section>

      <section className="container px-6 mt-12">
        <h2 className="text-2xl font-bold mb-4">Latest</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <> 
            {filtered.length === 0 ? (
              <div className="w-full py-12 flex flex-col items-center justify-center border border-dashed rounded-lg bg-gray-50 dark:bg-gray-900/40">
                <div className="text-3xl mb-3">😶‍🌫️</div>
                <h3 className="text-xl font-semibold">No posts found</h3>
                <p className="text-sm text-gray-500 mt-2 text-center max-w-xl">No posts match the selected category, tag, or search. Try clearing filters, or be the first to publish something awesome.</p>
                <div className="mt-6">
                  {/** Use selector to show CTA for logged-in users */}
                  {/** get current user from redux */}
                  {currentUser && currentUser._id ? (
                    <Link to="/create" className="px-4 py-2 bg-cyan-600 text-white rounded-lg">Write the first post</Link>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Link to="/login" className="px-4 py-2 bg-cyan-600 text-white rounded-lg">Log in to write</Link>
                      <Link to="/register" className="px-4 py-2 border rounded-lg">Register</Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
                {filtered.map(p=> <BlogCard key={p._id} post={p} onDelete={handlePostDeleted} />)}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
