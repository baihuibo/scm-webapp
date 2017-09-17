/**
 * Created by baihuibo on 2017/5/5.
 */
(function (window) {

    angular.module('lease-retrieve', ['base', 'sign-common'])

    /////////////
        .controller('leaseRetrieveCtrl', ['$scope', 'signUtil', 'signService', function ($scope, signUtil, signService) {
            var $ctrl = this;

            $ctrl.houseid = signUtil.getSearchValue('houseid') || ''; // 房源id
            $ctrl.customerid = signUtil.getSearchValue('customerid') || ''; // 客源id
            $ctrl.buildingNo = signUtil.getSearchValue('buildingNo') || ''; // 房证编号
            $ctrl.clientid = signUtil.getSearchValue('clientid') || ''; //  客户id
            $ctrl.showingsId = signUtil.getSearchValue('showingsId') || ''; //  带看id
            if (!$ctrl.houseid || !$ctrl.customerid || !$ctrl.buildingNo) {
                return layer.alert('缺少房源(houseid)或客源(customerid)或房证(buildingNo),请检查参数');
            }

            $ctrl.houselink = signUtil.getHouseLInk($ctrl.houseid, 1);
            $ctrl.customerlink = signUtil.getCustomerLink($ctrl.customerid);

            var leaseRetrieve = Function('return ' + localStorage.getItem('lease-retrieve'))() || {};

            var coownerlist = leaseRetrieve.coownerlist || [];
            var cocustomerlist = leaseRetrieve.cocustomerlist || [];

            /// (甲方）业主信息
            $ctrl.ownerCards = leaseRetrieve.ownerlist || [createData('业主信息')];// 业主有效身份证件
            $ctrl.commonOwnerCards = coownerlist.length ? coownerlist : [createData('业主共有人')];// 业主共有人身份证件

            /// （乙方）客户信息
            $ctrl.customerCards = leaseRetrieve.customerlist || [createData('客户信息')];// 客户有效身份证件
            $ctrl.customerMultiContractorCards = cocustomerlist.length ? cocustomerlist : [createData('客户多签约人')];// 客户多签约人

            /// 添加证件
            $ctrl.addCard = function (list, key) {
                list.push(createData(key))
            };

            // 删除证件
            $ctrl.removeCard = function (card, list) {
                signUtil.confirm('确定删除此数据？')
                    .then(function () {
                        // 删除数据
                        list.splice(list.indexOf(card), 1);
                        layer.msg('删除成功');
                    }, $.noop);
            };

            // 检索
            $ctrl.restrictive = function (form) {
                if (form.$invalid) {
                    return layer.alert('表单有未完成项,请输入正确的证件编号');
                }

                //  共有人
                var coc = filterEmptyCard($ctrl.commonOwnerCards);
                //  多签约人
                var cmcc = filterEmptyCard($ctrl.customerMultiContractorCards);

                var owners = [].concat($ctrl.ownerCards, coc);
                var customers = [].concat($ctrl.customerCards, cmcc);

                var data = validRepeatCard([].concat(owners, customers));
                if (data) {
                    return signService.getTypes('cardType').then(function (result) {
                        return result.data || [];
                    }).then(function (list) {
                        var type = list.find(function (item) {
                            return item.valueCode == data.idCardTypeId;
                        });

                        if (type) {
                            layer.alert('{0} 与 {1} 的 "{2}" 编码一致，请检查证件信息无误后，进行限制性检索！'.format(data.key1, data.key2, type.valueName));
                        }
                    });
                }

                commonContainer.showLoading();
                signService.validateRestrictive({
                    buildingNo: $ctrl.buildingNo,
                    businessTypeId: 1, // 业务类型id 1: 租赁 2: 买卖
                    customers: customers,
                    owners: owners
                }).then(function (result) {
                    commonContainer.hideLoading();
                    var data = result.data || {};
                    if (result.code !== 0 || !data.validate) {
                        throw layer.alert(data.message || result.msg, {icon: 2});
                    }

                    signUtil.openLayer('validTrueAsLayer').then(function () {
                        localStorage.setItem('lease-retrieve', angular.toJson({
                            houseid: $ctrl.houseid,
                            customerid: $ctrl.customerid,
                            clientid: $ctrl.clientid,
                            ownerlist: $ctrl.ownerCards,// 业主信息
                            coownerlist: coc,// 业主共有人信息
                            customerlist: $ctrl.customerCards,// 客户信息
                            cocustomerlist: cmcc,// 客户多签约人
                            showingsId: $ctrl.showingsId,
                        }));
                        location.href = 'create-sign';// 前往新增页面
                    }, $.noop);
                });
            };

            // 验证是否存在重复的证件
            function validRepeatCard(list) {
                var onceCard = {};
                for (var i = 0; i < list.length; i++) {
                    var card = list[i];
                    var key = card.idCardTypeId + '@' + card.idCard;
                    var card1 = onceCard[key];
                    if (card1) {
                        return {
                            idCardTypeId: card.idCardTypeId,
                            key1: card1.$$type,
                            key2: card.$$type,
                        };
                    }
                    onceCard[key] = card;
                }
                return false;
            }

            function filterEmptyCard(list) {// 去除空的证件
                return list.filter(function (card) {
                    return card.idCard && card.idCardTypeId;
                })
            }

            function validCardCheck(list) { // 校验所有的证件值都不能为空
                return list.every(function (card) {
                    return card.idCard && card.idCardTypeId;
                });
            }
        }])

        ////////////////// service
        .component('validTrueAsLayer', {
            template: '<div class="ibox-content">\n    <form class="form-horizontal">\n        <div class="form-group">\n            <label class="col-sm-4 control-label">此合同报成交大区：</label>\n            <div class="col-sm-7">\n                <div class="form-control-static">{{$ctrl.user.areaName}}</div>\n            </div>\n        </div>\n        <div class="form-group">\n            <label class="col-sm-4 control-label">此合同报成交组团：</label>\n            <div class="col-sm-7">\n                <div class="form-control-static">{{$ctrl.user.shopGroupName}}</div>\n            </div>\n        </div>\n        <div class="form-group">\n            <label class="col-sm-4 control-label">此合同报成交店：</label>\n            <div class="col-sm-7">\n                <div class="form-control-static">{{$ctrl.user.hrShopName}}</div>\n            </div>\n        </div>\n        <div class="form-group">\n            <label class="col-sm-4 control-label">此合同报成交人：</label>\n            <div class="col-sm-7">\n                <div class="form-control-static">\n                    <person-show person-id="$ctrl.user.userId" person-name="$ctrl.user.userName">\n                    </person-show>\n                </div>\n            </div>\n        </div>\n    </form>\n</div>',
            controller: ['$element', 'signService', function ($element, signService) {
                var $ctrl = this;
                signService.getCurrentUserInfo().then(function (result) {
                    if (result.code !== 0) {
                        return layer.alert(result.msg);
                    }
                    $ctrl.user = result.data;
                });
                $ctrl.$start = function ($defer) {
                    commonContainer.modal('确定报成交人信息', $element, function (id) {
                        $defer.resolve($ctrl.user);
                        layer.close(id);
                    }, {cancel: $defer.reject, btn2: $defer.reject, area: ['500px'], btns: ['确定', '取消']});
                }
            }]
        });

    function createData(key) {
        return {idCard: '', idCardTypeId: 1, $$type: key}
    }

    angular.bootstrap(document, ['lease-retrieve']);
}(window));