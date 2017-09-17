/**
 * Created by baihuibo on 2017/5/10.
 */
(function () {
    angular.module('sign-common')
    /**
     * @name signAddPersonLayer 添加人信息
     * @description 通过此组件可以方便的新增或者修改人的信息
     * @example
     * <example>
     *     <file name="test.js">
     *         function Ctrl(signUtil) {
     *             signUtil.openLayer('signAddPersonLayer' , {} , '新增/编辑 xx人')
     *                 .then(function(result) {
     *                      console.log(result.full_name);
     *                      console.log(result.idcard_no);
     *                      console.log(result.idcard_type_cd);
     *                      console.log(result.phone_number);
     *                 } , $.noop)
     *        }
     *     </file>
     * </example>
     */
        .component('signAddPersonLayer', {
            template: '<div class="ibox-content">\n    <table class="table table-hover table-striped">\n        <thead>\n        <tr>\n            <th class="required" style="width: 150px;">姓名</th>\n            <th class="required" style="width: 150px;">证件类型</th>\n            <th class="required" style="width: 150px;">证件号码</th>\n            <th class="required">联系方式</th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr>\n            <td>\n                <input type="text" required ng-model="$ctrl.full_name" class="form-control">\n            </td>\n            <td>\n                <sign-card-type required ng-model="$ctrl.idcard_type_cd"></sign-card-type>\n            </td>\n            <td>\n                <input type="text" required ng-model="$ctrl.idcard_no"\n                       card-type="$ctrl.idcard_type_cd" class="form-control">\n            </td>\n            <td>\n                <sign-phone-number-btn required ng-model="$ctrl.phone_number">\n                </sign-phone-number-btn>\n            </td>\n        </tr>\n        </tbody>\n    </table>\n</div>\n                ',
            controller: ['$element', 'signUtil', function ($element, signUtil) {
                var $ctrl = this;

                $ctrl.$start = function ($defer, data, title) {
                    $ctrl.full_name = data.full_name;
                    $ctrl.idcard_no = data.idcard_no;
                    $ctrl.idcard_type_cd = Number(data.idcard_type_cd || 1);
                    $ctrl.phone_number = data.phone_number;

                    commonContainer.modal(title, $element, function (id) {
                        if (!$ctrl.full_name || !$ctrl.idcard_no || !$ctrl.idcard_type_cd || !$ctrl.phone_number) {
                            $element.addClass('ng-submitted');
                            return layer.alert('表单有未完成项');
                        }

                        if (+$ctrl.idcard_type_cd === 1 && !signUtil.validate.idCardNumber($ctrl.idcard_no)) {
                            return layer.alert('请输入正确的身份证号码');
                        }

                        $defer.resolve({
                            full_name: $ctrl.full_name,
                            idcard_no: $ctrl.idcard_no,
                            idcard_type_cd: $ctrl.idcard_type_cd,
                            phone_number: $ctrl.phone_number,
                        });
                        layer.close(id);
                    }, {cancel: $defer.reject, btn2: $defer.reject, area: ['800px', '350px']});
                };
            }]
        });
}());