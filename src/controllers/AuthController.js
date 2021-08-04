const { User } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../../config/auth');

module.exports = {

// Login
signIn(req, res) {

    let { email, password } = req.body;
    console.log(email, password);

    // Buscar usuario
    User.findOne({
        where: {
            email: email
        }
    }).then(user => {

        if (!user) {
            res.status(404).json({ msg: "Usuario con este correo no encontrado" });
        } else {

            if (bcrypt.compareSync(password, user.password)) {

                // Creamos el token
                let token = jwt.sign({ user: user }, auth.secret, {
                    expiresIn: auth.expires
                });

                res.json({
                    user: user,
                    token: token
                })

            } else {

                // Unauthorized Access
                res.status(401).json({ msg: "Contraseña incorrecta" })
            }

        }

    }).catch(err => {
        res.status(500).json(err);
    })

},
        
        //Registro
        signUp(req, res) {

        //encripto
        let password = bcrypt.hashSync(req.body.password, Number.parseInt(auth.rounds));

        //Crear un usuario
        User.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
        }).then(user => {

            //cree token
            let token = jwt.sign({ user: user }, auth.secret, {
                expiresIn: auth.expires
            });
            res.json({
                user: user,
                token: token,
            });
        }).catch(err => {
            res.status(500).json(err);
        });        
    }
}