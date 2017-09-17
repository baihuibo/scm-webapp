$(function() {
	$("select").chosen({
		width : "100%"
	});
	$('#J_reset').on('click', function(event) {
		$('.J_chosen').val('');
		$('.J_chosen').trigger('chosen:updated');
		enddate.min='';
		enddate.start='';
		begindate.max='';
	})
	//操作人自动补全查询
	searchContainer.searchUserListByComp($("#J_user"), true, 'right');

	// 部门自动补全查询
	searchDept($('#J_deptName'), true, 'left').then(function () {
        // 显示部门树状结构
        $('#J_deptSelect').off().on('click', function(e) {
            showDeptTree($('#J_deptName'),$("#J_deptLevel"));
        });
    })


	// 初始化录入日期
	var begindate = {
        elem: '#J_begindate',
	    format: 'YYYY-MM-DD',
	    istime: false,
	    choose: function(datas){
	    	enddate.min = datas;
	    	enddate.start = datas
	    }
	}

	var enddate = {
        elem: '#J_enddate',
	    format: 'YYYY-MM-DD',
	    istime: false,
	    choose: function(datas){
	    	begindate.max = datas
	    }
	}

	laydate(begindate);
	laydate(enddate);
	//加载列表数据项
    $('#J_search').on('click', function (event) {
		initListLoad()
		$('#J_log_list').bootstrapTable('destroy');
	});
	function initListLoad(){
        $('#J_log_list').bootstrapTable({
			url:basePath + '/customer/rule/loglistview',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = jQuery('#J_query').serializeObject();
				o.timestamp = new Date().getTime();
				o.userid = currUserId;
				o.pageindex = params.offset / params.limit+ 1,
				o.pagesize = params.limit;
				if(o.begindate) {o.begindate = encodeURI(o.begindate);}
				if(o.enddate) {o.enddate = encodeURI(o.enddate);}
                o.deptid = $("#J_deptName").attr("data-id") || void 0;
                o.level = $("#J_deptLevel").val() || void 0;
				return o;
			},
			responseHandler: function(result) {
				if(result.code == 0 && result.data && result.data.totalcount > 0) {
					return { "rows": result.data.loglist, "total": result.data.totalcount }
				}
                return {"rows": [], "total": 0}
			},

            columns: [
			      	    {field: 'deptname', title: '所属部门', align: 'left',
			      	    	formatter: function(value, row, index) {
						    	var html = '';
			      				var deptname = row.deptname ? row.deptname : '-'
			      				html ='<div class="text-left">'+deptname+'</div>';
					    		return html;
						    }
			      	    },
			      	    {field: 'createbyname', title: '操作人', align: 'center'},
			      	    {field: 'strtype', title: '设置项', align: 'center'},
			      	    {field: 'content', title: '设置结果', align: 'center',
			      	    	formatter: function(value, row, index) {
						    	var html = '';
			      				var content = row.content ? row.content : '-'
			      				html ='<div class="text-left">'+content+'</div>';
					    		return html;
						    }
			      	    },
			      	    {field: 'createtime', title : '操作时间', align : 'center',
			      	    	formatter: function(value, row, index) {
			      	    		createtime = value ? value : '-';
								if(value != undefined){
									var html='';
									html= createtime.substring(0,16);
									return html;
								}
						    }
                        }
			      	],
		})
	}

});