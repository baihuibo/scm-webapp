angular.module('common-module')
    .provider('validates', function () {
        var isEmpty;
        this.$get = function (commonUtil) {
            isEmpty = commonUtil.isEmpty;
            return validates;
        };

        var validates = {
            required: [function (value, required) {
                if (required) {
                    return !isEmpty(value);
                }
            }, '该选项是必填的'],
            max: [function (value, max) {
                return Number(value) <= parseInt(max, 10);
            }, '输入内容不能大于{0}'],
            min: [function (value, min) {
                return Number(value) >= parseInt(min, 10);
            }, '输入内容不能小于{0}'],
            maxlength: [function (value, maxlength) {
                if (maxlength) {
                    return String(value).length <= parseInt(maxlength, 10);
                }
            }, '长度不能大于{0}'],
            minlength: [function (value, minlength) {
                return String(value).length >= parseInt(minlength, 10);
            }, '请不要小于{0}'],
        };

        var URL_REGEXP = /^[a-z][a-z\d.+-]*:\/*(?:[^:@]+(?::[^@]+)?@)?(?:[^\s:/?#]+|\[[a-f\d:]+])(?::\d+)?(?:\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$/i;
        var EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
        var NUMBER_REGEXP = /^\s*(-|\+)?(\d+|(\d*(\.\d*)))([eE][+-]?\d+)?\s*$/;
        var TEL_REGEXP = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;

        function setRegexpValid(key, reg, msg) {
            validates[key] = [function (value) {
                return !value || reg.test(value);
            }, msg];
        }

        setRegexpValid('number', NUMBER_REGEXP, '请输入正确的数字');
        setRegexpValid('email', EMAIL_REGEXP, '请输入正确的邮箱');
        setRegexpValid('tel', TEL_REGEXP, '请输入正确的电话号码');
        setRegexpValid('url', URL_REGEXP, '请输入正确的url');

        ///  正则内容验证
        var cache = {};
        validates['pattern'] = validates['regexp'] = [function (value, regexp) {
            if (regexp) {
                var reg = cache[regexp] || (cache[regexp] = new RegExp(regexp));
                return reg.test(value);
            }
        }, '请输入正确的内容'];

        this.validates = validates;
    });