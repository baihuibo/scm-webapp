/**
 * Created by baihuibo on 2017/5/10.
 */
(function () {
    angular.module('sign-common')
    /**
     * @name signPaymentDateLayer 支付日期
     * @description 通过此组件可以方便的新增或者修改人租金支付日期对象
     * @example
     * <example>
     *     <file name="test.js">
     *         function Ctrl(signUtil) {
     *             signUtil.openLayer('signPaymentDateLayer' , {} , '新增租金支付日期')
     *                 .then(function(result) {
     *
     *                 } , $.noop)
     *        }
     *     </file>
     * </example>
     */
        .component('signPaymentDateLayer', {
            template: '<div class="ibox-content">\n    <table class="table table-hover table-striped">\n        <thead>\n        <tr>\n            <th class="required" style="width: 150px;">支付日期</th>\n            <th class="required" style="width: 150px;">支付金额</th>\n            <th>备注</th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr>\n            <td>\n                <input type="text" class="form-control input-sm" \n                       sign-laydate fixed="true" \n                       ng-model="$ctrl.payment_date" required>\n            </td>\n            <td>\n                <input type="number" class="form-control input-sm hide-spin" ng-model="$ctrl.payment_amount" required disabled-negative>\n            </td>\n            <td>\n                <input type="text" class="form-control input-sm" ng-model="$ctrl.memo">\n            </td>\n        </tr>\n        </tbody>\n    </table>\n</div>\n                ',
            controller: ['$element', function ($element) {
                var $ctrl = this;

                $ctrl.$start = function ($defer, data, title) {
                    $ctrl.memo = data.memo;
                    $ctrl.payment_date = data.payment_date;
                    $ctrl.payment_amount = data.payment_amount;

                    commonContainer.modal(title, $element, function (id) {
                        if (!$ctrl.payment_date || !$ctrl.payment_amount) {
                            $element.addClass('ng-submitted');
                            return layer.alert('表单有未完成项');
                        }
                        $defer.resolve({
                            payment_amount: $ctrl.payment_amount,
                            payment_date: $ctrl.payment_date,
                            memo: $ctrl.memo
                        });
                        layer.close(id);
                    }, {cancel: $defer.reject, btn2: $defer.reject, area: ['700px', '200px']});
                };
            }]
        });
}());