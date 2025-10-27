-- ===============================================
-- Script de MOCK DATA 

-- !!!!!!!!!!!!!!!!!!!!!!!!!!!
-- ! NO CORRER EN PRODUCCIÓN !
-- !!!!!!!!!!!!!!!!!!!!!!!!!!!

-- ===============================================

SET FOREIGN_KEY_CHECKS = 0;

-- DEFINICIÓN DE CONTRASEÑA HASHEADA
-- Password original = 12345678
SET @PASSWORD_HASH = '$2b$10$RUVEPMAO3UPg9YgVLAEue.oN9zxZuhqSedcD0Beq.IlNodD4Co4.K';

-- DEFINICIÓN DE VARIABLES UUIDs (Se mantienen los nombres para consistencia)
-- Especialidades (4)
SET @UUID_MS_1 = UUID(); -- Cardiologia
SET @UUID_MS_2 = UUID(); -- Oftalmologia
SET @UUID_MS_3 = UUID(); -- Pediatria
SET @UUID_MS_4 = UUID(); -- Alergologiapatient

-- Seguros (2)
SET @UUID_MI_1 = UUID();
SET @UUID_MI_2 = UUID();

-- Estatus de Cita (1)
SET @UUID_TAS_1 = '1';

-- Practicas (4)
SET @UUID_PRAC_1 = UUID();
SET @UUID_PRAC_2 = UUID();
SET @UUID_PRAC_3 = UUID();
SET @UUID_PRAC_4 = UUID();

-- Medicos (8)
SET @UUID_MED_1 = UUID(); SET @UUID_MED_2 = UUID();
SET @UUID_MED_3 = UUID(); SET @UUID_MED_4 = UUID();
SET @UUID_MED_5 = UUID(); SET @UUID_MED_6 = UUID();
SET @UUID_MED_7 = UUID(); SET @UUID_MED_8 = UUID();

-- Administrativos (2)
SET @UUID_ADM_1 = UUID(); SET @UUID_ADM_2 = UUID();

-- Pacientes (8)
SET @UUID_PAT_1 = UUID(); SET @UUID_PAT_2 = UUID();
SET @UUID_PAT_3 = UUID(); SET @UUID_PAT_4 = UUID();
SET @UUID_PAT_5 = UUID(); SET @UUID_PAT_6 = UUID();
SET @UUID_PAT_7 = UUID(); SET @UUID_PAT_8 = UUID();

-- Citas (8)
SET @UUID_APP_1 = UUID(); SET @UUID_APP_2 = UUID();
SET @UUID_APP_3 = UUID(); SET @UUID_APP_4 = UUID();
SET @UUID_APP_5 = UUID(); SET @UUID_APP_6 = UUID();
SET @UUID_APP_7 = UUID(); SET @UUID_APP_8 = UUID();


-- LIMPIEZA DE TABLAS
TRUNCATE TABLE appointment_practices;
TRUNCATE TABLE appointment_administratives;
TRUNCATE TABLE appointment_status;
TRUNCATE TABLE appointment;
TRUNCATE TABLE patient;
TRUNCATE TABLE medical_specialty_medics;
TRUNCATE TABLE medic;
TRUNCATE TABLE administrative;
TRUNCATE TABLE practice_medical_insurances;
TRUNCATE TABLE practice;
TRUNCATE TABLE medical_specialty;
TRUNCATE TABLE medical_insurance;
TRUNCATE TABLE type_appointment_status;


-- 1. DATOS ESTÁTICOS / DE BÚSQUEDA ----------------------------------------------------------------------------------

-- TYPE_APPOINTMENT_STATUS
INSERT INTO type_appointment_status (id, name) VALUES
('1', 'Solicitado'),
('2', 'En_sala_de_espera'),
('3', 'Completado'),
('4', 'Cancelado');

-- MEDICAL_INSURANCE
INSERT INTO medical_insurance (id, name) VALUES
(@UUID_MI_1, 'Sanitas Total'),
(@UUID_MI_2, 'Adeslas Basico'),
(UUID(), 'Mapfre Familiar'),
(UUID(),'Particular');

-- MEDICAL_SPECIALTY
INSERT INTO medical_specialty (id, name) VALUES
(@UUID_MS_1, 'Cardiologia'),
(@UUID_MS_2, 'Oftalmologia'),
(@UUID_MS_3, 'Pediatria'),
(@UUID_MS_4, 'Alergologia');

