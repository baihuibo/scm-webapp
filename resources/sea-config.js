(function () {
    seajs.config({
        base: '../resources/script',
        // 提前预加载应用主模块
        preload: ['base/app.module']
    });

    var nowTimer = Date.now();
    var today =  moment().format('YYYYMMDD');

    seajs.on('fetch', function (data) {
        if (data.uri && data.uri.indexOf('/script/base/') === -1) {
            var timer;
            if (data.uri.indexOf('/script/base/') === -1) {// 业务代码加入时间戳
                timer ='?t=' +nowTimer
            }else{// 基础代码加入每日固定时间戳
                timer ='?t=' + today
            }
            data.requestUri = data.uri + timer
        }
    });
}());