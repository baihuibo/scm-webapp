var urlparam=getUrlParam("discountId");
//templateId=5&docbizkey=BUY_DISCOUNT-59&taskId=3522645

var docbizkey = getUrlParam('docbizkey');
var taskId = getUrlParam('taskId');
var isEnd = !!getUrlParam('isEnd');
var tempId = getUrlParam('templateId');
var contypeid;

//$ctrl.tIsDone = signUtil.getSearchValue('t') === 'done';

var form_conid;//conid
var form_contype;
window.onload=function(){
	if(docbizkey!=null){
		var idx = docbizkey.indexOf('-');
		if(urlparam==null){
			urlparam = docbizkey.substr(idx + 1);
		}				
	}
	detail();
}

$("#J_getimg").on('click',function(){
	getdojobworkflow(urlparam,contypeid);
});
/*
 * 页面详情
 * */
function detail(){
	jsonGetAjax(basePath + '/contract/discount/getDetail', 
	{
		"discountId":urlparam,
		"docbizkey":docbizkey,
		"taskId":taskId,
		"templateId":tempId,
		"isEnd":isEnd
	}, function(result) {

		console.log(result.data);
		/*
		 * @ApiModelProperty("是否有效(0：作废，1：有效)")
		 * private Integer enableflag;
		 * */
		var iscancel=result.data.enableflag;
		if(iscancel==0){
			$("#J_editbtn").hide();
			$("#J_submitbtn").hide();
			$("#J_cancelbtn").hide();
			$("#J_nocancelbtn").show();
		}else if(iscancel==1){
			$("#J_nocancelbtn").hide();
			$("#J_cancelbtn").show();
		}
		//审核中 初始按钮不显示
		if(result.data.auditstatus=="审核中"){
			$('#J_btn_area').empty();
			$('#J_btn_area').hide();
		}
		if(docbizkey!=null){
			setworkflowbtn();
		}
		var strcontype=result.data.contracttype;
		//审批流程列表
		getapprovalhistory(strcontype);
		//审批流
		form_conid=result.data.conid;
		form_contype=result.data.contracttype
		// 业务类型  1:租赁，2：买卖
		if(form_contype=="租赁"){
			contypeid="LEASE_DISCOUNT";
			$(".J_lease_area").hide();//如果是租赁，不显示履约佣金和佣金合计
		}else if(form_contype=="买卖"){
			contypeid="BUY_DISCOUNT"; 
		}
		//getdojobworkflow(urlparam,contypeid);
		for(var key in result.data){
			if($("#tab-11 #J_detail_"+key)){
				$("#tab-11 #J_detail_"+key).text(result.data[key]);
			}
		}
		// 合同编号
		/*
		 * 合同编号 J_detail_contractcode 
		 * 房源编号  J_detail_housescode
		 * 客源编号 J_detail_customercode
		 * */
		//合同编号
		var contractcode_url="";
		//房源编号
		var housecode_url="";
		//客源编号
		var customercode_url="";
		
		if(form_contype=="租赁"){
			//合同
			contractcode_url="<a href='"+basePath+"/sign/detail/detail.html?conid="+form_conid+"&formal=true&other=true' target='_blank'>"+result.data.contractcode+"</a>";
			//房源
			housecode_url="<a href='"+basePath+"/house/main/leasedetail.htm?houseid="+result.data.housescode+"' target='_blank'>"+result.data.housescode+"</a>";
			//客源
			customercode_url="<a href='"+basePath+"/customer/main/findleaseclientbycustomerid.htm?customerId="+result.data.customercode+"' target='_blank'>"+result.data.customercode+"</a>";
			
		}else if(form_contype=="买卖"){
			//合同
			contractcode_url="<a href='"+basePath+"/sign/signthecontract/contractdetail.htm?conid="+form_conid+"&other=true' target='_blank'>"+result.data.contractcode+"</a>";
			//房源
			housecode_url="<a href='"+basePath+"/house/main/buydetail.htm?houseid="+result.data.housescode+"' target='_blank'>"+result.data.housescode+"</a>";
			//客源
			customercode_url="<a href='"+basePath+"/customer/main/findbuyerclientbycustomerid.htm?customerId="+result.data.customercode+"' target='_blank'>"+result.data.customercode+"</a>";
		}
		$("#J_detail_contractcode").html(contractcode_url);
		$("#J_detail_housescode").html(housecode_url);
		$("#J_detail_customercode").html(customercode_url);		
		
		
		$("#J_detail_signnumber").text(result.data.signnumber);
		$("#J_detail_auditstatus").text(result.data.auditstatus);
		
		var costobj=result.data.chargeobject;
		$(".J_customer_area").show();
		$(".J_owner_area").show();
		switch(costobj){
		case "0":
			$('input[name="chargeobject"]').attr("checked",true);
			break;
		case "1":
			$('input[value="'+costobj+'"]').attr("checked",true);
            $('input[value="2"]').parent().hide();
			$(".J_customer_area").hide();
			break;
		case "2":
			$('input[value="'+costobj+'"]').attr("checked",true);
            $('input[value="1"]').parent().hide();
			$(".J_owner_area").hide();
			break;
		}
		/* 
		 * J_ownertotalcost_company
		 * 业主佣金合计=业主居间佣金+业主履约佣金（公司规定）
		 * ownerbrokfixcomm + ownerperffixcomm
		 * 
		 * ownertotalcost_contract
		 * 业主佣金合计=业主居间佣金+业主履约佣金（合同约定）
		 * ownerbrokcomm + ownerperfcomm
		 * 
		 * 业主总折扣=业主佣金合计（合同约定）/业主佣金合计（公司规定）
		 * J_total_discount
		 *
		 * 总折扣(折)=折后佣金(元)/折前佣金(元)
		 * */
		var totaldiscount=(result.data.discountedcomm/result.data.perdiscountcomm*10).toFixed(2);
		$("#J_detail_totaldiscount").text(totaldiscount);
		if(totaldiscount>=10){
			$(".J_discount_area").hide();
		}else{
			$(".J_discount_area").show();
		}
		//业主佣金合计（公司规定）
		var otc_com=result.data.ownerbrokfixcomm + result.data.ownerperffixcomm;
		$("#J_ownertotalcost_company").text(otc_com);
		
		//业主佣金合计（合同约定）
		var otc_con=result.data.ownerbrokcomm + result.data.ownerperfcomm;
		$("#J_ownertotalcost_contract").text(otc_con);
		
		//业主总折扣
		var ot_d=(otc_con/otc_com*10).toFixed(2);
		$("#J_ownertotal_discount").text(ot_d);		
		
		//客户佣金合计（公司规定）
		var ctc_com=result.data.customerbrokfixcomm + result.data.customerperffixcomm;
		$("#J_customertotalcost_company").text(ctc_com);
		
		//客户佣金合计（合同约定）
		var ctc_con=result.data.customerbrokcomm + result.data.customerperfcomm;
		$("#J_customertotalcost_contract").text(ctc_con);
		
		//客户总折扣
		var ct_d=(ctc_con/ctc_com*10).toFixed(2);
		$("#J_customertotal_discount").text(ct_d);
		
		//if 租赁
		//折前佣金 = 业主居间(公司规定) + 客户居间(公司规定)
		//折后佣金 = 业主居间(合同约定) + 客户居间(合同约定)
		
		/*
		 * J_ownertotalcost_company
		 * 业主佣金合计 = 业主居间佣金 + 业主履约佣金（公司规定）
		 * ownerbrokfixcomm + ownerperffixcomm
		 *
		 * 业主佣金合计=业主居间佣金+业主履约佣金（合同约定）
		 * ownerbrokcomm + ownerperfcomm
		 * 
		//客户佣金合计（公司规定）
		var ctc_com=result.data.customerbrokfixcomm + result.data.customerperffixcomm;
		$("#J_customertotalcost_company").text(ctc_com);
		
		//客户佣金合计（合同约定）
		var ctc_con=result.data.customerbrokcomm + result.data.customerperfcomm;
		$("#J_customertotalcost_contract").text(ctc_con);
		
		 * */

		//总折扣就是折后除以折前
		
		if(form_contype=="租赁"){
			$(".J_lease_area").hide();//如果是租赁，不显示履约佣金和佣金合计
		}
		if(result.data.entrustedtransfer==1){
			$("#fff").text(result.data.entrustedtransfer);
			
			$(".J_brok_area").hide();//是否委托过户(0:否；1:是) 如果是1 则没有居间(客户、业主)
			$(".J_total_area").hide();
			
			var ownercomm=parseFloat($("#J_detail_ownerperfcomm").text());
			var customercomm=parseFloat($("#J_detail_customerperfcomm").text());
			var dcomm=ownercomm+customercomm;
			$("#J_detail_discountedcomm").text(dcomm);
			var pcomm=$("#J_detail_perdiscountcomm").text();
			$("#J_detail_totaldiscount").text((dcomm/pcomm*10).toFixed(2));
			
		}

		// 折扣显示数据格式		
		$("#J_detail_ownerperfdisc").text(parseFloat($("#J_detail_ownerperfdisc").text()).toFixed(2));
		$("#J_detail_customerperfdisc").text(parseFloat($("#J_detail_customerperfdisc").text()).toFixed(2));

		// 业主居间折扣
		$("#J_detail_ownerbrokdisc").text(parseFloat($("#J_detail_ownerbrokdisc").text()).toFixed(2));
		// 客户居间折扣
		$("#J_detail_customerbrokdisc").text(parseFloat($("#J_detail_customerbrokdisc").text()).toFixed(2));
		
		/*
		 * 打折原因(1:客户业主要求打折,2:中介合作,3:二次或多次成交,4:公司员工,5:其他公司抢单,6:其他原因)
		 * */
		$(".J_detail_contractnum").hide();
		$(".J_detail_employee").hide();
		var d_t=result.data.discountreason;
		var $jdd=$("#J_detail_discountreason");
		switch(d_t){
		case "1":
			$jdd.text("客户业主要求打折");
			break;
		case "2":
			$jdd.text("中介合作");
			break;
		case "3":			//打折原因，合同编号
			$jdd.text("二次或多次成交");
			$(".J_detail_contractnum").show();
			$("#J_detail_contractnum").text(result.data.reasonlist[0].associatename);
			break;
		case "4":			//打折原因，员工姓名
			$jdd.text("公司员工");
			$(".J_detail_employee").show();
			$("#J_detail_employee").text(result.data.reasonlist[0].associatename);
			break;
		case "5":
			$jdd.text("其他公司抢单");
			break;
		case "6":
			$jdd.text("其他原因");
			break;
		default:
			//alert("undifined");
			break;
		}

		var auditstatus_val=$("#J_detail_auditstatus").text();
		if(auditstatus_val=="审核不通过" || auditstatus_val=="审核通过"){
			$('#J_btn_area').hide();
		}
	})	
}
/*
 * 创建按钮
 * */
