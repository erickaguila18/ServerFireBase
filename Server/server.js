// Depedencias
var express = require('express')
, http = require('http')
, path = require('path')
, mongoose = require('mongoose')
, bodyParser = require('body-parser')
, methodOverride = require('method-override');

// Agregando FireBase
var firebase = require("firebase");


// Inicializando el API
firebase.initializeApp({
  databaseURL: "https://demoapp-89eeb.firebaseio.com/",
  serviceAccount: "./jsonFiles/google-services.json",
   databaseAuthVariableOverride: {
    uid: "my-service-worker"
  }
});


Firebase.database().ref('/').set({
    username: "savir",
    email: "guevara.savir@gmail.com"
});




var Notification = require('./models/notifications');
//var rutas = require('./routes/index');


// Configuracion
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
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





/*

// READ
app.get('/allData',function(req , res){
    Notification.find({},function(err,pub){
        res.render('index',{
            doc:doc
        });
    });
});


app.post('/create',function(req , res){
        var notification =  new Notification({
            contenido:req.body.notification
        });
        notification.save(function(err){
            console.log(err);         
        });
});*/