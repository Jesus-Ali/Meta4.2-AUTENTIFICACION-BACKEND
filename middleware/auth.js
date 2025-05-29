const jwt = require('jsonwebtoken');

function asegurarAutenticacion(req, res, next) {
  const token = req.cookies?.auth_token; // Optional chaining for safety
  
  if (!token) {
    return res.status(401).json({ error: "Token de autenticación no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Attach user to request for downstream middleware
    next(); // Proceed to the route handler
  } catch (err) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}

function verifyJWT (req, res, next) {
  // Skip for auth routes
  if (req.path.startsWith('/auth')) return next();

  // Check session first
  if (req.isAuthenticated()) return next();

  // Fallback to JWT
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function verifyCSRF (req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  
  const xsrfCookie = req.cookies['XSRF-TOKEN'];
  const xsrfHeader = req.headers['x-xsrf-token'];
  
  if (!xsrfCookie || !xsrfHeader || xsrfCookie !== xsrfHeader) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  next();
}

module.exports = {
  asegurarAutenticacion,
  verifyCSRF,
  verifyJWT
};

