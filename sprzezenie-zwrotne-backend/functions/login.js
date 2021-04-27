const got = require('got');
const OAuth = require('oauth-1.0a');
const qs = require('querystring');
require("dotenv").config();

let url = 'https://usosapps.umk.pl/services/oauth/request_token';

const oauth = OAuth({
    consumer: {
        key: process.env.OAUTH_CONSUMER_KEY,
        secret: process.env.OAUTH_CONSUMER_SECRET
    },
    signature_method: 'PLAINTEXT',
});



//This function is not working, it is being kept only for future reference purposes
// const login = async (logindata) => {
//     await got(url, {
//         headers: oauth.toHeader(oauth.authorize({ url: url, method: 'POST', data: { oauth_callback: 'http://127.0.0.1:5000/callback' } })),
//         searchParams: {
//             scopes: 'surveys_filling'
//         }
//     }).then(function (response) {
//         console.log("Response tutaj:");
//         console.log(response.body);
//         qs_body = qs.parse(response.body);
//         logindata.token.key = qs_body.oauth_token;
//         logindata.token.secret = qs_body.oauth_token_secret;
//         url = 'https://usosapps.umk.pl/services/oauth/authorize' + '?' + qs.stringify({ oauth_token: qs_body.oauth_token });
//     }).catch(function (error) {
//         console.log(error.response.body);
//         return error.response.body;
//     });
//     return url;
// }

const callback = async (token, verifier, userdata) => {
    url = 'https://usosapps.umk.pl/services/oauth/access_token';
    try{
        const response = await got(url, {
            headers: oauth.toHeader(oauth.authorize({
                url: url, method: 'POST',
                data: { oauth_verifier: verifier }
            }, token))
        });
        qs_tk = qs.parse(response.body);
        token.key = qs_tk.oauth_token;
        token.secret = qs_tk.oauth_token_secret;
    }
    catch(error){
        if(error.response){
            console.log(error.response.body);
            return error.response.body;
        }
        else{
            console.error(error);
        }
    }
    url = 'https://usosapps.umk.pl/services/users/user'
    try{
        const response = await got(url, {
            headers: oauth.toHeader(oauth.authorize({ url: url, method: 'POST' }, token)),
            searchParams: {
                fields: 'id|first_name|middle_names|last_name|sex|student_status|staff_status'
            },
            responseType: 'json'
        });
        userdata.id = response.body.id;
        userdata.first_name = response.body.first_name;
        userdata.middle_names = response.body.middle_names;
        userdata.last_name = response.body.last_name;
        userdata.sex = response.body.sex;
        userdata.student_status = response.body.student_status;
        userdata.staff_status = response.body.staff_status;
    }
    catch(error){
        if(error.response){
            console.log(error.response.body);
            return error.response.body;
        }
        else{
            console.error(error);
        }
    }

    url = 'https://usosapps.umk.pl/services/terms/search'
    var today = new Date().toISOString().slice(0, 10);
    try{
        var returnObject = await got(url, {
            headers: oauth.toHeader(oauth.authorize({url: url, method: 'POST'}, token)),
            searchParams:{
                min_finish_date: today,
                max_start_date: today
            }
        });
        var terms = JSON.parse(returnObject.body);
        terms.shift();
        userdata.term = terms[0].id;
    }
    catch(error){
        if(error.response){
            console.log(error.response.body);
            return error.response.body;
        }
        else{
            console.error(error);
        }
    }
}

const logout = async (token) => {
    url = 'https://usosapps.umk.pl/services/oauth/revoke_token';
    try{
        const response = await got(url, {
            headers: oauth.toHeader(oauth.authorize({
                url: url, method: 'POST'}, token))
        });
        return (response.body);
    }
    catch(error){
        if(error.response){
            console.log(error.response.body);
            return error.response.body;
        }
        else{
            console.error(error);
        }
    }
}

const isSystemUp = async () => {
    url = 'https://usosapps.umk.pl/services/apiref/scopes';
    try{
        const response = await got(url);
        return response.body?true:false;
    }
    catch(error){
        if(error.response){
            console.log(error.response.body);
            return false;
        }
        else{
            console.error(error);
            return false;
        }
    }
}




module.exports = {
    //login: login,
    callback: callback,
    logout: logout,
    isSystemUp: isSystemUp
}