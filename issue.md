# 问题及原因
* 设置session无效原因，先输出了res.json，然后才设置req.session，应该是先设置session，然后才发送res.json