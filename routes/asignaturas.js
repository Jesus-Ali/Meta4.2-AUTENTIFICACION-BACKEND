const express = require('express');
const router = express.Router();
const { Asignatura, Estudiante, Docente } = require('../models');

// GET /asignaturas - Obtener todas las asignaturas con estudiantes y docentes
router.get('/', async (req, res) => {
  try {
    const asignaturas = await Asignatura.findAll();
    res.json(asignaturas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener asignaturas' });
  }
});

// GET /asignaturas/:id - Obtener una asignatura por ID
router.get('/:id', async (req, res) => {
  try {
    const asignatura = await Asignatura.findByPk(req.params.id);
    if(asignatura){
      res.json(asignatura);
    } else {
      res.status(404).json({ error: 'Asignatura no encontrada'})
    }
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

// PUT /asignaturas/:id - Reemplazar complatamente una asignatura
router.put('/:id', async (req, res) => {
  const { clave, nombre, creditos } = req.body;

  if(!clave || !nombre || !creditos) {
    return res.status(404).json({ error: 'clave, nombre y creditos son obligatorios'});
  }

  try {
    const asignatura = await Asignatura.findByPk(req.params.id);
    if(!asignatura) {
      return res.status(404).json({ error: 'Asignatura no encontrada'});
    }

    await asignatura.update({ clave, nombre, creditos});
    res.json(asignatura);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar asignatura'});
  }
});

// PATCH /asignaturas/:id - Actualizar parcialmente una asignatura
router.patch('/:id', async (req, res) => {
  try {
    const asignatura = await Asignatura.findByPk(req.params.id);

    if (!asignatura) {
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }

    await asignatura.update(req.body);
    res.json(asignatura);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar asignatura' });
  }
});

// DELETE /asignaturas/:id - Eliminar una asignatura
router.delete('/:id', async (req, res) => {
  try {
    const asignatura = await Asignatura.findByPk(req.params.id);

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
