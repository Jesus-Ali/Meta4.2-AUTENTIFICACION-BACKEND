require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');
const { sequelize } = require('./models');
const app = express();

// SSL Configuration
const sslOptions = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

// Database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida');
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error);
  }
})();

app.use(cookieParser());

// CORS configuration - updated for HTTPS
app.use(cors({
  origin: 'https://localhost:3000', // Changed to HTTPS
  credentials: true,
  exposedHeaders: ['X-XSRF-TOKEN']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);

// Session configuration - updated for HTTPS
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key_keep_it_secure',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // Always true for HTTPS
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Local Strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'contraseña'
  },
  async (email, contraseña, done) => {
    try {
      const user = await sequelize.models.Usuarios.findOne({ where: { email } });
      
      if (!user) {
        return done(null, false, { message: 'Correo electrónico no encontrado.' });
      }
      
      const passwordMatch = await bcrypt.compare(contraseña, user.contraseña);
      
      if (!passwordMatch) {
        return done(null, false, { message: 'Contraseña incorrecta.' });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Google Strategy - updated with proper error handling
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  passReqToCallback: true
},
async (req, accessToken, refreshToken, profile, done) => {
  try {
    let user = await sequelize.models.Usuarios.findOne({ 
      where: { googleId: profile.id } 
    });

    if (!user) {
      user = await sequelize.models.Usuarios.create({
        email: profile.emails[0].value,
        googleId: profile.id,
        nombre: profile.displayName,
        verificado: true
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Serialization
passport.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    email: user.email,
    googleId: user.googleId
  });
});

passport.deserializeUser(async (obj, done) => {
  try {
    const user = await sequelize.models.Usuarios.findByPk(obj.id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Routes
app.use('/', require('./routes'));

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

// Start Server
const PORT = process.env.PORT || 3000;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});