var gl = global.gl;

/**
 * 路由设置部分
 * url： 路由链接
 * handles： 处理程序
 * method：请求方式，默认all
 * @type {*[]}
 */
module.exports = [
    // 用户
    {url: '/api/user/register', handles: [gl.user.new], method: 'all'},
    {url: '/api/user/login', handles: [gl.user.login]},
    {url: '/api/user/logout', handles: [gl.user.logout]},

    // 任务
    {url: '/api/todo/new', handles: [gl.right.needLogin, gl.todo.new]},
    {url: '/api/todo/get', handles: [gl.right.needLogin, gl.todo.get]},
    {url: '/api/todo/list', handles: [gl.right.needLogin, gl.todo.list]},
    {url: '/api/todo/edit', handles: [gl.right.needLogin, gl.todo.edit]},
    {url: '/api/todo/finish', handles: [gl.right.needLogin, gl.todo.finish]},
    {url: '/api/todo/unfinish', handles: [gl.right.needLogin, gl.todo.unfinish]},
    {url: '/api/todo/unremove', handles: [gl.right.needLogin, gl.todo.unremove]},
    {url: '/api/todo/remove', handles: [gl.right.needLogin, gl.todo.remove]},

    // 项目
    {url: '/api/project/new', handles: [gl.right.needLogin, gl.project.new]},
    {url: '/api/project/get', handles: [gl.right.needLogin, gl.project.get]},
    {url: '/api/project/list', handles: [gl.right.needLogin, gl.project.list]},
    {url: '/api/project/edit', handles: [gl.right.needLogin, gl.project.edit]},
    {url: '/api/project/finish', handles: [gl.right.needLogin, gl.project.finish]},
    {url: '/api/project/unfinish', handles: [gl.right.needLogin, gl.project.unfinish]},
    {url: '/api/project/remove', handles: [gl.right.needLogin, gl.project.remove]},
    {url: '/api/project/unremove', handles: [gl.right.needLogin, gl.project.unremove]}
];
