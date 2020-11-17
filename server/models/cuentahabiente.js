const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let zonasValidas = {
    values: ['A', 'B', 'C'],
    message: 'La zona no es válida'
}
let estatusServicioValidos = {
    values: ['ACTIVO', 'MOROSO'],
    message: 'El estatus no es válido'
}

let Schema = mongoose.Schema;

let cuentahabienteSchema = new Schema({
    contrato: {
        type: Number,
        unique: true,
        required: [true, 'El número de contrato es necesario']
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellidop: {
        type: String,
        required: ['true', 'Es necesario el primer apellido']
    },
    apellidom: {
        type: String,
        required: false
    },
    //Manejo de softDelete
    estado: {
        type: Boolean,
        default: true
    },
    //Domicilio
    calle: {
        type: String,
        required: [true, 'El nombre de calle es necesario']
    },
    numeroExterior: {
        type: String,
        required: [true, 'El numero exterior es necesario']
    },
    numeroInterior: {
        type: String,
        required: false
    },
    colonia: {
        type: String,
        required: [true, 'El nombre de colonia o fraccionamiento es requerido']
    },
    fechaNacimiento: {
        type: Date,
        required: [true, 'La fecha de Nacimiento es necesaria']
    },
    zona: {
        type: String,
        enum: zonasValidas,
        required: [true, 'La zona es necesaria']
    },
    estatusServicio: {
        type: String,
        enum: estatusServicioValidos,
        default: 'ACTIVO'
    }
});

cuentahabienteSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Cuentahabiente', cuentahabienteSchema);