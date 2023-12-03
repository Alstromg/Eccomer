const  {Router}  = require('express')
const {generateUser} = require('../services/utils')
const router = Router()


router.get("/",async(req, res) => {
    const users = []
    for (let index = 0; index < 100; index++) {
        users.push(generateUser())
    }
    res.send({ status: 'success', payload: users }) 
})


module.exports = router