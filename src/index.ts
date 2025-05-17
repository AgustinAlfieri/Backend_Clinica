import 'reflect-metadata';
import express from 'express';
import { orm, syncSchema } from './shared/database/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { patientRouter } from './user/userTypes/patient/patient.routes.js';
import { routerMedic } from './user/userTypes/medic/medic.routes.js';
import { errorHandler } from './shared/middlewares/errorHandler.js';

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

app.use('/app/v1/patient', patientRouter);
app.use('/app/v1/medic', routerMedic);

await syncSchema(); // Never in production

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});


