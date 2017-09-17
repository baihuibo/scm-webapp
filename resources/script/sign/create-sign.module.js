/**
 * Created by baihuibo on 2017/5/5.
 */
(function (window) {

    angular.module('create-sign', ['base', 'sign-common'])

    ///////////// 新增草签合同 - step1 (交易双方信息)
        .controller('createSignCtrl', ['$scope', 'createSignService', 'signUtil', 'signService', function ($scope, createSignService, signUtil, signService) {
            var $ctrl = this;

            // 获取 localStorage 缓存数据
            var leaseRetrieve = Function('return ' + localStorage.getItem('lease-retrieve'))() || {};

            $ctrl.houseid = leaseRetrieve.houseid || '';
            $ctrl.customerid = leaseRetrieve.customerid || '';
            $ctrl.clientid = leaseRetrieve.clientid || '';
            
            if (!$ctrl.houseid || !$ctrl.customerid) {
                return layer.alert('缺少房源id或客源id');
            }

            $ctrl.houselink = signUtil.getHouseLInk($ctrl.houseid, 1);// 租赁合同，链接到租赁详情页即可
            $ctrl.customerlink = signUtil.getCustomerLink($ctrl.customerid);

            // 设置当前登陆人
            signService.getCurrentUserInfo().then(function (result) {
                if (result.code !== 0) {
                    return layer.alert(result.msg);
                }
                $ctrl.currentUser = result.data.userName;
                $ctrl.currentUserId = result.data.userId;

                $ctrl.belong_userid = result.data.userId;
            });

            $ctrl.ownerlist = formatListToInfoObject(leaseRetrieve.ownerlist);// 业主信息
            $ctrl.coownerlist = formatListToInfoObject(leaseRetrieve.coownerlist);// 业主共有人信息
            $ctrl.ownagentlist = []; // 业主委托代理人

            $ctrl.customerlist = formatListToInfoObject(leaseRetrieve.customerlist); // 客户信息
            $ctrl.cocustomerlist = formatListToInfoObject(leaseRetrieve.cocustomerlist); // 客户多签约人
            $ctrl.customeragentlist = []; // 客户委托代理人

            var isSaved = false;

            window.onbeforeunload = function (e) {
                if (!isSaved && $ctrl.validForm.$dirty && !$ctrl.validForm.$submitted) {
                    // 未保存的情况下，询问是否继续退出页面
                    return '表单有为为保存项目，是否继续退出页面';
                }
            };
            window.onunload = function () {
                // TODO 清除 localStorage 数据
            	localStorage.clear();
            };

            $ctrl.submit = function (validForm, form) {
                if (validForm.$invalid) {
                    signUtil.formInvalidIntoView(form);
                    return layer.alert('表单项未输入完成');
                }
                commonContainer.showLoading();
               createSignService.getContractTransactionStatus({
                	housesId: $ctrl.houseid, // 房源编号
                }).then(function(result){
                	commonContainer.hideLoading();
                	if (result.data == -1) {
                        return layer.alert(result.msg);
                    }
                	return createSignService.saveSalesUserInfo({
                        belong_userid: $ctrl.belong_userid, // 合同所属人
                        customerid: $ctrl.customerid, // 客源编号
                        houseid: $ctrl.houseid, // 房源编号
                        clientid: $ctrl.clientid,
                        signleasecontractuserinfo: {
                            ownerlist: $ctrl.ownerlist,
                            coownerlist: $ctrl.coownerlist,
                            ownagentlist: $ctrl.ownagentlist,
                            customerlist: $ctrl.customerlist,
                            cocustomerlist: $ctrl.cocustomerlist,
                            customeragentlist: $ctrl.customeragentlist
                        }
                    }).then(function (result) {
                        commonContainer.hideLoading();
                        if (result.code !== 0) {
                            return layer.alert(result.msg);
                        }

                        if (!result.data) {
                            return layer.alert('未返回数据，请联系管理员');
                        }

                        isSaved = true;
                        localStorage.removeItem('lease-retrieve'); // 清除缓存数据
    /*
            			layer.alert('操作成功!', {
            				yes:function(){*/
            					location.href = 'create-sign-house-lease?conId=' + result.data.conId + '&leaseContractId=' + result.data.leaseContractId;
//            				}
//            			});                    
                    })
                })
            };

            // 添加人
            $ctrl.addPerson = function (list, title) {
                signUtil.openLayer('signAddPersonLayer', createInfoObject(), title)
                    .then(function (person) {
                        list.push(person);
                    }, $.noop);
            };
            // 编辑人
            $ctrl.editPerson = function (list, $index, item, title) {
                signUtil.openLayer('signAddPersonLayer', item, title)
                    .then(function (person) {
                        list.splice($index, 1, person);
                    }, $.noop);
            };
            // 删除人
            $ctrl.removePerson = function (list, index, msg) {
                signUtil.confirm(msg).then(function () {
                    list.splice(index, 1);
                    layer.alert('删除成功');
                }, $.noop)
            };

            $ctrl.back = function () {
                signUtil.confirm('是否取消合同录入？').then(function () {
                    history.back();
                }, $.noop);
            };
        }])

        ////////////////// service
        .service('createSignService', ['$http', function ($http) {
            // 保存交易双方信息
            this.saveSalesUserInfo = function (data) {
                return $http.post(basePath + '/sign/lease/savesalesuserinfo', data)
                    .then(function (response) {
                        return response.data;
                    });
            };
            // 检验房源是否已报成交
            this.getContractTransactionStatus = function (housesId) {
                return $http.get(basePath + '/sign/contractSales/getContractTransactionStatus', {params : housesId})
                    .then(function (response) {
                        return response.data;
                    });
            };
        }]);

    function formatListToInfoObject(list) {
        return list.map(function (item) {
            return {
                house_no: '',
                full_name: '',
                idcard_no: item.idCard,
                idcard_type_cd: item.idCardTypeId,
                phone_number: []
            }
        });
    }

    function createInfoObject() {
        return {
            "house_no": "", // 房产证号码
            "full_name": "", // 姓名
            "idcard_no": "", // 证件号
            "idcard_type_cd": "", // 证件类型
            "phone_number": [] // 联系电话 多个电话逗号隔开
        }
    }

    angular.bootstrap(document, ['create-sign']);
}(window));