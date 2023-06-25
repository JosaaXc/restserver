const { response, request }= require('express')

const usersGet = ( req,res=response ) => {

    const { q, nombre = 'No name', apikey} = req.query

    res.json({
        msg: "get API - Controlador",
        q,
        nombre,
        apikey
    })
}

const usersPut = (req,res) => {

    const { id } = req.params

    res.status(500).json({
        msg: "Put API - Controlador",
        id
    })
}

const usersPost = (req,res) => {
    
    const {nombre, edad} = req.body
    

    res.status(201).json({
        msg: "Post API - Controlador",
        nombre,
        edad
    })
}

const usersPatch = (req,res) => {
    res.status(201).json({
        msg: "Patch API - Controlador"
    })
}

const usersDelete = (req,res) => {
    res.json({
        msg: "Delete API - Controlador"
    })
}

module.exports = {
    usersGet, 
    usersPut,
    usersPost,
    usersPatch,
    usersDelete
}