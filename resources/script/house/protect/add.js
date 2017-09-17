/**
 * Created by baihuibo on 2017/4/12.
 */

(function (window) {
    /**
     * 给房源添加一个保护
     * @param houseId 房源id
     */
    window.addProtect = addProtect;
    function addProtect(houseId) {
        var $ctrl = $('#add-protect-layer').controller();

        if ($ctrl) {
            $ctrl.start(houseId);
        }
    }

    angular.module('addProtectModule', ['base'])
        .controller('addProtectCtrl', ['addProtectService', function (addProtectService) {
            var $ctrl = this;

            $ctrl.start = function (houseId) {
                $ctrl.houseId = houseId;// 房源id
                $ctrl.reason = '';// 初始化保护原因
                // 获取保护状态
                commonContainer.showLoading();
                addProtectService.getState().then(function (result) {
                    commonContainer.hideLoading();
                    if (result.code !== 0) {
                        return layer.alert(result.msg);
                    }

                    if (!result.data) {
                        return layer.alert('未查询到数据');
                    }

                    $ctrl.isOutProtect = result.data.status === 0;// 是否已经超出可保护数量

                    $ctrl.data = result.data;
                    addProtectService.openProtectModel($ctrl.yes);
                });
            };

            $ctrl.yes = function (layerId) {
                if ($ctrl.isOutProtect) {// 如果已经超出保护数量，直接关闭对话框
                    return layer.alert('已超过可保护房源数量，无法保护。')
                }

                if (!$ctrl.reason) {
                    return layer.alert('请填写保护原因！');
                }

                if ($ctrl.reason.length > 500) {
                    return layer.alert('保护原因请限制在500个字符以内');
                }

                commonContainer.showLoading();
                addProtectService.addProtect($ctrl.houseId, $ctrl.reason)
                    .then(function (result) {
                        commonContainer.hideLoading();
                        if (result.code !== 0) {
                            return layer.alert(result.msg);
                        }
                        $("#protect").remove();// 移除保护房源按钮
                        layer.msg('添加保护成功！');
                        layer.close(layerId);
                    });
            };

        }])
        .service('addProtectService', ['$http', function ($http) {
            // 获取剩余保护对象
            this.getState = function () {
                // @see http://local.cbs.bacic5i5j.com:8080/sales/swagger-ui.html#!/house-protect-controller/toaddUsingGET
                return $http.get(basePath + "/house/protect/toadd")
                    .then(function (response) {
                        return response.data;
                    });
            };

            // 新增房源保护
            this.addProtect = function (houseId, reason) {
                // @see http://local.cbs.bacic5i5j.com:8080/sales/swagger-ui.html#!/house-protect-controller/addUsingPOST
                return $http.post(basePath + "/house/protect/add", {
                    "houseid": houseId,
                    "reason": reason
                }).then(function (response) {
                    return response.data;
                });
            };

            // 打开添加保护对话框
            this.openProtectModel = function (yes) {
                commonContainer.modal('房源保护添加', $('#add-protect-layer'), yes, {
                    overflow: 'auto',
                    area: ['700px', '400px'],
                    btn: ['确定', '关闭']
                });
            };
        }]);

    $(function () {
        angular.bootstrap($('#add-protect-mods'), ['addProtectModule']);
    });
}(window));