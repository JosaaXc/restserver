const { response } = require("express");
const { Categoria } = require('../models');

const obtenerCategorias = async(req, res = response ) => {

    const { limite=5, desde = 0 } = req.query
    const query = { estado: true }

    const [total, categoria ] = await Promise.all([
        Categoria.countDocuments( query ),
        Categoria.find( query )
        .populate('usuario', 'nombre')
        .skip( Number(desde) )
        .limit( Number(limite) )
    ])

    res.json({
        total,
        categoria
    })

}
const obtenerCategoria = async(req, res = response ) => {

    try {

        const id = req.params.id
        const categoria = await Categoria.findById( id ).populate('usuario', 'nombre')
        res.json(categoria)
        
    } catch (error) {

        console.log("Error en la categoria: ", error)
        res.status(500).json({
            error: "Error al encontrar la categoria, hable con el administrador"
        })

    }

}

const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase()
    
    const categoriaDB = await Categoria.findOne({ nombre })

    if( categoriaDB ){
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre} ya existe`
        })
    }
    //generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data )
    
    await categoria.save()
    
    res.status(201).json( categoria )

}

//actualizarcategoria
const actualizarCategoria = async( req, res= response ) => {
    try {
         
        const id = req.params.id
        const { _id, estado, usuario, ...resto} = req.body
        resto.nombre = resto.nombre.toUpperCase()
        resto.usuario = req.usuario._id

        const categoria = await Categoria.findByIdAndUpdate( id, resto, { new: true})
        
        res.json({
            msg: "Categoria actualizada",
            categoria
        })

    } catch (error) {
        res.status(500).json({
            error: "Error al actualizar, hable con el administrador"
        })
    }
}
//borrarCategoria - estado:false
const borrarCategoria = async(req, res= response) => {
    try {
        
        const { id } = req.params
        const categoria = await Categoria.findByIdAndUpdate( id, { estado: false}, { new: true })
        res.status(200).json({
            msg: "Categoria borrada - estado: false",
            categoria
        })

    } catch (error) {
        res.status(500).json({
            error: "Hable con el administrador"
        })
    }
}

module.exports = {
    crearCategoria,
    obtenerCategoria,
    obtenerCategorias,
    actualizarCategoria,
    borrarCategoria
}