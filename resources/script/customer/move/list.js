/**
 * 编辑信息
 * @param obj
 * @returns
 */

//初始化数据
$(function () {
    $("select").chosen({
        width: "100%", no_results_text: "未找到此选项!"
    });
    //基础数据
    //销售阶段
    dimContainer.buildDimChosenSelector($("#J_finalstatusid"), "salesStage", "");

    //业务类型
    dimContainer.buildDimRadio($('#J_businessType'), 'customertype','businessType','1');

    //未跟进时间
    dimContainer.buildDimChosenSelector($("#J_querydate"), "dateUtil", "");

    //未跟进项
    dimContainer.buildDimChosenSelector($("#J_querytype"), "noFollowType", "");

    //客户评价
    dimContainer.buildDimChosenSelector($("#J_finalassessmentid"), "finalAssessment", "");

    //客户类型
    dimContainer.buildDimChosenSelector($("#J_clienttype"), "customerType", "");

    commonContainer.getCurrentUserLevel().then(function (level) {
        if (level > 10) {
            //第一页
            // 部门自动补全查询
            searchDept($('#J_deptName'), true, 'left').then(function () {
                // 显示部门树状结构
                $('#J_deptSelect').off().on('click', function (e) {
                    showDeptTree($('#J_deptName'), $('#J_level_id'));
                });
            });

            //主页面
            // 初始化所属人
            searchContainer.searchUserListByComp($("#J_user"), true);
        }else{
            $('#J_deptFrom,#J_userForm').remove();
        }
    });

    //客源调配
    // 部门自动补全查询(弹框1)
    //searchDept($('#J_deptName1'), false, 'left');
    // 显示部门树状结构(弹框1)
    searchDept($('#J_deptName1'), true, 'left').then(function () {
        // 显示部门树状结构
        $('#J_deptSelect1').off().on('click', function (e) {
            showDeptTree($('#J_deptName1'), $("#J_level_id1"));
        });
    });
    searchContainer.searchUserListByComp($("#J_user1"), true); // 初始化所属人
    //弹框1

    // 部门自动补全查询(弹框2)
    searchDept($('#J_deptName2'), true, 'left').then(function () {
        // 显示部门树状结构
        $('#J_deptSelect2').off().on('click', function (e) {
            showDeptTree($('#J_deptName2'), $("#J_level_id2"));
        });
        level2userType($('#J_deptName2') , $('#J_user2'));
    });

    //全部调配
    // 部门自动补全查询(弹框1)
    //searchDept($('#J_deptName3'), false, 'left');
    // 显示部门树状结构(弹框1)
    // 部门自动补全查询
    searchDept($('#J_deptName3'), true, 'left').then(function () {
        // 显示部门树状结构
        $('#J_deptSelect3').off().on('click', function (e) {
            showDeptTree($('#J_deptName3'), $("#J_level_id3"));
        });
    });
    searchContainer.searchUserListByComp($("#J_user3"), true);// 初始化所属人

    // 部门自动补全查询(弹框2)
    searchDept($('#J_deptName4'), true, 'left').then(function () {
        // 显示部门树状结构
        $('#J_deptSelect4').off().on('click', function (e) {
            showDeptTree($('#J_deptName4'), $("#J_level_id4"));
        });

        level2userType($('#J_deptName4') , $('#J_user4'));
    });

    function level2userType($input , $userType) {
        $input.on('onSetSelectValue' , function (e , data) {
            var userType = levelMapper[data.level] || [];
            $userType.val(userType[0] || '').attr('data-id' , userType[1] || '');
        });
    }
    // searchContainer.searchUserListByComp($("#J_user4"), true);// 初始化所属人

    window.levelMapper = {
        1: ['大区公客', 4],
        2: ['组团公客', 3],
        3: ['店租公客', 2],
    };
});

