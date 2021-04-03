const { signUp, verify, login, handleTransaction, transactionHistory, generatePDF, handleFileRequest } = require('./authAPI')


function authControllers(router) {
    router.post( '/register'   , signUp);
    router.post( '/login'     , login);
}

function featureController(router){
    router.post( '/verification', verify);
    router.post( '/transaction', handleTransaction);
    router.get( '/history'   , transactionHistory);
    router.get( '/hitoryPDF', generatePDF);
    router.get( '/genpdf/:filename', handleFileRequest);
}


module.exports = { authControllers, featureController };