-- PRACTICE
INSERT INTO practice (id, name, description, medical_specialty_id) VALUES
(@UUID_PRAC_1, 'Electrocardiograma', 'Revision de la actividad electrica del corazon.', @UUID_MS_1),
(@UUID_PRAC_2, 'Revision Ocular', 'Examen completo de la vista.', @UUID_MS_2),
(@UUID_PRAC_3, 'Control del Nino Sano', 'Revision pediatrica rutinaria.', @UUID_MS_3),
(@UUID_PRAC_4, 'Prueba de Prick', 'Pruebas cutaneas de alergias.', @UUID_MS_4);

-- PRACTICE_MEDICAL_INSURANCES (M:N)
INSERT INTO practice_medical_insurances (practice_id, medical_insurance_id) VALUES
(@UUID_PRAC_1, @UUID_MI_1),
(@UUID_PRAC_2, @UUID_MI_2),
(@UUID_PRAC_3, @UUID_MI_1),
(@UUID_PRAC_4, @UUID_MI_2);


-- 2. DATOS DE USUARIOS ----------------------------------------------------------------------------------------------

-- ADMINISTRATIVE (Contraseña reemplazada por @PASSWORD_HASH)
INSERT INTO administrative (id, dni, name, email, telephone, password, role) VALUES
(@UUID_ADM_1, '11111111', 'Manuel Jefe', 'manuel.j@clinica.com', '601111111', @PASSWORD_HASH, 'Administrative'),
(@UUID_ADM_2, '22222222', 'Andrea Recepcionista', 'andrea.r@clinica.com', '602222222', @PASSWORD_HASH, 'Administrative');

-- MEDIC (Contraseña reemplazada por @PASSWORD_HASH)
INSERT INTO medic (id, dni, name, email, telephone, license, password, role) VALUES
(@UUID_MED_1, '33333333', 'Javier Santos', 'javier.s@clinica.com', '610333333', 'CM-1001', @PASSWORD_HASH, 'Medic'),
(@UUID_MED_2, '44444444', 'Elena Ruiz', 'elena.r@clinica.com', '610444444', 'CM-1002', @PASSWORD_HASH, 'Medic'),
(@UUID_MED_3, '55555555', 'Sofia Perez', 'sofia.p@clinica.com', '610555555', 'CM-1003', @PASSWORD_HASH, 'Medic'),
(@UUID_MED_4, '66666666', 'Ricardo Gomez', 'ricardo.g@clinica.com', '610666666', 'CM-1004', @PASSWORD_HASH, 'Medic'),
(@UUID_MED_5, '77777777', 'Laura Flores', 'laura.f@clinica.com', '610777777', 'CM-1005', @PASSWORD_HASH, 'Medic'),
(@UUID_MED_6, '88888888', 'Carlos Diaz', 'carlos.d@clinica.com', '610888888', 'CM-1006', @PASSWORD_HASH, 'Medic'),
(@UUID_MED_7, '99999999', 'Ana Lopez', 'ana.l@clinica.com', '610999999', 'CM-1007', @PASSWORD_HASH, 'Medic'),
(@UUID_MED_8, '10101010', 'Pedro Vega', 'pedro.v@clinica.com', '610101010', 'CM-1008', @PASSWORD_HASH, 'Medic');

-- MEDICAL_SPECIALTY_MEDICS (M:N) - 2 Medicos por Especialidad
INSERT INTO medical_specialty_medics (medical_specialty_id, medic_id) VALUES
(@UUID_MS_1, @UUID_MED_1), (@UUID_MS_1, @UUID_MED_2),
(@UUID_MS_2, @UUID_MED_3), (@UUID_MS_2, @UUID_MED_4),
(@UUID_MS_3, @UUID_MED_5), (@UUID_MS_3, @UUID_MED_6),
(@UUID_MS_4, @UUID_MED_7), (@UUID_MS_4, @UUID_MED_8);

