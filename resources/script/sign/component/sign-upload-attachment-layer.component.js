/**
 * Created by baihuibo on 2017/5/10.
 */
(function () {
    angular.module('sign-common')
    /**
     * @name signUploadAttachmentLayer 上传附件
     * @example
     * <example>
     *     <file name="test.js">
     *         function Ctrl(signUtil) {
     *             signUtil.openLayer('signUploadAttachmentLayer' , data, conid, title, type, signDetailService)
     *                 .then(function(data) {
     *                      data.enclosureList
     *                      data.memo
     *                      data.enclosureType
     *                 } , $.noop)
     *        }
     *     </file>
     * </example>
     */
        .component('signUploadAttachmentLayer', {
            template: '<div class="ibox-content">\n    <div class="form-horizontal">\n        <div class="form-group">\n            <div class="col-sm-8">\n                <label class="col-sm-2 control-label required">附件类型：</label>\n                <div class="col-sm-10">\n                    <select style="width: 200px;" chosen required ng-model="$ctrl.enclosureType"\n                            ng-options="item.key as item.value for item in $ctrl.enclosureTypes"\n                            ng-disabled="$ctrl.modify">\n                        <option value="">请选择</option>\n                    </select>\n                </div>\n            </div>\n        </div>\n        <div class="hr-line-dashed"></div>\n        <div class="form-group">\n            <div class="col-sm-8">\n                <label class="col-sm-2 control-label"> 备注：</label>\n                <div class="col-sm-10">\n                    <textarea rows="3" class="form-control" ng-model="$ctrl.memo" maxlength="100"></textarea>\n  <div ng-if="$ctrl.memo.length<90||$ctrl.memo.length==Null" class="text-right help-block" style="color:#1d3872;">还可以输入：{{100 - $ctrl.memo.length}} 字  </div>\n  <div  ng-if="$ctrl.memo.length>=90" class="text-right help-block text-danger">还可以输入：{{100 - $ctrl.memo.length}} 字  </div> \n             </div>\n            </div>\n        </div>\n        <div class="hr-line-dashed"></div>\n        <div class="form-group">\n            <div class="col-sm-8">\n                <label class="col-sm-2 control-label"><span class="text-danger">*</span>附件：</label>\n                <div class="col-sm-10" layout-padding>\n                    <div class="input-group file-caption-main">\n                        <div class="input-group-btn">\n                            <div class="btn btn-primary btn-file">\n                                <i class="glyphicon glyphicon-folder-open"></i>&nbsp;\n                                <span class="hidden-xs">选择文件</span>\n                                <input type="file" multiple>\n                            </div>\n                            <span style="font-size: 12px;display: inline-block;"\n                                  ng-if="!$ctrl.enclosureList.length"\n                                  layout-padding>\n                                未选择任何文件\n                            </span>\n                            <span style="font-size: 12px;display: inline-block;"\n                                  ng-if="$ctrl.enclosureList.length"\n                                  layout-padding>\n                                已选择 {{$ctrl.enclosureList.length}} 个文件\n                            </span>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div layout-padding>\n        <h5 class="page-header text-success">已选择的附件 <span class="small text-info"></span></h5>\n        <div class="row">\n            <div class="col-xs-4" ng-repeat="enclosure in $ctrl.enclosureList">\n                <div class="thumbnail">\n                    <img preview="enclosure.filePath" style="height: 150px;">\n                    <h4 class="text-nowrap text-overflow" title="{{::enclosure.filePath.name || enclosure.filePath}}">\n                        {{::enclosure.filePath.name || enclosure.filePath}}\n                    </h4>\n                    <div class="text-center">\n                        <a href="#" class="btn btn-success btn-xs" role="button"\n                           ng-click="$ctrl.removeFile($index)">删除</a>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>',
            controller: ['$element', 'signService', '$scope', 'signUtil', '$q', function ($element, signService, $scope, signUtil, $q) {
                var $ctrl = this;

                $ctrl.enclosureList = [];
                $ctrl.memo = '';

                $ctrl.$start = function ($defer, data, conid, title, type, signDetailService) {
                    $ctrl.enclosureType = data.enclosureType ? data.enclosureType + '' : "";
                    $ctrl.enclosureList = data.enclosureList || [];
                    $ctrl.memo = data.memo;
                    $ctrl.modify = !!$ctrl.enclosureType && type === 1;
                    signService.getEnclosureType(conid, type).then(function (result) {
                        $ctrl.enclosureTypes = result.data;
                    });

                    commonContainer.modal(title, $element, function (id) {
                        if (!$ctrl.enclosureType) {
                            return layer.alert('请选择附件类型');
                        }
                        if (!$ctrl.enclosureList.length) {
                            return layer.alert('请选择附件');
                        }

                        commonContainer.showLoading();
                        // 1 远程删除文件先
                        $q.all(
                            remoteDel.map(function (id) {
                                return signDetailService.removeEnclosureFile(id);
                            })
                        ).then(function () {
                            // 2 上传需要上传的文件
                            var files = $ctrl.enclosureList.filter(function (obj) {
                                // 原生文件
                                return obj.filePath && obj.filePath.size && obj.filePath.name
                            }).map(function (obj) {
                                return obj.filePath;
                            });
                            if (files.length) {// 上传文件
                                return signService.uploadFiles(files);
                            }
                            return $q.when({code: 0, data: []});
                        }).then(function (result) {
                            commonContainer.hideLoading();
                            if (result.code !== 0) {
                                return layer.alert(result.msg);
                            }

                            // 4 返回数据
                            var oldFiles = $ctrl.enclosureList.filter(function (obj) {
                                return obj.filePath && obj.fileName;
                            });

                            $defer.resolve({
                                enclosureList: [].concat(result.data, oldFiles),
                                memo: $ctrl.memo,
                                enclosureType: $ctrl.enclosureType
                            });
                            layer.close(id);
                        }).catch(function () {
                            commonContainer.hideLoading();
                        });
                    }, {cancel: $defer.reject, btn2: $defer.reject, area: ['800px', '400px'], overflow: 'auto'});
                };

                $ctrl.exts = 'gif,jpg,png,jpeg,bmp';
                // 图片格式限制
                var fileAccept = $ctrl.exts.split(',').map(function (ext) {
                    return 'image/' + ext;
                }).join(', ');

                $ctrl.$onInit = function () {
                    var file = $element.find(':file').get(0);
                    file.accept = fileAccept;
                };

                // 选择文件
                $element.on('change', 'input', function () {
                    angular.forEach(this.files, function (file) {
                        var f = $ctrl.enclosureList.find(function (item) {
                            return item.filePath === file;
                        });
                        if (!f) {
                            $ctrl.enclosureList.push({filePath: file});
                        }
                    });
                    this.value = '';
                    $scope.$digest();
                });

                // 要远程删除的文件
                var remoteDel = [];
                $ctrl.removeFile = function (index) {
                    var obj = $ctrl.enclosureList[index];
                    signUtil.confirm('确定删除此附件？').then(function () {
                        if (obj.enclosureId) {// 服务器文件
                            remoteDel.push(obj.enclosureId);
                        }
                        $ctrl.enclosureList.splice(index, 1);// 直接删除
                    }, $.noop);
                }
            }]
        });
}());