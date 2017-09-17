/**
 * 房源查看电话
 */
$(function(){
	//初始化数据
	$("select").chosen({
		width : "100%", no_results_text: "未找到此选项!"
	});
})
var peopleDialog='<div id="addppeople_layer" class="ibox-content" style="display: none">' +
	'<form id="addppeople_form" name="addppeople_form" class="form-horizontal">' +
'<div class="row">' +
	'<div class="col-sm-4">' +
		'<div class="form-group">'+
			'<label class="col-sm-4 control-label"><span class="text-danger">*</span>联系人类别:</label>' +
			'<div class="col-sm-8">' +
				'<select id="contactType" name="contactType" class="J_chosen form-control" data-placeholder="请选择">' +
					'<option value="">请选择</option>' +
				'</select>' +
			'</div>' +
		'</div>' +
	'</div>' +
	'<div class="col-sm-4">' +
		'<div class="form-group">' +
			'<label class="col-sm-3 control-label"><span class="text-danger">*</span>姓名：</label>' +
			'<div class="col-sm-7">' +
				'<input type="text" class="form-control" id="customerName" name="customerName" maxlength="20">' +
			'</div>' +
		'</div>' +
	'</div>' +
	'<div class="col-sm-4">' +
		'<div class="form-group">' +
			'<label class="col-sm-3 control-label"><span class="text-danger">*</span>性别：</label>' +
			'<div id="gender" class="col-sm-7">' +
			'</div>' +
		'</div>' +
	'</div>' +

'</div>' +
'<div class="row">' +
	'<div class="col-sm-4">' +
		'<div class="form-group">' +
			'<label class="col-sm-4 control-label"><span class="text-danger">*</span>联系方式类别:</label>' +
			'<div class="col-sm-8">' +
				'<select id="phonetype" name="" class="J_chosen form-control phonetype" data-placeholder="请选择">' +
					'<option value="1">国内手机</option>' +
					/*'<option value="2">国内座机</option>' +
					'<option value="3">国外电话</option>' +*/
				'</select>' +
			'</div>' +
		'</div>' +
	'</div>' +
	'<div class="col-sm-4">' +
		'<div class="form-group">' +
			'<label class="col-sm-3 control-label"><span class="text-danger">*</span>电话：</label>' +
			'<div class="col-sm-7">' +
				'<input type="text" class="form-control" id="customerPhone" name="customerPhone" maxlength="15">' +
				'<div class="remark" style="margin-top: 3px;display: none;color:#ed5565;">注:国内座机格式区号（3或4位）-固话（7或8位）</div>' +
			'</div>' +
		'</div>' +
	'</div>' +
	'<div class="col-sm-4">' +
		'<div class="form-group">' +
			'<label class="col-sm-4 control-label"><span class="text-danger">*</span>与产权人关系:</label>' +
			'<div class="col-sm-8">' +
				'<select id="ownership" name="ownership" class="J_chosen form-control" data-placeholder="请选择">' +
					'<option value="">请选择</option>' +
				'</select>' +
			'</div>' +
		'</div>' +
	'</div>' +

'</div>' +
'</form>' +
'</div>'
var phoneDialog = '<div id="J_checkPhoneLayer" class="ibox-content m20" style="display: none">' +
'<div class="col-md-12"><div class="font-bold font-blue"><a id="J_add_people" class="btn-green btn-bitbucket add-icon"><i class="glyphicon glyphicon-plus"></i> 添加</a></div></div>'+
'<form class="form-horizontal">'+
	'<table id="dataTablePeople" class="table table-striped table-bgcolor">'+
	'<thead>'+
	'<tr>'+
		'<td class="bgcolor"><span>联系人类别<span></td>'+
		'<td class="bgcolor"><span>姓名</span></td>'+
		'<td class="bgcolor"><span>性别</span></td>'+
		'<td class="bgcolor"><span>号码</span></td>'+
		'<td class="bgcolor"><span>与产权人关系</span></td>'+
		'<td class="bgcolor"><span>操作</span></td>'+
	'</tr>'+
