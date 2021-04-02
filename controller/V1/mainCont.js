import { login, signUp } from "./authAPI";


function authControllers(router) {
    router.post( '/register'   , signUp);
    router.patch( '/login'     , login);
    router.delete( '/logout'   , logout);
    router.patch( '/resetpass' , resetPassword);
    router.patch( '/updatePass', updatePassword);
}



