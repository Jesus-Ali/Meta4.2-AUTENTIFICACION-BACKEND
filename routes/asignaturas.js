const express = require('express');
const router = express.Router();
const { Asignatura, Estudiante, Docente } = require('../models');

// GET /asignaturas - Obtener todas las asignaturas con estudiantes y docentes
router.get('/', async (req, res) => {
  try {
    const asignaturas = await Asignatura.findAll({
      include: [Estudiante, Docente]
    });
    res.json(asignaturas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener asignaturas' });
  }
});

// GET /asignaturas/:clave - Obtener una asignatura por clave
router.get('/:clave', async (req, res) => {
  try {
    const asignatura = await Asignatura.findOne({
      where: { clave: req.params.clave },
      include: [Estudiante, Docente]
    });

    if (!asignatura) {
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }

    res.json(asignatura);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar asignatura' });
  }
});

// POST /asignaturas - Crear una nueva asignatura
router.post('/', async (req, res) => {
  const { clave, nombre, creditos } = req.body;

  if (!clave || !nombre || !creditos) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const existente = await Asignatura.findOne({ where: { clave } });
    if (existente) {
      return res.status(409).json({ error: 'Ya existe una asignatura con esa clave' });
    }

    const nueva = await Asignatura.create({ clave, nombre, creditos });
    res.status(201).json(nueva);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear asignatura' });
  }
});

// PATCH /asignaturas/:clave - Actualizar parcialmente una asignatura
router.patch('/:clave', async (req, res) => {
  try {
    const asignatura = await Asignatura.findOne({ where: { clave: req.params.clave } });

    if (!asignatura) {
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }

    await asignatura.update(req.body);
    res.json(asignatura);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar asignatura' });
  }
});

// DELETE /asignaturas/:clave - Eliminar una asignatura
router.delete('/:clave', async (req, res) => {
  try {
    const asignatura = await Asignatura.findOne({ where: { clave: req.params.clave } });

    if (!asignatura) {
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }

    await asignatura.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar asignatura' });
  }
});

module.exports = router;
