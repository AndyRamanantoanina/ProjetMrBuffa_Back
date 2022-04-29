let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let assignment = require('./routes/assignments');
let utilisateur = require('./routes/utilisateur');
let matiere = require('./routes/matiere');
let mongoose = require('mongoose');
let Assignment = require('./model/assignment');
let Utilisateur = require('./model/utilisateur');

mongoose.Promise = global.Promise;
//mongoose.set('debug', true);

// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud s
const uri = 'mongodb+srv://niavo:CwZICgddTGTe88E4@cluster0.dh9ov.mongodb.net/Projet-Buffa?retryWrites=true&w=majority';


const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
};

const cors = require('cors');

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log("vérifiez with http://localhost:8010/api/assignments que cela fonctionne")
    },
    err => {
      console.log('Erreur de connexion: ', err);
    });

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Pour les formulaires
app.use(bodyParser.urlencoded({limit : '50mb',extended: true}));
app.use(bodyParser.json({limit : '50mb'}));

let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';


app.use(cors())

app.route(prefix + '/getAssignments')
    .post(utilisateur.checktoken,assignment.getAssignmentNew);


app.route(prefix + '/assignments')
  .get(utilisateur.checktoken,assignment.getAssignments)
  .post(utilisateur.checktoken,assignment.postAssignment)
  .put(utilisateur.checktoken,assignment.updateAssignment);

app.route(prefix + '/assignments/:id')
  .get(utilisateur.checktoken,assignment.getAssignment)
  .delete(utilisateur.checktoken,assignment.deleteAssignment)

//Route a propos des utilisateurs
app.route(prefix + '/utilisateur/login')
    .post(utilisateur.login);

app.route(prefix + '/utilisateur/')
    .post(utilisateur.checktoken,utilisateur.insert)
    .get(utilisateur.checktoken,utilisateur.liste)
    .put(utilisateur.checktoken,utilisateur.update)


app.route(prefix+'/utilisateur/:id')
    .get(utilisateur.checktoken,utilisateur.getUtilisateur)
    .delete(utilisateur.checktoken,utilisateur.remove);

//recherche utilisateur
app.route(prefix+'/recherche/:table')
    .post(utilisateur.checktoken,async function recherche(req,res){
        let table = req.params.table;
        if(table == "utilisateur") {
            let users = await Utilisateur.find(req.body).exec();
            return res.json({users : users});
        }
        else if(table == "assignment") {
            let assignments = await Assignment.find(req.body).exec();
            return res.json({assignments : assignments});
        }
    });

//route Matiere
app.route(prefix+'/matiere/:matiere')
    .get(utilisateur.checktoken,matiere.getMatiere);
app.route(prefix+'/matiere/')
    .post(utilisateur.checktoken,matiere.insert);
app.route(prefix+'/matieres/')
    .post(utilisateur.checktoken,matiere.getMatieres);

// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


