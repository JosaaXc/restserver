const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')
const fileUpload = require('express-fileupload')
class Server {

    constructor(){
        this.app = express()

        this.port = process.env.PORT

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/users',
            uploads:   '/api/uploads',
        }

        //conectar a base de datos
        this.conectarDB()
        //Middlewares
        this.middlewares()

        //Rutas de mi aplicación
        this.routes()
    }

    async conectarDB(){
        await dbConnection()
    }

    middlewares(){

        this.app.use(cors())
        //Lectura y Parseo
        this.app.use( express.json() )

        //directorio public
        this.app.use( express.static('public') )

        //Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.buscar, require('../routes/buscar'))
        this.app.use(this.paths.categorias, require('../routes/categorias'))
        this.app.use(this.paths.productos, require('../routes/productos'))
        this.app.use(this.paths.usuarios, require('../routes/users'))
        this.app.use(this.paths.uploads, require('../routes/uploads'))
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log("Servido corriendo en prueto ", this.port)
        })
    }
}

module.exports = Server