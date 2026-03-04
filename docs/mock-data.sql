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

-- Pacientes (12)
SET @UUID_PAT_1 = UUID(); SET @UUID_PAT_2 = UUID();
SET @UUID_PAT_3 = UUID(); SET @UUID_PAT_4 = UUID();
SET @UUID_PAT_5 = UUID(); SET @UUID_PAT_6 = UUID();
SET @UUID_PAT_7 = UUID(); SET @UUID_PAT_8 = UUID();
SET @UUID_PAT_9 = UUID(); SET @UUID_PAT_10 = UUID();
SET @UUID_PAT_11 = UUID(); SET @UUID_PAT_12 = UUID();

-- Citas (24)
SET @UUID_APP_1 = UUID(); SET @UUID_APP_2 = UUID();
SET @UUID_APP_3 = UUID(); SET @UUID_APP_4 = UUID();
SET @UUID_APP_5 = UUID(); SET @UUID_APP_6 = UUID();
SET @UUID_APP_7 = UUID(); SET @UUID_APP_8 = UUID();
SET @UUID_APP_9 = UUID(); SET @UUID_APP_10 = UUID();
SET @UUID_APP_11 = UUID(); SET @UUID_APP_12 = UUID();
SET @UUID_APP_13 = UUID(); SET @UUID_APP_14 = UUID();
SET @UUID_APP_15 = UUID(); SET @UUID_APP_16 = UUID();
SET @UUID_APP_17 = UUID(); SET @UUID_APP_18 = UUID();
SET @UUID_APP_19 = UUID(); SET @UUID_APP_20 = UUID();
SET @UUID_APP_21 = UUID(); SET @UUID_APP_22 = UUID();
SET @UUID_APP_23 = UUID(); SET @UUID_APP_24 = UUID();


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
(@UUID_PAT_8, '89012345', 'Sara Nueva', 'sara.n@paciente.com', '630333333', @UUID_MI_1, @PASSWORD_HASH, 'SEG-700G', 'Patient'),
(@UUID_PAT_9, '90123456', 'Marcos Cardiacos', 'marcos.c@paciente.com', '630444444', @UUID_MI_2, @PASSWORD_HASH, 'SEG-800H', 'Patient'),
(@UUID_PAT_10, '01234567', 'Valeria Ojos', 'valeria.o@paciente.com', '630555555', @UUID_MI_1, @PASSWORD_HASH, 'SEG-900I', 'Patient'),
(@UUID_PAT_11, '11223344', 'Andres Nino', 'andres.n@paciente.com', '630666666', @UUID_MI_2, @PASSWORD_HASH, 'SEG-1000J', 'Patient'),
(@UUID_PAT_12, '22334455', 'Clara Alergica', 'clara.a@paciente.com', '630777777', @UUID_MI_1, @PASSWORD_HASH, 'SEG-1100K', 'Patient');


-- 3. DATOS DE CITAS (24 Citas con variedad de fechas y estados) -----------------------------------------

