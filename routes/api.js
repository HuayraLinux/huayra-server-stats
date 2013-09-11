var http = require('http');
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

var eventoSchema = mongoose.Schema({
    texto: String,
    clase: String, // warning, success, info
    fecha: {type: Date, default: Date.now}
});
var Evento = mongoose.model('Evento', eventoSchema)


var usuarioSchema = mongoose.Schema({
    nombre: String,
    hash: String,
});
var Usuario = mongoose.model('Usuario', usuarioSchema)


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

function crear_punto_desde_mac(ip, mac, callback) {
	var url = "http://api.hostip.info/get_json.php?ip=" + ip + "&position=true";

	getJSON(url, function(data) {
		var data = {
			lat: data.lat,
			lng: data.lng,
			mac: mac,
			ip: ip,
			message: "Equipo mac: " + mac + " ip:" + ip
		}

		var punto = new Punto(data);
		callback(punto);
	});
}

function crear_punto_desde_request(req, callback) {
	var data = {
		lat: req.body.lat,
		lng: req.body.lng,
		mac: "- dato de prueba -",
		ip: "- dato de prueba -",
		message: "Equipo de prueba"
	}

	var punto = new Punto(data);
	return punto;
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
 *     curl -d "mac=3c:d9:2b:59:0a:df" http://localhost:3000/api/puntos
 */
exports.crear_punto = function(req, res) {
	var punto;

	if (req.body.mac) {
		var ip = "190.2.11.125";
		var mensaje = "Se ha conectado un equipo: mac=" + req.body.mac + " ip=" + ip;
		crear_evento(mensaje);

		crear_punto_desde_mac(ip, req.body.mac, function(punto) {
			punto.save();
			// TODO: No exponer el registro de la base de datos.
			res.json({ip: ip, mensaje: mensaje, punto: punto});
		});
	} else {
		res.status(400);
		res.json({error: 400});
	}
}

/*
 * Se le notifica que ha llegado un nuevo equipo al sistema.
 *
 * Ejemplo de invocación:
 * 
 *     curl -d "lat=-34.428351&lng=-66.362915&contenido=Hola" http://localhost:3000/api/puntosprueba
 */
exports.crear_punto_prueba = function(req, res) {
 	if (req.body.ip === undefined) {
 		crear_evento("Se ha conectado un equipo nuevo.");
 		punto = crear_punto_desde_request(req);
 		punto.save();
 		res.json({status: 'ok', punto: punto});
 	}
}