/* 
 * 选择合同编号，通过选择的合同编号，获取相关信息 
 * */
var price_type="2";
$('#J_contractnum').off().on('click',function(){
    var isInit=true;
	commonContainer.modal('选择合同',$('#J_chosecontract_layer'),function(i){
		var select_item=$("input[name='btSelectItem']");

		 if($(select_item).is(':checked')==false){
			 commonContainer.alert('请选择一条合同');
		 }else{
			 select_item.each(function(){
				 if ($(this).is(':checked')) {
					 var con_id=$(this).parent().next().find("input[type='hidden']").attr("data-conid");
					 //alert(con_id);
                     if (window.getcontractinfobyconid) {//取conid值，到折扣信息页面
                         window.getcontractinfobyconid(con_id);
                     }else if(window.agreementCallBack){
                         window.agreementCallBack(con_id); // conid 值反馈到补充协议页面
                     }
				 }  
		     });
			 layer.close(i);
		 }		
	},{
		area:['85%','70%'],
		btns:['确定','取消'],
		overflow :true,
		success:function(){
			//业务类型 select
            /*$("#businesstype option:eq(0)").remove();
			$("#businesstype option:eq(0)").remove();*/
            $("#businesstype").empty();
			dimContainer.buildDimChosenSelector($("#businesstype"), "discountbusinesstype", "2");
			if(isInit){
				$('#J_search').off().on('click',function(){
					contractList();
                    if(price_type==1){
                        $(".t_price").hide();
                        $(".rent_price").show();
                    }else if(price_type==2){
                        $(".t_price").show();
                        $(".rent_price").hide();
                    }
				});
				$('#J_reset').on('click',function(){
					$('#J_deptName').attr('data-id','');			//重置所属部门id
				});
				//所属部门
				$('#J_deptSelect').off().on('click', function() {
					showDeptTree($('#J_deptName'), $('#J_deptLevel'));
				});
				isInit=false;
			}

			//重置表单
			$('#J_contractQuery')[0].reset();
			$('#J_deptName').attr('data-id','');

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
								<div class="th-inner">录入日期</div>\
							</th>\
						</tr>\
					</thead>\
				</table>';
			$('#hetConten').html(tabHtml);

			$("#businesstype").change(function(){
				price_type=$(this).val();
				if(price_type==1){
					$(".J_price_text").text("月租金：");
					$(".J_price").text("月租金（元）");
					$("#J_price_min").attr("name","rentstandardmin");
                    $("#J_price_max").attr("name","rentstandardmax");
				}else if(price_type==2){
                    $(".J_price_text").text("成交价：");
                    $(".J_price").text("成交价（元）");
                    $("#J_price_min").attr("name","transaction_price_min");
                    $("#J_price_max").attr("name","transaction_price_max");
				}
			});
			//J_price
		}
	});
});


// 初始化录入日期
var begindate1 = {
    elem: '#createstarttime',
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function(datas){
        enddate1.min = datas;
        enddate1.start = datas
    },
}
var enddate1 = {
    elem: '#createendtime',
    format: 'YYYY-MM-DD',
    istime: false,
    choose: function(datas){
        begindate1.max = datas
    }
}
laydate(begindate1);
laydate(enddate1);

/* 
 * 查询合同列表
 * */
function contractList(){
	$('#contractList').bootstrapTable('destroy').bootstrapTable({
		url:basePath+'/contract/discount/choosecontract.htm',
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
			if(deptId!==''){
				data.dept_id=deptId;		//所属部门id
			}
			data.pagesize = params.limit;
			data.pageindex = params.offset / params.limit+ 1;
			return data;
		},
		responseHandler: function(result) {
			//console.log(result.data);
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
				align : 'center',
				formatter:function(value,row){
					return value+'<input type="hidden" data-conid="'+ row.con_id +'"/>';
					//+'<input type="text" value="'+ row.con_id +'"/>'
				}
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
				align : 'center',
                formatter:function(value,row){
					var html="";
					var busi_type=$("#businesstype").val();//租赁 1 /买卖 2
					if(busi_type==1){
                        html = row.rent_standard;
					}else if(busi_type==2){
                        html = value;
					}
                    return html;
                }
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
				title : '录入日期',
				align : 'center'
			}
		]
	});
}

//获取详情
function getDetai(signnumber){
	var _this=this;
	jsonGetAjax(basePath+'/contract/discount/chargebackdetail.htm',{
		signnumber:signnumber			//单据编号
	},function(result){
		//_this.chargebackid=result.data.chargebakcid																		//退单主键id
		$('#signnumber').html('单据编号：'+result.data.signnumber);																//单据编号
		$('#strauditstatus').html('审核状态：'+result.data.strauditstatus);														//审核状态
		$('#addContractNumber').val(result.data.contractcode);																//合同编号
		$('#addBusinessType').val(result.data.strbusinesstype);																//业务类型
		$('#addCustomerName').val(result.data.customername);																//客户姓名
		$('#addOwnerName').val(result.data.ownname);																		//业主姓名
		$('#addBackCommis').val(result.data.totalcommission);																//佣金总额
		$('#addEpartment').val(result.data.shopgroupname);																	//所属部门
		$('#addHousing').val(result.data.houseid);																			//房源编号
		$('#addTourists').val(result.data.customerid);																		//客源编号
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
		_this.isState(result.data.isbacksign,'#isTuiyong');
		$('#explain').val(result.data.remark)																				//申请说明
		if(result.data.istransfercommission==1 || result.data.isbacksign==1){
			$('#tuiYongbl').show();
			$('#shituiYj').val(decimaltwo(result.data.realreturncommission));												//实退佣金
		}
		$('#createByName').html(result.data.createbyname);																	//创建人
		$('#createTime').html(result.data.createtime);																		//创建时间
		$('#updateByName').html(result.data.updatebyname==undefined?'-':result.data.updatebyname);							//最后修改人
		$('#updateTime').html(result.data.updateTime==undefined?'-':result.data.updatebyname);								//最后修改时间
		if(result.data.strbusinesstype=='买卖'){
			$('#jiaoYiInfor').show();
			$('#valuationfee').html(result.data.valuationfee);																//评估费
			$('#netsign').html(result.data.netsign);																		//网签
			$('#roomcheck').html(result.data.roomcheck);																	//房源检验
			$('#loan').html(result.data.loan);																				//贷款
			$('#changeName').html(result.data.changeName);																	//过户
		}
		//保存信息
		$('#saveBtn').off().on('click',function(){
			_this.saveInfor(result.data.chargebakcid,result.data.signnumber);
		});
		//取消操作
		$('#cancelBtn').off().on('click',function(){
			commonContainer.modal('','<div style="padding: 20px;font-size: 14px;">是否要取消</div>',function(){
				//window.open(basePath+'/sign/chargeback/detail.html?signnumber=')
				location.href=basePath+'/contract/discount/detail.html?signnumber='+result.data.signnumber;					//跳转到详情页
			},{
				btns:['确定','取消'],
				area:'300px'
			});
		});
	});
}