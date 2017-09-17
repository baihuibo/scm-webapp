/**
 * Created by baihuibo on 2017/5/10.
 */
(function () {
    // 添加电话对话框
    angular.module('sign-common')
    /**
     * @name signCheckboxGroup 多选组件
     * @description 用来处理多个多选组件的值集合
     * @example
     * <example>
     *     <file name="test.html">
     *          <sign-checkbox-group ng-model="values">
     *              <sign-checkbox value="1">a</sign-checkbox>
     *              <sign-checkbox value="2">b</sign-checkbox>
     *              <sign-checkbox value="3">c</sign-checkbox>
     *          </sign-checkbox-group>
     *          values = {{values}}
     *  </file>
     * </example>
     */
        .component('signCheckboxGroup', {
            require: {ngModel: 'ngModel'},
            controller: ['signUtil', function () {
                var $ctrl = this, checkboxs = [], ngModel;
                $ctrl.$onInit = function () {
                    ngModel = $ctrl.ngModel;
                    ngModel.$isEmpty = function (arr) {
                        return !arr || !arr.length;
                    };
                };

                $ctrl.addCheckbox = function (checkboxCtrl) {
                    checkboxs.push(checkboxCtrl);
                };

                $ctrl.removeCheckbox = function (checkboxCtrl) {
                    checkboxs.splice(checkboxs.indexOf(checkboxCtrl), 1);
                };

                $ctrl.toggle = function (checkboxCtrl) {
                    var arr = ngModel.$modelValue || [];
                    var idx = arr.indexOf(checkboxCtrl.value);
                    if (idx > -1) {
                        arr.splice(idx, 1);
                    } else {
                        arr.push(checkboxCtrl.value);
                    }

                    ngModel.$setTouched();
                    ngModel.$setViewValue(arr.slice(0));
                };

                $ctrl.checked = function (checkboxCtrl) {
                    var arr = ngModel.$modelValue || [];
                    return arr.indexOf(checkboxCtrl.value) > -1;
                };
            }]
        })

        .component('signCheckbox', {
            template: '<div class="checkbox checkbox-primary checkbox-inline">\n    <input type="checkbox" id="{{::$ctrl.id}}" name="{{::$ctrl.name}}" ng-value="$ctrl.value" ng-click="$ctrl.click()" ng-checked="$ctrl.checked()">\n    <label for="{{::$ctrl.id}}" ng-transclude></label>\n</div>',
            bindings: {value: '<' , name:'@'},
            transclude: true,
            require: {signCheckboxGroup: '^signCheckboxGroup'},
            controller: ['signUtil', function (signUtil) {
                var $ctrl = this;
                $ctrl.id = signUtil.uuid();
                $ctrl.$onInit = function () {
                    if (!$ctrl.signCheckboxGroup) {
                        throw new Error('sign-checkbox 组件需要嵌套在 sign-checkbox-group 中');
                    }
                    $ctrl.signCheckboxGroup.addCheckbox($ctrl);
                };
                $ctrl.click = function () {
                    $ctrl.signCheckboxGroup.toggle($ctrl);
                };

                $ctrl.checked = function () {
                    return $ctrl.signCheckboxGroup.checked($ctrl);
                };

                $ctrl.$onDestroy = function () {
                    $ctrl.signCheckboxGroup.removeCheckbox($ctrl);
                };
            }]
        })
}());