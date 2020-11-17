const express = require('express');
const app = express();
//Importamos el modelo de usuario, es como una clase con las propiedades extras del moongose.model
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/usuario', (req, res) => {
    // res.json('getUsuario')
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    //Trae los registros de ese schema, el segundo parametro es un string de los parametros que queremos recibir para filtrar
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        //Poniendo un limite
        .limit(limite)
        //LLamando a ejecutar la funcion recibe un err o el resultado en este caso lo usuarios
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            // Sirve para contar los registros del schema con la misma condicion que mandamos en el find({})
            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    numero_usuarios: conteo
                });
            })
        });
});

app.post('/usuario', (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    //Grabando en la bd de mongo
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //Para no devolver la contraseña encriptada
        // usuarioDB.password = null;
        //Si no se especifica el status, por defecto es el 200 
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //mongoose js Schema
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
});

app.delete('/usuario/:id', (req, res) => {
    // res.json('deleteUsuario')

    let id = req.params.id;
    let body = { estado: false }
        //Borrando registro fisico
        /*
        Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            if (!usuarioBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario No encontado'
                    }
                })
            }
            res.json({
                ok: true,
                usuario: usuarioBorrado
            })
        })
        */
    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioMod) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!usuarioMod) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }
        res.json({
            ok: true,
            usuario: usuarioMod
        })
    })

});


module.exports = app;