-- APPOINTMENT (24 citas distribuidas entre médicos y pacientes)
INSERT INTO appointment (id, appointment_date, patient_id, medic_id) VALUES
-- Enero 2026 - Estados Solicitado
(@UUID_APP_1, '2026-03-10 10:00:00', @UUID_PAT_1, @UUID_MED_1),
(@UUID_APP_2, '2026-03-11 15:30:00', @UUID_PAT_2, @UUID_MED_2),
(@UUID_APP_3, '2026-04-12 11:00:00', @UUID_PAT_3, @UUID_MED_3),
(@UUID_APP_4, '2026-04-13 09:30:00', @UUID_PAT_4, @UUID_MED_4),
(@UUID_APP_5, '2026-03-14 16:00:00', @UUID_PAT_5, @UUID_MED_5),
(@UUID_APP_6, '2026-03-15 14:00:00', @UUID_PAT_6, @UUID_MED_6),
(@UUID_APP_7, '2026-03-16 10:30:00', @UUID_PAT_7, @UUID_MED_7),
(@UUID_APP_8, '2026-02-17 12:00:00', @UUID_PAT_8, @UUID_MED_8),
-- Enero 2026 - Estados En_sala_de_espera
(@UUID_APP_9, '2026-03-04 08:00:00', @UUID_PAT_9, @UUID_MED_1),
(@UUID_APP_10, '2026-03-06 13:15:00', @UUID_PAT_10, @UUID_MED_2),
(@UUID_APP_11, '2026-03-08 09:45:00', @UUID_PAT_11, @UUID_MED_3),
(@UUID_APP_12, '2026-03-10 15:00:00', @UUID_PAT_12, @UUID_MED_4),
-- Enero 2026 - Estados Completado
(@UUID_APP_13, '2026-01-05 10:00:00', @UUID_PAT_1, @UUID_MED_5),
(@UUID_APP_14, '2026-01-06 14:30:00', @UUID_PAT_2, @UUID_MED_6),
(@UUID_APP_15, '2026-01-07 11:00:00', @UUID_PAT_3, @UUID_MED_7),
(@UUID_APP_16, '2026-01-08 09:00:00', @UUID_PAT_4, @UUID_MED_8),
(@UUID_APP_17, '2025-12-28 10:30:00', @UUID_PAT_5, @UUID_MED_1),
(@UUID_APP_18, '2025-12-29 15:45:00', @UUID_PAT_6, @UUID_MED_2),
-- Enero 2026 - Estados Cancelado
(@UUID_APP_19, '2026-01-22 11:30:00', @UUID_PAT_7, @UUID_MED_3),
(@UUID_APP_20, '2026-01-23 10:00:00', @UUID_PAT_8, @UUID_MED_4),
(@UUID_APP_21, '2026-01-24 16:15:00', @UUID_PAT_9, @UUID_MED_5),
(@UUID_APP_22, '2026-03-04 13:30:00', @UUID_PAT_10, @UUID_MED_6),
-- Futuro - Estados Solicitado (próximas semanas)
(@UUID_APP_23, '2026-03-18 10:00:00', @UUID_PAT_11, @UUID_MED_7),
(@UUID_APP_24, '2026-02-22 14:00:00', @UUID_PAT_12, @UUID_MED_8);

-- APPOINTMENT_STATUS (Múltiples estados por cita)
-- Citas en estado Solicitado (APP_1 a APP_8)
INSERT INTO appointment_status (id, date, observation, type_appointment_status_id, appointment_id) VALUES
(UUID(), NOW(), 'Cita solicitada y confirmada.', '1', @UUID_APP_1),
(UUID(), NOW(), 'Cita creada. Pendiente confirmación.', '1', @UUID_APP_2),
(UUID(), NOW(), 'Cita agendada con éxito.', '1', @UUID_APP_3),
(UUID(), NOW(), 'Paciente notificado. Cita confirmada.', '1', @UUID_APP_4),
(UUID(), NOW(), 'Cita solicitada por paciente.', '1', @UUID_APP_5),
(UUID(), NOW(), 'Turno reservado sin problema.', '1', @UUID_APP_6),
(UUID(), NOW(), 'Cita en sistema. Esperando llegada.', '1', @UUID_APP_7),
(UUID(), NOW(), 'Cita confirmada por administrativo.', '1', @UUID_APP_8),

-- Citas en estado En_sala_de_espera (APP_9 a APP_12)
(UUID(), NOW(), 'Paciente en sala de espera.', '2', @UUID_APP_9),
(UUID(), NOW(), 'Paciente ha llegado. Aguardando turno.', '2', @UUID_APP_10),
(UUID(), NOW(), 'En cola de atención. Próximo turno.', '2', @UUID_APP_11),
(UUID(), NOW(), 'Paciente presente. Médico ocupado.', '2', @UUID_APP_12),

-- Citas en estado Completado (APP_13 a APP_18)
(UUID(), DATE_SUB(NOW(), INTERVAL 5 DAY), 'Cita realizada exitosamente.', '3', @UUID_APP_13),
(UUID(), DATE_SUB(NOW(), INTERVAL 4 DAY), 'Revisión completada. Paciente mejorado.', '3', @UUID_APP_14),
(UUID(), DATE_SUB(NOW(), INTERVAL 3 DAY), 'Examen realizado. Se prescribió tratamiento.', '3', @UUID_APP_15),
(UUID(), DATE_SUB(NOW(), INTERVAL 2 DAY), 'Control pediatrico completado. Todo normal.', '3', @UUID_APP_16),
(UUID(), DATE_SUB(NOW(), INTERVAL 10 DAY), 'Cita completada sin complicaciones.', '3', @UUID_APP_17),
(UUID(), DATE_SUB(NOW(), INTERVAL 9 DAY), 'Paciente evaluado. Se derivó a otro especialista.', '3', @UUID_APP_18),

