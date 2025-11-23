import React from 'react'
import { createRoot } from 'react-dom/client'
// @ts-nocheck
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import App from './App'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'
import { Auth0Provider } from '@auth0/auth0-react';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <Auth0Provider
            domain={import.meta.env.VITE_AUTH0_DOMAIN}
           clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
           authorizationParams={{
           redirect_uri: window.location.origin
           }}
    >
      <App />
    </Auth0Provider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
)
