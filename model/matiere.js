let mongoose = require('mongoose');
let Schema = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let MatiereSchema = Schema({
    nom: String,
    prof: String,
    image : String
});

// Pour ajouter la pagination
MatiereSchema.plugin(aggregatePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('matieres', MatiereSchema);
