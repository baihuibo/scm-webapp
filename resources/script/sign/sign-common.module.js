/**
 * Created by baihuibo on 2017/5/5.
 */
(function (window) {
    angular.module('sign-common', ['base'])
        .service('signUtil', ['$q', '$compile', '$rootScope', function ($q, $compile, $rootScope) {
            var signUtil = this;

            // 确认操作提示框
            signUtil.confirm = function (title) {
                var defer = $q.defer();

                setTimeout(function () {
                    commonContainer.confirm(title, function (id) {
                        layer.close(id);
                        defer.resolve();
                    }, defer.reject);
                }, 1);

                return defer.promise;
            };

            /**
             * 获取查看房源地址
             * @param houseid
             * @param kind 业务类型，1 = 租赁， 2 = 买卖
             * @return {string}
             */
            signUtil.getHouseLInk = function (houseid, kind) {
                var href;
                if (kind === 1) {// 租赁
                    href = basePath + '/house/main/leasedetail.htm?houseid=' + houseid; // 租赁
                } else {
                    href = basePath + '/house/main/buydetail.htm?houseid=' + houseid; // 买卖
                }
                return href;
            };

            // 获取查看客源地址
            signUtil.getCustomerLink = function (customerid, kind) {
                if (kind == 2) {
                    return basePath + '/customer/main/findbuyerclientbycustomerid.htm?customerId=' + customerid;
                } else {
                    return basePath + '/customer/main/findleaseclientbycustomerid.htm?customerId=' + customerid;
                }

            };

            /**
             * 对参数字符串特殊处理
             * @param str
             * @example
             * var str = 'name=白惠波&age=12'
             * str = signUtil.formatParam(str);
             * // str = 'name=%E7%99%BD%E6%83%A0%E6%B3%A2&age=12'
             * @return {string}
             */
            signUtil.formatParam = function (str) {
                return (str || '').split('&').map(function (t) {
                    t = t.split('=');
                    t[1] = encodeURIComponent(t[1]);
                    return t.join('=');
                }).join('&');
            };

            // 获取url参数
            signUtil.getSearchValue = function (name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", 'i');
                var r = window.location.search.substring(1).match(reg);
                if (r) return decodeURIComponent(r[2]);
                return null;
            };

            // 表单错误项展示到屏幕中
            signUtil.formInvalidIntoView = function (form) {
                var el = $(form).find('.ng-invalid').get(0);
                if (el && el.localName === 'select') {
                    el = $(el).next().get(0);
                }
                if (el) {
                    el.scrollIntoView();// 将未完成的元素第一个展示到屏幕中间
                }
            };

            signUtil.uuid = function (prefix) {
                return (prefix || '') + Math.random().toString(16).substr(2);
            };

            // 串转驼峰 (aaa-test) => (aaaTest)
            signUtil.strandToCamel = function strandToCamel(name) {
                return name.replace(/-([a-z])/g, function (all, letter) {
                    return letter.toUpperCase();
                });
            };

            // 驼峰转串 (aaaTest) => (aaa-test)
            signUtil.camelToStrand = function camelToStrand(name) {
                return name.replace(/([A-Z])/g, function (all, upper) {
                    return '-' + upper.toLowerCase();
                });
            };

            // 打开弹出窗
            signUtil.openLayer = function (directive) {
                var directiveName = signUtil.camelToStrand(directive);

                var args = [].slice.call(arguments, 1);
                var $node = $('<' + directiveName + ' temp-layer></' + directiveName + '>');
                var scope = $rootScope.$new();
                var defer = $q.defer();

                $node.hide().appendTo('body');
                $compile($node)(scope);

                function getCompCtrl() {
                    var $ctrl = $node.controller(directive);

                    // 可能存在的情况，当组件的模板是异步加载的情况下，组件还未初始化，则使用轮训模式处理
                    if (!$ctrl) return setTimeout(getCompCtrl, 13);

                    setTimeout(function () {
                        scope.$applyAsync(function () {
                            $ctrl.$start && $ctrl.$start.apply($ctrl, [defer].concat(args));
                            $node.removeAttr('temp-layer');
                        });
                    }, 1);
                }

                getCompCtrl();

                function remove() {
                    scope.$destroy();
                    $node.remove();
                }

                defer.promise.then(remove, remove);

                return defer.promise;
            };

            /**
             * 禁止文本选择
             * @param el
             */
            signUtil.disableSelection = function (el) {
                $(el)
                    .attr('unselectable', 'on')
                    .css({
                        '-webkit-user-select': 'none', /* and add the CSS class here instead */
                        '-o-user-select': 'none',
                        '-ms-user-select': 'none',
                        'user-select': 'none'
                    }).on('selectstart', false);
            };

            signUtil.getViewValue = function (ngModel) {
                return new Promise(function promise(resolve) {
                    if (!isNaN(ngModel.$viewValue)) {
                        return resolve(ngModel.$viewValue);
                    }
                    setTimeout(function () {
                        promise(resolve);
                    }, 3);
                });
            };

            // 导入样式文件
            var cssOnce = {};
            signUtil.importedCss = function (path) {
                if (!cssOnce[path]) {
                    var link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = path;
                    document.head.appendChild(link);
                    cssOnce[path] = true;
                }
            };

            signUtil.validate = {
                // 支持格式 xxx-xxxxxxxx  xxxx-xxxxxxx  xxxxxxxx xxxxxxx
                tel: function (str) {// 座机号码
                    return /^(\d{3,4}-)?\d{7,8}$/.test(str);
                },
                phoneNumber: function (str) { // 手机号码
                    return /^1[34578][0-9]{9}$/.test(str);
                },
                idCardNumber: function (str) { // 普通居民身份证件号码
                    return /(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(str);
                },
                policeCardNumber: function (str) { //  军警身份证件号码
                    return !!str;
                },
                taiWCardNumber: function (str) {// 台湾身份证
                    return /^[A-Z][0-9]{9}$/.test(str);
                },
                hongKongCardNumber: function (str) {// 香港身份证
                    return /^[A-Z][0-9]{6}\([0-9A]\)$/.test(str);
                },
                aoCardNumber: function (str) {// 澳门身份证
                    return /^[157][0-9]{6}\([0-9]\)$/.test(str);
                },
                passport: function (str) {// 护照
                    return /^(P\d{7})|(G\d{8})$/.test(str) || /^[a-zA-Z0-9]{3,21}$/.test(str);
                },
                officerSoldierCard: function (str) {// 军官/士兵证
                    return /^[a-zA-Z0-9]{7,21}$/.test(str);
                },
                hkAMacaoPass: function (str) {// 港澳通行证
                    return /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/.test(str);
                },
                email: function (str) {
                    return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
                },
                zipCode: function (str) {// 邮编
                    return /^[0-9]{6}$/.test(str);
                }
            };

            function valueFn(data) {
                return function () {
                    return data;
                }
            }

            signUtil.valueFn = valueFn;

            signUtil.validateMapCardType = {
                1: signUtil.validate.idCardNumber,
                2: valueFn(true),// signUtil.validate.policeCardNumber
                3: valueFn(true),// signUtil.validate.hongKongCardNumber
                4: valueFn(true),// signUtil.validate.aoCardNumber
                5: valueFn(true),// signUtil.validate.taiWCardNumber
                6: valueFn(true),// signUtil.validate.passport
                7: valueFn(true),// signUtil.validate.hkAMacaoPass
                8: valueFn(true),// signUtil.validate.officerSoldierCard
                9: valueFn(true),// signUtil.validate.officerSoldierCard
                10: valueFn(true),// signUtil.validate.officerSoldierCard
            };

            // 创建打印控件
            signUtil.printerTools = {
                createPrinter: function () {
                    var toolsId = 'jatoolsPrinter';
                    if (!document.getElementById(toolsId)) {
                        document.head.insertAdjacentHTML('afterBegin', '<object id="jatoolsPrinter" ' +
                            'classid="CLSID:B43D3361-D075-4BE2-87FE-057188254255" ' +
                            'codebase="jatoolsPrinter.cab#version=5,7,0,0"></object>');
                    }
                    return document.getElementById(toolsId);
                },
                getStatusText: function (status) {
                    var JOB_STATUS_PAUSED = 1;
                    var JOB_STATUS_ERROR = 2;
                    var JOB_STATUS_DELETING = 4;
                    var JOB_STATUS_SPOOLING = 8;
                    var JOB_STATUS_PRINTING = 16;
                    var JOB_STATUS_OFFLINE = 32;
                    var JOB_STATUS_PAPEROUT = 64;
                    var JOB_STATUS_PRINTED = 128;
                    var JOB_STATUS_DELETED = 148;
                    var JOB_STATUS_BLOCKED_DEVQ = 512;
                    var JOB_STATUS_USER_INTERVENTION = 1024;
                    var JOB_STATUS_RESTART = 2048;
                    var message = '';
                    if (status & JOB_STATUS_PAUSED) message += "暂停 -";
                    if (status & JOB_STATUS_ERROR) message += "出错 -";
                    if (status & JOB_STATUS_DELETING) message += "正在删除 -";
                    if (status & JOB_STATUS_SPOOLING) message += "进入队列 -";
                    if (status & JOB_STATUS_PRINTING) message += "正在打印 -";
                    if (status & JOB_STATUS_OFFLINE) message += "脱机 -";
                    if (status & JOB_STATUS_PAPEROUT) message += "没纸了 -";
                    if (status & JOB_STATUS_PRINTED) message += "打印结束 -";
                    if (status & JOB_STATUS_DELETED) message += "删除 -";
                    if (status & JOB_STATUS_BLOCKED_DEVQ) message += "堵了 -";
                    if (status & JOB_STATUS_USER_INTERVENTION) message += "用户正在介入 -";
                    if (status & JOB_STATUS_RESTART) message += "重启了 -";
                    return message;
                }
            };

            // 租金折扣计算
            signUtil.commission = {
                /**
                 * 计算总折扣
                 * @param data
                 * @param data.charge_object  服务费收取对象
                 * @param data.customer_commission_convention 客户合同约定
                 * @param data.owner_commission_convention  业主合同约定
                 * @param data.customer_commission_stipulate  客户公司规定
                 * @param data.owner_commission_stipulate  业主合同约定
                 * @returns {string}
                 */
                countTotal: function (data) {
                    var chargeObject = data.charge_object || [];// 客户费收取对象
                    // 合同约定佣金
                    var commission = 0;
                    if (chargeObject.indexOf(1) > -1) { // 客户
                        commission += data.customer_commission_convention || 0;
                    }
                    if (chargeObject.indexOf(2) > -1) { // 业主
                        commission += data.owner_commission_convention || 0;
                    }

                    // 公司规定佣金
                    var commissionFix = 0;
                    if (chargeObject.indexOf(1) > -1) { // 客户
                        commissionFix += data.customer_commission_stipulate || 0;
                    }
                    if (chargeObject.indexOf(2) > -1) { // 业主
                        commissionFix += data.owner_commission_stipulate || 0;
                    }

                    return (commission / commissionFix * 10 || 0).toFixed(2);
                },
                /**
                 *客户佣金占月租金比例
                 * @param data
                 * @param data.customer_commission_convention  客户合同约定
                 * @param data.rent_standard 月租金
                 */
                customerPaymentProportion: function (data) {
                    var cpp = (data.customer_commission_convention || 0) / data.rent_standard * 100;
                    return Math.floor(cpp);
                },

                /**
                 * 业主佣金占月租金比例
                 * @param data
                 * @param data.owner_commission_convention 业主合同约定
                 * @param data.rent_standard 月租金
                 */
                ownerPaymentProportion: function (data) {
                    var opp = (data.owner_commission_convention || 0) / data.rent_standard * 100;
                    return Math.floor(opp);
                }
            };

            /**
             * 根据 codes 生成限制性校验参数
             * @param codes
             * @param businessType 业务类型，1 租赁，2 买卖
             * @return {{customers: Array, owners: Array}}
             */
            signUtil.getRestrictiveDataByCodes = function (codes, businessType) {
                var validateRestrictiveParams = {
                    customers: [],
                    owners: [],
                    businessTypeId: businessType
                };
                var idsMapper = {
                    18: ['customer_list', 'customers'],// 签约后需要变更购买人 B
                    19: ['owner_list', 'owners'], // 签约后需要变更卖方的
                };
                codes.forEach(function (code) {
                    var args = idsMapper[code.supple_agrt_temp_id];
                    if (args) {
                        var list = code.value[args[0]] || [];
                        list.forEach(function (item) {
                            validateRestrictiveParams[args[1]].push(formToCard(item));
                        });
                    }
                });
                return validateRestrictiveParams;
            };

            function formToCard(item) {
                return {
                    idCard: item.idcard_no,
                    idCardTypeId: item.idcard_type_cd
                }
            }
        }])

        .service('signService', ['$http', function ($http) {
            var sysKeyCache = {};
            // 获取类型列表
            this.getTypes = function getTypes(keyCode) {
                if (sysKeyCache[keyCode]) {
                    return sysKeyCache[keyCode];
                }
                return sysKeyCache[keyCode] = $http.get(basePath + '/custom/common/sys_cfg_key_select?keyCode=' + keyCode)
                    .then(function (response) {
                        var result = response.data;
                        if (result.data) {
                            result.data.forEach(function (item) {
                                item.valueCode = +item.valueCode;
                            });
                        }

                        return response.data;
                    });
            };

            /**
             * 获取合同服务费系数
             * @returns Promise({cusBrokerageReceivable , ownBrokerageReceivable})
             */
            this.getLeaseServiceChage = function () {
                return $http.get(basePath + '/sign/lease/getServiceChage')
                    .then(function (response) {
                        return response.data;
                    })
            };

            /**
             * 限制性校验
             * @param data.buildingNo?
             * @param data.businessTypeId? 1, // 业务类型id 1: 租赁 2: 买卖
             * @param data.customers?
             * @param data.owners?
             * @return {*}
             */
            this.validateRestrictive = function (data) {
                return $http.post(basePath + '/restrictive/validaterestrictive', data)
                    .then(function (response) {
                        return response.data;
                    });
            };

            // 获取当前登陆用户信息
            this.getCurrentUserInfo = function () {
                return $http.get(basePath + '/sign/lease/getCurrentUser')
                    .then(function (response) {
                        return response.data;
                    });
            };

            /////////  工作流
            /**
             * 查询流程动作列表
             * @param tmpId
             */
            this.queryWorkFlowButton = function (tmpId) {
                return $http.get(basePath + '/workflow/selectShowLabelBytemplateId', {params: {templateId: tmpId}})
                    .then(function (response) {
                        return response.data;
                    })
            };

            /**
             * 执行工作流动作
             */
            this.workFlowDoJob = function (postData, paramsData) {
                return $http.post(basePath + '/workflow/doJob', postData, {
                    params: paramsData
                }).then(function (response) {
                    return response.data;
                })
            };

            /**
             * 获取附件类型
             * @param contractId 合同 id
             * @param operateType 操作类型(1显示所有类型、2筛选掉已添加类型)
             */
            this.getEnclosureType = function (contractId, operateType) {
                return $http.get(basePath + '/sign/enclosureType', {
                    params: {
                        contractId: contractId,
                        operateType: operateType
                    }
                }).then(function (response) {
                    return response.data;
                });
            };

            /**
             * 多文件上传
             * @param files 文件列表
             */
            this.uploadFiles = function (files) {
                return $http.post(basePath + '/custom/common/multiFileUpload', {}, {
                    headers: {'Content-Type': undefined},
                    transformRequest: function () {
                        var formData = new FormData();
                        angular.forEach(files, function (file) {
                            formData.append('files', file);
                        });
                        return formData;
                    }
                }).then(function (response) {
                    return response.data;
                });
            };


            var areaListPromise;
            /**
             * 获取区域列表
             * @returns {*}
             */
            this.getAreaList = function () {
                if (areaListPromise) {
                    return areaListPromise;
                }
                return areaListPromise = $http.get(basePath + '/sign/contractSales/arealist').then(function (response) {
                    return response.data;
                });
            };
        }])

        // 转换钱到大写
        .filter('signCurrency', function () {
            return function (value) {
                if (!value) {
                    if (value == 0) {
                        return '零元整';
                    } else {
                        return '';
                    }
                }
                return convertCurrency(value);
            }
        })

        // 显示电话号码为符号拼接，默认逗号
        .filter('phoneNumberShow', function () {
            return function (phones, separator) {
                if (phones && phones.join) {
                    return phones.join(separator || ',');
                }
                return phones;
            }
        })

        .filter('monthLength', function () {
            if (!window.moment) {
                throw "计算月份需要 moment 组件"
            }
            return function (start, end) {
                var startTime = moment(start);
                var endTime = moment(end);
                if (start && end) {
                    return Math.ceil(endTime.diff(startTime, 'months', true)) || 1;
                }
            }
        })

        .filter('monthLength2str', function () {
            return function (len) {
                var yearLen = Math.floor(len / 12);
                var monthLen = Math.ceil(len - (12 * yearLen));
                var result = '';
                if (yearLen) {
                    result += yearLen + ' 年 ';
                }
                if (monthLen) {
                    result += monthLen + ' 月 '
                }
                return result || '';
            }
        })

        // 是或者否转换，0 = 否，1 = 是
        .filter('yesOrNo', function () {
            return function (value) {
                return parseInt(value) ? '是' : '否';
            }
        })

        // keyCode 类型通用转换
        .filter('showKeyCodeTypes', ['signService', function (signService) {
            var type = {}, loading = {};

            function filter(value, keyCode) {
                if (type[keyCode]) {
                    if (!value) {
                        value = [];
                    } else if (!value.join) {
                        value = [parseInt(value)];// 包装为数组
                    }
                    return type[keyCode].filter(function (item) {
                        return value.indexOf(item.valueCode) > -1;
                    }).map(function (item) {
                        return item.valueName;
                    }).join(' , ');
                } else if (!loading[keyCode]) {
                    loading[keyCode] = signService.getTypes(keyCode).then(function (result) {
                        type[keyCode] = result.data;
                    });
                }
            }

            filter.$stateful = true;
            return filter;
        }])

        // 附件类型转换
        .filter('showEnclosureType', ['signService', function (signService) {
            var promise, enclosureTypes;

            function filter(input, conid) {
                if (enclosureTypes) {
                    for (var i = 0; i < enclosureTypes.length; i++) {
                        var obj = enclosureTypes[i];
                        if (obj.key == input) {
                            return obj.value;
                        }
                    }
                }
                if (!promise) {
                    promise = signService.getEnclosureType(conid, 1).then(function (result) {
                        enclosureTypes = result.data;
                    });
                }
            }

            filter.$stateful = true;
            return filter;
        }])

        /**
         * 数组过滤
         */
        .filter('arrayPluck', function () {
            return function (input, prop, separator) {
                return (input || []).map(function (item) {
                    return item[prop];
                }).join(separator || ', ');
            }
        })

        .filter('date2stamp', function () {
            return function (date) {
                if (date) {
                    if (document.documentMode) {//兼容ie
                        return Date.parse(date.replace(/\.\d+/, '').replace(/-/g, '/'));//转化格式成时间戳
                    } else {
                        return Date.parse(date);
                    }
                }
                return null;
            }
        })

        .directive('forceSrc', function () {
            return {
                scope: {
                    forceSrc: '='
                },
                link: function (scope, el, attr) {
                    scope.$watch('forceSrc', function (val) {
                        el.attr('src', val);
                    });
                }
            }
        })

        // 强制正整数
        .directive('focusInteger', function () {
            return function (scope, el, attr) {
                el.on('keydown', function (e) {
                    var key = e.keyCode;
                    if (key >= 65 && key <= 90 || (key === 189 || key === 190)) {// a-z - .
                        e.stopPropagation();
                        e.preventDefault();
                    }
                });
            }
        })

        // 电话号码限制只允许输入数字
        .directive('phoneNumber', function () {
            return function (scope, el, attr) {
                el.on('keydown', function (e) {
                    if (e.key && e.key.length === 1 && !/\d/.test(e.key)) {
                        return false;
                    }
                }).on('compositionstart', false)
                    .on('compositionend', function (e) {
                        if (e.originalEvent && e.originalEvent.data && this.value) {
                            var data = e.originalEvent.data || '';
                            var idx = this.selectionStart || this.selectionEnd;
                            var value = this.value;
                            this.value = value.slice(0 , idx - data.length) + value.slice(idx , value.length);
                        }
                    });
            }
        })

        // 禁用小数
        .directive('disabledDecimal', function () {
            return function (scope, el, attr) {
                el.on('keydown', function (e) {
                    var key = e.keyCode;
                    if (key >= 65 && key <= 90 || (key === 190)) {// a-z - .
                        e.stopPropagation();
                        e.preventDefault();
                    }
                });
            }
        })

        // 禁用负数
        .directive('disabledNegative', function () {
            return function (scope, el, attr) {
                el.on('keydown', function (e) {
                    var key = e.keyCode;
                    if (key >= 65 && key <= 90 || (key === 189)) {// a-z -
                        e.stopPropagation();
                        e.preventDefault();
                    }
                });
            }
        })

        /**
         * 使得angular的input=number支持使用string作为初始值
         * 使得 angular 的 input 支持 price 作为 type，自动使用分位符
         */
        .directive('input', function () {
            return {
                require: '?ngModel',
                link: function (scope, el, attr, ngModel) {
                    if (ngModel) {
                        if (attr.type === 'number') {
                            ngModel.$parsers.push(parseFloat);
                            ngModel.$formatters.push(parseFloat);
                        } else if (attr.type === 'price') {
                            commonContainer.formatPrice(el);

                            // 处理用户输入转换为数字 view => model
                            ngModel.$parsers.push(function (value) {
                                return parseFloat(String(value || 0).replace(/,/g, ''));
                            });

                            // 从 model => view 时，做转换处理
                            ngModel.$formatters.push(commonContainer.formatNumber);
                        }
                    }
                }
            }
        })

        .directive('notGreaterTo', function () {
            return {
                scope: {
                    notGreaterTo: '@'
                },
                require: ['ngModel', '^^form'],
                link: function (scope, el, attr, models) {
                    var ngModel = models[0],
                        formControl = models[1];
                    ngModel.$el = el;
                    el.on('keyup', function () {
                        var notGreaterTo = formControl[scope.notGreaterTo];
                        try {
                            notGreaterTo.$el.trigger('keyup.valid');
                        } catch (e) {
                        }
                    }).on('keyup.valid', valid);

                    function valid() {
                        var notGreaterTo = formControl[scope.notGreaterTo];
                        try {
                            var viewValue = parseInt(notGreaterTo.$viewValue);
                            var value = parseInt(el.val());
                            var valid = value < viewValue || value === viewValue;
                            ngModel.$setValidity('notGreaterTo', valid, true);
                            scope.$applyAsync();
                        } catch (e) {
                        }
                    }
                }
            }
        })
        .directive('notLessTo', function () {
            return {
                scope: {
                    notLessTo: '@'
                },
                require: ['ngModel', '^^form'],
                link: function (scope, el, attr, models) {
                    var ngModel = models[0],
                        formControl = models[1];
                    ngModel.$el = el;
                    el.on('keyup', function () {
                        var notLessTo = formControl[scope.notLessTo];
                        try {
                            notLessTo.$el.trigger('keyup.valid');
                        } catch (e) {
                        }
                    }).on('keyup.valid', valid);

                    function valid() {
                        var notLessTo = formControl[scope.notLessTo];
                        try {
                            var viewValue = parseInt(notLessTo.$viewValue);
                            var value = parseInt(el.val());
                            var valid = value > viewValue || value === viewValue;

                            ngModel.$setValidity('notLessTo', valid, true);
                            scope.$applyAsync();
                        } catch (e) {
                        }
                    }
                }
            }
        })

        // 通用证件类型校验工具
        .directive('cardType', ['signUtil', function (signUtil) {
            return {
                scope: {
                    cardType: '='
                },
                require: 'ngModel',
                link: function (scope, el, attr, ngModel) {
                    scope.$watch('cardType', function (value) {
                        try {
                            ngModel.$validate();
                        } catch (e) {
                        }
                    });
                    el.on('keydown', function (e) {
                        if (e.key && e.key.length === 1 && !/\w/.test(e.key) || e.key === '_') {// 不允许输入字母数字之外的字符
                            return false;
                        }
                    }).on('change blur', function (e) {
                        this.value = this.value.replace(/[\W_]/g, ''); // 移除非数字字母
                    }).css({'ime-mode': 'disabled'});

                    ngModel.$validators.cardType = function (value) {
                        if (value === '' || value === undefined || value === null) {
                            return true;
                        }
                        try {
                            return signUtil.validateMapCardType[scope.cardType || 1](value);
                        } catch (e) {
                        }
                    };
                }
            }
        }])
        // 通用类型校验工具
        .directive('validate', ['signUtil', function (signUtil) {
            return {
                scope: {
                    validate: '@'
                },
                require: 'ngModel',
                link: function (scope, el, attr, ngModel) {
                    scope.$watch('validate', function (value) {
                        try {
                            ngModel.$validate();
                        } catch (e) {
                        }
                    });
                    ngModel.$validators.cardType = function (value) {
                        try {
                            return signUtil.validate[scope.validate](value);
                        } catch (e) {
                        }
                    };
                }
            }
        }])

        .component('areaChosen', {
            template: '<select class="form-control" chosen\n        ng-model="$ctrl.item" required ng-change="$ctrl.chosen($ctrl.item)"\n        ng-options="item as item.areaName for item in $ctrl.areaList">\n    <option value="">请选择区</option>\n</select>',
            bindings: {ngModel: '=', areaName: '='},
            controller: function ($scope, signService) {
                var $ctrl = this;
                signService.getAreaList().then(function (result) {
                    $ctrl.areaList = result.data || [];
                    if ($ctrl.ngModel) {
                        $ctrl.item = $ctrl.areaList.find(function (item) {
                            return +item.areaId === +$ctrl.ngModel;
                        });
                    }
                });

                $ctrl.chosen = function (item) {
                    if (item) {
                        $ctrl.ngModel = item.areaId;
                        $ctrl.areaName = item.areaName;
                    } else {
                        $ctrl.areaName = $ctrl.ngModel = void 0;
                    }
                };
            }
        })

        .component('showText', {
            template: '<a ng-transclude href="javascript:" ng-click="$ctrl.showText()"></a>',
            transclude: true,
            bindings: {text: '<'},
            controller: function () {
                var $ctrl = this;
                $ctrl.showText = function () {
                    commonContainer.alert($ctrl.text);
                };
            }
        })

        /**
         * @name personShow 经纪人展示组件
         */
        .component('personShow', {
            template: '<a href="javascript:" ng-click="$ctrl.openInfoLayer()">{{$ctrl.personName}}</a>',
            bindings: {personId: '<', personName: '<'},
            controller: function () {
                var $ctrl = this;
                $ctrl.openInfoLayer = function () {
                    setTimeout(function () {
                        getUserStaffInfo($ctrl.personId);
                    }, 1);
                };
            }
        })

        /**
         * 文件下载支持 现在可以直接使用原生的 download 属性
         * 在 Chrome，Firefox 中使用原生的行为处理
         * 在 IE 其它浏览器中使用接口模拟
         * @example
         * <example>
         *     <file name="demo.html">
         *        <a href="http://path/to/file" download>下载</a>
         *     </file>
         * </example>
         */
        .directive('download', function ($http) {
            var isSupport = 'download' in document.createElement('a');
            return function (scope, el, attr) {
                if (!isSupport && el.is('a')) {
                    el.one('click', function () {
                        this.target = '_blank';
                        this.href = basePath + '/sign/downloadEnclosure?filePath=' + encodeURIComponent(this.href);
                    });
                }
            }
        })

        // select chosen 组件
        .directive('chosen', function () {
            return function (scope, element, attr) {
                if (!element.chosen) {
                    throw new Error('使用 chosen 指令需要加载插件 #set($plugins = ["chosen"]) ');
                }

                var tabContent = element.closest('.tab-content');
                var navTabs = tabContent.prev();
                var tabPane = element.closest('.tab-pane');

                if (tabContent.length && navTabs.is('.nav-tabs')) {
                    navTabs.on('shown.bs.tab', function (e) {
                        if ($(e.target).parent().index() === tabPane.index()) {
                            updated();
                        }
                    });
                }

                if (element.closest('[temp-layer]').length) {
                    waitFor(init);
                } else if (element.is(':visible')) {
                    setTimeout(init, 13);
                } else {
                    var unwatch = scope.$watch(function () {
                        return element.is(':visible');
                    }, function (visible) {
                        if (visible) {
                            setTimeout(init, 13);
                            unwatch();
                        }
                    });
                }

                function waitFor(cb) {
                    if (element.closest('[temp-layer]').length) {
                        return setTimeout(function () {
                            waitFor(cb);
                        }, 13);
                    }
                    cb();
                }

                function init() {
                    element.chosen({
                        disable_search_threshold: 10,
                        placeholder_text: ' ',
                        no_results_text: "未找到此选项!"
                    });

                    scope.$watch(function () {
                        return element.children().length
                    }, updated);

                    if (attr.ngModel) {// 如果model变化导致的select变化时，更新组件显示
                        scope.$watch(attr.ngModel, updated)
                    }

                    scope.$on('$destroy', function () {
                        element.chosen('destroy');
                    });
                }

                function updated() {
                    element.trigger('chosen:updated');
                }
            }
        });
}(window));