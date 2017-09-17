/**
 * 输入框组件
 */
angular.module('common-module')
    .component('formItem', {
        template: '<div class="form-group form-group-sm" flex layout="row">\n    <label for="{{$ctrl.uuid}}" class="control-label" ng-class="{required : $ctrl.required}">{{$ctrl.text}}</label>\n    <div flex layout="row" layout-wrap ng-transclude></div>\n</div>',
        transclude: true,
        bindings: {text: '@'},
        controller: function ($element) {
            if (angular.isUndefined($element.attr('flex'))) {
                $element.attr('flex', '');
            }
            var $ctrl = this;
            $ctrl.setUUID = function (uuid) {
                if (!$ctrl.uuid) {
                    $ctrl.uuid = uuid;
                }
            };
            $ctrl.setRequired = function (required) {
                $ctrl.required = required;
            };
        }
    })
    .component('salesInput', {
        template: '<input type="{{$ctrl.type || \'text\'}}" id="{{$ctrl.uuid}}" name="{{$ctrl.name || $ctrl.uuid}}"\n       ng-model="$ctrl.value" class="form-control" validate="$ctrl.validateRule">\n<span class="help-block"></span>\n',
        bindings: {
            type: '@',
            name: '@',
            value: '=?',
            validateRule: '<?'
        },
        require: {
            formItem: '^^formItem'
        },
        controller: function ($element, commonUtil) {
            var $ctrl = this;

            if (angular.isUndefined($element.attr('flex'))) {
                $element.attr('flex', '');
            }

            $ctrl.uuid = commonUtil.uuid();
            $ctrl.$onInit = function () {
                if ($ctrl.formItem) {
                    $ctrl.formItem.setUUID($ctrl.uuid);
                    $ctrl.validateRule && setRequiredStyle($ctrl.validateRule);
                }
            };
            $ctrl.$doCheck = function () {
                if ($ctrl.formItem) {
                    $ctrl.validateRule && setRequiredStyle($ctrl.validateRule);
                }
            };

            // 设置required样式(红色星号)
            function setRequiredStyle(rule) {
                $ctrl.formItem.setRequired(rule.required || (rule.rules || {}).required);
            }
        }
    });