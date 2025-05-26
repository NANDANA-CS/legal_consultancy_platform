// import { auth } from 'express-oauth2-jwt-bearer';

// const verifyAuth0Token = auth({
//   audience: process.env.AUTH0_AUDIENCE,
//   issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
//   tokenSigningAlg: 'RS256',
// });

// // Custom middleware to attach decoded payload to req.auth0User
// const attachAuth0User = (req, res, next) => {
//   if (req.auth && req.auth.payload) {
//     console.log('Token decoded successfully:', JSON.stringify(req.auth.payload, null, 2));
//     req.auth0User = req.auth.payload;
//     next();
//   } else {
//     console.error('No decoded payload found in req.auth');
//     res.status(401).json({ message: 'Invalid token: No payload found' });
//   }
// };

// export default [verifyAuth0Token, attachAuth0User];