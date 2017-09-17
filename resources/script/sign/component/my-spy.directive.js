/**
 * Created by baihuibo on 2017/5/10.
 */
(function () {
    angular.module('sign-common')
    /**
     * @name my-spy-affix 定位组件
     * @example
     * <example>
     *     <file name="test.html">
     *      <div my-spy-affix offset-top="30" offset-bottom="30"></div>
     *     </file>
     * </example>
     */
        .directive('mySpyAffix', [function () {
            return {
                scope: {
                    offsetTop: '=?',
                    offsetBottom: '=?'
                },
                link: function ($scope, el, attr) { // link 关联 =》  dom 和 js 行为 关联
                    var parent = el.parent();
                    var node = parent.get(0);

                    function scrollFn() {
                        var rect = node.getBoundingClientRect();
                        if (rect.top <= ($scope.offsetTop || 0)) {
                            el.addClass('affix');
                            el.css('top', $scope.offsetTop || 0);
                        } else {
                            el.removeClass('affix');
                            el.css('top', 'auto');
                        }
                    }

                    $(document).on('scroll', scrollFn);
                    $scope.$on('$destroy', function () {
                        $(document).off('scroll', scrollFn);
                    })
                }
            };
        }])
        .directive('mySpyScroll', [function () {
            return {
                link: function ($scope, el) { // link 关联 =》  dom 和 js 行为 关联
                    var list = el.find('a[href^="#"]');// 查找所有 锚点a 标签
                    var ii = list.length;
                    function scrollFn() {
                        for (var i = 0; i < ii; i++) {
                            var current = list[i];
                            var target = $(current.hash).get(0);// target
                            var rect = target.getBoundingClientRect();
                            if (rect.top < 50/* || rect.bottom < 50*/) {
                                list.removeClass('active');
                                $(current).addClass('active');
                            } else if (rect.top > 50) {
                                $(current).removeClass('active');
                            }
                        }
                    }

                    $(document).on('scroll', scrollFn);
                    $scope.$on('$destroy', function () {
                        $(document).off('scroll', scrollFn);
                    })
                }
            };
        }]);
}());