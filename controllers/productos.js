const { response } = require("express");
const { Producto } = require('../models');

const obtenerProductos = async(req, res = response ) => {

    const { limite=5, desde = 0 } = req.query
    const query = { estado: true }

    const [total, productos ] = await Promise.all([
        Producto.countDocuments( query ),
        Producto.find( query )
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip( Number(desde) )
        .limit( Number(limite) )
    ])

    res.json({
        total,
        productos
    })

}
const obtenerProducto = async(req, res = response ) => {

    try {

        const id = req.params.id
        const producto = await Producto.findById( id )
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')

        res.json(producto)
        
    } catch (error) {

        console.log("Error en el proucto: ", error)
        res.status(500).json({
            error: "Error al encontrar el prodcuto, hable con el administrador"
        })

    }

}

const crearProducto = async(req, res = response) => {

    const {estado, usuario, ...body} = req.body
    
    const productoDB = await Producto.findOne({ nombre: body.nombre })

    if( productoDB ){
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre} ya existe`
        })
    }
    //generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto( data )
    
    await producto.save()
    
    res.status(201).json( producto )

}

//actualizarcategoria
const actualizarProducto = async( req, res= response ) => {
    try {
         
        const id = req.params.id
        const { estado, usuario, ...resto} = req.body
        if(resto.nombre){
            resto.nombre = resto.nombre.toUpperCase()
        }

        resto.usuario = req.usuario._id

        const producto = await Producto.findByIdAndUpdate( id, resto, { new: true})
        
        res.json({
            msg: "Producto actualizado",
            producto
        })

    } catch (error) {
        res.status(500).json({
            error: "Error al actualizar, hable con el administrador"
        })
    }
}
//borrarCategoria - estado:false
const borrarProducto = async(req, res= response) => {
    try {
        
        const { id } = req.params
        const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false}, { new: true })
        res.status(200).json({
            msg: "Categoria borrada - estado: false",
            productoBorrado
        })

    } catch (error) {
        res.status(500).json({
            error: "Hable con el administrador"
        })
    }
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}