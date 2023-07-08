const { response, json } = require("express");
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/users');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const login = async(req, res= response) => {

    const { correo, password } = req.body

    try {

        //verificar si el email existe
        const usuario = await Usuario.findOne({ correo })
        if(!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password incorrecto(s) - correo'
            })
        }
        //verificar si el usuario está activo
        if(!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password incorrecto(s) - Estado: false'
            })
        }
        //verificar la contraseña
        const validPassword = bcryptjs.compareSync( password , usuario.password)
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password incorrecto(s) - Password'
            })
        }
        //Generar el JWT
        const token = await generarJWT( usuario.id )

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Hable con el administrador"
        })
    }

}

const googleSingIn = async( req, res= response) =>{

    const { id_token } = req.body

    try {

        const { correo, nombre, img } = await googleVerify( id_token )

        let usuario = await Usuario.findOne({ correo })

        if(!usuario){
            //crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: "USER_ROLE",
                google: true
            }
            
            usuario = new Usuario( data )
            await usuario.save()
        }

        //si el usuario en BD 
        if( !usuario.estado ){
            return res.status(401).json({
                msg: "Hable con el administrador, usuario bloqueado"
            })
        }

        const token = await generarJWT( usuario.id )


        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: "EL token no se pudo verificar"
        })
    }
    

}

module.exports = {
    login,
    googleSingIn
}