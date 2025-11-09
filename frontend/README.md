# Frontend (React + Tailwind + Framer Motion)

This frontend is a minimal, animated React app wired to your Express backend.

Quick start (Windows cmd):

```cmd
cd /d e:\Ddrive\Webdevlopment\fullstackProjects\blogApp\frontend
npm install
npm run dev
```

Environment variables:
- `VITE_API_URL` - Backend API base (defaults to `http://localhost:5000/api`)

Notes:
- The app uses fetch and sends credentials (cookies) to support your JWT cookie auth. Ensure your backend CORS allows credentials and origin.
- Pages: Home, Blog Detail, Create/Edit Blog, Login.
- Uses Framer Motion for animations and react-hot-toast for notifications.
