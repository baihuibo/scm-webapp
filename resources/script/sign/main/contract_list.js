$(function(){
	$("select").chosen({
		width : "100%" , 
		no_results_text: "未找到此选项!" 
	});
	
	dimContainer.buildDimChosenSelector($("#J_contractStatus"), "contractStatus","")
	dimContainer.buildDimChosenSelector($("#J_auditStatus"), "contractAuditStatus","")
	
	searchContainer.searchUserListByComp($("#J_user"), true);
	$('#J_deptSelect').on('click', function() {
		showDeptTree($('#J_belongShopGroupId'),$("#J_belongShopGrouplevel"));
	});
	$('#J_reset').on('click', function(event) {
		$('#J_belongShopGrouplevel').val('');
		enddate.min='';
		enddate.start='';
		begindate.max='';
	})	

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
		$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/sign/signthecontract/contractlist'});
		
	});
	//小区名称
	//searchBuild($("#J_communityId"),true,'left');
	function initListLoad(){
		$('#J_dataTable').bootstrapTable({ 
			url:basePath + '/sign/signthecontract/contractlist',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = jQuery('#J_retrieveform').serializeObject();
				o.timestamp = new Date().getTime();
				o.pageIndex = params.offset / params.limit+ 1,
				o.pageSize = params.limit;
				if(o.starttime) {o.starttime = encodeURI(o.starttime);}
				if(o.endtime) {o.endtime = encodeURI(o.endtime);}
				if(o.belongUserId){
					o.belongUserId = encodeURI($("#J_user").attr("data-id"))
				}
				if(o.belongShopGroupId){
					o.belongShopGroupId = encodeURI($("#J_belongShopGroupId").attr("data-id"))
				}
				/*if(o.communityId){
					o.communityId = encodeURI($("#J_communityId").attr("data-id"))
				}*/
				return o;
			},
			responseHandler: function(result) {
				if(result.code == 0 && result.data && result.data.totalcount > 0) {
					$('#sumCustomerCommission').text(result.data.contractlist.sumCustomerCommission)
					$('#sumOwnerCommission').text(result.data.contractlist.sumOwnerCommission)
					return { "rows": result.data.contractlist.contract, "total": result.data.totalcount}
				}
				return { "rows": [], "total": 0 } 
			},
				columns:[         
			      	    {field: 'conId', title: '校验编码', align: 'center'},
			      	    {field: 'contractCode', title: '合同编号', align: 'center',
			      	    	formatter: function(value ,row, index){
	 		      	    		var html='';
	 		      	    		if(row.contractCode){
	 		      	    			html='<a href="../signthecontract/contractdetail.htm?conId='+row.conId+'" target="_blank">'+row.contractCode+'</a>'
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
			      				var ownerName =row.ownerName ? row.ownerName:'-';
			      				html = '<div class="blue_ath">'+customerName+'</div>'+'</br>'+'<div class="red_ath">'+ownerName+'</div>';
			      				return html;
			      	    	}
			      	    },
			      	    {field: 'customerCommission', title: '客户佣金（元）<br/>业主佣金（元）',  align: 'center',
			      	    	formatter: function(value, row, index) {	
			      				var html = '';
			      				var customerCommission = row.customerCommission ? row.customerCommission : '0';
			      				var ownerCommission =row.ownerCommission ? row.ownerCommission:'0';
			      				html = '<div class="text-right blue_ath">￥'+customerCommission+'</div>' +'</br>'+'<div class="text-right red_ath">￥'+ownerCommission+'</div>';
			      				return html;
			      	    	}
			      	    },
			      	    {field: 'transactionPrice', title: '成交价', align: 'center',
			      	    	formatter: function(value, row, index) {
			      	    		var html='';
			      	    		var transactionPrice = row.transactionPrice ? row.transactionPrice : '0';
			      	    		html='<div class="text-right blue_ath">￥'+transactionPrice+'</div>';
			      	    		return html;
			      	    	}
			      	    },
			      	    {field: 'deptname', title: '成交区/成交店', align: 'center'},
			      	    {field: 'belongUserName', title: '成交人',align: 'center',
			      	    	formatter: function(value ,row, index){
	 		      	    		var html='';
	 		      	    		html='<a onclick="getUserStaffInfo('+row.belongUserId+')">'+row.belongUserName+'</a>'
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