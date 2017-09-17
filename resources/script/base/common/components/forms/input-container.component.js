/**
 * 输入框组件
 */
angular.module('common-module')
    .component('formItem', {
        template: '<div class="form-group" flex layout="row">\n    <label for="{{$ctrl.uuid}}" class="control-label">{{$ctrl.text}}</label>\n    <div flex layout="row" layout-wrap ng-transclude></div>\n</div>',
        transclude: true,
        bindings: {text: '@'},
        controller: function ($element) {
            if (!$element.attr('flex')) {
                $element.attr('flex', '100');
            }
            var $ctrl = this;
            $ctrl.setUUID = function (uuid) {
                if (!$ctrl.uuid) {
                    $ctrl.uuid = uuid;
                }
            };
        }
    })
    .component('salesInput', {
        template: '<input type="{{$ctrl.type || \'text\'}}" id="{{$ctrl.uuid}}" name="{{$ctrl.name || $ctrl.uuid}}"\n       ng-model="$ctrl.value" class="form-control" validate="$ctrl.validateRule">\n<span class="help-block"></span>\n',
        bindings: {
            type: '@',
            name: '@',
            value: '=',
            validateRule: '='
        },
        require: {
            formItem: '^^formItem'
        },
        controller: function ($element, commonUtil) {
            var $ctrl = this;

            if (!$element.attr('flex')) {
                $element.attr('flex', '');
            }

            $ctrl.uuid = commonUtil.uuid();
            $ctrl.$onInit = function () {
                $ctrl.formItem && $ctrl.formItem.setUUID($ctrl.uuid);
            };
        }
    });