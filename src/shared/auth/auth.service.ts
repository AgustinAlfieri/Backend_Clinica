import bcrypt from 'bcrypt';
import { orm } from '../database/orm.js';
import jwt from 'jsonwebtoken';
import { Administrative } from '../../user/userTypes/administrative/administrative.entity.js';
import { Medic } from '../../user/userTypes/medic/medic.entity.js';
import { Patient } from '../../user/userTypes/patient/patient.entity.js';
import { MedicalInsurance } from '../../medicalInsurance/medicalInsurance.entity.js';
import { Collection } from '@mikro-orm/mysql';
import { MedicalSpecialty } from '../../medicalSpecialty/medicalSpecialty.entity.js';
import { Appointment } from '../../appointment/appointment.entity.js';
import { PatientService } from '../../user/userTypes/patient/patient.service.js';
import { MedicService } from '../../user/userTypes/medic/medic.service.js';
import { AdministrativeService } from '../../user/userTypes/administrative/administrative.service.js';
import { customFinder } from '../middlewares/customFinders.js';

export interface DataNewUser {
  role: string;
  id: string;
  dni: string;
  name: string;
  email: string;
  password: string;
  telephone: string;
  license: string;
  specialty: string;
  insuranceNumber: string;
  medicalInsurance: MedicalInsurance;
  medicalSpecialty: Collection<MedicalSpecialty>;
  appointments: Collection<Appointment>;
}
export interface userCredentials {
  input: string;
  email?: string;
  dni?: string;
  password: string;
  role: string;
}
export interface payload {
  userId: string;
  role: string;
  iat: number;
}
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    dni?: string;
    name?: string;
  };
}
const em = orm.em;

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string, role: string): string => {
  const secret = process.env.SECRET || 'sinSecret'; //hacer un get

  const payload: payload = {
    userId: userId,
    role: role,
    iat: Date.now() / 1000
  };

  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

export const verifyToken = (token: string): payload => {
  try {
    const secret = process.env.SECRET || 'sinSecret';
    const decoded = jwt.verify(token, secret) as payload;

    return {
      userId: decoded.userId,
      role: decoded.role,
      iat: decoded.iat
    };
  } catch (error) {
    throw new Error('Token inválido');
  }
};

export const login = async (credentials: userCredentials): Promise<AuthResponse> => {
  const _em = em.fork();
  const { email, dni, password } = credentials;
  let role = '';

  //Busco el rol del usuario a loguear
  let result = await customFinder({ dni: dni, email: email });
  if (result)  role = result;


  if (!email && !dni) {
    throw new Error('Email o DNI son requeridos');
  }

  if (!password) {
    throw new Error('La contraseña es requerida');
  }
  //Veo que rol es, sino despues me da error de properties
  let userEntity;
  switch (role) {
    case 'Patient':
      userEntity = Patient;
      break;
    case 'Medic':
      userEntity = Medic;
      break;
    case 'Administrative':
      userEntity = Administrative;
      break;
    default:
      throw new Error('Rol inválido');
  }

  //Busco usuario
  const searchBy = email ? { email, role } : { dni, role };

  const user = await _em.findOne(userEntity, searchBy);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  //Chequeo contraseña
  const passwordMatch = await comparePassword(password, user.password);

  if (!passwordMatch) {
    throw new Error('Contraseña incorrecta');
  }

  const token = generateToken(user.id, user.role);
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      dni: user.dni,
      name: user.name
    }
  };
};

//Para registrar un nuevo usuario
export const register = async (dataNewUser: DataNewUser): Promise<AuthResponse> => {
  //No hago el fork aca porque lo hacen los servicios
  //const _em = em.fork();
  console.log(dataNewUser);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(dataNewUser.email)) { //TODO: manejar en el front
    throw new Error('Email inválido');
  }

  console.log("Hasta acá llego 1")

  if (dataNewUser.password.length < 8) {
    throw new Error('La contraseña debe tener al menos 8 caracteres');
  }

  let newUserId: string;
  console.log("Hasta acá llego 2");

  switch (dataNewUser.role) {
    case 'Patient':
      const pService = new PatientService(em);
      const newPatient = await pService.create(dataNewUser);
      newUserId = newPatient.id;
      console.log("Hasta acá llego 3");
      break;
    case 'Medic':
      const mService = new MedicService(em);
      const newMedic = await mService.create(dataNewUser);
      newUserId = newMedic.id; //para poder firmar ok el token
      break;
    case 'Administrative':
      const aService = new AdministrativeService(em);
      const newAdministrative = await aService.create(dataNewUser);
      newUserId = newAdministrative.id;
      break;
    default:
      throw new Error('Rol inválido');
  }

  const token = generateToken(dataNewUser.id, dataNewUser.role);
  return {
    token,
    user: {
      id: newUserId,
      email: dataNewUser.email,
      role: dataNewUser.role,
      dni: dataNewUser.dni,
      name: dataNewUser.name
    }
  };
};
