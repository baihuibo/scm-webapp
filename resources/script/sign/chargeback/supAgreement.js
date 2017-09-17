$(function(){
	supAgreementView.init();
});
var supAgreementView={
	urlDate:location.search.split('&'),
	agreLock:false,
	init:function(){
		var _this=this;
		//初始select下拉框
		$('select').chosen({
			width:'100%'
		});
		//业务类型
		//dimContainer.buildDimChosenSelector($('#businesstype'),'businessType','');
		//查询单据编号
		jsonGetAjax(basePath+'/sign/chargeback/chargebackCommon.htm',{
			chargebackid:_this.urlDate[0].split('=')[1]
		},function(rdata){
			if(rdata.data.auditstatus=="3"||rdata.data.auditstatus=="8"){
				$("#goFeiyzhixmx").show();
			}	
			$('#signnumber').html('单据编号：'+rdata.data.signnumber);
			$('#strauditstatus').html('审核状态：'+rdata.data.strauditstatus);
			//审核状态 1.待提交审批2.审核中3.审批通过4.审批不通过5.待提交审批（财务驳回）6.审批通过（风控）7.作废 
			if(rdata.data.auditstatus==1){
				$('#isShowbtn').show();
				//添加补充协议
				$('#addBuChongxy').off().on('click',function(){
					var business_type='';
					commonContainer.modal('新增补充协议',$('#addBucXy'),function(i){
						layer.close(i);
						window.open(basePath+'/sign/agreement/agreement-edit.html'+location.search+'&chargeBackSupplFlag=0&business_type='+business_type);
					},{
						area:'500px',
						success:function(){
							//判断业务类型
							if(_this.urlDate[1].split('=')[1]==1){
								business_type='3';
								$('#leaseShenm').prop('checked',true);
							}else{
								business_type='4';
								$('#businessShenm').prop('checked',true);
							}
						}
					});
				});
				//选取关联协议
				_this.choiceAssType();
			}
			_this.queryList(rdata.data.auditstatus);
			//跳转到退单信息
			var tuidInfor=location.search;
			$('#goTuidanInfor').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/detail.html?signnumber='+rdata.data.signnumber;
			});
			//跳转到费用处理
			$('#gofeiYongcl').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/cost.html'+tuidInfor;
			});
			//跳转到补充协议
			$('#goAgreement').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/supplemental_agreement.html'+tuidInfor;
			});
			//跳转到审批流程
			$('#goShenPlc').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/auditprocess.html'+tuidInfor;
			});
			//跳转到费用执行明细
			$('#goFeiyzhixmx').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/costdetail.html'+tuidInfor;
			});
			//跳转到附件管理
			$('#goAttachment').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/attachment.html'+tuidInfor;
			});
            //跳转到业绩信息
            $('#performance').off().on('click',function(){
                location.href=basePath+'/sign/chargeback/chargeBackToPerformance'+tuidInfor;
            });
		});
		//选择部门