'</thead>'+
		'<tbody>'+
			
		'</tbody>'+
	'</table>'+
'</form>' +
'</div>';	
var houseId;
function checkPhone(houseId) {
	houseId=houseId;
	commonContainer.showLoading();
	jsonGetAjax(basePath+'/house/main/checkProtectStatus',{
		houseId:houseId,
		type:1
	},function(result){		
		 if(result.code != 0){
			 commonContainer.hideLoading();
			 layer.alert(result.msg);
			 return ;
		 }
	$.ajax({
		url : basePath + '/house/queryprivacy/phoneslist',
		data:{houseid:houseId},
		type : 'get',
		dataType : 'json',
		cache : false,
		contentType : "application/json ; charset=utf-8",
		success : function(result) {
			commonContainer.hideLoading();
			if (result.code == '0') {
				showPhone(houseId,result);
			}else if(result.code == '2'){
				layer.alert(result.msg);
			} else {// 返回值为1 弹出强制跟进 模态框
				$('#J_businessType').val(result.data.housekind);
				var dataphonefollowType = result.data.followtype; // 获取地址跟进中返回参数判断  返回值为2--查看地址跟进， 返回值是1--查看电话跟进
				if(dataphonefollowType == '2'){// 根据返回的参数 做转换 2--查看地址跟进 对应到跟进接口里面 3是查看地址跟进
					dataphonefollowType ='3'
				}else if(dataphonefollowType == '1'){// 根据返回的参数 做转换 1--查看电话跟进 对应到跟进接口里面 2是查看电话跟进
					dataphonefollowType ='2'
				}
				if(result.data.flag == true){
					addFollowPhone(houseId, 1, dataphonefollowType, true);
				}
				if(result.data.flag == false && result.data.struts == true){
					layer.alert('今日查看次数已满');
				}
			}
		}
	})	
	})
}
var showPhoneFlag=true;
function showPhone(houseId,result) {
	if(showPhoneFlag){
		$(document.body).append(phoneDialog);
		showPhoneFlag=false;
	}
	
	commonContainer.modal(//查看电话模态框
		'查看电话',
		$('#J_checkPhoneLayer'),
		function(index, layero) {
			layer.close(index);
			addFollowPhone(houseId, 1, 2, false);
		}, 
		{
			overflow :true,
			area : ['80%','80%'],
			btns : ['关闭'],
			success: function() {//展示查看电话数据
				if(result.data.phoneslist.length>0){
					var str;
					for(var i=0;i<result.data.phoneslist.length;i++){	
						str+='<tr>'
						str+='<td id="'+result.data.phoneslist[i].typeId+'">'+result.data.phoneslist[i].type+'</td>'
						str+='<td>'+result.data.phoneslist[i].name+'</td>'
						str+='<td id="'+result.data.phoneslist[i].sexId+'">'+result.data.phoneslist[i].sex+'</td>'
						str+='<td class="col-md-3"><div class="phone-show"><span class="phonelist" china="china">'+result.data.phoneslist[i].phones+'</span><a id="J_add_phone" class="btn-green btn-bitbucket add-p" style="float: right;"><i class="glyphicon glyphicon-plus"></i></a></div></td>'
						str+='<td id="'+result.data.phoneslist[i].relationshipId+'">'+result.data.phoneslist[i].relationship+'</td>'
						str+='<td class="col-md-1"><a class="btn-bitbucket"><i class="glyphicon glyphicon-remove" attr='+result.data.phoneslist[i].contactId+'></i></a><a class="btn-bitbucket"><i class="glyphicon glyphicon-pencil J_edit_people" attr='+result.data.phoneslist[i].contactId+'></i></a></td>'
					'</tr>';
					}
					$("#dataTablePeople tbody").append(str);
				}
				
				
			}
		}
	);
}

