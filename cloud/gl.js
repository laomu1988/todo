global.gl = global.gl || {};
require('cloud/modules/_gl.js');
require('cloud/modules/error.js');
gl.user = require('cloud/modules/user.js');
gl.right = require('cloud/modules/right.js');
gl.project = require('cloud/modules/project.js');
gl.todo = require('cloud/modules/todo.js');


// console.log(gl);


gl.AV = AV;
global.AV = gl.AV;
console.log(gl.AV.User);
module.exports = gl;