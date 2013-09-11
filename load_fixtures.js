var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/huayra-stats');

/* SCHEMAS */
var puntoSchema = mongoose.Schema({
    lat: Number,
    lng: Number,
    message: String,
});
var Punto = mongoose.model('Punto', puntoSchema)

var usuarioSchema = mongoose.Schema({
    nombre: String,
    hash: String,
});
var Usuario = mongoose.model('Usuario', usuarioSchema)


var punto = new Punto({
    	lat: -33.128351,
    	lng: -66.362915,
    	message: "Un punto inicial en San Luis"
});

punto.save();


var admin = new Usuario({nombre: 'admin', hash: '123'});
admin.save();