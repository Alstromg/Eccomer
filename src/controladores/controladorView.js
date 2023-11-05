const {getProducts} = require('./constroladorProduct')


//Funccion para la vista de productos
const getView = async (req, res) => {
    try {
    const result = await getProducts(req, res)
    if (result.statusCode === 200) {
        const totalPages = []
        let link
        for (let index = 1; index <= result.response.totalPages; index++) {
            if (!req.query.page) {
                link = `http://${req.hostname}:${8080}${req.originalUrl}?page=${index}`
            } else {
                const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${index}`)
                link = `http://${req.hostname}:${8080}${modifiedUrl}`
            }
            totalPages.push({ page: index, link })
        }
        const user = req.session.user
        res.render('home', {
            user,
            products: result.response.payload, paginateInfo: {
                hasPrevPage: result.response.hasPrevPage,
                hasNextPage: result.response.hasNextPage,
                prevLink: result.response.prevLink,
                nextLink: result.response.nextLink,
                totalPages
            }
        })
    } else {
        res.status(result.statusCode).json({ status: 'error', error: result.response.error })
    }
}catch(err){
    console.error("Error al crear el carrito:",);
    res.status(500).json({ status: "error", error: "Error interno del servidor" });
}
}
const getRealtimeProducts = async (req, res) => {
    try {
      const products = await baseModel.find().lean().exec();
      res.render('realTimeProducts', { products }); // Utiliza res.render para renderizar una vista
    } catch (err) {
      res.status(500).json({ status: "error", error: "Error interno del servidor" });
    }
  }



module.exports = {
    getView,
    getRealtimeProducts
}