//		$('#J_deptSelect').off().on('click', function() {
//			showDeptTree($('#J_deptName'), $('#J_deptLevel'));
//		});
//		$('#J_reset').on('click',function(){
//			$('#J_deptName').attr('data-id','');			//重置所属部门id
//		});
		//this.entryDate();
		
	},
	//录入日期
	entryDate:function(){
		var seeBeginDate={
			elem:'#createstarttime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	seeEndDate.min=datas;
		    	seeEndDate.start=datas;
		    }
		};
		var seeEndDate={
			elem:'#createendtime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	seeBeginDate.max=datas;
		    }
	    }
		laydate(seeBeginDate);
		laydate(seeEndDate);
	},
	//选择关联类型
	choiceAssType:function(){
		var _this=this;
		//创建表格表头
		var tabHtml='\
			<table id="contractList" class="table table-hover table-striped table-bordered">\
				<thead>\
					<tr>\
						<th data-field="">\
							<div class="th-inner">选择</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">协议类型</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">协议编号</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">存量房合同编号</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">业主姓名<br />客户姓名</div>\
						</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">所属部门</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">录入人</div>\
						</th>\
						<th data-field="">\
							<div class="th-inner">录入日期</div>\
						</th>\
					</tr>\
				</thead>\
			</table>';
		$('#choicTypeBtn').off().on('click',function(){
			if(_this.agreLock){
				return false;
			}else{
				_this.agreLock=true;
			}
			jsonGetAjax(basePath+'/contract/supplagrt/getChargeBackSupplAgrtList.htm',{
				conId:_this.urlDate[2].split('=')[1]
			},function(redata){
				commonContainer.modal('选择关联类型',$('#choiceAssType'),function(i){
					var getSelections=$('#contractList').bootstrapTable('getSelections');	//选择协议
					if(getSelections.length>0){
						layer.close(i);
						var suppleIds='';
						$.each(getSelections,function(i,n){
							suppleIds+=n.suppl_agrt_id+',';
						});
						jsonGetAjax(basePath+'/sign/chargeback/chargebackRelatedSupple.htm',{
							suppleIds:suppleIds.substring(0,suppleIds.length-1),
							chargebackId:_this.urlDate[0].split('=')[1]
						},function(){
							commonContainer.alert('保存成功');
							_this.queryList();
						});
					}else{
						commonContainer.alert('请选择协议');
					}
				},{
					area:'80%',
					success:function(){
						$('#hetConten').html(tabHtml);
						$('#contractList').bootstrapTable('destroy').bootstrapTable({
							//singleSelect:true,		//设置单选
							clickToSelect:true,		//点击选中行
							data:redata.data,
							columns:[
								{
									field : '',
									title : '选择',
									checkbox:true,
									align : 'center'
								},
								{
									field : 'agrt_type',
									title : '协议类型',
									align : 'center'
								},
								{
									field : 'sign_number',
									title : '协议编号',
									align : 'center',
									formatter:function(value,row,index){
										var html='';
										var url=basePath+"/sign/agreement/agreement-detail.html?supplAgrtId="+row.suppl_agrt_id;
										html = '<a href="'+url+'">'+row.sign_number+'</a>'
										return html;
									}
								},
								{
									field : 'contract_code',
									title : '存量房合同编号',
									align : 'center'
								},
								{
									field : 'owner_name',
									title : '业主姓名<br />客户姓名',
									align : 'center',
									formatter:function(value,row){
										return value+'<br />'+row.customer_name;
									}
								},
								{
									field : 'dept_name',
									title : '所属部门',
									align : 'center'
								},
								{
									field : 'create_by_name',
									title : '录入人',
									align : 'center'
								},
								{
									field : 'create_time',
									title : '录入日期',
									align : 'center'
								}
							]
						});
//						//重置表单
//						$('#J_contractQuery')[0].reset();
//						$('#J_deptName').attr('data-id','');
					}
				});
			},{
				completeCallBack:function(){
					_this.agreLock=false;
				}
			});
		});
	},
	//补充协议列表
	queryList:function(auditstatus){
		var _this=this;
		jsonGetAjax(basePath+'/sign/chargeback/suppleAttachList.htm',{
			conId:_this.urlDate[2].split('=')[1],
			chargebackId:_this.urlDate[0].split('=')[1]
		},function(redata){
			$('#retreatList').bootstrapTable('destroy').bootstrapTable({
				data:redata.data,
				columns:[
					{
						field : 'agrt_type',
						title : '类型',
						align : 'center'
					},
					{
						field : 'sign_number',
						title : '编号',
						align : 'center',
						formatter:function(value,row,index){
							var html='';
							var url=basePath+"/sign/agreement/agreement-detail.html?supplAgrtId="+row.suppl_agrt_id;
							html = '<a href="'+url+'">'+row.sign_number+'</a>'
							return html;
						}
					},
					{
						field : 'dept_name',
						title : '经办部门',
						align : 'center'
					},
					{
						field : 'create_by_name',
						title : '经办人',
						align : 'center'
					},
					{
						field : 'audit_status',
						title : '状态',
						align : 'center'
					},
					{
						field : 'update_time',
						title : '最新状态时间',
						align : 'center'
					},
					{
						field : '',
						title : '操作',
						align : 'center',
						formatter:function(value,row){
							if(auditstatus==1 || auditstatus==undefined){
								return row.chargeback_id==undefined?'<button type="button" data-supplagrtid="'+row.suppl_agrt_id+'" class="btn btn-outline btn-danger btn-xs" onclick="supAgreementView.agreDelete(this)">删除</button>&nbsp;&nbsp':'-';
							}
							return '-';
						}
					}
				]
			});
		});
	},
	//删除管连协议
	agreDelete:function(target){
		var _this=this;
		commonContainer.modal('提示','<div style="padding: 20px;font-size: 14px;">是否要删除</div>',function(i){
			layer.close(i);
			jsonGetAjax(basePath+'/sign/chargeback/suppleAttachDele.htm',{
				suppleId:$(target).data('supplagrtid')
			},function(rdata){
				commonContainer.alert('删除成功');
				_this.queryList();
			});
		},{area:'300px',});
	}
}