const express = require('express');
const router = express.Router();
const { Inscripcion, Estudiante, Asignatura, Persona } = require('../models');

// GET /inscripciones - Obtener todas las inscripciones con relaciones
router.get('/', async (req, res) => {
  try {
    const inscripciones = await Inscripcion.findAll({
      include: [ { model: Estudiante, include: [Persona] }, { model: Asignatura } ],
    });
    res.json(inscripciones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener inscripciones' });
  }
});

// GET /inscripciones/:id - Obtener inscripción específica con relaciones
router.get('/:id', async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findByPk(req.params.id, {
      include: [ { model: Estudiante, include: [Persona] }, { model: Asignatura } ],
    });

    if (!inscripcion) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }

    res.json(inscripcion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar inscripción' });
  }
});

// POST /inscripciones - Crear una nueva inscripción
router.post('/', async (req, res) => {
  const { estudianteMatricula, asignaturaClave, semestre, calificacion } = req.body;

  if (!estudianteMatricula || !asignaturaClave || semestre == null || calificacion == null) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: estudianteMatricula, asignaturaClave, semestre y calificacion' });
  }

  try {
    const estudiante = await Estudiante.findOne({ where: { matricula: estudianteMatricula } });
    const asignatura = await Asignatura.findOne({ where: { clave: asignaturaClave } });
    if (!estudiante || !asignatura) {
      return res.status(404).json({ error: 'Estudiante o Asignatura no encontrada' });
    }

    const inscripcionExistente = await Inscripcion.findOne({
      where: { estudianteMatricula: estudiante.matricula, asignaturaClave: asignatura.clave}
    });

    if (inscripcionExistente) {
      return res.status(409).json({ error: 'La inscripcion ya existe'});
    }

    const nuevaInscripcion = await Inscripcion.create({ estudianteMatricula, asignaturaClave, semestre, calificacion });
    res.status(201).json(nuevaInscripcion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear inscripción' });
  }
});

// PUT /inscripciones/:id - Reemplazar completamente una inscripción
router.put('/:id', async (req, res) => {
  const { estudianteMatricula, asignaturaClave, semestre, calificacion } = req.body;

  if (!estudianteMatricula || !asignaturaClave || semestre == null || calificacion == null) {
    return res.status(400).json({ error: 'estudianteMatricula, asignaturaClave, semestre y calificacion son obligatorios' });
  }

  try {
    const inscripcion = await Inscripcion.findByPk(req.params.id);
    if (!inscripcion) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }

    await inscripcion.update({ estudianteMatricula, asignaturaClave, semestre, calificacion });
    res.json(inscripcion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar inscripción' });
  }
});

// PATCH /inscripciones/:id - Actualizar parcialmente una inscripción
router.patch('/:id', async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findByPk(req.params.id);

    if (!inscripcion) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }

    await inscripcion.update(req.body);
    res.json(inscripcion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar inscripción' });
  }
});

// DELETE /inscripciones/:id - Eliminar inscripción por ID
router.delete('/:id', async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findByPk(req.params.id);

    if (!inscripcion) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }

    await inscripcion.destroy();
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar inscripción' });
  }
});

module.exports = router;
