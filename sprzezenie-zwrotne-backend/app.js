const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const login = require('./functions/login.js');
const mongoQuery = require('./mongoQuery.js');
const qs = require('querystring');
const MongoStore = require('connect-mongo') (session);
const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');
const OAuth1Strategy = require('passport-oauth1');
require("dotenv").config();

const usosSurveysRouter = require('./routers/usosSurveys-router.js');
const surveysRouter = require('./routers/surveys-router.js')

const {
    PORT = 5000,
    SESSION_LIFETIME = 1000 * 60 * 30, //1s -> 1m -> 0.5h
    SESSION_NAME = 'sid',
    SESSION_SECRET = 'secretsession123',
    MONGO_URL = "",
    MONGO_DBNAME = ""
} = process.env

//Strategia, ktora passport bedzie uzywal do uwierzytelniania
//W requestTokenURL strategii passportu przekazujemy parametr scopes odpowiedzialny za uprawnienia odpowiednich modulow USOSa
passport.use(new OAuth1Strategy({
    requestTokenURL: 'https://usosapps.umk.pl/services/oauth/request_token?scopes=surveys_filling',
    accessTokenURL: 'https://usosapps.umk.pl/services/oauth/access_token',
    userAuthorizationURL: 'https://usosapps.umk.pl/services/oauth/authorize',
    consumerKey: process.env.OAUTH_CONSUMER_KEY,
    consumerSecret: process.env.OAUTH_CONSUMER_SECRET,
    callbackURL: "http://127.0.0.1:5000/callback",
    signatureMethod: "PLAINTEXT",
},
    function (token, tokenSecret, profile, cb) {
    }
));

//Ustawienia polaczenia z baza MongoDB
const mongoInfo = {
    url: MONGO_URL,
    dbName: MONGO_DBNAME
}

//Ustawienie miejsca zapisywania informacji o sesjach na baze danych MongoDB
var sessionStore = new MongoStore({
    url: MONGO_URL + "/" + MONGO_DBNAME
});

//Ustawienia sesji
const sessionParams = {
    name: SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    store: sessionStore,
    rolling: true,
    cookie: {
        maxAge: SESSION_LIFETIME,
    }
}

const app = express();

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    sessionParams.cookie.secure = true;
}

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

app.use(function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type");
    next();
});  

app.use(session(sessionParams));

//Zmienne zapisywane dla danej sesji
app.use(function (req, res, next) {
    if(!req.session.token){
        req.session.token = {
            key: null,
            secret: null
        }
    }
    if(!req.session.userData){
        req.session.userData = {
            id: null,
            first_name: null,
            middle_names: null,
            last_name: null,
            sex: null,
            student_status: null,
            staff_status: null,
            term: null
        }
    }
    next();
})

//Rozpoczecie uwierzytelniania
app.get('/login', passport.authenticate('oauth'), function(req, res){
});

//Po zalogowaniu przekierowuje do /callback
//Tutaj uzyskujemy Access Token (przy uzyciu login.callback()) dzieki ktoremu mozemy wywolywac zapytania do USOSa
//W tym miejscu sa rowniez usuwane sesje uzywane podczas procesu logowania, natiomiast poprawne tokenu sa ustawiane w oryginalnej sesji z ktorej zaczynalismy logowanie
//Dzieki temu po przekierowaniu do frontendu, jestesmy w poprawnej sesji, z ktorej mozemy wykonywac zapytania
app.get('/callback', async function(req, res){
    const verifier = qs.parse(req.originalUrl).oauth_verifier;
    if(!verifier){
        res.redirect('/login');
        return;
    }
    var oauthCallbackToken = qs.parse(req.originalUrl)['/callback?oauth_token'];
    const client = await MongoClient.connect(mongoInfo.url, {useUnifiedTopology: true});
    await mongoQuery.findQuery(client, mongoInfo, 'sessions', {session: new RegExp('"oauth_token":"' + oauthCallbackToken + '"')})
    .then(function (ret){
        req.sessionStore.get(ret[0]._id, function (err, session) {
            if (err) {
                console.error("Error while getting session data", err);
            }
            if (session) {
                req.session.token.key = session.oauth.oauth_token;
                req.session.token.secret = session.oauth.oauth_token_secret;
            }
        }).then(function () {

            login.callback(req.session.token, verifier, req.session.userData)
                .then(function () {
                    req.sessionStore.set(ret[0]._id, req.session, function (err) {
                        if(err)
                            console.error(err);
                    });
                    req.session.destroy(function(err){
                        if(err)
                            console.error(err);
                    })
                    res.redirect("http://localhost:3000");
                })
        });
    });
    client.close();
});

//Wylogowanie, ktore usuwa sesje ze "store" - czyli w tym przypadku bazy danych
//Tutaj wywoluje sie zapytanie do USOS o usuniecie Access Token'a
app.get('/logout', async function(req, res){
    if(!req.session.token.key){
        return;
    }
    await login.logout(req.session.token);
    req.sessionStore.destroy(req.sessionID, function (err) {
        if (err)
            console.error(err);
        else {
            res.json({ message: "Logged out" });
        }
    })
});

//Posrednik, ktory bedzie sprawdzal czy uzytkownik jest zalogowany
function isLoggedIn(req, res, next){
    if(req.session.token.key){
        next();
    }
    else{
        res.status(403);
        res.send('Not logged in')
    }
}

//Tutaj pobrane moga byc podstawowe dane uzytkownika
app.get('/getUserInfo', function(req, res){
    res.json(req.session.userData);
});

//Tutaj pobrane moga byc podstawowe dane uzytkownika
app.get('/isSystemUp', async function(req, res){
    const isUp = await login.isSystemUp();
    res.json({status: isUp});
});

//Modul funkcji ankiet USOS
app.use("/usosSurveys", isLoggedIn, usosSurveysRouter);

//Modul funkcji ankiet
app.use("/surveys", isLoggedIn, surveysRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


module.exports = app;