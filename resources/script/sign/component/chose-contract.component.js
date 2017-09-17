/**
 * Created by baihuibo on 2017/5/10.
 */
(function () {
    angular.module('sign-common')
    /**
     * @name choseContractLayer  补充协议选择合同组件
     * @description 通过此组件可以方便的选择合同
     * @example
     * <example>
     *     <file name="test.js">
     *          signUtil.openLayer('choseContractLayer')
     *     </file>
     * </example>
     */
        .component('choseContractLayer', {
            //language=HTML
            template: '<div class="ibox-content">\n    <form class="form-horizontal" role="form" ng-submit="$ctrl.queryConList()">\n        <div class="row">\n            <div class="col-md-4">\n                <div class="form-group">\n                    <label class="col-sm-3 control-label">合同编号：</label>\n                    <div class="col-sm-8">\n                        <input ng-model="$ctrl.params.contractcode" type="text" class="form-control">\n                    </div>\n                </div>\n            </div>\n            <div class="col-md-4">\n                <div class="form-group">\n                    <label class="col-sm-3 control-label">录入日期：</label>\n                    <div class="col-sm-8" layout="row">\n                        <div flex>\n                            <input type="text" class="form-control isdisable"\n                                   sign-laydate max="$ctrl.params.endcreatetime" \n                                   ng-model="$ctrl.params.startcreatetime"\n                                   readonly="readonly" style="background-color:#fff;">\n                        </div>\n                        <div class="split">-</div>\n                        <div flex>\n                            <input type="text" class="form-control isdisable"\n                                   sign-laydate min="$ctrl.params.startcreatetime" \n                                   ng-model="$ctrl.params.endcreatetime"\n                                   readonly="readonly" style="background-color:#fff;">\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div class="col-md-4">\n                <div class="form-group">\n                    <label class="col-sm-3 control-label">房源编号：</label>\n                    <div class="col-sm-8">\n                        <input type="text" class="form-control" ng-model="$ctrl.params.housescode">\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="row">\n            <div class="col-md-4">\n                <div class="form-group">\n                    <label class="col-sm-3 control-label">业主姓名：</label>\n                    <div class="col-sm-8">\n                        <input type="text" class="form-control" ng-model="$ctrl.params.ownername">\n                    </div>\n                </div>\n            </div>\n            <div class="col-md-4" ng-if="$ctrl.isBuy">\n                <div class="form-group">\n                    <label class="col-sm-3 control-label">成交价：</label>\n                    <div class="col-sm-8" layout="row">\n                        <div flex>\n                            <input type="number" class="form-control"\n                                   ng-model="$ctrl.params.transactionpricemin"\n                                   disabled-negative style="background-color:#fff;">\n                        </div>\n                        <div class="split">-</div>\n                        <div flex>\n                            <input type="number" class="form-control"\n                                   ng-model="$ctrl.params.transactionpricemax"\n                                   disabled-negative style="background-color:#fff;">\n                        </div>\n                        <div class="split">元</div>\n                    </div>\n                </div>\n            </div>\n            <div class="col-md-4" ng-if="!$ctrl.isBuy">\n                <div class="form-group">\n                    <label class="col-sm-3 control-label">月租金：</label>\n                    <div class="col-sm-8" layout="row">\n                        <div flex>\n                            <input type="number" class="form-control"\n                                   ng-model="$ctrl.params.rentstandardmin"\n                                   disabled-negative style="background-color:#fff;">\n                        </div>\n                        <div class="split">-</div>\n                        <div flex>\n                            <input type="number" class="form-control"\n                                   ng-model="$ctrl.params.rentstandardmax"\n                                   disabled-negative style="background-color:#fff;">\n                        </div>\n                        <div class="split">元</div>\n                    </div>\n                </div>\n            </div>\n            <div class="col-md-4">\n                <label class="col-sm-3 control-label">客户编号：</label>\n                <div class="col-sm-8">\n                    <input type="text" ng-model="$ctrl.params.customercode" class="form-control">\n                </div>\n            </div>\n        </div>\n        <div class="row">\n            <div class="col-md-4">\n                <label class="col-sm-3 control-label">客户姓名：</label>\n                <div class="col-sm-8">\n                    <input type="text" class="form-control" ng-model="$ctrl.params.customername">\n                </div>\n            </div>\n        </div>\n        <div class="row ptbottom10">\n            <div class="col-md-12">\n                <div class="form-group">\n                    <div class="col-sm-5  col-sm-offset-5">\n                        <button type="submit" class="btn btn-success btn_size">查 询</button>\n                        <button type="reset" class="btn btn-white btn_size" ng-click="$ctrl.reset()">重 置</button>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </form>\n\n    <table class="table table-hover table-striped table-bordered" style="table-layout: fixed">\n        <thead>\n        <tr>\n            <th style="width: 30px;"></th>\n            <th style="width: 60px;">业务类型</th>\n            <th style="width: 102px;">合同编号</th>\n            <th>客户姓名<br>业主姓名</th>\n            <th style="width: 115px;">客户佣金<br</th>\n            <th style="width: 90px;" ng-if="$ctrl.isBuy">成交价（元）</th>\n            <th style="width: 90px;" ng-if="!$ctrl.isBuy">月租金（元）</th>\n            <th style="width: 165px;">所属部门</th>\n            <th style="width: 63px;">成交人</th>\n            <th style="width: 116px;">录入日期</th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr ng-repeat="item in $ctrl.queryResult" ng-click="$ctrl.selectedItem = item">\n            <td>\n                <input type="radio" name="conListItem" ng-checked="$ctrl.selectedItem == item">\n            </td>\n            <td>{{item.contract_type}}</td>\n            <td>{{item.contract_code}}</td>\n            <td>{{item.customer_name}} <br> {{item.owner_name}}</td>\n            <td>{{item.customer_commission}} <br/> {{item.owner_commission}}</td>\n            <td ng-if="$ctrl.isBuy">{{item.transaction_price}}</td>\n            <td ng-if="!$ctrl.isBuy">{{item.rent_standard}}</td>\n            <td>{{item.dept_name}}</td>\n            <td>{{item.user_name}}</td>\n            <td>{{item.create_time}}</td>\n        </tr>\n        <tr ng-if="$ctrl.queryResult.length == 0">\n            <td colspan="9">没有找到匹配的记录</td>\n        </tr>\n        </tbody>\n    </table>\n    <paging config="$ctrl.pagingConfig" list="$ctrl.queryResult"></paging>\n</div>',
            controller: ['$element', '$http', function ($element, $http) {
                var $ctrl = this;

                /**
                 *
                 * @param $defer
                 * @param businesstype 业务类型 1 租赁，2 买卖，3 租赁退单，4 买卖退单
                 */
                $ctrl.$start = function ($defer, businesstype) {
                    $ctrl.businesstype = businesstype;
                    $ctrl.isBuy = businesstype % 2 === 0;
                    commonContainer.modal('选择合同', $element, function (id) {
                        if (!$ctrl.selectedItem) {
                            return layer.alert('请选择合同');
                        }
                        $defer.resolve($ctrl.selectedItem);
                        layer.close(id);
                    }, {
                        cancel: $defer.reject,
                        btn2: $defer.reject,
                        area: ['1000px', '90%'],
                        overflow: 'auto'
                    });
                };

                $ctrl.params = {};
                $ctrl.reset = function () {
                    $ctrl.params = {};
                };

                $ctrl.pagingConfig = {
                    url: basePath + "/contract/supplagrt/getContractList"
                };

                $ctrl.queryConList = function () {
                    $ctrl.selectedItem = null;
                    var dept = $('#J_deptName');
                    $ctrl.params['deptid'] = dept.val() ? dept.attr('data-id') : void 0;
                    $ctrl.params['businesstype'] = $ctrl.businesstype;
                    $ctrl.pagingConfig.queryList($ctrl.params);
                }
            }]
        });

}());