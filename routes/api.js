var http = require('http');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/huayra-stats-db');

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

var Usuario = require('../models/Usuario');

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

function rand_int(min, max) {
  return min + Math.random() * (max - min);
}

function crear_punto_desde_mac(ip, mac, callback) {
  var url = "http://api.hostip.info/get_json.php?ip=" + ip + "&position=true";
  var dx = rand_int(-0.01, 0.01);
  var dy = rand_int(-0.01, 0.01);


  getJSON(url, function(data) {
    var data = {
      lat: parseFloat(data.lat) + dx,
      lng: parseFloat(data.lng) + dy,
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


function obtener_ip(req) {
  var ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
  return ip;
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
    var ip = obtener_ip(req);
    var mensaje = "Se ha conectado un equipo: mac=" + req.body.mac + " ip=" + ip;

    crear_evento(mensaje);

    crear_punto_desde_mac(ip, req.body.mac, function(punto) {
      punto.save();
      res.json({ip: ip, mensaje: mensaje, punto: punto});
    });
  } else {
    res.status(400);
    res.json({error: 400});
  }
};

/*
 * Devuelve IP, latitud y longitud del que consulta.
 */
exports.localizar = function(req, res) {
    url = 'http://api.ipinfodb.com/v3/ip-city/';
    url += '?key=c6896eb093e632524b73058a2d1fbc367acca0df9a63e67b1b3ddec8d859f859';
    url += '&format=json';
    url += '&ip='+obtener_ip(req);

    getJSON(url, function(data) {
        res.json({ip: data.ipAddress, lat: data.latitude, lon: data.longitude})
    });
};


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
};


exports.autenticar_usuario = function(req, res) {
  console.log(req.body.nombre);

  Usuario.find({"name": req.body.nombre}, function(err, result) {
    var cantidad = result.length;

    if (cantidad == 0) {
      res.json({error: "Usuario o password incorrectos"});
      console.log("Informando acceso incorrecto porque no ingresa datos");
    } else {
      if (result[0].password === req.body.passwd_md5) {
        res.json({token: cantidad});
        console.log("Asignando token, ingresando al sistema...");
      } else {
        res.json({error: "Usuario o password incorrectos"});
        console.log("Informando acceso incorrecto");
      }
    }
  });

};

/*
 * Retorna un diccionario con dos fechas que representan
 * el mes actual.
 */
function obtener_rango_de_fechas_este_mes() {
  var hoy = new Date();
  var inicio = new Date();
  var fin = new Date();

  inicio.setDate(1);
  fin.setDate(1);
  fin.setMonth(fin.getMonth()+1);

  return  {"$gte": inicio, "$lt": fin};
};

exports.desconectados = function(req, res) {

  Evento.find({}, function(err, result) {
  	var criterio_de_orden = obtener_rango_de_fechas_este_mes();
    var cantidad_total = result.length;

    Evento.find({"fecha": criterio_de_orden}, function(err, result) {
      var cantidad_este_mes = result.length;
      res.json({cantidad: cantidad_total - cantidad_este_mes});
    })

  });

};

exports.conectados_este_mes = function(req, res) {
  var criterio_de_orden = obtener_rango_de_fechas_este_mes();

  Evento.find({"fecha": criterio_de_orden}, function(err, result) {
    var cantidad = result.length;
    res.json({cantidad: cantidad});
  })
};

exports.conectados_en_total = function(req, res) {
  Evento.find({}, function(err, result) {
    var cantidad = result.length;
    res.json({cantidad: cantidad});
  })
};

exports.conectados_por_mes = function(req, res) {
  Evento.find({}, function(err, result) {
    var cantidad = result.length;
    var valores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var indice_de_mes = 0;


    for (var i=0; i<result.length; i++) {
      indice_de_mes = result[i].fecha.getMonth();

      valores[indice_de_mes] += 1;
    }

    res.json({valores: valores});
  })
};
