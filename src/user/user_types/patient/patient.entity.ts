import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from '../../user.entity.js';
import { BaseEntity } from '../../../shared/base.entity.js';
import { MedicalInsurance } from '../../../medical_insurance/medicalinsurance.entity.js';

@Entity()
export class Patient extends User {
    @PrimaryKey()
    public id = crypto.randomUUID();

    @Property()
    @ManyToOne( () => MedicalInsurance )
    public medical_insurance: MedicalInsurance;

    constructor(medical_insurance: MedicalInsurance){
        super();
        this.medical_insurance = medical_insurance
    }

}
