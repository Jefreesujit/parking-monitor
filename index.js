var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var firebase = require('firebase');
var io = require('socket.io')(http);

var firebaseApp = firebase.initializeApp({
  authDomain: "sps1234-24931.firebaseio.com",
  databaseURL: "https://sps1234-24931.firebaseio.com/"
});

// controllers

function isValidLogin (data) {
  var isValid = false;

  if (data.signInType === 'user' && data.username === 'user' && data.password === 'user') {
    isValid = true;
  } else if (data.signInType === 'admin' && data.username === 'admin' && data.password === 'admin') {
    isValid = true;
  }

  return isValid;
}

function loginController (req, res) {
  if (req.cookies.isAuthenticated === 'true') {
    res.redirect('/main');
  } else {
    if (isValidLogin(req.body)) {
      res.cookie('isAuthenticated', true);
      res.cookie('role', req.body.signInType);
      res.redirect('/main');
    } else {
      res.redirect('/');
    }
  }
}

function parkingController (req, res) {
  var forgeRef = firebase.database().ref('forge'),
      dataArray = [];

  forgeRef.on("value", function(snapshot) {
    var dataList = snapshot.val();
    for (key in dataList) {
      let tempKey = parseInt(key.substring(4)) - 1;
      console.log(tempKey);
      dataArray[tempKey] = dataList[key];
    }
    console.log('dataArray', dataArray);
    res.json(dataArray);
  });
}

function parkingDetails (req, res) {
  if (req.cookies.role === 'admin') {
    console.log(req.params.slotId);
    res.json({
      Username: 'Venkat',
      VehicleNo: 'TN 08 AC 4376',
      ParkedDate: '9th Nov 2017',
      ParkedTime: '11:45 AM'
    });
  } else {
    res.status(403).json({error: 'Forbidden'});
  }
}

app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));

app.get('/fonts/roboto/:fileName', function(req,res){
  res.sendFile(__dirname + '/fonts/roboto/' + req.params.fileName);
});

app.post('/api/sign-in', loginController);

app.get('/api/get-parking-status', parkingController);

app.get('/api/get-parking-details/:slotId', parkingDetails);

app.get('/main', function(req,res) {
  if (req.cookies.isAuthenticated === 'true') {
    res.sendFile(__dirname + '/home.html');
  } else {
    res.redirect('/');
  }
});

app.get('/sign-out', function(req,res) {
  res.clearCookie('isAuthenticated');
  res.clearCookie('role');
  res.redirect('/'); 
});

app.get('/', function(req,res) {
  if (req.cookies.isAuthenticated === 'true') {
    res.redirect('/main');
  } else {
    res.sendFile(__dirname + '/index.html');
  }
});

http.listen(process.env.PORT || 3000, function(){
  console.log("listening on port " + http.address().port);
});


