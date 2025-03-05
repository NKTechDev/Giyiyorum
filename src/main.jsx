import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Auth0Provider } from '@auth0/auth0-react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Auth0Provider
  domain="dev-ckgf7b6ej41xdysy.us.auth0.com"
  clientId="Rwc07v6TT0nOElbNFPPsglSgJ2Qz1WxT"
  authorizationParams={{
    redirect_uri: window.location.origin,
    scope: 'openid profile email',  // Ensure profile and email scopes are included
  }}
  cacheLocation="localstorage"  // This enables persistence across page reloads
  useRefreshTokens={true}  // This enables token refresh functionality
>
  <App />
</Auth0Provider>

  </StrictMode>,
);
