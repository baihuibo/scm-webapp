/**
 * Created by baihuibo on 2017/5/10.
 */
(function () {
    angular.module('sign-common')
    /**
     * @name commentLayer 审批意见组件
     * @description 通过此组件用来填写审批意见信息
     * @example
     * <example>
     *     <file name="test.js">
     *         function Ctrl(signUtil) {
     *             signUtil.openLayer('commentLayer')
     *                 .then(function(data) {
     *
     *                 } , $.noop)
     *        }
     *     </file>
     * </example>
     */
        .component('commentLayer', {
            template: '<div class="ibox-content">\n    <form class="form-horizontal">\n        <div class="form-group">\n            <label class="col-sm-2 control-label">审批意见：</label>\n            <div class="col-sm-9">\n                <textarea rows="8" class="form-control"\n                          ng-model="$ctrl.comment"\n                          maxlength="500"></textarea>\n                <div ng-if="$ctrl.comment.length>=490" class="help-block text-right text-danger">\n                    还可以输入{{500 - ($ctrl.comment.length || 0)}}字\n                </div>\n     <div ng-if="$ctrl.comment.length<490" class="help-block text-right" style="color:#1d3872;">\n                    还可以输入{{500 - ($ctrl.comment.length || 0)}}字\n                </div>\n        </div>\n        </div>\n    </form>\n</div>',
            controller: ['$element', function ($element) {
                var $ctrl = this;

                $ctrl.$start = function ($defer) {
                    $ctrl.data = {};

                    commonContainer.modal('审批意见', $element, function (id) {
                        if (!$ctrl.comment) {
                            return layer.alert("请输入审批意见");
                        }
                        $defer.resolve($ctrl.comment);
                        layer.close(id);
                    }, {cancel: $defer.reject, btn2: $defer.reject, area: ['800px', '400px'], overflow: 'auto'});
                };
            }]
        });
}());