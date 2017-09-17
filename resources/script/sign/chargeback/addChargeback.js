$(function(){
	//重置表单
	$('#addContractForm')[0].reset(); 
	addChargebackView.init();
});
var price_type="2";
$("#businesstype").change(function(){
	price_type=$(this).val();
	if(price_type==1){
		$(".J_price_text").text("月租金：");
		$(".J_price").text("月租金（元）");
	}else if(price_type==2){
        $(".J_price_text").text("成交价：");
        $(".J_price").text("成交价（元）");
	}
});
var addChargebackView={
	errPrompt:'<div style="padding-top: 8px;color: #a94442;">必填</div>',
	saveLock:false,
	init:function(){
		var _this=this;
		//初始select下拉框
		$('select').chosen({
			width:'100%'
		});
		//退单类型
		dimContainer.buildDimChosenSelector($('#chargebackType'),'chargebacktype','');
		//业务类型
	//	dimContainer.buildDimChosenSelector($('#businesstype'),'businessType','2');
		_this.choiceContract();
		_this.entryDate();
		_this.focusEvent();
		//判断是否为修改
		var signnumber=location.search.split('=')[1];
		if(signnumber!==undefined){
			$('#modifyNav').show();
			$('#xiuGai').show();
			_this.getDetai(signnumber);
		}else{
			$('#addNav').show();
			//保存信息
			$('#saveBtn').off().on('click',function(){
				_this.saveInfor();
			});
			//取消操作
			$('#cancelBtn').off().on('click',function(){
				commonContainer.confirm('是否要取消',
				function(){
					//window.open(basePath+'/sign/chargeback/list.html');
					window.location.href=basePath+'/sign/chargeback/list.html';
				},{
					btns:['确定','取消'],
					area:'300px'
				});
			});
		}
		//跳转到房源详情
		$('#addHousing').off().on('click',function(){
			var houseid=$(this).val();
			if(houseid!==''){
				window.open(basePath+'/house/main/buydetail.htm?houseid='+houseid);
			}
		});
		//跳转到客源详情
		$('#addTourists').off().on('click',function(){
			if($(this).val()!=""){
                var customerId=$(this).attr("data-id");
                if(customerId!==''){
                    window.open(basePath+'/customer/main/findbuyerclientbycustomerid.htm?customerId='+customerId);
                }
			}

		});
		//退佣比例
		$('#shituiYj').on('blur',function(){
			var thisVal=$(this).val();
			if(thisVal!==''){
				$(this).val(decimaltwo(thisVal));
			}
		});
		$('#shituiYj').on('input change',function(){
			var shituiYj=$(this).val();
			var addBackCommis=$('#addBackCommis').val();
			if(shituiYj==''){
				$('#addCommissionRate').val('');
			}
			if(shituiYj!=='' && addBackCommis!=='' && addBackCommis*1!==0){
				$('#addCommissionRate').val((decimaltwo((shituiYj*1)/(addBackCommis*1))*100).toFixed(0)+'%');
			}
		});
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
	//选择合同
	choiceContract:function(){
		var _this=this;
		var isInit=true;
		$('#addContractNum').off().on('click',function(){
			var contractNumsun=$('#addContractNum > div');
			//隐藏错误提示
			if(contractNumsun.length>1){
				contractNumsun.eq(1).hide();
			}
			commonContainer.modal('选择合同',$('#choiceHetong'),function(i){
				_this.getAddContract(i);
			},{
				area:['80%','70%'],
				btns:['确定','取消'],
				overflow :true,
				success:function(){
					//业务类型
					dimContainer.buildDimChosenSelector($('#businesstype'),'businessType','2');
					if(isInit){
						$('#J_search').off().on('click',function(){
							_this.contractList();
								if(price_type==1){
			                        $(".t_price").hide();
			                        $(".rent_price").show();
			                    }else if(price_type==2){
			                        $(".t_price").show();
			                        $(".rent_price").hide();
			                    }else{
			                    	
			                    }
						});
						$('#J_reset').on('click',function(){
							$('#J_deptName').attr('data-id','');			//重置所属部门id
							$('#businesstype').val('2');
							$('#businesstype').trigger('chosen:updated');
						});
						//所属部门
						$('#J_deptSelect').off().on('click', function() {
							showDeptTree($('#J_deptName'), $('#J_deptLevel'));
						});
						isInit=false;
					}
					//重置表单
					$('#J_contractQuery')[0].reset();
					//重置所属部门
					$('#J_deptName').attr('data-id','');
					//重置业务类型
					$('#businesstype').val('2');
					$('#businesstype').trigger('chosen:updated');
					//创建表格表头
					var tabHtml='\
						<table id="contractList" class="table table-hover table-striped table-bordered">\
							<thead>\
								<tr>\
									<th data-field="">\
										<div class="th-inner">业务类型</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">合同编号</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">客户姓名<br />业主姓名</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">客户佣金（元）<br />业主佣金（元）</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner J_price">成交价（元）</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">所属部门</div>\
									</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">成交人</div>\
									</th>\
									<th data-field="">\
										<div class="th-inner">签约日期</div>\
									</th>\
								</tr>\
							</thead>\
						</table>';
					$('#hetConten').html(tabHtml);
				}
			});
		});
	},
	//查询合同列表
	contractList:function(){
		$('#contractList').bootstrapTable('destroy').bootstrapTable({
			url:basePath+'/sign/chargeback/choosecontract.htm',
			method:'post',
			sidePagination:'server',
			dataType:'json',
			pagination: true,
			singleSelect:true,		//设置单选
			clickToSelect:true,		//点击选中行
			striped:true,
			pageSize:10,
			pageList:[10, 20, 50],
			queryParams: function (params) {
				var data=$('#J_contractQuery').serializeObject();
				var deptId=$('#J_deptName').attr('data-id');
				var contract_type = $("#businesstype").val();
				data.contract_type=contract_type;			
				if(deptId!==''){
					data.dept_id=deptId;		//所属部门id
				}
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
			    	radio:true,
			    	align:'center'
	         	},
				{
					field : 'contract_type',
					title : '业务类型',
					align : 'center'
				},
				{
					field : 'contract_code',
					title : '合同编号',
					align : 'center'
				},
				{
					field : 'customer_name',
					title : '客户姓名<br />业主姓名',
					align : 'center',
					formatter:function(value,row){
						return value+'<br />'+row.owner_name;
					}
				},
				{
					field : 'customer_commission',
					title : '客户佣金（元）<br />业主佣金（元）',
					align : 'center',
					formatter:function(value,row){
						return value+'<br />'+row.owner_commission;
					}
				},
				{
					field : 'transaction_price',
					title : '<div class="t_price">成交价（元）</div><div class="rent_price" style="display:none;">月租金（元）</div>',
					align : 'center'
				},
				{
					field : 'dept_name',
					title : '所属部门',
					align : 'center'
				},
				{
					field : 'user_name',
					title : '成交人',
					align : 'center'
				},
				{
					field : 'create_time',
					title : '签约日期',
					align : 'center'
				}
			]
		});
	},
	//获取新增合同详情
	getAddContract:function(i){
		var _this=this;
		$('#shituiYj').val('');
		$('#addCommissionRate').val('');
		var checkrowDataArr=$("#contractList").bootstrapTable('getSelections');	//选中的合同数据
		if(checkrowDataArr.length>0 && checkrowDataArr[0].con_id!==undefined){
			layer.close(i);
			//回显新增合同信息
			jsonGetAjax(basePath+'/sign/chargeback/choosesingelecontract.htm',{
				contractCode:checkrowDataArr[0].contract_code		//合同编号
			},function(result){
				_this.con_id=result.data.con_id;
				//回显新增合同信息
				$('#addContractNumber').val(result.data.contract_code);														//合同编号
				$('#addBusinessType').val(result.data.strcontract_type);													//业务类型
				$('#addCustomerName').val(result.data.customer_name);														//客户姓名
				$('#addOwnerName').val(result.data.owner_name);																//业主姓名
				$('#addBackCommis').val(decimaltwo(result.data.amount_receivable));		//佣金总额()
				$('#addEpartment').val(result.data.dept_name);																//所属部门
				$('#addHousing').val(result.data.houses_code);																//房源编号
				$('#addTourists').val(result.data.client_id);
				$('#addTourists').attr("data-id",result.data.customer_code);//客源编号
				$('#addPaidCommission').val(decimaltwo(result.data.paid_amount));											//实收佣金
			});
		}else{
			commonContainer.alert('请选择合同');
		}
	},
	//保存信息
	saveInfor:function(chargebackid,signnumber){
		var isfalg=false;
		var _this=this;
		//验证必填项
		//合同编号
		if($('#addContractNumber').val()==''){
			var sunDiv=$('#addContractNum > div');
			if(sunDiv.length>1){
				sunDiv.eq(1).show();
			}else{
				$('#addContractNumber').parents('#addContractNum').append(this.errPrompt);
			}
			isfalg=true;
		}
		//是否付赔偿款
		if(this.isSelected('ispayouts','#errProPeichang')){
			isfalg=true;
		}
		//是否收违约金
		if(this.isSelected('isreceivepenalty','#errProShouweiyj')){
			isfalg=true;
		}
		//是否退单
		if(this.isSelected('isbacksign','#errProTuidan')){
			isfalg=true;
		}
		//是否转佣
		if(this.isSelected('istransfercommission','#errProZhuany')){
			isfalg=true;
		}
		//是否退佣
		if(this.isSelected('isbackcommission','#errProTuiyong')){
			isfalg=true;
		}
		//退单类型
		if($('#isTuidan').is(':checked')){
			var chargebackType=$('#chargebackType');
			if(chargebackType.val()==''){
				var chargebackTypeNext=$('#chargebackType').next().next();
				if(chargebackTypeNext.length>0){
					chargebackTypeNext.show();
				}else{
					chargebackType.parent().append(this.errPrompt);
				}
				isfalg=true;
			}
		}
		//实退佣金
		var shituiYj=$('#shituiYj');
		if(($('#isTuiyong').is(':checked') || $('#isZhuany').is(':checked')) && shituiYj.val()==''){
			isfalg=true;
			if(shituiYj.next().length>0){
				shituiYj.next().show();
			}else{
				shituiYj.parent().append(this.errPrompt);
			}
		}
		//申请说明
		var explain=$('#explain');
		if($.trim(explain.val())===''){
			isfalg=true;
			if(explain.next().length>0){
				explain.next().show();
			}else{
				explain.parent().append(this.errPrompt);
			}
		}
		if(isfalg){
			commonContainer.alert('您还有必填项未填写');
			return false;
		}
		//清空实退佣金，退佣比例
		if($('input[name=istransfercommission]:checked').val()==='0' && $('input[name=isbackcommission]:checked').val()==='0'){
			$('#shituiYj').val('');
			$('#addCommissionRate').val('');
		}else{
			//实退佣金不能大于实收佣金
			if($('#shituiYj').val()*1 > $('#addPaidCommission').val()*1){
				commonContainer.alert('实退佣金不能大于实收佣金');
				return false;
			}
		}
		//清空退单类型
		if($('input[name=isbacksign]').val()==='0'){
			$('#chargebackType').val(result.data.chargebacktype);
			$('#chargebackType').trigger('chosen:updated');
		}
		if(this.saveLock){
			return false;
		}else{
			this.saveLock=true;
		}
		var parm=$('#addContractForm').serializeObject();
		//格式退佣比例
		if(parm.istransfercommission==1||parm.isbackcommission==1){
			var returncomm=parm.returncommissionpercent;
			if(returncomm!==undefined){
				parm.returncommissionpercent=returncomm.substring(0,returncomm.length-1);
			}
		}
		//合同主键id
		if(this.con_id!==undefined){
			parm.con_id=this.con_id;
		}
		var url='';
		if(chargebackid!==undefined){
			parm.chargebackid=chargebackid;
			url='/sign/chargeback/chargebackupdate.htm';	//修改
		}else{
			url='/sign/chargeback/chargebackadd.htm';		//新增
		}
		jsonPostAjax(basePath+url,parm,function(rdata){
			layer.alert('保存成功', {
				skin: 'layui-layer-lan',
				closeBtn: 0,    							//是否显示关闭按钮
				btn: ['确定'],	  							//按钮
				yes:function(){
					//window.open(basePath+'/sign/chargeback/detail.html');
					location.href=basePath+'/sign/chargeback/detail.html?signnumber='+(signnumber!==undefined?signnumber:rdata.data);	//signnumber:单据编号
				}
			});
		},{
			completeCallBack:function(){
				_this.saveLock=false;
			}
		});
	},
	//单选按钮是否选中isPeichang errProPeichang
	isSelected:function(name,parele){
		if($('input[name='+name+']:checked').val()===undefined){
			if($(parele+' >div').length>2){
				$(parele).eq(2).show();
			}else{
				$(parele).append(this.errPrompt);
			}
			return true;
		}
	},
	//表单获取焦点取消错误提示
	focusEvent:function(){
		//单选项
		$('input[type=radio]').off().on('focus',function(){
			var sunDiv=$(this).parents('.col-sm-8').find('div');
			if(sunDiv.length==3){
				sunDiv.eq(2).hide();
			}
			var idName=$(this).attr('id');
			//退单切换
			if(idName=='isTuidan'){
				$('#tuiDanType').show();
			}else if(idName=='isTuidan1'){
				$('#tuiDanType').hide();
			}
			//退佣切换
			if(idName=='isTuiyong' || idName=='isZhuany'){
				$('#tuiYongbl').show();
			}
			if(idName=='isZhuany1' && !$('#isTuiyong').is(':checked')){
				$('#tuiYongbl').hide();
			}
			if(idName=='isTuiyong1' && !$('#isZhuany').is(':checked')){
				$('#tuiYongbl').hide();
			}
		});
		//退单类型
		$('.chosen-container').on('click',this.focusCallBank);
		//实退佣金
		$('#shituiYj').off().on('click',this.focusCallBank);
		//申请说明
		$('#explain').off().on('focus',this.focusCallBank);
	},
	focusCallBank:function(){
		var next=$(this).next();
		if(next.length>0){
			next.hide();
		}
	},
	//获取详情
	getDetai:function(signnumber){
		var _this=this;
		jsonGetAjax(basePath+'/sign/chargeback/chargebackdetail.htm',{
			signnumber:signnumber			//单据编号
		},function(result){
			//退单类型
			//dimContainer.buildDimChosenSelector($('#chargebackType'),'chargebacktype','');
			var urlData='chargebakcid='+result.data.chargebakcid+'&businesstype='+result.data.businesstype+'&conId='+result.data.contractid;
			//跳转到费用处理
			$('#gofeiYongcl').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/cost.html?'+urlData;
			});
			//跳转到附件管理
			$('#goAttachment').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/attachment.html?'+urlData;
			});
			//跳转到补充协议
			$('#goAgreement').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/supplementalagreement.html?'+urlData;
			});
			//跳转到审批流程
			$('#goShenPlc').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/auditprocess.html?'+urlData;
			});
			//跳转到费用执行明细
			$('#goFeiyzhixmx').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/costdetail.html?'+urlData;
			});
			//_this.chargebackid=result.data.chargebakcid																		//退单主键id
			$('#signnumber').html('单据编号：'+result.data.signnumber);																//单据编号
			$('#strauditstatus').html('单据状态：'+result.data.strauditstatus);														//审核状态
			$('#addContractNumber').val(result.data.contractcode);																//合同编号
			$('#addBusinessType').val(result.data.strbusinesstype);																//业务类型
			$('#addCustomerName').val(result.data.customername);																//客户姓名
			$('#addOwnerName').val(result.data.ownname);																		//业主姓名
			$('#addBackCommis').val(result.data.totalcommission);																//佣金总额
			$('#addEpartment').val(result.data.shopgroupname);																	//所属部门
			$('#addHousing').val(result.data.houseid);																			//房源编号
			$('#addTourists').val(result.data.client_id);
			$('#addTourists').attr("data-id",result.data.customer_code);//客源编号
			$('#addPaidCommission').val(result.data.realreceivedcommission);													//实收佣金
			$('#addCommissionRate').val(result.data.returncommission==undefined?'':result.data.returncommission+'%');			//退佣比例
			//是否付赔偿款
			_this.isState(result.data.ispayouts,'#isPeichang');
			//是否收违约金
			_this.isState(result.data.isreceivepenalty,'#isShouweiyj');
			//是否退单
			_this.isState(result.data.isbacksign,'#isTuidan');
			if(result.data.isbacksign==1){
				$('#tuiDanType').show();
				$('#chargebackType').val(result.data.chargebacktype);
				$('#chargebackType').trigger('chosen:updated');
				//$('#tuiDval').val(result.data.strchargebacktype);																//退单类型
			}
			//是否转佣
			_this.isState(result.data.istransfercommission,'#isZhuany');
			//是否退佣
			_this.isState(result.data.isbackcommission,'#isTuiyong');
			$('#explain').val(result.data.remark)																				//申请说明
			if(result.data.istransfercommission==1 || result.data.isbackcommission==1){
				$('#tuiYongbl').show();
				$('#shituiYj').val(decimaltwo(result.data.realreturncommission));												//实退佣金
			}
			$('#createByName').html(result.data.createbyname);																	//创建人
			$('#createTime').html(result.data.createtime);																		//创建时间
			$('#updateByName').html(result.data.updatebyname==undefined?'-':result.data.updatebyname);							//最后修改人
			$('#updateTime').html(result.data.updatetime==undefined?'-':result.data.updatetime);								//最后修改时间
			if(result.data.strbusinesstype=='买卖'){
				$('#jiaoYiInfor').show();
				$('#valuationfee').html(result.data.strvaluation_fee);																//评估费
				$('#netsign').html(result.data.strnet_sign);																		//网签
				$('#roomcheck').html(result.data.strroom_check);																	//房源检验
				$('#loan').html(result.data.strloan);																				//贷款
				$('#changeName').html(result.data.strchange_name);																	//过户
			}
			//保存信息
			$('#saveBtn').off().on('click',function(){
				_this.saveInfor(result.data.chargebakcid,result.data.signnumber);
			});
			//取消操作
			$('#cancelBtn').off().on('click',function(){
				commonContainer.modal('','<div style="padding: 20px;font-size: 14px;">是否要取消</div>',function(){
					//window.open(basePath+'/sign/chargeback/detail.html?signnumber=')
					location.href=basePath+'/sign/chargeback/detail.html?signnumber='+result.data.signnumber;					//跳转到详情页
				},{
					btns:['确定','取消'],
					area:'300px'
				});
			});
		});
	},
	//状态判断
	isState:function(state,id){
		if(state==1){
			$(id).prop('checked',true);
		}else{
			$(id+'1').prop('checked',true);
		}
	}
}
//限制输入两位小数
function clearNoNum(obj){
	obj.value=obj.value.replace(/[^\d.]/g,''); //清除"数字"和"."以外的字符
	obj.value = obj.value.replace(/^\./g,''); //验证第一个字符是数字而不是"."
	obj.value = obj.value.replace(/\.{2,}/g,'.'); //只保留第一个. 清除多余的
	obj.value = obj.value.replace('.','$#$').replace(/\./g,'').replace('$#$','.');
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
	return obj.value;
}
//保留两位小数
function decimaltwo(num){
	var resultNum = parseFloat(num);
	if(isNaN(resultNum)){
	    return '';
	}
	resultNum = Math.round(num * 100) / 100;
	var strNum = resultNum.toString();
	var pointIndex = strNum.indexOf('.');
	if(pointIndex < 0) {
		pointIndex = strNum.length;
		strNum += '.';
	}
	while(strNum.length <= pointIndex + 2){
		strNum += '0';
	}
	return strNum;
}


//textarae字数限制
function strLenCalc() {	
	var v = $("#explain").val(), charlen = 0, maxlen =100, curlen = maxlen, len = v.length;
	for(var i = 0; i < v.length; i++) {
		curlen -= 1;
	}
  if(curlen > 10) {
	$("#checklen").html("还可以输入 <strong>"+curlen+"</strong> 个字").css('color', '#1d3872');
//	$("#J_submit").removeAttr("disabled");
	} else {
	$("#checklen").html("还可以输入 <strong>"+curlen+"</strong> 个字").css('color', '#FF0000');
//	$("#J_submit").attr("disabled", "disabled");
	}
 }
