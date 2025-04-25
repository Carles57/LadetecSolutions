module.exports = {

    SiEstaLogueado(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
            return res.redirect('/signin');
        },

    SiNoEstaLogueado(req, res, next) {
            if (!req.isAuthenticated()) {
                return next();
            } 
                return res.redirect('/profile');
    }

};
