const { signUp, verify, login } = require('./authAPI')


function authControllers(router) {
    router.post( '/register'   , signUp);
    router.post( '/verification', verify);
    router.post( '/login'     , login);
    // router.delete( '/logout'   , logout);
    // router.patch( '/resetpass' , resetPassword);
    // router.patch( '/updatePass', updatePassword);
}




module.exports = { authControllers };