//按条件查询客源调配列表
var searchParam = null;
$('#J_search').on('click', function (event) {
    searchTableDatas();
    jQuery('#J_dataTable_list').bootstrapTable('refresh', {url: basePath + '/customer/move/getmovelist'});

    // 拼接查询条件
    //searchParam.belonguserid=$('#J_user').attr('data-id');

    searchParam = $('#J_query').serializeObject();

    //console.log(searchParam);
});

$('#J_reset').on('click', function () {
    $('#J_level_id,#J_deptName,#J_user').val('').attr('data-id', '');
});

function searchTableDatas() {
    $('#J_dataTable_list').bootstrapTable({
        url: basePath + '/customer/move/getmovelist',
        sidePagination: 'server',
        dataType: 'json',
        method: 'post',
        pagination: true,
        striped: true,
        pageSize: 10,
        pageList: [10, 20, 50],
        queryParams: function (params) {
            var o = jQuery('#J_query').serializeObject();
            o.timestamp = new Date().getTime();
            o.userid = currUserId;
            o.pageindex = params.offset / params.limit + 1;
            o.pagesize = params.limit;
            o.deptid = $('#J_deptName').attr('data-id') || void 0;
            o.belonguserid = $('#J_user').attr('data-id') || void 0;
            return o;
        },
        responseHandler: function (result) {
            console.log(result.data)
            if (result.code == 0 && result.data && result.data.totalcount > 0) {
//				clientids='';
//				$.each(result.data.list, function(n, value) {
//					clientids+=value.clientid+',';
//	    	    })
//	    	    console.log(clientids);
                return {"rows": result.data.list, "total": result.data.totalcount}
            }
            return {"rows": [], "total": 0}
        },
        columns: [
            {
                field: 'id', title: '序号', checkbox: true, align: 'center',
                formatter: function (value, row, index) {
                    var html = '';
                    html = '<input type="hidden"  name="customerType" clientid="' + row.clientid
                        + '" clienttype="' + row.clienttype + '"/>';
                    return html;
                }
            },
            {field: 'assessment', title: '评价', align: 'center'},
            {
                field: 'name', title: '客户姓名</br>客户编号', align: 'center',
                formatter: function (value, row, index) {
                    var customername = row.customername || '-';
                    var html = customername + '</br>';
                    var clientid = row.clientid || '-';
                    var customerid = row.customerid;
                    var customert = row.customertype;
                    if (customert == 1 && lease_view_permission) {
                        html += '<a target="_blank"  href="/sales/customer/main/findleaseclientbycustomerid.htm?customerId=' + customerid + '">' + clientid + '</a>';
                    } else if (customert == 2 && buy_view_permission) {
                        html += '<a target="_blank"  href="/sales/customer/main/findbuyerclientbycustomerid.htm?customerId=' + customerid + '">' + clientid + '</a>';
                    } else{
                        html += clientid;
                    }
                    return html;
                }
            },
            {field: 'strcustomertype', title: '业务类型', align: 'center'},
            {field: 'salestatus', title: '销售阶段', align: 'center'},
            {field: 'leadresult', title: '带看状态', align: 'center'},
            {
                field: 'lastfollowdate', title: '最后跟进时间', align: 'center', formatter: function (value, row, index) {
                var html = '';
                //alert(lastfollowdate)
                if (row.lastfollowdate == undefined || row.lastfollowdate == '') {
                    html += '-'
                } else {
                    var valus = value.substring(0, value.length - 3);
                    html += valus// + '<br/>' + row.createtime;
                }

                return html;
            }
            },
            {
                field: 'Belongs', title: '所属部门</br>所属人', align: 'center',
                formatter: function (value, row, index) {
                    var html = '';
                    var deptname = row.deptname ? row.deptname : '-'
                    var username = row.username ? row.username : '-'
                    html = deptname + '</br>' + username;
                    return html;
                }
            },
            {
                field: 'clienttype', title: '客户类型', formatter: function (value, row, index) {
                var html = '';
                var cilenttypeid = row.cilenttypeid;
                html += '<div id=' + cilenttypeid + '>' + row.clienttype + '</div>'
                return html;
            }
            }

        ]
    });
}

