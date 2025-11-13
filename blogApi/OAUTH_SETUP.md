OAuth (Google & GitHub) integration
===================================

This document describes how the OAuth flows are implemented and how to configure them locally and in production.

What I added
- `config/passport.js` — passport strategies for GitHub and Google. Strategies find or create a `User` and return it to the app.
- `routes/authRoutes.js` — public routes:
  - `GET /api/auth/github` — redirect to GitHub for auth
  - `GET /api/auth/github/callback` — GitHub callback; on success issues JWT cookie and JSON response
  - `GET /api/auth/google` — redirect to Google for auth
  - `GET /api/auth/google/callback` — Google callback; on success issues JWT cookie and JSON response
- `server.js` — passport initialized and auth routes mounted.
- `models/userSchema.js` — added `googleId` and `githubId`; password is now optional when using OAuth.

Environment variables (required)
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` — GitHub OAuth app credentials
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — Google OAuth credentials
- `BACKEND_URL` — your backend base URL (e.g. `https://api.example.com` or `http://localhost:5000`). Used to build callback URLs.
- `FRONTEND_URL` — frontend base URL (e.g. `http://localhost:5173`). Used for failure redirects.

Install required packages
Run from `blogApi` folder:

```
npm install passport passport-google-oauth20 passport-github2
```

How the flow works (end-to-end)
1. User clicks a button on frontend that navigates to one of the auth routes:
   - `/api/auth/github` or `/api/auth/google`
2. The route triggers Passport to redirect the user to the provider's login/consent page.
3. After the user authenticates and grants consent, the provider redirects the browser back to the callback URL:
   - `/api/auth/github/callback` or `/api/auth/google/callback`
4. Passport receives the callback, invokes the strategy verify function which:
   - Extracts profile information (provider id, email, username, avatar)
   - Finds an existing user by provider id or email
   - If not found, creates a new user record and sets `githubId` or `googleId`
5. On success, the callback handler issues your app's JWT via `sendtoken` (it sets a cookie named `Token`) and returns a JSON response. The frontend will now be authenticated using the same cookie-based flow as email/password login.

Frontend integration
- When you call the backend auth route directly (anchor link), the provider handles redirects. After successful login the server issues the cookie and responds. You can redirect the user from server to frontend (the current implementation sends the cookie and JSON response; the browser will receive the cookie).
- For single-page redirect flows, a common pattern is: after callback, redirect to the frontend with a short path (e.g. `FRONTEND_URL + '/auth/success'`) where the SPA can read the user status and redirect to home.

Security notes
- Ensure `BACKEND_URL` and callback URLs are registered in your OAuth app settings on GitHub and Google. For local dev, use `http://localhost:5000` and set callback to `http://localhost:5000/api/auth/github/callback` and similarly for Google.
- Use HTTPS in production and set `process.env.NODE_ENV = 'production'` so cookies are set as `secure`.
- Consider enabling state parameter for OAuth for extra CSRF protection (Passport handles this for some strategies if configured).

Troubleshooting
- If the login fails with provider errors, verify the callback URL in the provider app settings.
- Ensure the backend process has environment variables available (see `OAUTH` env vars above).
- If the cookie is not persisted in the browser, check CORS and `credentials` configuration. In `server.js` we use `app.use(cors({ origin: true, credentials: true }));` — make sure frontend requests use `fetch`/axios with `credentials: 'include'`.

Next steps / optional improvements
- Add UI buttons/links in frontend that open `/api/auth/github` and `/api/auth/google` in the same tab.
- Add `state` handling and CSRF protection in the OAuth flow.
- Redirect to a dedicated frontend callback route after auth where the SPA can read the user's profile.
- Add tests for OAuth user creation and login flow.
