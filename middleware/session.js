const sessionCheckMiddleWare = (req, res, next) => {
    if (!req.session) {
        res.redirect('/accounts/login');
    }
    next();
};
module.exports = sessionCheckMiddleWare;
