/**
 * @file mip-fh-location 组件
 * @author
 */

define(function (require) {

    var customElement = require('customElement').create();
    var $body = document.querySelector('body');
    var fetchJsonp = require('fetch-jsonp');
    var timeout = 5000;

    // 通过接口获取地区方法
    function getLocation(cb) {
        cb = (typeof cb === 'function') ? cb : function () {
        };

        var url = 'https://partners.fh21.com.cn/ad/api_getarea/';
        var ipUrl = 'https://ips.fh21.com.cn/getarea';

        // 先获取客户端IP
        fetchJsonp(ipUrl, {
            jsonpCallback: 'callback',
            timeout: timeout - 3000
        }).then(function (res) {
            return res.json();
        }).catch(function () {
            // 异常返回空对象
            return {};
        }).then(function (data) {
            var ip = data.ip;

            if (ip) {
                url += ('?ip=' + ip);
            }

            // 根据客户端IP获取省份ID
            return fetchJsonp(url, {
                jsonpCallback: 'jsonp',
                timeout: timeout
            });
        }).then(function (res) {
            return res.json();
        }).then(function (data) {
            data = data || {};
            cb(data.provinceId);
        });
    }
    // 通过 src 属性获取内容
    function getHtml(ele, cb) {
        cb = (typeof cb === 'function') ? cb : function () {
        };
        var isHasSrc = ele.hasAttribute('src');
        if (!isHasSrc) {
            cb();
            return;
        }
        var src = ele.getAttribute('src');
        fetchJsonp(src, {
            jsonpCallback: 'jsonp',
            timeout: timeout
        }).then(function (res) {
            return res.json();
        }).then(function (data) {
            ele.innerHTML = data;
            cb();
        }).catch(function (err) {
            cb(err);
        });
    }

    // 主体功能方法
    function setHtmlLocation(elem, data) {

        var elemLocationType = elem.getAttribute('location') || '';
        var locationsType = elemLocationType.split(',') || [];
        var len = locationsType.length;
        var i = 0;
        var locationType = '';
        var converse = elem.getAttribute('converse');
        var locationClass = locationsType.join('-');
        var converseClass = '';

        if (converse !== null) {
            converseClass = '-' + 'converse';
        }

        for (i; i < len; i++) {
            locationType = +(locationsType[i]);

            var flag = false;

            // 判断元素是否地域取反
            if (converse === null) {
                if (locationType === data) { // 判断地域类型
                    flag = true;
                    break;
                }
            }
            else {
                if (locationType === data) {
                    flag = false;
                    break;
                }
                else {
                    flag = true;
                }
            }
        }

        if (flag) {
            // 真 显示元素
            getHtml(elem, function () {
                elem.classList.add('mip-fh-location--show');
                $body.classList.add('v-mip-ck-location-' + locationClass + converseClass);
            });
        }
        else {
            // 假 移除元素
            elem.parentNode.removeChild(elem);
        }
    }

    /**
     * 第一次进入可视区回调，只会执行一次
     */
    customElement.prototype.firstInviewCallback = function () {
        // TODO
    };

    /**
     * 地区在首屏展示，需要尽快加载
     */
    customElement.prototype.build = function () {
        var $mipFhLocation = document.querySelectorAll('mip-fh-location');
        var len = $mipFhLocation.length;
        var num = +$body.getAttribute('fh-location-num') || 0;
        $body.setAttribute('fh-location-num', String(++num));

        // 最后一次 解析mip-fh-location 节点才执行请求
        if (num !== len) {
            return;
        }

        getLocation(function (data) {
            Array.prototype.forEach.call($mipFhLocation, function (element) {
                setHtmlLocation(element, data);
            });
        });
    };

    return customElement;
});
