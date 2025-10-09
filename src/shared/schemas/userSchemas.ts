import Joi from 'joi';
import { Role } from '../enums/role.enum.js';

const roles = [Role.ADMINISTRATIVE, Role.MEDIC, Role.PATIENT];

const id = Joi.string().uuid();

const dni = Joi.string()
  .pattern(/^[0-9]{8}[A-Za-z]$/)
  .messages({
    'string.empty': 'El DNI es un campo obligatorio',
    'string.min': 'El DNI debe tener 8 números'
  });

const name = Joi.string().min(3).max(50).required().messages({
  'string.base': 'El nombre debe ser una cadena de texto',
  'string.empty': 'El nombre es un campo obligatorio',
  'string.min': 'El nombre debe tener al menos 3 caracteres',
  'string.max': 'El nombre no debe exceder los 50 caracteres'
});

const email = Joi.string()
  .trim()
  .email({ tlds: { allow: false } })
  .required()
  .messages({
    'string.email': 'El correo electrónico debe ser una dirección válida',
    'string.max': 'El correo electrónico no debe exceder los 100 caracteres'
  });

const password = Joi.string().min(6).max(100).messages({
  'string.min': 'La contraseña debe tener al menos 6 caracteres',
  'string.max': 'La contraseña no debe exceder los 100 caracteres',
  'string.base': 'La contraseña debe ser una cadena de texto'
});

const telephone = Joi.string().min(9).messages({
  'string.min': 'El teléfono debe tener al menos 9 dígitos'
});

const license = Joi.string().alphanum().min(5).max(20).messages({
  'string.min': 'La licencia debe tener al menos 5 caracteres',
  'string.max': 'La licencia no debe exceder los 20 caracteres'
});

const insuranceNumber = Joi.string().alphanum().min(5).max(20);

const medicalInsurance = Joi.string().uuid();

const medicalSpecialty = Joi.array().items(Joi.string());

const appointments = Joi.array().items(Joi.string());

export const patientSchema = Joi.object({
  dni,
  name,
  email,
  password,
  telephone,
  insuranceNumber,
  medicalInsurance,
  appointments
});

export const administrativeSchema = Joi.object({
  dni,
  name,
  email,
  password,
  telephone,
  appointments
});

export const medicSchema = Joi.object({
  dni,
  name,
  email,
  password,
  telephone,
  license,
  medicalSpecialty,
  appointments
});