//全部调配
$('input:radio[name="lists"]').change(function () {
    var list = $('input:radio[name="lists"]:checked').val();
    if (list == 2) {
        //event.stopPropagation()
        // alert("请选中一个!");
        // console.log(222)
        $('#male').css('display', 'none');
        $('#Private1').css('display', 'block');
        // return false;
    }
    else {
        console.log(555)
        $('#male').css('display', 'block');
        $('#Private1').css('display', 'none');
    }
});
//全部调配
$(document).delegate('#J_deploy_all', 'click', view);

//全部调配
function view(obj) {
    commonContainer.showLoading();
    jsonPostAjax(basePath + '/customer/move/getmovelist', (function (params) {
        var o = jQuery('#J_query').serializeObject();
        o.timestamp = new Date().getTime();
        o.userid = currUserId;
        o.deptid = $('#J_deptName').attr('data-id') || void 0;
        o.belonguserid = $('#J_user').attr('data-id') || void 0;
        return o;
    }()) , function (result) {
        commonContainer.hideLoading();
        if (result.data.totalcount > 0) {
            openMoveLayer();
        } else {
            layer.alert('没有需要调配的客户');
        }
    });

    function openMoveLayer() {// 调配
        layer.open({
            title: '客源调配',
            type: 1,
            shift: 1,
            zIndex: 10,//保证树在上面
            //skin : 'layui-layer-lan layui-layer-no-overflow',
            content: $('#demo_layer'),
            area: ['700px', '320px'],
            btn: ['确定', '取消'],
            yes: function (indexc, layero) {
                if ($("input[id='inlineRadio1']:checked").length == 2) {
                    if (!$("#J_deptName3").attr("data-id")) {
                        layer.alert("请选择所属部门");
                        return false;
                    }
                    if (!$("#J_user3").val()) {
                        layer.alert("请选择所属人");
                        return false;
                    }
                } else {
                    if (!$("#J_deptName4").attr("data-id")) {
                        layer.alert("请选择所属部门");
                        return false;
                    }

                    if (!$("#J_user4").val()) {
                        layer.alert("不支持调配到该部门");
                        return false;
                    }
                }

                var searchParam = {};
                var toclienttype = $(':radio[name="lists"]:checked');
                if (toclienttype.val()) {//调配类型
                    searchParam.movetype = $('input:radio[name="lists"]:checked').val();
                } else {
                    layer.alert("请选择调配类型");
                    return false;
                }
                commonContainer.confirm('是否确认全部调配？', function (index, layero) {
                    var lists = toclienttype.val();
                    if (lists == 2) {//
                        searchParam.toclienttype = 1;//转入客户类型转私客
                        searchParam.touserid = $('#J_user3').attr('data-id');//J_user1
                        //alert($('#J_user1').attr('data-id'));
                        //console.log( $('#J_user1').attr('alt'));
                        searchParam.todeptid = $('#J_deptName3').attr('data-id');//所属部门id
                        searchParam.tolevel = $("#J_level_id3").val();//所属部门层级
                        //alert( $("#J_level_id1").val());
                    } else {
                        searchParam.toclienttype = $('#J_user4').attr('data-id');
                        searchParam.todeptid = $('#J_deptName4').attr('data-id');//所属部门id
                        searchParam.tolevel = $("#J_level_id4").val();//所属部门层级
                        //alert( $("#J_level_id1").val());
                    }
                    //dataArr.push(data);
                    $.ajax({
                        url: basePath + '/customer/move/moveall',
                        data: JSON.stringify(searchParam),
                        type: 'post',
                        dataType: 'json',
                        contentType: "application/json ; charset=utf-8",
                        success: function (result) {
                            if (result.code == '0') {
                                layer.msg("修改成功");
                                layer.close(index)
                                jQuery('#J_dataTable_list').bootstrapTable('refresh');
                            } else {
                                //layer.alert(result.msg);
                                layer.close(index);
                            }
                        }

                    });
                    layer.msg("操作成功");
                    layer.close(indexc);
                });
                return false;
            }
        });
    }
};

