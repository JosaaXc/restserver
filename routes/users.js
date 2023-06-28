const { Router } = require('express')
const { usersGet, usersPost, usersPut, usersPatch, usersDelete } = require('../controllers/users')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { esRoleValido, existEmail, existUsuarioById } = require('../helpers/db-validator')
const router = Router()


router.get('/', usersGet)

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existUsuarioById ),
    check('rol').custom( esRoleValido ),
    validarCampos
] ,usersPut)

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser mayor a 6 digitos').isLength( { min: 6}),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( existEmail ),
    // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( esRoleValido ),
    validarCampos
] ,usersPost)

router.patch('/', usersPatch)

router.delete('/:id', 
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existUsuarioById ),
    validarCampos,
usersDelete)



module.exports = router