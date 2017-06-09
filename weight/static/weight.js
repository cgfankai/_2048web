/**
 * Created by fankai on 2017/6/9.
 */
var ajax = function (opt) {
    if (opt.url == null) {
        return;
    }
    var XHR = (function () {
        if (typeof XMLHttpRequest != 'undefined') {
            return new XMLHttpRequest();
        } else if (typeof ActiveXObject != 'undefined') {
            if (typeof  arguments.callee.activeXString != 'string') {
                var version = [
                    "MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                    "MSXML2.XMLHttp"];
                for (var i = 0, len = version.length; i < len; i++) {
                    try {
                        new ActiveXObject(version[i]);
                        arguments.callee.activeXString = version[i];
                        break;
                    } catch (ex) {
                    }
                }
            }
            return new ActiveXObject(arguments.callee.activeXString);
        } else {
            throw new Error('No XHR object available.');
        }
    })();
    XHR.onreadystatechange = function () {
        if (XHR.readyState == 4) {
            if ((XHR.status >= 200 && XHR.status < 300) || XHR.status == 304) {
                if (typeof opt.success == 'function') {
                    opt.success(XHR.responseText);
                }
                if (typeof opt.complete == 'function') {
                    opt.complete(XHR.responseText);
                }
            } else {
                if (typeof opt.error == 'function') {
                    opt.error(XHR.responseText);
                }
                if (typeof opt.complete == 'function') {
                    opt.complete(XHR.responseText);
                }
            }
        }
    }
    var method = opt.method ? opt.method : "get";
    var async = opt.async ? opt.async : false;
    XHR.open(method, opt.url, async);
    var data = opt.data ? opt.data : null;
    XHR.send(data);
}
var setWeight = function () {
    var weight = document.getElementById('weight').value;
    if (weight != null && weight.trim() != '') {
        ajax({
            url: '/weight/setWeight',
            method: 'post',
            data:JSON.stringify({
                weight:parseInt(weight)
            }),
            success: function (response) {
                console.info(response);
            },
            error: function (response) {
                console.info(response);
            },
            complete:function (response) {
                console.info(response);
            }
        });
    }
}