import _ from 'lodash'


export function signUp(req, res, next) {
    var name = _.trim(req.body.name);
    var email = _.trim(req.body.email);
    var passsword = _.trim(req.body.passsword);

}


export function login(req, res, next){
    var email = _.trim(req.body.email);
    var password = _.trim(req.body.passsword);

}

export function logout(req, res, next){
    
}

export function resetPassword(req, res, next){
    var email = _.trim(req.body.email);
}

export function updatePassword(req, res, next){
    
}

