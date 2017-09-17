/**
 * Created by baihuibo on 2017/5/10.
 */
(function () {
    // 添加电话对话框
    angular.module('sign-common')
        .component('signAddPhoneLayer', {
            template: '<div class="ibox-content" style="height:85%;">\n    <form layout="row" novalidate ng-submit="$ctrl.add()">\n        <div flex="25" style="margin-right: 10px">\n            <select chosen\n                    class="form-control" ng-model="$ctrl.type">\n                <option value="1">国内手机</option>\n                <option value="2">国内电话</option>\n                <option value="3">国外电话</option>\n            </select>\n        </div>\n        <div flex="55" layout="row">\n            <input class="form-control hide-spin" type="text"\n                   placeholder="010" style="width: 70px;"\n                   ng-if="$ctrl.type == 2"  phone-number="" ng-model="$ctrl.areaNumber">\n            \n            <input class="form-control hide-spin" flex type="text"\n                   validate="{{$ctrl.type == 1 ? \'phoneNumber\' : \'tel\'}}"\n                   phone-number="" ng-if="$ctrl.type != 3" ng-model="$ctrl.phoneNumber">\n\n            <input class="form-control hide-spin" flex type="text"\n                   phone-number="" ng-if="$ctrl.type == 3" ng-model="$ctrl.phoneNumber">\n        </div>\n        <button type="submit" class="btn btn-success">添加</button>\n    </form>\n    <form class="form-horizontal" style="height:100%;">\n        <div class="row" style="height:100%;">\n            <div class="col-md-12 ptb10" style="height:80%;overflow-y:auto;">\n                <table id="J_phone_dataTable"\n                       class="table table-hover table-striped">\n                    <thead>\n                    <tr>\n                        <th>电话</th>\n                        <th>操作</th>\n                    </tr>\n                    </thead>\n                    <tbody>\n                    <tr ng-repeat="phone in $ctrl.phones">\n                        <td>{{::phone.phoneNumber}}</td>\n                        <td><a href="javascript:" ng-click="$ctrl.remove($index)">删除</a></td>\n                    </tr>\n                    </tbody>\n                </table>\n            </div>\n        </div>\n    <div class="col-md-12 m-b-sm">\n\t<div class="bootstrap-table">\n\t\t<div id="prompt" style="color:#ff0000;">备注：至少添加一个手机号码</div>\n\t\t</div>\n\t\t</div>\n\t</form>\n</div>\n                ',
            controller: ['$element', 'signUtil', function ($element, signUtil) {
                var $ctrl = this;

                $ctrl.$start = function ($defer, phones) {
                    $ctrl.phones = (phones || []).map(function (phoneNumber) {
                        return {phoneNumber: phoneNumber};
                    });
                    $ctrl.type = '1';
                    $ctrl.areaNumber = '';
                    $ctrl.phoneNumber = '';

                    commonContainer.modal('添加电话', $element, function (id) {
                        if (!$ctrl.phones.length) {
                            return layer.alert('请至少添加一个手机号码');
                        }
                        $defer.resolve($ctrl.phones.map(function (item) {
                            return item.phoneNumber
                        }));
                        layer.close(id);
                    }, {cancel: $defer.reject, btn2: $defer.reject, overflow: 'auto', area: ['500px', '80%']});
                };

                $ctrl.add = function () {
                    if (!$ctrl.phoneNumber) {
                        return layer.msg('请输入正确的电话号码');
                    }

                    var phoneNumber = '';

                    if ($ctrl.type === '2') {
                        phoneNumber = ($ctrl.areaNumber || '010') + '-' + $ctrl.phoneNumber;
                    } else {
                        phoneNumber = $ctrl.phoneNumber;
                    }
                    phoneNumber = phoneNumber.trim();
                    var eq = $ctrl.phones.find(function (item) {
                        return item.phoneNumber === phoneNumber;
                    });
                    if (eq) {
                        return layer.alert('请不要输入重复的电话号码');
                    }
                    $ctrl.phones.unshift({phoneNumber : phoneNumber});
                    $ctrl.areaNumber = '';
                    $ctrl.phoneNumber = '';
                };

                $ctrl.remove = function ($index) {                                    
                    signUtil.confirm('确定删除？')
                        .then(function () {
                            $ctrl.phones.splice($index, 1);
                        }, $.noop);
                }
            }]
        })

        /**
         * 电话号码添加入口
         * @name signPhoneNumberBtn
         * @description 通过它可以方便的设置编辑电话号码
         * @example
         * <example>
         *     <file name="test.html">
         *         <sign-phone-number-btn ng-model="$ctrl.phoneNumber"></sign-phone-number-btn>
         *     </file>
         * </example>
         */
        .component('signPhoneNumberBtn', {
            template: '<div class="input-group input-group-sm">\n    <input type="text" class="form-control isdisable" ng-model="$ctrl.phones" ng-list placeholder="请添加电话" autocomplete="off" readonly>\n    <div class="input-group-btn">\n        <button type="button" class="btn btn-white" ng-click="$ctrl.addPhone()">\n            <span class="fa fa-plus"></span>\n            电话\n        </button>\n    </div>\n</div>',
            require: {ngModel: 'ngModel'},
            controller: ['signUtil', function (signUtil) {
                var $ctrl = this;
                var ngModel = {};
                $ctrl.phones = [];
                $ctrl.$onInit = function () {
                    ngModel = $ctrl.ngModel;
                    ngModel.$isEmpty = function (a) {
                        return !a || !a.length;
                    }
                };
                $ctrl.$doCheck = function () {
                    $ctrl.phones = ngModel.$viewValue;
                };

                $ctrl.addPhone = function () {
                    signUtil.openLayer('signAddPhoneLayer', ($ctrl.phones || []).slice(0))
                        .then(function (phones) {
                            $ctrl.phones = phones;
                            ngModel.$setViewValue(phones);
                        }, $.noop);
                };
            }]
        })
}());