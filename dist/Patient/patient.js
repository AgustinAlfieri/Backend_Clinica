export class Patient {
    //Check atributes
    constructor(_name, _address, _age, _medicalInsurance) {
        this.id = crypto.randomUUID();
        this._name = _name;
        this._address = _address;
        this._age = _age;
        this._medicalInsurance = _medicalInsurance;
        this.id = crypto.randomUUID();
    }
}
//# sourceMappingURL=patient.js.map