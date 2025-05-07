const models = require('./models');
const Persona = models.Persona;
const sequelize = models.sequelize;
async function test() {

try {
console.log('\n=== CREATE TEST ===');
const newPersona = await Persona.create({
nombre: 'Juan Pérez',
email: 'juan@example.com'
});
console.log('New Persona created:', newPersona.toJSON());

// READ - Find all Personas
console.log('\n=== READ TEST (All) ===');
const allPersonas = await Persona.findAll();
console.log('All Personas:', JSON.stringify(allPersonas, null, 2));

// READ - Find one Persona by ID
console.log('\n=== READ TEST (Single) ===');
const foundPersona = await Persona.findByPk(newPersona.id);
console.log('Found Persona:', foundPersona.toJSON());

// UPDATE - Modify a Persona
console.log('\n=== UPDATE TEST ===');
const updatedPersona = await foundPersona.update({
nombre: 'Juan Carlos Pérez',
email: 'juan.carlos@example.com'
});
console.log('Updated Persona:', updatedPersona.toJSON());
const estudiante = await models.Estudiante.create({
matricula: 1234,
personaId: newPersona.id
});
estudiante.setPersona(foundPersona);

// // DELETE - Remove a Persona
// console.log('\n=== DELETE TEST ===');
// await updatedPersona.destroy();
// console.log('Persona deleted');

// // Verify deletion
// const deletedPersona = await Persona.findByPk(newPersona.id);
// console.log('Verify deletion:', deletedPersona ? 'Still exists' : 'Not found (correct)');

} catch (error) {
console.error('Error during CRUD tests:', error);
} finally {
// Close connection
await sequelize.close();
console.log('\nConnection closed');
}

}

test();