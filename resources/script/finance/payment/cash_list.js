//付款管理（现金）
$(function(){
	paymentCashView.init();
});
var paymentCashView={
	isInit:true,
	init:function(){
		//初始select下拉框
		$('select').chosen({
			width:'100%'
		});
		//付款状态
		dimContainer.buildDimChosenSelector($('#paidStatus'),'paymentPayStatus','');
		//证件类型
		dimContainer.buildDimChosenSelector($('#certiType'),'paymentCardType','');
		//创建查询日期
		this.queryDate();
		//员工
		searchContainer.searchUserListByComp($('#payeeUserId'), true, 'left');
		//$('#certiType').val('1').trigger("chosen:updated");
		//点击查询
		$('#payQueryBtn').off().on('click',this.queryResList);
		//确认付款
		$('#surePayBtn').off().on('click',this.surePopup.bind(this));
	},
	//查询日期
	queryDate:function(){
		var seeBeginDate={
			elem:'#paymentstarttime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	seeEndDate.min=datas;
		    	seeEndDate.start=datas;
		    }
		};
		var seeEndDate={
			elem:'#paymentendtime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	seeBeginDate.max=datas;
		    }
	    }
		laydate(seeBeginDate);
		laydate(seeEndDate);
	},
	//查询结果列表
	queryResList:function(){
		$('#paymentList').bootstrapTable('destroy').bootstrapTable({
			url:basePath+'/finance/payment/selectCashList.htm',
			method:'post',
			sidePagination:'server',
			dataType:'json',
			pagination: true,
			singleSelect:true,			//设置单选
			clickToSelect:false,		//点击选中行
			striped:true,
			pageSize:10,
			pageList:[10, 20, 50],
			queryParams: function (params) {
				var data=$('#queryCriteria').serializeObject();
				data.pagesize = params.limit;
				data.pageindex = params.offset / params.limit+ 1;
				return data;
			},
			responseHandler: function(result) {
				if (result.code == 0 && result.data && result.data.totalcount> 0){
					return {
						'rows': result.data.list, 
						'total': result.data.totalcount
					}
				}
				return {
					'rows': [],
					'total': 0
				}	
			},
			columns:[
	         	{
	         		field: '',
			    	title :'选择',
			    	checkbox:true,
			    	align:'center',
			    	formatter:function(value,row){
			    		return {
		    				disabled:row.payStatus==2?'disabled':''			//设置是否可用 (付款成功不可用)
		    			};
					}
	         	},
				{
					field : 'paymentNumber',
					title : '付款单编号',
					align : 'center',
					formatter:function(value,row){
						return '<a href="'+basePath+'/finance/payment/detail.htm?paymentId='+row.paymentId+'" target="_blank">'+value+'</a>';
					}
				},
				{
					field : 'payTime',
					title : '应付款日期',
					align : 'center'
				},
				{
					field : 'contractNumber',
					title : '合同编号',
					align : 'center'
				},
				{
					field : 'receiverName',
					title : '收款人',
					align : 'center'
				},
				{
					field : 'payAmount',
					title : '金额',
					align : 'center'
				},
				{
					field : 'strPayStatus',
					title : '付款状态',
					align : 'center'
				}
			]
		});
	},
	//确认付款弹窗
	surePopup:function(){
		var getSelections=$('#paymentList').bootstrapTable('getSelections');	//获取选中的数据
		if(getSelections.length>0 && getSelections[0].paymentId!==undefined){
			var _this=this;
			//获取付款单（现金）收款人信息
			jsonGetAjax(basePath+'/finance/payment/selectCashReceiverInfo.htm',{
				paymentId:getSelections[0].paymentId	//付款单id
			},function(rdata){
				commonContainer.modal('确认付款',$('#paySureData'),function(i){
					_this.surePay(_this,i,getSelections[0].paymentId);
				},{
					area:['450px'],
					btns:['确定','取消'],
					success:function(){
						//重置类型表单
						$('#paySureData')[0].reset();
						$('#payeeType').val('1').trigger('chosen:updated');
						_this.initPay(rdata.data);
						if(_this.isInit){
							//选择领款人类型
							$('#payeeType').chosen().change(function(){
								$('#changeState :input').val('');
								var $thisVal=$(this).val();
								if($thisVal==1){
									_this.initPay(rdata.data);
								}else if($thisVal==2){
									$('#changeState').show();
									$('#staffName').hide();
									$('#changeState :input').val('').removeAttr('disabled');
									$('#certiType').removeAttr('disabled').trigger('chosen:updated');
								}else if($thisVal==3){
									$('#staffName').show();
									$('#changeState').hide();
								}
							});
							_this.isInit=false;
						}
					}
				});
			});
		}else{
			commonContainer.alert('请选择付款单');
		}
	},
	//确认付款
	surePay:function(_this,i,paymentId){
		//验证必填项
		var payeeType=$('#payeeType').val();							//领款人类型	1，同收款人；2，代理人；3，员工 ,
		var payeeName=$.trim($('#payeeName').val());					//领款人姓名
		var payeeCardNumber=$.trim($('#payeeCardNumber').val());		//证件号码
		var surParam=null;
		if(payeeType==1){
			surParam={
				payeeCardNumber:payeeCardNumber,						//领款人证件号码 
				payeeCardType:$('#certiType').val(),					//领款人证件类型
				payeeName:payeeName, 									//领款人姓名	
				payeeType:payeeType,									//领款人类型：1，同收款人；2，代理人；3，员工 
			}
		}else if(payeeType==2){
			if(payeeName==''){
				commonContainer.alert('请输入领款人姓名');
				return false;
			}
			if($('#certiType').val()==''){
				commonContainer.alert('请选择证件类型');
				return false;
			}
			if(payeeCardNumber==''){
				commonContainer.alert('请输入证件号码');
				return false;
			}
			surParam=$('#paySureData').serializeObject();
		}else if(payeeType==3){
			if($.trim($('#payeeUserId').val())==''){
				commonContainer.alert('请选择员工');
				return false;
			}
			surParam={
				payeeUserId:$('#payeeUserId').data('id')	//员工id	
			}
		}
		surParam.paymentId=paymentId		//付款单id 
		layer.close(i);
		//确认付款（现金）接口
		jsonPostAjax(basePath+'/finance/payment/confirmCashPaid.htm',surParam,function(){
			commonContainer.alert('付款成功');
			_this.queryResList();
		});
	},
	//初始确认付款框
	initPay:function(data){
		$('#changeState').show();
		$('#staffName').hide();
		$('#payeeName').val(data.receiverName);																//收款人姓名
		$('#payeeCardNumber').val(data.receiverCardNumber);													//证件号码
		$('#changeState :input').prop('disabled','disabled');
		$('#certiType').val(data.receiverCardType).prop('disabled','disabled').trigger('chosen:updated');	//证件类型
	}
}