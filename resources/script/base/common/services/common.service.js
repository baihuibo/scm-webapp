/**
 * 公共服务
 * commonService.getTypes(keyCode) 用来获取字典表内容
 *
 * commonService.getCurrentUserInfo() 用来获取当前登录用户信息
 *
 * commonService.uploadFiles(files)  用来批量上传文件
 *
 * commonService.findPermission(val)  用来判断用户权限
 */
angular.module('common-module')
    .service('commonService', function ($http) {
        // 获取类型列表
        this.getTypes = function getTypes(keyCode) {
            return $http.get(basePath + '/custom/common/sys_cfg_key_select.htm', {
                params: {keyCode: keyCode, compId: 2},
                cache: true
            }).then(function (response) {
                var result = response.data;
                // if (result.data) {
                //     result.data.forEach(function (item) {
                //         item.valueCode = +item.valueCode;
                //     });
                // }
                return result;
            });
        };

        // 获取当前登陆用户信息
        this.getCurrentUserInfo = function () {
            return $http.get(basePath + '/sign/lease/getCurrentUser', {
                cache: true
            }).then(function (response) {
                return response.data;
            });
        };

        /**
         * 多文件上传
         * @param files 文件列表
         */
        this.uploadFiles = function (files) {
            return $http.post(basePath + '/custom/common/multiFileUpload', {}, {
                headers: {'Content-Type': undefined},
                transformRequest: function () {
                    var formData = new FormData();
                    angular.forEach(files, function (file) {
                        formData.append('files', file);
                    });
                    return formData;
                }
            }).then(function (response) {
                return response.data;
            });
        };

        /**
         * 判断是否有某权限
         * @param key
         * @return {*}
         */
        this.findPermission = function (key) {
            return $http.get(basePath + "/custom/common/checkPermission", {
                params: {key: key},
                cache: true
            }).then(function (response) {
                return response.data;
            });
        };
    });