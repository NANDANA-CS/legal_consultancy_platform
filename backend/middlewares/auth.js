import pkg from "jsonwebtoken"

const { verify } = pkg
export default async function auth(req, res, next) {
    try {
        console.log("Auth middleware")
        const key = req.headers.authorization
        if (!key || !key.startsWith("Bearer ")) {
            console.log("no token")
            return res.status(403).json({ message: "Token missing" })
        }
        const token = key.split(" ")[1]
        const auth = await verify(token, process.env.JWT_KEY)
        req.user = auth.id
        next()
    } catch (err) {
        console.error("JWT Error:", err.message)
        return res.status(403).json({ message: "Unauthorized - Invalid token" })
    }
}




// // auth.js (Middleware to verify JWT tokens)
// import jwt from 'jsonwebtoken';

// // Middleware to check if a user is authenticated
// export default async function auth(req, res, next) {
//   try {
//     // Get the token from the Authorization header (format: Bearer <token>)
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'No token provided' });
//     }

//     // Extract the token (remove 'Bearer ' prefix)
//     const token = authHeader.split(' ')[1];

//     // Verify the token using the secret key
//     const decoded = await jwt.verify(token, process.env.JWT_KEY);

//     // Attach the user ID to the request object
//     req.user = decoded.id;
//     req.userData = decoded; // Store full decoded data (id, name, email, role)

//     // Proceed to the next middleware or route handler
//     next();
//   } catch (err) {
//     console.error('JWT Verification Error:', err.message);
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// }