function setworkflowbtn(){
	jsonGetAjax(basePath + '/workflow/selectShowLabelBytemplateId',
		{	
			"templateId":tempId						
		},
		function(result) {
			var auditstatus=$("#J_detail_auditstatus").text();
			if(auditstatus!="待提交审批"){//待提交审批状态下，按钮正常显示
				if(result.data && result.data.length>0){
					var htmlbutton = '';
					$.each(result.data,function(i,n){
						htmlbutton += '<button type="button" class="btn btn-success btn-altogether btn_size" data-val="'+n.labelId+'">'+n.labelName+'</button>';
					});
					$(".J_opinions_area").show();
					$('#J_btn_area').show();
					$('#J_btn_area').empty();
					$('#J_btn_area').append(htmlbutton);
				}
			}
		}
	);
}
/*
 * 修改
 * */
$(document).on("click",'#J_editbtn',function(){
	window.location.href = basePath + '/contract/discount/edit?discountId='+urlparam;
})
/*
 * 提交 J_submitbtn
 * */
$('#J_submitbtn').off().on('click',function(){
	setaudit();
});
function setaudit(){
	var _this=this;
	/*if(_this.usersLock){
		return false;
	}else{
		_this.usersLock=true;
	}*/
	// 业务类型  1:租赁，2：买卖
	if(form_contype=="租赁"){
		contypeid="LEASE_DISCOUNT";
	}else if(form_contype=="买卖"){
		contypeid="BUY_DISCOUNT";
	}
	jsonPostAjax(basePath+'/workflow/doJob?modelName='+contypeid+'&methodName=findUserOnStart',{
		formId:urlparam
	},function(redata){
		commonContainer.modal('选择审批人','<table id="approver" class="table table-hover table-striped table-bordered"></table>',function(i){
			var getSelections=$('#approver').bootstrapTable('getSelections');	//选中的审批人
			//创建工作流
			if(getSelections.length>0){
				layer.close(i);
				var doJobUrl='/workflow/doJob?modelName='+contypeid+'&methodName=createWorkflow';
				
				jsonPostAjax(basePath+doJobUrl,{
				    formId:urlparam,
				    nextUser:getSelections[0].userId,				//审批人id
				},function(){
					layer.alert('提交成功', {
						skin: 'layui-layer-lan',
						closeBtn:0,  // 是否显示关闭按钮
						yes:function(){
							$(".J_btn_area").hide();
							location.reload();
						}
					});
				});
			}else{
				commonContainer.alert('请选择审批人');
			}
		},{
			btns:['确定','取消'],
			area:'600px',
			overflow :true,
			success:function(){
				$('#approver').bootstrapTable({
					singleSelect:true,		//设置单选
					clickToSelect:true,		//点击选中行
				    columns: [{
				        field: '',
				        title: '选择',
			        	checkbox:true,
				    	align:'center'
				    }, {
				        field: 'userName',
				        title: '用户姓名',
				        align:'center'
				    }, {
				        field: 'userDept',
				        title: '用户部门',
				        align:'center'
				    }],
				    data:redata.data
				});
			}
		});
	},{
		completeCallBack:function(){
			/*_this.usersLock=false;*/
		}
	});
}
/*
 * 审批流程按钮
 * */
