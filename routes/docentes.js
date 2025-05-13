const express = require('express');
const router = express.Router();
const { Docente, Persona, CategoriaEmpleado } = require('../models');

// GET /docentes - Obtener todos los docentes con relaciones
router.get('/', async (req, res) => {
  try {
    const docentes = await Docente.findAll({
      include: [Persona, CategoriaEmpleado]
    });
    res.json(docentes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener docentes' });
  }
});

// GET /docentes/:id - Obtener un docente por ID
router.get('/:id', async (req, res) => {
  try {
    const docente = await Docente.findByPk(req.params.id);

    if (!docente) {
      return res.status(404).json({ error: 'Docente no encontrado' });
    }

    res.json(docente);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar docente' });
  }
});

// POST /docentes - Crear un nuevo docente
router.post('/', async (req, res) => {
  const { numEmpleado, personaId, categoriaEmpleadoClave } = req.body;

  if (!numEmpleado || !personaId || !categoriaEmpleadoClave) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const existente = await Docente.findOne({ where: { numEmpleado } });
    if (existente) {
      return res.status(409).json({ error: 'Ya existe un docente con ese número de empleado' });
    }

    const nuevo = await Docente.create({ numEmpleado, personaId, categoriaEmpleadoClave });
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear docente' });
  }
});

// PUT /docentes/:id - Reemplazar completamente un docente
router.put('/:id', async (req, res) => {
  const { numEmpleado, personaId, categoriaEmpleadoClave } = req.body;

  if ( !numEmpleado || !personaId || categoriaEmpleadoClave) {
    return res.status(400).json({ error: 'Faltan campos obligatorios'});
  }

  try {
    const docente = await Docente.findByPk(req.params.id);
    if(!docente){
      return res.status(404).json({ error: 'Docente no encontrado'});
    }

    await docente.update({ numEmpleado, personaId, categoriaEmpleadoClave });
    res.json(docente);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar docente'});
  }
});

// PATCH /docentes/:id - Actualizar parcialmente un docente
router.patch('/:id', async (req, res) => {
  try {
    const docente = await Docente.findByPk(req.params.id);

    if (!docente) {
      return res.status(404).json({ error: 'Docente no encontrado' });
    }

    await docente.update(req.body);
    res.json(docente);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar docente' });
  }
});

// DELETE /docentes/:id - Eliminar un docente
router.delete('/:id', async (req, res) => {
  try {
    const docente = await Docente.findByPk(req.params.id);

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
