module.exports = {
    new: function (req, res) {
        var data = req.data;
        gl.newAndSave('Project', {
            name: data.name,
            user: gl.user.myRef()
        }, res);
    },
    // project列表
    list: function (req, res) {
        gl.findAndSend("select count(*),* from Project where user = pointer('_User','" + req.session.user.objectId + "')", res);
    }
};