const express = require('express');
const router = express.Router();
const { Docente, Persona, CategoriaEmpleado, Asignatura } = require('../models');

// GET /docentes - Obtener todos los docentes con relaciones
router.get('/', async (req, res) => {
  try {
    const docentes = await Docente.findAll({
      include: [Persona, CategoriaEmpleado, Asignatura]
    });
    res.json(docentes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener docentes' });
  }
});

// GET /docentes/:numEmpleado - Obtener un docente por número de empleado
router.get('/:numEmpleado', async (req, res) => {
  try {
    const docente = await Docente.findOne({
      where: { numEmpleado: req.params.numEmpleado },
      include: [Persona, CategoriaEmpleado, Asignatura]
    });

    if (!docente) {
      return res.status(404).json({ error: 'Docente no encontrado' });
    }

    res.json(docente);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar docente' });
  }
});

// POST /docentes - Crear un nuevo docente
router.post('/', async (req, res) => {
  const { numEmpleado, personaId, categoriaEmpleadoId } = req.body;

  if (!numEmpleado || !personaId || !categoriaEmpleadoId) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const existente = await Docente.findOne({ where: { numEmpleado } });
    if (existente) {
      return res.status(409).json({ error: 'Ya existe un docente con ese número de empleado' });
    }

    const nuevo = await Docente.create({ numEmpleado, personaId, categoriaEmpleadoId });
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear docente' });
  }
});

// PATCH /docentes/:numEmpleado - Actualizar parcialmente un docente
router.patch('/:numEmpleado', async (req, res) => {
  try {
    const docente = await Docente.findOne({ where: { numEmpleado: req.params.numEmpleado } });

    if (!docente) {
      return res.status(404).json({ error: 'Docente no encontrado' });
    }

    await docente.update(req.body);
    res.json(docente);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar docente' });
  }
});

// DELETE /docentes/:numEmpleado - Eliminar un docente
router.delete('/:numEmpleado', async (req, res) => {
  try {
    const docente = await Docente.findOne({ where: { numEmpleado: req.params.numEmpleado } });

    if (!docente) {
      return res.status(404).json({ error: 'Docente no encontrado' });
    }

    await docente.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar docente' });
  }
});

module.exports = router;
