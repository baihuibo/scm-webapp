angular.module('common-module')
    .directive('validate', function (validates) {
        return {
            require: '?ngModel',
            scope: {validate: '=?'},
            link: function ($scope, el, attr, ngModelCtrl) {
                if ($scope.validate && ngModelCtrl) {
                    var helpBlock = el.next('.help-block'), validMsg;
                    ngModelCtrl.$validators.validate = function (currentValue) {
                        var validate = $scope.validate || {}; // 用户自定义规则多是动态模板规则
                        var rules = validate.rules || {}; // 多半是通用规则
                        if (el.attr('type')) {
                            rules[el.attr('type')] = true;// type类型也作为校验的一种
                        }
                        validMsg = '';

                        // 获取所有要校验的规则依次校验
                        var validResult = getRules(validate, rules).every(function (rule) {
                            var validArgs = validates[rule] || [];// 俩个参数，0表示校验函数，1表示提示语句
                            var validFn = validArgs[0];
                            if (typeof validFn === 'function') {
                                var ruleValue = getRuleValue(rule, validate, rules);
                                var validResult = validFn(currentValue, ruleValue);// 调用校验方法

                                if (validResult === false && validArgs[1]) {
                                    // 返回false表示验证失败。处理提示语句
                                    validMsg = (validArgs[1] || '').format(ruleValue);
                                } else if (typeof validResult === 'string') { // 如果返回 string，则表示错误提示语句
                                    validMsg = validResult;
                                    validResult = false;
                                }

                                // 如果返回布尔，则表示校验有结果
                                if (typeof validResult === 'boolean') {
                                    ngModelCtrl.$setValidity(rule, validResult);
                                    return validResult;
                                }

                                // 校验未返回值
                                ngModelCtrl.$setValidity(rule, true);
                                return true;
                            }
                            return true;// 跳过各种未匹配到的校验
                        });
                        helpBlock.text(validMsg);
                        return validResult;
                    };

                    // 动态校验规则响应
                    $scope.$watch('validate', function (newVal) {
                        ngModelCtrl.$validate();
                    }, true);
                }
            }
        }
    });

function getRuleValue(rule, data, rules) {
    var value = data[rule];
    if (typeof value === 'undefined') {
        value = rules[rule];
    }
    return value;
}

function getRules(validate, ruels) {
    var list = Object.keys(ruels).concat(Object.keys(validate));
    var idx = list.indexOf('required');
    if (idx > -1) {// 强行设置required优先校验
        list.splice(idx, 1);
        list.unshift('required');
    }
    return list;
}


