import appointmentRouter from "../appointment/appointment.router.js";
import { administrativeRouter } from "../user/userTypes/administrative/administrative.routes.js";
import { medicalInsuranceRouter } from "../medicalInsurance/medicalInsurance.routes.js";
import { medicalSpecialtyRouter } from "../medicalSpecialty/medicalSpecialty.routes.js";
import { patientRouter } from "../user/userTypes/patient/patient.routes.js";
import { practiceRouter } from "../practice/practice.routes.js";
import { routerMedic } from "../user/userTypes/medic/medic.routes.js";
import { typeAppointmentStatusRouter } from "../typeAppointmentStatus/typeAppointmentStatus.routes.js";
import { appointmentStatusRouter } from "../appointmentStatus/appointmentStatus.routes.js"; // Import the appointmentStatus router
import { Application } from "express";
import { authRouter } from "./auth/auth.routes.js";

export default (app: Application) => {
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
}