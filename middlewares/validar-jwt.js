const { response, request } = require('express')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/users')

const validarJWT = async( req = request, res= response, next ) => {

    const token = req.header('x-token')
    if(!token){
        return res.status(401).json({
            msg: "No hay token en la peticón"
        })
    }
    try {
        
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY)
        //leer el usuario al que coresponde el uid
        const usuario = await Usuario.findById( uid )
        if(!usuario){
            return res.status(401).json({
                msg: "Token no válido - Usuario no existe"
            })
        }
        //verififcar si el uid tiene estado en true
        if(!usuario.estado){
            return res.status(401).json({
                msg: "Token no válido - Usuario estado: false"
            })
        }
        
        req.usuario = usuario
        next()

    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: "Token no válido"
        })
    }

}

module.exports = {
    validarJWT
}