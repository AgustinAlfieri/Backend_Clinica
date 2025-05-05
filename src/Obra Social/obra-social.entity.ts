import { publicDecrypt } from "crypto"


export class Medical_Insurance {
    public id_obra_social = crypto.randomUUID();
    public _name: string;

 
    constructor(_name: string){
        this._name = _name;
        this.id_obra_social = crypto.randomUUID();
    }

}