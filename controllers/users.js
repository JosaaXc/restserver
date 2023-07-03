const { response, request }= require('express')
const bcryptjs = require('bcryptjs') 
const Usuario = require('../models/users')

const { existEmail } = require('../helpers/db-validator')

const usersGet = async( req,res=response ) => {

    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip( Number(desde) )
        .limit( Number(limite) )
    ])
    res.json({
        total,
        usuarios
        // total,
        // usuarios
    })
}

const usersPut = async(req,res) => {

    const { id } = req.params
    const { _id, password, google, correo, ...resto} = req.body

    //validar con base de datos 
    if( password ){
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync( password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto)

    res.status(500).json({
        msg: "Put API - Controlador",
        usuario
    })
    
}

const usersPost = async(req,res) => {
    
    const { nombre, correo, password, rol} = req.body
    const usuario = new Usuario( { nombre, correo, password, rol} )

    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync( password, salt)
    //guardar en BD
    await usuario.save()

    res.json(usuario)
}

const usersPatch = (req,res) => {
    res.status(201).json({
        msg: "Patch API - Controlador"
    })
}

const usersDelete = async(req,res) => {

    const { id } = req.params

    // const usuario = await Usuario.findByIdAndDelete( id )
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false})
    
    res.json( usuario )
}

module.exports = {
    usersGet, 
    usersPut,
    usersPost,
    usersPatch,
    usersDelete
}