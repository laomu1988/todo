global.gl = global.gl || {};
require('./modules/_gl.js');
require('./modules/error.js');
gl.validate = require('./modules/validate.js');
gl.user = require('./modules/user.js');
gl.right = require('./modules/right.js');
gl.project = require('./modules/project.js');
gl.todo = require('./modules/todo.js');

// console.log(gl);

var AV =  require('leanengine');
global.AV = gl.AV = AV;
var APP_ID = process.env.LC_APP_ID;
var APP_KEY = process.env.LC_APP_KEY;
var MASTER_KEY = process.env.LC_APP_MASTER_KEY;

AV.initialize(APP_ID, APP_KEY, MASTER_KEY);

module.exports = gl;


/*
 gl.find('select * from  Project where begin is not exists or finish is not exists or removed is not exists', function (data) {
 var result = data.results;
 for (var i = 0; i < result.length; i++) {
 var id = result[i].id;
 result[i].set('begin', Date.now());
 result[i].set('finish', 0);
 result[i].set('removed', 0);
 result[i].save();
 }
 }, function (err) {
 console.log(err);
 });*/