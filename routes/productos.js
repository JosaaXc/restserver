const { Router } = require('express')
const { check } = require('express-validator')

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares')
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos')
const { existeProducto, categoriaActiva, categoriaExisteActualizar, existeCategoria } = require('../helpers/db-validator')

const router = Router()

router.get('/', obtenerProductos)

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], obtenerProducto )
//Crear categoria - privado - cualquier persona con token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoria ),
    validarCampos
], crearProducto )
//Actualizar - privado - cualquiera con token válido
router.put('/:id', [
    validarJWT,
    // check('categoria', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], actualizarProducto )
// borrar una categoria - admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], borrarProducto )

module.exports = router