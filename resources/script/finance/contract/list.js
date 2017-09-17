$(function(){
	$("select").chosen({
		width : "100%" , no_results_text: "未找到此选项!" 
	});
	// 显示所属部门树状结构
	$('#J_deptSelect').on('click', function() {
		showDeptTree($('#J_deptName'),$("#J_deptLevel"));
	});
	/*dimContainer.buildDimChosenSelector($("#J_contractStatus"), "contractStatus","");*/
	
	// 初始化成交人
	searchContainer.searchUserListByComp($("#J_belongUserId"), true);
	searchContainer.searchUserListByComp($("#J_userId"), true);
	// 初始化录入日期
	var begindate = {
			elem: '#J_startSigningDate',
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	enddate.min = datas;
		    	enddate.start = datas
		    }
		}
	
	var enddate = {
			elem: '#J_endSigningDate',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	begindate.max = datas
		    }
		}
	
	laydate(begindate);
	laydate(enddate);
/*	var startCrtDttm = {
			elem: '#J_startCrtDttm',
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	enddate.min = datas;
		    	enddate.start = datas
		    }
		}
	
	var endCrtDttm = {
			elem: '#J_endCrtDttm',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	begindate.max = datas
		    }
		}
	
	laydate(startCrtDttm);
	laydate(endCrtDttm);*/
	$('#J_reset').on('click', function(event) {
		$('#J_deptLevel').val('');
	})
	
	jQuery('#J_search').on('click', function(event){
		initListLoad();
		$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/finance/contract/contractnumber'});
	});
	function initListLoad(){
		$('#J_dataTable').bootstrapTable({ 
			url:basePath + '/finance/contract/contractnumber',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = jQuery('#J_contractform').serializeObject();
				o.timestamp = new Date().getTime();
				o.pageindex = params.offset / params.limit+ 1,
				o.pagesize = params.limit;
				if(o.belongshopid){
					o.belongshopid = encodeURI($("#J_deptName").attr("data-id"))
				}
				if(o.belongUserId){
					o.belongUserId = encodeURI($("#J_belongUserId").attr("data-id"))
				}
				if(o.userId){
					o.userId = encodeURI($("#J_userId").attr("data-id"))
				}
				return o;
			},
			responseHandler: function(result) {
				if(result.code == 0 && result.data && result.data.totalcount > 0) {
					return { "rows": result.data.contractNumberlist, "total": result.data.totalcount}
				}
				return { "rows": [], "total": 0 } 
			},
			columns:[
				      	{field:'contractCode', title: '合同编号', align: 'center',
				      		formatter: function(value, row, index) {
				      			var html="";
				      			var contractCode=row.contractCode ? row.contractCode:'-';
				      			if(row.contract=='1'){
				      				html='<a target="_blank" href="'+basePath+'/sign/detail/detail.htm?conId='+row.conId+'">'+contractCode+'</a>'
				      			}else if(row.contract=='2'){
				      				html='<a target="_blank" href="'+basePath+'/sign/signthecontract/contractdetail.htm?conId='+row.conId+'">'+contractCode+'</a>'
				      			}else if(row.contract=='3'){
				      				html='<a target="_blank" href="'+basePath+'/sign/signthecontract/appointdetail.htm?subsidiaryContractId='+row.subsidiaryContractId+'&conId='+row.conId+'">'+contractCode+'</a>'
				      			}else if(row.contract=='4'){
				      				html='<a target="_blank" href="'+basePath+'/sign/signthecontract/betweendetail.htm?subsidiaryContractId='+row.subsidiaryContractId+'&conId='+row.conId+'">'+contractCode+'</a>'
				      			}
				      			return html;
				      		}
				      	},
				      	{field: 'contractType', title: '业务类型', align: 'center'},
				      	{field: 'contractName', title: '合同类型', align: 'center'},
				      	{field: '', title: '客户姓名<br>业主姓名', align: 'center',
				      		formatter: function(value, row, index) {	
			      				var html = '';
			      				var customerName = row.customerName ? row.customerName : '-';
			      				var ownerName = row.ownerName ? row.ownerName : '-';
			      				html = customerName +'</br>'+ownerName;
			      				return html;
			      	    	}
				      	},
				      	{field: 'belongUserName', title: '成交人', align: 'center',
				      		formatter: function(value ,row, index){
	 		      	    		var html='';
	 		      	    		var belongUserName= row.belongUserName ? row.belongUserName:'-';
	 		      	    		html='<a onclick="getUserStaffInfo('+row.belongUserId+')">'+belongUserName+'</a>'
	 		      	    		return html;
	 		      	    	}
				      	},
				      	{field: 'signingDate', title: '签约时间', align: 'center'},
				      	{field: 'userName', title: '打印人', align: 'center',
				      		formatter: function(value ,row, index){
	 		      	    		var html='';
	 		      	    		if(row.userName){
	 		      	    			html='<a onclick="getUserStaffInfo('+row.userId+')">'+row.userName+'</a>'
	 		      	    		}else{
	 		      	    			html='-';
	 		      	    		}
	 		      	    		
	 		      	    		return html;
	 		      	    	}
				      	},
				      	{field: 'crtDttm', title: '打印时间', align: 'center'},
				      	{field: 'deptName', title: '所属部门', align: 'center'},
				      	{field: 'contractStatus', title: '合同状态', align: 'center'},
				      	{field: 'taskId', title: '流程状态', align: 'center'},
				      	/*{field: '', title: '回收状态', align: 'center'},
				      	{field: '', title: '回收情况', align: 'center'},*/
			],
		})
	}
})