const privateRoutes = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    if (req.session.user.role === 'admin') {
        return next();
    } else {
        return res.redirect('/');
    }
};

module.exports = { privateRoutes };