/**
 * 表单
 */
angular.module('common-module')
    .directive('form', function () {
        return {
            scope: {
                ngSubmit: '&'
            },
            require: 'form',
            link: function ($scope, el, attr, formCtrl) {
                el.prop('noValidate', true);// 禁止默认校验行为

                // 这里off移除掉angular原生submit事件
                el.off('submit').on('submit', function (e) {
                    e.preventDefault();// 无论如何不允许真正触发原生提交
                    if (formCtrl.$invalid) {
                        alert('表单有未完成项');
                        return false;
                    } else {
                        $scope.$applyAsync(function () {
                            $scope.ngSubmit({$event: e});
                        });
                    }
                });
            }
        }
    });