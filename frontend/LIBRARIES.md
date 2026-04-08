# Frontend Libraries

This file documents the direct libraries used by the React frontend so you can explain the stack clearly in interviews.

## Runtime Dependencies

| Library | Why it is used |
| --- | --- |
| `react` | Core UI library for building components and handling state. |
| `react-dom` | Renders the React app into the browser DOM. |
| `react-router-dom` | Client-side routing between pages like Home, Post Detail, Login, and Profile. |
| `react-redux` | Connects React components to the Redux store. |
| `@reduxjs/toolkit` | Simplifies Redux setup, slices, and store configuration. |
| `axios` | Makes HTTP requests to the blog API with cleaner promise handling. |
| `framer-motion` | Adds page and component animations without manual CSS keyframe work. |
| `react-hot-toast` | Lightweight toast notifications for success and error feedback. |
| `react-helmet-async` | Manages document head metadata for SEO-friendly page titles and descriptions. |
| `react-quill` | Rich text editor used for creating and editing blog posts. |
| `react-markdown` | Renders markdown content when needed in the editor or article flow. |
| `dompurify` | Sanitizes HTML before rendering it to reduce XSS risk. |
| `@auth0/auth0-react` | Handles Auth0 login and authentication state in the frontend. |

## Build and Tooling Dependencies

| Library | Why it is used |
| --- | --- |
| `vite` | Fast dev server and production build tool. |
| `@vitejs/plugin-react` | Enables React support and fast refresh in Vite. |
| `tailwindcss` | Utility-first CSS framework for the layout and component styling. |
| `postcss` | Processes Tailwind and other CSS transforms during the build. |
| `autoprefixer` | Adds vendor prefixes for cross-browser CSS support. |

## Interview Summary

If you need a short explanation, you can describe the frontend as:

"A React + Vite single-page app styled with Tailwind CSS, animated with Framer Motion, routed with React Router, state-managed with Redux Toolkit, authenticated with Auth0 and cookie-based backend sessions, and protected against unsafe HTML with DOMPurify."