/**
 * Created by baihuibo on 2017/5/5.
 */
(function (window) {

    angular.module('create-sign-service-surrender', ['base', 'sign-common'])

    ///////////// 新增草签合同 - step3 (居间服务及解约)
        .controller('signServiceSurrenderCtrl', ['$scope', 'signService', 'signServiceSurrenderService', 'signUtil', function ($scope, signService, signServiceSurrenderService, signUtil) {
            var $ctrl = this;
            var conId = signUtil.getSearchValue('conId') || '';
            var leaseContractId = signUtil.getSearchValue('leaseContractId') || '';

            var signHouseLease = Function('return ' + localStorage.getItem('sign-house-lease'))() || {};

            // 获取 租赁合同公司规定佣金标准系数
            signService.getLeaseServiceChage().then(function (result) {
                if (result.code !== 0) {
                    return layer.alert(result.msg);
                }
                /**
                 * 租赁合同佣金占比系数
                 * @property cusBrokerageReceivable 客户佣金
                 * @property ownBrokerageReceivable 业主佣金
                 */
                var serviceChage = result.data;
                $ctrl.data.customer_commission_stipulate = signHouseLease.rent_standard * serviceChage.cusBrokerageReceivable; // 客户佣金(公司规定)
                $ctrl.data.owner_commission_stipulate = signHouseLease.rent_standard * serviceChage.ownBrokerageReceivable; // 业主佣金(公司规定)
            });

            var defaultVal = {
                delay_delivery: '七', // 延迟交付房屋达
                due_day: '七', // 不按照约定租金达
                break_nine_three: '200', // 第九条第三款约定
                break_nine_four: '200', // 第九条第四款约定
                break_back_day: '30', // 提前收回该房屋/提前退租
                break_back_percent: '200', // 提前退租违约金
                break_amount_discription: '每逾期一日，按日租金的200%', // 逾期
                contract_amount: '叁', // 总份数
                contract_amount_jia: '壹', // 甲
                contract_amount_yi: '壹', // 乙方
                contract_amount_bing: '壹', // 丙方
            };

            $ctrl.data = extend({
                conId: conId,
                leaseContractId: leaseContractId,
                service_fee_payment_way: 1, // 服务费支付日期：即时
                charge_object: [1, 2], // 服务费收取对象 ： 客户，业主

                // TODO 模拟数据
                customer_payment_mode: [1, 2], // 客户佣金支付方式

                owner_payment_mode: [1, 2], // 业主佣金支付方式
            }, defaultVal);

            // 保存提交
            $ctrl.submit = function (validForm, form) {
                if (validForm.$invalid) {
                    signUtil.formInvalidIntoView(form);
                    return layer.alert('表单有未完成项');
                }

                commonContainer.showLoading();
                signServiceSurrenderService.getContractTransactionStatus({
                	contractId: conId,
                }).then(function(result){
                	commonContainer.hideLoading();
                	if (result.data == -1) {
                        return layer.alert(result.msg);
                    }
                // 这里再次进行 extend 合并参数，防止出现用户修改后未填写值的情况发生
                	return signServiceSurrenderService.saveMediaCyInfo(extend($ctrl.data, defaultVal))
                    .then(function (result) {
                        commonContainer.hideLoading();
                        if (result.code !== 0) {
                            return layer.alert(result.msg);
                        }
                        layer.alert('合同保存成功', function () {
                            localStorage.removeItem('sign-house-lease');
                            location.href = basePath + '/sign/detail/detail?conid=' + conId;
                        });
                    });
                });
            };

            // 总折扣计算
            $ctrl.disCountTotal = function () {
                return $ctrl.data.discount_total = signUtil.commission.countTotal($ctrl.data);
            };

            // 客户佣金占月租金比例
            $ctrl.customerPaymentProportion = function () {
                return $ctrl.data.customer_payment_proportion = signUtil.commission.customerPaymentProportion({
                    customer_commission_convention: $ctrl.data.customer_commission_convention,
                    rent_standard: signHouseLease.rent_standard
                });
            };
            // 业主佣金占月租金比例
            $ctrl.ownerPaymentProportion = function () {
                return $ctrl.data.owner_payment_proportion = signUtil.commission.ownerPaymentProportion({
                    owner_commission_convention: $ctrl.data.owner_commission_convention,
                    rent_standard: signHouseLease.rent_standard
                });
            };

            // 页面选择类型通用获取
            [
                'leaseServiceChargeObj', // 租赁-服务费收取对象
                'leaseRentPayWay', // 租赁-租金付款方式
                'discountReason', // 打折原因
            ].forEach(function (type) {
                signService.getTypes(type).then(function (result) {
                    $ctrl[type] = result.data;
                });
            });
        }])

        ////////////////// service
        .service('signServiceSurrenderService', ['$http', function ($http) {
            this.saveMediaCyInfo = function (data) {
                return $http.post(basePath + '/sign/lease/savemediacyinfo', data)
                    .then(function (response) {
                        return response.data;
                    });
            }
         // 检验房源是否已报成交
            this.getContractTransactionStatus = function (housesId) {
                return $http.get(basePath + '/sign/contractSales/getContractTransactionStatus', {params : housesId})
                    .then(function (response) {
                        return response.data;
                    });
            };
        }]);

    function extend(obj, def) {
        angular.forEach(def, function (val, key) {
            if (!obj[key]) {
                obj[key] = val;
            }
        });
        return obj;
    }

    angular.bootstrap(document, ['create-sign-service-surrender']);
}(window));