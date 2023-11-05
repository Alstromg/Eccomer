const dotenv = require('dotenv')

dotenv.config()

const config = {
mongo: {
    uri: process.env.MongoDB,
    dbName:process.env.MongoName
},
admin:{
    adminEmail: process.env.emailAdm,
    adminPass: process.env.adminPass
}}
module.exports = config;