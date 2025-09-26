//----set the class Number and file you want to RUN

var classNumber = "03";
var nameFile = "01";

// var classNumber = "01";
// var nameFile = "06-sound1"; 
// var nameFile = "07-sound1-app"; 
// var nameFile = "08-touch"; 
// var nameFile = "09-draw"; 
// var nameFile = "10-frequency"; 
// var nameFile = "11-gain"; 
// var nameFile = "index"; 


// var classNumber = "02";
// var nameFile = "00-drum"; 
// var nameFile = "01-kick";
// var nameFile = "02-snare"; 
// var nameFile = "10-other";
// var nameFile = "index";  



var classNumber = "99";
var nameFile = "2";
//------------------------------------------------------

//------------------------------------------------------
//original code
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname))

app.get('/', (req, res) => {
	var conformPath = __dirname + '/class'+ classNumber + '/js/' + nameFile + '.html';
	// console.log (conformPath);
  res.sendFile(path.join(conformPath));
});

app.listen(3001, () => {
  console.log('server started');
});


