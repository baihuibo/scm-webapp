/**
 * Created by baihuibo on 2017/5/19.
 */
(function (window) {
    angular.module('agreement-edit', ['base', 'sign-common'])
        .controller('agreementEditCtrl', ['agreementEditService', 'signUtil', 'signService', '$q', function (agreementEditService, signUtil, signService, $q) {
            var $ctrl = this;

            signUtil.importedCss(basePath + '/resources/css/agreement-contract.css');

            var contractId = signUtil.getSearchValue('conId');
            // 协议类型
            var businessType = $ctrl.agrtType = signUtil.getSearchValue('agrtType');
            if (!businessType) {
                businessType = $ctrl.agrtType = signUtil.getSearchValue('business_type');
            }

            // 使用场景（仅在 agrtType=买卖补充协议:2 中存在）
            var paymentType = signUtil.getSearchValue('paymentType');// 1全款，2商业贷款
            var chargeBackId = signUtil.getSearchValue('chargebakcid');// 退单 ID
            var chargeBackSupplFlag = signUtil.getSearchValue('chargeBackSupplFlag');//  是否退单的补充协议

            $ctrl.paymentType = +paymentType;

            // 合同选择回调函数
            function agreementCallBack(conId) {
                $ctrl.conId = conId;
                if (/1|3/.test(businessType)) {// 租赁
                    $ctrl.contractHref = basePath + '/sign/detail/detail.html?formal=true&&conid=' + conId;
                } else { // 买卖
                    $ctrl.contractHref = basePath + '/sign/signthecontract/contractdetail.htm?conId=' + conId;
                }
                agreementEditService.getContractDetail(conId).then(function (result) {
                    if (result.code !== 0) {
                        return layer.alert(result.msg);
                    }
                    $ctrl.contractDetail = result.data;

                    if ($ctrl.codes) {
                        $ctrl.codes = [];
                        queryTmps();
                    } else if (businessType != 2 && !$ctrl.selecteds.length) {
                        selectAllAgreement();
                    }
                });
            }

            contractId && agreementCallBack(contractId);

            $ctrl.choseContract = function () {
                signUtil.openLayer('choseContractLayer', businessType).then(function (con) {
                    agreementCallBack(con.con_id);
                }, $.noop);
            };

            $ctrl.selecteds = [];

            $ctrl.selectAgreement = function () {
                if (!$ctrl.conId) {
                    return layer.alert('请选择合同');
                }
                commonContainer.showLoading();
                agreementEditService.getTermType(businessType, paymentType).then(function (result) {
                    if (result.code !== 0) {
                        return layer.alert(result.msg);
                    }
                    return convertArr2Tree(result.data, businessType);
                }).then(function (treeNode) {
                    commonContainer.hideLoading();
                    return signUtil.openLayer('selectAgreementLayer', treeNode, $ctrl.selecteds, businessType);
                }).then(function (nodes) {
                    $ctrl.selecteds = nodes;
                    queryTmps();
                }, $.noop);
            };

            function selectAllAgreement() {
                agreementEditService.getTermType(businessType).then(function (result) {
                    if (result.code !== 0) {
                        return layer.alert(result.msg);
                    }
                    return result.data;
                }).then(function (nodes) {
                    $ctrl.selecteds = (nodes || []).map(function (item) {
                        return item.id;
                    });
                    queryTmps();
                });
            }

            $ctrl.save = function (form) {
                if (!$ctrl.conId) {
                    return layer.alert('请选择合同');
                }
                if (!$ctrl.codes || !$ctrl.codes.length) {
                    return layer.alert('请选择条款在保存');
                }
                if (form.$invalid) {
                    return layer.alert('表单有未完成项，请完成后再保存');
                }

                ///// 只有业务类型未买卖(2)时才做限制性校验
                var $defer = $q.defer();
                var promise = $defer.promise;
                if (businessType === 2) {
                    var params = signUtil.getRestrictiveDataByCodes($ctrl.codes, 2);
                    promise = signService.validateRestrictive(params).then(function (result) {
                        var data = result.data || {};
                        if (result.code !== 0 || !data.validate) {
                            throw layer.alert(data.message || result.msg);
                        }
                    })
                } else {
                    $defer.resolve();
                }

                promise.then(function () {
                    // 保存补充协议
                    return agreementEditService.saveCodes({
                        "business_type": businessType,
                        "payment_type": paymentType,
                        "charge_back_id": chargeBackId || void 0,
                        "charge_back_suppl_flag": chargeBackSupplFlag || void 0,
                        "con_id": $ctrl.conId,
                        "valueList": $ctrl.codes.map(function (code) {
                            return {
                                "echo_type": code.echo_type,
                                "json_value": angular.toJson(code.value),
                                "supple_agrt_temp_id": code.supple_agrt_temp_id
                            }
                        })
                    })
                }).then(function (result) {
                    if (result.code !== 0) {
                        throw layer.alert(result.msg);
                    }
                    layer.alert('保存成功', {cancel: close}, close);

                    function close() {
                        location.href = basePath + '/sign/agreement/agreement-detail.html?supplAgrtId=' + result.data;
                    }
                }).catch($.noop);
            };

            $ctrl.back = function () {
                if (history.length === 1) {
                    location.href = basePath + '/contract/supplagrt/list';
                } else {
                    history.back();
                }
            };

            function queryTmps() {
                agreementEditService.getCodes($ctrl.selecteds, businessType)
                    .then(function (result) {
                        if (result.code !== 0) {
                            return layer.alert(result.msg);
                        }
                        if ($ctrl.codes && $ctrl.codes.length) {
                            $ctrl.codes = comboCodes($ctrl.codes, result.data);
                        } else {
                            $ctrl.codes = result.data;
                        }
                    });
            }
        }])
        .service('agreementEditService', ['$http', function ($http) {
            /**
             * 获取合同信息
             * @param {String} conId 合同 id
             */
            this.getContractDetail = function (conId) {
                return $http.get(basePath + "/contract/supplagrt/getConInfoByConId", {params: {conId: conId}})
                    .then(function (response) {
                        return response.data;
                    })
            };

            this.getTermType = function (agrtType, paymentType) {
                return $http.get(basePath + '/contract/supplagrt/getTermType', {
                    params: {
                        agrtType: agrtType,
                        paymentType: paymentType
                    }
                }).then(function (response) {
                    return response.data;
                });
            };

            // 根据补充协议 id 查询对应的条款模板
            this.getCodes = function (ids, agrtType) {
                return $http.get(basePath + '/contract/supplagrt/getTempletContent', {
                    params: {
                        ids: ids,
                        agrtType: agrtType
                    }
                })
                    .then(function (response) {
                        return response.data;
                    });
            };

            /**
             * 保存补充协议
             * @param data
             * @param data.business_type 类型(1：租赁，2：买卖，3：租赁退单，4：买卖退单) ,
             * @param data.charge_back_id 退单ID ,
             * @param data.charge_back_suppl_flag 是否退单补充协议（0：否，1：是） ,
             * @param data.con_id 合同主键ID ,
             * @param {array<obj>}data.valueList 模板ID及对应的值 ,
             */
            this.saveCodes = function (data) {
                return $http.post(basePath + '/contract/supplagrt/add', data).then(function (resposne) {
                    return resposne.data;
                });
            };
        }])

        // 协议类型过滤
        .filter('agrtType', function () {
            var type = {
                1: '租赁补充协议',
                2: '买卖补充协议',
                3: '租赁退单声明',
                4: '买卖退单声明'
            };
            return function (input) {
                return type[input] || input;
            }
        });

    /**
     * 数组元素查找
     * @param {Array} arr
     * @param {Function} test
     * @returns {*}
     */
    function find(arr, test) {
        for (var i = 0, len = arr.length; i < len; i++) {
            var obj = arr[i];
            if (test(obj, i, arr)) {
                return obj;
            }
        }
    }

    /**
     * 合并数组，保留俩个数组中的相同部分，忽略旧的数组中多余的部分，加入新数组的多余部分，并且排序
     * @param list
     * @param newList
     * @returns list
     */
    function comboCodes(list, newList) {
        var codes = [];
        list.forEach(function (code) {
            var item = newList.find(function (newItem) {
                return newItem.seq_num === code.seq_num;
            });
            item && codes.push(code);
        });
        newList.forEach(function (newItem) {
            var item = codes.find(function (item) {
                return item.seq_num === newItem.seq_num;
            });
            !item && codes.push(newItem);
        });

        return _.sortBy(codes, 'seq_num');
    }

    /**
     * 转换数组数据为 treeArray
     * @param {Array} arr 数据
     * @param {String} agrtType 协议类型
     * @returns {Array} treeData 树形结构数据
     */
    function convertArr2Tree(arr, agrtType) {
        var tmp = {};
        for (var i = 0, l = arr.length; i < l; i++) {
            var obj = arr[i];
            var type = obj.type || 'a', term_type = obj.term_type;
            var typeNode = tmp[type];
            if (!typeNode) {// 如果类型不存在
                typeNode = tmp[type] = {name: type + '类', children: []};
            }
            var termTypeNode = find(typeNode.children, function (item) {
                return term_type === item.name
            });
            if (!termTypeNode) {
                termTypeNode = {
                    name: term_type,
                    children: []
                };
                typeNode.children.push(termTypeNode);
            }
            if (!obj.name) {
                obj.name = obj.term_name;
            }
            termTypeNode.children.push(obj);
        }
        var tree = [];
        Object.keys(tmp).forEach(function (key) {
            tree.push(tmp[key]);
        });
        if (+agrtType !== 2) {
            tree = tree[0].children;
        }
        return tree;
    }

    angular.bootstrap(document, ['agreement-edit']);
}(window));