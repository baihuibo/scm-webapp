/**
 * Created by baihuibo on 2017/4/11.
 */
angular.module('config-module', [])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.useApplyAsync(true);
        // ajax 请求拦截器
        $httpProvider.interceptors.push(
            'httpTimeoutInterceptors', // 请求超时设置
            'httpCacheInterceptors', // 设置时间戳
            'httpResponseErrorInterceptors' // http异常响应拦截
        );
    }])

    // 超时设置
    .factory('httpTimeoutInterceptors', function () {
        return {
            request: function (config) {
                config.timeout = 25 * 1000;
                return config;
            }
        }
    })

    // 给每个get/delete请求加上时间戳
    .factory('httpCacheInterceptors', function () {
        return {
            request: function (config) {
                if (/get|delete/i.test(config.method)) {
                    var params = config.params || {};
                    params['_timeStamp'] = Date.now();
                    config.params = params;
                }
                config.headers['If-Modified-Since'] = 0;
                return config;
            }
        }
    })

    // http异常响应拦截
    .factory('httpResponseErrorInterceptors', function () {
        var statusMsg = {
            '400': '请求参数错误',
            '401': '请求未授权',
            '404': '请求资源不存在',
            '405': '请求方法不支持',
            '500': '服务器错误',
            '-1': '请求超时',
            'default': '服务器发生错误'
        };
        return {
            responseError: function (response) {
                // 如果发生异常情况，则伪造一个异常响应
                response.data = {
                    code: 1,
                    msg: statusMsg[response.status] || statusMsg['default']
                };
                return response;
            }
        }
    });