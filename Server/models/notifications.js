// Esquema de base
var mongoose = require('mongoose');
module.exports = mongoose.model('Notifications',{
	id: String,
	contenido: { type: String, require: true },
	token:{type: String, require: true}
});