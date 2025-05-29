import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        req.id = decoded.id

        next()
    } catch (err) {
        console.error('Token verification error:', err.message)
        res.status(401).json({ message: 'Invalid or expired token' })
    }
}

export default auth