//强制跟进 模态框 
var followDialogphone = '<div id="J_addFollowLayerPhone" class="ibox-content" style="display: none">'+
'<form name="add_form" class="form-horizontal">'+						   
		'<div class="row">'+
			'<div id="J_showHouseBasicInfo" style="display:none;">'+
				'<div class="row">'+
					'<div class="col-sm-4">'+
						'<label class="col-sm-5 control-label">房源编号：</label>'+
						'<input type="hidden" value="" id="J_housekind">'+
						'<p class="col-sm-7 form-control-static"><a id="J_houseId"></a></p>'+
					'</div>'+
					'<div class="col-sm-4">'+
						'<label class="col-sm-5 control-label">楼盘：</label>'+
						'<p class="col-sm-7 form-control-static" id="J_conmmunity"></p>'+
					'</div>'+
					'<div class="col-sm-4">'+
						'<label class="col-sm-5 control-label">栋座：</label>'+
						'<p class="col-sm-7 form-control-static" id="J_building"></p>'+
					'</div>'+
				'</div>'+
				'<div class="row">'+
					'<div class="col-sm-4">'+
						'<label class="col-sm-5 control-label">户型：</label>'+
						'<p class="col-sm-7 form-control-static" id="J_houseStructure"></p>'+
					'</div>'+
					'<div class="col-sm-4">'+
						'<label class="col-sm-5 control-label">建筑面积：</label>'+
						'<p class="col-sm-2 form-control-static" id="J_houseArea"></p>'+
						'<p class="col-sm-5 control-label text-left">平方米</p>'+
					'</div>'+
					'<div class="col-sm-4">'+
						'<label class="col-sm-5 control-label">所属人：</label>'+
						'<input type="hidden" value="" id="J_usid">'+
						'<p class="col-sm-7 form-control-static"><a id="J_belongUserId"></a></p>'+
					'</div>'+
				'</div>'+
				'<div class="row">'+
					'<div class="col-sm-10">'+
						'<label class="col-sm-4 control-label">关键信息查看未跟进记录：</label>'+
						'<span class="col-sm-2 control-label text-left" id="J_noFollowType"></span>'+
						'<span class="col-sm-6 control-label text-left" id="J_noFollowTime"></span>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col-md-11 mt20">'+
					'<div class="form-group">'+
						'<label class="col-sm-3 control-label"><span class="color_red">*</span>房源评价跟进：</label>'+
						'<div class="col-sm-4">'+
							'<select id="J_evaluatePhone" name="evaluate" class="J_chosen form-control">'+
							'</select>'+
						'</div>'+
						'<div id="J_notContact_box" class="col-sm-4" style="padding-left:10px !important; display:none !important;">'+
							'<select id="J_notContactReason" name="notcontactreason" class="J_chosen form-control">'+
							'</select>'+
						'</div>'+
					'</div>'+
					'<div class="form-group">'+
						'<label class="col-sm-3 control-label"><span class="color_red">*</span>跟进内容：</label>'+
						'<div class="col-sm-7">'+
							'<textarea followType="text" id="J_textarea" name="content" class="form-control" maxlength="500"></textarea>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>'+
	'</form>'+
