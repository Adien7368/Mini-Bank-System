const { signUp, verify, login, handleTransaction, transactionHistory } = require('./authAPI')


function authControllers(router) {
    router.post( '/register'   , signUp);
    router.post( '/verification', verify);
    router.post( '/login'     , login);
    router.post( '/transaction', handleTransaction)
    router.get( '/history'   , transactionHistory);
    // router.patch( '/resetpass' , resetPassword);
    // router.patch( '/updatePass', updatePassword);
}




module.exports = { authControllers };