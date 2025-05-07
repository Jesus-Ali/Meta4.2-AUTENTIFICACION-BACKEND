const express = require('express');
const router = express.Router();
const { Estudiante, Persona } = require('../models');

// GET /estudiantes - Obtener todos los estudiantes
router.get('/', async (req, res) => {
  try {
    const estudiantes = await Estudiante.findAll({ include: Persona });
    res.json(estudiantes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estudiantes' });
  }
});

// GET /estudiantes/:id - Obtener un estudiante por ID
router.get('/:id', async (req, res) => {
  try {
    const estudiante = await Estudiante.findByPk(req.params.id, { include: Persona });
    if (estudiante) {
      res.json(estudiante);
    } else {
      res.status(404).json({ error: 'Estudiante no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar estudiante' });
  }
});

// POST /estudiantes - Crear un nuevo estudiante
router.post('/', async (req, res) => {
  const { matricula, personaId } = req.body;
  if (!matricula || !personaId) {
    return res.status(400).json({ error: 'Matrícula y personaId son obligatorios' });
  }

  try {
    const nuevoEstudiante = await Estudiante.create({ matricula, personaId });
    res.status(201).json(nuevoEstudiante);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear estudiante' });
  }
});

// PUT /estudiantes/:id - Reemplazar completamente un estudiante
router.put('/:id', async (req, res) => {
  const { matricula, personaId } = req.body;

  if (!matricula || !personaId) {
    return res.status(400).json({ error: 'Matrícula y personaId son obligatorios' });
  }

  try {
    const estudiante = await Estudiante.findByPk(req.params.id);
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    await estudiante.update({ matricula, personaId });
    res.json(estudiante);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar estudiante' });
  }
});

// PATCH /estudiantes/:id - Actualizar parcialmente un estudiante
router.patch('/:id', async (req, res) => {
  try {
    const estudiante = await Estudiante.findByPk(req.params.id);
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    await estudiante.update(req.body);
    res.json(estudiante);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar parcialmente' });
  }
});

// DELETE /estudiantes/:id - Eliminar un estudiante
router.delete('/:id', async (req, res) => {
  try {
    const estudiante = await Estudiante.findByPk(req.params.id);
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    await estudiante.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar estudiante' });
  }
});

module.exports = router;
