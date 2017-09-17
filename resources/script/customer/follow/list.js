$(function () {

    commonContainer.showLoading();
    commonContainer.getCurrentUserLevel().then(function (level) {
        if (level > 10) {
            // 初始化部门选择和所属人选择联动组件
            // searchContainer.deptLikeUserList($('#groupFromItem'), $('#belongUserFromItem'));

            // 初始化所属人
            searchContainer.searchUserListByComp($("#J_user"), true);

            // 部门自动补全查询
            searchDept($('#J_deptName1'), true, 'left').then(function(){
                // 显示部门树状结构
                $('#J_deptSelect1').off().on('click', function (e) {
                    showDeptTree($('#J_deptName1'), $("#J_level_id1"));
                });
            })

        } else {
            // 去掉所属人和部门
            $('#groupFromItem,#belongUserFromItem').remove();
        }
        commonContainer.hideLoading();
    });

    $("select").chosen({
        width: "100%", no_results_text: "未找到此选项!"
    });

    // 初始化录入日期
    var begindate = {
        elem: '#J_begindate',
        format: 'YYYY-MM-DD',
        istime: false,
        choose: function (datas) {
            enddate.min = datas;
            enddate.start = datas
        }
    };

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

    $('#J_enddate').on('change', function () {
        starttime.max = '';
    })
    //业务类型
    dimContainer.buildDimRadio($('#customertype'), 'customertype','businessType','1');
})
$(function () {
    // 初始化数据
    initEvent();

    function initEvent() {
        // 初始化盘点状态
        dimContainer.buildDimChosenSelector($("#J_type"), "checkType", "");
    }
})

/**
 * 编辑信息
 *
 *
 * @param obj
 * @returns
 */
function view(obj) {
    layer.open({
        title: '客户电话',
        type: 1,
        shift: 1,
        skin: 'layui-layer-lan layui-layer-no-overflow',
        content: $('#demo_layer'),
        area: '500px',
        btn: ['确定'],
        yes: function (index, layero) {
            layer.msg("操作成功");
            layer.close(index);
        },
        cancel: function (index, layerno) {
        }
    });
};

/**
 * 删除信息
 *
 * @param id
 * @returns
 */
//删除
$("#J_del").on("click", function () {

    if ($("input[name='btSelectItem']:checked").length == 0) {
        layer.alert("请选择需要删除的跟进信息");
        return false;
    }

    var validArr = [];
    //var invalidCount = 0;
    $("input[name='btSelectItem']:checked").each(function () {
        validArr.push($(this).next().attr("customerid"));
    })
    //var clientid = $(this).attr('data-clientid');
    commonContainer.confirm(
        '是否确认删除信息？', function (index, layero) {
            /*function(index, layero){
                jsonPostAjax(
                    basePath + '/customer/follow/deletefollow',
                    {"clientid" : validArr},
                    function(){
                        layer.msg("删除成功");
                        jQuery('#J_dataTable_list').bootstrapTable('refresh');
                    }
                )
            }*/
            $.ajax({
                url: basePath + '/customer/follow/deletefollow?userid=' + currUserId,
                data: JSON.stringify(validArr),
                type: 'post',
                dataType: 'json',
                cache: false,
                contentType: "application/json ; charset=utf-8",
                success: function (result) {
                    if (result.code == '0') {
                        layer.msg("删除成功");
                        jQuery('#J_dataTable_list').bootstrapTable('refresh');
                    } else {
                        layer.alert(result.msg);
                    }
                }
            })
        }
    );
});

function del(id) {
    $(this).remove();
}

//全选
$('#J_checkall').on('click', function () {
    //
    if (this.checked) {
        $("input[name='list']").prop('checked', true);
    } else {
        $("input[name='list']").prop('checked', false);
    }
});

//按条件查询跟进列表
$('#J_search').on('click', function (event) {
    searchTableDatas();
    jQuery('#J_dataTable_list').bootstrapTable('refresh', {url: basePath + '/customer/follow/listview'});
});

function searchTableDatas() {
    //var totalcount = 0;
    $('#J_dataTable_list').bootstrapTable({
        url: basePath + '/customer/follow/listview',
        sidePagination: 'server',
        dataType: 'json',
        method: 'post',
        pagination: true,
        striped: true,
        pageSize: 10,
        pageList: [10, 20, 50],
        queryParams: function (params) {
            //alert(111);
            var o = jQuery('#J_query').serializeObject();
            o.timestamp = new Date().getTime();
            //o.userid = currUserId;
            o.pageindex = params.offset / params.limit + 1;
            o.pagesize = params.limit;
            o.type = 1;
            o.checkData = true;
            o.userid = $('#J_user').attr('data-id');
            //shopgroupid
            o.shopgroupid = $('#J_deptName1').attr('data-id');
            return o;
        },
        responseHandler: function (result) {
            //alert(1);
            console.log(result.data);
            if (result.code == 0 && result.data && result.data.totalcount > 0) {
                return {"rows": result.data.rows, "total": result.data.totalcount}
            }
            return {"rows": [], "total": 0}
        },
        columns: [
            {
                field: 'id', title: '序号', checkbox: true, align: 'center',
                formatter: function (value, row, index) {
                    var html = '';
                    html = '<input type="hidden" name="customerType" customerid="' + row.id + '"/>';
                    return html;
                }
            },
            {field: 'customertype', title: '业务类型', align: 'center'},
            {
                field: 'name', title: '客户姓名</br>(客户编号)', align: 'center',
                formatter: function (value, row, index) {
                    console.log(row);
                    var html = '';
                    var customername = row.customername ? row.customername : '-';
                    var clientid = row.clientid;
                    var customerid = row.customerid;
                    var customertypeid = row.customertypeid;
                    //alert(customertypeid);

                    if (customertypeid == 1 && lease_view_permission) {
                        html = customername + '</br>' + '<a target="_blank" href="/sales/customer/main/findleaseclientbycustomerid.htm?customerId=' + customerid + '">' + clientid + '</a>';
                    } else if (customertypeid == 2 && buy_view_permission) {
                        html = customername + '</br>' + '<a target="_blank" href="/sales/customer/main/findbuyerclientbycustomerid.htm?customerId=' + customerid + '">' + clientid + '</a>';
                    } else {
                        html = customername + '</br>' + clientid;
                    }

                    return html;
                }
            },
            {
                field: 'shopgroup', title: '所属部门', align: 'center',
                formatter: function (value, row, index) {
                    var html = '';
                    html = '<div class="text-left" style="padding-left:6px;">';
                    html += value;
                    html += '</div>';
                    return html;
                }
            },
            {field: 'createbyname', title: '所属人', align: 'center'},
            {field: 'createtime', title: '跟进时间', align: 'center'},
            {
                field: 'content', title: '跟进内容', align: 'center', formatter: function (value, row, index) {
                var content = row.content ? row.content : '-';
                return '<div class="remark_all text-left">' + content.encodeHTML() + '</div>';
            }
            }
        ]
    });
}


