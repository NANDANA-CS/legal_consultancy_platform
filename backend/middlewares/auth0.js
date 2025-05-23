import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';

const jwksClientInstance = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
});

const getKey = (header, callback) => {
  console.log('Fetching JWKS key for kid:', header.kid);
  jwksClientInstance.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error('JWKS key retrieval error:', err.message, err.stack);
      callback(err);
    } else {
      const signingKey = key.getPublicKey();
      console.log('JWKS key retrieved successfully');
      callback(null, signingKey);
    }
  });
};

export const verifyAuth0Token = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Received token in middleware:', token ? 'Token present' : 'No token');

  if (!token) {
    console.error('No token provided in request');
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(
    token,
    getKey,
    {
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      algorithms: ['RS256'],
    },
    (err, decoded) => {
      if (err) {
        console.error('Token verification error:', {
          message: err.message,
          stack: err.stack,
        });
        return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
      }
      console.log('Token decoded successfully:', decoded);
      req.auth0User = decoded;
      next();
    }
  );
};