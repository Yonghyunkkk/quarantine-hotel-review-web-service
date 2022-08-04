const User = require('../models/user');

module.exports.renderRegisterForm = (req,res) => {
    res.render('users/register');
}

module.exports.registerUser = async(req,res,next) => {
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Successfully Logged In');
            res.redirect('/hotels'); 
        });
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLoginForm = (req,res) => {
    res.render('users/login');
}

module.exports.login = async(req,res) => {
    req.flash('success', 'Succesfully Logged In');
    const redirectUrl = req.session.returnTo || '/hotels';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = async (req,res,next) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/hotels');
}