const mongoose = require('mongoose');


let estatusPagoValidos = {
    values: ['PAGADO', 'ADEUDA']
}

let Schema = mongoose.Schema;

let reciboSchema = new Schema({
    contrato: {
        type: String,
        required: [true, 'El número de contrato es requerido']
    },
    consumo: {
        type: Number,
        required: [true, 'El consumo en kws es necesario']
    },
    fechaInicial: {
        type: Date,
        required: true
    },
    fechaFinal: {
        type: Date,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    descuentos: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 150
    },
    estado: {
        type: Boolean,
        default: true
    },
    estatusPago: {
        type: String,
        enum: estatusPagoValidos,
        default: 'ADEUDA'
    }

});

module.exports = mongoose.model('Recibo', reciboSchema);