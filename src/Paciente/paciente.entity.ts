import { publicDecrypt } from "crypto"


export class Paciente {
    public id = crypto.randomUUID();
    public _name: string;
    public _address: string;
    public _age: number;
    public _obraSocial: string;
    //Ver que otros atributos tiene el paciente

    constructor(_name: string, _address: string, _age:number, _obraSocial: string){
        this._name = _name;
        this._address = _address;
        this._age = _age;
        this._obraSocial = _obraSocial;
        this.id = crypto.randomUUID();
    }

}