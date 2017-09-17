/**
 * Created by baihuibo on 2017/5/19.
 */
(function (window) {
    angular.module('agreement-detail', ['base', 'sign-common'])
        .controller('agreementDetailCtrl', ['agreementDetailService', 'signUtil', 'signService', '$q', function (agreementDetailService, signUtil, signService, $q) {
            var $ctrl = this;

            signUtil.importedCss(basePath + '/resources/css/agreement-contract.css');

            var formId = signUtil.getSearchValue('supplAgrtId');
            var docbizkey = signUtil.getSearchValue('docbizkey');
            var taskId = signUtil.getSearchValue('taskId');
            var isEnd = !!signUtil.getSearchValue('isEnd');
            var tempId = signUtil.getSearchValue('templateId');
            $ctrl.tIsDone = signUtil.getSearchValue('t') === 'done';

            var agrtType,
                conId,
                paymentType,
                chargeBackId,
                chargeBackSupplFlag;

            $ctrl.modifyMode = false;
            var detailObj, modelName;

            if (docbizkey) {
                var idx = docbizkey.indexOf('-');
                formId = $ctrl.formId = docbizkey.substr(idx + 1);
                $ctrl.docbizkey = true;
            }
            if (docbizkey && tempId && !$ctrl.tIsDone) {
                signService.queryWorkFlowButton(tempId).then(function (result) {
                    if (result.code !== 0) {
                        return layer.alert(result.msg);
                    }
                    $ctrl.workFlowButtons = result.data;
                });
            }

            var modelNameMapping = {
                1: 'LEASE_SUPPL_AGRT', // 租赁
                2: 'BUY_SUPPL_AGRT', // 买卖
                3: 'LEASE_BACK_SUPPL_AGRT', // 租赁退单
                4: 'BUY_BACK_SUPPL_AGRT', // 买卖退单
            };

            commonContainer.showLoading();
            agreementDetailService.getSupplAgrtById(formId).then(function (result) {
                if (result.code !== 0) {
                    return layer.alert(result.msg);
                }
                detailObj = $ctrl.detailObj = result.data;

                agrtType = $ctrl.agrtType = +detailObj.agrt_type;
                modelName = modelNameMapping[agrtType];
                conId = detailObj.con_id;
                paymentType = $ctrl.paymentType = detailObj.payment_type;
                chargeBackId = detailObj.charge_back_id;
                chargeBackSupplFlag = detailObj.charge_back_suppl_flag;

                agreementCallBack(detailObj.con_id, true).then(function () {
                    commonContainer.hideLoading();
                    review(detailObj.valueList);
                });
            });


            // 合同选择回调函数
            function agreementCallBack(conId, review) {
                $ctrl.conId = conId;

                if (agrtType === 1 || agrtType === 3) {// 租赁
                    $ctrl.contractHref = basePath + '/sign/detail/detail.html?formal=true&&other=true&&conid=' + conId;
                } else { // 买卖
                    $ctrl.contractHref = basePath + '/sign/signthecontract/contractdetail.htm?other=true&conId=' + conId;
                }

                return agreementDetailService.getContractDetail(conId).then(function (result) {
                    if (result.code !== 0) {
                        return layer.alert(result.msg);
                    }
                    $ctrl.contractDetail = result.data;
                    $ctrl.codes = [];
                    !review && queryTmps();
                });
            }

            $ctrl.choseContract = function () {
                if ($ctrl.docbizkey) {
                    return;
                }
                signUtil.openLayer('choseContractLayer', agrtType).then(function (con) {
                    agreementCallBack(con.con_id);
                }, $.noop);
            };

            $ctrl.selecteds = [];

            $ctrl.selectAgreement = function () {
                commonContainer.showLoading();
                agreementDetailService.getTermType(agrtType, paymentType).then(function (result) {
                    if (result.code !== 0) {
                        return layer.alert(result.msg);
                    }
                    return convertArr2Tree(result.data, agrtType);
                }).then(function (treeNode) {
                    commonContainer.hideLoading();
                    return signUtil.openLayer('selectAgreementLayer', treeNode, $ctrl.selecteds, agrtType);
                }).then(function (nodes) {
                    $ctrl.selecteds = nodes;
                    queryTmps();
                }, $.noop);
            };

            $ctrl.revertModify = function () {
                review(detailObj.valueList);// 还原修改的数据
            };

            $ctrl.save = function (form) {
                if (!$ctrl.codes || !$ctrl.codes.length) {
                    return layer.alert('请选择条款在保存');
                }

                ///// 只有业务类型未买卖(2)时才做限制性校验
                var $defer = $q.defer();
                var promise = $defer.promise;
                if (agrtType === 2) {
                    var params = signUtil.getRestrictiveDataByCodes($ctrl.codes , 2);
                    promise = signService.validateRestrictive(params).then(function (result) {
                        var data = result.data || {};
                        if (result.code !== 0 || !data.validate) {
                            throw layer.alert(data.message || result.msg);
                        }
                    });
                }else{
                    $defer.resolve();
                }
                promise.then(function () {
                    /// 修改补充协议
                    return agreementDetailService.modifyCodes({
                        "suppl_agrt_id": formId,
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
                        return layer.alert(result.msg);
                    }
                    layer.alert('保存成功');
                    detailObj.valueList = $ctrl.codes.map(function (code) {
                        return {
                            supple_agrt_temp_id: code.supple_agrt_temp_id,
                            term_content: code.term_content,
                            echo_type: code.echo_type,
                            seq_num: code.seq_num,
                            term_name: code.term_name,
                            applicability: code.applicability,
                            json_value: angular.toJson(code.value),
                            type: code.type
                        }
                    });
                    $ctrl.modifyMode = false;
                    isShowQue();
                }).catch($.noop);
            };

            function fixFormError2Modify() {// 定位到错误的表单元素位置,并且开启编辑模式
                $ctrl.modifyMode = true;
                var node = $('[class*="invalid"]').not('form').get(0);
                node && node.scrollIntoView(true);
            }

            $ctrl.confirmAudit = function (form) {
                form.$setSubmitted();
                if (form.$invalid || $('#codeForm [class*="ng-invalid"]').length) {
                    fixFormError2Modify();
                    return layer.alert('表单有未完成项，请完成后再保存');
                }
                agreementDetailService.confirmAudit($ctrl.detailObj.suppl_agrt_id, $ctrl.detailObj.con_id)
                    .then(function (result) {
                        if (result.code !== 0) {
                            return layer.alert(result.msg);
                        }
                        agreementDetailService.pullConData(conId, formId);
                        layer.alert('审批成功', function () {
                            location.reload(true);
                        });
                    });
            };

            $ctrl.preview = function () {
                var formal = $ctrl.detailObj.audit_status_num == 4; // 审核通过
                agreementDetailService.getViewContract(formId)
                    .then(function (result) {
                        if (result.code !== 0) {
                            return layer.alert(result.msg);
                        }
                        // 判断是否允许打印
                        var title, canPrintFn;
                        if (formal) {
                            title = '补充协议预览';
                            canPrintFn = agreementDetailService.canPrintContract.bind(null, formId);
                        } else {
                            title = '补充协议预览(非正式)';
                            canPrintFn = function () {
                                var defer = $q.defer();
                                defer.resolve({code: 0, data: true});
                                return defer.promise;
                            };
                        }
                        return signUtil.openLayer('signAgreementPreviewLayer',
                            result.data.valueList, agrtType, paymentType, canPrintFn, title, formal);
                    })
                    .then($.noop, $.noop, function () {
                        if (formal) {
                            agreementDetailService.recordPrintCount(formId, $ctrl.detailObj.sign_number);// 通知后台记录打印次数
                        }
                    })
                    .catch($.noop);
            };

            ////// 审批流程
            {
                $ctrl.initContractApprovalList = function () {
                    agreementDetailService.getContractApproval(
                        $ctrl.detailObj.suppl_agrt_id,
                        $ctrl.detailObj.agrt_type
                    ).then(function (result) {
                        if (result.code !== 0) {
                            return layer.alert(result.msg);
                        }

                        var list = result.data;
                        if (list) {
                            $ctrl.contractApprovalList = [];
                            var data = {};
                            list.forEach(function (item) {
                                var id = item.processInstanceId;
                                if (!data[id]) {
                                    data[id] = [];
                                    $ctrl.contractApprovalList.push(data[id]);
                                }
                                data[id].push(item);
                            });
                        }
                    });

                    signService.workFlowDoJob({formId: formId}, {
                        modelName: modelName,
                        methodName: 'getFlowChartUrlByBusiness'
                    }).then(function (result) {
                        if (result.code !== 0) {
                            return layer.alert(result.msg);
                        }
                        $ctrl.ApprovaMapHref = result.data[modelName];
                    });
                }
            }

            ////// 打印历史
            {
                $ctrl.initPrintHistoryList = function () {
                    agreementDetailService.getPrintHistory(formId).then(function (result) {
                        if (result.code !== 0) {
                            return layer.alert(result.msg);
                        }
                        $ctrl.printhistorylist = result.data.printhistorylist;
                    });

                    agreementDetailService.getPrintCount(formId).then(function (result) {
                        if (result.code !== 0) {
                            return layer.alert(result.msg);
                        }
                        $ctrl.printCount = result.data;
                    });
                };
            }

            /**
             * 工作流按钮动作
             * @param item
             */
            $ctrl.workFlowAction = function (item) {
                var labelId = item.labelId, promise;
                var postData = {
                    taskId: taskId,
                    formId: formId,
                    conId: conId,
                    isEnd: isEnd
                };
                var paramsData = {
                    modelName: modelName,
                    methodName: labelId
                };
                commonContainer.showLoading();

                if (labelId === 'noPass') {
                    postData['noPass'] = true;
                    paramsData['methodName'] = 'toReject';
                }
                postData['comment'] = $ctrl.comment;
                if (labelId === 'toPass' && !isEnd) {// 流程通过到下一步
                    promise = signService.workFlowDoJob(postData, {
                        modelName: modelName,
                        methodName: "findUserOnTask"
                    }).then(function (result) {
                        commonContainer.hideLoading();
                        if (result.code !== 0) {
                            throw layer.alert(result.msg);
                        }
                        var list = result.data || [];
                        var first = list[0] || {};
                        return signUtil.openLayer('signWorkFlowUserLayer', list, first.currentApprovalProcess, first.userId)
                    }).then(function (userId) {
                        commonContainer.showLoading();
                        postData['nextUser'] = userId;// 这里指定下一个处理人
                        return signService.workFlowDoJob(postData, paramsData);
                    });
                } else {// 其他流程
                    promise = signService.workFlowDoJob(postData, paramsData);
                }

                promise.then(function (result) {
                    if (result.code !== 0) {
                        throw layer.alert(result.msg);
                    }
                    if (/toPass|noPass/.test(labelId)  && /[24]/.test(agrtType)) {
                        return agreementDetailService.pullConData(conId, formId);
                    }
                }).then(function (result) {
                    commonContainer.hideLoading();
                    if (result && result.code !== 0) {
                        throw layer.alert(result.msg);
                    }

                    var MSG = {
                        'toPass-true': '审批完成',
                        'toPass': '已提交审批',
                        'toJumpFirstNode': '驳回起草人成功',
                        'any': '操作完成'
                    };
                    layer.alert(MSG[labelId + '-' + String(isEnd)] || MSG[labelId] || MSG.any, {cancel: closeBack}, closeBack);
                }).catch(function () {
                    commonContainer.hideLoading();
                });

                function closeBack() {// 回到上一步
                    if (history.length > 1) {
                        history.back();
                    } else {
                        commonContainer.closeWindow();
                    }
                }
            };

            // 提交打印审核（触发工作流）
            $ctrl.flowUsers = function (form) {
                form.$setSubmitted();
                if (form.$invalid || $('#codeForm [class*="ng-invalid"]').length) {
                    fixFormError2Modify();
                    return layer.alert('表单有未完成项，请完成后再保存');
                }
                commonContainer.showLoading();
                signService.workFlowDoJob({formId: formId}, {
                    modelName: modelName,
                    methodName: 'findUserOnStart'
                })
                    .then(function (result) {
                        if (result.code !== 0) {
                            throw layer.alert(result.msg);
                        }
                        return result.data || [];
                    })
                    .then(function (list) {
                        commonContainer.hideLoading();
                        var first = list[0] || {};
                        return signUtil.openLayer('signWorkFlowUserLayer', list, first.currentApprovalProcess, first.userId)
                    })
                    .then(function (nextUser) {
                        commonContainer.showLoading();
                        return signService.workFlowDoJob({
                            formId: formId, conId: conId, nextUser: nextUser
                        }, {
                            modelName: modelName,
                            methodName: 'createWorkflow'
                        });
                    })
                    .then(function (result) {
                        commonContainer.hideLoading();
                        if (result.code !== 0) {
                            throw layer.alert(result.msg);
                        }

                        if (/[24]/.test(agrtType)) {
                            return agreementDetailService.pullConData(conId, formId);
                        }
                    })
                    .then(function () {
                        layer.alert('已提交审批', {cancel: close}, close);

                        function close() {
                            location.reload(true);
                        }
                    })
                    .catch(function () {
                        commonContainer.hideLoading();
                    });
            };

            $ctrl.setContractEnable = function (enableFlag, status, confirmMsg) {
                signUtil.confirm(confirmMsg).then(function () {
                    agreementDetailService.updateEnableFlag(enableFlag, formId).then(function (result) {
                        if (result.code !== 0) {
                            return layer.alert(result.msg);
                        }
                        layer.alert('状态修改成功');
                        $ctrl.detailObj.audit_status_num = status;
                        $ctrl.detailObj.enableFlag = enableFlag;
                    })
                }, $.noop);
            };

            function queryTmps() {
                agreementDetailService.getCodes($ctrl.selecteds, agrtType)
                    .then(function (result) {
                        if (result.code !== 0) {
                            return layer.alert(result.msg);
                        }

                        if ($ctrl.codes && $ctrl.codes.length && result.data) {
                            $ctrl.codes = comboCodes($ctrl.codes, result.data);
                        } else {
                            $ctrl.codes = result.data;
                        }
                        isShowQue();
                    });
            }

            function review(valueList) {
                $ctrl.selecteds = [];
                $ctrl.codes = [];
                (valueList || []).forEach(function (item) {
                    $ctrl.selecteds.push(item.supple_agrt_temp_id);
                    $ctrl.codes.push({
                        supple_agrt_temp_id: item.supple_agrt_temp_id,
                        term_content: item.term_content,
                        echo_type: item.echo_type,
                        seq_num: item.seq_num,
                        term_name: item.term_name,
                        applicability: item.applicability,
                        value: angular.fromJson(item.json_value),
                        type: item.type
                    });
                });
                isShowQue();
            }

            function isShowQue() {
                var o = $ctrl.codes.map(function (item) {
                    return item.type;
                }).join('');
                $ctrl.isShowQue = agrtType === 2 && /^[AB]+$/i.test(o);
            }
        }])
        .service('agreementDetailService', ['$http', function ($http) {

            /**
             * 根据 SupplAgrtID 查询补充协议数据
             * @param id
             * @returns {Promise.<TResult>|*}
             */
            this.getSupplAgrtById = function (id) {
                return $http.get(basePath + '/contract/supplagrt/getDetail', {params: {id: id}})
                    .then(function (response) {
                        return response.data;
                    })
            };

            /**
             * 根据 直接审核合同
             * @param supplAgrtId
             * @param conId
             * @returns {Promise.<TResult>|*}
             */
            this.confirmAudit = function (supplAgrtId, conId) {
                return $http.get(basePath + '/contract/supplagrt/confirmAudit', {
                    params: {
                        supplAgrtId: supplAgrtId,
                        conId: conId
                    }
                }).then(function (response) {
                    return response.data;
                })
            };

            /**
             * 获取合同信息
             * @param {String} conId 合同 id
             */
            this.getContractDetail = function (conId) {
                return $http.get(basePath + "/contract/supplagrt/getConInfoByConId4Detail", {params: {conId: conId}})
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
             * 修改补充协议
             * @param data
             * @param data.suppl_agrt_id 补充协议 ID
             * @param {array<obj>}data.valueList 模板ID及对应的值
             */
            this.modifyCodes = function (data) {
                return $http.post(basePath + '/contract/supplagrt/update', data).then(function (resposne) {
                    return resposne.data;
                });
            };

            /**
             * 修改补充协议
             * @param conId 补充协议 ID
             * @param formId 补充协议 ID
             */
            this.pullConData = function (conId, formId) {
                return $http.get(basePath + '/contract/supplagrt/pullConData', {
                    params: {conId: conId, supplAgrtId: formId}
                }).then(function (resposne) {
                    return resposne.data;
                });
            };

            /**
             * 补充协议作废状态修改
             * @param enableFlag 作废状态
             * @param id 作废状态
             */
            this.updateEnableFlag = function (enableFlag, id) {
                return $http.get(basePath + '/contract/supplagrt/updateEnableFlag', {
                    params: {
                        enableFlag: enableFlag,
                        id: id
                    }
                }).then(function (resposne) {
                    return resposne.data;
                });
            };

            /**
             * 获取打印历史
             * @param conId
             * @returns {Promise.<TResult>|*}
             */
            this.getPrintHistory = function (conId) {
                return $http.get(basePath + '/contract/supplagrt/printhistory', {params: {conId: conId}})
                    .then(function (response) {
                        return response.data;
                    });
            };

            /**
             * 根据补充协议编号获取补充协议预览信息
             * @param supplAgrtId 补充协议
             */
            this.getViewContract = function (supplAgrtId) {
                return $http.get(basePath + '/contract/supplagrt/viewBeforePrint', {params: {supplAgrtId: supplAgrtId}})
                    .then(function (response) {
                        return response.data;
                    });
            };

            /**
             * 判断是否允许打印
             * @param supplAgrtId 补充协议 id
             */
            this.canPrintContract = function (supplAgrtId) {
                return $http.get(basePath + '/contract/supplagrt/ifPrintable', {params: {supplAgrtId: supplAgrtId}})
                    .then(function (response) {
                        return response.data;
                    });
            };

            /**
             *  记录打印次数
             * @param supplAgrtId 补充协议 id
             * @param signNumber 补充协议 编码
             */
            this.recordPrintCount = function (supplAgrtId, signNumber) {
                return $http.get(basePath + '/contract/supplagrt/recordPrintCount', {
                    params: {supplAgrtId: supplAgrtId, signNumber: signNumber}
                }).then(function (response) {
                    return response.data;
                });
            };

            /**
             * 获取打印次数
             * @param supplAgrtId
             * @returns {Promise.<TResult>|*}
             */
            this.getPrintCount = function (supplAgrtId) {
                return $http.get(basePath + '/contract/supplagrt/getPrintCount', {params: {supplAgrtId: supplAgrtId}})
                    .then(function (response) {
                        return response.data;
                    });
            };

            /**
             * 获取审批记录
             * @param id
             * @param businessType
             * @returns {Promise.<TResult>|*}
             */
            this.getContractApproval = function (id, businessType) {
                return $http.get(basePath + '/contract/supplagrt/selectWorkflowHistoryList', {
                    params: {
                        id: id,
                        businessType: businessType
                    }
                }).then(function (response) {
                    return response.data;
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
            if (obj.term_name.indexOf('甲方承诺学区房') > -1) {
                continue;
            }
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

    angular.bootstrap(document, ['agreement-detail']);
}(window));