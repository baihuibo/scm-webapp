/**
 * Created by baihuibo on 2017/5/10.
 */
(function () {
    angular.module('sign-common')
    /**
     * @name paging   分页组件
     * @description 通过此组件可以方便的使用 angular 方式分页查询
     * @param 参数配置列表
     *   pagingConfig.method  请求方式，支持 post，get
     *   pagingConfig.url  请求地址
     *   pagingConfig.pageSize  每页数据条数，默认10
     *   pagingConfig.pageList   每页分页支持数据，默认 [10,20,50]
     *   pagingConfig.pagingSize  分页器显示数量，默认 5
     *   pagingConfig.responseHandler  请求数据处理回调，作用和 bootstrapTable 的一致，
     *                                 默认支持 data.rows,data.totalcount格式的返回数据，
     *                                 可自行实现,但必须返回对象包含 {rows,total} 俩个属性
     * @example
     * <example>
     *     <file name="test.js">
     *          function MainCtrl() {
     *              var $ctrl = this;
     *              $ctrl.pagingConfig = {
     *                  // method : 'post',
     *                  //responseHandler : function(result) {
     *                  //    return {rows : result.data.rows , total : result.totalcount}
     *                  //},
     *                  url : basePath + 'any data path'
     *              };
     *              $ctrl.query = function() {
     *                  var params = {};// 查询参数
     *                  $ctrl.pagingConfig.queryList(params);// 开始分页查询
     *              }
     *          }
     *     </file>
     *     <file name="test.html">
     *         <form ng-submit="$ctrl.query()">
     *             any where
     *             <button type="submit">查询</button>
     *         </form>
     *          <table>
     *              <tbody>
     *                  <tr ng-repeat="item in $ctrl.queryResult">
     *                      <td>any</td>
     *                      <td>any</td>
     *                      <td>any</td>
     *                      <td>any</td>
     *                   </tr>
     *                   <tr ng-if="$ctrl.queryResult.length == 0">
     *                       <td colspan="4">没有找到匹配的记录</td>
     *                   </tr>
     *              </tbody>
     *          </table>
     *          <paging config="$ctrl.pagingConfig" list="$ctrl.queryResult"></paging>
     *     </file>
     * </example>
     */
        .component('paging', {
            template: '<div class="fixed-table-pagination clearfix" ng-if="$ctrl.total > 0">\n    <div class="pull-left pagination-detail">\n        <span class="pagination-info">\n            显示第 {{ $ctrl.getDataRange() }} 到第 {{($ctrl.getDataRange(true))}} 条记录，总共 {{$ctrl.total}} 条记录\n        </span>\n        <span class="page-list">\n            每页显示 \n            <span class="btn-group dropup">\n                <button type="button" class="btn btn-default  btn-outline dropdown-toggle"\n                        data-toggle="dropdown" aria-expanded="false">\n                    <span class="page-size">{{$ctrl.config.pageSize}}</span>\n                    <span class="caret"></span>\n                </button>\n                <ul class="dropdown-menu" role="menu">\n                    <li ng-repeat="size in $ctrl.config.pageList"\n                        ng-class="{active : size === $ctrl.config.pageSize}"\n                        ng-click="$ctrl.config.pageSize = size">\n                        <a href="javascript:">{{size}}</a>\n                    </li>\n                </ul>\n            </span> \n            条记录\n        </span>\n    </div>\n    <div class="pull-right pagination">\n        <ul class="pagination pagination-outline">\n            <li class="page-first" ng-click="$ctrl.goToPage(1)"><a href="javascript:">«</a></li>\n            <li class="page-pre" ng-click="$ctrl.goToPage($ctrl.currentPage - 1)"><a href="javascript:">‹</a></li>\n            \n            <li class="page-number" \n                ng-repeat="item in $ctrl.pageItems"\n                ng-class="{active : $ctrl.currentPage == item}"\n                ng-click="$ctrl.goToPage(item)">\n                <a href="javascript:">{{item}}</a>\n            </li>\n            \n            <li class="page-next" ng-click="$ctrl.goToPage($ctrl.currentPage + 1)"><a href="javascript:">›</a></li>\n            <li class="page-last" ng-click="$ctrl.goToPage($ctrl.totalPage)"><a href="javascript:">»</a></li>\n        </ul>\n    </div>\n</div>',
            bindings: {
                config: '=?',
                list: '=?'
            },
            controller: ['$http', function ($http) {
                var $ctrl = this;
                // 初始化
                $ctrl.$onInit = function () {
                    $ctrl.config = _.defaults($ctrl.config || {}, {
                        method: 'post', // 请求方式
                        url: '', // 资源地址
                        pageSize: 10, // 每页多少条
                        pageList: [10, 20, 50], // 支持每页数量
                        pagingSize: 5, // 分页数量
                        responseHandler: $.noop
                    });

                    $ctrl.config.queryList = $ctrl.queryList;
                };

                // 数据查询
                $ctrl.queryList = function (params, pageIndex) {
                    params = params || $ctrl.params || {};
                    params.pagesize = params.pageSize = $ctrl.config.pageSize;
                    params.pageindex = params.pageIndex = typeof pageIndex === 'undefined' ? 1 : pageIndex;
                    $ctrl.params = params;// 缓存参数

                    var promise;
                    if ($ctrl.config.method === 'post') {
                        promise = $http.post($ctrl.config.url, params);
                    } else {
                        promise = $http.get($ctrl.config.url, {params: params});
                    }
                    promise.then(function (response) {
                        return response.data;
                    }).then(function (result) {
                        var data;
                        if (typeof $ctrl.config.responseHandler === 'function') {
                            data = $ctrl.config.responseHandler(result);
                        }
                        if (data) {
                            return data;
                        }
                        data = result.data || {};
                        return {"rows": data.rows, "total": parseInt(data.totalcount)};
                    }).then(function (data) {
                        /**
                         * @property data.total  总数据
                         * @property data.rows  列表
                         */
                        $ctrl.list = data.rows || []; // 数据
                        $ctrl.total = data.total || 0; // 总条数
                        $ctrl.currentPage = params.pageindex; // 当前页数
                        $ctrl.totalPage = Math.ceil($ctrl.total / $ctrl.config.pageSize); // 总页数
                        $ctrl.pageItems = initPageList($ctrl.totalPage, $ctrl.currentPage, $ctrl.config.pagingSize, 1);
                    });
                };

                $ctrl.goToPage = function (page) {
                    if (page < 1) {
                        page = 1;
                    } else if (page > $ctrl.totalPage) {
                        page = $ctrl.totalPage;
                    }
                    if (page !== $ctrl.currentPage) {// 不重复查询页面
                        $ctrl.queryList($ctrl.params, page);
                    }
                };

                //读取显示范围
                $ctrl.getDataRange = function (to) {
                    var currentPage = $ctrl.currentPage - 1,
                        limit = $ctrl.config.pageSize,
                        total = $ctrl.total;
                    if (to) {
                        var res = currentPage * limit + limit;
                        return res > total ? total : res; //结束
                    } else {//from
                        return currentPage * limit + 1; //开始
                    }
                };
            }]
        });

    function initPageList(totalPage, currentPage, pagingSize, offset) {
        var startFix, endFix, list = [];
        offset = offset || 0;
        startFix = endFix = Math.floor(pagingSize / 2);
        var test = startFix * 2 + 1;
        if (test > pagingSize)
            startFix -= 1;
        if (test < pagingSize)
            endFix += 1;
        var _sf = 0, _ef = 0, start = currentPage - startFix, end = endFix + currentPage + 1;
        if (start < 0) {
            _sf = 0 - start;
            start = 0;
        }
        if (end >= totalPage) {
            _ef = end - totalPage;
            end = totalPage;
        }
        start = start - _ef;
        end = end + _sf;
        start = start < 0 ? 0 : start;
        end = end > totalPage ? totalPage : end;
        for (; start < end; start++) {
            list.push(start + offset);
        }
        return list;
    }
}());