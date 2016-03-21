/**@ dom节点上的所有属性
 *@description: 如：<div class="a" if="b"></div> 将生成对象{class:"a",if:"b"}
 * */
web.attrs = function (dom) {
    if (!dom) {
        return null;
    }
    if (dom.length) {
        dom = dom[0];
    }
    var attrs = dom.attributes;
    if (attrs) {
        var result = {};
        for (var i = 0; i < attrs.length; i++) {
            result[attrs[i].nodeName] = attrs[i].nodeValue;
        }
        return result;
    } else {
        return null;
    }
};