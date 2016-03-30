require('proxy-static')({
    proxy: ['dev.list.leanapp.cn'],
    statics: {
        '/': './public/'
    }
});