/**
 * Created by baihuibo on 2017/5/10.
 */
(function () {
    angular.module('sign-common')
    /**
     * @name rejectLayer 驳回组件
     * @description 通过此组件用来填写驳回信息
     * @example
     * <example>
     *     <file name="test.js">
     *         function Ctrl(signUtil) {
     *             signUtil.openLayer('rejectLayer')
     *                 .then(function(data) {
     *
     *                 } , $.noop)
     *        }
     *     </file>
     * </example>
     */
        .component('rejectLayer', {
            template: '<div class="ibox-content">\n    <form class="form-horizontal">\n        <div class="form-group">\n            <label class="col-sm-2 control-label required">驳回原因：</label>\n            <div class="col-sm-8">\n                <select style="width: 585px;" chosen data-placeholder="请选择"\n                        ng-model="$ctrl.data.conRejectCause" required\n                        ng-options="item.valueCode as item.valueName for item in $ctrl.conRejectCause">\n                    <option value="">请选择</option>\n                </select>\n            </div>\n        </div>\n        <div class="form-group">\n            <label class="col-sm-2 control-label"\n                   ng-class="{required : $ctrl.data.conRejectCause == 3 }"\n                >备注：</label>\n            <div class="col-sm-9">\n                <textarea rows="8" class="form-control"\n                          ng-model="$ctrl.data.comment"\n                          ng-required="$ctrl.data.conRejectCause == 3"\n                          maxlength="100"></textarea>\n                <div ng-if="$ctrl.data.comment.length>=90" class="text-right help-block text-danger">\n                    还可以输入{{100 - ($ctrl.data.comment.length || 0)}}字\n                </div>\n     <div ng-if="$ctrl.data.comment.length<90" class="text-right help-block" style="color:#1d3872;">\n                    还可以输入{{100 - ($ctrl.data.comment.length || 0)}}字\n                </div>\n       </div>\n        </div>\n    </form>\n</div>',
            controller: ['$element', 'signService', function ($element, signService) {
                var $ctrl = this;

                signService.getTypes('conRejectCause').then(function (result) {
                    if (result.code !== 0) {
                        return layer.alert(result.msg);
                    }
                    $ctrl.conRejectCause = result.data;
                });

                $ctrl.$start = function ($defer) {
                    $ctrl.data = {};

                    commonContainer.modal('驳回原因', $element, function (id) {
                        if ($ctrl.data.conRejectCause !== 0 && !$ctrl.data.conRejectCause) {
                            return layer.alert('请选择驳回原因');
                        }
                        if ($ctrl.data.conRejectCause == 3 && !$ctrl.data.comment) {
                            return layer.alert("其它驳回原因，请填写备注");
                        }
                        $defer.resolve($ctrl.data);
                        layer.close(id);
                    }, {cancel: $defer.reject, btn2: $defer.reject, area: ['800px', '400px'], overflow: 'auto'});
                };
            }]
        });
}());