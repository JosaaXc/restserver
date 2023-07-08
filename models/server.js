const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')
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

    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.buscar, require('../routes/buscar'))
        this.app.use(this.paths.categorias, require('../routes/categorias'))
        this.app.use(this.paths.productos, require('../routes/productos'))
        this.app.use(this.paths.usuarios, require('../routes/users'))
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log("Servido corriendo en prueto ", this.port)
        })
    }
}

module.exports = Server