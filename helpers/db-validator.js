const { Categoria, Producto } = require('../models')
const Role = require('../models/role')
const Usuario = require('../models/users')

const esRoleValido = async(rol='') => {

    const existRol = await Role.findOne({ rol })
    if( !existRol){
        throw new Error(`El rol ${rol} no existe`)
    }

}

const existEmail = async(correo = '') => {

    const existEmail = await Usuario.findOne({ correo })
    if(existEmail){
        throw new Error(`EL correo ${correo} ya existe`)
    }
}
const existUsuarioById = async(id ) => {

    const existUsuario = await Usuario.findById( id )
    if(!existUsuario){
        throw new Error(`El usuario con id ${id} no existe`)
    }
}
const existeCategoria = async( id ) => {

    const existcategory = await Categoria.findById( id )
    if(!existcategory){
        throw new Error(`La categoria con id ${id} no existe`)
    }
}
const existeProducto = async( id ) => {

    const existProducto = await Producto.findById( id )
    if(!existProducto){
        throw new Error(`El producto con id ${id} no existe`)
    }
}

const categoriaActiva = async ( id ) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria.estado) {
      throw new Error(`La categoria ${existeCategoria.nombre} no existe o fue eliminada`);
    }
}

const categoriaExisteActualizar = async (req, res, next) => {
    const { nombre } = req.body;
    const { id } = req.params;
    const nombreActualizado = nombre.toUpperCase();
  
    try {
      const categoriaActual = await Categoria.findById(id);
  
      if (categoriaActual.nombre !== nombreActualizado) {
        const existeCategoria = await Categoria.findOne({ nombre: nombreActualizado });
  
        if (existeCategoria) {
          throw new Error(`La categoría ${nombreActualizado} ya existe`);
        }
      }
  
      next(); // Pasar al siguiente middleware si no hay errores
    } catch (error) {
        res.status(400).json({
            error: `La categoria ${nombre} ya existe`
        })
    }
  };

//validar colecciones permitidas

const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {

    const incluida = colecciones.includes( coleccion )
    if(!incluida){
        throw new Error(`La colección ${ coleccion } no es permitida, ${ colecciones } son las permitidas`)
    }

    return true
}
  

module.exports = {
    esRoleValido,
    existEmail,
    existUsuarioById,
    existeCategoria,
    existeProducto,
    categoriaActiva,
    categoriaExisteActualizar,
    coleccionesPermitidas
}