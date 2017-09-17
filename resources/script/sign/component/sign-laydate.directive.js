/**
 * Created by baihuibo on 2017/5/10.
 */
(function () {
    angular.module('sign-common')
    /**
     * @ngdoc
     * @name signLaydate 日期选择器
     * @description 使用它，创建日期选择器，可以使用 ng-model 绑定值
     * @example
     * <example>
     *     <file name="test.html">
     *         <input type="text" sign-laydate ng-model="$ctrl.date">
     *     </file>
     * </example>
     */
        .directive('signLaydate', ['signUtil',function (signUtil) {
            var current;
            $(document).on('click', 'a#laydate_clear', function () {
                // 清空按钮
                current && current.$setViewValue('');
            });
            return {
                require: '?ngModel',
                scope: {
                    format: '@?', //日期格式
                    isclear: '=?', //是否显示清空
                    istoday: '=?', //是否显示今天
                    issure: '=?', // 是否显示确认
                    festival: '=?', //是否显示节日
                    min: '=?', //最小日期
                    max: '=?', //最大日期
                    minPlus: '=?',
                    maxReduce: '=?',
                    start: '=?',  //开始日期
                    fixed: '=?', //是否固定在可视区域
                    showcurrent: '=?',// 是否默认显示当前时间
                    maxcurrent: '=?',// 最大值未当前时间
                    mincurrent: '=?',// 最小值未当前时间
                },
                link: function ($scope, el, attr, ngModel) {
                    if (!window.laydate) {
                        throw new Error('sign-laydate 组件需要加载  #set($plugins = ["laydate"]) ');
                    }
                    
                    var idSelector;
                    if(el.attr('id')){
                    	idSelector = '#' + el.attr('id');
                    }else {
                    	var id = signUtil.uuid();
                    	el.attr('id' , id);
                    	idSelector = "#" + id;
                    }

                    setTimeout(function () {
                        el.on('keydown', false);

                        var format = $scope.format || 'YYYY-MM-DD';

                        showcurrent();

                        function showcurrent() {
                            if (ngModel && $scope.showcurrent && !ngModel.$viewValue) {
                                ngModel.$setViewValue(laydate.now(Date.now(), format));
                                ngModel.$render();
                            }
                        }

                        el.on('click', function () {
                            showcurrent();
                            current = ngModel;
                            var max, min;
                            if ($scope.max) {
                                max = $scope.max;
                            }
                            if ($scope.min) {
                                min = $scope.min;
                            }
                            if ($scope.maxcurrent) {
                                max = laydate.now(Date.now(), format);
                            }
                            if ($scope.mincurrent) {
                                min = laydate.now(Date.now(), format);
                            }
                            if ($scope.minPlus && (min || $scope.min)) {
                                min = moment(min || $scope.min, format).add(1, 'days').format(format);
                            }
                            if ($scope.maxReduce && (max || $scope.max)) {
                                max = moment(max || $scope.max, format).add(-1, 'days').format(format);
                            }

                            var isclear, istoday, issure;
                            if ($scope.isclear != false) {
                                isclear = true;
                            }
                            if ($scope.istoday != false) {
                                istoday = true;
                            }
                            if ($scope.issure != false) {
                                issure = true;
                            }

                            laydate({
                                istime: /hh/i.test(format),
                                elem: idSelector,
                                format: format,
                                max: max || void 0,
                                min: min || void 0,
                                showcurrent: !!$scope.showcurrent,
                                fixed: !!$scope.fixed,
                                start: $scope.start,
                                festival: !!$scope.festival,
                                issure: issure,
                                istoday: false,//istoday
                                isclear: isclear,
                                choose: function (dates) {
                                	if(min && moment(dates, format).isBefore(min , 'seconds')){
                                		dates = min;
                                	}
                                    ngModel && ngModel.$setViewValue(dates);
                                }
                            });
                        });
                    });
                }
            };
        }]);
}());