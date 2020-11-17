const express = require('express');
const app = express();

const Recibo = require('../models/recibo');
const Cuentahabiente = require('../models/cuentahabiente');
const _ = require('underscore');
const recibo = require('../models/recibo');



//Get recibos de usuario
app.get('/recibos/:id', (req, res) => {
    let id = req.params.id;
    let desde = req.params.desde || 0;
    let limite = req.params.limite || 5;
    desde = Number(desde);
    limite = Number(limite);

    Cuentahabiente.findById(id, (err, cuentahabiente) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
                message: 'id de cuentahabiente no valido'
            });
        }
        if (!cuentahabiente) {
            res.status(400).json({
                ok: false,
                err,
                message: 'No se encontró cuentahabiente con ese id'
            });
        }
        Recibo.find({ contrato: cuentahabiente.contrato })
            .skip(desde)
            .limit(limite)
            .exec((err, recibosDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                if (recibosDB === null) {
                    return res.status(400).json({
                        ok: false,
                        err,
                        message: `No se encontraron recibos para el usuario con ${id}`
                    });
                }
                // Recibo.aggregate([{
                //     $group:{
                //         "_estatus": "$estatusPago",
                //         "total": { $sum: "$total"}
                //     }
                // }], (err, resp)=>{})
                Recibo.countDocuments({ estatusPago: 'ADEUDA' }, (err, recibosAdeudados) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }
                    res.json({
                        ok: true,
                        recibos: recibosDB,
                        recibosAdeudados
                    });
                })
            });
    });

});

app.post('/recibos', (req, res) => {
    let body = req.body;
    let contratob = body.contrato;
    Cuentahabiente.find({ contrato: contratob, estado: true }).exec((err, cuentahabienteDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        let recibo = new Recibo({
            contrato: contratob,
            consumo: body.consumo,
            fechaInicial: body.fechaInicial,
            fechaFinal: body.fechaFinal,
            subtotal: body.subtotal,
            descuentos: body.descuentos,
            total: body.total,
        });

        recibo.save((err, reciboDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                recibo: reciboDB
            });
        });
    });
});

app.put('/recibos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['consumo', 'fechaInicial', 'fechaFinal', 'subtotal', 'descuentos', 'total', 'estatusPago']);
    //Se remplazo por findAndUpdate
    Recibo.findByIdAndModify(id, body, { new: true, runValidators: true, context: 'query' }, (err, reciboDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            recibo: reciboDB
        });
    });

});

module.exports = app;