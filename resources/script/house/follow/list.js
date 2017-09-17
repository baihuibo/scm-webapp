$(function() {
	$("select").chosen({
		width : "100%"
	});
	$('#J_reset').on('click', function(event) {
		$('.J_chosen').val('');
		$('.J_chosen').trigger('chosen:updated');
		$("#J_deptName").attr("data-id",'');
		$('#J_user').attr('data-id','');
		endtime.min='';
		endtime.start='';
		starttime.max='';
		houseendtime.min = '';
    	houseendtime.start = '';
    	housestarttime.max = '';
	})
	//初始化业务类型数据
	dimContainer.buildDimChosenSelector($("#J_businessType"), "businessType", "");
	//规划用途复选
	dimContainer.buildDimCheckBoxHasAll($('#J_plannedUses'), 'plannedUses', 'plannedUses', 'all','全部');
	//初始化跟进方式数据
	dimContainer.buildDimChosenSelector($("#J_followWay"), "followWay", "");
	//初始化房源评价跟进数据
	dimContainer.buildDimChosenSelector($("#J_SellerHouseEvaluate"), "SellerHouseEvaluate", "");
	
	
	//楼盘名称自动补全查询
	//searchBuild($("#J_build"), true, 'left');
	
	//所属人自动补全查询
	searchContainer.searchUserListByComp($("#J_user"), true, 'left');
	// 显示部门树状结构
	$('#J_deptSelect').on('click', function() {
		showDeptTree($('#J_deptName'), $('#J_deptLevel'));
	});
	
	// 初始化录入日期
	var starttime = {
		elem: '#J_starttime',  
	    format: 'YYYY-MM-DD',
	    istime: false,
	    choose: function(datas){
	    	endtime.min = datas;
	    	endtime.start = datas
	    }
	}
	
	var endtime = {
		elem: '#J_endtime',  
	    format: 'YYYY-MM-DD',
	    istime: false,
	    choose: function(datas){
	    	starttime.max = datas
	    }
	}
	
	var housestarttime = {
		elem: '#J_housestarttime',  
	    format: 'YYYY-MM-DD',
	    istime: false,
	    choose: function(datas){
	    	houseendtime.min = datas;
	    	houseendtime.start = datas
	    }
	}
	
	var houseendtime = {
		elem: '#J_houseendtime',  
	    format: 'YYYY-MM-DD',
	    istime: false,
	    choose: function(datas){
	    	housestarttime.max = datas
	    }
	}
	
	laydate(starttime);
	laydate(endtime);
	laydate(housestarttime);
	laydate(houseendtime);
	
	$('#J_endtime').on('change', function() {
		starttime.max = '';
	});
	$('#J_houseendtime').on('change', function() {
		housestarttime.max = '';
	})
	
	//加载列表数据项
	$('#J_search').on('click', function(event) {
		$('#J_dataTable').bootstrapTable({ 
			url:basePath + '/house/follow/list',
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
				o.userid = $('#J_user').attr('data-id');
				o.pageindex = params.offset / params.limit+ 1,
				o.pagesize = params.limit;
				if(o.deptid){
					o.deptid = $("#J_deptName").attr("data-id");
				}
				if(o.level){
					o.level = $("#J_deptLevel").val();
				}
				if(o.begindate) {o.begindate = encodeURI(o.begindate);}
				if(o.enddate) {o.enddate = encodeURI(o.enddate);}
				return o;
			},
			responseHandler: function(result) {
				if(result.code == 0 && result.data && result.data.totalcount > 0) {
					return { "rows": result.data.list, "total": result.data.totalcount }
				}
				return { "rows": [], "total": 0 } 
			},
	
			columns:[			         
			      	    {field: 'houseid', title: '房源编号', align: 'center',
			      	    	formatter: function(value, row, index) {	
			      				var html = '';
			      				var url = '';
			      				if (row.businesstype == '1') {// 跳转到租赁详情
			      					url = basePath+"/house/main/leasedetail.htm?houseid="+row.houseid;
			      				} else if (row.businesstype == '2') {// 跳转到买卖详情
			      					url = basePath+"/house/main/buydetail.htm?houseid="+row.houseid;
			      				}
			      				html = "<a href="+url+" target='_blank'>"+ row.houseid +"</a>";
			      				return html;
			      	    	}
			      	    },
			      	    {field: 'strbusinesstype', title: '业务类型', align: 'center'},
			      	  {field: 'strplanneduses', title: '规划用途', align: 'center'},
			      	    {field: 'createtime', title : '跟进时间', align : 'center',
			      	    	formatter: function(value, row, index) {
			      	    		createtime = value ? value : '-';
								if(value != undefined){
									var html='';
									html= createtime.substring(0,19);
									return html;
								}
						    }
			      	    },
			      	    {field: 'createbyname', title: '跟进人', align: 'center',
			      	    	formatter: function(value, row, index) {
					    		var userId = row.createby;
								var html='';
								if(value=='' || value==undefined)
									html = '-';
								else
									html= '<a onclick="getUserStaffInfo('+userId+')" target="_blank">'+ value +'</a>';
								return html;
						    }
			      	    },
			      	    {field: 'deptname', title: '跟进部门', align: 'center',
			      	    	formatter: function(value, row, index) {
				      			var deptname = value ? value : '-';
				      			if(row.content != undefined){
				      				var html = '';		    
			      	    			html = '<div class="text-left">'+deptname+'</div>';
			      	    			return html;
				      			}
			      	    	}
			      	    },
				      	{field: 'buildingname', title: '楼盘名', align: 'center'},
				      	{field: 'content', title: '跟进内容', align: 'center',
				      		formatter: function(value, row, index) {
				      			var content = value ? value : '-';
				      			if(row.content != undefined){
				      				var html = '';		    
			      	    			html = '<div class="text-left">'+row.content+'</div>';
			      	    			return html;
				      			}
			      	    	}
				      	},
				      	{field: 'opt', title: '操作', align: 'center',
				      		formatter: function(value, row, index) {
			      		    	var html = '';	
			      		    	if($("#temp_delete").val()!=undefined){
			      		    		html = '<div class="text-left"><a type="del" data-followid="'+row.id+'" class="btn btn-outline btn-danger btn-xs">删除</a></div>';	
			      		    	}			      	    			
			      	    		return html;
			      	    	}
				      	}
			      	],
		})
	
		$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/house/follow/list' });
	});
	
	//跟进删除
	$('#J_dataTable').delegate('a','click',function(event){
		var followid = $(this).attr('data-followid')
		if(this.type=='del'){
			var followid = $(this).attr('data-followid');
			commonContainer.confirm(
				'是否确认删除此条数据？',
				function(index, layero){
					 jsonGetAjax(
						basePath + '/house/follow/delete',
						{"followId" : followid},
						function(){
							layer.msg("删除成功");
							jQuery('#J_dataTable').bootstrapTable('refresh');
						}
					)
				}
			);
		}
	})
});
