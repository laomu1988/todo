gl.find('select count(*),* from Todo where objectId = "56a0bce58ac2470055f179a7"', function (results) {
    console.log('need_updated: ', results.count);
    var datas = results.results;
    for (var i = 0; i < datas.length; i++) {
        var todo = datas[i];
        console.log(i, todo.get('name'));
        gl.todo.updateTodo(todo);
    }
});


