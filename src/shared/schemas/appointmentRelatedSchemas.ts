import Joi from 'joi';

const name = Joi.string().min(3).max(50).required().messages({
  'string.base': 'El nombre debe ser una cadena de texto',
  'string.empty': 'El nombre es un campo obligatorio',
  'string.min': 'El nombre debe tener al menos 3 caracteres',
  'string.max': 'El nombre no debe exceder los 50 caracteres'
});
const date = Joi.date().min('now').required().messages({
  'date.base': 'La fecha debe ser válida',
  'date.min': 'La fecha del turno no puede ser anterior a hoy',
  'any.required': 'La fecha del turno es obligatoria'
});

const beforeDate = Joi.date().messages({
  'date.base': 'La fecha debe ser válida'
});
const afterDate = Joi.date().messages({
  'date.base': 'La fecha debe ser válida'
});

const observation = Joi.string().max(50).required().messages({
  'string.base': 'La observación debe ser una cadena de texto',
  'string.max': 'La observación no debe exceder los 50 caracteres'
});

const appointmentsStatus = Joi.array().items(Joi.string());
const administratives = Joi.array().items(Joi.string());
const practices = Joi.array().items(Joi.string());
const patients = Joi.array().items(Joi.string());
const medics = Joi.array().items(Joi.string());

const appointmentStatus = Joi.string();
const typeAppointmentStatus = Joi.string();
const appointment = Joi.string();
const patient = Joi.string();
const medic = Joi.string();

export const appointmentSchema = Joi.object({
  date,
  appointmentStatus,
  patient,
  medic,
  administratives,
  practices
});

export const appointmentFilters = Joi.object({
  beforeDate,
  afterDate
});

export const appointmentStatusSchema = Joi.object({
  date,
  observation,
  typeAppointmentStatus,
  appointment
});

export const medicalInsuranceSchema = Joi.object({
  name,
  practices,
  patients
});

export const medicalSpecialtySchema = Joi.object({
  name,
  practices,
  medics
});

export const typeAppointmentStatusSchema = Joi.object({
  name,
  appointmentsStatus
});
