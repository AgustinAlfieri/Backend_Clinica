import Joi from 'joi';

const name = Joi.string().min(3).max(50).required().messages({
  'string.base': 'El nombre debe ser una cadena de texto',
  'string.empty': 'El nombre es un campo obligatorio',
  'string.min': 'El nombre debe tener al menos 3 caracteres',
  'string.max': 'El nombre no debe exceder los 50 caracteres'
});

const appointmentStatus = Joi.array().items(Joi.string());

export const typeAppointmentStatusSchema = Joi.object({
  name,
  appointmentStatus
});
