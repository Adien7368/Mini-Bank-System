const { signUp, verify, login, handleTransaction, transactionHistory } = require('./authAPI')


function authControllers(router) {
    router.post( '/register'   , signUp);
    router.post( '/login'     , login);
}

function featureController(router){
    router.post( '/verification', verify);
    router.post( '/transaction', handleTransaction)
    router.get( '/history'   , transactionHistory);
}


module.exports = { authControllers, featureController };