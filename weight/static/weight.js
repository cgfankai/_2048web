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
            data: JSON.stringify({
                weight: parseInt(weight)
            }),
            success: function (response) {
                console.info(response);
            },
            error: function (response) {
                console.info(response);
            },
            complete: function (response) {
                console.info(response);
            }
        });
    }
}
window.onload = function () {
    ajax({
        url: '/weight/getWeights',
        complete: function (response) {
            response = JSON.parse(response);
            console.info(response);
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
                    pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
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
        }
    });
}