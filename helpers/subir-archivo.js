const path = require('path')
const { v4: uuidv4 } = require('uuid')

const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) => {

    return new Promise(( resolve, reject )=> {

        const { archivo } = files
        const nombreCortado = archivo.name.split('.')
        const extension = nombreCortado[ nombreCortado.length - 1 ]
        // validar la extención 
        if(!extensionesValidas.includes( extension )){
            return reject(`La extension ${ extension } no está permitida, ${ extensionesValidas } son las permitidas.`)
        }

        const nombreTem = uuidv4() + '.' + extension

        const uploadPath = path.join( __dirname, '../uploads/', carpeta ,nombreTem )

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err)
            }

            resolve( nombreTem )
        })
        })

}

module.exports = {
    subirArchivo
}