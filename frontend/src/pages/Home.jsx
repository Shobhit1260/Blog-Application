// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../store/store'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import BlogCard from '../components/BlogCard'
import Hero from '../components/Hero'
import { motion } from 'framer-motion'

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
        console.error('API failed to load blogs', e)
        setPosts([])
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
  const latest = filtered.slice(3)

  return (
    <div className="space-y-12 lg:space-y-16">
      <Hero />

      <section className="container">
        <div className="page-surface rounded-[2rem] p-4 sm:p-5 lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="section-kicker mb-2">Discover</div>
              <h2 className="section-heading text-2xl sm:text-3xl text-slate-950 dark:text-white">Browse by topic, tag, or keyword</h2>
              <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">Keep the feed focused by narrowing to the stories you want to read next.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} className="min-w-0 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900">
              <option value="">All categories</option>
              {allCategories.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
              <select value={tagFilter} onChange={e=>setTagFilter(e.target.value)} className="min-w-0 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900">
              <option value="">All tags</option>
              {allTags.map(t=> <option key={t} value={t}>{t}</option>)}
            </select>
              <div className="flex items-center gap-2 w-full sm:w-[22rem]">
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search posts..." className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900" />
                <button onClick={()=>{setCategoryFilter(''); setTagFilter(''); setSearch('')}} className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">Clear</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <div className="section-kicker mb-2">Featured</div>
            <h2 className="section-heading text-2xl sm:text-3xl text-slate-950 dark:text-white">Stories worth your attention</h2>
          </div>
        </div>

        <motion.div layout className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {featured.map(p=> <BlogCard key={p._id} post={p} onDelete={handlePostDeleted} />)}
        </motion.div>
      </section>

      <section className="container">
        <div className="mb-5">
          <div className="section-kicker mb-2">Latest</div>
          <h2 className="section-heading text-2xl sm:text-3xl text-slate-950 dark:text-white">Recent writing from the community</h2>
        </div>
        {loading ? (
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        ) : (
          <> 
            {filtered.length === 0 ? (
              <div className="page-surface rounded-[2rem] py-16 flex flex-col items-center justify-center text-center">
                <div className="text-3xl mb-3">No results</div>
                <h3 className="text-xl font-semibold text-slate-950 dark:text-white">No posts found</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center max-w-xl">Try clearing the filters or search terms to widen the feed again.</p>
                <div className="mt-6">
                  {currentUser && currentUser._id ? (
                    <Link to="/create" className="px-5 py-2.5 bg-slate-900 text-white rounded-full dark:bg-white dark:text-slate-900">Write the first post</Link>
                  ) : (
                    <Link to="/login" className="px-5 py-2.5 bg-slate-900 text-white rounded-full dark:bg-white dark:text-slate-900">Log in to write</Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {(latest.length ? latest : filtered).map(p=> <BlogCard key={p._id} post={p} onDelete={handlePostDeleted} />)}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
