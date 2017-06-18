/**
 * Created by fankai on 2017/6/9.
 */
var CookieUtil = {
    get: function (name) {
        var cookieName = encodeURIComponent(name) + '=',
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null;
        if (cookieStart > -1) {
            var cookieEnd = document.cookie.indexOf(';', cookieStart);
            if (cookieEnd == -1) {
                cookieEnd = document.cookie.length;
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
        }
        return cookieValue;
    },
    set: function (name, value, expires, path, domain, secure) {
        var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
        if (expires instanceof Date) {
            cookieText += ';expires=' + expires.toGMTString();
        }
        if (path) {
            cookieText += ';path=' + path;
        }
        if (domain) {
            cookieText += "; domain=" + domain;
        }
        if (secure) {
            cookieText += "; secure";
        }
        document.cookie = cookieText;
    },
    unset: function (name, path, domain, secure) {
        this.set(name, "", new Date(0), path, domain, secure);
    }
}
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
    if (opt.header) {
        for (key in opt.header) {
            XHR.setRequestHeader(key, opt.header[key]);
        }
    }
    var data = opt.data ? opt.data : null;
    XHR.send(data);
}
function refreshCHart() {
    ajax({
        url: '/weight/getWeights',
        complete: function (response) {
            response = JSON.parse(response);
            var series = [];
            var series_data = [];
            (function () {
                response.forEach(function (item) {
                    var temp = [item.fields.time_stamp, item.fields.weight];
                    series_data.push(temp);
                });
            })();
            series = [{name: 'me', data: series_data}]
            new Highcharts.Chart('weight-chart', {// 图表初始化函数，其中 container 为图表的容器 div
                chart: {
                    type: 'area'                           //指定图表的类型，默认是折线图（line）
                },
                title: {
                    text: '每日体重图'                 //指定图表标题
                },
                xAxis: {
                    type: 'datetime',   //指定x轴分组
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    title: {
                        text: '体重（kg）'                 //指定y轴的标题
                    },
                    min: 0
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x:%e. %b}: {point.y:.2f} kg'
                },
                plotOptions: {
                    spline: {
                        marker: {
                            enabled: true
                        }
                    }
                },
                series: series
            });
            document.querySelector('#mask').style.display = 'none';
        }
    });
}

window.onload = function () {
    (function () {
        var documentWidth = window.screen.availWidth < 400 ? window.screen.availWidth : 400;
        var containers = document.querySelectorAll('.container');
        console.info(containers);
        for (var i = 0, len = containers.length; i < len; i++) {
            containers[i].style.width = documentWidth + 'px';
        }
        ajax({
            url: '/weight/getUpdateTimeStamp',
            method: 'get',
            success: function (response) {
                var lastUpdaeDate = new Date(parseInt(response));
                var curDate = new Date();
                if (curDate.getDay() == lastUpdaeDate.getDay()) {
                    document.querySelector('#weight').setAttribute('disabled', true);
                    document.querySelector('#weight').setAttribute('placeholder', '今日已设置过了');
                    document.querySelector('#submit').setAttribute('disabled', true);
                    document.querySelector('#isJin').setAttribute('disabled', true);
                } else {

                }

            }
        });
        refreshCHart();
    })();
    document.getElementById('submit').onclick = function () {
        document.querySelector('#mask').style.display = 'block';
        var csrftoken = CookieUtil.get('csrftoken');
        var weight = document.querySelector('#weight').value;
        if (weight == '') {
            return;
        }
        if (document.querySelector('#isJin').checked) {
            weight = weight / 2;
        }
        var data = {
            weight: weight
        };
        ajax({
            header: {
                'X-CSRFToken': csrftoken
            },
            url: '/weight/setWeight',
            method: 'post',
            data: JSON.stringify(data),
            success: function () {
                refreshCHart();
            },
            error: function () {

            }
        });
    }
}