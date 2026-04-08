# Frontend

React + Vite + Tailwind CSS blog UI with Framer Motion, auth, markdown/editor support, and Redux state.

Quick start on Windows:

```cmd
cd /d f:\Ddrive\Webdevlopment\fullstackProjects\blogApp\frontend
npm install
npm run dev
```

Environment variables:
- `VITE_API_URL` - backend API base URL, defaults to `http://localhost:5000/api`
- `VITE_AUTH0_DOMAIN` - Auth0 tenant domain
- `VITE_AUTH0_CLIENT_ID` - Auth0 client ID
- `VITE_FRONTEND_URL` or `VITE_SITE_URL` - share URL used on post pages

Notes:
- API calls send credentials so the JWT cookie flow continues to work.
- The layout uses a calmer editorial style: wider whitespace, softer surfaces, and narrower reading widths.
- Direct frontend libraries are documented in [LIBRARIES.md](LIBRARIES.md).
