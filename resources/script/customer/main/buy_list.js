$(function () {
    commonContainer.showLoading();
    commonContainer.getCurrentUserLevel().then(function (level) {
        if (level > 10) {
            // 初始化所属人
            searchContainer.searchUserListByComp($("#J_user"), true);
            // 部门自动补全查询
            searchDept($('#J_deptName'), true, 'left').then(function () {
                // 显示部门树状结构
                $('#J_deptSelect').off().on('click', function (e) {
                    showDeptTree($('#J_deptName'), $("#J_deptLevel"));
                });
            })

        }else{
            // 去掉所属人和部门
            $('#groupFromItem,#belongUserFromItem').remove();
        }
        commonContainer.hideLoading();
    });

    $("select").chosen({
        width: "100%", no_results_text: "未找到此选项!"
    });
    dimContainer.buildDimChosenSelector($("#businesstype"), "demandType", "");//物业类型
    dimContainer.buildDimChosenSelector($("#status"), "salesStage", "");//销售阶段
    dimContainer.buildDimChosenSelector($("#remarktype"), "finalAssessment", "");//客户评价
    dimContainer.buildDimChosenSelector($("#customertype"), "customerType", "");//客户类型

    $('#J_reset_buy').on('click', function (event) {
        $('.J_chosen').val('');
        enddate.min = '';
        enddate.start = '';
        begindate.max = '';
        $("#datetype").val('1');
        $('.J_chosen').trigger('chosen:updated');
        $('#J_deptLevel').val('');
    })

    // 初始化录入日期
    var begindate = {
        elem: '#J_begindate',
        format: 'YYYY-MM-DD',
        istime: false,
        choose: function (datas) {
            enddate.min = datas;
            enddate.start = datas
        },
    }

    var enddate = {
        elem: '#J_enddate',
        format: 'YYYY-MM-DD',
        istime: false,
        choose: function (datas) {
            begindate.max = datas
        }
    }

    laydate(begindate);
    laydate(enddate);
    jQuery('#J_search').on('click', function (event) {
        if (!buy_query_permission) {
            // return;
        }
        initListLoad();
        $('#J_dataTable').bootstrapTable('refresh', {url: basePath + '/customer/main/listview'});
    });

    function initListLoad() {
        $('#J_dataTable').bootstrapTable({
            // url: basePath + '/customer/main/listview',
            sidePagination: 'server',
            dataType: 'json',
            method: 'post',
            pagination: true,
            striped: true,
            pageSize: 10,
            pageList: [10, 20, 50],
            queryParams: function (params) {
                var o = jQuery('#J_black_form').serializeObject();
                o.timestamp = new Date().getTime();
                /*o.userid = currUserId;*/
                o.pageindex = params.offset / params.limit + 1,
                    o.pagesize = params.limit;
                if (o.begindate) {
                    o.begindate = encodeURI(o.begindate);
                }
                if (o.enddate) {
                    o.enddate = encodeURI(o.enddate);
                }
                if (o.groupid) {
                    o.groupid = encodeURI($("#J_deptName").attr("data-id"))
                }
                if (o.belonguserid) {
                    o.belonguserid = encodeURI($("#J_user").attr("data-id"))
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
                        var html = '';
                        var customername = row.customername ? row.customername : '-';
                        if (buy_view_permission) {
                            html = customername + '</br>' + '<a href="../main/findbuyerclientbycustomerid.htm?customerId=' + row.customersid + '" target="_blank">' + row.customerno + '</a>';
                        } else {
                            html = customername + '<br>' + row.customerno;
                        }
                        return html;
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
                            html = row.guideresult ? row.guideresult : '-'
                        }
                        return html;
                    }
                },
                {field: 'lookhousetime', title: '方便看房时间', align: 'center'},
                {
                    field: 'lastfollowtime', title: '录入时间</br>最后跟进时间', align: 'center',
                    formatter: function (value, row, index) {
                        var html = '';
                        var lastfollowtime = row.lastfollowtime ? row.lastfollowtime : '-'
                        var inputtime = row.inputtime ? row.inputtime : '-'
                        html = inputtime + '</br>' + lastfollowtime;
                        return html;
                    }
                },
                {
                    field: 'belonguser', title: '所属部门</br>所属人', align: 'center',
                    formatter: function (value, row, index) {
                        var html = '';
                        var belonguser = row.belonguser ? row.belonguser : '-'
                        html = '<div class="text-left">' + row.belonggroup + '</br>' + belonguser + '</div>';
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
                },
                {
                    field: 'opt', title: '操作', align: 'center',
                    formatter: function (value, row, index) {
                        var html = '';
                        if (buy_show_add_permission) {
                            if (!row.guideresult || /公客/.test(row.customertype) || /已超期|已取消|无意向|未看/.test(row.guideresult)) {
                                html += '<a type=\"see\" data-id="' + row.customerno + '" data-name="' + row.customername + '" showingsid="' + row.showingsid + '" customersid ="' + row.customersid + '" class=\"btn btn-outline text-left btn-success btn-xs mt-3\">带看</a>&nbsp;&nbsp;';
                            }
                        }
                        html += '<a type=\"wtinfono\" data-id="' + row.customerno + '" customersid="' + row.customersid + '" data-wtinfono="' + (row.wtinfono || '') + '" customersid="' + row.customersid + '" class=\"btn btn-outline btn-success btn-xs mt-3\">委托书</a>';

                        return html;
                    }
                }
            ],
        })
    }

    jQuery('#J_dataTable').delegate('a', 'click', function (event) {
        if (this.type == 'see') {
            var that = this;
            $('#J_guide_dataTable tbody').html('');	// 清空带看房源（？？？是否可修改带看）
            $('#J_cusId').html($(this).data('id'));
            $('#J_cusName').html($(this).attr('data-name'));
            $('#J_checkPhone').attr('data-clientid', $(this).attr('data-id'));
            //$("#J_addForm")[0].reset();
            commonContainer.modal(
                '带看录入',
                $('#J_add_guide_dialog'),
                function (index, layero) {
                    var begintime = $("#seeTime").val();
                    if (!begintime) {
                        commonContainer.alert('请输入预计带看时间');
                        return;
                    }
                    var accompany_id = $('#J_lendusername').attr('data-id');

                    var showingsHouseArr = [];
                    $("#J_guide_dataTable tr").find("td").eq(0).text();
                    $("#J_guide_dataTable tr").each(function () {
                        var id = $(this).find('.btn-green').attr("data-id");
                        var showings_id = {houseid: id}
                        showingsHouseArr.push(showings_id);
                    });
                    if (showingsHouseArr.length == 0) {
                        commonContainer.alert('至少添加一条房源信息');
                        return;
                    }
                    commonContainer.showLoading();
                    jsonPostAjax(basePath + '/customer/showings/insertshowings.htm', {
                            accompany_id: accompany_id, 						//陪看人
                            begintime: begintime, 											//预计带看时间
                            businesstype: 2, 		//业务类型 1：租赁 2：买卖
                            client_id: $(that).attr('data-id'), 								//客户编号
                            customersid: $(that).attr('customersid'),													//需求编号（修改状态时为空）
                            showingsHouseSaveVoList: showingsHouseArr,							//房源信息集合
                            showings_id: $(that).attr('showingsid')									//带看编号
                        },
                        function () {
                            commonContainer.hideLoading();
                            layer.close(index);
                            //刷新页面
                            $('#J_dataTable').bootstrapTable('refresh');
                        });
                },
                {
                    overflow: true,
                    area: ['680px', '80%'],
                    btns: ['保存', '取消'],
                    success: function () {
                        $("#seeTime").val("");
                        $("#J_lendusername").attr({'data-id': ''});
                        $("#J_lendusername").val('');
                    }
                });
        } else if (this.type === 'wtinfono') { // 委托书
            var customersid = $(this).attr('customersid');
            var wtinfono = $(this).attr('data-wtinfono');
            if (wtinfono) {
                proxyNewlyObj.proxyShowInfor(wtinfono, customersid);
            } else {
                proxyNewlyObj.proxyNewlyAdded(customersid, function () {
                    commonContainer.alert('新增委托书成功');
                    $('#J_dataTable').bootstrapTable('refresh', {url: basePath + '/customer/main/listview'});
                });
            }
        }
    })
})
