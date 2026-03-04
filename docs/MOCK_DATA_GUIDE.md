# 📋 Guía de Usuarios - Mock Data

Este documento describe cómo loguearse con los diferentes tipos de usuarios disponibles en el mock-data y qué funcionalidades puedes probar con cada uno.

**Contraseña universal para todos los usuarios:** `12345678`

---

## 👨‍💼 Administrativos

Los administrativos pueden gestionar turnos.

### Credenciales Disponibles

| Nombre               | DNI      | Email                | Teléfono  |
| -------------------- | -------- | -------------------- | --------- |
| Manuel Jefe          | 11111111 | manuel.j@clinica.com | 601111111 |
| Andrea Recepcionista | 22222222 | andrea.r@clinica.com | 602222222 |

### ¿Qué puedes probar?

- ✅ **Gestión de turnos** - Crear, editar, buscar turnos
- ✅ **Filtrado avanzado** - Filtrar turnos por fecha, paciente, médico, estado
- ✅ **Cambio de estado de turnos** - Marcar como "En sala de espera", "Completado", "Cancelado"

---

## 👨‍⚕️ Médicos

Los médicos pueden ver sus turnos asignadas y actualizar estados de turnos.

### Credenciales Disponibles

| Nombre        | DNI      | Licencia | Email                 | Especialidad |
| ------------- | -------- | -------- | --------------------- | ------------ |
| Javier Santos | 33333333 | CM-1001  | javier.s@clinica.com  | Cardiología  |
| Elena Ruiz    | 44444444 | CM-1002  | elena.r@clinica.com   | Cardiología  |
| Sofia Perez   | 55555555 | CM-1003  | sofia.p@clinica.com   | Oftalmología |
| Ricardo Gomez | 66666666 | CM-1004  | ricardo.g@clinica.com | Oftalmología |
| Laura Flores  | 77777777 | CM-1005  | laura.f@clinica.com   | Pediatría    |
| Carlos Diaz   | 88888888 | CM-1006  | carlos.d@clinica.com  | Pediatría    |
| Ana Lopez     | 99999999 | CM-1007  | ana.l@clinica.com     | Alergología  |
| Pedro Vega    | 10101010 | CM-1008  | pedro.v@clinica.com   | Alergología  |

### ¿Qué puedes probar?

- ✅ **Mi calendario de turnos** - Ver todas los turnos asignadas
- ✅ **Filtrado de turnos personalizadas** - Por fecha, por paciente, por estado
- ✅ **Actualizar estado de turno** - Cambiar de "En sala de espera" a "Completado" o "Cancelado"

---

## 👥 Pacientes

Los pacientes pueden ver y solicitar turnos.

### Credenciales Disponibles

#### Con Seguro Médico - Sanitas Total

| Nombre         | DNI      | Email                 | Seguro    |
| -------------- | -------- | --------------------- | --------- |
| Isabel Garcia  | 12345678 | isabel.g@paciente.com | SEG-100A  |
| Sofia Nina     | 34567890 | sofia.n@paciente.com  | SEG-300C  |
| Lucia Joven    | 67890123 | lucia.j@paciente.com  | SEG-500E  |
| Clara Alergica | 22334455 | clara.a@paciente.com  | SEG-1100K |

#### Con Seguro Médico - Adeslas Básico

| Nombre           | DNI      | Email                  | Seguro    |
| ---------------- | -------- | ---------------------- | --------- |
| Ricardo Lopez    | 23456789 | ricardo.l@paciente.com | SEG-200B  |
| Javier Alergia   | 45678901 | javier.a@paciente.com  | SEG-400D  |
| Felipe Mayor     | 78901234 | felipe.m@paciente.com  | SEG-600F  |
| Marcos Cardiacos | 90123456 | marcos.c@paciente.com  | SEG-800H  |
| Andres Nino      | 11223344 | andres.n@paciente.com  | SEG-1000J |

#### Sin Seguro Médico (Particular)

| Nombre        | DNI      | Email                | Estado        |
| ------------- | -------- | -------------------- | ------------- |
| Marta Ansiosa | 56789012 | marta.a@paciente.com | Sin cobertura |

#### Sistema de Pruebas Adicionales

| Nombre       | DNI      | Email                  | Seguro   |
| ------------ | -------- | ---------------------- | -------- |
| Sara Nueva   | 89012345 | sara.n@paciente.com    | SEG-700G |
| Valeria Ojos | 01234567 | valeria.o@paciente.com | SEG-900I |

### ¿Qué puedes probar?

- ✅ **Solicitar nuevo turno** - Ver especialidades y médicos disponibles
- ✅ **Mi historial de turnos** - Ver todas mis turnos (pasadas y futuras)

---
