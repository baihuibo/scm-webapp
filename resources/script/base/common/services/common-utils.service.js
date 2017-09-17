/**
 * 工具类
 * commonUtil.confirm(msg) promsie规范的confirm提示框
 *
 * commonUtil.getSearchValue(key) 获取页面url参数
 *
 * commonUtil.uuid(prefix?)  获取一个唯一id
 */
angular.module('common-module')
    .service('commonUtil', function () {
        var commonUtil = this;

        // 确认操作提示框
        this.confirm = function (msg) {
            var defer = $q.defer();

            setTimeout(function () {
                commonContainer.confirm(msg, function (id) {
                    layer.close(id);
                    defer.resolve();
                }, defer.reject);
            }, 1);

            return defer.promise;
        };
        // 获取url参数
        this.getSearchValue = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", 'i');
            var r = window.location.search.substring(1).match(reg);
            if (r) return decodeURIComponent(r[2]);
            return null;
        };

        /**
         * 获取唯一id
         * @param prefix? 可选前缀,默认前缀uuid
         * @returns {string}
         */
        this.uuid = function (prefix) {
            return (prefix || 'uuid') + Math.random().toString(16).substr(2);
        };

        this.isEmpty = function (value) {
            return angular.isUndefined(value) || value === '' || value === null || value !== value
        }
    });