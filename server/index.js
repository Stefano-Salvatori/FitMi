var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var Users = require('./src/models/usersModel')
var Sessions = require('./src/models/sessionModel')
var Badges = require('./src/models/badgesModel')

var cors = require('cors')

//Creo istanza di express (web server)
var app = express();

//Gestione richieste CORS
app.use(cors())


//importo parser per leggere i parametri passati in POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

var path = require('path');
global.appRoot = path.resolve(__dirname);


// aspetto che il container di mongo sia su
function pausecomp(millis) {
	var date = new Date();
	var curDate = null;
	do { curDate = new Date(); }
	while (curDate - date < millis);
}

console.log('Waiting MongoDB...');
pausecomp(0);

//connessione al db
mongoose.set('debug', true); //Print Debug informations
mongoose.set('useFindAndModify', false);
mongoose.set('connectTimeoutMS', 30);
mongoose
	.connect(
		'mongodb://127.0.0.1:27017/main_db',
		// 'mongodb://asw_mongodb_1.asw_interna:27017/dbsa', ANDAVA BENE
		{ useNewUrlParser: true })
	.then(() => console.log('MongoDB Connected'))
	.catch((err) => console.log(err));



var userRoutes = require('./src/routes/userRoutes');
var badgeRoutes = require('./src/routes/badgesRoutes');

userRoutes(app);
badgeRoutes(app);

/*app.use((req, res) => {
	res.sendFile(appRoot + "/www/index.html");
});*/

//metto in ascolto il web server
app.listen(3000, function () {
	console.log('Node API server started on port 3000!');
});