-- PATIENT (Contraseña reemplazada por @PASSWORD_HASH)
INSERT INTO patient (id, dni, name, email, telephone, medical_insurance_id, password, insurance_number, role) VALUES
(@UUID_PAT_1, '12345678', 'Isabel Garcia', 'isabel.g@paciente.com', '620555555', @UUID_MI_1, @PASSWORD_HASH, 'SEG-100A', 'Patient'),
(@UUID_PAT_2, '23456789', 'Ricardo Lopez', 'ricardo.l@paciente.com', '620666666', @UUID_MI_2, @PASSWORD_HASH, 'SEG-200B', 'Patient'),
(@UUID_PAT_3, '34567890', 'Sofia Nina', 'sofia.n@paciente.com', '620777777', @UUID_MI_1, @PASSWORD_HASH, 'SEG-300C', 'Patient'),
(@UUID_PAT_4, '45678901', 'Javier Alergia', 'javier.a@paciente.com', '620888888', @UUID_MI_2, @PASSWORD_HASH, 'SEG-400D', 'Patient'),
(@UUID_PAT_5, '56789012', 'Marta Ansiosa', 'marta.a@paciente.com', '620999999', NULL, @PASSWORD_HASH, NULL, 'Patient'),
(@UUID_PAT_6, '67890123', 'Lucia Joven', 'lucia.j@paciente.com', '630111111', @UUID_MI_1, @PASSWORD_HASH, 'SEG-500E', 'Patient'),
(@UUID_PAT_7, '78901234', 'Felipe Mayor', 'felipe.m@paciente.com', '630222222', @UUID_MI_2, @PASSWORD_HASH, 'SEG-600F', 'Patient'),
(@UUID_PAT_8, '89012345', 'Sara Nueva', 'sara.n@paciente.com', '630333333', @UUID_MI_1, @PASSWORD_HASH, 'SEG-700G', 'Patient');


-- 3. DATOS DE CITAS (8 Citas - 1 por cada Medico) --------------------------------------------------------------------

-- APPOINTMENT
INSERT INTO appointment (id, appointment_date, patient_id, medic_id) VALUES
(@UUID_APP_1, '2026-01-10 10:00:00', @UUID_PAT_1, @UUID_MED_1),
(@UUID_APP_2, '2026-01-11 15:30:00', @UUID_PAT_2, @UUID_MED_2),
(@UUID_APP_3, '2026-01-12 11:00:00', @UUID_PAT_3, @UUID_MED_3),
(@UUID_APP_4, '2026-01-13 09:30:00', @UUID_PAT_4, @UUID_MED_4),
(@UUID_APP_5, '2026-01-14 16:00:00', @UUID_PAT_5, @UUID_MED_5),
(@UUID_APP_6, '2026-01-15 14:00:00', @UUID_PAT_6, @UUID_MED_6),
(@UUID_APP_7, '2026-01-16 10:30:00', @UUID_PAT_7, @UUID_MED_7),
(@UUID_APP_8, '2026-01-17 12:00:00', @UUID_PAT_8, @UUID_MED_8);

-- APPOINTMENT_STATUS
INSERT INTO appointment_status (id, date, observation, type_appointment_status_id, appointment_id) VALUES
(UUID(), NOW(), 'Cita creada.', @UUID_TAS_1, @UUID_APP_1),
(UUID(), NOW(), 'Cita creada.', @UUID_TAS_1, @UUID_APP_2),
(UUID(), NOW(), 'Cita creada.', @UUID_TAS_1, @UUID_APP_3),
(UUID(), NOW(), 'Cita creada.', @UUID_TAS_1, @UUID_APP_4),
(UUID(), NOW(), 'Cita creada.', @UUID_TAS_1, @UUID_APP_5),
(UUID(), NOW(), 'Cita creada.', @UUID_TAS_1, @UUID_APP_6),
(UUID(), NOW(), 'Cita creada.', @UUID_TAS_1, @UUID_APP_7),
(UUID(), NOW(), 'Cita creada.', @UUID_TAS_1, @UUID_APP_8);


-- APPOINTMENT_ADMINISTRATIVES (M:N)
INSERT INTO appointment_administratives (appointment_id, administrative_id) VALUES
(@UUID_APP_1, @UUID_ADM_1),
(@UUID_APP_3, @UUID_ADM_2),
(@UUID_APP_5, @UUID_ADM_1),
(@UUID_APP_7, @UUID_ADM_2);

-- APPOINTMENT_PRACTICES (M:N)
INSERT INTO appointment_practices (appointment_id, practice_id) VALUES
(@UUID_APP_1, @UUID_PRAC_1),
(@UUID_APP_3, @UUID_PRAC_3),
(@UUID_APP_7, @UUID_PRAC_4);

SET FOREIGN_KEY_CHECKS = 1;