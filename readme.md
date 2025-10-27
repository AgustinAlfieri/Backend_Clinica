# Backend Clínica

Sistema backend para gestión de clínica médica desarrollado con Node.js, TypeScript y MikroORM.

## 🚀 Tecnologías Utilizadas

### Core

- **Node.js** - Runtime de JavaScript
- **TypeScript 5.1.3** - Superset tipado de JavaScript
- **Express 5.1.0** - Framework web para Node.js

### Base de Datos

- **MikroORM 6.4.15** - ORM para TypeScript
- **MySQL (Percona Server)** - Sistema de gestión de base de datos
- **Docker** - Contenerización de la base de datos

### Autenticación y Seguridad

- **JWT (jsonwebtoken)** - Autenticación basada en tokens
- **bcrypt/bcryptjs** - Encriptación de contraseñas
- **Joi** - Validación de esquemas

### Utilidades

- **Winston** - Logging
- **Cors** - Manejo de CORS
- **dotenv** - Variables de entorno
- **http-status-codes** - Códigos de estado HTTP
- **nanoid** - Generación de IDs únicos

### Desarrollo

- **tsc-watch** - Compilador TypeScript con watch mode
- **nodemon** - Reinicio automático del servidor

---

## 📥 Descargar el Proyecto

### Opción 1: Clonar con Git

```bash
git clone https://github.com/AgustinAlfieri/Backend_Clinica.git
cd Backend_Clinica
```

### Opción 2: Descargar ZIP

1. Ir a: https://github.com/AgustinAlfieri/Backend_Clinica
2. Click en "Code" → "Download ZIP"
3. Extraer el archivo y navegar a la carpeta

---

## 📦 Instalación de Dependencias

### Pre-requisitos

- **Node.js** (v22 o superior recomendado)
- **pnpm** (v10.8.0 o superior)
- **Docker** (para la base de datos)

### Instalar pnpm (si no lo tienes)

```bash
npm install -g pnpm
```

### Instalar todas las dependencias

Desde el directorio raíz del proyecto:

```bash
pnpm install
```

Esto instalará automáticamente todas las dependencias de desarrollo y producción listadas en `package.json`.

---

## ⚙️ Configuración de Archivos .env

El proyecto requiere dos archivos de configuración:

### 1. Configuración de Base de Datos

Copiar el archivo de ejemplo:

```bash
cp .env.database.example .env.database
```

En Windows (PowerShell):

```powershell
Copy-Item .env.database.example .env.database
```

Editar `.env.database` con tus credenciales:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=usuario_db
DB_PASSWORD=contraseña_db
DB_NAME=clinica
```

### 2. Configuración de la Aplicación

Copiar el archivo de ejemplo:

```bash
cp .env.configuration.example .env.configuration
```

En Windows (PowerShell):

```powershell
Copy-Item .env.configuration.example .env.configuration
```

Editar `.env.configuration` con tu clave secreta:

```env
SECRET=tu_clave_secreta_para_jwt_aqui
```

> ⚠️ **Importante**: Cambia el valor de `SECRET` por una cadena segura y única. Nunca compartas estas credenciales.

---

## 🐳 Configuración de la Base de Datos con Docker

Crear y ejecutar un contenedor MySQL con Percona Server:

### Linux/Mac:

```bash
docker run --name db_clinica_mysql \
  -v /ruta/a/tu/carpeta:/var/lib/mysql \
  -e MYSQL_ROOT_HOST='%' \
  -e MYSQL_ALLOW_EMPTY_PASSWORD="yes" \
  -e MYSQL_PASSWORD="contraseña_db" \
  -e MYSQL_USER="usuario_db" \
  -e MYSQL_DATABASE='clinica' \
  -p 3306:3306 \
  -d percona/percona-server
