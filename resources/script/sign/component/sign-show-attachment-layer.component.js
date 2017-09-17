/**
 * Created by baihuibo on 2017/5/10.
 */
(function () {
    var template = '<div class="ibox-content">\n    <div class="row">\n        <div class="file-box animated pulse" ng-repeat="item in $ctrl.enclosureList">\n            <div class="file_img">\n                <div class="file-preview-frame" data-fileindex="0" data-template="image">\n                <div class="kv-file-content">\n                    <img ng-src="{{::item.filePath}}" layer-src="{{::item.filePath}}" alt="{{::item.fileName}}">\n                </div>\n                <div class="file-thumbnail-footer">\n                  <div class="file-footer-caption" title="{{::item.fileName}}">\n                    {{::item.fileName}}\n                  </div>\n                <div>\n                    <a href="{{::item.filePath}}" download>下载</a>\n                </div>\n                </div>\n              </div>\n            </div>\n         </div>\n    </div>\n</div>';
    angular.module('sign-common')
    /**
     * @name signShowAttachmentLayer 查看附件对话框
     * @description 通过此组件可以方便的查看附件信息
     * @example
     * <example>
     *     <file name="test.js">
     *         function Ctrl(signUtil) {
     *             signUtil.openLayer('signShowAttachmentLayer' , enclosureList)
     *        }
     *     </file>
     * </example>
     */
        .component('signShowAttachmentLayer', {
            template: template,
            controller: ['$element', 'signUtil', function ($element, signUtil) {
                var $ctrl = this;

                var uuid = signUtil.uuid('show-layer');
                $element.attr('id', uuid);

                $ctrl.$start = function ($defer, enclosureList, title) {
                    $ctrl.enclosureList = enclosureList;

                    setTimeout(function () {
                        layer.photos({
                            photos: '#' + uuid + ' .kv-file-content',
                            anim: 0
                        });
                    }, 100);

                    commonContainer.modal(title, $element, function (id) {
                        $defer.resolve();
                        layer.close(id);
                    }, {
                        cancel: $defer.reject,
                        area: ['1060px', '80%'],
                        overflow: 'auto',
                        btns: ['关闭']
                    });
                };
            }]
        })

        /**
         * @name signDeliverAttachmentLayer 签收附件
         */
        .component('signDeliverAttachmentLayer', {
            template: template,
            controller: ['$element', 'signUtil', function ($element, signUtil) {
                var $ctrl = this;

                var uuid = signUtil.uuid('show-layer');
                $element.attr('id', uuid);

                $ctrl.$start = function ($defer, enclosureList, title, signDetailService) {
                    $ctrl.enclosureList = enclosureList;

                    setTimeout(function () {
                        layer.photos({
                            photos: '#' + uuid + ' .kv-file-content',
                            anim: 0
                        });
                    }, 100);

                    commonContainer.modal(title, $element, function (id) {
                        $defer.resolve();
                        layer.close(id);
                    }, {
                        cancel: $defer.reject,
                        btn2: function (id) {
                            signUtil.openLayer('signAttachmentRejectLayer')
                                .then(function (data) {
                                    $defer.reject(data);
                                    layer.close(id);
                                }, $.noop);
                            return false;
                        },
                        area: ['80%', '80%'],
                        overflow: 'auto',
                        btns: ['签收', '驳回', '关闭']
                    });
                };


            }]
        })

        .component('signAttachmentRejectLayer', {
            template: '<div class="ibox-content">\n    <div class="form-horizontal">\n        <div class="form-group">\n            <label class="col-sm-2 control-label required">驳回原因：</label>\n            <div class="col-sm-9">\n                <select chosen class="form-control" required ng-model="$ctrl.rejectType">\n                    <option value="">请选择</option>\n                    <option value="1">已收</option>\n                    <option value="2">未收</option>\n                    <option value="3">缺件</option>\n                </select>\n            </div>\n        </div>\n        <div class="hr-line-dashed"></div>\n        <div class="form-group">\n            <label class="col-sm-2 control-label"> 详细说明：</label>\n            <div class="col-sm-9">\n                <textarea rows="3" class="form-control" ng-model="$ctrl.rejectReason" maxlength="100"></textarea>\n                <span ng-if="$ctrl.rejectReason>=90" class="help-block text-right text-danger">\n                    还可以输入 {{100 - ($ctrl.rejectReason || \'\').length}} 个字\n                </span>\n   <span  ng-if="$ctrl.rejectReason<90" class="help-block text-right" style="color:#1d3872;">\n                    还可以输入 {{100 - ($ctrl.rejectReason || \'\').length}} 个字\n                </span>\n         </div>\n        </div>\n    </div>\n</div>',
            controller: ['$element', function ($element) {
                var $ctrl = this;
                $ctrl.$start = function ($defer) {
                    commonContainer.modal('驳回原因', $element, function (id) {
                        if (!$ctrl.rejectType) {
                            return layer.alert('请选择驳回原因');
                        }
                        $defer.resolve({
                            rejectType: $ctrl.rejectType,
                            rejectReason: $ctrl.rejectReason || ''
                        });
                        layer.close(id);
                    }, {
                        cancel: $defer.reject,
                        area: ['600px', '300px'],
                        overflow: 'auto',
                        btns: ['驳回', '取消']
                    });
                };
            }]
        })

        .component('signRejectReasonLayer', {
            template: '<div class="ibox-content">\n    <div class="form-horizontal">\n        <div class="form-group">\n            <label class="col-sm-2 control-label">操作人：</label>\n            <div class="col-sm-4">\n                <div class="form-control-static">\n                    <person-show person-id="$ctrl.data.operateUserId" \n                                 person-name="$ctrl.data.operateUserName">\n                    </person-show>\n                </div>\n            </div>\n            <label class="col-sm-2 control-label">操作时间：</label>\n            <div class="col-sm-4">\n                <div class="form-control-static">{{$ctrl.data.operateTime}}</div>\n            </div>\n        </div>\n        <div class="form-group">\n            <label class="col-sm-2 control-label">驳回原因：</label>\n            <div class="col-sm-9">\n                <div class="form-control-static">{{$ctrl.data.rejectTypeValue}}</div>\n            </div>\n        </div>\n        <div class="hr-line-dashed"></div>\n        <div class="form-group">\n            <label class="col-sm-2 control-label"> 详细说明：</label>\n            <div class="col-sm-9">\n                <div class="form-control-static">{{$ctrl.data.rejectReason}}</div>\n            </div>\n        </div>\n    </div>\n</div>',
            controller: ['$element', function ($element) {
                var $ctrl = this;
                $ctrl.$start = function ($defer, data) {
                    $ctrl.data = data;
                    commonContainer.modal('驳回原因', $element, function (id) {
                        $defer.resolve();
                        layer.close(id);
                    }, {
                        area: ['600px', '300px'],
                        overflow: 'auto',
                        btns: ['关闭']
                    });
                };
            }]
        })

        /**
         * 图片预览
         */
        .directive('preview', function () {
            return {
                scope: {preview: '='},
                link: function (scope, el, attr) {
                    scope.$watch('preview', function (preview) {
                        if (typeof preview === 'string') {
                            el.prop('src', preview);
                        } else {
                            el.prop('src', URL.createObjectURL(preview));
                        }
                    });
                }
            }
        });
}());