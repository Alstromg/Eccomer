const logger = require('../logger')

const privateRoutes = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/');
    }

    const userRole = req.session.user.role;

    res.locals.user = req.session.user;

    if (allowedRoles.includes(userRole)) {
      logger.info(`${userRole} logeado`);
      return next();
    } else {
      logger.warning('Usuario no autorizado');
      return res.redirect('/');
    }
  };
};


module.exports = { privateRoutes };