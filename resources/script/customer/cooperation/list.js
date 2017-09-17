$(function(){
	//初始化数据
	$("select").chosen({
		width : "100%"
	});
	
    //业务类型
    dimContainer.buildDimRadio($('#J_businessType'), 'businessType','businessType','1');
	
	//初始化登记人数据
	searchContainer.searchUserListByComp($("#J_takekeyuser"), true, 'left');
	
	//点击清空按钮把登记人data-id 置空
	$('#J_reset').on('click',function(){
		$('#J_takekeyuser').attr('data-id','')
	})

	//加载列表数据项
	$('#J_search').on('click', function(event) {		
		initTable();
		$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/customer/cooperation/cooperationlistview' });
	})

	function initTable() {
        $('#J_dataTable').bootstrapTable({
            // url:basePath + '/customer/cooperation/cooperationlistview',
            sidePagination: 'server',
            dataType: 'json',
            method:'post',
            pagination: true,
            striped: true,
            pageSize: 10,
            pageList: [10, 20, 50],
            queryParams : function(params) {
                var o = jQuery('#J_query').serializeObject();
                var dataid = $('#J_takekeyuser').attr('data-id');
                o.usersid = dataid;
                o.timestamp = new Date().getTime();
                o.pageindex = params.offset / params.limit+ 1;
                o.pagesize = params.limit;

                return o;
            },
            responseHandler: function(result) {
                if(result.code == 0 && result.data && result.data.totalcount > 0) {
                    return { "rows": result.data.cooperationlist, "total": result.data.totalcount }
                }
                return { "rows": [], "total": 0 }
            },

            columns:[
                {field: 'strbusinesstype', title: '业务类型', align: 'center'},
                {field: 'customername', title: '客户姓名<br />客户编号', align: 'center',
                    formatter: function(value, row, index) {
                        var url = '';
                        if (row.businesstype == 1 && lease_view_permission) {// 跳转到租赁详情
                            url = basePath + "/customer/main/findleaseclientbycustomerid.htm?cooperation=true&customerId=" + row.customerid;
                        } else if (row.businesstype == 2 && buy_view_permission) {// 跳转到买卖详情
                            url = basePath + "/customer/main/findbuyerclientbycustomerid.htm?cooperation=true&customerId=" + row.customerid;
                        }
                        var html = (row.customername || '-') + "<br />";
                        if (url) {
                            html += '<a href="' + url + '" data-opt="contract" target="_blank">"' + row.clientid + '"</a>';
                        }else{
                            html += row.clientid || '-';
                        }
                        return html;
                    }
                },
                {field: 'username', title: '登记人', align: 'center'},
                {field: 'belongusername', title: '归属人', align: 'center'},
                {field: 'sharename', title: '共享人', align: 'center'},
                {field: 'cooperationtime', title : '合作时间', align : 'center',
                    formatter: function(value, row, index) {
                        cooperationtime = value ? value : '-';
                        if(value != undefined){
                            var html='';
                            html= cooperationtime.substring(0,19);
                            return html;
                        }
                    }
                }
            ]
        })
    }
})		