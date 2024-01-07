
const productsDAO = require("../dao/productDao")
const {createError} =require ('../services/errors/custom_error.js')
const EErros  = require ('../services/errors/enums.js')
const generateErrorInfo =require ('../services/errors/info.js')
const logger = require('../logger')
const config = require('../config/config.js')
const getProducts = async (req, res) => {
    try {
        const result = await productsDAO.getProducts(req.query);
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

const getProductsById = async (req, res) => {
    const pid = req.params.pid;

    try {
        const producto = await productsDAO.getProductById(pid);
        return res.status(200).json({ status: "success", data: producto });
    } catch (err) {
        const customError = createError({
            name: "Producto no encontrado",
            cause: generateErrorInfo.generateInfo(pid),
            message: "Error al buscar el producto",
            code: EErros.INVALID_TYPES_ERROR
        });
        logger.error('Lanzando el error',  err);
        return res.status(500).json({ status: "error", error: customError });
    }
};




const putProduct = async (req, res) => {
    const pid = req.params.pid;
    const { stock } = req.body; 
  
    try {
      const producto = await productsDAO.editProduct(pid, { stock });
  
      if (!producto) {
        return res.status(404).json({ status: "error", error: `Producto con id = ${pid} no existe` });
      }
  
      return res.status(200).json({ status: "success", data: producto });
    } catch (err) {
        const customError = createError({
            name: "Producto no encontrado",
            cause: generateErrorInfo.generateInfo(pid),
            message: "Error al buscar el producto",
            code: EErros.INVALID_TYPES_ERROR
        });
        logger.error('Lanzando el error',  err);
        return res.status(500).json({ status: "error", error: customError });
    }
  }
  const postProducts = async (req, res ) => {
    const { title, description, price, code, stock, category } = req.body
    const user = req.session.user;
    try {
        if(user.email === config.admin.adminEmail){
            const nuevoProducto = await productsDAO.createProduct({
                title: title,
                description: description,
                price: price,
                code: code,
                stock: stock,
                category: category,
                owner: "admin"
            });
            res.status(201).json({ message: 'Producto creado exitosamente', producto: nuevoProducto });
        }else{
            const nuevoProducto = await productsDAO.createProduct({
                title: title,
                description: description,
                price: price,
                code: code,
                stock: stock,
                category: category,
                owner: user.email
            });
            res.status(201).json({ message: 'Producto creado exitosamente', producto: nuevoProducto });
        }
    } catch (error) {
        const customError = createError({
            name: "Producto no Agregado ",
            cause: generateErrorInfo.generateInfopost(title),
            message: "Error al agregar producto",
            code: EErros.INVALID_TYPES_ERROR
        });
        logger.error('Lanzando el error', error); 
        return res.status(500).json({ status: "error", error: customError });
    }
};

const deleteProductById = async (req, res) => {
    const pid = req.params.pid;

    try {
        const productoBorrar = await productsDAO.getProductById(pid);

        if (!productoBorrar) {
            res.status(500).json( {status:'error'})
        }

        await productsDAO.deleteProduct(pid);
        res.status(204).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        const customError = createError({
            name: "Producto no encontrado",
            cause: generateErrorInfo.generateInfo(pid),
            message: "Error al buscar el producto",
            code: EErros.INVALID_TYPES_ERROR
        });
        logger.error('Lanzando el error',  err);
        return res.status(500).json({ status: "error", error: customError });
    }
};


module.exports = { 
    getProducts,
    getProductsById, 
    postProducts,
    deleteProductById,
    putProduct
};
