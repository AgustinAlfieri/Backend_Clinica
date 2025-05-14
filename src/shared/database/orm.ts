import { MikroORM } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { MySqlDriver } from '@mikro-orm/mysql';
import * as dotenv from 'dotenv';

//TODO --> Hacer funcionar el .env
dotenv.config();

export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: 'clinica',
  driver: MySqlDriver,
  clientUrl: `mysql://usr_db_clinica:db_clinica@localhost:3306/clinica`,
  highlighter: new SqlHighlighter(),
  debug: true,
  schemaGenerator: {
    //never in production
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: []
  }
});

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();
};
