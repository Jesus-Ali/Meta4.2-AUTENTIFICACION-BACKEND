const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes');

app.use(cors({
  origin: 'http://localhost:5173' // o el puerto de tu frontend
}));


// Middleware para parsear JSON
app.use(express.json());

// Usar todas las rutas definidas (incluye /, /estudiantes, y /personas)
app.use('/', routes);

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
