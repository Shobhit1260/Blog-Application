// @ts-nocheck
import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import BlogCard from '../components/BlogCard'
import Hero from '../components/Hero'
import { motion } from 'framer-motion'
import dummyBlogs from '../data/dummyBlogs'

export default function Home(){
  const [posts,setPosts]=useState([])
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    const load = async ()=>{
      try{
        const useDummy = import.meta.env.VITE_USE_DUMMY === '1'
        if(useDummy){
          setPosts(dummyBlogs)
          return
        }
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
          {featured.map(p=> <BlogCard key={p._id} post={p} />)}
        </motion.div>
      </section>

      <section className="container px-6 mt-12">
        <h2 className="text-2xl font-bold mb-4">Latest</h2>
        {loading ? <p>Loading...</p> : (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
            {filtered.map(p=> <BlogCard key={p._id} post={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}
