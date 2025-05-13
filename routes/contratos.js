const express = require('express');
const router = express.Router();
const { Contrato, Docente, Asignatura, Persona } = require('../models');

// GET /contratos - Obtener todos los contratos con relaciones
router.get('/', async (req, res) => {
  try {
    const contratos = await Contrato.findAll({
      // include: [Docente, Asignatura]
      include: [ { model: Docente, include: [Persona] },{ model: Asignatura } ],
    });
    res.json(contratos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener contratos' });
  }
});

// GET /contratos/:id - Obtener contrato especifico con ID
router.get('/:id', async (req, res) => {
  try {
    const contrato = await Contrato.findByPk(req.params.id, {
      include: [ { model: Docente, include: [Persona] },{ model: Asignatura } ],
    });

    if (!contrato){
      return res.status(404).json({error: 'Contrato no encontrado'});
    }

    res.json(contrato);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar contrato'});
  }
});

// POST /contratos - Crear un contrato entre docente y asignatura
router.post('/', async (req, res) => {
  const { docenteNumEmpleado, asignaturaClave } = req.body;

  if (!docenteNumEmpleado || !asignaturaClave) {
    return res.status(400).json({ error: 'numEmpleado y clave son obligatorios' });
  }

  try {
    const docente = await Docente.findOne({ where: { numEmpleado: docenteNumEmpleado } });
    const asignatura = await Asignatura.findOne({ where: { clave: asignaturaClave } });

    if (!docente || !asignatura) {
      return res.status(404).json({ error: 'Docente o Asignatura no encontrados' });
    }

    const contratoExistente = await Contrato.findOne({
      where: { docenteNumEmpleado: docente.numEmpleado, asignaturaClave: asignatura.clave }
    });

    if (contratoExistente) {
      return res.status(409).json({ error: 'El contrato ya existe' });
    }

    const nuevoContrato = await Contrato.create({ docenteNumEmpleado, asignaturaClave });

    res.status(201).json(nuevoContrato);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear contrato' });
  }
});

// PUT /contratos/:id - Reemplazar completamente un contrato
router.put('/:id', async (req, res) => {
  const {docenteNumEmpleado, asignaturaClave } = req.body;

  if ( !docenteNumEmpleado || !asignaturaClave) {
    return res.status(400).json({ error: 'Faltan campos obligatorios'});
  }

  try {
    const contrato = await Contrato.findByPk(req.params.id);
    if(!contrato) {
      return res.status(404).json({ error: 'Contrato no encontrado'});
    }

    await contrato.update({ docenteNumEmpleado, asignaturaClave});
    res.json(contrato);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar contrato'});
  }
});

// PATCH /contratos/:id - Actualizar parcialmente el contrato
router.patch('/:id', async (req, res) => {
  try{
    const contrato = await Contrato.findByPk(req.params.id);

    if(!contrato){
      return res.status(404).json({ error: 'Contrato no encontrado'});
    }

    await contrato.update(req.body);
    res.json(contrato);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar contrato'});
  }
});

// DELETE /contratos - Eliminar un contrato
// Espera en el body: { numEmpleado, clave }
router.delete('/:id', async (req, res) => {
  try {
    const contrato = await Contrato.findByPk(req.params.id);

    if (!contrato) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }

    await contrato.destroy();
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar contrato' });
  }
});

module.exports = router;
