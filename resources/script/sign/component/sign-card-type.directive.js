/**
 * Created by baihuibo on 2017/5/10.
 */
(function () {
    angular.module('sign-common')
    /**
     * @name sign-card-type 证件类型选择器
     * @description 使用它，可以创建选择证件类型的下拉框，可以使用 ng-model 绑定值
     * @example
     * <example>
     *     <file name="test.html">
     *      <sign-card-type ng-model="$ctrl.cardType"></sign-card-type>
     *     </file>
     * </example>
     */
        .directive('signCardType', ['signService', function (signService) {
            return {
                template: '<select class="form-control" chosen ng-options="item.valueCode as item.valueName for item in cardTypes">\n</select>',
                replace: true,
                link: function ($scope) { // link 关联 =》  dom 和 js 行为 关联
                    signService.getTypes('cardType').then(function (result) {
                        $scope.cardTypes = result.data;
                    });
                }
            };
        }]);
}());