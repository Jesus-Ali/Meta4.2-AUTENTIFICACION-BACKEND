const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { Usuarios } = require('../models');

// Login
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ 
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email
    }
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Error al cerrar sesión' });
    res.clearCookie('connect.sid'); // Clear session cookie
    res.json({ success: true });
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
    
    res.status(201).json({
      id: usuario.id,
      email: usuario.email
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Check authentication status
router.get('/sesion', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      autenticado: true,
      usuario: {
        id: req.user.id,
        email: req.user.email,
        googleId: req.user.googleId
      }
    });
  }
  res.json({ autenticado: false });
});

// Google Authentication Routes
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  prompt: 'select_account' // Forces account selection
}));

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/auth/failed',
    session: true
  }),
  (req, res) => {
    // Successful authentication
    res.redirect('https://localhost:3000/usuarios');
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

module.exports = router;