-- Citas en estado Cancelado (APP_19 a APP_22)
(UUID(), NOW(), 'Cancelado por paciente - motivos personales.', '4', @UUID_APP_19),
(UUID(), NOW(), 'Cancelado por médico - emergencia.', '4', @UUID_APP_20),
(UUID(), NOW(), 'Paciente no confirmó. Cancelada automáticamente.', '4', @UUID_APP_21),
(UUID(), NOW(), 'Cancelado por reprogramación de consultorio.', '4', @UUID_APP_22),

-- Citas Solicitadas a futuro (APP_23 y APP_24)
(UUID(), NOW(), 'Cita futura solicitada y confirmada.', '1', @UUID_APP_23),
(UUID(), NOW(), 'Cita programada para próximas semanas.', '1', @UUID_APP_24);

-- APPOINTMENT_ADMINISTRATIVES (M:N) - Todos los administrativos vinculados
INSERT INTO appointment_administratives (appointment_id, administrative_id) VALUES
-- Distribuir entre los dos administrativos
(@UUID_APP_1, @UUID_ADM_1),  (@UUID_APP_2, @UUID_ADM_2),
(@UUID_APP_3, @UUID_ADM_1),  (@UUID_APP_4, @UUID_ADM_2),
(@UUID_APP_5, @UUID_ADM_1),  (@UUID_APP_6, @UUID_ADM_2),
(@UUID_APP_7, @UUID_ADM_1),  (@UUID_APP_8, @UUID_ADM_2),
(@UUID_APP_9, @UUID_ADM_1),  (@UUID_APP_10, @UUID_ADM_2),
(@UUID_APP_11, @UUID_ADM_1), (@UUID_APP_12, @UUID_ADM_2),
(@UUID_APP_13, @UUID_ADM_1), (@UUID_APP_14, @UUID_ADM_2),
(@UUID_APP_15, @UUID_ADM_1), (@UUID_APP_16, @UUID_ADM_2),
(@UUID_APP_17, @UUID_ADM_1), (@UUID_APP_18, @UUID_ADM_2),
(@UUID_APP_19, @UUID_ADM_1), (@UUID_APP_20, @UUID_ADM_2),
(@UUID_APP_21, @UUID_ADM_1), (@UUID_APP_22, @UUID_ADM_2),
(@UUID_APP_23, @UUID_ADM_1), (@UUID_APP_24, @UUID_ADM_2);

-- APPOINTMENT_PRACTICES (M:N) - Todas las citas con práctica asignada
INSERT INTO appointment_practices (appointment_id, practice_id) VALUES
-- Cardiologia - Electrocardiograma
(@UUID_APP_1, @UUID_PRAC_1),   (@UUID_APP_9, @UUID_PRAC_1),   (@UUID_APP_13, @UUID_PRAC_1),   (@UUID_APP_19, @UUID_PRAC_1),
-- Oftalmologia - Revision Ocular
(@UUID_APP_2, @UUID_PRAC_2),   (@UUID_APP_10, @UUID_PRAC_2),  (@UUID_APP_14, @UUID_PRAC_2),   (@UUID_APP_20, @UUID_PRAC_2),
-- Pediatria - Control del Nino Sano
(@UUID_APP_3, @UUID_PRAC_3),   (@UUID_APP_11, @UUID_PRAC_3),  (@UUID_APP_15, @UUID_PRAC_3),   (@UUID_APP_21, @UUID_PRAC_3),
-- Alergologia - Prueba de Prick
(@UUID_APP_4, @UUID_PRAC_4),   (@UUID_APP_12, @UUID_PRAC_4),  (@UUID_APP_16, @UUID_PRAC_4),   (@UUID_APP_22, @UUID_PRAC_4),
-- Cardiologia
(@UUID_APP_5, @UUID_PRAC_1),   (@UUID_APP_17, @UUID_PRAC_1),  (@UUID_APP_23, @UUID_PRAC_1),
-- Oftalmologia
(@UUID_APP_6, @UUID_PRAC_2),   (@UUID_APP_18, @UUID_PRAC_2),  (@UUID_APP_24, @UUID_PRAC_2),
-- Pediatria
(@UUID_APP_7, @UUID_PRAC_3),
-- Alergologia
(@UUID_APP_8, @UUID_PRAC_4);

SET FOREIGN_KEY_CHECKS = 1;