'</div>';
var followPhoneFlag=true;
function addFollowPhone(houseId, followType, followWay, showPhoneAfterClosed) {	
	/*$('#J_addFollowLayerPhone').remove();*/
	if(followPhoneFlag){
		$(document.body).append(followDialogphone);
		followPhoneFlag=false;
	}
		
	//初始化数据
	$("select").chosen({
		width : "100%", no_results_text: "未找到此选项!"
	});
	var followTitle = '';
	if(followWay > 1){
		followTitle = "强制跟进";
		$('#J_addFollowLayerPhone #J_showHouseBasicInfo').show();
	}else{
		followTitle = "添加跟进";
		$('#J_addFollowLayerPhone #J_showHouseBasicInfo').hide();
	};
	
	//判断是否是强制跟进，如果是加载强制跟进数据
	if(followWay > 1){
		commonContainer.showLoading();
		$.ajax({
			url : basePath + '/house/queryprivacy/followuplist',
			data:{houseid:houseId},
			type : 'get',
			dataType : 'json',
			cache : false,
			contentType : "application/json ; charset=utf-8",
			success : function(result) {
				commonContainer.hideLoading();
				if(result.data&& typeof (result.data) != "undefined"){
					var phonebedroom = result.data.bedroom;
					var phonelivingroom = result.data.livingroom;
					var phonekitchen = result.data.kitchen;
					var phonetoilet = result.data.toilet;
					var phonebalcony = result.data.balcony;
					var phonefollowtype = result.data.followtype;
					if(phonefollowtype == '1'){
						phonefollowtype = '查看电话';
					}else{
						phonefollowtype = '查看地址';
					}
					
					if(phonebedroom == undefined || phonebedroom == ''){
						phonebedroom = 0;
					};
					if(phonelivingroom == undefined || phonelivingroom == ''){
						phonelivingroom = 0;
					};
					if(phonekitchen == undefined || phonekitchen == ''){
						phonekitchen = 0;
					};
					if(phonetoilet == undefined || phonetoilet == ''){
						phonetoilet = 0;
					};
					if(phonebalcony== undefined || phonebalcony == ''){
						phonebalcony = 0;
					};
					$('#J_addFollowLayerPhone #J_houseId').text(result.data.housesid);
					$('#J_addFollowLayerPhone #J_conmmunity').text(result.data.address);
					$('#J_addFollowLayerPhone #J_building').text(result.data.louhao);
					$('#J_addFollowLayerPhone #J_houseStructure').text(phonebedroom+'-'+phonelivingroom+'-'+phonekitchen+'-'+phonetoilet+'-'+phonebalcony);
					$('#J_addFollowLayerPhone #J_houseArea').text(result.data.buildarea);
					$('#J_addFollowLayerPhone #J_belongUserId').text(result.data.unname);
					$('#J_addFollowLayerPhone #J_noFollowType').text(phonefollowtype);
					$('#J_addFollowLayerPhone #J_noFollowTime').text(result.data.creatrtime.substring(0,19));
					$('#J_addFollowLayerPhone #J_usid').val(result.data.usid);
					$('#J_addFollowLayerPhone #J_housekind').val(result.data.housekind);
					
					//强制跟进弹出框加载
					commonContainer.modal(
						followTitle,
						$('#J_addFollowLayerPhone'),
						function(indexy, layero) {
							var phonecontent = $('#J_addFollowLayerPhone #J_textarea').val();
							if(phonecontent == ''){
								layer.alert('请输入跟进内容');
								return false;
							}
							commonContainer.showLoading();
							jsonPostAjax(
								basePath + '/house/follow/insert',
								{	
									"houseid": result.data.housesid,
									"type": followType,
									"way": followWay,
									"content": phonecontent,
									"evaluate": $('#J_addFollowLayerPhone #J_evaluatePhone').val(),
									"notContactReason" : $('#J_addFollowLayerPhone #J_notContactReason').val()
								},
								function(result) {
									/*layer.close(index);
									$('#J_addFollowLayerPhone').remove();*/
									
									if(showPhoneAfterClosed) {
										$.ajax({
											url : basePath + '/house/queryprivacy/phoneslist',
											data:{houseid:houseId},
											type : 'get',
											dataType : 'json',
											cache : false,
											contentType : "application/json ; charset=utf-8",
											success : function(res) {
												commonContainer.hideLoading();
												layer.close(indexy);
												if (res.code == '0') {
													showPhone(houseId,res);
												} else {
													layer.alert(res.msg);
													return false;
												}
											}
										})	
									}else{
										commonContainer.hideLoading();
										layer.close(indexy);
									}
								}
							)
						}, 
						{
							overflow :false,
							area : ['650px'],
							btns : ['保存', '关闭'],
							success: function() {
						  		$('#J_addFollowLayerPhone #J_evaluate').html('');
						  		$('#J_addFollowLayerPhone #J_notContactReason').html('');
								$('#J_addFollowLayerPhone #J_textarea').val('');
								var businessType = result.data.housekind;
								// 初始化跟进评价数据
								if(businessType == '1') {
									dimContainer.buildDimChosenSelector($("#J_evaluatePhone", $('#J_addFollowLayerPhone')), "LessorHouseEvaluate", "1");
								} else if(businessType == '2'){
									dimContainer.buildDimChosenSelector($("#J_evaluatePhone", $('#J_addFollowLayerPhone')), "SellerHouseEvaluate", "1");
								}
								
								//查看电话监听联系业主失败原因数据
								$('#J_evaluatePhone').on('input change',function(){
									var followevaluate=$(this).val();
									
									if(followevaluate == '4'){
										$('#J_notContact_box').show();
										//初始化无法联系业主原因数据
										dimContainer.buildDimChosenSelector($("#J_notContactReason",$('#J_addFollowLayerPhone')), "notContactReason", "1");
									}else{
										$('#J_notContact_box').hide();
									}

								});
							}
						}
					);
				}else{
					layer.alert('数据返回有误,查看核心信息失败');
				}				
			}
		})	
	}
}

