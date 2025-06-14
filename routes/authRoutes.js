const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Usuarios } = require('../models');
const { verifyCSRF } = require('../middleware/auth');

const generateTokens = (user) => {
  const authToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      googleId: user.googleId
    },
    process.env.SECRET_KEY,
    { expiresIn: '1h' }
  );

  const xsrfToken = crypto.randomBytes(32).toString('hex');
  
  return { authToken, xsrfToken };
};

// Login
router.post('/login', passport.authenticate('local'), (req, res) => {

  const { authToken, xsrfToken } = generateTokens(req.user);
  
  res.cookie('auth_token', authToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 3600000,
    // domain: 'localhost'
  });

  res.cookie("XSRF-TOKEN", xsrfToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      // domain: "localhost",
      path: "/",
      maxAge: 3600000, // 15 minutos
  });

  res.json({ 
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email
    }
  });
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.clearCookie('connect.sid');
  res.clearCookie('XSRF-TOKEN');
  req.session?.destroy?.(() => {
    res.status(204).json({ message: "Sesión cerrada" });
  });
});


// Registration
router.post('/registro', async (req, res) => {
  const { email, contraseña } = req.body;

  if (!email || !contraseña) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const usuario = await Usuarios.create({
      email,
      contraseña: hashedPassword
    });

    req.login(usuario, (err) => {
      if (err) throw err;

      const { authToken, xsrfToken } = generateTokens(usuario);

      res.cookie('auth_token', authToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 3600000
      });

      res.status(201).json({
        id: usuario.id,
        email: usuario.email,
        xsrfToken
      });
    });
  } catch (err) {
    console.error('Error en el registro:', err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Check authentication status
router.get('/sesion', (req, res) => {
  const token = req.cookies.auth_token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      return res.json({ autenticado: true, user: decoded });
    } catch (err) {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }
  }

  // Aquí responde cuando NO hay token:
  return res.status(401).json({ autenticado: false, error: "No autenticado" });
});


// Google Authentication Routes
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  prompt: 'select_account' // Forces account selection
}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/failed' }),
  (req, res) => {
    const { authToken, xsrfToken } = generateTokens(req.user);
  
  res.cookie('auth_token', authToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 3600000,
    // domain: 'localhost'
  });

  res.cookie("XSRF-TOKEN", xsrfToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      // domain: "localhost",
      path: "/",
      maxAge: 3600000, // 15 minutos
  });

    // Successful authentication
    res.redirect('http://localhost:5173/');
  }
);

// Failed authentication
router.get('/failed', (req, res) => {
  res.status(401).json({ error: 'Autenticación fallida' });
});

// Login page with both options
router.get('/login-page', (req, res) => {
  const error = req.query.error;
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Login</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
        .login-option { margin: 15px 0; text-align: center; }
        button { 
          padding: 10px 15px;
          background: #4285F4;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        .error { color: red; }
      </style>
    </head>
    <body>
      ${error ? `<div class="error">${error}</div>` : ''}
      <div class="login-option">
        <button onclick="window.location.href='/auth/google'">
          Continuar con Google
        </button>
      </div>
    </body>
    </html>
  `);
});

// CSRF Protected Route Example
router.get('/protected', verifyCSRF, (req, res) => {
  res.json({ message: 'Protected data' });
});

module.exports = router;