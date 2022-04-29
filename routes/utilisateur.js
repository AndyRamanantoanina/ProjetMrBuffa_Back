let Utilisateur = require('../model/utilisateur');
let jwt = require("jsonwebtoken");
const Ajv = require("ajv");
const moment = require("moment");
require('dotenv').config();

async function insert(req, res) {
    let pseudo = req.body.pseudo;
    let mdp = req.body.mdp;
    let nom = req.body.nom;
    let image = req.body.image;
    let user = new Utilisateur({
        pseudo: pseudo,
        mdp: mdp,
        nom: nom,
        isAdmin : req.body.isAdmin,
        image : image
    });
    user.save();
    return res.json("insertion ok");
}

async function update(req, res) {
    let user = await Utilisateur.findOneAndUpdate({_id:req.body.id},req.body).exec();
    return res.json("modification ok");
}

async function remove(req, res) {
    let id =  req.params.id;
    let user = await Utilisateur.find({_id:id}).remove().exec();
    return res.json("suppression ok");
}

async function liste(req,res) {
    let users = await Utilisateur.find().exec();
    return res.json({users : users});
}

async function getUtilisateur(req,res) {
    let id = req.params.id;
    let user = await Utilisateur.find({_id:id}).exec();
    return res.json({user : user});
}

async function login(req, res) {
    console.log(req.body);
    let pseudo = req.body.pseudo;
    let mdp = req.body.mdp;
    //recherche de l'utilisateur
    let user = await Utilisateur.findOne({
        pseudo: pseudo,
        mdp: mdp
    }).exec();
    //Si il existe on crypte les informations dans un token et on stocke ce token dans la session
    if (user) {
        //l'utilisateur ne pourra plus appeler d'API apres cette date heure
        let session = await moment().add(30, 'minutes');
        let token = await jwt.sign({
            id: user._id.toString(),
            pseudo: user.pseudo,
            deconnectAt: session
        }, 'AndyBeTay');
        return res.json({
            token : token,
            user : user
        });
    }
    //Sinon on renvoie le msg d'erreur
    else return res.status(500).send("Login incorrect");
}

function checktoken(req, res, next) {
    let token = req.headers.token;
    //ajv permet de specifier un modele de json
    const ajv = new Ajv({allErrors: true});
    const schema = {
        type: "object",
        properties: {
            id: {type: "string"},
            pseudo: {type: "string"},
            deconnectAt: {type: "string"}
        },
        required: ["id", "pseudo", "deconnectAt"]
    };
    //Decoder le token
    jwt.verify(token,'AndyBeTay', async function (err, decoded) {
        //valider le json obtenu par le token
        let validate = ajv.compile(schema);
        let valid = validate(decoded);
        console.log(decoded);
        //Si le json est valide
        if (valid) {
            req.userConnected = decoded;
            console.log(moment())
            let deconnect = await moment().isAfter(decoded.deconnectAt);
            console.log(deconnect);
            if(deconnect) return res.status(500).send("token invalide");
            else next();
        } else return res.status(500).send("token invalide")
    });
}


module.exports = {login, checktoken, insert, update, remove, liste,getUtilisateur};