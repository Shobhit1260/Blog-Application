const API = (path, opts = {}) => {
  // Use Vite env variable when available, otherwise default to local backend on port 5000
  const apiRoot = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
    ? import.meta.env.VITE_API_URL
    : 'http://localhost:5000'
  const base = apiRoot.replace(/\/+$/, '') + '/api'
  // const base ='https://blogapi.shobhitsri.me/api'
  const url = base + path
  const options = Object.assign({
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  }, opts)
  // If body is FormData (file upload), don't set Content-Type and don't stringify
  if (options.body instanceof FormData) {
    // remove content-type header so browser sets proper multipart boundary
    if (options.headers && options.headers['Content-Type']) delete options.headers['Content-Type']
  } else if (options.body && typeof options.body !== 'string') {
    options.body = JSON.stringify(options.body)
  }

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
