/**
 * Created by baihuibo on 2017/5/10.
 */
(function () {

    angular.module('sign-common')
    /**
     * 选择人的组件
     * @name signChoosePerson
     * @description 通过它可以绑定选择人的组件
     * @example
     * <example>
     *     <file name="test.html">
     *         <sign-choose-person ng-model="$ctrl.personId"></sign-choose-person>
     *     </file>
     * </example>
     */
        .component('signChoosePerson', {
            template: '<div class="input-group input-group-sm">\n    <input type="text" id="{{::$ctrl.id}}" name="{{::$ctrl.name}}" class="form-control" autocomplete="off">\n    <div class="input-group-btn">\n        <button type="button" class="btn btn-white dropdown-toggle">\n            <span class="glyphicon glyphicon-search search-caret"></span>\n        </button>\n        <ul class="dropdown-menu dropdown-menu-right"></ul>\n    </div>\n</div>\n    ',
            require: {
                ngModel: '?ngModel'
            },
            bindings: {
            	value: '<' , 
            	name:'@',
            	id:'@',
                personName: '=?',
                align: '@'
            },
            controller: ['$element', 'signUtil', function ($element, signUtil) {
                if (!$.fn.bsSuggest) {
                    throw new Error('使用 sign-choose-person 组件需要加载 #set($plugins = ["autoSearch"])');
                }
                var $ctrl = this, inputControl, ngModel;

                $ctrl.$onInit = function () {
                    ngModel = $ctrl.ngModel;
                    inputControl = $element.find('.form-control');
                    searchContainer.searchUserListByComp(inputControl, true, $ctrl.align);
                    if (ngModel) {
                        searchContainer.searchUserListByComp.ajaxPromise.then(function (result) {
                            signUtil.getViewValue(ngModel).then(function (viewValue) {
                                var userId = Number(viewValue), findItem;

                                // 如果只有人的id，则手动去查找
                                if (!$ctrl.personName && userId) {
                                    findItem = result.data.find(function (item) {
                                        return item.userId === userId;
                                    });
                                    if (findItem) {
                                        $ctrl.personName = findItem.userName;
                                    }
                                }

                                // 存在id和人名的时候，统一赋值
                                if (userId && $ctrl.personName) {
                                    inputControl.val($ctrl.personName).attr('data-id', userId);
                                }
                            });
                        }).then(function () {
                            inputControl.on('onSetSelectValue', function (e, result) {
                                $ctrl.personName = result.key;
                                ngModel.$setViewValue(result.id);
                                ngModel.$validate();
                            }).on('onUnsetSelectValue', function () {
                                $ctrl.personName = '';
                                ngModel.$setViewValue('');
                                ngModel.$validate();
                            });
                        });
                    }
                };

                $ctrl.$onDestroy = function () {
                    inputControl.off('*').bsSuggest("destroy");
                };
            }]
        });
}());