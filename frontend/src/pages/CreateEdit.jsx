// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { selectUser } from '../store/store'
import api from '../utils/api'
import toast from 'react-hot-toast'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function CreateEdit(){
  const { id } = useParams()
  const navigate = useNavigate()
  const currentUser = useSelector(selectUser)
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    coverImage: '',
    categories: [],
    tags: [],
    published: false
  })
  
  const [coverPreview, setCoverPreview] = useState('')
  const [categoryInput, setCategoryInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    if (!currentUser) {
      toast.error('Please login to create/edit posts')
      navigate('/login')
      return
    }

    const loadPost = async () => {
      if (id) {
        try {
          const res = await api.get(`/blogs/getblog/${id}`)
          const blog = res.data?.blog || res.blog
          
          if (blog.author?._id !== currentUser._id) {
            toast.error('You can only edit your own posts')
            navigate('/')
            return
          }
          
          setFormData({
            title: blog.title || '',
            content: blog.content || '',
            coverImage: blog.coverImage || '',
            categories: blog.categories || [],
            tags: blog.tags || [],
            published: blog.published || false
          })
          setCoverPreview(blog.coverImage)
        } catch (err) {
          console.error(err)
          toast.error('Failed to load post')
          navigate('/')
        }
      }
      setInitialLoad(false)
    }

    loadPost()
  }, [id, currentUser, navigate])

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result)
        setFormData(prev => ({
          ...prev,
          coverImage: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const addCategory = () => {
    if (categoryInput.trim() && !formData.categories.includes(categoryInput)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, categoryInput]
      }))
      setCategoryInput('')
    }
  }

  const removeCategory = (idx) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== idx)
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput]
      }))
      setTagInput('')
    }
  }

  const removeTag = (idx) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== idx)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }
    if (!formData.content.trim()) {
      toast.error('Content is required')
      return
    }

    setLoading(true)
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        coverImage: formData.coverImage,
        categories: formData.categories,
        tags: formData.tags,
        published: formData.published
      }

      let res
      if (id) {
        res = await api.put(`/blogs/updateblog/${id}`, payload)
      } else {
        res = await api.post('/blogs/createblog', payload)
      }

      const newBlog = res.data?.blog || res.blog
      toast.success(id ? 'Post updated successfully!' : 'Post created successfully!')
      navigate(`/blog/${newBlog._id}`)
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to save post')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoad) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto text-cyan-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {id ? 'Edit Your Story' : 'Write a Story'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Share your thoughts with the world
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* LEFT: MAIN EDITOR */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter your story title..."
                className="w-full text-4xl font-bold bg-transparent border-b-2 border-gray-300 dark:border-gray-700 focus:outline-none focus:border-cyan-600 pb-4 dark:text-white placeholder-gray-400"
              />
            </div>

            {/* Cover Image Upload */}
            <div className="relative">
              <label className="block mb-3 font-semibold text-gray-700 dark:text-gray-300">
                Cover Image
              </label>
              <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 text-center cursor-pointer hover:border-cyan-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {coverPreview ? (
                  <img 
                    src={coverPreview} 
                    alt="Cover preview"
                    className="w-full h-60 object-cover rounded"
                  />
                ) : (
                  <div className="py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Click to upload or drag and drop
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block mb-3 font-semibold text-gray-700 dark:text-gray-300">
                Story Content
              </label>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                  placeholder="Start writing your story..."
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline'],
                      ['blockquote', 'code-block'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link', 'image'],
                      ['clean']
                    ]
                  }}
                  style={{ height: '400px' }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: SIDEBAR */}
          <div className="space-y-6">
            {/* Publish Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-slate-900 sticky top-20"
            >
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
                Publish Settings
              </h3>

              <label className="flex items-center justify-between cursor-pointer mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium text-gray-700 dark:text-gray-300">Make Public</span>
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="w-5 h-5 cursor-pointer"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Publishing...' : (id ? 'Update Post' : 'Publish Post')}
              </button>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-slate-900"
            >
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
                Categories
              </h3>

              <div className="flex gap-2 mb-4">
                <input
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                  placeholder="Add category..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <button 
                  type="button"
                  onClick={addCategory}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.categories.map((c, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 text-sm bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full flex items-center gap-2"
                  >
                    {c}
                    <button
                      type="button"
                      onClick={() => removeCategory(i)}
                      className="hover:font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-slate-900"
            >
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
                Tags
              </h3>

              <div className="flex gap-2 mb-4">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <button 
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(i)}
                      className="hover:font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
