const { signUp, verify, login, handleTransaction } = require('./authAPI')


function authControllers(router) {
    router.post( '/register'   , signUp);
    router.post( '/verification', verify);
    router.post( '/login'     , login);
    router.post( '/transaction', handleTransaction)
    // router.delete( '/logout'   , logout);
    // router.patch( '/resetpass' , resetPassword);
    // router.patch( '/updatePass', updatePassword);
}




module.exports = { authControllers };