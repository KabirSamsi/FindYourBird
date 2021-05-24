module.exports = function(func) { //Execute asynchronous function with catch block
    return function(req, res, next) {
        func(req, res, next).catch(err => {
            req.flash('error', 'An Error Occurred');
            return res.redirect('back');
        });
    }
}
