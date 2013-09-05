var http = require('http');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/huayra-stats');

/* SCHEMAS */
var puntoSchema = mongoose.Schema({
    lat: Number,
    lng: Number,
    message: String,
});
var Punto = mongoose.model('Punto', puntoSchema)

var eventoSchema = mongoose.Schema({
    texto: String,
    clase: String, // warning, success, info
    fecha: {type: Date, default: Date.now}
});
var Evento = mongoose.model('Evento', eventoSchema)


exports.puntos = function(req, res) {
	Punto.find(function(err, data) {
		res.json(data);
	});
}

exports.eventos = function(req, res) {
	Evento.find(function(err, data) {
		res.json(data);
	});
}

function crear_punto_desde_request(req) {
	var data = {
			lat: req.body.lat,
			lng: req.body.lng,
			message: req.body.contenido
	};

	return new Punto(data);
}

function getJSON(url, callback) {
	http.get(url, function(res) {
	    var body = '';

	    res.on('data', function(chunk) {
	        body += chunk;
	    });

	    res.on('end', function() {
	        var fbResponse = JSON.parse(body)
	        callback(fbResponse);
	    });
	}).on('error', function(e) {
	      console.log("Got error: ", e);
	});
}

function crear_punto_desde_ip(ip, callback) {
	var url = "http://api.hostip.info/get_json.php?ip=" + ip + "&position=true";

	getJSON(url, function(data) {
		var data = {
			lat: data.lat,
			lng: data.lng,
			message: "IP: " + data.ip
		}

		var punto = new Punto(data);
		callback(punto);
	});
}

function crear_evento(mensaje) {
	var evento = new Evento({texto: mensaje, clase: 'success'});
	evento.save();
}

/*
 * Se le notifica que ha llegado un nuevo equipo al sistema.
 *
 * Ejemplo de invocación:
 *
 *     curl -d "lat=-34.428351&lng=-66.362915&contenido=Hola" http://localhost:3000/api/puntos
 *
 * o bien:
 *
 *     curl -d "ip=190.2.11.125" http://localhost:3000/api/puntos
 */
exports.crear_punto = function(req, res) {
	var punto;

	if (req.body.ip === undefined) {
		crear_evento("Se ha conectado un equipo nuevo.");
		punto = crear_punto_desde_request(req);
		punto.save();
		res.json({});
	} else {
		crear_evento("Se ha conectado un equipo desde la ip: " + req.body.ip);
		crear_punto_desde_ip(req.body.ip, function(punto) {
			punto.save();
			res.json({});
		});
	}
}