# Comandos Útiles durante el desarrollo

## pnpm

##### Recompilar los paquetes nativos de un proyecto.

```
pnpm rebuild
```

##### Añadir dependencias de desarrollo del proyecto

```
pnpm add -D -E @types/express@5.0.1 @types/node@22.15.3 tsc-watch@6.0.4 typescript@5.1.3
```

> Están indicadas las versiones exactas de cada dependencia que estámos utilizando, no las más actuales.

##### Añadir dependencias del proyecto

```
pnpm add -E  express @mikro-orm/core@6.4.15 @mikro-orm/mysql@6.4.15 @mikro-orm/sql-highlighter@1.0.1 reflect-metadata@0.2.2 dotenv
```

> Están indicadas las versiones exactas de cada dependencia que estámos utilizando, no las más actuales.

## Crear contenedor de Docker con MySQL

> - Reemplazar la ruta por donde se quiere crear el volúmen en la PC de cada uno.
> - Completar con una contraseña para el usuario de la DB

```
docker run --name db-clinica
-v RUTA_EN_NUESTRA_PC:/var/lib/mysql
-e MYSQL_ROOT_HOST='%'
-e MYSQL_ALLOW_EMPTY_PASSWORD="yes"
-e MYSQL_PASSWORD=""
-e MYSQL_USER="usr_db_clinica"
-e MYSQL_DATABASE='clinica'
-p 3306:3306
-d percona/percona-server
```

## Conexión con la base de datos

Copiar el archivo _/src/shared/database/database.env.example_ a _/src/shared/database/database.env_ y completar con las credenciales que se usaron en la creación del contenedor de Docker con MySQL.
