/**
 * Created by baihuibo on 2017/5/9.
 */
(function (window) {

    angular.module('sign-detail', ['base', 'sign-common'])

    /////////////
        .controller('signDetailCtrl', ['$scope', 'signDetailService', 'signUtil', 'signService', '$q', '$filter',
            function ($scope, signDetailService, signUtil, signService, $q, $filter) {
                var $ctrl = this;
                var formId = $ctrl.formId = signUtil.getSearchValue('conid');
                var docbizkey = signUtil.getSearchValue('docbizkey');
                var taskId = signUtil.getSearchValue('taskId');
                var isEnd = !!signUtil.getSearchValue('isEnd');
                var tempId = signUtil.getSearchValue('templateId');
                var userType = signUtil.getSearchValue('userType');
                $ctrl.tIsDone = signUtil.getSearchValue('t') === 'done';
                var formal = signUtil.getSearchValue('formal');
                var other = signUtil.getSearchValue('other');
                var attachmentBefore = signUtil.getSearchValue('attachment');
                var parameterOne;
                var parameterTwo;
                var companysId;
                $ctrl.flex = true;
                $ctrl.flexd = false;
                var modelName, auditStatus, contractStatus;
                if (formal) {// 正式合同将不再有任何修改
                    $ctrl.tIsDone = true;
                }

                if (other) {
                    $ctrl.other = true;
                }

                var isLeaseContract = true;

                if (docbizkey) {
                    var names = docbizkey.split('-');
                    formId = $ctrl.formId = names[1];
                    modelName = names[0];
                    isLeaseContract = /LEASE_/i.test(docbizkey);
                    $ctrl.docbizkey = docbizkey;
                }
                if (docbizkey && tempId && !$ctrl.tIsDone && !$ctrl.other) {
                    signService.queryWorkFlowButton(tempId).then(function (result) {
                        if (result.code !== 0) {
                            return layer.alert(result.msg);
                        }
                        if (isLeaseContract) {
                            $ctrl.workFlowButtons = result.data;
                        } else {
                            $ctrl.attachmentWorkFlowButtons = result.data;
                        }
                    });
                }

                /**
                 * 租赁合同佣金占比系数
                 * @property cusBrokerageReceivable 客户佣金
                 * @property ownBrokerageReceivable 业主佣金
                 */
                var serviceChage;

                // 获取租赁合同公司规定佣金标准系数
                signService.getLeaseServiceChage().then(function (result) {
                    if (result.code !== 0) {
                        return layer.alert(result.msg);
                    }
                    serviceChage = result.data;
                });

                // 获取数据
                commonContainer.showLoading();
                var detailPromise = signDetailService.getContractDetail(formId)
                    .then(formatData)
                    .then(function (result) {
                        commonContainer.hideLoading();
                        if (result.code !== 0) {
                            return layer.alert(result.msg);
                        }
                        $ctrl.data = result.data;
                        auditStatus = +$ctrl.data.auditStatus;
                        contractStatus = +$ctrl.data.contractStatus;
                        companysId = result.data.companysId;
                        $ctrl.houseLink = signUtil.getHouseLInk($ctrl.data.housesCode, 1);
                        $ctrl.customerLink = signUtil.getCustomerLink($ctrl.data.customerCode);

                        if ((!isLeaseContract && docbizkey) || attachmentBefore) {
                            modelName = 'ENCLOSURE_CONTRACT';
                            setTimeout(function () {
                                $('#attachmentTab').click();
                            }, 13);
                        }

                        return result.data;
                    });

                detailPromise.then(function () {
                    return signService.getCurrentUserInfo()
                }).then(function (result) {
                    if (result.code !== 0) {
                        return layer.alert(result.msg);
                    }
                    try {
                        $ctrl.isOwnerUser = $ctrl.data.belonguserid === result.data.userId;
                        $ctrl.currentUserId = result.data.userId;
                    } catch (e) {
                    }
                }).then(initState);

                function initState() {
                    $ctrl.showSendFlowWork = auditStatus !== 0;// 如果不是驳回的合同
                    $ctrl.disabledAllBtn = false;
                    if (docbizkey || !$ctrl.isOwnerUser || $ctrl.tIsDone || auditStatus > 4 || contractStatus == 3) {//
                        $ctrl.disabledAllBtn = true;// 工作流，不是自己，财务驳回，合同完成，不允许做编辑
                    }
                    $ctrl.disabledContractEditBtn = auditStatus === 2 || auditStatus > 4 || contractStatus == 3;

                    // 是否显示按钮
                    $ctrl.showContractEditBtn = !$ctrl.disabledContractEditBtn && !$ctrl.disabledAllBtn;

                    // 打印审批按钮
                    $ctrl.showPrintFlowWork = contractStatus !== 3 && (auditStatus === 1 || auditStatus === 0) && $ctrl.isOwnerUser;

                    // 财务审批
                    $ctrl.showFinance = auditStatus === 4 && $ctrl.isOwnerUser;
                }

                //////////  合同信息
                {

                    var currentEdit = '';// 当前编辑的区域

                    // 是否在编辑状态
                    $ctrl.isEditState = function () {
                        return !!currentEdit;
                    };

                    // 开始编辑
                    $ctrl.startEdit = function (editType) {
                        $ctrl.cancelEdit();
                        $ctrl[currentEdit = editType] = true;// 启动编辑
                    };

                    // 取消编辑
                    $ctrl.cancelEdit = function () {
                        $ctrl[currentEdit] = false; // 关闭编辑
                        $ctrl.edit = $.extend(true, {}, $ctrl.data);// 还原数据
                        currentEdit = '';
                    };

                    $ctrl.saveEdit = function () {

                        if (currentEdit === 'rentEdit') {
                            var total = $ctrl.edit.sign_pay_rent_vo.reduce(function (total, item) {
                                return total + (item.payment_amount || 0);
                            }, 0);
                            if (total !== $ctrl.edit.rentTotal) {
                                return layer.alert('租金支付金额与租金总计不一致，请核实支付金额是否输入正确！');
                            }
                        }

                        // 保存编辑
                        var update = {
                            conId: formId,
                            leaseContractId: $ctrl.data.leaseContractId
                        };
                        var arr = editMapper[currentEdit] || [];// 获取要修改的字段

                        arr.forEach(function (prop) {
                            update[prop] = $ctrl.edit[prop]; // 获取修改的数据
                        });

                        var confirmPromise;
                        if (auditStatus === 3) {
                            confirmPromise = signUtil.confirm("合同已经审批通过，若修改合同数据项，需要重新提交审批，确定此操作吗？")
                                .then(function () {
                                    return signDetailService.updateAuditStatus(formId); // 修改合同状态
                                });
                        } else if (auditStatus === 4) {
                            confirmPromise = signUtil.confirm("合同已经打印，若修改合同数据项，本合同将作废，将重新生成合同编号并提交审批，确定此操作吗？")
                                .then(function () {
                                    return signDetailService.updateAuditStatus(formId); // 修改合同状态
                                });
                        } else {
                            var defer = $q.defer();
                            defer.resolve();
                            confirmPromise = defer.promise;
                        }

                        confirmPromise.then(function () {
                            return signDetailService[serviceMapper[currentEdit]](update);
                        }).then(function (result) {
                            if (result.code !== 0) {
                                throw result.msg;
                            }
                            return signDetailService.getContractDetail(formId).then(formatData)
                        }).then(function (result) {
                            if (result.code !== 0) {
                                throw result.msg;
                            }

                            if (auditStatus > 2) {// 合同已打印之后，需要特殊处理
                                $ctrl.data = result.data;
                                contractStatus = +$ctrl.data.contractStatus;
                                auditStatus = 1;
                                initState();
                            } else {
                                arr.forEach(function (prop) {
                                    $ctrl.data[prop] = $ctrl.edit[prop];// update 数据
                                });
                            }

                            changeAttachmentTitle($ctrl.data);
                            layer.alert('修改成功');
                            $ctrl[currentEdit] = false; // 关闭编辑
                            currentEdit = ''; // 清除修改状态
                            $ctrl.showSendFlowWork = true;// 有过修改
                        }).catch(function (result) {
//                            layer.alert(result);
                        });
                    };

                    $ctrl.setContractStatus = function (status, confirm) {
                        signUtil.confirm(confirm).then(function () {
                            return signDetailService.updateContractStates(formId, status);
                        }).then(function (result) {
                            if (result.code !== 0) {
                                return layer.alert(result.msg);
                            }
                            layer.alert('操作成功');
                            $ctrl.data.contractStatus = contractStatus = status;
                            auditStatus = 1;
                            if (status === 3) {// 作废
                                $ctrl.data.contractStatusDesc = '作废';
                            } else { // 取消作废
                                $ctrl.data.contractStatusDesc = '签约中';
                            }
                            $ctrl.showSendFlowWork = true;
                            initState();
                        });
                    };

                    // ***** 添加委托人
                    $ctrl.addPerson = function (list, title) {
                        signUtil.openLayer('signAddPersonLayer', {
                            "house_no": "", // 房产证号码
                            "full_name": "", // 姓名
                            "idcard_no": "", // 证件号
                            "idcard_type_cd": "", // 证件类型
                            "phone_number": [] // 联系电话 多个电话逗号隔开
                        }, title)
                            .then(function (person) {
                                list.push(person);
                            }, $.noop);
                    };

                    // 编辑委托人
                    $ctrl.editPerson = function (list, $index, item, title) {
                        signUtil.openLayer('signAddPersonLayer', item, title)
                            .then(function (person) {
                                list.splice($index, 1, person);
                            }, $.noop);
                    };

                    $ctrl.removePerson = function (list, index, msg) {
                        signUtil.confirm(msg).then(function () {
                            list.splice(index, 1);
                            layer.alert('删除成功');
                        }, $.noop)
                    };

                    //***** 租金支付日期
                    $ctrl.addPayDate = function (list) { // 新增
                        list.push({});
                    };
                    $ctrl.removePayDate = function (list, $index) { // 删除
                        signUtil.confirm('确定删除此日期？')
                            .then(function () {
                                list.splice($index, 1);
                            }, $.noop);
                    };

                    // 租金标准变化后引发的血案，都得改
                    $ctrl.rentStandardChange = function (rentStandard) {
                        // 客户佣金(公司规定)
                        $ctrl.edit.customerCommissionStipulate = rentStandard * serviceChage.cusBrokerageReceivable;
                        // 客户佣金(公司规定)
                        $ctrl.edit.ownerCommissionStipulate = rentStandard * serviceChage.ownBrokerageReceivable;

                        $ctrl.disCountTotal();
                        $ctrl.customerPaymentProportion();
                        $ctrl.ownerPaymentProportion();
                    };

                    // 总折扣计算
                    $ctrl.disCountTotal = function () {
                        return $ctrl.edit.discountTotal = signUtil.commission.countTotal({
                            charge_object: $ctrl.edit.charge_object,
                            customer_commission_convention: $ctrl.edit.customerCommissionConvention,
                            customer_commission_stipulate: $ctrl.edit.customerCommissionStipulate,
                            owner_commission_convention: $ctrl.edit.ownerCommissionConvention,
                            owner_commission_stipulate: $ctrl.edit.ownerCommissionStipulate
                        });
                    };

                    // 客户佣金占月租金比例
                    $ctrl.customerPaymentProportion = function () {
                        return $ctrl.edit.customerPaymentProportion = signUtil.commission.customerPaymentProportion({
                            customer_commission_convention: $ctrl.edit.customerCommissionConvention,
                            rent_standard: $ctrl.edit.rentStandard
                        });
                    };
                    // 业主佣金占月租金比例
                    $ctrl.ownerPaymentProportion = function () {
                        return $ctrl.edit.ownerPaymentProportion = signUtil.commission.ownerPaymentProportion({
                            owner_commission_convention: $ctrl.edit.ownerCommissionConvention,
                            rent_standard: $ctrl.edit.rentStandard
                        });
                    };

                    $scope.$watch('$ctrl.edit.lessee_start_date + $ctrl.edit.lessee_end_date + $ctrl.edit.rentStandard', function () {
                        if (currentEdit) {
                            var monthLength = $filter('monthLength')($ctrl.edit.lessee_start_date, $ctrl.edit.lessee_end_date);
                            $ctrl.edit.rentTotal = Math.ceil(monthLength) * $ctrl.edit.rentStandard;
                        }
                    });

                    // 设置最大居住人数
                    $ctrl.setMaxLive = function (area) {
                        $ctrl.edit.liveMaxCount = Math.floor(area / 6) || 1;
                    };

                    $ctrl.preview = function () {
                        //验证租金支付金额与租金总计
                        var total = $ctrl.data.sign_pay_rent_vo.reduce(function (total, item) {
                            return total + (item.payment_amount || 0);
                        }, 0);
                        if (total != $ctrl.data.rentTotal) {
                            return layer.confirm('租金支付金额与租金总计不一致，请核实支付金额是否输入正确！', {
                                yes: function (index) {
                                    $(document).scrollTop(1550);
                                    layer.close(index);
                                }
                            });
                        }
                        var formal = auditStatus > 2; // 审批通过
                        signDetailService.getViewContract($ctrl.data.contractCode)
                            .then(function (result) {
                                if (result.code !== 0) {
                                    return layer.alert(result.msg);
                                }
                                // 判断是否允许打印
                                var canPrintFn, title;
                                if (formal) {
                                    title = '租赁合同预览';
                                    canPrintFn = signDetailService.canPrintContract.bind(null, formId);
                                } else {
                                    title = '租赁合同预览(非正式)';
                                    canPrintFn = function () {
                                        var defer = $q.defer();
                                        defer.resolve({code: 0, data: true});
                                        return defer.promise;
                                    };
                                }
                                return signUtil.openLayer('signPreviewLayer', result.data, canPrintFn, title, formal);
                            })
                            .then($.noop, $.noop, function () {
                                if (formal) {
                                    signDetailService.recordPrintCount(formId);// 通知后台记录打印次数
                                    auditStatus = $ctrl.data.auditStatus = 4;// 修改合同状态为已打印
                                    initState();
                                }
                            })
                            .catch($.noop);
                    };
                }

                /////////  附件管理
                {
                    detailPromise.then(changeAttachmentTitle);

                    // 初始化查询附件列表
                    $ctrl.initAttachment = function () {
                        $ctrl.checkAll = false;
                        signDetailService.getEnclosureList(formId, 1).then(function (result) {
                            if (result.code !== 0) {
                                return layer.alert(result.msg);
                            }
                            $ctrl.attachmentList = result.data.list;
                        });
                    };

                    // 上传新的附件
                    $ctrl.openUploadLayer = function () {
                        signUtil.openLayer('signUploadAttachmentLayer', {}, formId, '上传附件', 2, signDetailService)
                            .then(function (data) {
                                data['contractType'] = 1; //合同类型：1租赁,2买卖
                                data['contractId'] = formId; //合同ID
                                commonContainer.showLoading();
                                signDetailService.addEnclosure(data).then(function (result) {
                                    commonContainer.hideLoading();

                                    if (result.code !== 0) {
                                        return layer.alert(result.msg);
                                    }

                                    layer.alert('附件上传成功！');

                                    $ctrl.initAttachment();
                                });
                            }, $.noop)
                    };

                    // 查看附件驳回原因
                    $ctrl.showRejectReason = function (item) {
                        signUtil.openLayer('signRejectReasonLayer', item).then($.noop, $.noop);
                    };

                    // 修改附件
                    $ctrl.modifyAttachment = function (item) {
                        signDetailService.getEnclosure(item.enclosureId).then(function (result) {
                            if (result.code !== 0) {
                                throw layer.alert(result.msg);
                            }
                            return signUtil.openLayer('signUploadAttachmentLayer', result.data, formId, '修改附件', 1, signDetailService)
                        }).then(function (data) {
                            data['contractType'] = 1; //合同类型：1租赁,2买卖
                            data['contractId'] = formId; //合同ID
                            data['enclosureId'] = item.enclosureId; //附件 ID
                            commonContainer.showLoading();
                            return signDetailService.updateEnclosure(data)
                                .then(function (result) {
                                    commonContainer.hideLoading();

                                    if (result.code !== 0) {
                                        throw layer.alert(result.msg);
                                    }

                                    layer.alert('附件上传成功！');
                                    $ctrl.initAttachment();
                                });
                        }).catch(function () {
                            commonContainer.hideLoading();
                        });
                    };

                    // 查看附件
                    $ctrl.showAttachment = function (item) {
                        signDetailService.getEnclosure(item.enclosureId).then(function (result) {
                            if (result.code !== 0) {
                                throw layer.alert(result.msg);
                            }
                            signUtil.openLayer('signShowAttachmentLayer', result.data.enclosureList, '查看附件');
                        });
                    };
                    // 签收附件
                    $ctrl.signDeliverAttachment = function (item) {
                        signDetailService.getEnclosure(item.enclosureId).then(function (result) {
                            if (result.code !== 0) {
                                throw layer.alert(result.msg);
                            }
                            signUtil.openLayer('signDeliverAttachmentLayer', result.data.enclosureList, '签收附件', signDetailService)
                                .then(function () {
                                    // 签收
                                    signDetailService.signEnclosure(item.enclosureId, item.approveType)
                                        .then(function (result) {
                                            if (result.code !== 0) {
                                                return layer.alert(result.msg);
                                            }
                                            layer.alert('附件签收成功');
                                            $ctrl.initAttachment();
                                        });
                                }, function (data) {
                                    // data.rejectType 驳回原因类型：1已收、2未收、3缺件
                                    // data.rejectReason 驳回原因
                                    if (data) {
                                        // 驳回
                                        data['enclosureId'] = item.enclosureId;
                                        data['approveType'] = item.approveType;
                                        signDetailService.rejectEnclosure(data)
                                            .then(function (result) {
                                                if (result.code !== 0) {
                                                    return layer.alert(result.msg);
                                                }
                                                layer.alert('附件驳回成功');
                                                $ctrl.initAttachment();
                                            });
                                    }
                                });
                        });
                    };

                    // 删除附件
                    $ctrl.signRemoveAttachment = function (item) {
                        signUtil.confirm('确定删除此附件？')
                            .then(function () {
                                return signDetailService.delEnclosure(item.enclosureId);
                            }, $.noop)
                            .then(function (result) {
                                if (result.code !== 0) {
                                    return layer.alert(result.msg);
                                }
                                layer.alert('删除成功!');
                                $ctrl.initAttachment();
                            })
                    };

                    // 提交审核
                    $ctrl.submitAnAudit = function () {
                        modelName = 'ENCLOSURE_CONTRACT';
                        var list = $ctrl.attachmentList.filter(function (item) {
                            return item.checked;
                        });
                        if (!list.length) {
                            return layer.alert('请选择附件');
                        }
                        var isState = list.some(function (item) {
                            return +item.uploadState === 1;
                        });
                        if (!isState) {
                            return layer.alert('必须是上传状态才可提交审核!');
                        }
                        var map = {};
                        var ids = list.map(function (item) {
                            map[item.approveType] = 1;
                            return item.enclosureId
                        }).join(',');
                        var approveType = Object.keys(map);
                        if (approveType.length > 1) {
                            return layer.alert('请选择审核角色为一致的附件进行提交审核!');
                        }
                        commonContainer.showLoading();
                        signService.workFlowDoJob(
                            {formId: formId, enclosureIds: ids, approveType: approveType[0], contractType: 1},
                            {modelName: modelName, methodName: 'findUserOnStart'}
                        ).then(function (result) {
                            commonContainer.hideLoading();
                            var list = result.data || [];
                            var first = list[0] || {};
                            return signUtil.openLayer('signWorkFlowUserLayer', list, first.currentApprovalProcess, first.userId)
                        }).then(function (nextUser) {
                            commonContainer.showLoading();
                            return signService.workFlowDoJob({
                                formId: formId, nextUser: nextUser, contractType: 1,
                                enclosureIds: ids, approveType: approveType[0]
                            }, {
                                modelName: modelName,
                                methodName: 'createWorkflow'
                            });
                        }).then(function (result) {
                            commonContainer.hideLoading();
                            if (result.code !== 0) {
                                throw layer.alert(result.msg);
                            }
                            layer.alert('已提交审批', {cancel: close}, close);

                            function close() {
                                location.href = location.pathname + location.search + '&attachment=1';// 刷新当前页，并且保持附件面板显示
                            }
                        }).catch(function () {
                            commonContainer.hideLoading();
                        });
                    };

                    $ctrl.attachmentWorkFlowAction = function (item) {
                        // 1 找出所有需要当前的登录人处理的附件
                        var list = $ctrl.attachmentList.filter(function (item) {
                            return item.taskHandleId == $ctrl.currentUserId;
                        });

                        // 如果还有未处理的
                        var noThen = list.some(function (item) {
                            return item.uploadState == 2
                        });
                        if (noThen) {
                            return layer.alert('请签收附件后再做此操作');
                        }

                        // 将所有的附件 id 处理
                        var ids = list.map(function (item) {
                            return item.enclosureId
                        }).join(',');

                        var labelId = item.labelId, promise;
                        var postData = {
                            taskId: taskId,
                            formId: formId,
                            isEnd: isEnd,
                            basePath: staticBasePath,
                            enclosureIds: ids,
                            contractType: 1,
                            userType: userType
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
                        } else if (/toReject|toJump|noPass/i.test(labelId)) {// 驳回的时候，需要输入驳回原因
                            promise = signUtil.openLayer('rejectLayer')
                                .then(function (data) {
                                    // data.conRejectCause  驳回原因
                                    // data.comment  备注

                                    // 提交到流程
                                    postData['comment'] = data.conRejectCause + ':' + (data.comment || '');
                                    return signService.workFlowDoJob(postData, paramsData);
                                });
                        } else {// 其他流程
                            promise = signService.workFlowDoJob(postData, paramsData);
                        }

                        promise.then(function (result) {
                            commonContainer.hideLoading();
                            if (result.code !== 0) {
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
                            history.back();
                        }
                    };

                    $ctrl.selectAllAttachment = function () {
                        $ctrl.attachmentList.forEach(function (item) {
                            if (item['uploadState'] == 1) {
                                item.checked = $ctrl.checkAll;
                            }
                        });
                    }
                }

                ////////  交割单
                {
                    // 初始化交割单列表
                    $ctrl.initDelivery = function () {
                        commonContainer.showLoading();
                        return signDetailService.getDeliveryDetail($ctrl.data.leaseContractId).then(function (result) {
                            commonContainer.hideLoading();
                            if (result.code !== 0) {
                                return layer.alert(result.msg);
                            }
                            return $ctrl.deliveryDetail = result.data;
                        });
                    };

                    // 添加房屋交割单（家具电器）
                    $ctrl.addLeadContractDelivery = function () {
                        signUtil.openLayer('leadContractDeliveryLayer', {}, '新增房屋附属家具、电器、装修、及其他设备设施状况赔损信息')
                            .then(function (data) {
                                commonContainer.showLoading();
                                return signDetailService.addLeadContractDelivery({
                                    lease_contract_id: $ctrl.data.leaseContractId,
                                    householdlist: [data]
                                });
                            })
                            .then(function (result) {
                                commonContainer.hideLoading();
                                if (result.code !== 0) {
                                    return layer.alert(result.msg);
                                }
                                layer.alert('保存成功');
                                $ctrl.initDelivery();
                            }, $.noop);
                    };

                    // 其他交割单
                    $ctrl.addLeadContractOther = function () {
                        signUtil.openLayer('leadContractOtherLayer', {}, '新增其他相关费用')
                            .then(function (data) {
                                commonContainer.showLoading();
                                return signDetailService.addLeadContractDelivery({
                                    lease_contract_id: $ctrl.data.leaseContractId,
                                    otherlist: [data]
                                });
                            })
                            .then(function (result) {
                                commonContainer.hideLoading();
                                if (result.code !== 0) {
                                    return layer.alert(result.msg);
                                }
                                layer.alert('保存成功');
                                $ctrl.initDelivery();
                            }, $.noop);
                    };

                    // 修改交割单家电
                    $ctrl.modifyLeadContractDelivery = function (item) {
                        item = angular.copy(item);
                        signUtil.openLayer('leadContractDeliveryLayer', item, '修改房屋附属家具、电器、装修、及其他设备设施状况赔损信息')
                            .then(function (data) {
                                commonContainer.showLoading();
                                return signDetailService.updateLeadContractDelivery(data);
                            })
                            .then(function (result) {
                                commonContainer.hideLoading();
                                if (result.code !== 0) {
                                    return layer.alert(result.msg);
                                }
                                layer.alert('修改成功');
                                $ctrl.initDelivery();
                            }, $.noop);
                    };

                    // 修改其他
                    $ctrl.modifyLeadContractOther = function (item) {
                        item = angular.copy(item);
                        signUtil.openLayer('leadContractOtherLayer', item, '修改其他相关费用')
                            .then(function (data) {
                                commonContainer.showLoading();
                                return signDetailService.updateLeadContractOther(data);
                            })
                            .then(function (result) {
                                commonContainer.hideLoading();
                                if (result.code !== 0) {
                                    return layer.alert(result.msg);
                                }
                                layer.alert('修改成功');
                                $ctrl.initDelivery();
                            }, $.noop);
                    };

                    $ctrl.removeLeadContractDelivery = function (item) {
                        signUtil.confirm('确定删除此交割单项？')
                            .then(function () {
                                return signDetailService.removeLeadContractDelivery(item.deliveryId);
                            })
                            .then(function (result) {
                                if (result.code !== 0) {
                                    return layer.alert(result.msg);
                                }
                                $ctrl.initDelivery();
                            }, $.noop);
                    };


                }

                ///////   补充协议
                {
                    $ctrl.initSupplAgrtList = function () {
                        return signDetailService.getSupplAgrtListByConId(formId).then(function (result) {
                            if (result.code !== 0) {
                                return layer.alert(result.msg);
                            }
                            return $ctrl.supplAgrtList = result.data;
                        });
                    };
                }

                ////// 审批流程
                {
                    $ctrl.initContractApprovalList = function () {
                        signDetailService.getContractApproval(formId).then(function (result) {
                            if (result.code !== 0) {
                                return layer.alert(result.msg);
                            }
                            $ctrl.ApprovalListGroup = result.data;
                        });

                        // signService.workFlowDoJob({formId: formId}, {
                        //     modelName: 'LEASE_CONTRACT',
                        //     methodName: 'getFlowChartUrlByBusiness'
                        // }).then(function (result) {
                        //     if (result.code !== 0) {
                        //         return layer.alert(result.msg);
                        //     }
                        //     $ctrl.ApprovaMapHref = result.data.LEASE_CONTRACT;
                        //     // $ctrl.ApprovaMapHref2 = result.data.LEASE_FINANCIAL_AUDIT;
                        //     // $ctrl.ApprovaMapHref3 = result.data.ENCLOSURE_CONTRACT;
                        // });
                    }
                }

                ////// 打印历史
                {
                    $ctrl.initPrintHistoryList = function () {
                        signDetailService.getPrintHistory(formId).then(function (result) {
                            if (result.code !== 0) {
                                return layer.alert(result.msg);
                            }
                            $ctrl.printhistorylist = result.data.printhistorylist;
                        });

                        signDetailService.getPrintCount(formId).then(function (result) {
                            if (result.code !== 0) {
                                return layer.alert(result.msg);
                            }
                            $ctrl.printCount = result.data;
                        });
                    };
                }

                ////// 操作日志
                {
                    $ctrl.initOperationLogList = function () {
                        signDetailService.getOperationLogs(formId).then(function (result) {
                            if (result.code !== 0) {
                                return layer.alert(result.msg);
                            }
                            $ctrl.operationLogList = result.data.logslist;
                        });
                    };
                }

                /////  合同费用执行明细
                {
                    $ctrl.initCostDetailList = function () {
                        signDetailService.contractcostDetail(formId).then(function (result) {
                            if (result.code !== 0) {
                                return layer.alert(result.msg);
                            } else {
                                $ctrl.costdetail = result.data.details;
                                parameterOne = signUtil.formatParam(result.data.parameterOne);
                                parameterTwo = result.data.parameterTwo;
                                $("#collectPlan").attr("href", basePath + '/finance/collect/collectPlan.htm?' + signUtil.formatParam(parameterOne))
                                $("#paymentadd").attr("href", basePath + "/finance/payment/apply/payment/add.htm?" + signUtil.formatParam(parameterTwo))
                            }
                        })
                    };
                    //收款信息展开收起
                    $(document).on('show.bs.collapse', '.secondtable', function () {
                        $(this).closest('li').find('.btn-outline').text("收起");
                    })
                    $(document).on('hide.bs.collapse', '.secondtable', function () {
                        $(this).closest('li').find('.btn-outline').text("展开");
                    })
                }

                //业绩详情
                {
                    $ctrl.performanceList = function () {
                        $("#iframeIdyeji").attr({"src": "/sales/performance/toContractPerfDetail.html?contractId=" + formId + "&companyId=" + companysId + "&businessType=1"});
                    }
                }

                ///////// 工作流相关
                {
                    /**
                     * 工作流按钮动作
                     * @param item
                     */
                    $ctrl.workFlowAction = function (item) {
                        var labelId = item.labelId, promise;
                        var postData = {
                            taskId: taskId,
                            formId: formId,
                            isEnd: isEnd,
                            basePath: staticBasePath,
                            compId: $ctrl.data.compId,
                            discount: ($ctrl.data.discountTotal / 10).toFixed(2)
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
                        } else if (/toReject|toJump|noPass/i.test(labelId)) {// 驳回的时候，需要输入驳回原因
                            promise = signUtil.openLayer('rejectLayer')
                                .then(function (data) {
                                    // data.conRejectCause  驳回原因
                                    // data.comment  备注
                                    return signDetailService.updateLeadContractInfo({ // 更新合同状态
                                        conId: formId,
                                        rejectId: data.conRejectCause,
                                        rejectReason: data.comment || ''
                                    }).then(function () {
                                        // 提交到流程
                                        //postData['comment'] = data.comment || '';
                                        postData['comment'] = data.conRejectCause + ':' + (data.comment || '');
                                        return signService.workFlowDoJob(postData, paramsData);
                                    });
                                });
                        } else {// 其他流程
                            promise = signService.workFlowDoJob(postData, paramsData);
                        }

                        promise.then(function (result) {
                            commonContainer.hideLoading();
                            if (result.code !== 0) {
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
                            history.back();
                        }
                    };

                    // 提交打印审核（触发工作流）
                    $ctrl.flowUsers = function () {

                        //验证租金支付金额与租金总计
                        var total = $ctrl.data.sign_pay_rent_vo.reduce(function (total, item) {
                            return total + (item.payment_amount || 0);
                        }, 0);
                        if (total != $ctrl.data.rentTotal) {
                            return layer.confirm('租金支付金额与租金总计不一致，请核实支付金额是否输入正确！', {
                                yes: function (index) {
                                    $(document).scrollTop(1550);
                                    layer.close(index);
                                }
                            });
                        }
                        if (auditStatus < 4) {
                            modelName = 'LEASE_CONTRACT';
                        } else {
                            modelName = 'LEASE_FINANCIAL_AUDIT';
                        }

                        if ($ctrl.data.discountTotal < 10 && (!$ctrl.data.discountReason || !$ctrl.data.situationExplain)) {
                            return layer.alert('因 `总折扣` 发生变更，居间服务中 <span class="text-danger">`打折原因`</span>未填写，请填写完毕后再进行打印审核提交！', function (id) {
                                $('#intermediary-services').get(0).scrollIntoView();
                                layer.close(id);
                                $ctrl.startEdit('intermediaryServicesEdit');
                                $scope.$apply();
                            });
                        }

                        var defer = $q.defer();
                        var promise = defer.promise;
                        defer.resolve();

                        if ($ctrl.data.deliveryMode == 2) {// 交接方式为：公司陪同交接
                            promise = promise.then(function () {
                                return $ctrl.initDelivery();
                            }).then(function (detail) {
                                if (!(detail.householdlist || detail.otherlist)) {
                                    throw layer.alert('房屋交接方式为`公司陪同交接`，请录入房屋交割单后再提交打印审核');
                                }
                            });
                        }

                        // 半年付或者年付
                        if ($ctrl.data.paymentMode == 6 || $ctrl.data.paymentMode == 12) {
                            promise = promise.then(function () {
                                return $ctrl.initSupplAgrtList();
                            }).then(function (list) {
                                if (!list || !list.length) {
                                    throw layer.alert('房屋支付方式为年付或半年付，请录入补充协议后再提交打印审核');
                                }
                            })
                        }

                        commonContainer.showLoading();
                        promise.then(function () {
                            return signService.workFlowDoJob({formId: formId}, {
                                modelName: modelName,
                                methodName: 'findUserOnStart'
                            })
                        }).then(function (result) {
                            if (result.code !== 0) {
                                throw layer.alert(result.msg);
                            }
                            return result.data || [];
                        }).then(function (list) {
                            commonContainer.hideLoading();
                            var first = list[0] || {};
                            return signUtil.openLayer('signWorkFlowUserLayer', list, first.currentApprovalProcess, first.userId)
                        }).then(function (nextUser) {
                            commonContainer.showLoading();
                            return signService.workFlowDoJob({
                                formId: formId, nextUser: nextUser,
                                discount: ($ctrl.data.discountTotal / 10).toFixed(2)
                            }, {
                                modelName: modelName,
                                methodName: 'createWorkflow'
                            });
                        }).then(function (result) {
                            commonContainer.hideLoading();
                            if (result.code !== 0) {
                                throw layer.alert(result.msg);
                            }
                            layer.alert('已提交审批', {cancel: close}, close);

                            function close() {
                                if (auditStatus < 4) {
                                    location.reload(true);
                                }else{ // 财务审核
                                	location.href = basePath + '/sign/lease-list';
                                }
                            }
                        }).catch(function () {
                            commonContainer.hideLoading();
                        });
                    };
                }

                // 保存了对应编辑状态所需的修改 key
                var editMapper = {
                    'contractEdit': ['belongUserName', 'belonguserid'], // 合同所属人，所属人 id
                    'salesUserInfoEdit': ['signleasecontractuserinfo'], // 交易双方信息
                    'housesEdit': [ // 房源信息
                        'housingDistrictId', 'housingDistrictName',
                        'housingStreetId', 'housingStreetName', 'housingAddr', // 房源地址
                        'buildArea', 'house_owner_ship', 'certificateNum', // 建筑面积，房屋权属证明，房屋所有产权证书编号
                        'certificateName', 'ownerName', 'leaseUse',// 房屋来源证明名称, 房屋所有权人姓名, 租赁用途
                        'liveCount', 'liveMaxCount', 'mortgage', //居住人数 , 最大居住人数, 房屋抵押
                        'accommodation_registration' // 住宿登记
                    ],
                    'lesseeEdit': [ // 租赁期限
                        'lessee_start_date', // 承租期限 开始
                        'lessee_end_date', // 承租期限 结束
                        'delivery_date', // 交付日期
                        'deliverables', // 交付内容
                        'deliveryMode', // 交接方式
                        'advanceDay', // 乙方提前
                        'filed_mode', // 提出方式
                        'rentTotal', // 租金总计
                    ],
                    'rentEdit': [// 租金押金信息
                        'rentStandard', // 租金标准
                        'paymentMode', // 支付方式
                        'rentTotal', // 租金总计
                        'rent_payment_mode', // 租金付款方式
                        'deposit', // 支付方式 押
                        'payment', // 支付方式 付
                        'depositAmount', // 押金金额
                        'lesseeInstallment', // 普租分期
                        'sign_pay_rent_vo', // 租金支付日期
                        'owner_expense', // 业主承担费用
                        'customer_expense', // 客户承担费用
                        'discountTotal', // 总折扣
                        'customerCommissionConvention', // 客户佣金合同约定
                        'customerCommissionStipulate', // 客户佣金公司约定
                        'customerPaymentProportion', // 客户佣金占比
                        'ownerCommissionConvention', // 业主佣金
                        'ownerCommissionStipulate', // 业主佣金
                        'ownerPaymentProportion', // 业主佣金占比
                    ],
                    'intermediaryServicesEdit': [// 居间服务
                        'charge_object', //服务费收取对象
                        'serviceFeePaymentWay', //居间服务费支付日期
                        'service_feePayment_date', //居间服务费支付日期
                        'discountTotal', //总折扣
                        'customerCommissionConvention', //客户佣金(公司规定)
                        'customerCommissionStipulate', //客户佣金(公司规定)
                        'customerPaymentProportion', // 客户佣金占月租金比例
                        'customer_payment_mode', // 客户佣金支付方式
                        'ownerCommissionStipulate', // 业主佣金(公司规定)
                        'ownerCommissionConvention', // 业主佣金(合同约定)
                        'ownerPaymentProportion', // 业主佣金占月租金比例
                        'owner_payment_mode', // 业主佣金支付方式
                        'discountReason', // 打折原因
                        'discountUserid', // 员工姓名
                        'discountUserName', // 员工姓名
                        'discountConids', // 合同编号
                        'situationExplain', // 情况说明
                    ],
                    'rescissionAndBreachOfContractEdit': [// 解除合同及违约
                        'delayDelivery', // 1延迟交付房屋达
                        'otherConventions', // 2、其它约定
                        'dueDay', // 不按照约定租金达
                        'oweAmount', // 欠缴各项费用达
                        'otherOtherConventions', // 其它约定
                        'breakNineThree', // 第九条第三款
                        'breakNineFour', // 九条第四款
                        'breakBackDay', // 甲方应提前天数
                        'breakBackPercent', // 甲方应提违约金百分比
                        'breakAmountDiscription', // 甲方乙方未按约定时间交付房屋或房租违约金百分比
                        'breakOtherDiscription', // 其它
                        'breakOhterAgree', // 其它约定事项
                        'contractAmount', // 一式
                        'contractAmountJia', // 甲方执
                        'contractAmountYi', // 乙方执
                        'contractAmountBing', // 丙方
                        'contractAmountOtherName', // other方
                        'contractAmountOtherNum', // other方
                    ]
                };

                // 保存了修改所需的对应服务名称
                var serviceMapper = {
                    'contractEdit': 'updateContractEdit', // 保存对应的服务
                    'salesUserInfoEdit': 'updateSalesUserInfoEdit', // 保存交易双方信息
                    'housesEdit': 'updateLeadContractInfo', // 保存交易双方信息
                    'lesseeEdit': 'updateLeadContractInfo', // 保存租赁期限
                    'rentEdit': 'updateLeadContractInfo', // 保存租金押金信息
                    'intermediaryServicesEdit': 'updateLeadContractInfo', // 保存居间服务
                    'rescissionAndBreachOfContractEdit': 'updateLeadContractInfo', // 保存解除合同及违约
                };

                // 附件管理标题
                function changeAttachmentTitle(data) {
                    if (data && data.signleasecontractuserinfo) {
                        var info = data.signleasecontractuserinfo;

                        var ownagent = !$.isEmptyObject(info.ownagentlist);
                        var customeragent = !$.isEmptyObject(info.customeragentlist);

                        if (ownagent && customeragent) {
                            $ctrl.attachmentTitle = '业主客户均有代理人';
                        } else if (ownagent && !customeragent) {
                            $ctrl.attachmentTitle = '业主签署客户有代理人';
                        } else if (!ownagent && customeragent) {
                            $ctrl.attachmentTitle = '业主有代理人客户签署';
                        } else {
                            $ctrl.attachmentTitle = '业主客户均本人签署';
                        }
                    }
                }


                // 对后台不标准的数据转换处理
                function formatData(result) {
                    var data = result.data || {};

                    if (data.delivery_date) {// 将日期格式从 YYYY-MM-DD HH:mm:ss 转换为 YYYY-MM-DD
                        data.delivery_date = data.delivery_date.substring(0, 10);
                    }
                    if (data.lessee_end_date) {// 将日期格式从 YYYY-MM-DD HH:mm:ss 转换为 YYYY-MM-DD
                        data.lessee_end_date = data.lessee_end_date.substring(0, 10);
                    }
                    if (data.lessee_start_date) {// 将日期格式从 YYYY-MM-DD HH:mm:ss 转换为 YYYY-MM-DD
                        data.lessee_start_date = data.lessee_start_date.substring(0, 10);
                    }
                    if (data.sign_pay_rent_vo[0].payment_date) {// 将日期格式从 YYYY-MM-DD HH:mm:ss 转换为 YYYY-MM-DD
                        data.sign_pay_rent_vo[0].payment_date = data.sign_pay_rent_vo[0].payment_date.substring(0, 10);
                    }
                    str2num(data.signleasecontractuserinfo.ownerlist, 'idcard_type_cd');
                    str2num(data.signleasecontractuserinfo.coownerlist, 'idcard_type_cd');
                    str2num(data.signleasecontractuserinfo.customerlist, 'idcard_type_cd');
                    str2num(data.signleasecontractuserinfo.cocustomerlist, 'idcard_type_cd');
                    if(data.rejectReason && data.rejectReason[1] === ':'){
                        // 驳回原因格式是   3:xxxxx
                        // 现在去掉前面的数字和冒号
                        data.rejectReason = data.rejectReason.slice(2);
                    }
                    return result;
                }

                function str2num(list, key) {
                    list.forEach(function (item) {
                        item[key] = Number(item[key]);
                    });
                }

                // 获取页面所需的 keyCode 列表项
                [
                    'leaseHouseOwnership',
                    'leaseleasePurpose',
                    'leaseAccommodationRegistration',
                    'leaseDeliveryWay',
                    'leaseReletWay',
                    'paymentModeWay',
                    'leaseOwnerCost',
                    'leaseCustomerCost',
                    'leaseServiceChargeObj',
                    'leaseRentPayWay',
                    'discountReason',
                ].forEach(function (keyCode) {
                    signService.getTypes(keyCode).then(function (result) {
                        $ctrl[keyCode] = result.data;
                    });
                });
            }])

        /////********************** service
        .service('signDetailService', ['$http', function ($http) {

            /**
             * 获取合同信息
             * @param {String} conId 合同 id
             */
            this.getContractDetail = function (conId) {
                return $http.get(basePath + "/sign/lease/contractdetail", {params: {conId: conId}})
                    .then(function (response) {
                        return response.data;
                    });
            };


            /**
             * 根据合同编号获取合同预览信息
             * @param contractCode 合同编号
             */
            this.getViewContract = function (contractCode) {
                return $http.get(basePath + '/sign/lease/viewContract', {params: {contractCode: contractCode}})
                    .then(function (response) {
                        return response.data;
                    });
            };

            /**
             * 判断是否允许打印
             * @param conId 合同 id
             */
            this.canPrintContract = function (conId) {
                return $http.get(basePath + '/sign/lease/canPrintContract', {params: {conId: conId}})
                    .then(function (response) {
                        return response.data;
                    });
            };

            /**
             *  记录打印次数
             * @param conId 合同 id
             */
            this.recordPrintCount = function (conId) {
                return $http.get(basePath + '/sign/lease/recordPrintCount', {params: {conId: conId}})
                    .then(function (response) {
                        return response.data;
                    });
            };

            /**
             *  修改已打印合同状态
             * @param conId 合同 id
             */
            this.updateAuditStatus = function (conId) {
                return $http.get(basePath + '/sign/lease/updateAuditStatus', {params: {conId: conId}})
                    .then(function (response) {
                        return response.data;
                    });
            };

            /**
             * 获取打印历史
             * @param conId
             * @returns {Promise.<TResult>|*}
             */
            this.getPrintHistory = function (conId) {
                return $http.get(basePath + '/sign/signthecontract/printhistory', {params: {conId: conId}})
                    .then(function (response) {
                        return response.data;
                    });
            };

            /**
             * 获取打印次数
             * @param conId
             * @returns {Promise.<TResult>|*}
             */
            this.getPrintCount = function (conId) {
                return $http.get(basePath + '/sign/lease/getPrintCount', {params: {conId: conId}})
                    .then(function (response) {
                        return response.data;
                    });
            };

            /**
             * 操作日志
             * @param conId
             * @returns {Promise.<TResult>|*}
             */
            this.getOperationLogs = function (conId) {
                return $http.get(basePath + '/sales/catchlogs/operationLogs', {
                    params: {conId: conId, pageindex: 0, pagesize: 999}
                }).then(function (response) {
                    return response.data;
                })
            };

            /**
             * 获取审批记录
             * @param conId
             * @returns {Promise.<TResult>|*}
             */
            this.getContractApproval = function (conId) {
                return $http.get(basePath + '/sign/lease/selectWorkflowHistoryList', {params: {conId: conId}})
                    .then(function (response) {
                        return response.data;
                    });
            };


            /////********************** 合同信息部分
            // 修改合同基本信息
            this.updateContractEdit = function (update) {
                return $http.post(basePath + '/sign/lease/updatebasicinfo', update)
                    .then(function (response) {
                        return response.data;
                    });
            };

            // 修改交易双方信息
            this.updateSalesUserInfoEdit = function (udpate) {
                return $http.post(basePath + '/sign/lease/updatesalesuserinfo', udpate)
                    .then(function (response) {
                        return response.data;
                    });
            };

            // 修改 交易双方信息，租赁期限，租金押金信息，居间服务，解除合同及违约
            this.updateLeadContractInfo = function (udpate) {
                return $http.post(basePath + '/sign/lease/updateleadcontractinfo', udpate)
                    .then(function (response) {
                        return response.data;
                    });
            };

            /**
             * 设置合同状态
             * @param conId
             * @param contractStatus  1:签约中；2：成交；3：作废；  4：退单申请中；  5:退单进行中;   6:已退单
             */
            this.updateContractStates = function (conId, contractStatus) {
                return $http.get(basePath + '/sign/lease/updateContractStatus', {
                    params: {
                        conId: conId,
                        contractStatus: contractStatus,
                    }
                }).then(function (response) {
                    return response.data;
                });
            };

            /////**********************  合同附件服务
            // 删除附件
            this.removeEnclosureFile = function (enclosureId) {
                return $http.get(basePath + '/sign/delEnclosure', {params: {enclosureId: enclosureId}})
                    .then(function (response) {
                        return response.data;
                    })
            };
            // 添加合同附件
            this.addEnclosure = function (data) {
                return $http.post(basePath + '/sign/addEnclosure', data).then(function (response) {
                    return response.data;
                })
            };

            // 修改合同附件
            this.updateEnclosure = function (data) {
                return $http.post(basePath + '/sign/modifyEnclosure', data).then(function (response) {
                    return response.data;
                })
            };

            /**
             * 驳回附件
             * @param data.approveType 合同附件风控审批流程：1,合同附件风控审批流程;2,合同附件财务审批流程;3,合同附件先风控后财务审批流程
             * @param data.enclosureId 附件ID ,
             * @param data.rejectReason 驳回原因 ,
             * @param data.rejectType 驳回原因类型：1已收、2未收、3缺件
             */
            this.rejectEnclosure = function (data) {
                return $http.post(basePath + '/sign/rejectEnclosure', data)
                    .then(function (response) {
                        return response.data;
                    });
            };

            /**
             * 签收附件
             * @param enclosureId 附件ID ,
             * @param approveType 合同附件风控审批流程：1,合同附件风控审批流程;2,合同附件财务审批流程;3,合同附件先风控后财务审批流程
             */
            this.signEnclosure = function (enclosureId, approveType) {
                return $http.get(basePath + '/sign/signEnclosure', {
                    params: {
                        enclosureId: enclosureId,
                        approveType: approveType
                    }
                }).then(function (response) {
                    return response.data;
                });
            };

            /**
             * 补充协议
             * @param conId
             */
            this.getSupplAgrtListByConId = function (conId) {
                return $http.get(basePath + '/contract/supplagrt/getConSupplAgrtList', {
                    params: {
                        conId: conId,
                        businessType: 1
                    }
                }).then(function (response) {
                    return response.data;
                })
            };

            /**
             * 查询合同附件
             * @param enclosureId 附件 id
             */
            this.getEnclosure = function (enclosureId) {
                return $http.get(basePath + '/sign/querySingleEnclosure', {params: {enclosureId: enclosureId}})
                    .then(function (response) {
                        return response.data;
                    })
            };

            /**
             * 删除合同附件
             * @param enclosureId 附件 id
             */
            this.delEnclosure = function (enclosureId) {
                return $http.get(basePath + '/sign/delEnclosure', {params: {enclosureId: enclosureId}})
                    .then(function (response) {
                        return response.data;
                    })
            };

            /**
             * 查询附件列表
             * @param contractId 合同 id
             * @param contractType 合同类型 1=租赁，2=买卖
             */
            this.getEnclosureList = function (contractId, contractType) {
                return $http.get(basePath + '/sign/listEnclosure', {
                    params: {
                        contractId: contractId,
                        contractType: contractType,
                        pageIndex: 1,
                        pageSize: 999
                    }
                }).then(function (response) {
                    return response.data;
                })
            };

            /**
             * 附件提交审核
             * @param ids 附件ID（多个id用,逗号隔开）
             */
            this.submitEnclosure = function (ids) {
                return $http.get(basePath + '/sign/submitEnclosure', {params: {enclosureIds: ids}})
                    .then(function (response) {
                        return response.data;
                    });
            };


            /////**********************  交割单服务
            /**
             * 获取交割单详细列表
             * @param conId 合同 id
             */
            this.getDeliveryDetail = function (leaseContractId) {
                return $http.get(basePath + '/sign/lease/leadcontractdeliverydetail', {params: {lease_contract_id: leaseContractId}})
                    .then(function (response) {
                        return response.data;
                    });
            };

            /**
             * 添加交割单数据
             * @param data 交割单数据
             * @param data.lease_contract_id  合同 id
             * @param [data.otherlist]  其他相关费用
             * @param [data.householdlist]  房屋附属家具、电器、装修及其他设备设施状况及损赔
             */
            this.addLeadContractDelivery = function (data) {
                return $http.post(basePath + '/sign/lease/addleadcontractdelivery', data)
                    .then(function (response) {
                        return response.data;
                    });
            };

            /**
             * 修改交割单家电
             * @param data 交割单数据
             */
            this.updateLeadContractDelivery = function (data) {
                return $http.post(basePath + '/sign/lease/updatehousehold', data)
                    .then(function (response) {
                        return response.data;
                    });
            };

            /**
             * 修改交割单其他
             * @param data 交割单数据
             */
            this.updateLeadContractOther = function (data) {
                return $http.post(basePath + '/sign/lease/updateother', data)
                    .then(function (response) {
                        return response.data;
                    });
            };

            /**
             * 删除交割单
             * @param deliveryId 交割单项ID
             */
            this.removeLeadContractDelivery = function (deliveryId) {
                return $http.get(basePath + '/sign/lease/deleteContractDeliveryDetail', {params: {deliveryId: deliveryId}})
                    .then(function (response) {
                        return response.data;
                    });
            }

            /**
             * 合同费用执行明细
             *
             * */
            this.contractcostDetail = function (formId) {
                return $http.get(basePath + '/finance/cost/detail', {params: {contractId: formId}})
                    .then(function (response) {
                        return response.data;
                    });
            };
        }])

        .filter('uploadState', function () {
            var state = {
                '1': '已上传',
                '2': '已提交',
                '3': '已签收',
                '4': '驳回',
            };
            return function (input) {
                return state[input] || input;
            };
        })

        // 房屋交割单
        .component('leadContractDeliveryLayer', {
            template: '<div class="ibox-content">\n    <table class="table table-hover table-striped">\n        <thead>\n        <tr>\n            <th class="required">名称</th>\n            <th>品牌</th>\n            <th>单位</th>\n            <th>数量</th>\n            <th>单价(元)</th>\n            <th>赔损额(元)</th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr>\n            <td>\n                <input type="text" class="form-control input-sm" ng-model="$ctrl.data.householdName"\n                       placeholder="请输入名称">\n            </td>\n            <td>\n                <input type="text" class="form-control input-sm" ng-model="$ctrl.data.householdBrand"\n                       placeholder="请输入品牌">\n            </td>\n            <td>\n                <input type="text" class="form-control input-sm" ng-model="$ctrl.data.householdUnit"\n                       placeholder="请输入单位">\n            </td>\n            <td>\n                <input type="text" class="form-control input-sm" ng-model="$ctrl.data.householdAmount"\n                       placeholder="请输入数量">\n            </td>\n            <td>\n                <input type="text" class="form-control input-sm" ng-model="$ctrl.data.householdUnitPrice"\n                       placeholder="请输入金额">\n            </td>\n            <td>\n                <input type="text" class="form-control input-sm" ng-model="$ctrl.data.householdCompensate"\n                       placeholder="请输入金额">\n            </td>\n        </tr>\n        </tbody>\n    </table>\n</div>\n                ',
            controller: ['$element', function ($element) {
                var $ctrl = this;
                $ctrl.$start = function ($defer, data, title) {
                    $ctrl.data = data || {};
                    commonContainer.modal(title, $element, function (id) {
                        if (!$ctrl.data.householdName) {
                            return layer.alert('请输入名称');
                        }
                        if ($ctrl.data.householdUnitPrice != undefined && !(/^\d{1,6}(\.\d{1,2})?$/.test($ctrl.data.householdUnitPrice))) {
                            return layer.alert('单价不能大于6位数字2位小数');
                        }
                        $defer.resolve($ctrl.data);
                        layer.close(id);
                    }, {cancel: $defer.reject, btn2: $defer.reject, btns: ['保存', '取消'], area: ['900px', '350px']});
                };
            }]
        })
        // 其他交割单
        .component('leadContractOtherLayer', {
            template: '<div class="ibox-content">\n    <table class="table table-hover table-striped">\n        <thead>\n        <tr>\n            <th class="required">项目</th>\n            <th>单位</th>\n            <th>单价(元)</th>\n            <th>起计时间</th>\n            <th>起记底数</th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr>\n            <td>\n                <input type="text" class="form-control input-sm" ng-model="$ctrl.data.otherProject"\n                    placeholder="请输入名称">\n            </td>\n            <td>\n                <input type="text" class="form-control input-sm" ng-model="$ctrl.data.otherUnit"\n                       placeholder="请输入品牌">\n            </td>\n            <td>\n                <input type="text" class="form-control input-sm" ng-model="$ctrl.data.ohterUnitPrice"\n                       placeholder="请输入金额">\n            </td>\n            <td>\n                <input type="text" class="form-control input-sm"\n                       ng-model="$ctrl.data.otherBeginTime" mincurrent="true" sign-laydate\n                       placeholder="请选择日期">\n            </td>\n            <td>\n                <input type="text" class="form-control input-sm" ng-model="$ctrl.data.otherBeginBase"\n                       placeholder="请输入">\n            </td>\n        </tr>\n        </tbody>\n    </table>\n</div>\n                ',
            controller: ['$element', function ($element) {
                var $ctrl = this;
                $ctrl.$start = function ($defer, data, title) {
                    $ctrl.data = data || {};
                    commonContainer.modal(title, $element, function (id) {
                        if (!$ctrl.data.otherProject) {
                            return layer.alert('请输入项目');
                        }
                        if ($ctrl.data.ohterUnitPrice != undefined && !(/^\d{1,6}(\.\d{1,2})?$/.test($ctrl.data.ohterUnitPrice))) {
                            return layer.alert('单价不能大于6位数字2位小数');
                        }
                        $defer.resolve($ctrl.data);
                        layer.close(id);
                    }, {cancel: $defer.reject, btn2: $defer.reject, btns: ['保存', '取消'], area: ['900px', '350px']});
                };
            }]
        });

    angular.bootstrap(document, ['sign-detail']);
}(window));