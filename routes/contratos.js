const express = require('express');
const router = express.Router();
const { Contrato, Docente, Asignatura } = require('../models');

// GET /contratos - Obtener todos los contratos con relaciones
router.get('/', async (req, res) => {
  try {
    const contratos = await Contrato.findAll({
      include: [Docente, Asignatura]
    });
    res.json(contratos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener contratos' });
  }
});

// POST /contratos - Crear un contrato entre docente y asignatura
// Espera en el body: { numEmpleado, clave }
router.post('/', async (req, res) => {
  const { numEmpleado, clave } = req.body;

  if (!numEmpleado || !clave) {
    return res.status(400).json({ error: 'numEmpleado y clave son obligatorios' });
  }

  try {
    const docente = await Docente.findOne({ where: { numEmpleado } });
    const asignatura = await Asignatura.findOne({ where: { clave } });

    if (!docente || !asignatura) {
      return res.status(404).json({ error: 'Docente o Asignatura no encontrados' });
    }

    const contratoExistente = await Contrato.findOne({
      where: { docenteId: docente.id, asignaturaId: asignatura.id }
    });

    if (contratoExistente) {
      return res.status(409).json({ error: 'El contrato ya existe' });
    }

    const nuevoContrato = await Contrato.create({
      docenteId: docente.id,
      asignaturaId: asignatura.id
    });

    res.status(201).json(nuevoContrato);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear contrato' });
  }
});

// DELETE /contratos - Eliminar un contrato
// Espera en el body: { numEmpleado, clave }
router.delete('/', async (req, res) => {
  const { numEmpleado, clave } = req.body;

  try {
    const docente = await Docente.findOne({ where: { numEmpleado } });
    const asignatura = await Asignatura.findOne({ where: { clave } });

    if (!docente || !asignatura) {
      return res.status(404).json({ error: 'Docente o Asignatura no encontrados' });
    }

    const contrato = await Contrato.findOne({
      where: {
        docenteId: docente.id,
        asignaturaId: asignatura.id
      }
    });

    if (!contrato) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }

    await contrato.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar contrato' });
  }
});

module.exports = router;
