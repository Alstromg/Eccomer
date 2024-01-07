const {Router} = require("express")
const {putUserRole, getUser} = require('../controladores/controlUsers')
const router = Router()

router.get('/:cid', getUser)

router.put('/premium/:cid', putUserRole)

module.exports = router;