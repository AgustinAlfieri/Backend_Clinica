import { publicDecrypt } from "crypto"


export class Patient {
    public id = crypto.randomUUID();
    public _name: string;
    public _address: string;
    public _age: number;
    public _medicalInsurance: string;
    //Check atributes

    constructor(_name: string, _address: string, _age:number, _medicalInsurance: string){
        this._name = _name;
        this._address = _address;
        this._age = _age;
        this._medicalInsurance = _medicalInsurance;
        this.id = crypto.randomUUID();
    }
}