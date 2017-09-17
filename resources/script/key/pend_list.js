$(function(){
	storekeyending.init();
});
var storekeyending={	
	init:function(){
		this.getTotal();
		this.creatorTab();
	},
	//获取待处理总数
	getTotal:function(){
		jsonAjax(basePath+'/house/keyadmin/pendingcount.htm',{},function(calldata){
			$('#J_waitkeycount').html('('+calldata.data.pendingcount+')');
		});
	},
	//创建Dom
	creatorTab:function(){
		var _this=this;
		//房源收钥匙
		$('#dataTable').bootstrapTable('destroy');	//清除之前的数据
		$('#dataTable').bootstrapTable({
			url: basePath+'/house/keyadmin/pendinglistview.htm?math='+Math.random(),
			//设置为服务器分页
			sidePagination: 'server',
			dataType: 'json',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams: function (params) {
				return {
					userid:currUserId,								//用户ID
					querytype: 1,									//查询类型 1：房源收钥匙     2：钥匙转店
					onepage: 1,										//是否分页查询 0:不分页，其他:分页
					pageindex:(params.offset / params.limit+ 1),	//当前页数
					pagesize:params.limit							//每页显示数量
				}
			},
			responseHandler: function(result) {
				//设置为bootstrap table能接收的格式
				if(result.code == 0 && result.data && result.data.totalcount > 0) {
					_this.rekeylist=result.data.rekeylist;
					return { 
						"rows": result.data.rekeylist,
						"total": result.data.totalcount
					}
				}
				return {
					"rows": [],
					"total":0
				} 
			},
			columns:[
				{ 
					field: 'stroperationtype',
					title: '业务类型',
					align: 'center'
			 	},
				{field: 'houseid',title: '房源编号',align: 'center',
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
			    	field: 'rekeyusername',title: '收钥匙人',align: 'center',
			    	formatter: function(value ,row, index){
	      	    		var html='';
	      	    		html='<a onclick="getUserStaffInfo('+row.rekeyuserid+')">'+row.rekeyusername+'</a>'
	      	    		return html;
		      	    }
				},
				{
				    field: 'rekeyboroughname',
					title: '所属区<br />所属组店',
					align: 'center',
					formatter:function(value,row,index){
						return (value?value:'-') +'<br />'+ (row.rekeyshopname?row.rekeyshopname:'-');
					}	
				},
				{
			    	field: 'inputdate',
					title: '收钥匙时间<br />房源地址',
					align: 'center',
					formatter:function(value,row,index){
						return value+'<br />'+row.address;
					}
				},
				{
				    field: 'keynum',
					title: '钥匙数量<br />门禁卡',
					align: 'center',
					formatter:function(value,row,index){
						return value+'把/套'+'<br />共'+row.groupkeynum+'套'+(row.doorcodenum?row.doorcodenum:'0')+'张';
					}
				},
				{
				    field: '',
					title: '操作',
					align: 'center',
					formatter:function(value, row, index){
						var str='';
						/*if($("#temp_confirm").val()!=undefined){*/
							str+='<div class="text-left"><button type="button" data-index='+index+' data-houseId="'+row.houseid+'" class="btn btn-outline btn-success btn-xs mt-3" onclick="storekeyending.creatorPopup(this,0)">收钥匙确认</button>&nbsp;&nbsp;'
						/*}*/
						if($("#temp_reject").val()!=undefined){
							str+='<button data-index='+index+' data-houseId="'+row.houseid+'" class="btn btn-outline btn-danger btn-xs mt-3" onclick="storekeyending.creatorPopup(this,1)">退回</button></div>';
						}
			 			return str;
					}
		    	}
			]
		});
		//钥匙转店
		$('#dataTable2').bootstrapTable('destroy');	//清除之前的数据
		$('#dataTable2').bootstrapTable({
			url: basePath+'/house/keyadmin/pendinglistview.htm?math='+Math.random(),
			//设置为服务器分页
			sidePagination: 'server',
			dataType: 'json',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams: function (params) {
				return {
					userid:currUserId,								//用户ID
					querytype: 2,									//查询类型 1：房源收钥匙     2：钥匙转店
					onepage: 1,										//是否分页查询 0:不分页，其他:分页
					pageindex:(params.offset / params.limit+ 1),	//当前页数
					pagesize:params.limit							//每页显示数量
				}
			},
			responseHandler: function(result) {
				//设置为bootstrap table能接收的格式
				if(result.code == 0 && result.data && result.data.totalcount > 0) {
					_this.changelist=result.data.changelist;
					return {
						"rows": result.data.changelist,
						"total": result.data.totalcount
					}
				}
				return {
					"rows": [],
					"total":0
				} 
			},
			columns:[
				{ 
					field: 'stroperationtype',
					title: '业务类型',
					align: 'center'
				},
				{
					field: 'houseid',title: '房源编号',align: 'center',
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
					field: 'keycode',
					title: '钥匙编号',
					align: 'center'
				},
				{
					field: 'takekeyusername',title: '钥匙领取人',align: 'center',
					formatter: function(value ,row, index){
	      	    		var html='';
	      	    		html='<a onclick="getUserStaffInfo('+row.takekeyuserid+')">'+row.takekeyusername+'</a>'
	      	    		return html;
		      	    }
				},
				{
					field: 'changeshiopdate',
					title: '钥匙转入时间<br />房源地址',
					align: 'center',
					formatter:function(value,row,index){
						return (value?value:'-')+'<br />'+row.address;
					}
				},
				{
					field: 'keynum',
					title: '钥匙数量<br />门禁卡',
					align: 'center',
					formatter:function(value,row,index){
						return value+'把/套'+'<br />共'+row.groupkeynum+'套'+(row.doorcodenum?row.doorcodenum:'0')+'张';
					}
				},
				{
					field: '',
					title: '操作',
					align: 'center',
					formatter:function(value, row, index){
						if($("#temp_confitm").val()!=undefined){
						return '<div class="text-left"><button type="button" data-index='+index+' class="btn btn-outline btn-success btn-xs mt-3" onclick="storekeyending.creatorPopup(this,0,1)">钥匙转店确认</button></div>';
						}
						}
				}
			]
		});
	},
	//创建弹出框
	creatorPopup:function(that,type,n){
		var _this=this;
		var index=that.getAttribute('data-index');
		var houseId=that.getAttribute('data-houseid');
		var infoTypeHtml='';
		var keyNumberHtml='';
		var takekeyuserid=n?_this.changelist[index].takekeyuserid:_this.rekeylist[index].takekeyuserid;
		var operationtype=n?_this.changelist[index].operationtype:this.rekeylist[index].operationtype;
		var houseid=n?_this.changelist[index].houseid:this.rekeylist[index].houseid;
		var keyManHtml='\
			<div class="col-sm-5">\
				<label class="col-sm-6 control-label" style="padding-right:0;">'+(n?'钥匙领取人：':'收钥匙人：')+'</label>\
				<div class="col-sm-6" style="padding:7px 0;"><a onclick="getUserStaffInfo('+takekeyuserid+')">'+(n?_this.changelist[index].takekeyusername:_this.rekeylist[index].rekeyusername)+'</a></div>\
			</div>';
		if(type==0){
			infoTypeHtml='\
			<div class="col-sm-5">\
				<label class="col-sm-6 control-label" style="padding-right:0;">业务类型：</label>\
				<div class="col-sm-6" style="padding:7px 0;">'+(n?_this.changelist[index].stroperationtype:_this.rekeylist[index].stroperationtype)+'</div>\
			</div>';
			keyNumberHtml='<input id="keyNumber"maxlength="20" type="text" class="form-control" required>';
		}else{
			keyNumberHtml='<input type="radio" value="1" name="reasons">未找到钥匙<input style="margin-left:8px;" type="radio" value="2" name="reasons">误操作';
		}
		var	html='\
			<div id="demo_layer" class="ibox-content">\
				<form id="demo_form" name="demo_form" class="form-horizontal">\
					<div class="form-group">'+infoTypeHtml+(type==0?'':keyManHtml)+'\
						<div class="col-sm-6">\
							<label class="col-sm-5 control-label" style="padding-right:0;">房源编号：</label>'
							if(operationtype==1){
								html+='<div class="col-sm-7" style="padding:7px 0;"><a target="_blank" href="../main/leasedetail.htm?houseid='+houseid+'">'+(n?_this.changelist[index].houseid:this.rekeylist[index].houseid)+'</a></div>'	
							}else{
								html+='<div class="col-sm-7" style="padding:7px 0;"><a target="_blank" href="../main/buydetail.htm?houseid='+houseid+'">'+(n?_this.changelist[index].houseid:this.rekeylist[index].houseid)+'</a></div>'	
							}
								html+='</div>\
					</div>\
					<div class="form-group">'+(type==0?keyManHtml:'')+'\
						<div class="col-sm-6">\
							<label id="keyNumberTie" class="col-sm-5 control-label" style="padding-right:0;"><span class="text-danger">*</span>'+(type==0?'钥匙编号：':'退回原因：')+'</label>\
							<div class="col-sm-7">'+keyNumberHtml+'\
							</div>\
						</div>\
					</div>\
				</form>\
			</div>';
		layer.open({
			title : '编辑信息',
			type : 1,
			shift : 1,
			skin : 'layui-layer-lan layui-layer-no-overflow',
			content :html,
			area : '500px',
			btn : ['提交', '取消'],
			//确定按钮回调方法
			yes : function(i, layero){
				if(type==0){
					var keyNumber=$('#keyNumber').val().trim();
					if(keyNumber==''){
						commonContainer.alert('钥匙编号不能为空');
						return false;
					};
					if(!/^[A-Za-z0-9]+$/.test(keyNumber)){
						commonContainer.alert('钥匙编号只能是数字和字母');
						return false;
					}
					if(n){
						jsonAjax(basePath+'/house/keyadmin/changesubmit.htm',{
							id:_this.changelist[index].id,										//钥匙主键id
							operationtype:_this.changelist[index].operationtype,				//1=租赁2=买卖3=房管
							changephshopid:_this.changelist[index].changephshopid,				//钥匙转存店id
							keycode:keyNumber													//新钥匙编号
						},function(){
							layer.alert('钥匙转店成功');
							layer.close(i);
							_this.creatorTab();
							_this.getTotal();
						});
					}else{
						jsonAjax(basePath+'/house/keyadmin/rekeysubmit.htm',{
							id:_this.rekeylist[index].id,							//钥匙主键id
							operationtype:_this.rekeylist[index].operationtype,		//1=租赁2=买卖3=房管
							keycode:keyNumber,										//钥匙编号
							rekeygroupid:_this.rekeylist[index].rekeyshopgroupid,
							houseid:houseId
						},function(){
							layer.alert('收钥匙成功');
							layer.close(i);
							_this.creatorTab();
							_this.getTotal();
						});
					}
				}else if(type==1){
					if(!$('input:radio[name="reasons"]').is(':checked')){
						commonContainer.alert('请选择退回原因');
						return false;
					}
					jsonAjax(basePath+'/house/keyadmin/rekeycancel.htm',{
						id:_this.rekeylist[index].id,	//钥匙主键id
						cancelreason:$('input:radio[name="reasons"]:checked').val(),		//退回原因（1=未收到钥匙2=误操作）
						houseid:houseId
					},function(){
						layer.alert('钥匙退回成功');
						layer.close(i);
						_this.creatorTab();
						_this.getTotal();
					});
				}
			},
			//右上角关闭回调
			cancel : function(index, layerno){},
			move:false		//禁止拖拽
		});
		if(n){
			$('#keyNumberTie').html('新钥匙编号：');
			$('#keyNumber').val('');
		}
	}
}