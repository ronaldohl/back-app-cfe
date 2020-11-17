const express = require('express');
const app = express();

const Cuentahabiente = require('../models/cuentahabiente');
const _ = require('underscore');


// Obtener Cuentahabientes
app.get('/cuentahabiente', (req, res) => {
    let desde = req.params.desde || 0;
    let limite = req.params.limite || 5;

    desde = Number(desde);
    limite = Number(limite);

    Cuentahabiente.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, cuentahabientes) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Cuentahabiente.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    cuentahabientes,
                    conteo
                })
            });
        });

});

//Registrar Cuentahabientes
app.post('/cuentahabiente', (req, res) => {
    let body = req.body;
    let cuentahabiente = new Cuentahabiente({
        contrato: body.contrato,
        nombre: body.nombre.toUpperCase(),
        apellidop: body.apellidop.toUpperCase(),
        apellidom: body.apellidom.toUpperCase(),
        calle: body.calle.toUpperCase(),
        numeroExterior: body.numeroExterior.toUpperCase(),
        numeroInterior: body.numeroInterior.toUpperCase(),
        colonia: body.colonia.toUpperCase(),
        fechaNacimiento: body.fechaNacimiento,
        zona: body.zona,
    });

    cuentahabiente.save((err, cuentahabienteDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            cuentahabiente: cuentahabienteDB
        })
    })
});


app.put('/cuentahabiente/:id', (req, res) => {
    let id = req.params.id;
    req.body.nombre = req.body.nombre.toUpperCase();
    req.body.apellidop = req.body.apellidop.toUpperCase();
    req.body.apellidom = req.body.apellidom.toUpperCase();
    req.body.calle = req.body.calle.toUpperCase();
    req.body.numeroExterior = req.body.numeroExterior.toUpperCase();
    req.body.numeroInterior = req.body.numeroInterior.toUpperCase();
    req.body.colonia = req.body.colonia.toUpperCase();
    let body = _.pick(req.body, ['contrato', 'nombre', 'apellidop', 'apellidom', 'calle', 'numeroExterior', 'numeroInterior', 'colonia', 'fechaNacimiento', 'zona']);
    Cuentahabiente.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, cuentahabienteDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            cuentahabiente: cuentahabienteDB
        })
    });
});

app.delete('/cuentahabiente/:id', (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }
    Cuentahabiente.findByIdAndUpdate(id, cambiaEstado, { new: true, runValidators: true, context: 'query' }, (err, cuentahabienteDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            cuentahabiente: cuentahabienteDB
        })
    });
})

module.exports = app;