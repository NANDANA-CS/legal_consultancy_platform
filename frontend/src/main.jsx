import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-dwidrngxdwz2oh0g.us.auth0.com"
      clientId="Wl1sPYl6VhfXMYSo3jFvldGRhtSV5Yh4"
      audience="https://dev-dwidrngxdwz2oh0g.us.auth0.com/api/v2/"
      scope="read:current_user openid profile email"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
      cacheLocation='localstorage'
    >

      <App />
    </Auth0Provider>
  </StrictMode>


)
