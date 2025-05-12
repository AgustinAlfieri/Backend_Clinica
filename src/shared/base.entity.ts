import { PrimaryKey, Property, DateTimeType } from '@mikro-orm/core';

export abstract class BaseEntity {
  // BaseEntity es una clase abstracta que contiene los campos comunes a todas las entidades

  @PrimaryKey()
  id?: number;

  /*
  @Property({ type: DateTimeType })
  createdAt?: new Date();

  @Property({ type: DateTimeType, onUpdate: () => new Date() })

  updatedAt?: new Date();
  // createdAt y updatedAt son campos que se utilizan para almacenar la fecha de creación y actualización de la entidad

  */
}
