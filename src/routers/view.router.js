const  {Router}  = require('express')
const{ privateRoutes} = require("../middleware/auth.middleware")
const {getView, getRealtimeProducts} = require("../controladores/controladorView")




const router = Router()

router.get('/' ,getView)

router.get('/realtimeProducts', privateRoutes, getRealtimeProducts );

module.exports = router; 