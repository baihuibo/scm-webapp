/**
 * Created by baihuibo on 2017/5/10.
 */
(function () {
    angular.module('sign-common')
    /**
     * @name agreementCode  补充协议模板组件
     * @description 通过此组件可以方便的显示并且修改模板内变量
     * @example
     * <example>
     *     <file name="test.html">
     *          <agreement-code
     *              ng-repeat="code in $ctrl.codes"
     *              code="code"
     *              contract="$ctrl.contractData"></agreement-code>
     *     </file>
     * </example>
     */
        .component('agreementCode', {
            template: '<div class="ibox-content">\n    <div ng-if="$ctrl.showTitle">\n        <div class="title_ath" ng-if="!$ctrl.preview && $ctrl.code.term_name">{{$ctrl.code.term_name}}</div>\n        <div class="text-danger" ng-if="!$ctrl.preview && $ctrl.code.applicability">{{$ctrl.code.applicability}}</div>\n    </div>\n</div>',
            bindings: {
                code: '=',
                contract: '<',
                paymentType: '<',
                agrtType: '<',
                index: '<',
                preview: '<'
            },
            controller: ['$scope', '$element', '$compile', 'signUtil', 'signService', function ($scope, $element, $compile, signUtil, signService) {
                var $ctrl = this;
                $ctrl.$onInit = function () {
                    if ($ctrl.code.json_value) {
                        $ctrl.code.value = angular.fromJson($ctrl.code.json_value);
                    } else if (!$ctrl.code.value) {
                        $ctrl.code.value = {};
                    }
                    $ctrl.value = $ctrl.code.value;
                    var content = ($ctrl.code.term_content || '').replace(/\$\{(.*?)\}/g, function (match, path) {
                        path = path.trim();
                        var exp = path2exp(path);
                        var pathValue = getPathValue($ctrl.contract, path);
                        if ($ctrl.contract && pathValue) {
                            setPathValue($ctrl.value, path, clone(pathValue));
                            if (path.includes('signing_date')) {
                                return '<input type="text" class="inline-input" sign-laydate ng-model="$ctrl.value' + exp + '">';
                            }
                            return '{{ $ctrl.value' + exp + '}}';
                        }

                        if (path === '$index') {// 索引
                            return '<span class="code-index"></span>';
                        }

                        return '<input type="text" class="inline-input" ng-model="$ctrl.value' + exp + '">';
                    });

                    content = content.replace(/<textarea/g, '<textarea-sup');
                    content = content.replace(/<\/textarea>/g, '</textarea-sup>');

                    content = $(content);
                    $element.find('.ibox-content').append(content);
                    $compile(content)($scope);

                    $ctrl.paymentName = $ctrl.paymentType === 1 ? '全款' : '商业贷款';

                    $ctrl.showTitle = +$ctrl.agrtType === 2;

                    if ($ctrl.paymentType === 1) {
                        $ctrl.requireds = {
                            3: true,
                            4: true,
                            5: true,
                            7: true
                        };
                    } else {
                        $ctrl.requireds = {
                            3: true,
                            4: true,
                            5: true,
                            6: true
                        };
                    }
                };

                $ctrl.setConditionValue = function (item, type) {
                    if (!$ctrl.requireds[item.payment_clause] && item.payment_clause != type) {
                        item.condition = 0;
                    } else {
                        item.condition = void 0;
                    }
                };

                $ctrl.$postLink = function () {
                    beforeScan($element);
                };
                $scope.$on('$destroy', function (event) {
                    beforeScan($element, true);
                });

                $ctrl.addPerson2List = function (path, proxy_type, title, max) {
                    if (!angular.isDefined(max)) {
                        max = 99;
                    }
                    var list = getPathValue($ctrl.value, path);
                    if (!list) {
                        list = setPathValue($ctrl.value, path, []);
                    }
                    if (list.length < max) {
                        signUtil.openLayer('addPersonLayer', {proxy_type: proxy_type}, title || '添加').then(function (result) {
                            list.push(result);
                        }, $.noop);
                    } else {
                        layer.alert('此处不允许添加更多人员');
                    }
                };

                $ctrl.modifyPerson = function (person, title) {
                    signUtil.openLayer('addPersonLayer', $.extend(true, {}, person), title || '修改').then(function (result) {
                        $.extend(true, person, result);// 合并修改对象
                    }, $.noop)
                };

                $ctrl.removePerson = function (list, index, $event) {
                    $event && $event.stopPropagation();
                    signUtil.confirm('确定删除此人员信息?').then(function (result) {
                        list.splice(index, 1);
                    }, $.noop);
                };

                $ctrl.createList = function (num, path) {
                    var list = getPathValue($ctrl.value, path);
                    if (!list) {
                        list = setPathValue($ctrl.value, path, []);
                    }
                    list.length = +num;// 优化性能咯。。修改的时候不会删除所有数据
                    full(list);
                };

                /**
                 * 全款付款方式
                 * fullPaymentTermsOne 全款第一次付款
                 * fullPaymentTermsTwo 全款第二次次付款
                 * fullPaymentTermsMany 全款多次付款方式
                 */
                $ctrl.fullPayment = {};
                ['fullPaymentTermsOne', 'fullPaymentTermsTwo', 'fullPaymentTermsMany'].forEach(function (type, index) {
                    signService.getTypes(type).then(function (result) {
                        $ctrl.fullPayment[index] = result.data;
                    });
                });

                /**
                 * 贷款付款方式
                 * loanTermsOne 贷款第一次付款
                 * loanTermsTwo 贷款第二次次付款
                 * loanTermsMany 贷款多次付款方式
                 */
                $ctrl.loanPayment = {};
                ['loanTermsOne', 'loanTermsTwo', 'loanTermsMany'].forEach(function (type, index) {
                    signService.getTypes(type).then(function (result) {
                        $ctrl.loanPayment[index] = result.data;
                    });
                });

                signService.getTypes('payTypeSign').then(function (result) {
                    // 付款方式
                    $ctrl.payTypeList = (result.data || []).slice(1);
                });

                /**
                 * 获取付款方式
                 * @param paymentList 付款方式，值有 loanPayment 贷款,fullPayment 全款
                 * @param index 付款方式
                 * @return {*}
                 */
                $ctrl.getPayment = function (paymentList, index) {
                    return $ctrl[paymentList][index] || $ctrl[paymentList][2] || [];
                };

                $ctrl.getIndexCapital = function (idx) {
                    return '一二三四五六七八九十'.charAt(idx);
                };
            }]
        })

        /**
         * 添加人
         *
         */
        .component('addPersonLayer', {
            template: '<div class="ibox-content">\n    <form class="form-horizontal" novalidate name="$ctrl.form" style="overflow: hidden">\n        <div class="form-group">\n            <label class="col-sm-2 control-label required">姓名：</label>\n            <div class="col-sm-8">\n                <input type="text" class="form-control" ng-model="$ctrl.data.user_name" required>\n            </div>\n        </div>\n        <div class="form-group">\n            <label class="col-sm-2 control-label required">证件类型：</label>\n            <div class="col-sm-8">\n                <sign-card-type ng-model="$ctrl.data.idcard_type_cd" required></sign-card-type>\n            </div>\n        </div>\n        <div class="form-group">\n            <label class="col-sm-2 control-label required">证件编号：</label>\n            <div class="col-sm-8">\n                <input type="text" class="form-control" ng-model="$ctrl.data.idcard_no"\n                       card-type="$ctrl.data.idcard_type_cd" required>\n            </div>\n        </div>\n        <div class="form-group">\n            <label class="col-sm-2 control-label required">通讯地址：</label>\n            <div class="col-sm-8">\n                <input type="text" class="form-control" ng-model="$ctrl.data.user_addr" required>\n            </div>\n        </div>\n        <div class="form-group">\n            <label class="col-sm-2 control-label required">联系方式：</label>\n            <div class="col-sm-8">\n                <sign-phone-number-btn ng-model="$ctrl.data.phone_list" required>\n                </sign-phone-number-btn>\n            </div>\n        </div>\n    </form>\n</div>',
            controller: ['$element', 'signUtil', function ($element, signUtil) {
                var $ctrl = this;
                $ctrl.$start = function ($defer, data, title) {
                    // 设置默认证件类型未 身份证
                    /**
                     * @property user_name 名字
                     * @property idcard_type_cd 证件类型
                     * @property idcard_no  证件号码
                     * @property user_addr  地址
                     * @property phone_list 电话
                     */
                    $ctrl.data = $.extend(true, {}, data || {});

                    // 将证件类型始终转换为 number
                    $ctrl.data.idcard_type_cd = Number($ctrl.data.idcard_type_cd || 1);
                    commonContainer.modal(title || '信息', $element, function (id) {
                        $ctrl.form.$$element.addClass('ng-submitted');
                        if ($ctrl.form.$invalid) {
                            return layer.alert('表单有未完成项');
                        }
                        $defer.resolve($ctrl.data);
                        layer.close(id);
                    }, {cancel: $defer.reject, btn2: $defer.reject, area: ['800px'], overflow: 'auto'});
                };
            }]
        })
        .directive('textareaSup', function () {
            return {
                template: '<div class="textarea-sup">\n    <pre>{{ngModel}}<br></pre>\n    <textarea ng-model="ngModel" ng-trim="false"></textarea>\n</div>',
                require: 'ngModel',
                scope: {ngModel: '='}
            }
        });

    var timer;

    function beforeScan(dom, remove) {
        if (remove) {
            beforeScan.dom = document;
        }
        timer && clearTimeout(timer);
        timer = setTimeout(function () {
            scanCodeIndex(beforeScan.dom || dom);
            beforeScan.dom = null;
        }, 13);
    }

    function scanCodeIndex(dom) {
        var layer = $(dom).closest('.layui-layer');
        $('agreement-code span.code-index', layer.length ? layer[0] : document).each(function (i) {
            this.innerText = i + 1;
        });
    }

    function path2arr(path) {
        return (path || '').split('.');
    }

    function setPathValue(obj, path, value) {
        var arr = path2arr(path);
        for (var i = 0; i < arr.length; i++) {
            var prop = arr[i];
            if (i === arr.length - 1) {
                obj[prop] = value;
                return value;
            }
            if (obj[prop] === undefined) {
                obj = obj[prop] = {};
            } else {
                obj = obj[prop];
            }
        }
    }

    function getPathValue(obj, path) {
        var arr = path2arr(path);
        for (var i = 0; i < arr.length; i++) {
            var prop = arr[i];
            if (obj === undefined) {
                return obj;
            }
            obj = obj[prop];
            if (i === arr.length - 1) {
                return obj;
            }
        }
    }

    function clone(obj) {
        if (obj && typeof obj === 'object') {
            return $.extend(true, new obj.constructor(), obj);
        }
        return obj;
    }

    function path2exp(path) {
        var arr = path2arr(path);
        return arr.map(function (prop) {
            return '[\'' + prop + '\']';
        }).join('');
    }

    function full(arr) {
        var len = arr.length;
        while (len--) {
            if (!arr[len]) {// 不再是覆盖式的修改，而是填充式的修改，当目标没有值的时候才会修改
                arr[len] = {payment_order: len + 1, transfer_way: '', payment_clause: ''};
            }
        }
    }
}());