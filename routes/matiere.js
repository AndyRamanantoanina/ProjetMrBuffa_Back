let Matiere = require('../model/matiere');
let Utilisateur = require('../model/utilisateur');
let jwt = require("jsonwebtoken");
const Ajv = require("ajv");
const moment = require("moment");
require('dotenv').config();

async function insert(req, res) {
    let retour = "insertion ok !"
    let nom = req.body.nom;
    let prof = req.body.prof;
    let image = req.body.image
    let checkProf = await Utilisateur.findOne({
        nom: prof
    }).exec();
    if (!checkProf) {
        let newProf = new Utilisateur({
            nom: prof,
            pseudo: prof,
            mdp: '1234',
            isAdmin: false
        });
        newProf.save();
        checkProf = newProf;
        retour += ' Création de nouveau prof'
    }
    let newMatiere = new Matiere({
        nom: nom,
        prof: checkProf._id,
        image : image
    });
    newMatiere.save();
    return res.json(retour);
}

async function getMatiere(req, res) {
    let matiere = req.params.matiere;
    matiere = await Matiere.findOne({
        nom: matiere
    }).exec();
    return res.json({matiere: matiere});
}

async function getMatieres(req, res) {
    let matieres = await Matiere.find().exec();
    return res.json({matieres: matieres});
}

module.exports = {insert, getMatiere, getMatieres};