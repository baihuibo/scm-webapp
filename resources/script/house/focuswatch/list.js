(function (window) {
    selectArealist($('#areaids'), '');// 区域
    searchBusiness($("#J_business"), true, 'left');// 商圈
    searchHouses($("#J_housename"), true, 'right'); // 楼盘名

    searchContainer.searchUserListByComp($("#belongid"), true, 'right');		//所属人
    searchContainer.searchUserListByComp($("#createby"), true, 'left');		//发起人
    searchContainer.searchUserListByComp($("#connectid"), true, 'left');		//联系人

    dimContainer.buildDimCheckBoxHasAll($('#J_planningPurpose'), 'propertytype', 'plannedUses', 'all', '全部');

    //所属部门
    $('#J_deptSelect').on('click', function() {
        showDeptTree($('#J_deptName'), $('#J_deptLevel'), '');
    });


    $('#J_lease_form').on('reset', function () {
        // 重置操作
        $('#areaids,#status').val('').trigger('chosen:updated');
        // 所属人，     发起人，    联系人，    楼盘名，    商圈，         所属部门
        $("#belongid,#createby,#connectid,#J_housename,#J_tradearea,#J_belongdeptName,#J_deptName")
            .val('')
            .attr({'data-id': '', 'style': ''});
        $("#J_business").attr({'data-id': ''});
        $('#J_deptLevel').val('');// 所属部门
    });

    var data_table;

    $(function () {
        //初始化参数
        $("input[name='customersid']").val();

        $("select").chosen({
            width: "100%"
        });

        var begindate = {
            elem: '#detail_begintime',
            format: 'YYYY-MM-DD hh:mm',
            istime: true,
            choose: function (datas) {
                enddate.min = datas;
                enddate.start = datas
            },
        }

        laydate(begindate);

        var enddate = {
            elem: '#detail_endtime',
            format: 'YYYY-MM-DD hh:mm',
            istime: true,
            choose: function (datas) {
                enddate.min = datas;
                enddate.start = datas
            },
        }

        laydate(enddate);

        $('#returnTime').on('click', function () {
            laydate({
                elem: '#returnTime',
                format: 'YYYY-MM-DD hh:mm',
                max: laydate.now(),
                istime: true
            });
        });

        data_table = $('#J_dataTable');

        data_table
            .on('click', 'a.j-single-num', function () {// 已空看数
                openSingleAndShowTable($(this), 'single');
            })
            .on('click', 'a.j-show-num', function () {// 已带看数
                openSingleAndShowTable($(this), 'show');
            });

        // 用来在子页面触发刷新表格用
        $(document).on('refresh_table_data', function () {
            data_table.bootstrapTable('refresh');
        });

        $('#J_search').on('click', function (event) {
            //初始化表格
            initTable();
            //详细使用说明参见http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
            data_table.bootstrapTable('refresh', {url: basePath + '/house/focuswatch/listview'});
        });

        function initTable() {
            if (!data_table.data('bootstrap.table')) {
                data_table.bootstrapTable({
                    // url: basePath + '/house/focuswatch/listview',
                    sidePagination: 'server',
                    dataType: 'json',
                    method: 'post',
                    pagination: true,
                    striped: true,
                    pageSize: 10,
                    uniqueId: 'id',
                    pageList: [10, 20, 50],
                    queryParams: function (params) {
                        var o = jQuery('#J_lease_form').serializeObject();

                        o.pageindex = params.offset / params.limit + 1;
                        o.pagesize = params.limit;
                        if (o.deptid) {
                            o.deptid = $("#J_deptName").attr('data-id');
                        }
                        o.belonguserid = $("#belongid").attr('data-id');
                        o.createby = $("#createby").attr('data-id');
                        o.connectid = $("#connectid").attr('data-id');
                        var id = $("#J_housename").attr('data-id');
                        if (id) {
                            o.conmmunityid = id.split(';')[1];
                        }
                        if (o.areaids) {
                            o.areaids = [o.areaids];// 处理为数组
                        }
                        var businessid = $('#J_business').attr('data-id');
                        if (businessid) {
                            o.businessid = businessid;
                        }

                        return o;
                    },
                    responseHandler: function (result) {
                        if (result.code == 0 && result.data && result.data.totalcount > 0) {
                            return {"rows": result.data.rows, "total": result.data.totalcount}
                        }
                        return {"rows": [], "total": 0}
                    },
                    columns: [
                        [
                            {
                                field: 'id',
                                title: '集中看房编号',
                                align: 'center',
                                rowspan: 2,
                                formatter: function (value, row, index) {
                                	if($("#temp_view").val()!=undefined){
                                		return "<a href=\'javaScript:detail(" + row.id + ")\' class=\'J_houseid\'>" + row.id + "</a>";
                                	}else{
                                		return row.id;
                                	}
                                    
                                }
                            },
                            {
                                field: 'houseId',
                                title: '房源编号',
                                align: 'center',
                                rowspan: 2,
                                formatter: function (value, row, index) {
                                    return getToHouseInfoLink(row.houseId, row.housekind);
                                }
                            },
                            {field: 'status', title: '状态', align: 'center', rowspan: 2},
                            {field: 'beginTime', title: '起始时间', align: 'center', rowspan: 2},
                            {field: 'endTime', title: '结束时间', align: 'center', rowspan: 2},
                            {field: 'guihuayongtuStr', title: '规划用途', align: 'center', rowspan: 2},
                            {field: 'feedback', title: '集中看房反馈', align: 'center', colspan: 2},
                            {
                                field: 'userName', title: '发起人', align: 'center', rowspan: 2,
                                formatter: function (value, row) {
                                    return getToUserInfoLink(row.userid, value);
                                }
                            },
                            {
                                field: 'connectName', title: '联系人', align: 'center', rowspan: 2,
                                formatter: function (value, row) {
                                    return getToUserInfoLink(row.connectid, value);
                                }
                            },
                            {
                                field: 'opt',
                                title: '操作',
                                align: 'left',
                                rowspan: 2,
                                formatter: function (value, row, index) {
                                    if (row.status === '可反馈') {
                                        var btnWithPeopleFeedback = $("<a href='javascript:' onclick='doWithPeopleFeedback(" + row.id + ")' type='focusfeedback' class='btn btn-outline btn-success btn-xs mt-3 J_feedback'>带看反馈</a>&nbsp;&nbsp;<br/>");
                                        var btnEmptyFeedback = "";
                                        if($("#temp_feedback").val()!=undefined){
                                        	 if (row.showbutton=='YES') {// 将 emptynum转换为数字
                                                 btnEmptyFeedback = "<a href='javascript:' onclick='focusWatchSingleBack(" + row.id + ", \"refresh_table_data\")' type='focusfeedback' class='btn btn-outline btn-success btn-xs mt-3' >空看反馈</a><br/>";
                                            }	
                                        }
                                       

                                        btnWithPeopleFeedback.attr('id', 'row' + index);
                                        btnWithPeopleFeedback.attr('data-houseid', row.houseId);
                                        btnWithPeopleFeedback.attr('data-begintime', row.beginTime);
                                        btnWithPeopleFeedback.attr('data-housekind', row.housekind);
                                        btnWithPeopleFeedback.attr('data-focusid', row.id);
                                        if($("#temp_buy_feedback").val()!=undefined){
                                        	return btnWithPeopleFeedback.prop("outerHTML") + btnEmptyFeedback;
                                        }else{
                                        	return btnEmptyFeedback;
                                        }
                                        
                                    }

                                    return '';
                                }
                            }
                        ],
                        [
                            {
                                field: 'singleNum', title: '已空看数', align: 'center',
                                formatter: function (value, row, index) {
                                    if (value > 0) {
                                        return '<a href="javascript:" class="j-single-num" data-id="' + row.id + '">' + value + '</a>';
                                    }
                                    return value;
                                }
                            },
                            {
                                field: 'showNum', title: '已带看数', align: 'center',
                                formatter: function (value, row, index) {
                                    if (value > 0) {
                                        return '<a href="javascript:" class="j-show-num" data-id="' + row.id + '">' + value + '</a>';
                                    }
                                    return value;
                                }
                            }
                        ]
                    ]
                });
            }
        }

    });

    /*
     * 集中看房详情
     */
    window.detail = detail;
    function detail(id) {
        var focus = data_table.bootstrapTable('getRowByUniqueId', id);

        var btns = ['关闭'];
        var revoke;
        var isStart = focus.status === '已发起';// 是否已发起

        if (isStart && focus.isowner) {// 必须是自己创建的集中看房才可以编辑
        	if($("#temp_update").val()!=undefined&&$("#temp_cancel").val()!=undefined){
        		btns = ['修改', '撤销', '关闭'];
        	}else if($("#temp_update").val()!=undefined&&$("#temp_cancel").val()==undefined){
        		btns = ['修改', '关闭'];
        	}else if($("#temp_update").val()==undefined&&$("#temp_cancel").val()!=undefined){
        		btns = ['撤销', '关闭'];
        	}else{
        		btns = ['关闭'];
        	}
            
            revoke = function revoke(layerid) {
                commonContainer.showLoading();
                jsonGetAjax(basePath + '/house/focuswatch/cancel', {focusid: id}, function (result) {
                    commonContainer.hideLoading();
                    if (result.code != 0) {
                        return layer.alert(result.msg);
                    }
                    layer.close(layerid);
                    layer.msg('撤销成功');
                    data_table.bootstrapTable('refresh');// 重新刷新表格
                });
            };
        }
        if($("#temp_update").val()!=undefined&&$("#temp_cancel").val()!=undefined){
        commonContainer.modal('集中看房详情', $('#J_detail_singlewatch_layer'), function (index, layero) {
                if (!isStart || !focus.isowner) {
                    // 如果不是已发起的状态，则直接关闭对话框
                    return layer.close(index);
                }

                commonContainer.showLoading();
                jsonPostAjax(basePath + '/house/focuswatch/update', {
                    id: id,
                    houseId : focus.houseId,
                    connectId: $('#detail_connect').attr('data-id'),
                    begintime: $('#detail_begintime').val(),
                    endtime: $('#detail_endtime').val(),
                    memo: $('#detail_memo').val()
                }, function (result) {
                    commonContainer.hideLoading();
                    if (result.code != 0) {
                        return layer.msg(result.msg);
                    }
                    layer.msg('集中看房详情修改成功');
                    data_table.bootstrapTable('refresh');
                    layer.close(index);
                });
            },
            {
                area: ['80%', '480px'],
                btnAlign: 'c',
                btns: btns,
                btn2: revoke,
                success: function (indexc, layero) {
                	 detailyer(id);
                },
                cancel: function (index, layerno) {
                    layer.close(index);
                }
            });
        }else if($("#temp_update").val()!=undefined&&$("#temp_cancel").val()==undefined){
        	commonContainer.modal('集中看房详情', $('#J_detail_singlewatch_layer'), function (index, layero) {
                if (!isStart || !focus.isowner) {
                    // 如果不是已发起的状态，则直接关闭对话框
                    return layer.close(index);
                }

                commonContainer.showLoading();
                jsonPostAjax(basePath + '/house/focuswatch/update', {
                    id: id,
                    connectId: $('#detail_connect').attr('data-id'),
                    begintime: $('#detail_begintime').val(),
                    endtime: $('#detail_endtime').val(),
                    memo: $('#detail_memo').val()
                }, function (result) {
                    commonContainer.hideLoading();
                    if (result.code != 0) {
                        return layer.msg(result.msg);
                    }
                    layer.msg('集中看房详情修改成功');
                    data_table.bootstrapTable('refresh');
                    layer.close(index);
                });
            },
            {
                area: ['80%', '480px'],
                btnAlign: 'c',
                btns: btns,
                success: function (indexc, layero) {
                	detailyer(id);
                },
                cancel: function (index, layerno) {
                    layer.close(index);
                }
            });
        }else if($("#temp_update").val()==undefined&&$("#temp_cancel").val()!=undefined){
        	commonContainer.modal('集中看房详情', $('#J_detail_singlewatch_layer'), function (index, layero) {
        		 commonContainer.showLoading();
                 jsonGetAjax(basePath + '/house/focuswatch/cancel', {focusid: id}, function (result) {
                     commonContainer.hideLoading();
                     if (result.code != 0) {
                         return layer.alert(result.msg);
                     }
                     layer.close(layerid);
                     layer.msg('撤销成功');
                     data_table.bootstrapTable('refresh');// 重新刷新表格
                 });
            },
            {
                area: ['80%', '480px'],
                btnAlign: 'c',
                btns: btns,
                success: function (indexc, layero) {
                	detailyer(id);
                },
                cancel: function (index, layerno) {
                    layer.close(index);
                }
            });
    	}else{
    		commonContainer.modal('集中看房详情', $('#J_detail_singlewatch_layer'), function (index, layero) {
    			layer.close(index);
           },
           {
               area: ['80%', '480px'],
               btnAlign: 'c',
               btns: btns,
               success: function (indexc, layero) {
            	   detailyer(id);
               },
               cancel: function (index, layerno) {
                   layer.close(index);
               }
           });
        }
    }
function detailyer(id){
	 var focus = data_table.bootstrapTable('getRowByUniqueId', id);
	 var isStart = focus.status === '已发起';// 是否已发起
	 var inputs = $('#detail_connect_input_group,#detail_begintime,#detail_endtime,#detail_memo').hide();
     var statics = $('#detail_connect_static,#detail_begintime_static,#detail_endtime_static,#detail_memo_static').hide();
	commonContainer.showLoading();
    jsonAjax(basePath + '/house/focuswatch/detail', {id: id}, function (result) {
        commonContainer.hideLoading();
        $('#detail_houseid').html(getToHouseInfoLink(result.data.houseid, result.data.housekind)); // 房源编号
        $('#detail_address').html(getToAddressLink(result.data.houseid)); // 详细地址
        $('#detail_status').text(result.data.status); // 集中看房状态
        if(result.data.belongid){
        	$('#detail_belongname').html(getToUserInfoLink(result.data.belongid, result.data.belongname)); // 所属人
        }
        
        $('#detail_createname').html(getToUserInfoLink(result.data.createid, result.data.createname)); // 发起人
        
        if(result.data.singlenum==0){
        	$('#detail_singlenum').text(result.data.singlenum); // 空看数
        }else{
        	$('#detail_singlenum').text(result.data.singlenum); // 空看数
            $('#detail_singlenum').on('click',function(){
            	singleNumCheck('single',result.data.emptyno);
            })
        }
        
        if(result.data.showNum==0){
        	$('#detail_showNum').text(result.data.showNum); // 带看数
        }else{
        	$('#detail_showNum').text(result.data.showNum); // 带看数
        	$('#detail_showNum').on('click',function(){
            	singleNumCheck('show',result.data.showingsno);
            	
            })
        }
        
        
        if (isStart && focus.isowner) {// 如果已开始,并且是自己发起的集中看房，则可以修改内容
            $('#detail_connect')
                .val(result.data.connectname)
                .attr('data-id', result.data.connectid); // 联系人

            $('#detail_begintime').val(result.data.begintime);// 起始时间
            $('#detail_endtime').val(result.data.endtime); // 结束时间
            $('#detail_memo').val(result.data.memo); // 备注
            inputs.show();
        } else {// 如果是其它状态，则只显示值
            $('#detail_connect_static').html(getToUserInfoLink(result.data.connectid, result.data.connectname)); // 联系人
            $('#detail_begintime_static').text(result.data.begintime); // 起始时间
            $('#detail_endtime_static').text(result.data.endtime); // 结束时间
            $('#detail_memo_static').text(result.data.memo); // 备注
            statics.show();
        }
    });	
}
    var showingsid;

    window.doWithPeopleFeedback = doWithPeopleFeedback;
    function doWithPeopleFeedback(focusid) {
        var showTable = $('#J_showTable');
        var focus = $('#J_dataTable').bootstrapTable('getRowByUniqueId', focusid);
        var showBackInput = $('#show_back_type_value');
        var showBackTypeSelect = $('#show_back_type');

        commonContainer.modal('客户搜索', $('#J_customer_list_layer'), function (index, layero) {
                var radio = $(':radio[name="customerlist"]:checked');
                showingsid = radio.val();

                if (showingsid) {
                    var showback = showTable.bootstrapTable('getRowByUniqueId', radio.attr('data-customerno'));

                    var customersid = showback.customersid;
                    var customerno = showback.customerno;

                    var beginTime = focus.beginTime;
                    var housekind = focus.housekind;
                    var houseid = focus.houseId;

                    if (!housekind) {
                        return layer.alert('关联房源的业务类型为空');
                    }

                    //判断是否已存在带看记录
                    jsonGetAjax(basePath + '/customer/showings/isshowing', {
                        houseid: houseid,
                        client_id: customerno,
                        customersid: customersid
                    }, function (result) {
                        if (result.code != 0) {
                            return layer.alert(result.msg);
                        }

                        if (result.data.house_flag == false) {
                            var params = {
                                accompany_id: '',
                                begintime: beginTime,
                                businesstype: housekind,
                                client_id: customerno,
                                customersid: customersid,
                                showings_id: result.data.showingsid,
                                showingsHouseSaveVoList: [
                                    {
                                        houseid: houseid
                                    }
                                ]
                            };

                            jsonPostAjax(basePath + '/customer/showings/insertshowings', params, function (result) {
                                if (result.code == '0') {
                                    showingsid = result.data;

                                   
                                    layer.close(index);
                                    //--------------------------------------begin---------------------------------------------------------
                                    commonContainer.modal('带看反馈', $('#feedback'), function (index, layero) {

                                        //-----------------------begin------------------------------------------------
                                        //确定的事件
                                        //判断返回店面时间
                                        var seeTime = $('#returnTime').val();
                                        if (seeTime == '') {
                                            commonContainer.alert('返回店面时间不能为空');
                                            return false;
                                        }

                                        //判断房源是否都已反馈
                                        var isevaluate = false;
                                        $('#feedback .isevaluate').each(function () {
                                            if ($(this).data('isevaluate') == 2) {
                                                commonContainer.alert('您还有未反馈房源');
                                                isevaluate = true;
                                                return false;
                                            }
                                        });
                                        if (isevaluate) {
                                            return false;
                                        }

                                        var showingsHouseVoList = [];
                                        $('#seeListings tbody tr').each(function () {
                                           var tr = $(this);
                                           var btn = tr.find('button');
                                           var tds = tr.children('td');
                                            showingsHouseVoList.push({
                                                houseid : tds.eq(0).text(), // 房源id
                                                feedbacktype : btn.attr('data-feedbacktype'), // 指导意见 1：有意向 2：无意向 3：未看
                                                reasons : btn.attr('data-reason'), // 无意向/未看原因
                                                showingsid : showingsid, // 带看编号
                                            });
                                        });

                                        //获取附件列表
                                        var attachVoList = [];	//附件信息
                                        $('#upFileList > div').each(function () {
                                            attachVoList.push({
                                                attachurl: $(this).data('attachurl'),		//文件路径
                                                attachname: $(this).data('attachname')		//文件名
                                            });
                                        });
                                        //修改带看次数
                                        jsonGetAjax(basePath + '/house/focuswatch/updateshownum',
                                            {'focusid': focusid, 'showingsid': showingsid}, function () {
                                                $('#J_dataTable').bootstrapTable('refresh', {url: basePath + '/house/focuswatch/listview'});
                                            });
                                        //带看反馈表单保存
                                        jsonPostAjax(basePath + '/customer/showings/insertshowingsfeedback.htm', {
                                            endtime: seeTime,						//返回店面时间
                                            attachVoList: attachVoList,				//附件信息集合
                                            showingsHouseVoList: showingsHouseVoList,	//房源信息
                                            showingsid: showingsid				//带看id
                                        }, function () {
                                            layer.msg('保存带看单信息成功');
                                            layer.close(index);
                                            $('#J_dataTable').bootstrapTable('refresh', {url: basePath + '/house/focuswatch/listview'});
                                        }, {});
                                        //-----------------------------end-------------------------------------------
                                    }, {
                                        overflow: 'auto',
                                        area: ['80%', '80%'],
                                        btns: ['确定', '取消'],
                                        cancel: function (index, layerno) {
                                            layer.close(index);
                                        },
                                        success: function (layero, index) {

                                            // 显示客户信息
                                            $('#CustomerInfor').html(showback.customerno + ' (' + showback.customername + ')');

                                            //调用附件列表接口
                                            jsonGetAjax(basePath + '/customer/showings/showingsattach/list.htm', {
                                                showings_id: showingsid
                                            }, function (result) {
                                                if (result.data) {
                                                    var rows = result.data.rows;
                                                    var length = rows.length;
                                                    var html = '';
                                                    if (length > 0) {
                                                        for (var i = 0; i < length; i++) {
                                                            html += '<div data-attachname=' + rows[i].attach_name + ' data-attachurl="' + rows[i].attach_url + '"><span class="btn btn-green btn-bitbucket" onclick="tapeManagViseView.deleteUpFile(this)"><i class="glyphicon glyphicon-remove"></i></span>' + rows[i].attach_name + '</div>';
                                                        }
                                                        $('#upFileList').html(html);
                                                    }
                                                }
                                            });

                                            //调用房源编号列表
                                            jsonGetAjax(basePath + '/customer/showings/showingshouse/list.htm', {
                                                showings_id: showingsid	//带看id
                                            }, function (result) {

                                                if (result.data && result.data.rows.length > 0) {
                                                    var columns = [
                                                        {
                                                            field: 'houseid',
                                                            title: '房源编号',
                                                            align: 'center',
                                                            formatter: function (value, row, index) {
                                                                var houseHref = '';
                                                                if (row.housekind == 1) {
                                                                    houseHref = basePath + "/house/main/leasedetail.htm?houseid=" + value;
                                                                }else if (row.housekind == 2) {
                                                                    houseHref = basePath + "/house/main/buydetail.htm?houseid=" + value;
                                                                }

                                                                var ownername = [];
                                                                if (row.ownername) {
                                                                    ownername = ['(', row.ownername, ')'];
                                                                }
                                                                var html = '<a href="' + houseHref + '" target="_black">' + value + '</a>' + ownername.join('');
                                                                return html;
                                                            }
                                                        },
                                                        {
                                                            field: 'address',
                                                            title: '商圈',
                                                            align: 'center'
                                                        },
                                                        {
                                                            field: 'housetype',
                                                            title: '户型',
                                                            align: 'center'
                                                        },
                                                        {
                                                            field: 'housesize',
                                                            title: '面积',
                                                            align: 'center'
                                                        },
                                                        {
                                                            field: 'floor',
                                                            title: '层数',
                                                            align: 'center',
                                                            formatter: function (value, row, index) {
                                                                return value + '/' + row.totalfloor;
                                                            }
                                                        },
                                                        {
                                                            field: 'orientation',
                                                            title: '朝向',
                                                            align: 'center'
                                                        },
                                                        {
                                                            field: 'price',
                                                            title: '价格',
                                                            align: 'center',
                                                            formatter : function (value , row) {
                                                                if (row.housekind == 1) {// 租赁
                                                                    return value + '元/每月';
                                                                }else if(row.housekind == 2){ // 买卖
                                                                    return value + '万元';
                                                                }
                                                                return value;
                                                            }
                                                        },
                                                        {
                                                            field: 'leadresult',
                                                            title: '带看结果',
                                                            align: 'center',
                                                            formatter: function (value, row, index) {
                                                                var isval = '';
                                                                var contet = '';
                                                                if (value) {
                                                                    isval = '1';
                                                                    contet = value;
                                                                } else {
                                                                    isval = '2';
                                                                    contet = '-';
                                                                }
                                                                return '<span class="isevaluate" data-isevaluate=' + isval + '>' + contet + '</span>';
                                                            }
                                                        },
                                                        {
                                                            field: 'opt',
                                                            title: '操作',
                                                            align: 'center',
                                                            formatter: function (value, row, index) {
                                                                return '<button type="button" data-showingshouseid="' + row.showingshouseid + '" data-houseid="' + row.houseid + '" data-customername="' + showback.customername + '" data-clientid="' + showback.customerno + '" class="btn btn-outline btn-success btn-xs mt-3" onclick="creatResultsPop(this)">反馈</button>';
                                                            }
                                                        }
                                                    ]
                                                    $('#seeListings').bootstrapTable('destroy');	//清除之前的数据
                                                    $('#seeListings').bootstrapTable({
                                                        striped: false,	//是否隔行显示
                                                        data: result.data.rows,
                                                        columns: columns
                                                    });
                                                }
                                            });
                                            //文件上传
                                            $('#selectFile').off().on('click', function () {
                                                var upFile = $('#upFile');
                                                upFile.off().click();
                                                upFile.off().on('input change', function () {
                                                    var upFileObj = this.files[0];
                                                    //验证上传文件
                                                    var strIndex = upFileObj.name.lastIndexOf('.') + 1;
                                                    var fileSuffixName = upFileObj.name.substring(strIndex);											//文件后缀
                                                    var isFileType = /^(xlsx|doc|docx|pdf|pptx|txt|bmp|jpg|svg|psd|rar)$/.test(fileSuffixName);		//是否符合文件类型
                                                    //是否符合文件类型
                                                    if (!isFileType) {
                                                        commonContainer.alert('上传文件格式为：xlsx、doc、docx、pdf、pptx、txt、bmp、jpg、svg、psd、rar');
                                                        return false;
                                                    }
                                                    //判断文件是否超过5MB,
                                                    if (upFileObj.size > 5 * 1024 * 1024) {
                                                        commonContainer.alert('请上传小于5MB文件');
                                                        return false;
                                                    }
                                                    //上传至文件服务器（获取文件路径）
                                                    var formData = new FormData();
                                                    formData.append('file', upFileObj);
                                                    $.ajax({
                                                        url: basePath + '/customer/showings/singleFileUpload.htm',
                                                        type: 'POST',
                                                        async: false,
                                                        cache: false,
                                                        data: formData,
                                                        processData: false,
                                                        contentType: false,
                                                        dataType: 'json',
                                                        success: function (result) {
                                                            if (result.code == '0') {
                                                                var html = '<div data-attachname=' + result.data.filename + ' data-attachurl="' + result.data.filepath + '"><span class="btn btn-green btn-bitbucket" onclick="deleteUpFile(this)"><i class="glyphicon glyphicon-remove"></i></span>' + result.data.filename + '</div>';
                                                                $('#upFileList').append(html);
                                                                $('#fileHidden').html('<input type="file" id="upFile">');	//重置上传文件
                                                            } else {
                                                                layer.alert(result.msg);
                                                            }
                                                        },
                                                        error: function () {
                                                            layer.alert(errorMsg);
                                                        }
                                                    });
                                                });
                                            });
                                            var guideFavoriteTr = [];
                                            //添加房源
                                            $('#addHouse').off().on('click', function () {
                                                addHouse(housekind , 1);	////房源类型1租赁2买卖
                                            });

                                        }
                                    });
                                    //---------------------------------end--------------------------------
                                } else {
                                    commonContainer.alert(result.msg);
                                }
                            });
                        } else {
                            commonContainer.alert(result.data.message);
                        }
                    });

                } else {
                    commonContainer.alert('请选择一条客源');
                }
            },
            {
                overflow: 'auto',
                area: ['80%', '80%'],
                btns: ['确定', '关闭'],
                success: function () {
                    queryTable(true);
                }
            });

        $('#show_back_requery')
            .off('*.requery')
            .on('click.requery', function () {
                // 点击查询按钮时，重新触发querytable
                queryTable();
            });

        function queryTable(clearForm) {
            if (clearForm) {// 清除表单内容
                showBackInput.val('');
                showBackTypeSelect.val('customername').trigger('change');
            }
            initShowTable();
            $('#J_showTable').bootstrapTable('refresh', {url: basePath + '/customer/main/listview'});
        }

        function initShowTable() {
            if (!showTable.data('bootstrap.table')) {
                showTable.bootstrapTable({
                    // url: basePath + '/customer/main/listview',
                    sidePagination: 'server',
                    dataType: 'json',
                    method: 'post',
                    pagination: true,
                    striped: true,
                    pageSize: 5,
                    uniqueId: "customerno",
                    pageList: [5, 10, 20],
                    queryParams: function (params) {
                        var o = jQuery('#J_lease_form').serializeObject();
                        o.timestamp = new Date().getTime();
                        o.pageindex = params.offset / params.limit + 1,
                            o.pagesize = params.limit;
                        if (o.begindate) {
                            o.begindate = encodeURI(o.begindate);
                        }
                        if (o.enddate) {
                            o.enddate = encodeURI(o.enddate);
                        }

                        o.businessType = focus.housekind;
                        delete o.propertytype;

                        var inputVal = showBackInput.val(),
                            type = showBackTypeSelect.val();
                        if (inputVal && type) {
                            o[type] = inputVal;
                        }
                        return o;
                    },
                    responseHandler: function (result) {
                        if (result.code == 0 && result.data && result.data.totalcount > 0) {
                            return {"rows": result.data.list, "total": result.data.totalcount}
                        }
                        return {"rows": [], "total": 0}
                    },

                    columns: [
                        {
                            field: 'option', title: '选择', align: 'center',
                            formatter: function (value, row, index) {
                                return '<input type="radio" name="customerlist" value="' + row.showingsid + '" data-customerno="' + row.customerno + '">';
                            }
                        },
                        {
                            field: 'remarktype', title: '评价', align: 'center',
                            formatter: function (value, row, index) {
                                var html = '';
                                if (row.remarktype == 'A') {
                                    html = '<span class="remarka">' + row.remarktype + '</span>';
                                } else if (row.remarktype == 'B') {
                                    html = '<span class="remarkb">' + row.remarktype + '</span>';
                                } else if (row.remarktype == 'C') {
                                    html = '<span class="remarkc">' + row.remarktype + '</span>';
                                }
                                return html;
                            }
                        },
                        {
                            field: 'customerno', title: '客户姓名</br>客户编号', align: 'center',
                            formatter: function (value, row, index) {
                                var customername = row.customername ? row.customername : '-'
                                return customername + '</br><a target="_blank" href="' + basePath + '/customer/main/findbuyerclientbycustomerid.htm?customerId=' + row.customersid + '">' + row.customerno + '</a>';
                            }
                        },
                        {field: 'customertype', title: '客户类型', align: 'center'},
                        {field: 'status', title: '销售阶段', align: 'center'},
                        {
                            field: 'guideresult', title: '带看状态', align: 'center',
                            formatter: function (value, row, index) {
                                var html;
                                if (row.statusid == 2 || row.statusid == 4) {
                                    html = row.status;
                                } else {
                                    html = row.guideresult || '-'
                                }
                                return html;
                            }
                        },
                        {field: 'lookhousetime', title: '方便看房时间', align: 'center'},
                        {
                            field: 'lastfollowtime', title: '录入时间</br>最后跟进时间', align: 'center',
                            formatter: function (value, row, index) {
                                var html = '';
                                var lastfollowtime = row.lastfollowtime ? row.lastfollowtime : '-';
                                var inputtime = row.inputtime ? row.inputtime : '-';
                                html = inputtime + '</br>' + lastfollowtime;
                                return html;
                            }
                        },
                        {
                            field: 'belonguser', title: '所属部门</br>所属人', halign: 'center', align: 'left',
                            formatter: function (value, row, index) {
                                var html = '';
                                var belonguser = row.belonguser ? row.belonguser : '-'
                                html = row.belonggroup + '</br>' + belonguser;
                                return html;
                            }
                        },
                        {
                            field: 'guidetimes', title: '带看次数', align: 'center',
                            formatter: function (value, row, index) {
                                var html = '';
                                if (row.guidetimes == 0) {
                                    html = '-';
                                } else {
                                    html = row.guidetimes + '次';
                                }

                                return html;
                            }
                        }
                    ],
                });
            }
        }
    }

//删除上传文件
    window.deleteUpFile = deleteUpFile;
    function deleteUpFile(_this) {
        $(_this).parent().remove();
    }

//创建反馈结果弹窗
    window.creatResultsPop = creatResultsPop;
    function creatResultsPop(target) {
        $('#inlineRadio').prop('checked', true);
        $('#reason').hide();
        //带看房源id
        var $el = $(target);
        var showHouseid = $el.data('addhous') == 1 ? '' : $el.data('showingshouseid');
        //查看房源带看反馈
        //回显反馈结果
        jsonGetAjax(basePath + '/customer/showings/viewhouse.htm', {
            showingshouseid: showHouseid
        }, function (result) {
            var resultBack = result.data.feedbacktype;
            //指导意见 1：有意向 2：无意向 3：未看
            if (resultBack == 1) {
                $('#inlineRadio').click();
            } else if (resultBack == 2) {
                $('#inlineRadio1').click();
                $('#reason').show();
            } else if (resultBack == 3) {
                $('#inlineRadio2').click();
                $('#reason').show();
            }
            //无意向、未看原因
            $('#noSeeReason').val(result.data.reasons);
        });
        var resultsLock = false;					//防止重复提交
        commonContainer.modal('带看反馈结果', $('#backResults'), function (layerid) {
            return save(layerid, true);
        }, {
            btns: ['收取意向金并保存', '保存'],
            btn2: function (layerid) {
                return save(layerid);
            },
            success : function ($layer) {
                var group = $('#inlineRadio').closest('.form-group');
                var collectBtn = $layer.find('.layui-layer-btn0');// 意向金按钮
                group.off().on('change' , ':radio' , function () {
                    if (+this.value === 1) { // 有意向
                        collectBtn.show()
                    }else{// 其他情况
                        collectBtn.hide();
                    }
                });
            },
            area: '600px',
        });
        function save(layerid , collect) {
            var seeResult = $("input[name='takeResults']:checked").val();
            var noSeeReason = $('#noSeeReason').val();
            if (seeResult == 2 || seeResult == 3) {
                if (noSeeReason == '') {
                    commonContainer.alert('请输入原因');
                    return false;
                }
            }
            if (resultsLock) {
                return false;
            } else {
                resultsLock = true;
            }
            jsonPostAjax(basePath + '/customer/showings/updatehouse.htm', {
                feedbacktype: seeResult,																			//指导意见 1：有意向 2：无意向 3：未看 ,
                houseid: $(target).data('houseid'),																//房源id
                showingshouseid: showHouseid,																	//带看房源id
                showingsid: showingsid, 																	//带看id
                reasons: noSeeReason																				//无意向、未看原因
            }, function () {
                commonContainer.alert('保存成功');
                layer.close(layerid);
                var seeData = '';
                if (seeResult == 1) {
                    seeData = '有意向';
                } else if (seeResult == 2) {
                    seeData = '无意向';
                } else if (seeResult == 3) {
                    seeData = '未看';
                }

                $el.attr('data-reason' , noSeeReason.encodeHTML());
                $el.attr('data-feedbacktype' , seeResult);
                $el.parent().prev().html('<span class="isevaluate" data-isevaluate="1">' + seeData + '</span>');								//重置带看结果
            }, {
                completeCallBack: function () {
                    resultsLock = false;
                }
            });

            if (collect) { // 收取意向金
                var data = $el.data();
                var url = basePath + '/finance/collect/collectPlan.html?clientId={0}&clientName={1}&houseId={2}';

                url = url.format(data.clientid , encodeURIComponent(data.customername) , data.houseid);
                window.open(url);
            }
        }
        $('#noSeeReason').val('');
        $('#inlineRadio').on('click', function () {
            $('#reason').hide();
            $('#noSeeReason').val('');
        });
        $('#inlineRadio1,#inlineRadio2').on('click', function () {
            $('#reason').show();
            $('#noSeeReason').val('');
        });
    }

    /**
     * 展示 已空看数，已带看数 的表格
     * @param el
     * @param type 值类型有 single , show
     */
    function openSingleAndShowTable(el, type) {
        var data = data_table.bootstrapTable('getRowByUniqueId', el.attr('data-id'));
        if (type === 'single') {
            singleNumCheck('single',data.emptyno);
        } else if (type === 'show') {
            singleNumCheck('show',data.showingsno);
        }    
    }
    function singleNumCheck(type,no){
    	var singleBack = $('#single-back-detail');
        var singleBackTable = singleBack.find('table');
        var showBack = $('#show-back-detail');
        var showBackTable = showBack.find('table');
        var content;
    	if (type === 'single') {
           content = singleBack;
            singleBackTable
                .bootstrapTable('destroy')
                .bootstrapTable({
                    url: basePath + '/house/singlewatch/listview',
                    method: 'post',
                    sidePagination: 'server',
                    dataType: 'json',
                    pagination: true,
                    striped: true,
                    pageSize: 10,
                    pageList: [10, 20, 50],
                    queryParams: function (params) {
                        var o = {};
                        o.timestamp = Date.now();
                        o.pageindex = 1;
                        o.pagesize = 50;
                        o.ids = no;// 空看处理
                        return o;
                    },
                    responseHandler: function (result) {
                        //console.log(result);
                        if (result.code == 0 && result.data && result.data.totalcount > 0) {
                            return {"rows": result.data.list, "total": result.data.totalcount}
                        }
                        return {"rows": [], "total": 0}
                    },

                    columns: [
                        {
                            field: 'emptyid', title: '空看编号', align: 'center',
                            formatter: function (value, row, index) {
                                return "<a type=\'show\' onclick=singleback(" + row.emptyid + ",'feedback')>" + value + "</a>&nbsp;";
                            }
                        },
                        {
                            field: 'houseid', title: '房源编号', align: 'center',
                            formatter: function (value, row, index) {
                                if (row.houseid) {
                                    var houseids = row.houseid.split(' ');
                                    var strhouseids = "";
                                    var leaseurl = "/sales/house/main/leasedetail.htm?houseid=";
                                    var buyurl = "/sales/house/main/buydetail.htm?houseid=";
                                    for (i = 0; i < houseids.length; i++) {
                                        if (row.housekind == 1) {//租赁
                                            strhouseids += '<a target="_blank" href="' + leaseurl + houseids[i] + '" data-houseid="' + houseids[i] + '">' + houseids[i] + '</a><br />';
                                        } else {//买卖
                                            strhouseids += '<a target="_blank" href="' + buyurl + houseids[i] + '" data-houseid="' + houseids[i] + '">' + houseids[i] + '</a><br />';
                                        }

                                    }
                                    return strhouseids;
                                }
                            }

                        },
                        {field: 'strstatus', title: '状态', align: 'center'},
                        {
                            field: 'feedbacknum', title: '反馈套数/空看套数', align: 'center',
                            formatter: function (value, row, index) {
                                return row.feedbacknum + "/" + row.emptylooknum;
                            }
                        },
                        {
                            field: 'createbyname', title: '空看人', align: 'center',
                            formatter: function (value, row, index) {
                            	if(value!=undefined){
                            		return "<a onclick='getUserStaffInfo(" + row.createby + ")'>" + value + "</a>";
                            	}else{
                            		return '-';
                            	}
                                
                            }
                        },
                        {field: 'shopgroupname', title: '空看部门', align: 'left'},
                        {field: 'goouttime', title: '外出时间', align: 'center'},
                        {field: 'backtime', title: '返回时间', align: 'center'}
                    ]
                });
        } else if (type === 'show') {
            content = showBack;
            showBackTable
                .bootstrapTable('destroy')
                .bootstrapTable({
                    url: basePath + '/customer/showings/listview',
                    method: 'post',
                    sidePagination: 'server',
                    dataType: 'json',
                    pagination: true,
                    striped: true,
                    pageSize: 10,
                    pageList: [10, 20, 50],
                    queryParams: function () {
                        var param = {};
                        param.pagesize = 50;
                        param.pageindex = 0;
                        param.ids = no;
                        return param;
                    },
                    responseHandler: function (result) {
                        if (result.code == 0 && result.data && result.data.totalcount > 0) {
                            return {
                                'rows': result.data.rows,
                                'total': result.data.totalcount
                            }
                        }
                        return {
                            'rows': [],
                            'total': 0
                        }
                    },
                    columns: [
                        {field: 'id', title: '带看单号', align: 'center'},
                        {field: 'businesstype', title: '业务类型', align: 'center'},
                        {
                            field: 'customername', title: '客户姓名<br />客户编号', align: 'center',
                            formatter: function (value, row) {
                                var url = '';
                                if (row.businesstypeid == 1) {	//租赁
                                    url = basePath + "/customer/main/findleaseclientbycustomerid.htm?customerId=" + row.customersid;	//	需求id
                                } else if (row.businesstypeid == 2) {	//买卖
                                    url = basePath + "/customer/main/findbuyerclientbycustomerid.htm?customerId=" + row.customersid;
                                }
                                return (value ? value : '-') + '<br />' + (row.client_id ? '<a href=' + url + ' target="_blank">' + row.client_id + '</a>' : '-');
                            }
                        },
                        {field: 'leadusersname', title: '带看人', align: 'center'},
                        {field: 'accompany_name', title: '陪看人', align: 'center'},
                        {
                            field: 'begin_time', title: '预计带看时间<br />返回店面时间', align: 'center',
                            formatter: function (value, row) {
                                return (value ? value : '-') + '<br />' + (row.end_time ? row.end_time : '-');
                            }
                        },
                        {field: 'showingsnum', title: '看房量', align: 'center'},
                        {field: 'leadresult', title: '带看状态', align: 'center'}
                    ]
                });
        }
    	 commonContainer.modal(
    			 '查看列表', content, function(index,layero){
    				 layer.close(index);
    			 },
    			 {
    				 
    				 area: ['800px', '400px'],
    				 btns: ['取消'],
    				 success: function (index) {
    					 
    	             }
    			 }
    			 
    	 );
    }
    // 查看空看记录
    window.showFeedback = showFeedback;
    function showFeedback(emptyid) {
        var dom = $('#show-feedback');
        commonContainer.modal('空看反馈', dom, function (id) {
            layer.close(id);
        }, {
            area: ['80%', '450px'],
            btns: ['关闭']
        });

        jsonGetAjax(basePath + '/house/singlewatch/backbyemptyid', {emptyid: emptyid},
            function (result) {
                if (result.code !== 0) {
                    return layer.msg(result.msg);
                }
                var data = result.data;
                dom.find('[data-bind]').each(function () {
                    var el = $(this);
                    el.text(getValueByExprPath(data, el.attr('data-bind')));
                });
                dom.find('[data-userinfo]').each(function () {// 查看用户信息
                    var el = $(this);
                    var userid = getValueByExprPath(data, el.attr('data-userinfo'));
                    el.on('click', function () {
                        getUserStaffInfo(userid);
                    });
                });
                dom.find('[data-showaddr]').each(function () {// 查看地址
                    var el = $(this);
                    var hosueid = getValueByExprPath(data, el.attr('data-showaddr'));
                    el.on('click', function () {
                        checkAddress(hosueid);
                    });
                });
                dom.find('[data-houselink]').each(function () {// 链接到房源
                    var el = $(this);
                    var houseid = getValueByExprPath(data, el.attr('data-houselink')),
                        housekind = getValueByExprPath(data, el.attr('data-housekind'));
                    this.href = getToHouseInfoHref(houseid, housekind);
                });
            });
    }

    function getValueByExprPath(data, expr) {
        return new Function('$data$', 'with($data$){try{return ' + expr + '} catch(e){ return "" }}')(data);
    }

    // 获取人的信息链接
    function getToUserInfoLink(userid, username) {
    	if(username==undefined){
    		return '';
    	}else{
    		return '<a href="javascript:" onclick="getUserStaffInfo(\'' + userid + '\')">' + username + '</a>';
    	}
    }

    // 获取可以打开房源详细信息的链接
    function getToHouseInfoLink(houseid, housekind) {
        return "<a target='_blank' href=\'" + getToHouseInfoHref(houseid, housekind) + "\' class=\'todo\'>" + houseid + "</a>";
    }

    function getToHouseInfoHref(houseid, housekind) {
        var href;
        if (Number(housekind) === 1) {// 租赁
            href = basePath + '/house/main/leasedetail.htm?houseid=' + houseid; // 租赁
        } else {
            href = basePath + '/house/main/buydetail.htm?houseid=' + houseid; // 买卖
        }
        return href;
    }

    function getToAddressLink(houseid) {
        return '<a href="javascript:" onclick="checkAddress(\'' + houseid + '\')">查看地址</a>';
    }

}(window));