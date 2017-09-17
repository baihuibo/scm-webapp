$(function(){
	$("select").chosen({
		width : "100%"
	});
	dimContainer.buildDimChosenSelector($("#J_operationtype"), "operationType", "");
	/*dimContainer.buildDimChosenSelector($("#J_keystatus"), "keyStatus", "");*/
	dimContainer.buildDimChosenSelector($("#J_receivetype"), "receiveType", "");
	$('#J_search').on('click', function(event) {
		initListLoad();		
		$('#J_dataTable').bootstrapTable('refresh', { url: basePath + '/house/keyadmin/backlistview.htm'});
	})
	function initListLoad(){
		$('#J_dataTable').bootstrapTable({
			url: basePath + '/house/keyadmin/backlistview.htm',
			sidePagination: 'server',
			dataType: 'json',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams: function (params) {
				var o = jQuery('#J_form').serializeObject();
				o.operationtype = o.operationType;
				delete o.operationType;
				o.receivetype = o.receiveType;
				delete o.receiveType;
				o.timestamp = new Date().getTime();
				o.userid = currUserId;
				o.pageindex = params.offset / params.limit+ 1,
				o.pagesize = params.limit;
				if(o.houseid) {o.houseid = encodeURI(o.houseid);}
				return o;
			},
			responseHandler: function(result) {
				if(result.code == 0 && result.data && result.data.totalcount > 0) {
					return { "rows": result.data.backlist, "total": result.data.totalcount }
				}
				return { "rows": [], "total": 0 } 
			},
			columns: [
		  		{
					field : 'stroperationtype',
					title : '业务类型',
					align : 'center'
				},
				{field : 'houseid',title : '房源编号',align : 'center',
					formatter:function(value,row,index){
			 			var html = '';
			 			if(row.operationtype==1){
			 				html ='<a target="_blank" href="../main/leasedetail.htm?houseid='+row.houseid+'">'+row.houseid+'</a>';
			 			}else{
			 				html ='<a target="_blank" href="../main/buydetail.htm?houseid='+row.houseid+'">'+row.houseid+'</a>';
			 			}
			 			return html;
			 		}
				},
				{
					field : 'rekeyusername',title : '收钥匙人',align : 'center',
					formatter: function(value ,row, index){
	      	    		var html='';
	      	    		if(row.rekeyusername){
	      	    			html='<a onclick="getUserStaffInfo('+row.rekeyuserid+')">'+row.rekeyusername+'</a>'
	      	    		}else{
	      	    			html='-'
	      	    		}
	      	    		return html;
		      	    }
				},
				{
					field : 'inputdate',
					title : '收钥匙时间</br>退钥匙时间',
					align : 'center',
					formatter: function(value, row, index) {	
						var html='';
						html=value +'</br>'+row.canceldate;
						if(row.canceldate == undefined){
							html = value +'</br>'+'-';
						}
						return html;
				    }
				},
				{
					field : 'strstatus',
					title : '钥匙状态',
					align : 'center'
				},
				{field : 'strreceivetype',title : '领取类型',align : 'center'},
				{
					field : 'receiveusername',
					title : '领取人',
					align : 'center',
					formatter: function(value ,row, index){
	      	    		var html='';
	      	    		var receiveusername=row.receiveusername ? row.receiveusername:'-';
	      	    		if(row.receivetype==3 && row.receiveusername!=undefined){
		      	    			html='<a onclick="getUserStaffInfo('+row.receiveuserid+')">'+receiveusername+'</a>'
	      	    		}else{
	      	    				html='<div>'+receiveusername+'</div>'
	      	    		}
	      	    		return html;
		      	    }
				},
				{
					field : 'stroperationtype',
					title : '操作',
					align : 'center',
					formatter : function(value, row,index) {
						var html='';
						if($("#temp_view").val()!=undefined){
						html = "<div class='text-left'><a href="+basePath+"/house/keyadmin/detail.htm?id="+row.id+" data-opt=\'Inquire\' class=\'btn btn-outline btn-success btn-xs\' data-node=\'#node#\' target=\'_blank\'>查看</a>&nbsp;&nbsp;</div>"
						}
						return html;
					}
				}
			]
		});	
	}
	
});