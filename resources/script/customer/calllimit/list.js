$(function () {
    dimContainer.buildDimChosenSelector($("#businessType"), "businessType", ""); // 业务类型
    searchBuild($("#communityId"), true, 'left'); // 小区
    $('select').chosen(); // 其他选项

    $('#J_search').on('click', function () {// 搜索
        initialListLoad();
        $('#J_dataTable_list').bootstrapTable('refresh', {url: basePath + '/custom/calllimit/listview'});
    });

    //修改查看人
    $('#J_dataTable_list').on('click', 'a.editbtn', function () {
        var el = $(this);
        commonContainer.modal('修改查看人', $('#J_edit_dialog'), function (index, layero) {
            layer.close(index);
        }, {
            area: ['680px', '400px'],
            btns: ['保存', '取消'],
            overflow: true,
            success: function () {
                $('#J_edit_dialog select').chosen('destroy').chosen();
            }
        });
    });

    // 初始化列表
    function initialListLoad() {
        if (initialListLoad.inited) {
            return;
        }
        initialListLoad.inited = 1;
        $('#J_dataTable_list').bootstrapTable({
            method: 'post',
            //url: basePath + '/sign/lease/list',
            sidePagination: 'server',
            dataType: 'json',
            pagination: true,
            striped: true,
            pageSize: 10,
            pageList: [10, 20, 50],
            queryParams: function (params) {
                var o = jQuery('#J_query').serializeObject();

                if (o.communityId) {
                    o.communityId = $("#communityId").attr('data-id');
                } else {
                    o.communityId = void 0;
                }
                o.pageindex = params.offset / params.limit + 1;
                o.pagesize = params.limit;
                return o;
            },
            responseHandler: function (result) {
                if (result.code == 0 && result.data) {
                    return {"rows": result.data, "total": result.data.length}
                }
                return {"rows": [], "total": 0}
            },
            columns: [
                //{field: 'CON_ID', title: '检验编码', align: 'center'},
                {
                    field: 'userCode', title: '房源编号 <br> 客户编号', align: 'center'
                },
                {
                    field: 'userName', title: '业主姓名<br/>客户姓名', align: 'center'
                },
                {
                    field: 'userType', title: '客户类型', align: 'center'
                },
                {field: 'businessType', title: '业务类型', align: 'center'},
                {
                    title: '操作', align: 'center',
                    formatter: function () {
                        return '<a href="javascript:" class="btn btn-success btn-xs editbtn">修改查看人</a>';
                    }
                }
            ]
        });
    }
});