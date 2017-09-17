/**
 * chosen select 组件
 * @param keyCode 关联字典列表
 * @param list 关联列表，在不需要 keyCode 的情况下使用
 * @param ngModel 绑定数据
 */
angular.module('common-module')
    .component('chosen', {
        template: '<select></select>',
        bindings: {
            keyCode: '@',
            list: '=?',
            ngModel: '=?'
        },
        controller: function ($element, commonService) {
            var $ctrl = this;
            $ctrl.$onInit = function () {
                if ($ctrl.keyCode) {
                    commonService.getTypes($ctrl.keyCode).then(function (result) {
                        if (result.data) {
                            $ctrl.list = result.data;
                        }
                    });
                }
            };
        }
    });