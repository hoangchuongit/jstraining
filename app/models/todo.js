var firebase = require("firebase-admin"); 

var db = firebase.database();
var ref = db.ref();

module.exports = ref.child("todos");