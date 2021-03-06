/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');


var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);
app.enable("trust proxy");

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
};


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

app.get('/api/puntos', api.puntos);
app.post('/api/puntos', api.crear_punto);
app.post('/api/login', api.autenticar_usuario);
app.post('/api/puntosprueba', api.crear_punto_prueba);
app.get('/api/desconectados', api.desconectados);
app.get('/api/conectados_este_mes', api.conectados_este_mes);
app.get('/api/conectados_en_total', api.conectados_en_total);
app.get('/api/conectados_por_mes', api.conectados_por_mes);
app.get('/api/localizar', api.localizar);

app.get('/api/eventos', api.eventos);

app.get('*', routes.index);

io.sockets.on('connection', require('./routes/socket'));

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
