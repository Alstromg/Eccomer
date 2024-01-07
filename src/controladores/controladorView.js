
const productDao = require('../dao/viewDAO.JS');
const logger = require('../logger')
const config = require('../config/config')
const getView = async (req, res) => {
    try {
        const result = await productDao.getProducts(req.query);

        if (result.status === 'success') {
            const totalPages = [];
            for (let index = 1; index <= result.totalPages; index++) {
                const link = index === 1 ? `/products` : `/products?page=${index}`;
                totalPages.push({ page: index, link });
            }

            const user = req.session.user;

            res.render('home', {
                user,
                products: result.payload,
                paginateInfo: {
                    hasPrevPage: result.hasPrevPage,
                    hasNextPage: result.hasNextPage,
                    prevLink: result.prevLink,
                    nextLink: result.nextLink,
                    totalPages,
                },
            });
        } else {
            res.status(500).json({ status: 'error', error: 'Error al obtener productos' });
        }
    } catch (err) {
        logger.error('Error al obtener productos:', err);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
};
const getRealtimeProducts = async (req, res) => {
    try {
        const user = res.locals.user;
        if (!user) {
            return res.redirect('/');
        }

        let products;

        if (user.email === config.admin.adminEmail) {
            const allProductsResult = await productDao.getProducts(req.query);
            if (allProductsResult.status === 'success') {
                products = allProductsResult.payload || [];
            } else {
                return res.status(500).json({ status: 'error', error: 'Error al obtener todos los productos' });
            }
        } else {
            const userProductsResult = await productDao.getRealtimeProductsByOwner(user.email);
            if (userProductsResult.status === 'success') {
                products = userProductsResult.payload || [];
            } else {
                return res.status(500).json({ status: 'error', error: 'Error al obtener productos por propietario' });
            }
        }

        res.render('realTimeProducts', { products, user });
    } catch (err) {
        logger.error('Error al obtener productos en tiempo real:', err);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
};





module.exports = {
    getView,
    getRealtimeProducts
};