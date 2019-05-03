let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let modelSchema = new Schema({
	nombre : { type: String, required: true },
	apellido : String,
	email: { type: String, required: true },
	date: Date,
	perfil: { type: String, required: true}
});

let model = mongoose.model('contacts',modelSchema,'contacts');
module.exports = model;