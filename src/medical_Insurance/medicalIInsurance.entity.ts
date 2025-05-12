import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/base.entity.js";

@Entity()
export class MedicalInsurance extends BaseEntity {
    @Property()
    private name: string;


    constructor(name: string){
        super();
        this.name = name;
    }
}