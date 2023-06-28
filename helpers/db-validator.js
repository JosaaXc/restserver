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

module.exports = {
    esRoleValido,
    existEmail,
    existUsuarioById
}