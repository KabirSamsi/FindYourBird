module.exports = function(func) {
    return function(req, res, next) {
        func(req, res, next).catch(err => {
            console.log(err);
            req.flash('error', 'An Error Occurred');
            return res.redirect('back');
        });
    }
}
