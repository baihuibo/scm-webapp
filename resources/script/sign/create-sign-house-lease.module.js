/**
 * Created by baihuibo on 2017/5/5.
 */
(function (window) {

    angular.module('create-sign-house-lease', ['base', 'sign-common'])

    ///////////// 新增草签合同 - step2 (房源及租赁信息)
        .controller('signHouseLeaseCtrl', ['$scope', 'signService', 'createSignHouseLeaseService', 'signUtil', '$filter',
            function ($scope, signService, createSignHouseLeaseService, signUtil, $filter) {
                var $ctrl = this;
                var conId = signUtil.getSearchValue('conId') || '';
                var leaseContractId = signUtil.getSearchValue('leaseContractId') || '';

                $ctrl.data = {
                    /// 默认属性
                    conId: conId,
                    leaseContractId: leaseContractId,
                    lessee_installment: 0, // 普租发起 ： 否
                    mortgage: 0, // 房屋抵押 ： 否
                    filed_mode: [2],// 提出方式： 书面
                    accommodation_registration: [2], // 住宿登记 ： 否
                    lease_use: "",// 租赁用途： 居住
                    advance_day: '三十',// 乙方继续承租提前提出时间

                    sign_pay_rent_vo: [{}], // 租金支付日期
                    housing_districtid: 1, // 区县
                    housing_district: '区县明文', // 区县
                    housing_street_id: 12, // 请选择街道办事处
                    housing_street: '街道地址明文', // 请选择街道办事处
                    rent_payment_mode: [], // 租金付款方式
                    deposit: "", // 押
                    payment: "", // 付
                    owner_expense : [], // 业主承担费用
                    customer_expense : [] // 客户承担费用
                };

                // 保存提交
                $ctrl.submit = function (validForm, form) {
                    if (validForm.$invalid) {
                        signUtil.formInvalidIntoView(form);
                        return layer.alert('表单有未完成项');
                    }
                    if (!$ctrl.data.sign_pay_rent_vo.length) {
                        return layer.alert('请添加租金支付日期');
                    }
                    var empty = $ctrl.data.sign_pay_rent_vo.some(function (item) {
                        return !item.payment_date || !item.payment_amount;
                    });
                    if (empty) {
                        return layer.alert('租金支付日期未完成填写');
                    }

                    var total = $ctrl.data.sign_pay_rent_vo.reduce(function (total, item) {
                        return total + (item.payment_amount || 0);
                    }, 0);
                    if (total !== $ctrl.data.rent_total) {
                        return layer.alert('租金支付金额与租金总计不一致，请核实支付金额是否输入正确！');
                    }

                    commonContainer.showLoading();
                    createSignHouseLeaseService.getContractTransactionStatus({
                    	contractId: conId,
                    }).then(function(result){
                    	commonContainer.hideLoading();
                    	if (result.data == -1) {
                            return layer.alert(result.msg);
                        }
                    
                    	return createSignHouseLeaseService.saveHouseAndLeaseInfo($ctrl.data)
                        .then(function (result) {
                            commonContainer.hideLoading();
                            if (result.code !== 0) {
                                return layer.alert(result.msg);
                            }
                            localStorage.setItem('sign-house-lease', angular.toJson($ctrl.data));
                            // TODO 跳转到下一步
                            location.href = 'create-sign-service-surrender?conId=' + conId + '&leaseContractId=' + leaseContractId;
                        });
                    });
                };

                //***** 租金支付日期
                $ctrl.addPayDate = function () { // 新增
                    $ctrl.data.sign_pay_rent_vo.push({});
                };
                $ctrl.removePayDate = function ($index) { // 删除
                    signUtil.confirm('确定删除？')
                        .then(function () {
                            $ctrl.data.sign_pay_rent_vo.splice($index, 1);
                        }, $.noop);
                };

                $scope.$watch('$ctrl.data.lessee_start_date + $ctrl.data.lessee_end_date + $ctrl.data.rent_standard', function () {
                    var monthLength = $filter('monthLength')($ctrl.data.lessee_start_date, $ctrl.data.lessee_end_date);
                    return $ctrl.data.rent_total = Math.ceil(monthLength) * $ctrl.data.rent_standard;
                });

                // 设置最大居住人数
                $ctrl.setMaxLive = function (area) {
                    $ctrl.data.live_max_count = Math.floor(area / 6) || 1;
                };

                // 页面选择类型通用获取
                [
                    'leaseHouseOwnership',// 房屋权属证明
                    'leaseleasePurpose',// 租赁用途
                    'leaseAccommodationRegistration',// 住宿登记
                    'leaseDeliveryWay',// 交接方式
                    'leaseReletWay',// 续租形式
                    'paymentModeWay',// 支付方式(日期)
                    'leaseRentPayWay',// 租金付款方式
                    'leaseOwnerCost',// 业主承担费用
                    'leaseCustomerCost',// 业主承担费用
                ].forEach(function (type) {
                    signService.getTypes(type).then(function (result) {
                        $ctrl[type] = result.data;
                    });
                });
            }])

        ////////////////// service
        .service('createSignHouseLeaseService', ['$http', function ($http) {
            this.saveHouseAndLeaseInfo = function (data) {
                return $http.post(basePath + '/sign/lease/savehouseandleaseinfo', data)
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

    angular.bootstrap(document, ['create-sign-house-lease']);
}(window));