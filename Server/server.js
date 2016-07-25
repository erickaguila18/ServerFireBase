// Depedencias
var express = require('express')
, http = require('http')
, path = require('path')
, mongoose = require('mongoose')
, bodyParser = require('body-parser')
, methodOverride = require('method-override');

// Agregando SDK FireBase
var firebase = require("firebase");


// Inicializando el API
firebase.initializeApp({
  databaseURL: "https://push-not-22e2b.firebaseio.com",
  serviceAccount: "./jsonFiles/push-not-9f814a19423e.json"
});



var Notification = require('./models/notifications');
//var rutas = require('./routes/index');


// Configuracion
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}));


app.get('/', function(req, res) {
    res.render('index');
});

// Puerto y servidor
var server = http.createServer(app);
server.listen(8080);


//Conexion
mongoose.connect('mongodb://localhost/notifications',function(err){
	if(!err){
		console.log("Conectado a mongo");
	}else{
		throw err;
	}
});



var tokenURI = "token-device"; 
app.post('/token-device',function(req , res){
  var token = req.body.token;
  var db = firebase.database();
  var tokenDevices = db.ref("token-device").push();
  tokenDevices.set({
    token:token
  });

  var path = tokenDevices.toString();
  var pathSplit = path.split(tokenURI+"/");
  var idAuto = pathSplit[1];

  var respuesta = generarRespuesta(db,idAuto);
  res.setHeader("Content-Type","application/json");
  res.send(JSON.stringify(respuesta));
});



function generarRespuesta(db,idAuto){
    var resuesta = {};
    var ref = db.ref("token-device");

    ref.on("child-added", function(snapshot,prevChildKey){

      usuario = snapshot.val();

      respuesta = {
        id: idAuto,
        token:usuario.token
      };
    });

    return respuesta;
}


app.post('/save',function(req , res){
    var device =  new Notification({
      contenido:req.body.notifications
    });
    device.save(function(err){
      throw err;   
    });
});


