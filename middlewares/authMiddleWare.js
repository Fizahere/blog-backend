import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied, token missing!' });
    }

    const token = authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Access denied, token missing!' });
    }

    try {
        const decoded = jwt.verify(token, "aurora"); 
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token', error: error.message });
    }
};
