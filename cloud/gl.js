global.gl = global.gl || {};
require('./modules/_gl.js');
require('./modules/error.js');
gl.validate = require('./modules/validate.js');
gl.user = require('./modules/user.js');
gl.right = require('./modules/right.js');
gl.project = require('./modules/project.js');
gl.todo = require('./modules/todo.js');

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