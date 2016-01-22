global.gl = global.gl || {};
require('cloud/modules/_gl.js');
require('cloud/modules/error.js');
gl.validate = require('cloud/modules/validate.js');
gl.user = require('cloud/modules/user.js');
gl.right = require('cloud/modules/right.js');
gl.project = require('cloud/modules/project.js');
gl.todo = require('cloud/modules/todo.js');


// console.log(gl);


gl.AV = AV;
global.AV = gl.AV;
console.log(gl.AV.User);
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