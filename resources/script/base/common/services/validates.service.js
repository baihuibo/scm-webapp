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