$(document).delegate(
	'#J_houseId',
	'click',
	function(event) {
		var businesstype = $('#J_housekind').val();
		var houseId = $('#J_houseId').html();
		if(businesstype=='1'){
			window.location.href = basePath+"/house/main/leasedetail.htm?houseid="+houseId;
		};
		if(businesstype=='2'){
			window.location.href = basePath+"/house/main/buydetail.htm?houseid="+houseId;
		}
	}
)

$(document).delegate(
	'#J_belongUserId',
	'click',
	function(event) {
		var userId = $('#J_usid').val();
		getUserStaffInfo(userId);
	}
)
var showPeopleFlag=true;
var initflag=true;
$(document).on("click",'#J_add_people',function(){
if(showPeopleFlag){					
	$(document.body).append(peopleDialog);
	showPeopleFlag=false;
}
commonContainer.modal(
		'联系方式录入',
		$('#addppeople_layer'),
		function(index, layero) {
			var validate = true;
			if(!peopleValidate()){
				console.log("校验失败");
				commonContainer.alert("存在不符合规则的数据！");
				return;
			} 
			var value = $("#customerPhone").val();
			if($("#phonetype").val()==1){						   
				  var mobile = /^((\+?86)|(\(\+86\)))?(1[34578]\d{9})$/;							   
				  if(!(mobile.test(value))){
					  commonContainer.alert("国内手机格式不正确！");
					  return; 
				  }	
			}else if($("#phonetype").val()==2){
				 var tel =/^([0-9]{3,4}-)[0-9]{7,8}$/;  
				  if(!(tel.test(value))){
					  commonContainer.alert("国内座机格式不正确！");
					  return; 
				  }	
			}else{

			}
			var genderval=$('input:radio[name="genderId"]:checked').val();
			var gender='';
			if(genderval==1){
				gender='先生';
			}else{
				gender='女士';
			}
				
			var str='<tr><td class="col-md-2" id="'+$("#contactType").val()+'">'+$("#contactType").find("option:selected").text()+'</td>'
			str+='<td class="col-md-2">'+$("#addppeople_layer #customerName").val()+'</td>'
			str+='<td class="col-md-2" id="'+genderval+'">'+gender+'</td>'
			if($("#phonetype").val()!=1&&$("#phonetype").val()!=2){
				str+='<td class="col-md-3"><div class="phone-show"><span class="phonelist">'+$("#addppeople_layer #customerPhone").val()+'</span><a id="J_add_phone" class="btn-green btn-bitbucket add-p" style="float: right;"><i class="glyphicon glyphicon-plus"></i></a></div></td>'					
			}else{
				str+='<td class="col-md-3"><div class="phone-show"><span class="phonelist" china="china">'+$("#addppeople_layer #customerPhone").val()+'</span><a id="J_add_phone" class="btn-green btn-bitbucket add-p" style="float: right;"><i class="glyphicon glyphicon-plus"></i></a></div></td>'							
			}
			str+='<td class="col-md-2" id="'+$("#ownership").val()+'">'+$("#ownership").find("option:selected").text();+'</td></tr>'
            	commonContainer.showLoading();
				jsonPostAjax(
						basePath + '/house/main/insertContact',
						{	
							"houseid": houseId,
							"name": $("#addppeople_layer #customerName").val(),
							"phones": $("#customerPhone").val(),
							"relationshipid": $("#ownership").val(),
							"sexid": genderval,
							"typeid" : $("#contactType").val()
						},
						function(result) {
                            commonContainer.hideLoading();
							str+='<td class="col-md-1"><a class="btn-bitbucket"><i class="glyphicon glyphicon-remove" attr="'+result.data+'"></i></a><a class="btn-bitbucket"><i class="glyphicon glyphicon-pencil J_edit_people" attr="'+result.data+'"></i></a></td>'
							if($("#contactType").val()==2){
								$("#dataTablePeople tbody").prepend(str);
							}else{
								$("#dataTablePeople tbody").append(str);
							}
							layer.close(index);
						})
			
		}, 
		{
			overflow :true,
			area : ['1000px','80%'],
			btns : [ '保存'],
			success: function(){
                commonContainer.hideLoading();
				$("#addppeople_form")[0].reset();
				if(initflag==true){
					dimContainer.buildDimRadio($("#gender"), "genderId", "gender", "1");//性别
					dimContainer.buildDimChosenSelector($("#contactType"), "contactType", "contactType", "");//联系人类别
					dimContainer.buildDimChosenSelector($("#ownership"), "ownership", "ownership", "");//与产权人关系
					initflag=false;
				}
				$("#phonetype").removeAttr("disabled");
				$("#customerPhone").removeAttr("disabled");		
				$('.J_chosen').trigger("chosen:updated");
				$("input[name='genderId']:eq(0)").prop("checked", "checked");
				$('.remark').hide();
			}
		}
	)
})
$(document).on("click",'.J_edit_people',function(){
var _this=$(this);
if(showPeopleFlag){
	$(document.body).append(peopleDialog);	
	showPeopleFlag=false;
}
contactId=_this.attr("attr");
commonContainer.modal(
		'联系方式修改',
		$('#addppeople_layer'),
		function(index, layero) {
			var validate = true;
			if(!peopleValidate()){
				console.log("校验失败");
				commonContainer.alert("存在不符合规则的数据！");
				return;
			} 
			/*var value = $("#customerPhone").val();
			if($("#phonetype").val()==1){						   
				  var mobile = /^((\+?86)|(\(\+86\)))?(1[34578]\d{9})$/;							   
				  if(!(mobile.test(value))){
					  commonContainer.alert("国内手机格式不正确！");
					  return; 
				  }	
			}else if($("#phonetype").val()==2){
				 var tel =/^([0-9]{3,4}-)[0-9]{7,8}$/;  
				  if(!(tel.test(value))){
					  commonContainer.alert("国内座机格式不正确！");
					  return; 
				  }	
			}else{

			}*/
			$("#phonetype").removeAttr("disabled");
			$("#customerPhone").removeAttr("disabled");
			var genderval=$('input:radio[name="genderId"]:checked').val();
			var gender='';
			if(genderval==1){
				gender='先生';
			}else{
				gender='女士';
			}
				
			var str='<tr><td class="col-md-2" id="'+$("#contactType").val()+'">'+$("#contactType").find("option:selected").text()+'</td>'
			str+='<td class="col-md-2">'+$("#addppeople_layer #customerName").val()+'</td>'
			str+='<td class="col-md-2" id="'+genderval+'">'+gender+'</td>'
			if($("#phonetype").val()!=1&&$("#phonetype").val()!=2){
				str+='<td class="col-md-3"><div class="phone-show"><span class="phonelist">'+$("#customerPhone").val()+'</span><a id="J_add_phone" class="btn-green btn-bitbucket add-p" style="float: right;"><i class="glyphicon glyphicon-plus"></i></a></div></td>'					
			}else{
				str+='<td class="col-md-3"><div class="phone-show"><span class="phonelist" china="china">'+$("#customerPhone").val()+'</span><a id="J_add_phone" class="btn-green btn-bitbucket add-p" style="float: right;"><i class="glyphicon glyphicon-plus"></i></a></div></td>'							
			}
			str+='<td class="col-md-2" id="'+$("#ownership").val()+'">'+$("#ownership").find("option:selected").text();+'</td></tr>'
			str+='<td class="col-md-1"><a class="btn-bitbucket"><i class="glyphicon glyphicon-remove" attr='+contactId+'></i></a><a class="btn-bitbucket"><i class="glyphicon glyphicon-pencil J_edit_people" attr='+contactId+'></i></a></td>'
			jsonPostAjax(
					basePath + '/house/main/updateContact',
					{	
						"contactId":contactId,
						"houseid": houseId,
						"name": $("#addppeople_layer #customerName").val(),
						"phones": $("#customerPhone").val(),
						"relationshipid": $("#ownership").val(),
						"sexid": genderval,
						"typeid" : $("#contactType").val()
					},
					function(result) {
						if($("#contactType").val()==2){
							$("#dataTablePeople tbody").prepend(str);
						}else{
							_this.closest('tr').before(str);
						}
						_this.closest('tr').remove();
						layer.close(index);
					})
			
		}, 
		{
			overflow :true,
			area : ['1000px','80%'],
			btns : [ '保存'],
			success: function(){
				$("#addppeople_form")[0].reset();
				var list=[];				
				if(initflag==true){					
					list.push(dimContainer.buildDimRadio($("#gender"), "genderId", "gender", "1"));//性别
					list.push(dimContainer.buildDimChosenSelector($("#contactType"), "contactType", "contactType", ""));//联系人类别
					list.push(dimContainer.buildDimChosenSelector($("#ownership"), "ownership", "ownership", ""));//与产权人关系
					initflag=false;
				}
				$("#phonetype").attr({"disabled":"disabled"});
				$("#customerPhone").attr({"disabled":"disabled"});
				$.when.apply($,list).then(function(){
					var sexId=_this.closest('tr').find('td').eq(2).attr("id");
					var typeId=_this.closest('tr').find('td').eq(0).attr("id");
					var relationshipId=_this.closest('tr').find('td').eq(4).attr("id");
					var name=_this.closest('tr').find('td').eq(1).text();
					var phone=_this.closest('tr').find('td').eq(3).text();					
					
					$("#customerPhone").val(phone);
					$("#addppeople_layer #customerName").val(name);
					$("input[name='genderId'][value="+sexId+"]").prop("checked",true);
					$("#contactType").val(typeId);
					$("#ownership").val(relationshipId);
						
					$('.J_chosen').trigger("chosen:updated");
					$('.remark').hide();
				});
			}
		}
	)
})
$(document).on("click",'#J_add_phone',function(){
	var _this=$(this);
	var phonelist= _this.closest(".phone-show").find('.phonelist').text();
	if(phonelist!=''){
		phonelist=phonelist.split(',');
	}		
	editPhone(_this.closest(".phone-show").find('.phonelist'),phonelist,'edit',houseId);	
})
$(document).delegate('#dataTablePeople .glyphicon-remove', 'click', function(event){
	var _this=$(this);
	var contactId=_this.attr("attr");
	if($("#dataTablePeople tbody tr").length==1){
		return layer.msg("电话信息至少有一条，禁止删除！");
	}
	commonContainer.confirm(
	'是否确认删除此条信息？',
	function(index, layero){
		jsonGetAjax(
		basePath + '/house/main/deleteContactById',
		{	
			"contactId":contactId,
			"houseid": houseId
		},
		function(result) {
			_this.closest('tr').remove();	
			layer.msg("删除成功");
			layer.close(index);
		})
	})
	
	
	
})