import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/base.entity.js";

@Entity()
export class Practice extends BaseEntity{
    @Property()
    private name: string;

    @Property()
    private description: string;

    constructor(name: string, description: string){
        super();
        this.name = name;
        this.description = description;
    }
}