$('#J_btn_area').off().delegate('button','click',function(event) {
	var datavalbutton = $(this).attr('data-val');
	if(!$("#J_edit_opinions").is(":hidden")){
		var opinions_val=$("#J_edit_opinions").val();
		if(opinions_val==""){
			commonContainer.alert("请输入审批意见");
			return;
		}
	}
	// 业务类型  1:租赁，2：买卖
	if(form_contype=="租赁"){
		contypeid="LEASE_DISCOUNT";
	}else if(form_contype=="买卖"){
		contypeid="BUY_DISCOUNT";
	}
	if(datavalbutton == 'toPass'){//通过
		if(isEnd){
			// submit
			jsonPostAjax(basePath+'/workflow/doJob?modelName='+contypeid+'&methodName=toPass',{
			    "formId":urlparam,
			    "comment":opinions_val,
				"docbizkey":docbizkey,
				"taskId":taskId,
				"templateId":tempId,
				"conId":form_conid,
				"isEnd":isEnd
			},function(){
				//layer.alert('提交成功');
				layer.alert('审核完成', {
					  time: 0 //不自动关闭
					  ,btn: ['确定']
					  ,yes: function(index){
						  layer.close(index);
						  $('#J_btn_area button').hide();
						  self.location.href=basePath+"/contract/discount/list.html";
					  }
					});
				$('#J_btn_area button').hide();
			});
		}else {
			// 选人
			//查询流程创建的审批人
			jsonPostAjax(basePath+'/workflow/doJob?modelName='+contypeid+'&methodName=findUserOnTask',{
			    "formId":urlparam,
			    "comment":opinions_val,
				"docbizkey":docbizkey,
				"taskId":taskId,
				"templateId":tempId,
				"isEnd":isEnd
			},function(redata){
				//commonContainer.modal(redata.data[0].currentApprovalProcess+'审批','<table id="approver" class="table table-hover table-striped table-bordered"></table>',function(i){
				commonContainer.modal('选择审批人','<table id="approver" class="table table-hover table-striped table-bordered"></table>',function(i){
					var getSelections=$('#approver').bootstrapTable('getSelections');	//选中的审批人
					//创建工作流
					if(getSelections.length>0){
						layer.close(i);
						jsonPostAjax(basePath+'/workflow/doJob?modelName='+contypeid+'&methodName=toPass',{
						    "nextUser":getSelections[0].userId,				//审批人id
						    "comment":opinions_val,
						    "formId":urlparam,
							"docbizkey":docbizkey,
							"taskId":taskId,
							"templateId":tempId,
							"isEnd":isEnd
						},function(){
							layer.alert('提交成功', {
								  time: 0 //不自动关闭
								  ,btn: ['确定']
								  ,yes: function(index){
								    layer.close(index);
								    $('#J_btn_area button').hide();
								  }
								});
							$('#J_btn_area button').hide();
						});
					}else{
						commonContainer.alert('请选择审批人');
					}
				},{
					btns:['确定','取消'],
					area:'600px',
					overflow :true,
					success:function(){
						$('#approver').bootstrapTable({
							singleSelect:true,		//设置单选
							clickToSelect:true,		//点击选中行
						    columns: [{
						        field: '',
						        title: '选择',
					        	checkbox:true,
						    	align:'center'
						    }, {
						        field: 'userName',
						        title: '用户姓名',
						        align:'center'
						    }, {
						        field: 'userDept',
						        title: '用户部门',
						        align:'center'
						    }],
						    data:redata.data
						});
					}
				});
			});
		}
	}
	if(datavalbutton == 'toReject'){//驳回初始人
		jsonPostAjax(basePath+'/workflow/doJob?modelName='+contypeid+'&methodName=toReject',{
		    "formId":urlparam,
		    "comment":opinions_val,
			"taskId":taskId,
			"templateId":tempId,
			"isEnd":isEnd
		},function(){
			layer.alert('驳回成功');
			$('#J_btn_area button').hide();
		});
	}
	if(datavalbutton == 'noPass'){//不通过
		jsonPostAjax(basePath+'/workflow/doJob?modelName='+contypeid+'&methodName=toReject',{
		    "formId":urlparam,
		    "comment":opinions_val,
			"taskId":taskId,
			"templateId":tempId,
			"noPass":true,
			"isEnd":isEnd
		},function(){
			layer.alert('提交成功');
			$('#J_btn_area button').hide();
		});
	}
	if(datavalbutton == 'toRejectLastStep'){//驳回上一步
		jsonPostAjax(basePath+'/workflow/doJob?modelName='+contypeid+'&methodName=toRejectLastStep',{
		    "formId":urlparam,
		    "comment":opinions_val,
			"taskId":taskId,
			"templateId":tempId,
			"isEnd":isEnd
		},function(){
			layer.alert('驳回成功');
			$('#J_btn_area button').hide();
		});
	}
});

