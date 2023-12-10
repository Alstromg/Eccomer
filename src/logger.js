const winston = require('winston')
const dotenv = require('dotenv')

dotenv.config()

const customWinstonLevels = {
    levels:{
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal:5
},}
const createLogger = env => {
    if(env === 'PROD'){
        return winston.createLogger({
            levels: customWinstonLevels.levels,
            transports:[
                new winston.transports.File({
                    filename: 'errors.log',
                    level:'fatal',
                    format: winston.format.json()
                })

            ]
        })
    }else{
        return winston.createLogger({
            levels: customWinstonLevels.levels,
            transports:[new winston.transports.Console({
            level: 'fatal',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                winston.format.simple(),  
            )
        }),]
        })
        
    }
}
const logger = createLogger(process.env.ENVIRONMENT)
module.exports = logger;