```

### Windows (PowerShell):

```powershell
docker run --name db_clinica_mysql -v C:\Users\TuUsuario\Escritorio\db_data:/var/lib/mysql -e MYSQL_ROOT_HOST='%' -e MYSQL_ALLOW_EMPTY_PASSWORD="yes" -e MYSQL_PASSWORD="contraseña_db" -e MYSQL_USER="usuario_db" -e MYSQL_DATABASE='clinica' -p 3306:3306 -d percona/percona-server
```

### Verificar que el contenedor está corriendo:

```bash
docker ps
```

### Iniciar un contenedor existente:

```bash
docker start db_clinica_mysql
```

### Detener el contenedor:

```bash
docker stop db_clinica_mysql
```

## 🌱 Carga de Datos de Prueba (Seeding)

Para facilitar las pruebas, el proyecto incluye un archivo SQL con datos de ejemplo (pacientes, médicos, tipos de estado, etc.).

El archivo se encuentra en `docs/mock-data.sql`.

### Opción 1: Cargar desde la terminal (con Docker)

Asegúrate de que tu contenedor `db_clinica_mysql` esté corriendo. Luego, ejecuta este comando desde la raíz del proyecto, reemplazando `usuario_db` y `contraseña_db` con tus credenciales de `.env.database`:

```bash
docker exec -i db_clinica_mysql mysql -u<usuario_db> -p<contraseña_db> clinica < docs/mock-data.sql
```

> Nota: Si tu contraseña contiene caracteres especiales, es posible que necesites ejecutar el comando de forma interactiva: docker exec -i db_clinica_mysql mysql -uusuario_db -p clinica < seed/data.sql y luego ingresar la contraseña cuando se te solicite.

### Opción 2: Usando un cliente GUI (DBeaver, Workbench)

- Abre tu cliente de base de datos (DBeaver, MySQL Workbench, etc.).

- Conéctate a tu base de datos clinica que corre en Docker.

- Abre el archivo docs/mock-data.sql en el editor de SQL.

- Ejecuta todo el contenido del script.

---

## 🚀 Despliegue y Scripts Disponibles

### Scripts de package.json:

#### 🔧 Desarrollo (Recomendado)

Compila TypeScript y reinicia automáticamente al detectar cambios:

```bash
pnpm start:dev
```

#### 📦 Compilar el proyecto

Compila TypeScript a JavaScript en la carpeta `dist/`:

```bash
pnpm build
```

#### 🚀 Producción

Ejecuta el código compilado (requiere `pnpm build` primero):

```bash
pnpm start
```

#### 🐛 Debug con Nodemon

Ejecuta el proyecto compilado con nodemon:

```bash
pnpm start:debug
```

#### ⚡ Desarrollo alternativo con ts-node-dev

```bash
pnpm dev
```

#### 🔍 Debug con Inspector de Node.js

Para debugging con breakpoints:

```bash
pnpm debug
```

---

## 🌐 Ver el Proyecto Corriendo

Una vez ejecutado cualquiera de los comandos de despliegue (recomendado: `pnpm start:dev`), el servidor estará disponible en:

```
http://localhost:3000
```

### Endpoints principales:

- **Health Check**: `GET http://localhost:3000/`
- **Appointment**: `http://localhost:3000/api/appointment/*`
- **Appointment Status**: `http://localhost:3000/api/appointmentStatus/*`
- **Medical Insurance**: `http://localhost:3000/api/medicalInsurance/*`
- **Medical Specialty**: `http://localhost:3000/api/medicalSpecialty/*`
- **Practice**: `http://localhost:3000/api/practice/*`
- **Type Appointment Status**: `http://localhost:3000/api/typeAppointmentStatus/*`
- **Administrative**: `http://localhost:3000/api/administrative/*`
- **Medic**: `http://localhost:3000/api/medic/*`
- **Patient**: `http://localhost:3000/api/patient/*`

### Ver logs

Los logs se guardan en el archivo `app.log` en la raíz del proyecto.

---

## 📝 Flujo de Trabajo Completo

1. **Descargar** el proyecto (clonar o descargar ZIP)
2. **Instalar** dependencias con `pnpm install`
3. **Configurar** Docker y crear el contenedor MySQL
4. **Configurar** archivos `.env.database` y `.env.configuration`
5. **Ejecutar** con `pnpm start:dev`
6. **Acceder** a `http://localhost:3000`

---

## 🛠️ Solución de Problemas

### Error de conexión a la base de datos

- Verificar que el contenedor Docker esté corriendo: `docker ps`
- Verificar que las credenciales en `.env.database` coincidan con las del contenedor
- Verificar que el puerto 3306 no esté ocupado

### Error en compilación TypeScript

- Verificar que tienes Node.js v22+
- Limpiar y reinstalar: `rm -rf node_modules dist && pnpm install`

### Puerto 3000 ocupado

- Cambiar el puerto en el código o detener el proceso que lo está usando

### El contenedor Docker no inicia

- Verificar que Docker esté corriendo
- Verificar que no haya otro contenedor usando el puerto 3306
- Ver logs del contenedor: `docker logs db_clinica_mysql`
