const API = (path, opts = {}) => {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  const url = base + path
  const options = Object.assign({
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  }, opts)

  if (options.body && typeof options.body !== 'string') options.body = JSON.stringify(options.body)

  return fetch(url, options)
    .then(async res => {
      const contentType = res.headers.get('content-type') || ''
      const data = contentType.includes('application/json') ? await res.json() : await res.text()
      if (!res.ok) {
        const err = new Error('API Error')
        err.status = res.status
        err.data = data
        throw err
      }
      return { status: res.status, data }
    })
}

const get = (p) => API(p, { method: 'GET' })
const post = (p, body) => API(p, { method: 'POST', body })
const put = (p, body) => API(p, { method: 'PUT', body })
const del = (p) => API(p, { method: 'DELETE' })

export default { get, post, put, del }
