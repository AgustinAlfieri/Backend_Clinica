import { publicDecrypt } from "crypto";

export class tipo_Estado_Turno {
    public id = crypto.randomUUID();
    public name: string;

    constructor(name: string) {
        this.name = name;
        this.id = crypto.randomUUID();
    }
}
