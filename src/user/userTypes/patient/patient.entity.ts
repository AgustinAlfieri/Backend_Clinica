import { Entity, ManyToOne, PrimaryKey, Rel } from '@mikro-orm/core';
import { User } from '../../user.entity.js';
import { MedicalInsurance } from '../../../medicalInsurance/medicalinsurance.entity.js';

@Entity()
export class Patient extends User {
  @PrimaryKey()
  public id = crypto.randomUUID();

  @ManyToOne(() => MedicalInsurance)
  public medicalInsurance: Rel<MedicalInsurance>;

  constructor(medicalInsurance: Rel<MedicalInsurance>) {
    super();
    this.medicalInsurance = medicalInsurance;
  }
}
