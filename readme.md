# Backend_Clínica

## Levantar una instancia del proyecto para desarrollo

#### Pre-requisitos

- Node.js
- pnpm
- Docker

1. #### Clonar o descargar el proyecto.
2. #### Instalar las dependencias de desarrollo

   ```
   pnpm add -D -E @types/express@5.0.1 @types/node@22.15.3 tsc-watch@6.0.4 typescript@5.1.3
   ```

3. #### Añadir las dependencias de ejecución

   ```
   pnpm add -E  express @mikro-orm/core@6.4.15 @mikro-orm/mysql@6.4.15 @mikro-orm/sql-highlighter@1.0.1 reflect-metadata@0.2.2 dotenv http-status-codes winston
   ```

4. #### Crear un contenedor de Docker con MySQL para la base de datos

   Reemplazar las < variables > por los valores deseados.

   ```
   docker run --name <container_name>
   -v <path_to_folder>:/var/lib/mysql
   -e MYSQL_ROOT_HOST='%'
   -e MYSQL_ALLOW_EMPTY_PASSWORD="yes"
   -e MYSQL_PASSWORD="<password>"
   -e MYSQL_USER="<user>"
   -e MYSQL_DATABASE='<db_name>'
   -p 3306:3306
   -d percona/percona-server
   ```

     <br>
   Ejemplo:

   ```
   docker run --name db_clinica_mysql
   -v C:\Users\MyUser\Escritorio\Backend_Clinica:/var/lib/mysql
   -e MYSQL_ROOT_HOST='%'
   -e MYSQL_ALLOW_EMPTY_PASSWORD="yes"
   -e MYSQL_PASSWORD="contraseña_db"
   -e MYSQL_USER="usuario_db"
   -e MYSQL_DATABASE='clinica'
   -p 3306:3306
   -d percona/percona-server
   ```

5. #### Conexión con la base de datos

   Copiar el archivo **env.database.example** a **env.database** y completar con las credenciales que se usaron en la creación del contenedor de Docker con MySQL.
   Ejemplo:

   ```
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=usuario_db
    DB_PASSWORD=contraseña_db
    DB_NAME=clinica
   ```

6. #### Inicializar el proyecto
   Desde el directorio raíz donde se descargó, ejecutar:
   ```
   pnpm start:dev
   ```
