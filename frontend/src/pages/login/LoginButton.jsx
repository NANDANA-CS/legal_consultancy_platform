import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';

const LoginButton = () => {
  const { loginWithPopup } = useAuth0();

  return (
    <button
      onClick={() =>
        loginWithPopup({
          authorizationParams: {
            connection: 'google-oauth2',
          },
        })
      }
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors"
    >
      Log In
    </button>
  )
}

export default LoginButton