//调配
$('input:radio[name="lists1"]').change(function () {
    var list = $('input:radio[name="lists1"]:checked').val();
    if (list == 2) {
        $('#male11').css('display', 'none');
        $('#Private11').css('display', 'block');
    }
    else {
        $('#male11').css('display', 'block');
        $('#Private11').css('display', 'none');
    }
});
//调配
$(document).delegate('#J_deploy', 'click', function (event) {
        var currCustomerType = '';
        var flag = true;
        $("input[name='btSelectItem']:checked").each(function (index, value) {
            if (index == 0) {
                currCustomerType = $(this).next().attr("clienttype");
            } else {
                flag = false;
            }
        });
        if ($("input[name='btSelectItem']:checked").length == 0) {
            layer.alert("请选择客户");
            return false;
        } else {
            view1();
        }
    }
);

//调配
function view1() {
    layer.open({
        title: '客源调配',
        type: 1,
        shift: 1,
        //skin : 'layui-layer-lan layui-layer-no-overflow',
        zIndex: 10,//保证树在上面
        content: $('#demo_layer1'),
        area: ['700px', '320px'],
        btn: ['确定', '取消'],
        yes: function (index, layero) {
            //alert($("#J_user1").val());
            //alert($("input[id='inlineRadio1']:checked").length)
            if ($("input[id='inlineRadio1']:checked").length == 2) {
                if (typeof($("#J_deptName1").attr("data-id")) == "undefined") {

                    layer.alert("请选择所属部门");
                    return false;
                }
                if ($("#J_user1").val() == "") {
                    layer.alert("请选择所属人");
                    return false;
                }
            } else {
                if (!$("#J_deptName2").attr("data-id")) {
                    layer.alert("请选择所属部门");
                    return false;
                }
                if (!$("#J_user2").val()) {
                    layer.alert("不支持调配到该部门");
                    return false;
                }
            }

            //var datas=$('#J_deptName1').attr('data-id');

            var dataArr = {};
            var clientids = '';
            $('input:checkbox[name="btSelectItem"]:checked').each(function () {
                clientids += $(this).next().attr("clientid") + ',';
            });
            clientids = clientids.substr(0, clientids.length - 1);
            //searchParam
            dataArr.clientids = clientids;//客户编号
            dataArr.deptid = $('#J_deptName2').attr('data-id');//所属部门id

            if ('input:radio[name="lists1"]:checked') {//调配类型
                dataArr.movetype = $('input:radio[name="lists1"]:checked').val();
            }
            ;
            var lists1 = $('input:radio[name="lists1"]:checked').val();
            if (lists1 == 2) {//
                dataArr.toclienttype = 1;//转入客户类型转私客
                dataArr.userid = $('#J_user1').attr('data-id');//J_user1
                //alert($('#J_user1').attr('data-id'));
                //console.log( $('#J_user1').attr('alt'));
                dataArr.level = $("#J_level_id1").val();//所属部门层级
                //alert( $("#J_level_id1").val());
            } else {
                dataArr.toclienttype = $('#J_user2').attr('data-id');
                dataArr.level = $("#J_level_id2").val();//所属部门层级
                //alert( $("#J_level_id1").val());
            }
            //dataArr.push(data);
            $.ajax({
                url: basePath + '/customer/move/move',
                data: JSON.stringify(dataArr),
                type: 'post',
                dataType: 'json',
                cache: false,
                contentType: "application/json ; charset=utf-8",
                success: function (result) {
                    if (result.code == '0') {
                        layer.msg("修改成功");
                        layer.close(index)
                        jQuery('#J_dataTable_list').bootstrapTable('refresh');
                    } else {
                        layer.alert(result.msg);
                    }
                }
            });
            layer.msg("操作成功");
            layer.close(index);

            //ajax
            //var dataArr = [];

        }
    });
};
