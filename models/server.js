const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')
class Server {

    constructor(){
        this.app = express()

        this.port = process.env.PORT
        this.usersPath = '/api/users'
        this.authPath  = '/api/auth'

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
        this.app.use(this.authPath, require('../routes/auth'))
        this.app.use(this.usersPath, require('../routes/users'))
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log("Servido corriendo en prueto ", this.port)
        })
    }
}

module.exports = Server