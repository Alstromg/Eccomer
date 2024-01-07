const  {Router}  = require('express')
const{ privateRoutes} = require("../middleware/auth.middleware")
const {getView, getRealtimeProducts} = require("../controladores/controladorView")




const router = Router()

router.get('/', privateRoutes(["admin", "premium", "user"]), getView );

router.get('/realtimeProducts', privateRoutes(["admin", "premium",]), getRealtimeProducts, );

module.exports = router; 