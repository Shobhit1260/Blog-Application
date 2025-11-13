// @ts-nocheck
import React, { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import '../styles/quill.css'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../utils/api'
import toast from 'react-hot-toast'
import Markdown from 'react-markdown'

export default function CreateEdit(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    coverImage: '',
    categories: [],
    tags: [],
    published: false
  })
  const [categoryInput, setCategoryInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState('')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    let url
    if (coverFile) {
      url = URL.createObjectURL(coverFile)
      setCoverPreview(url)
    } else {
      setCoverPreview('')
    }
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [coverFile])

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const res = await api.get(`/blogs/getblog/${id}`)
        const post = res.data?.blog || res.blog
        setFormData({
          title: post.title || '',
          content: post.content || '',
          coverImage: post.coverImage || '',
          categories: post.categories || [],
          tags: post.tags || [],
          published: post.published || false
        })
      } catch (e) {
        console.error(e)
        toast.error('Failed to load post')
      }
    }
    load()
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const addCategory = () => {
    if (categoryInput.trim() && !formData.categories.includes(categoryInput.trim())) {
      setFormData({
        ...formData,
        categories: [...formData.categories, categoryInput.trim()]
      })
      setCategoryInput('')
    }
  }

  const removeCategory = (cat) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter(c => c !== cat)
    })
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      })
      setTagInput('')
    }
  }

  const removeTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    })
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
      // If a file was chosen, send multipart/form-data
      if (coverFile) {
        const data = new FormData()
        data.append('title', formData.title)
        data.append('content', formData.content)
        data.append('categories', JSON.stringify(formData.categories))
        data.append('tags', JSON.stringify(formData.tags))
        data.append('published', formData.published)
        data.append('coverImage', coverFile)

        if (id) {
          await api.put(`/blogs/updateblog/${id}`, data)
          toast.success('Post updated successfully!')
          navigate(`/post/${id}`)
        } else {
          const res = await api.post('/blogs/createblog', data)
          const newPostId = res.data?.blog?._id || res.data?._id
          toast.success('Post created successfully!')
          navigate(`/post/${newPostId}`)
        }
      } else {
        const payload = {
          title: formData.title,
          content: formData.content,
          coverImage: formData.coverImage,
          categories: formData.categories,
          tags: formData.tags,
          published: formData.published
        }

        if (id) {
          await api.put(`/blogs/updateblog/${id}`, payload)
          toast.success('Post updated successfully!')
          navigate(`/post/${id}`)
        } else {
          const res = await api.post('/blogs/createblog', payload)
          const newPostId = res.data?.blog?._id || res.data?._id
          toast.success('Post created successfully!')
          navigate(`/post/${newPostId}`)
        }
      }
    } catch (err) {
      console.error(err)
      toast.error(err.data?.message || 'Failed to save post')
    } finally {
      setLoading(false)
    }
  }

  const saveDraft = async () => {
    const draftData = { ...formData, published: false }
    setFormData(draftData)
    toast.success('Saved as draft')
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {id ? 'Edit Your Story' : 'Create New Story'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your thoughts with the world
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="md:col-span-2 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter an engaging title..."
                  className="w-full px-4 py-3 text-2xl font-bold border-b-2 border-gray-300 dark:border-gray-600 bg-transparent focus:border-cyan-500 outline-none transition"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Cover Image
                </label>
                <input
                  type="text"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                />
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Cover Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0]
                      setCoverFile(file || null)
                      if (file) setFormData({ ...formData, coverImage: '' })
                    }}
                    className="w-full"
                  />
                </div>
                {(coverPreview || formData.coverImage) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4"
                  >
                    <img
                      src={coverPreview || formData.coverImage}
                      alt="Cover preview"
                      className="w-full h-64 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        toast.error('Invalid image')
                      }}
                    />
                  </motion.div>
                )}
              </div>

              {/* Content Editor (WYSIWYG) */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Content *
                </label>
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(val) => setFormData({ ...formData, content: val })}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['blockquote', 'code-block'],
                      ['link', 'image'],
                      ['clean']
                    ]
                  }}
                  formats={[
                    'header', 'bold', 'italic', 'underline', 'strike',
                    'list', 'bullet', 'blockquote', 'code-block', 'link', 'image'
                  ]}
                  placeholder="Tell your story..."
                  className="bg-white dark:bg-gray-800 rounded-lg"
                />
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                  <span>{(formData.content || '').replace(/<[^>]*>/g, '').length} characters</span>
                  <span>{((formData.content || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w).length) || 0} words</span>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Status */}
              <div className="glass rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-4">Publish Settings</h3>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleChange}
                    className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-2 focus:ring-cyan-500"
                  />
                  <div>
                    <div className="font-semibold">Publish immediately</div>
                    <div className="text-xs text-gray-500">Make this post public</div>
                  </div>
                </label>

                {!formData.published && (
                  <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div className="text-sm text-yellow-800 dark:text-yellow-300">
                        This will be saved as a draft
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="glass rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-4">Categories</h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                    placeholder="Add category..."
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={addCategory}
                    className="px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.categories.map((cat, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      {cat}
                      <button
                        type="button"
                        onClick={() => removeCategory(cat)}
                        className="hover:text-red-600"
                      >
                        ×
                      </button>
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="glass rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-4">Tags</h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag..."
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-600"
                      >
                        ×
                      </button>
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {formData.published ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {id ? 'Update Post' : 'Publish Post'}
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                          </svg>
                          Save as Draft
                        </>
                      )}
                    </span>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full py-3 px-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                  <button
                    type="button"
                    onClick={async () => {
                      // Generate article from backend and load into textarea
                      if (!formData.title.trim()) {
                        toast.error('Please enter a title first to generate content')
                        return
                      }
                      try {
                        setGenerating(true)
                        // Build a prompt based on the current title + optional categories/tags
                        let prompt = `Write a well-structured, SEO-friendly blog article titled "${formData.title}". Include an engaging introduction, 3-5 clear sections with headings, and a concise conclusion.`
                        // Ask the model to return HTML so the WYSIWYG editor can render headings and emphasis directly.
                        prompt += `\n\nIMPORTANT: Return only the article body in HTML. Use semantic tags: wrap the main title in <h1>, section headings in <h2>, paragraphs in <p>, use <em> for italic emphasis and <strong> for bold. Use <ul>/<li> for lists when appropriate. Do NOT include extra commentary or markdown code fences — only the raw HTML markup for the article body.`
                        if (formData.categories && formData.categories.length) {
                          prompt += ` Focus on: ${formData.categories.join(', ')}.`
                        }
                        if (formData.tags && formData.tags.length) {
                          prompt += ` Use keywords: ${formData.tags.join(', ')}.`
                        }

                        const payload = {
                          title: formData.title,
                          prompt,
                          categories: formData.categories,
                          tags: formData.tags,
                        }

                        const res = await api.post('/generate-article', payload)
                        const generated = res.data?.generated || res.data?.content || ''
                        if (!generated) {
                          toast.error('No generated content returned')
                        } else {
                          setFormData({ ...formData, content: generated })
                          toast.success('Generated article loaded')
                        }
                      } catch (err) {
                        console.error(err)
                        toast.error(err?.data?.message || 'Failed to generate article')
                      } finally {
                        setGenerating(false)
                      }
                    }}
                    className="w-full mt-2 py-3 px-4 bg-yellow-500 text-white font-semibold rounded-lg shadow hover:bg-yellow-600 transition disabled:opacity-50"
                    disabled={generating}
                  >
                    {generating ? (
                      
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Generating...
                      </span>
                    ) : (
                      'Generate Article'
                    )}
                  </button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
