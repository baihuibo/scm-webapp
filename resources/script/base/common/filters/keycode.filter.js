/**
 * 将字典库中 valueCode 转换为 valueName
 * <example>
 *     <file name="test.js">
 *          function testCtrl(){
 *              this.values = [1,2,3];
 *          }
 *     </file>
 *     <file name="test.html">
 *          <div ng-controller="testCtrl as $ctrl">
 *              证件类型 ： {{$ctrl.values | keycode : 'cardType'}}
 *          </div>
 *     </file>
 * </example>
 */

angular.module('common-module')
    .filter('keycode', function (commonService) {
        var type = {}, loading = {};

        function showKeyCodeTypes(value, keyCode) {
            if (type[keyCode]) {
                if (!value) {
                    value = [];
                } else if (!value.join) {
                    value = [value];// 包装为数组
                }

                value = value.map(function (item) {
                    return item + "";
                });

                return type[keyCode].filter(function (item) {
                    return value.indexOf(item.valueCode) > -1;
                }).map(function (item) {
                    return item.valueName;
                }).join(' , ');
            } else if (!loading[keyCode]) {
                loading[keyCode] = commonService.getTypes(keyCode).then(function (result) {
                    type[keyCode] = result.data;
                });
            }
        }

        showKeyCodeTypes.$stateful = true;
        return showKeyCodeTypes;
    });