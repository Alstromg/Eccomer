const products = require("../dao/models/products");


//Funcion recorre todos los productos y pagina segun parametros
const getProducts = async (req, res) => {
    try {
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const filterOptions = {};
        
        if (req.query.stock) filterOptions.stock = req.query.stock;
        if (req.query.category) filterOptions.category = req.query.category;
        
        const paginateOptions = { lean: true, limit, page };
        
        if (req.query.sort === 'asc') paginateOptions.sort = { price: 1 };
        if (req.query.sort === 'desc') paginateOptions.sort = { price: -1 };
        
        const result = await products.paginate(filterOptions, paginateOptions);
        
        let prevLink;
        if (!req.query.page) {
            prevLink = `http://${req.hostname}:${8080}${req.originalUrl}?page=${result.prevPage}`;
        } else {
            const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.prevPage}`);
            prevLink = `http://${req.hostname}:${8080}${modifiedUrl}`;
        }
        
        let nextLink;
        if (!req.query.page) {
            nextLink = `http://${req.hostname}:${8080}${req.originalUrl}?page=${result.nextPage}`;
        } else {
            const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.nextPage}`);
            nextLink = `http://${req.hostname}:${8080}${modifiedUrl}`;
        }
        
        return {
            statusCode: 200,
            response: { 
                status: 'success', 
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? prevLink : null,
                nextLink: result.hasNextPage ? nextLink : null
            }
        };
    } catch (err) {
        return {
            statusCode: 500,
            response: { status: 'error', error: err.message }
        };
    }
};
//Funccion encuentra producto por su id
const getProductsById = async (req, res) => {
    const pid = req.params.pid
    try{
        const producto = await products.findById(pid)
        if(producto === null){
            return res.status(404).json({ status: "error", error: `Producti con id =${pid} no existe`})
        }return res.status(200).json({status: "success", data: producto})
 
    } catch(error){
        return res.status(500).json({ status: "error", error: "Error interno del servidor" });       
    }
}
//Crear un nuevo producto
const postProducts = async (req, res) => {
    try {
        const { title, description, price, code, stock, category  } = req.body;
        const nuevoProducto = new products({
        title: title,
        description: description,
        price: price,
        code:code ,
        stock:stock,
        category: category,
        });
        await nuevoProducto.save();
        res.status(201).json({ message: "Producto creado exitosamente", producto: nuevoProducto });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el producto" });
    }
};
//Borrar un producto
const deleteProductById = async (req, res) => {
    const pid = req.params.pid;
    try {
        const productoBorrar = await baseModel.findById(pid);
        if (productoBorrar === null) {
            return res.status(404).json({ status: "error", error: `Producto con id = ${pid} no existe` });
        } else {
            await baseModel.deleteMany({_id: pid}); 
            res.status(204).json(); 
        }
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ status: "error", error: "Error interno del servidor" });
    }
}

module.exports = { 
    getProducts,
    getProductsById, 
    postProducts,
    deleteProductById
    
 };
