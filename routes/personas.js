const express = require('express');
const router = express.Router();
const { Persona } = require('../models');

// GET /personas - Obtener todas las personas
router.get('/', async (req, res) => {
  try {
    const personas = await Persona.findAll();
    res.json(personas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener personas' });
  }
});

// GET /personas/:id - Obtener persona por ID
router.get('/:id', async (req, res) => {
  try {
    const persona = await Persona.findByPk(req.params.id);
    if (persona) {
      res.json(persona);
    } else {
      res.status(404).json({ error: 'Persona no encontrada' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar persona' });
  }
});

// POST /personas - Crear nueva persona
router.post('/', async (req, res) => {
  const { nombre, email } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({ error: 'Nombre y email son obligatorios' });
  }

  try {
    const nuevaPersona = await Persona.create({ nombre, email });
    res.status(201).json(nuevaPersona);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear persona' });
  }
});

// PUT /personas/:id - Reemplazar completamente
router.put('/:id', async (req, res) => {
  const { nombre, email } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({ error: 'Nombre y email son obligatorios' });
  }

  try {
    const persona = await Persona.findByPk(req.params.id);
    if (!persona) return res.status(404).json({ error: 'Persona no encontrada' });

    await persona.update({ nombre, email });
    res.json(persona);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar persona' });
  }
});

// PATCH /personas/:id - Actualizar parcialmente
router.patch('/:id', async (req, res) => {
  try {
    const persona = await Persona.findByPk(req.params.id);
    if (!persona) return res.status(404).json({ error: 'Persona no encontrada' });

    await persona.update(req.body);
    res.json(persona);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar parcialmente' });
  }
});

// DELETE /personas/:id - Eliminar persona
router.delete('/:id', async (req, res) => {
  try {
    const persona = await Persona.findByPk(req.params.id);
    if (!persona) return res.status(404).json({ error: 'Persona no encontrada' });

    await persona.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar persona' });
  }
});

module.exports = router;
