$(function(){
	$("select").chosen({
		width : "100%" , 
		no_results_text: "未找到此选项!" 
	});
	dimContainer.buildDimChosenSelector($("#J_contractStatus"), "DraftcontractStatus","")
	dimContainer.buildDimChosenSelector($("#J_auditStatus"), "DraftAuditStatus","")
	searchContainer.searchUserListByComp($("#J_user"), true);
	$('#J_deptSelect').on('click', function() {
		showDeptTree($('#J_belongShopGroupId'),$("#J_belongShopGrouplevel"));
	});
	

	// 初始化录入日期
	var begindate = {
			elem: '#J_beginCrtDttm',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	enddate.min = datas;
		    	enddate.start = datas
		    },
		}
	
	var enddate = {
			elem: '#J_endCrtDttm',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	begindate.max = datas
		    }
		}
	
	laydate(begindate);
	laydate(enddate);
	
	jQuery('#J_search').on('click', function(event){
		initListLoad();
		$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/sign/signthecontract/subsidiaryquery'});
	});

	function initListLoad(){
		$('#J_dataTable').bootstrapTable({ 
			url:basePath + '/sign/signthecontract/subsidiaryquery',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = jQuery('#J_auxiliaryform').serializeObject();
				o.timestamp = new Date().getTime();
				o.pageIndex = params.offset / params.limit+ 1,
				o.pageSize = params.limit;
				if(o.userId){
					o.userId = encodeURI($("#J_user").attr("data-id"))
				}
				if(o.belongShopGroupId){
					o.belongShopGroupId = encodeURI($("#J_belongShopGroupId").attr("data-id"))
				}
				if(o.starttime) {o.starttime = encodeURI(o.starttime);}
				if(o.endtime) {o.endtime = encodeURI(o.endtime);}
				return o;
			},
			responseHandler: function(result) {
				if(result.code == 0 && result.data && result.data.totalcount > 0) {
					//console.log(result.data.recordTotal);
					return { "rows": result.data.subsidiarylist, "total": result.data.totalcount }
				}
				return { "rows": [], "total": 0 } 
			},
				columns:[         
			      	    {field: 'subsidiaryContractType', title: '附属合同类型', align: 'center',
			      	    	formatter: function(value ,row, index){
			      	    		var html="";
	 		      	    		if(row.subsidiaryContractType=='1'){
	 		      	    			html="履约合同"
	 		      	    		}else{
	 		      	    			html="居间合同"
	 		      	    		}
	 		      	    		return html;
	 		      	    	}
			      	    },
			      	    {field: 'subsidiaryContractNum', title: '附属合同编号', align: 'center',
			      	    	formatter: function(value ,row, index){
			      	    		var html="";
			      	    		var subsidiaryContractNum = row.subsidiaryContractNum ? row.subsidiaryContractNum : '-';
			      	    		if(row.subsidiaryContractType=='1'){
			      	    			html='<a target="_blank" href="../signthecontract/appointdetail.htm?subsidiaryContractId='+row.subsidiaryContractId+'&conId='+row.conId+'">'+subsidiaryContractNum+'</a>'
			      	    		}else{
			      	    			html='<a target="_blank" href="../signthecontract/betweendetail.htm?subsidiaryContractId='+row.subsidiaryContractId+'&conId='+row.conId+'">'+subsidiaryContractNum+'</a>'
			      	    		}
			      	    		return html;
	 		      	    	}
			      	    },
			      	    {field: 'contractCode', title: '存量房合同编号', align: 'center',
			      	    	formatter: function(value ,row, index){
			      	    		var html="";
			      	    		var contractCode = row.contractCode ? row.contractCode : '-';
			      	    		if(row.contractCode){
			      	    			html='<a target="_blank" href="../signthecontract/contractdetail.htm?conId='+row.conId+'&other=true">'+contractCode+'</a>'
			      	    		}else{
			      	    			html='-'
			      	    		}
			      	    		return html;
	 		      	    	}
			      	    },
			      	    {field: 'customerName', title: '客户姓名<br/>业主姓名', align: 'center',
			      	    	formatter: function(value, row, index) {	
			      				var html = '';
			      				var customerName = row.customerName ? row.customerName : '-';
			      				var ownerName =row.ownerName ? row.ownerName:'_';
			      				html = customerName +'</br>'+ownerName;
			      				return html;
			      	    	}
			      	    },
			      	   {field: 'deptName', title: '成交部门', align: 'center'},
			      	   {field: 'uname', title: '成交人',align: 'center',
			      		   formatter: function(value ,row, index){
	 		      	    		var html='';
	 		      	    		html='<a onclick="getUserStaffInfo('+row.belongUserId+')">'+row.uname+'</a>'
	 		      	    		return html;
	 		      	    	}
			      	   },
			      	   {field: 'crtDttm', title: '提交日期', align: 'center'},
			      	   {field: 'auditStatus', title: '审核状态', align: 'center'},
			      	   {field: 'contractStatus', title: '合同状态', align: 'center'},
			      	],

		})
	
	}
})