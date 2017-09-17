/**
 * Created by baihuibo on 2017/4/11.
 */

(function (window) {
    // 联系人下拉框
    searchContainer.searchUserListByComp($('#I_focus_watch_connect'), true);

    /**
     * 添加集中看房
     * @param houseId
     */
    window.focusWatchAdd = focusWatchAdd;
    function focusWatchAdd(houseId, callEvent) {
        var $ctrl = $('#I_focus_watch_add_layer').controller();
        if ($ctrl) {
            $ctrl.start(houseId, callEvent);
        }
    }

    angular.module('focusWatchAdd', ['base'])
        .controller('focusWatchAddCtrl', ['focusWatchAddService', '$timeout', '$scope',
            function (focusWatchAddService, $timeout, $scope) {
                var $ctrl = this;

                var dateTime, endTime, connect;

                $ctrl.start = function (houseId,callEvent) {
                	$ctrl.callEvent = callEvent;
                    dateTime = $('#add_focus_begindate');
                    endTime = $('#add_focus_enddate');
                    connect = $('#I_focus_watch_connect');
                   
                    // 初始化参数
                    $ctrl.houseId = houseId;// 房源id
                    $ctrl.connectid = ''; // 联系人id
                    $ctrl.memo = ''; // 备注
                    dateTime.val('');// 开始时间
                    endTime.val('');// 结束时间
                    commonContainer.showLoading();
                    focusWatchAddService.getUserInfo()
                        .then(function (result) {
                            if (result.code != 0) {
                                throw layer.alert(result.msg);
                            }
                            if (!result.data) {
                                throw layer.alert('查询数据未空');
                            }
                            // 默认处理赋值为当前登录用户
                            connect
                                .attr('data-id', result.data.userid)
                                .val(result.data.username);
                        })
                        .then(function () {
                            commonContainer.hideLoading();
                            focusWatchAddService.openFocusWatchAddModel($ctrl.yes)
                        })
                        .catch(function () {
                            commonContainer.hideLoading();
                        })
                };

                $ctrl.yes = function (layerId) {
                    var begindate = dateTime.val(),
                        enddate = endTime.val(),
                        connectId = connect.attr('data-id'),
                        connectValue = connect.val();

                    if (!begindate || !enddate) {
                        return layer.alert('请选择看房时间');
                    }
                    if (!connectId || !connectValue) {
                        return layer.alert('请选择联系人');
                    }

                    commonContainer.showLoading();
                    focusWatchAddService.saveFocusWatch(
                        $ctrl.houseId, begindate, enddate,
                        connectId, $ctrl.memo).then(function (result) {

                        commonContainer.hideLoading();
                        if (result.code !== 0) {
                            return layer.alert(result.msg);
                        }
                        layer.msg('添加成功！');
                        layer.close(layerId);
                        if ($ctrl.callEvent) {
                            $(document).trigger($ctrl.callEvent); //成功后回调的添加
                        }
                    });
                };
            }])
        .service('focusWatchAddService', ['$http', function ($http) {

            /**
             * 保存集中看房
             * @param houseId
             * @param begindate
             * @param enddate
             * @param connectid
             * @param memo
             * @return {Promise.<{code,msg}>|*}
             */
            this.saveFocusWatch = function (houseId, begindate, enddate, connectid, memo) {
                return $http.post(basePath + '/house/focuswatch/insert.htm', {
                    houseid: houseId,
                    begindate: begindate,
                    enddate: enddate,
                    connectid: connectid,
                    memo: memo || ''
                }).then(function (response) {
                    return response.data;
                })
            };

            // 获取登陆人信息
            this.getUserInfo = function () {
                return $http.get(basePath + '/house/focuswatch/getuserinfo.htm').then(function (response) {
                    return response.data; //{code:0,data:{userid:0,username:0}}
                })
            };
            $("#add_focus_begindate").focus(function(){
            	$("#add_focus_enddate").val('');
            });
            this.openFocusWatchAddModel = function (yes) {
                commonContainer.modal('发起集中看房', $('#I_focus_watch_add_layer'), yes, {
                    overflow: 'auto',
                    area: ['800px', '400px'],
                    btns: ['确定', '关闭'],
                    success:function(){
                    	
                    	
                    	var start = {
                                elem: "#add_focus_begindate",
                                format: "YYYY-MM-DD hh:mm",
                                min: laydate.now(),
                                max:'',
                                istime: true,
                                istoday: false,
                                choose: function (datas) {
                                    end.min = datas;
                                    end.start = datas;
                                    
                                }
                            };
                            var end = {
                                elem: "#add_focus_enddate",
                                format: "YYYY-MM-DD hh:mm",
                                istime: true,
                                istoday: false,
                                min: laydate.now(),
                                choose: function (datas) {
                                    /*start.max = datas*/
                                	if(new Date(datas)<new Date($("#add_focus_begindate").val())){
                        	    		layer.msg('结束日不能早于起始日！');
                        	    		$("#add_focus_enddate").val('');
                        	    	}
                                }
                            };
                            laydate(start);
                            laydate(end);
                    }
                });
            };
        }]);

    angular.bootstrap($('#focus_watch_add'), ['focusWatchAdd']);
}(window));

