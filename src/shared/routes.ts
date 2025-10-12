import appointmentRouter from '../appointment/appointment.router.js';
import { administrativeRouter } from '../user/userTypes/administrative/administrative.routes.js';
import { medicalInsuranceRouter } from '../medicalInsurance/medicalInsurance.routes.js';
import { medicalSpecialtyRouter } from '../medicalSpecialty/medicalSpecialty.routes.js';
import { patientRouter } from '../user/userTypes/patient/patient.routes.js';
import { practiceRouter } from '../practice/practice.routes.js';
import { routerMedic } from '../user/userTypes/medic/medic.routes.js';
import { typeAppointmentStatusRouter } from '../typeAppointmentStatus/typeAppointmentStatus.routes.js';
import { appointmentStatusRouter } from '../appointmentStatus/appointmentStatus.routes.js'; // Import the appointmentStatus router
import { Application } from 'express';
import { authRouter } from './auth/auth.routes.js';
import { Request, Response } from 'express';

const messages: any = {
  message: 'API Clinica Medivia',
  endpoints: {
    Administrativos: '/app/v1/administrative',
    Autenticación: '/app/v1/auth',
    'Especialidades Médicas': '/app/v1/medicalSpecialty',
    'Estados de turnos': '/app/v1/appointmentStatus',
    Medicos: '/app/v1/medic',
    'Obras Sociales': '/app/v1/medicalInsurance',
    Pacientes: '/app/v1/patient',
    Practicas: '/app/v1/practice',
    'Tipos de estados de turnos': '/app/v1/typeAppointmentStatus',
    Turnos: '/app/v1/appointment'
  },
  'Dentro de cada endpoint': {
    'Buscar todos': '/findAll',
    'Buscar uno': '/findOne/:id',
    Actualizar: '/update/:id',
    Crear: '/create',
    Eliminar: '/remove/:id'
  }
};

export default (app: Application) => {
  //Ruta para mostrar el contenido del JSON
  app.get('/', (req: Request, res: Response) => {
    res.json(messages);
  });

  app.use('/app/v1/appointment', appointmentRouter);
  app.use('/app/v1/patient', patientRouter);
  app.use('/app/v1/medic', routerMedic);
  app.use('/app/v1/medicalSpecialty', medicalSpecialtyRouter);
  app.use('/app/v1/typeAppointmentStatus', typeAppointmentStatusRouter);
  app.use('/app/v1/appointmentStatus', appointmentStatusRouter); // Add this line to include the appointmentStatus routes
  app.use('/app/v1/administrative', administrativeRouter);
  app.use('/app/v1/practice', practiceRouter);
  app.use('/app/v1/medicalInsurance', medicalInsuranceRouter);
  app.use('/app/v1/auth', authRouter);
};
