var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/huayra-stats');

/* SCHEMAS */
var puntoSchema = mongoose.Schema({
    lat: Number,
    lng: Number,
    mac: String,
    ip: String,
    message: String,
});
var Punto = mongoose.model('Punto', puntoSchema)

var usuarioSchema = mongoose.Schema({
    nombre: String,
    hash: String,
});
var Usuario = mongoose.model('Usuario', usuarioSchema)


puntos = [
  {lat: -24.18684742852123,   lng: -64.75341796875},
  {lat: -27.916766641249062,  lng: -66.357421875},
  {lat: -27.527758206861897,  lng: -60.3369140625},
  {lat: -29.611670115197377,  lng: -63.193359375},
  {lat: -29.382175075145277,  lng: -57.65625},
  {lat: -30.67571540416773,   lng: -60.99609375},
  {lat: -31.95216223802496,   lng: -67.67578125},
  {lat: -32.39851580247402,   lng: -64.16015625},
  {lat: -34.016241889667015,  lng: -62.138671875},
  {lat:  40-34.089061315499,  lng: -59.501953125},
  {lat: -35.6037187406973,    lng: -68.466796875},
  {lat: -36.24427318493909,   lng: -64.951171875},
  {lat: -36.949891786813275,  lng: -60.29296875},
  {lat: -35.675147436084664,  lng: -59.94140625},
  {lat: -35.101934057246055,  lng: -60.205078125},
  {lat: -38.13455657705411,   lng: -66.09375},
  {lat: -42.94033923363182,   lng: -68.115234375},
  {lat: -44.777935896316215,  lng: -69.08203125},
  {lat: -50.06419173665909,   lng: -70.751953125},
];

for (i=0; i<puntos.length; i++) {

  var punto = new Punto({
    lat: puntos[i].lat,
    lng: puntos[i].lng,
    message: "Equipo ip=200.10.199.103"
  });

  punto.save();
  console.log(punto);
}

var admin = new Usuario({nombre: 'admin', hash: '123'});
admin.save();

process.exit(0);
