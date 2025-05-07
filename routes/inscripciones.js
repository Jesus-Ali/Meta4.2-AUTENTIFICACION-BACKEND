const express = require('express');
const router = express.Router();
const { Inscripcion, Estudiante, Asignatura } = require('../models');

// GET /inscripciones - Obtener todas las inscripciones con relaciones
router.get('/', async (req, res) => {
  try {
    const inscripciones = await Inscripcion.findAll({
      include: [Estudiante, Asignatura],
    });
    res.json(inscripciones);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener inscripciones' });
  }
});

// GET /inscripciones/:estudianteId/:asignaturaId - Obtener inscripción específica
router.get('/:estudianteId/:asignaturaId', async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findOne({
      where: {
        estudianteId: req.params.estudianteId,
        asignaturaId: req.params.asignaturaId,
      },
      include: [Estudiante, Asignatura],
    });

    if (!inscripcion) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }

    res.json(inscripcion);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar inscripción' });
  }
});

// POST /inscripciones - Crear una nueva inscripción
router.post('/', async (req, res) => {
  const { estudianteId, asignaturaId, semestre, calificacion } = req.body;

  if (!estudianteId || !asignaturaId) {
    return res.status(400).json({ error: 'Faltan estudianteId o asignaturaId' });
  }

  try {
    const [inscripcion, creada] = await Inscripcion.findOrCreate({
      where: { estudianteId, asignaturaId },
      defaults: { semestre, calificacion },
    });

    if (!creada) {
      return res.status(409).json({ error: 'La inscripción ya existe' });
    }

    res.status(201).json(inscripcion);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear inscripción' });
  }
});

// PATCH /inscripciones/:estudianteId/:asignaturaId - Actualizar inscripción
router.patch('/:estudianteId/:asignaturaId', async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findOne({
      where: {
        estudianteId: req.params.estudianteId,
        asignaturaId: req.params.asignaturaId,
      },
    });

    if (!inscripcion) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }

    await inscripcion.update(req.body);
    res.json(inscripcion);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar inscripción' });
  }
});

// DELETE /inscripciones/:estudianteId/:asignaturaId - Eliminar inscripción
router.delete('/:estudianteId/:asignaturaId', async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findOne({
      where: {
        estudianteId: req.params.estudianteId,
        asignaturaId: req.params.asignaturaId,
      },
    });

    if (!inscripcion) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }

    await inscripcion.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar inscripción' });
  }
});

module.exports = router;
