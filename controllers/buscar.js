const { response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require('mongoose').Types

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'usuarios',
    'roles'
]

const buscarProductos = async( termino = '', res= response ) => {
    const esMongoID = ObjectId.isValid( termino )
    if( esMongoID ){
        const producto = await Producto.findById( termino ).populate('categoria', 'nombre')
        return res.json( {
            results: ( producto ) ? [ producto ] : []
        } )
    }

    const regex = new RegExp( termino, 'i')

    const productos = await Producto.find({ nombre: regex, estado: true})
                            .populate('categoria', 'nombre')

    res.json( {
        results: productos
    } )
}

const buscarCategorias = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino )
    if( esMongoID ){
        const categoria = await Categoria.findById( termino )
        return res.json( {
            results: ( categoria ) ? [ categoria ] : []
        } )
    }

    const regex = new RegExp( termino, 'i')
    
    const categoria = await Categoria.find({ nombre: regex, estado:true})

    res.json({
        results: categoria
    })
}   
const buscarUsuarios = async( termino= '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino )
    if( esMongoID ){
        const usuario = await Usuario.findById( termino )
        return res.json( {
            results: ( usuario ) ? [ usuario ] : []
        } )
    }

    const regex = new RegExp( termino, 'i')

    const usuarios = await Usuario.find({ 
        $or: [{nombre: regex}, { correo: regex }],
        $and: [{ estado: true}]
     })

    res.json( {
        results: usuarios
    } )

}
const buscar = ( req, res = response) => {

    const { coleccion, termino} = req.params

    if(!coleccionesPermitidas.includes( coleccion )){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch( coleccion ){
        case 'categorias':
            buscarCategorias( termino, res )
        break
        case 'productos':
            buscarProductos( termino, res )
        break
        case 'usuarios':
            buscarUsuarios( termino, res )
        break
        default: res.status(500).json({
            msg: "Olvidé hacer está bsuqueda xd"
        })
    }
}

module.exports = {
    buscar
}