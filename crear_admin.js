var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/huayra-stats-db');

var Usuario = require('./models/Usuario');
console.log("Eliminando todos los usuarios");
Usuario.collection.drop();

var datos = {
    name: 'admin',
    email: 'admin@admin.com',
    password: 'asdasd'
};

Usuario.create(datos, function(err) {

	if (err) {
    console.log(err);
	}

  console.log("Creando el usuario: " + datos.name);
  process.exit(0);

});
