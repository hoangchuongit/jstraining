// set up ======================================================================
var express = require("express");
var app = express(); 						// create our app w/ express
var firebase = require("firebase-admin");           // firebase-admin for firebasedb
var port = process.env.PORT || 8080; 				// set the port
var serviceAccount = require("./app/serviceAccountKey.json"); // load the database config
var morgan = require("morgan");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

// configuration ===============================================================
// Connect to local FirebaseDB instance. A remoteUrl is also available (modulus.io)
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://jstraining-chuong.firebaseio.com"
});

app.use(express.static("./public")); 		// set the static files location /public/img will be /img for users
app.use(morgan("dev")); // log every request to the console
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json
app.use(methodOverride("X-HTTP-Method-Override")); // override with the X-HTTP-Method-Override header in the request
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', "Content-Type");
    next();
});

// routes ======================================================================
require("./app/routes.js")(app);

// listen (start app with node server.js) ======================================
app.listen(port);
// console.log("App listening on port " + port);