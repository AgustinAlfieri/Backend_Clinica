import { orm } from '../../../shared/database/orm.js';
import { NextFunction, Request, Response } from 'express';
import { Administrative } from './administrative.entity.js';
import { Appointment } from '../../../appointment/appointment.entity.js';

const em = orm.em;

