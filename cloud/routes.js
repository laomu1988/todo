var gl = global.gl;

/**
 * 路由设置部分
 * url： 路由链接
 * handles： 处理程序
 * method：请求方式，默认all
 * @type {*[]}
 */
module.exports = [
    {url: '/api/user/signup', handles: [gl.user.new], method: 'all'},
    {url: '/api/user/login', handles: [gl.user.login]},
    {url: '/api/todo/new', handles: [gl.right.needLogin, gl.todo.new]},
    {url: '/api/todo/get', handles: [gl.right.needLogin, gl.todo.get]},
    {url: '/api/todo/list', handles: [gl.right.needLogin, gl.todo.list]},
    {url: '/api/todo/edit', handles: [gl.right.needLogin, gl.todo.edit]},
    {url: '/api/todo/unfinish', handles: [gl.right.needLogin, gl.todo.unfinish]},
    {url: '/api/project/new', handles: [gl.right.needLogin, gl.project.new]},
    {url: '/api/project/list', handles: [gl.right.needLogin, gl.project.list]},
    {url: '/api/project/edit', handles: [gl.right.needLogin, gl.project.edit]}
];
