const logger = require('../logger')

const privateRoutes = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    if (req.session.user.role === 'admin') {
        logger.info('Admin logeado')
        return next();
    } else {
        logger.warning('Usuario No autorizado')
        return res.redirect('/');
    }
};

module.exports = { privateRoutes };