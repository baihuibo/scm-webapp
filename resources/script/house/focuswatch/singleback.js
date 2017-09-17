/**
 * Created by baihuibo on 2017/4/10.
 */
(function (window) {
    /**
     * 空看反馈
     * @param focusid
     */
    window.focusWatchSingleBack = focusWatchSingleBack;
    function focusWatchSingleBack(focusid, callEvent) {
        var $ctrl = $('#F_editsingleback_layer').controller();
        if ($ctrl) {
            $ctrl.start(focusid, callEvent);
        }
    }

    angular.module('focusWatchSingleBack', ['base'])
    //空看返回逻辑处理
        .controller('singleBackCtrl', ['singleService', '$rootScope', '$scope', '$timeout',
            function (singleService, $rootScope, $scope, $timeout) {
                var $ctrl = this;
                $ctrl.focusWatch = {
                    id: null,
                    emptyid: null,
                    houseid: null,
                    begintime: null,
                    endtime: null,
                    conmmunityname: null // 楼盘
                };

                /**
                 * 开始弹出框逻辑
                 * 1. 获取空看详细信息
                 * 2. 判断是否空看返回，是否反馈
                 * 3. 打开模态框，展示内容
                 * 4. yes 方法在对话框点击确定按钮时触发，如果空看未返回，则保存空看返回时间，然后重新打开此对话框
                 */
                $ctrl.start = function (focusid, callEvent) {
                    $ctrl.focusWatch.id = focusid;
                    $ctrl.callEvent = callEvent;
                    // 获取空看反馈的详细信息
                    commonContainer.showLoading();
                    singleService.getFocusWatchById(focusid)
                        .then(function (result) {
                            if (result.code != 0) {
                                throw layer.alert(result.msg);
                            }
                            if (!result.data) {
                                throw layer.alert('查询数据为空');
                            }
                           
                            $ctrl.focusWatch.houseid = result.data.houseid;
                            $ctrl.focusWatch.begintime = result.data.begintime;
                            $ctrl.focusWatch.endtime = result.data.endtime;
                            $ctrl.focusWatch.conmmunityname = result.data.conmmunityname;
                        })
                        .then(showFocusDetail)
                        .then(function () {
                        	if ($ctrl.callEvent) {
                                $(document).trigger($ctrl.callEvent); // 刷新表格
                            }
                            hideLoading();
                            singleService.openModal($ctrl.isBack, $ctrl.yes);
                        })
                        .catch(hideLoading);
                };

                function hideLoading() {
                    commonContainer.hideLoading();
                }

                // 更新页面数据
                function showFocusDetail() {
                    return singleService.getSingleDetailByFocusWatch($ctrl.focusWatch).then(function (res) {
                        if (res.code !== 0) {
                            throw layer.alert(res.msg);
                        }
                        if (!res.data) {
                            throw layer.alert('查询数据为空');
                        }
                        $ctrl.focusWatch.emptyid=res.data.emptyid;
                        $ctrl.data = res.data;
                        $ctrl.isBack = $ctrl.feedback || res.data.backtime;// 空看是否已返回
                        $ctrl.isFeedBack = res.data.resulttime !== '未反馈';// 是否已经反馈
                    });
                }

                $ctrl.yes = function (layerId) {
                    /*if ($ctrl.isBack) {// 空看已经返回
                        layer.close(layerId);// 正常关闭
                    } else {*/
                        var backtime = $('#J_backtime').val();
                        // 如果空看还未返回，则需要先填写空看返回时间
                        if (!backtime) {
                            return layer.alert('请选择返回时间');
                        }

                        $ctrl.data.backtime = backtime;

                        // 保存空看的返回时间
                        commonContainer.showLoading();
                        singleService.saveBackTime($ctrl.focusWatch, backtime).then(function (result) {
                            commonContainer.hideLoading();
                            if (result.code !== 0) {
                                return layer.alert(result.msg);
                            }
                            layer.msg('保存成功!');
                            window.location.reload();
                            showFocusDetail().catch(hideLoading);
                            if ($ctrl.callEvent) {
                                $(document).trigger($ctrl.callEvent); // 刷新表格
                            }
                           /* layer.title('空看反馈', layerId);// 修改layer的标题
                            
                            singleService.updateSingleNum($ctrl.focusWatch.id); // 更新空看次数
                            
*/                           layer.close(layerId);// 正常关闭
                            singleback($ctrl.focusWatch.emptyid,"feedback");
                           
                        });
                   /* }*/
                };

                $ctrl.showUserInfo = function (id) {
                    getUserStaffInfo(id);
                };

                // 获取可以打开房源详细信息的链接
                $ctrl.getHouseLink = function (focuswatch) {
                    var href;
                    if (Number(focuswatch.housekind) === 1) {// 租赁
                        href = basePath + '/house/main/leasedetail.htm?houseid=' + focuswatch.houseid; // 租赁
                    } else {
                        href = basePath + '/house/main/buydetail.htm?houseid=' + focuswatch.houseid; // 买卖
                    }
                    return href;
                };

                $ctrl.showAddr = function (focuswatch) {
                    checkAddress(focuswatch.houseid);
                };

                // 打开反馈对话框
                $ctrl.goFeedback = function () {
                    $rootScope.$broadcast('goFeedback', $ctrl.focusWatch, $ctrl.data);// 开始打开反馈对话框
                };

                //  当反馈成功后，更新页面
                $scope.$on('feedbackDone', function () {
                    showFocusDetail();
                });

                // 打开查看对话框
                $ctrl.goFeedBackDetail = function () {
                    $rootScope.$broadcast('goFeedBackDetail', $ctrl.focusWatch, $ctrl.data);// 打开查看对话框
                };
            }])

        // 处理反馈对话框逻辑
        .controller('singleFeedBackCtrl', ['$rootScope', '$scope', 'singleService', function ($rootScope, $scope, singleService) {
            var $ctrl = this;
            $scope.$on('goFeedback', function (e, focusWatch, singleFeedback) {
                $ctrl.merits = ''; // 优点
                $ctrl.weak = ''; // 缺点
                $ctrl.reason = ''; // 未看反馈
                $ctrl.isWatch = '1'; // 已看
                $ctrl.focusWatch = focusWatch;
                $ctrl.singleFeedback = singleFeedback;

                singleService.openFeedBackModel($ctrl.yes);
            });

            $ctrl.yes = function (layerId) {
                commonContainer.showLoading();
                singleService.saveFeedback(
                    $ctrl.singleFeedback, $ctrl.focusWatch, $ctrl.isWatch,
                    $ctrl.merits, $ctrl.weak, $ctrl.reason).then(function (result) {
                    commonContainer.hideLoading();
                    if (result.code !== 0) {
                        return layer.alert(result.msg);
                    }
                    layer.msg('反馈成功');
                    layer.close(layerId);
                    $rootScope.$broadcast('feedbackDone');
                });
            };
        }])

        // 处理查看反馈对话框逻辑
        .controller('singleFeedBackDetailCtrl', ['$scope', 'singleService', function ($scope, singleService) {
            var $ctrl = this;

            $scope.$on('goFeedBackDetail', function (e, focusWatch, data) {
                commonContainer.showLoading();
                singleService.getFeedBackDetail(focusWatch, data).then(function (result) {
                    commonContainer.hideLoading();
                    if (result.code !== 0) {
                        return layer.alert(result.msg);
                    }
                    if (!result.data) {
                        return layer.alert('查询数据为空');
                    }
                    $ctrl.data = result.data;
                    $ctrl.data.iswatch = String($ctrl.data.iswatch);
                    singleService.openFeedBackDetailModel();
                });
            });
        }])

        // 集中空看服务
        .service('singleService', ['$http', function ($http) {

            // 更新空看次数
            this.updateSingleNum = function (focusid) {
                return $http.get(basePath + '/house/focuswatch/updatesinglenum', {
                    params: {
                        focusid: focusid
                    }
                }).then(function (response) {
                    return response.data;
                })
            };

            // 获取集中看房信息
            this.getFocusWatchById = function (focusid) {
                return $http.get(basePath + "/house/focuswatch/getfocusbyid.htm", {
                    params: {
                        focusid: focusid
                    }
                }).then(function (response) {
                    return response.data;
                });
            };

            // 获取集中看房的详细信息
            this.getSingleDetailByFocusWatch = function (focusWatch) {
                return $http.get(basePath + "/house/focuswatch/singledetail.htm", {
                    params: {
                        focusid: focusWatch.id,
                        houseid: focusWatch.houseid
                    }
                }).then(function (response) {
                    return response.data;
                });
            };

            // 保存空看返回时间
            this.saveBackTime = function (focusWatch, backTime) {
                return $http.get(basePath + '/house/singlewatch/backtimeupdate', {
                    params: {
                    	emptyid:focusWatch.emptyid,
                        backtime: backTime // 集中看房返回时间
                    }
                }).then(function (response) {
                    return response.data;
                });
            };

            // 保存空看反馈
            this.saveFeedback = function (singleFeedback, focusWatch, isWatch, merits, weak, reason) {
                return $http.post(basePath + '/house/singlewatch/feedbackempty.htm', {
                    emptyid: singleFeedback.emptyid, // 空看编号
                    houseid: focusWatch.houseid, // 房源编号
                    iswatch: Number(isWatch),// 是否看房 0否 1是
                    merits: merits,// 优点
                    reason: reason, // 未看原因
                    weak: weak // 缺点
                }).then(function (response) {
                    return response.data;
                });
            };

            // 获取反馈信息
            this.getFeedBackDetail = function (focusWatch, data) {
                return $http.get(basePath + "/house/singlewatch/feedbackresult.htm", {
                    params: {
                        houseid: focusWatch.houseid,
                        emptyid: data.emptyid
                    }
                }).then(function (response) {
                    return response.data;
                });
            };

            /**
             * @param isBack 是否已经空看返回
             * @param yes 点击确定的回调方法
             */
            this.openModal = function (isBack, yes) {
                commonContainer.modal(isBack ? '空看反馈' : '空看返回', $('#F_editsingleback_layer'), yes, {
                    overflow: 'auto',
                    area: ['80%', '420px'],
                    // 如果是已经返回状态，则只有关闭一个按钮
                    btns: isBack ? ['关闭'] : ['确定', '关闭'],
            		success:function(){
            			 $('#J_backtime').val(laydate.now(Date.now(), 'YYYY-MM-DD hh:mm:ss'));
                         var time=$("#begintime-static").text();
        			 	 var end = {
        	                    elem: "#J_backtime",
        	                    format: "YYYY-MM-DD hh:mm",
        	                    istime: true,
        	                    istoday: false,
        	                    min: time,
        	                    choose: function (datas) {
        	                        /*start.max = datas*/
        	                    	if(new Date(datas)<new Date(time)){
        	            	    		layer.msg('返回时间不能早于外出时间！');
        	            	    		$("#J_backtime").val('');
        	            	    	}
        	                    }
        	                };
        	               laydate(end);	
            		}
                });
            };

            // 打开反馈对话框
            this.openFeedBackModel = function (yes) {
                commonContainer.modal('空看反馈', $('#F_feedback_add_layer'), yes, {
                    overflow: 'auto',
                    area: ['700px', '300px'],
                    btns: ['确定', '关闭']
                });
            };

            // 打开反馈信息查看对话框
            this.openFeedBackDetailModel = function () {
                commonContainer.modal('反馈结果', $('#F_feedback_desc_layer'), null, {
                    overflow: 'auto',
                    area: ['700px', '300px'],
                    btns: ['关闭']
                });
            };
        }]);

    $(function () {
        angular.bootstrap($('#F_single_feedback'), ['focusWatchSingleBack']);
    });
}(window));