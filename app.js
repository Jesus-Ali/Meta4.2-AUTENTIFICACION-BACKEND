require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
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

// CORS configuration - updated for HTTPS
app.use(cors({
  origin: 'https://localhost:3000', // Changed to HTTPS
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy for secure cookies in production
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
    callbackURL: "https://localhost:3000/auth/google/callback",
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists by googleId
      let user = await sequelize.models.Usuarios.findOne({ 
        where: { googleId: profile.id } 
      });

      if (!user) {
        // Check if email exists (for users who might have signed up locally first)
        user = await sequelize.models.Usuarios.findOne({
          where: { email: profile.emails[0].value }
        });

        if (user) {
          // Update existing user with googleId
          user.googleId = profile.id;
          await user.save();
        } else {
          // Create new user
          user = await sequelize.models.Usuarios.create({
            email: profile.emails[0].value,
            googleId: profile.id,
            verificado: true
          });
        }
      }

      return done(null, user);
    } catch (err) {
      console.error('Google auth error:', err);
      return done(err);
    }
  }
));

// Serialization/Deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await sequelize.models.Usuarios.findByPk(id, {
      attributes: ['id', 'email', 'googleId']
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Routes
app.use('/', require('./routes'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '¡Algo salió mal!' });
});

// Start HTTPS server
const PORT = process.env.PORT || 3000;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});