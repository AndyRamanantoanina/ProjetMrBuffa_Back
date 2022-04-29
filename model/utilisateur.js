let mongoose = require('mongoose');
let Schema = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let UtilisateurSchema = Schema({
    nom:{
        type:String
    },
    pseudo:{
        type:String
    },
    mdp:{
        type:String
    },
    isAdmin : {
        type : Boolean
    },
    image : {
        type : String
    }
});

// Pour ajouter la pagination
UtilisateurSchema.plugin(aggregatePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('utilisateur', UtilisateurSchema);
