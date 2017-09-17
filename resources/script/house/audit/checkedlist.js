$(function(){
	//初始化数据
	$("select").chosen({
		width : "100%", no_results_text: "未找到此选项!"
	});
	
	$('#J_reset').on('click', function(event) {
		$('.J_chosen').val('');
		$('.J_chosen').trigger('chosen:updated');
		$('#J_build').attr('data-id','');
		$("#J_deptName").attr("data-id",'');
		$('#J_user').attr('data-id','');
		$("#J_deptLevel").val("");
		auditendtime.min='';
		auditendtime.start='';
		auditstarttime.max='';
		flowendtime.min='';
		flowendtime.start='';
		flowstarttime.max='';
	})
	
	//初始化审核类型数据
	dimContainer.buildDimChosenSelector($("#J_auditstep"), "houseAuditType", "")
	
	//初始化业务类型数据
	dimContainer.buildDimChosenSelector($("#J_businessType"), "businessType", "");
	
	//规划用途复选
	dimContainer.buildDimCheckBoxHasAll($('#J_plannedUses'), 'plannedUses', 'plannedUses', 'all','全部');
	
	//楼盘名称自动补全查询
	searchBuild($("#J_build"), true, 'right');
	
	//所属人自动补全查询
	searchContainer.searchUserListByComp($("#J_user"), true, 'left');
	
	// 显示部门树状结构
    $('#J_deptSelect').on('click', function() {
        showDeptTree($('#J_deptName'), $('#J_deptLevel'), '');
    });
	// 初始化录入日期
	var auditstarttime = {
		elem: '#J_auditstarttime',  
	    format: 'YYYY-MM-DD',
	    istime: false,
	    choose: function(datas){
	    	auditendtime.min = datas;
	    	auditendtime.start = datas;
	    }
	}
	
	var auditendtime = {
		elem: '#J_auditendtime',  
	    format: 'YYYY-MM-DD',
	    istime: false,
	    choose: function(datas){
	    	auditstarttime.max = datas;
	    }
	}
	var flowstarttime = {
			elem: '#J_flowstarttime',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	flowendtime.min = datas;
		    	flowendtime.start = datas;
		    }
		}
		
	var flowendtime = {
		elem: '#J_flowendtime',  
	    format: 'YYYY-MM-DD',
	    istime: false,
	    choose: function(datas){
	    	flowstarttime.max = datas;
	    }
	}
	
	laydate(auditstarttime);
	laydate(auditendtime);
	laydate(flowstarttime);
	laydate(flowendtime);
	
	$('#J_auditendtime').on('change', function() {
		auditstarttime.max = '';
	});
	$('#J_flowendtime').on('change', function() {
		flowstarttime.max = '';
	})
	
})

//按条件查询跟进列表
$('#J_search').on('click', function(event) {
	searchTableDatas();
	jQuery('#J_dataTable').bootstrapTable('refresh', {url: basePath + '/house/audit/checkedlist'});
});
	
function searchTableDatas() {
	$('#J_dataTable').bootstrapTable({
		url: basePath + '/house/audit/checkedlist',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o = jQuery('#J_query').serializeObject();
			o.timestamp = new Date().getTime();
			if($('#J_user').attr('data-id')){
				o.belonguserid = $('#J_user').attr('data-id');
			}
			
			o.pageindex = params.offset / params.limit+ 1;
			o.pagesize = params.limit;
			if(o.buildingid){
				o.buildingid = $('#J_build').attr('data-id');
			}
			if(o.deptid){
				o.deptid = $("#J_deptName").attr("data-id");
			}
			if(o.level){
				o.level = $("#J_deptLevel").val();
			}
			return o;
		},
		responseHandler: function(result){
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
				return { "rows": result.data.list, "total": result.data.totalcount }
			}
			return { "rows": [], "total": 0 } 
		},
		columns: [ 	
		            {field: 'houseid', title: '房源编号', align: 'center',
		            	formatter: function(value, row, index) {	
		      				var html = '';
		      				var url = '';
		      				if (row.businesstype == '1') {// 跳转到租赁详情
		      					url = basePath+"/house/main/leasedetail.htm?houseid="+row.houseid;
		      				} else if (row.businesstype == '2') {// 跳转到买卖详情
		      					url = basePath+"/house/main/buydetail.htm?houseid="+row.houseid;
		      				}
		      				html = '<a href="'+url+'" target="_blank">'+ row.houseid +'</a>';
		      				return html;
		      	    	}
		           	},
				    {field: 'strauditstep', title: '审核类型', align: 'center'},
				    {field: 'strbusinesstype', title: '业务类型', align: 'center'},
				    {field: 'planneduses', title: '规划用途', align: 'center'},
				    {field: 'buildingname', title: '楼盘名', align: 'center'},
				    {field: 'deptname', title: '所属部门', align: 'center',
				    	formatter: function(value, row, index) {
					    	var html = '';
		      				var deptname = row.deptname ? row.deptname : '-'
		      				html ='<div class="text-left">'+deptname+'</div>';
				    		return html;
					    }
				    },
				    {field: 'belongusername', title: '所属人', align: 'center',
				    	formatter: function(value, row, index) {
				    		var userId = row.belonguserid;
							var html='';
							if(value=='' || value==undefined)
								html = '-';
							else
								html= '<a onclick="getUserStaffInfo('+userId+')" target="_blank">'+ value +'</a>';
							return html;
					    }
				    },
				    {field: 'starttime', title: '流程开始时间', align: 'center',
				    	formatter: function(value, row, index) {
				    		starttime = value ? value : '-';
							if(value != undefined){
								var html='';
								html= row.starttime.substring(0,19);
								return html;
							}
					    }
				    },
				    {field: 'audittime', title: '审核时间', align: 'center',
				    	formatter: function(value, row, index) {
				    		audittime = value ? value : '-';
							if(value != undefined){
								var html='';
								html= row.audittime.substring(0,19);
								return html;
							}
					    }
				    }
				]
	});
}