var houseId = getQueryString("housesid");

function historylist() {
    $('#J_hisdataTable').bootstrapTable({
        url: basePath + '/house/basichistory/historylist',
        sidePagination: 'server',
        dataType: 'json',
        method: 'get',
        pagination: true,
        striped: true,
        pageSize: 10,
        pageList: [10, 20, 50],
        queryParams: function (params) {
            var o = {};
            o.timestamp = new Date().getTime();
            o.housesid = houseId;
            o.pageindex = params.offset / params.limit + 1,
                o.pagesize = params.limit;
            return o;
        },
        responseHandler: function (result) {
            if (result.code == 0 && result.data && result.data.totalcount > 0) {
                return {"rows": result.data.historylist, "total": result.data.totalcount}
            }
            return {"rows": [], "total": 0}
        },

        columns: [
            {
                field: 'housesid', title: '房源编号', align: 'center',
                formatter: function (value, row, index) {
                    var html = '';
                    if (row.housekind == 1) {
                        html = '<a target="_blank" href="../main/leasedetail.htm?houseid=' + row.housesid + '">' + row.housesid + '</a>';
                    } else {
                        html = '<a target="_blank" href="../main/buydetail.htm?houseid=' + row.housesid + '">' + row.housesid + '</a>';
                    }
                    return html;
                }

            },
            {
                field: 'housekind', title: '业务类型', align: 'center',
                formatter: function (value, row, index) {
                    var html = '';
                    if (row.housekind == 1) {
                        html = '租赁';
                    } else if (row.housekind == 2) {
                        html = '买卖';
                    }
                    return html;
                }
            },
            {
                field: 'uname', title: '录入人', align: 'center',
                formatter: function (value, row, index) {
                    var html = '';
                    html = '<a onclick="getUserStaffInfo(' + row.usid + ')">' + row.uname + '</a>'
                    return html;
                }
            },
            {field: 'belongdepartment', title: '录入部门', align: 'center'},
            {field: 'bookintime', title: '录入时间', align: 'center'},
            {
                field: 'finalassessmentid', title: '房源评价', align: 'center',
                formatter: function (value, row, index) {
                    var html;
                    if (row.finalassessmentid == 1) {
                        if (row.housekind == 1) {
                            html = '可租';
                        } else if (row.housekind == 2) {
                            html = '可售';
                        }
                    } else if (row.finalassessmentid == 2) {
                        if (row.housekind == 1) {
                            html = '暂不租';
                        } else if (row.housekind == 2) {
                            html = '暂不售';
                        }
                    } else if (row.finalassessmentid == 3) {
                        if (row.housekind == 1) {
                            html = '他租';
                        } else if (row.housekind == 2) {
                            html = '他售';
                        }
                    } else if (row.finalassessmentid == 4) {
                        html = '无效';
                    } else if (row.finalassessmentid == 5) {
                        html = '成交';
                    }

                    return html;
                }
            },
            {
                field: 'housesid', title: '电话', align: 'center',
                formatter: function (value, row, index) {
                    var html = '';
                    html = '<a onclick="checkPhone(' + row.housesid + ')" href="javascript:void(0);">查看</a>';
                    return html;
                }
            },
            {field: 'price', title: '成交价格</br>/委托价', align: 'center'}
        ],
    })
}

function getQueryString(name) { // js获取url地址以及 取得后面的参数
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
} 