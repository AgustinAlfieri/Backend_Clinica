import { PatientRepository } from "./patient.repository.js";
import { Patient } from "./patient.js";
const repository = new PatientRepository();
function sanitizePatientInput(req, res, next) {
    req.body.sanitizedInput = {
        PatientClass: req.body.patientClass,
        _name: req.body._name,
        _address: req.body._address,
        _age: req.body._age,
        _medicalInsurance: req.body._medicalInsurance,
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
async function findAll(req, res) {
    res.json({ data: await repository.findAll() });
    return;
}
function findOne(req, res) {
    const id = req.params.id;
    const patient = repository.findOne({ id });
    if (!patient) {
        res.status(404).send({ message: 'Paciente no encontrado' });
        return;
    }
    res.json({ data: patient });
}
function add(req, res) {
    const input = req.body.sanitizedInput;
    const patientInput = new Patient(input._name, input._address, input._age, input._medicalInsurance);
    const patient = repository.add(patientInput);
    res.status(201).send({ message: 'Paciente creado correctamente' });
    return;
}
function update(req, res) {
    req.body.sanitizedInput.id = req.params.id;
    const _patient = repository.update(req.body.sanitizedInput);
    if (!_patient) {
        res.status(404).send({ message: 'Paciente no encontrado' });
        return;
    }
    res.status(200).send({ message: 'Paciente modificado correctamente' });
    return;
}
function remove(req, res) {
    const id = req.params.id;
    const _patient = repository.remove({ id });
    if (!_patient) {
        res.status(404).send({ message: 'Paciente no encontrado' });
        return;
    }
    res.status(200).send({ message: 'Paciente eliminado correctamente' });
    return;
}
export { sanitizePatientInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=patient.controller.js.map