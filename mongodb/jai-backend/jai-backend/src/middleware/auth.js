import jwt from 'jsonwebtoken';

// IMPORTANT: the JWT payload uses each user's MongoDB _id, never their
// customerId/workerId. That's what keeps the auto-generated id private —
// a JWT's payload is just base64 (not encrypted), so anything put in it
// is effectively visible to whoever holds the token. Keeping customerId/
// workerId out of the token means it truly only exists in the database
// and in admin-only API responses.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id: <mongo _id>, role, name, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}
