import { MikroORM } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

import { MySqlDriver } from '@mikro-orm/mysql';

export const orm = await MikroORM.init({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  dbName: 'heroclash4geeks',

  // El profe puso type: 'mysql'
  // type: 'mysql',
  driver: MySqlDriver,

  clientUrl: 'mysql://dsw:dsw@localhost:3306/heroclash4geeks',
  highlighter: new SqlHighlighter(),
  debug: true,
  // Hasta acá es configuración básica
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
  // await generator.dropSchema();
  // await generator.createSchema();
};
