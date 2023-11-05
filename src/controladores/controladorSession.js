const config = require('../config/config')


//Redirecciona  a la vista register 
const getRegister = async(req, res) => {
    res.redirect("sessions/register")
}
//Redurecciona a home
const postRegister =  async (req, res) => {
    res.redirect("/")
}
//Redirecciona a la vista login 
const getLogin = (req,res) =>{
    res.render('sessions/login')
}
//verifica usuario 
const postLogin = (req, res) => {
    if (req.user) {
        if (
            req.user.email === config.admin.adminEmail &&
            req.user.password === config.admin.adminPass
        ) {
            req.session.user = {
                first_name: 'Administrador',
                email: config.admin.adminEmail,
                role: 'admin'
            };
        } else {
           
            req.session.user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                cart: req.user.cart,
                role: req.user.role
            };
        }
        res.redirect('/products');
    } else {
       
        res.status(400).send({ status: 'error', error: 'Credenciales Inválidas' });
    }
}
//Cierra la cesion iniciada
const getLogout = (req,res) =>{
    req.session.destroy(err =>{
        if(err){
          res.status(500).render('errors/base', {error:err})  
        }else res.redirect('/')
    }
        )
    }
// Redirecciona a la vista de datos del usuario logeado
const getCurrent = async (req,res) =>{
    req.session.user = req.user
    res.redirect("/current");
}
// git callback
const getGitHubCallback = async(req,res) =>{
    req.session.user = req.user
    res.redirect('/products')
   }
   
module.exports = {
    getRegister, 
    postRegister,
    getLogin,
    postLogin,
    getLogout,
    getCurrent,
    getGitHubCallback
}