/*
 * 作废 J_cancelbtn 
 * */
$(document).on("click",'#J_cancelbtn',function(){
	setcancel(0);
})
/*
 * 取消作废 J_nocancelbtn 
 * */
$(document).on("click",'#J_nocancelbtn',function(){
	setcancel(1);
})

function setcancel(enableflag){
	jsonGetAjax(basePath + '/contract/discount/updateEnableFlag', 
	{		
		"discountId":urlparam,
		"enableFlag":enableflag
	}, function(result) {
		if(enableflag==0){
			commonContainer.alert('作废成功');
		}else{
			commonContainer.alert('取消作废成功');
		}
		location.reload();	
	})
}
/*
 *  获取审批历史列表
 * */
function getapprovalhistory(objcontype){
	//1：租赁，2：买卖
	var strcontype;
	switch(objcontype){
	case "租赁":
		strcontype="1";
		break;
	case "买卖":
		strcontype="2";
		break;
	default:
		strcontype="1";
		break;
	}
	jsonGetAjax(basePath + '/contract/discount/selectWorkflowHistoryList', 
	{		
		"discountId":urlparam,
		"contractType":strcontype
		
	}, function(result) {
		//console.log(result.data[0].assignee);
		/*var list = [
		            {type:'6101',deptName:'北京市',jobName:'job11',assignee:'assignee11',jobName:'job11',createTime:'createTime11',statusDesc:'statusDesc11',status:'status11',lastTime:'lastTime11'}, 
		            {type:'6102',deptName:'北京市',jobName:'job12',assignee:'assignee12',jobName:'job12',createTime:'createTime12',statusDesc:'statusDesc12',status:'status12',lastTime:'lastTime12'}, 
		            {type:'6103',deptName:'北京市',jobName:'job13',assignee:'assignee13',jobName:'job13',createTime:'createTime13',statusDesc:'statusDesc13',status:'status13',lastTime:'lastTime13'}
		            ];*/
		//var aa=result.data;
		//var list=JSON.parse(aa);
		var list=result.data;
		var tbody = $('<tbody></tbody>');
		for(var i=0;i<list.length;i++){
			var row="<tr>";
			var r_num=i+1;
			row +="<td>"+r_num+"</td>";
			row +="<td>"+list[i].type+"</td>";
			if(list[i].deptName==undefined){
				row +="<td>-</td>";
			}else{
				row +="<td>"+list[i].deptName+"</td>";
			}
			row +="<td>"+list[i].roleName+"</td>";
			row +="<td>"+list[i].assignee+"</td>";
			row +="<td>"+list[i].createTime+"</td>";
			row +="<td>"+list[i].statusDesc+"</td>";
			row +="<td>"+list[i].status+"</td>";
			if(list[i].lastTime==undefined){
				row +="<td>-</td>";
			}else{
				row +="<td>"+list[i].lastTime+"</td>";
			}
			row +="</tr>";
		    $(tbody).append(row);
		}
		$('#J_dataTable_examine tbody').replaceWith(tbody);
	})
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null)
        return unescape(r[2]);
    return null; //返回参数值
}