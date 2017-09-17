var houseId=getQueryString("houseid");
var belonguserid='';
var usersid='';
var finalassessmentCode;
function noneCheck(){
	commonContainer.alert("该房源已被保护，无法查看！");
}
function noneJurisdiction(){
	return commonContainer.alert("无权限！");
}
function housestates(states){
	if(states=="无效"){
		commonContainer.alert("无效房源无法查看！");
	}else if(states=="成交"){
		commonContainer.alert("该房源已报成交，无法查看！");
	}	
}
//用来在子页面触发刷新表格用
$(document).on('feedback', function () {
	//location.reload();
	$("#J_feedback").hide();
});

function GetQueryString(name){ 
	   var reg=eval("/"+name+"/g");
	   var r = window.location.search.substr(1); 
	   var flag=reg.test(r);
	   if(flag){
	        return true;
	   }else{
	       return false;
	   } 
	}
$.fn.updateSerializeObject = function() {
	var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    
    var $radio = $('input[type=radio],input[type=checkbox]',this);
    $.each($radio, function(){
        if(!o.hasOwnProperty(this.name)){
            o[this.name] = '';
        }
    });
    
    return o;
}

$(function(){
	if(GetQueryString("from")){
		proxyNewlyObj.documentEntry(houseId);
	}
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // 获取已激活的标签页的名称
        var activeTab = $(e.target).attr("href");
        if(activeTab=='#tab-11'){
        	detail();
        }else if(activeTab=='#tab-13'){
        	//初始加载跟进记录
        	followUp('',houseId);
        }else if(activeTab=='#tab-14'){
        	trace(houseId);
        }else if(activeTab=='#tab-15'){
        	historylist();
        }else if(activeTab=='#tab-16'){
        	operationLogs();
        }else if(activeTab=='#tab-12'){
        	startInit('iframeId', 560);
        }
    });
});
window.onload=function(){
	$("#sign").attr({'href':basePath.replace('sales','tms')+"/tmsHouseResChLog/toNosignApplyList.htm?houseId="+houseId});
	if($(".tabs-container ul li").length!=0){
		$(".tabs-container ul li").eq(0).addClass('active');
		$("#tab-content1 .tab-pane").eq(0).addClass('active');
		var activeTab = $(".tabs-container ul li").eq(0).children('a').attr("href");
		 if(activeTab=='#tab-11'){
        	detail();
        }else if(activeTab=='#tab-13'){
        	//初始加载跟进记录
        	followUp('',houseId);
        }else if(activeTab=='#tab-14'){
        	trace(houseId);
        }else if(activeTab=='#tab-15'){
        	historylist();
        }else if(activeTab=='#tab-16'){
        	operationLogs();
        }
	}
	//initListLoad();	
	detail();
}	
var validate, validatorRule,trace;
function updateentrustprice(){
	var price=$('#entrustprice').text();
	commonContainer.modal(
			'修改委托价',
			$('#J_editpriceLayer'),
			function(index, layero) {
				validate = $('#J_editpriceForm1').validate({
					rules:{
						newPrice: {
					    	required:{
					    		depends: function(element) {
					    			if($(element).closest('.form-group').find('.text-danger').length!=0)
					    				return true;
					    		}
					    		},
					    	number:true,
					    	min:0,
					    	decimal: true,
					    	isFloatGtZero:true,
					    }
					}
				}).form();
				if(!validate) return false;
				/*if($('#J_newLabel').val()==price){
					commonContainer.alert("修改成功");
					layer.close(index);
				}*/
				trace = '修改委托价，修改前为：' + price + '，修改后为：' + $('#J_newValue2').val();
				jsonPostAjax(basePath + '/house/main/modifyhouse', {"housesid":houseId,"entrustprice":$('#J_newValue2').val(),"trace":trace}, function(result) {
					commonContainer.alert("修改成功");
					layer.close(index);
					window.location.reload();
					/*if(price>$('#J_newValue2').val()){
						if($("#J_update_price .house-val").find('.fa').hasClass('fa-long-arrow-up')){
							$("#J_update_price .house-val").css({"color":'#57CC00'});
							$("#J_update_price .house-val").find('.fa').removeClass('fa-long-arrow-up');
							$("#J_update_price .house-val").find('.fa').addClass('fa-long-arrow-down');
						}else if($("#J_update_price .house-val").find('.fa').hasClass('fa-long-arrow-down')){
							
						}else{
							$("#J_update_price .house-val").css({"color":'#57CC00'});
							$("#J_update_price .house-val").css({"cursor":'#pointer'});
							var str='<i class="fa"></i>';
							$('.house-val').append(str);
							$("#J_update_price .house-val").find('.fa').addClass('fa-long-arrow-down');
						}
						
					}else if(price<$('#J_newValue2').val()){
						if($("#J_update_price .house-val").find('.fa').hasClass('fa-long-arrow-up')){
							
						}else if($("#J_update_price .house-val").find('.fa').hasClass('fa-long-arrow-down')){
							$("#J_update_price .house-val").css({"color":'#FC2C00'});
							$("#J_update_price .house-val").find('.fa').removeClass('fa-long-arrow-down');
							$("#J_update_price .house-val").find('.fa').addClass('fa-long-arrow-up');
						}else{
							$("#J_update_price .house-val").css({"color":'#57CC00'});
							$("#J_update_price .house-val").css({"cursor":'#pointer'});
							var str='<i class="fa"></i>';
							$('.house-val').append(str);
							$("#J_update_price .house-val").find('.fa').addClass('fa-long-arrow-down');
						}
					}
					$('#entrustprice').text($('#J_newValue2').val());
					detail();*/
				})
			}, 
			{
				overflow :true,
				area : ['400px','250px'],
				btns : [ '确定'],
				success: function(){
					$('#J_newValue2').val('');
					if($('#J_newLabel2').closest('.form-group').hasClass('has-error')){
						$('#J_newLabel2').closest('.form-group').removeClass('has-error');
						$("#J_newValue2-error").remove();
					}
					
					$('#J_oldLabel2').html("原委托价:");
					$('#new_company').text('万元');
					$('#J_oldValue2').text(price+"万元");
					$('#J_newLabel2').html('<span class="text-danger">*</span>委托价:');
			}
		});	
}
function updatePrice(){
	var price=$('#price').text();
	commonContainer.modal(
			'修改最低报价',
			$('#J_editpriceLayer'),
			function(index, layero) {
				validate = $('#J_editpriceForm1').validate({
					rules:{
						newPrice: {
					    	number:true,
					    	min:0,
					    	decimal: true,
					    }
					}
				}).form();
				if(!validate) return false;
				/*if($('#J_newLabel').val()==price){
					commonContainer.alert("修改成功");
					layer.close(index);
				}*/
				trace = '修改最低报价，修改前为：' + price + '，修改后为：' + $('#J_newValue2').val();
				jsonPostAjax(basePath + '/house/main/modifyhouse', {"housesid":houseId,"price":$('#J_newValue2').val(),"trace":trace}, function(result) {
					commonContainer.alert("修改成功");
					/*detail();*/
					location.reload();
					layer.close(index);
					$('#price').text($('#J_newValue2').val());
				})
			}, 
			{
				overflow :true,
				area : ['400px','250px'],
				btns : [ '确定'],
				success: function(){
					$('#J_newValue2').val('');
					if($('#J_newLabel2').closest('.form-group').hasClass('has-error')){
						$('#J_newLabel2').closest('.form-group').removeClass('has-error');
						$("#J_newValue2-error").remove();
					}
					$('#J_oldLabel2').html("原最低报价:");
					$('#new_company').text('万元');
					$('#J_oldValue2').text(price+"万元");
					$('#J_newLabel2').html('最低报价:');
			}
		});	
}
function urlkey(keyid){
	if($("#temp_key_view").val()==undefined){
		commonContainer.alert("无权限");
		return false;
	}
	window.open(basePath+"/house/keyadmin/detail.htm?id="+keyid);
}
$(document).on("change",'#freetimeTypeId',function(){
	if($(this).val()=='5'){
		$(".freetime").show();
	}else{
		$(".freetime").hide();
	}
})
$(document).on("click",'#freetime',function(){
	datelayer( "#freetime", {
		format: 'YYYY-MM-DD'
	});
})
function detail(){
	jsonGetAjax(basePath + '/house/informationSupplement/housingDetails', {"housesid":houseId}, function(result) {		
		for(var key in result.data){
			if($("#tab-11 #J_detail_"+key)){
				if($("#tab-11 #J_detail_"+key).hasClass('input')){
					$("#tab-11 #J_detail_"+key).val(result.data[key]);
					$("#tab-11 #J_detail_"+key).attr({"attr":result.data[key+"Id"]});
				}else{
					$("#tab-11 #J_detail_"+key).text(result.data[key]);
					$("#tab-11 #J_detail_"+key).attr({"attr":result.data[key+"Id"]});
				}
				
			}			
		}	
		if(result.data.freetimeTypeId==5){
			$("#tab-11 #J_detail_freeTime").text(result.data.freeTime);
			$("#tab-11 #J_detail_freeTime").attr({"attr":result.data.freetimeTypeId});
			$("#tab-11 #J_detail_freeTime").attr({"attrTime":result.data.freeTime});
		}else{
			$("#tab-11 #J_detail_freeTime").text(result.data.freetimeType);
			$("#tab-11 #J_detail_freeTime").attr({"attr":result.data.freetimeTypeId});
		}
		isPass=result.data.isPassCode;
		if(isPass==0){
			$('.J_evaluate_but').hide();
		}else{
			$('.J_evaluate_but').show();
		}
		if(result.data.certLoanId==2||result.data.certLoanId==4){
			$(".lonCon").show();
		}
		if(result.data.finalassessmentCode){
			finalassessmentCode=result.data.finalassessmentCode;
		}
		if(result.data.belongUserId){
			belonguserid=result.data.belongUserId;
		}
		if(result.data.usersId){
			usersid=result.data.usersId;
		}
	})	
}
function bookadd(houseid,type,plannedUses){
	if($("#temp_proxy_add").val()==undefined){
		commonContainer.alert("无权限");
		return false;
	}
	window.open(basePath+"/house/proxy/houseProxyAdd?housesid="+houseid+"&type="+type+"&plannedUses="+plannedUses);
}
function urlbook(bookid,type){
	if($("#temp_proxy_view").val()==undefined){
		commonContainer.alert("无权限");
		return false;
	}
	window.open(basePath+"/house/proxy/houseProxyDetail?proxyId="+bookid+"&type="+type);
}
function book(houseId) {
	jsonGetAjax(basePath + '/custom/common/getcuruserinfo.htm', {}, function(result) {		
		proxyNewlyObj.proxyNewlyAdded(2,houseId,result.data.userId,result.data.userName)		
	})
	
}
/*function initListLoad(){
	$('#J_hisdataTable').bootstrapTable({ 
		url:basePath + '/house/basichistory/historylist',
		sidePagination: 'server',
		dataType: 'json',
		method:'get',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams : function(params) {
			var o = {};
			o.timestamp = new Date().getTime();
			o.housesid = houseId;
			o.pageindex = params.offset / params.limit+ 1,
			o.pagesize = params.limit;
			return o;
		},
		responseHandler: function(result) {
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
				return { "rows": result.data.historylist, "total": result.data.totalcount }
			}
			return { "rows": [], "total": 0 } 
		},

		columns:[			         
		      	    {field: 'housesid', title: '房源编号', align: 'center',
		      	    	formatter: function(value, row, index) {	
		      				var html = '';
		      				html ='<a target="_blank" href="../main/buydetail.htm?houseid='+row.housesid+'">'+row.housesid+'</a>';
		      				return html;
		      	    	}
		      	    	
		      	    },
		      	    {field: 'housekind', title: '业务类型', align: 'center',
		      	    	formatter: function(value, row, index) {	
		      				var html = '';
		      				if(row.housekind==1){
		      					html ='租赁';
		      				}else if(row.housekind==2){
		      					html ='买卖';
		      				}
		      				return html;
		      	    	}
		           	},
		      	    {field: 'uname', title: '录入人', align: 'center'},
		      	    {field: 'groupname', title: '录入部门', align: 'center'},
		      	    {field: 'bookintime', title: '录入时间', align: 'center'},
		      	    {
		      	    	field: 'finalassessmentid', title: '房源评价', align: 'center',
		      	    	formatter: function(value, row, index) {
		      	    		var html;
		      	    		if(row.finalassessmentid==1){
		      	    			if(row.housekind==1){
			      	    			html='可租';
			      	    		}else if(row.housekind==2){
			      				    html ='可售';
			      	    		}
		      	    		}else if(row.finalassessmentid==2){
		      	    			if(row.housekind==1){
			      	    			html='出租中';
			      	    		}else if(row.housekind==2){
			      				    html ='他售';
			      	    		}
		      	    		}else if(row.finalassessmentid==3){
		      	    			if(row.housekind==1){
			      	    			html='暂不租';
			      	    		}else if(row.housekind==2){
			      				    html ='暂不售';
			      	    		}
		      	    		}else if(row.finalassessmentid==4){
		      	    			 html ='无效' ;
		      	    		}else if(row.finalassessmentid==5){
		      	    			 html ='成交' ;	 
		      	    		}
		      	    		
		      				return html;
		      	    	}
		      	    },
		      	    {field: 'housesid', title: '电话', align: 'center',
		      	    	formatter: function(value, row, index) {	
		      				var html = '';
		      				html = '<a onclick="checkPhone('+row.housesid+')" href="javascript:void(0);">查看</a>';
		      				return html;
		      	    	}
		      	    },
		           	{field: 'price', title: '成交价格</br>/委托价', align: 'center'}
		      	],
	})
	$('#J_logdataTable').bootstrapTable({ 
		url:basePath + '/houses/catchlogs/operationLogs',
		sidePagination: 'server',
		dataType: 'json',
		method:'get',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams : function(params) {
			var o = {};
			o.timestamp = new Date().getTime();
			o.housesid = houseId;
			o.pageindex = params.offset / params.limit+ 1,
			o.pagesize = params.limit;
			return o;
		},
		responseHandler: function(result) {
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
				return { "rows": result.data.logsList, "total": result.data.totalcount }
			}
			return { "rows": [], "total": 0 } 
		},

		columns:[			         
		      	    {field: 'rnm', title: '序号', align: 'center'},
		      	    {field: 'type', title: '操作类型', align: 'center'},
		      	    {field: 'uname', title: '操作人', align: 'center'},
		      	    {field: 'createtime', title: '操作时间', align: 'center'},
		      	    {field: 'content', title: '操作详情', align: 'center'},		      	    
		      	],
	})
}*/
/*function checkadress(){
	var  val=2;
	if(val==1){
		auditshow(1);
	}else{
		followshow(1);
	}
}
function checkphone(){
	var show=1;
	if(show==1){
		seePhone(1);
	}else{
		followshow(1);
	}
}*/
var trace;
function editevaluate(){
	commonContainer.modal(
		'修改房源评价',
		$('#editevaluate_layer'),
		function(index, layero) {
			var remarkid=$("input[name='SellerHouseFinalAssessment']:checked").val();
			if(remarkid==undefined){
				commonContainer.alert("请选择房源评价");
				return false;
			}
			var old=$('#J_detail_finalassessmentId').text();
			trace = '修改房源评价，修改前为：' + old + '，修改后为：' + $("input[name='SellerHouseFinalAssessment']:checked").next('label').text();
			jsonAjax(basePath + '/house/main/updateremark', {"houseid":houseId,"remarkid":remarkid,"trace":encodeURI(trace)}, function(result) {
				commonContainer.alert("修改成功");
				layer.close(index);
				window.location.reload();
			})
		}, 
		{
			overflow :true,
			area : ['400px','200px'],
			btns : [ '确定'],
			success: function(){				
				if(!$("#remarkid").children().hasClass('radio')){
					if(isPass==1||isPass==2){
						var str='<div class="radio radio-primary radio-inline"><input type="radio" id="SellerHouseFinalAssessment1" name="SellerHouseFinalAssessment" value="1"><label for="SellerHouseFinalAssessment1">可售</label></div><div class="radio radio-primary radio-inline"><input type="radio" id="SellerHouseFinalAssessment2" name="SellerHouseFinalAssessment" value="2"><label for="SellerHouseFinalAssessment2">暂不售</label></div><div class="radio radio-primary radio-inline"><input type="radio" id="SellerHouseFinalAssessment3" name="SellerHouseFinalAssessment" value="3"><label for="SellerHouseFinalAssessment3">他售</label></div><div class="radio radio-primary radio-inline"><input type="radio" id="SellerHouseFinalAssessment4" name="SellerHouseFinalAssessment" value="4"><label for="SellerHouseFinalAssessment4">无效</label></div><div class="radio radio-primary radio-inline"><input type="radio" id="SellerHouseFinalAssessment5" name="SellerHouseFinalAssessment" value="5"><label for="SellerHouseFinalAssessment5">成交</label></div>';
						$("#remarkid").append(str);		
						$("input[name='SellerHouseFinalAssessment'][value="+finalassessmentCode+"]").attr("checked",true);
					}else{
						var str='<div class="radio radio-primary radio-inline"><input type="radio" id="SellerHouseFinalAssessment1" name="SellerHouseFinalAssessment" value="1"><label for="SellerHouseFinalAssessment1">可售</label></div><div class="radio radio-primary radio-inline"><input type="radio" id="SellerHouseFinalAssessment4" name="SellerHouseFinalAssessment" value="4"><label for="SellerHouseFinalAssessment4">无效</label></div><div class="radio radio-primary radio-inline"><input type="radio" id="SellerHouseFinalAssessment5" name="SellerHouseFinalAssessment" value="5"><label for="SellerHouseFinalAssessment5">成交</label></div>'
							$("#remarkid").append(str);
						$("input[name='SellerHouseFinalAssessment'][value="+finalassessmentCode+"]").attr("checked",true);
					}
					
				}
		}
	});	
}
function updateremark(){
	commonContainer.modal(
			'修改备注',
			$('#J_editremarkLayer'),
			function(index, layero) {
				validate = $('#J_editForm2').validate({
					rules:{
						J_newValue: {
					    	required:true
					    }
					}
				}).form();
				if(!validate) return false;
				/*if($('#J_newLabel').val()==price){
					commonContainer.alert("修改成功");
					layer.close(index);
				}*/
                trace = '修改备注，修改前为：'+$('#J_oldValue1').text()+"，修改后为："+$('#J_newValue1').val();
				jsonPostAjax(basePath + '/house/main/modifyhouse', {"housesid":houseId,"memo":$('#J_newValue1').val(),"trace":trace}, function(result) {
					commonContainer.alert("修改成功");
					detail();
					$('#J_remark').text($('#J_newValue1').val());
					layer.close(index);
				})
			}, 
			{
				overflow :true,
				area : ['80%','300px'],
				btns : [ '确定'],
				success: function(){
					$('#J_oldLabel1').text("原备注:");
					$('#J_oldValue1').text($("#J_remark").text());
					$('#J_newLabel1').text("备注:");
					$('#J_newValue1').val('');
			}
		});		
}
$(document).delegate('.J_edit', 'click', function(event){
	var $this_ = $(this);
	var title = $this_.parent().find('dt').text().trim().replace('*', '');
	title = title.substring(0, title.length-1);
	
	var colums = $this_.attr('data-columns');
	colums = formatToComma(colums); // 转义字符
	var columArr = colums.split('|');
	var editName = columArr[0];
	var showType = columArr[1];
	var oldValue = $this_.parent().find('dd').text();
	var unit = $this_.parent().find('dd').find('span').text();
	
	commonContainer.modal(
		'修改' + title,
		$('#J_editLayer'),
		function(index, layero) {
			$.validator.setDefaults({ ignore: ":hidden:not(select)" });
			//客户信息
			validate = $('#J_editForm1').validate({
				rules:houseeditValidatorRule
			}).form();
			if(!validate) return false;	
			
			var postParam = $('#J_editLayer').find('form').updateSerializeObject();
			postParam.housesid = houseId;
			postParam.trace = getTrace(showType, title, oldValue, editName, unit);
			/*postParam = formatPostParam(postParam);*/
			
			// 请求URL及必要参数
			var url = basePath + '/house/main/modifyhouse';						
			jsonPostAjax(
				url,
				postParam,
				function(result) {
					layer.msg('修改成功');
					detail();					
					if(editName=='housesLevel'){
						if($("input[name='housesLevel']:checked").val()=='2'){
							var str='<span class="label label-success" id="chengpan">诚盘</span>'
								if($('#chengpan').length==0){
									$("#managementTab").append(str);
								}
						}else{
							if($("input[name='housesLevel']:checked").val()!='2'){
								$("#managementTab").empty();
							}
						}
					}
					layer.close(index);
				}
			)
		},
		{
			success: function() {
				editContent(houseId, $this_);
			}
		}
	)
})
function favoritehouse(houseid){
	jsonGetAjax(basePath + '/house/main/favoritehouse', {"houseid":houseid,"businessType":2}, function(result) {
		commonContainer.alert('收藏成功');
		$('#collection').remove();
	})		
}
function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 
//验证值小数位数不能超过两位  
jQuery.validator.addMethod("decimal", function (value, element) {  
  var decimal = /^-?\d+(\.\d{1,2})?$/;  
  return this.optional(element) || (decimal.test(value));  
}, $.validator.format("小数位数不能超过两位!"));  
/**
 * 编辑详情页面元素的公共方法（包括：input; radio; checkbox; select; intervalInput(输入框区间); intervalSelect(下拉框区间); date;）
 * 
 * @param editId：当前编辑的信息id，如客户id
 * @param $container：当前编辑元素标题的父级ID
 * @param colums：当前编辑元素的name、展示形式、基础数据的keyCode、之前选中值，用“|”隔开；当某项为空时，传空，例：name|input| 或 name|input|gender
 *                其中，展示形式包括：input; radio; checkbox; select; intervalInput(输入框区间); intervalSelect(下拉框区间); date;
 * @param widgetName：当前编辑元素的name
 * @param showType：展示形式
 * @param configKeyCode：基础数据的keyCode，若无此项传null
 */
function editContent(editId, $container){
	var colums = $container.attr('data-columns');
	colums = formatToComma(colums); // 转义字符
	
	var columArr = colums.split('|');
	var widgetName = columArr[0];	// 当前编辑元素的name
	var showType = columArr[1];		// 展示形式
	var configKeyCode = columArr[2];	// 基础数据的keyCode
	var oldSelectedValue = $('#J_detail_'+widgetName).text();	// 之前选中的值
	var value= $('#J_detail_'+widgetName+'Code').val();
	$('#J_newValue').html('');
	var curLabel = $container.parent().find('dt').text().trim().replace('*', '');
	var oldValue = $container.parent().find('dd').text();
	var unit = $container.parent().find('dd').find('span').text();
	
	$('#J_oldLabel').html('原' + curLabel);
	$('#J_oldValue').html(oldValue);
	$('#J_newLabel').html($container.parent().find('dt').html());
	
	switch(showType) {
		case 'input':
			var html = '<div class="col-sm-4">' +
							'<input id="' + widgetName + '" name="' + widgetName + '" type="text" class="form-control" value="' + oldSelectedValue + '">' +
						'</div>' +
						'<label class="control-label">' + unit + '</label>'; // 区间单位
			$('#J_newValue').html(html);
			break;
		
		case 'radio':
			dimContainer.buildDimRadio($("#J_newValue"), widgetName, configKeyCode, value)			
			break;
		  
		case 'checkbox':
			dimContainer.buildDimCheckBox($("#J_newValue"), widgetName, configKeyCode, oldSelectedValue);
			break;
			
		case 'select':
			var html = '<select id="' + widgetName+ '" name="' + widgetName + '" class="form-control m-b" data-placeholder="请选择">' +
						'<option value="">请选择</option>' +
				   '</select>';
			$('#J_newValue').html(html);
			dimContainer.buildDimChosenSelector($("#" + widgetName), configKeyCode, oldSelectedValue);
			break;
			
		case 'textarea':
			var html = '<textarea id="' + widgetName + '" name="' + widgetName + '" rows="3" cols="100%" class="form-control"></textarea>';
			$('#J_newValue').html(html);
			break;
		
		case 'intervalInput':
			var widgetNameArr = widgetName.split(',');
			var oldSelectedValueArr = oldSelectedValue.split(',');
			var html = '<div class="col-sm-4">' +
						'<input type="text" id="' + widgetNameArr[0] + '" name="' + widgetNameArr[0] + '" value="' + oldSelectedValueArr[0] + '" class="form-control J_'+widgetNameArr[0]+'">' +
					'</div>' +
					'<div class="control-spacing">-</div>' +
					'<div class="col-sm-4">' +
						'<input type="text" id="' + widgetNameArr[1] + '" name="' + widgetNameArr[1] + '" value="' + oldSelectedValueArr[1] + '" class="form-control J_'+widgetNameArr[1]+'">' +
					'</div>' +
					'<label class="control-label">' + unit + '</label>'; // 区间单位
			$('#J_newValue').html(html);
			break;
			
		case 'intervalSelect':
			var widgetNameArr = widgetName.split(',');
			var oldSelectedValueArr = oldSelectedValue.split(',');
			var html = '<div class="col-sm-4">' +
						'<select id="' + widgetNameArr[0]+ '" name="' + widgetNameArr[0] + '" class="form-control m-b" data-placeholder="请选择">' +
							'<option value="">请选择</option>' +
						'</select>'+
					'</div>' +
					'<div class="control-spacing">或</div>' +
					'<div class="col-sm-4">' +
						'<select id="' + widgetNameArr[1]+ '" name="' + widgetNameArr[1] + '" class="form-control m-b" data-placeholder="请选择">' +
							'<option value="">请选择</option>' +
						'</select>'+
					'</div>' +
					'<label class="control-label">' + unit + '</label>'; // 区间单位
			$('#J_newValue').html(html);
			dimContainer.buildDimChosenSelector($("#" + widgetNameArr[0]), configKeyCode, oldSelectedValueArr[0]);
			dimContainer.buildDimChosenSelector($("#" + widgetNameArr[1]), configKeyCode, oldSelectedValueArr[1]);
			break;
			
		case 'date':
			var html = '<input id="' + widgetName + '" name="' + widgetName + '" class="form-control w120" value="' + oldSelectedValue + '" onclick="laydate({istime: false, format: \'YYYY-MM-DD\'})">';
			$('#J_newValue').html(html);
			break;
			
		case 'nationality':
			var html = '<select id="' + widgetName+ '" name="' + widgetName + '" class="form-control m-b" data-placeholder="请选择">' +
						'<option value="">请选择</option>' +
				   '</select>';
			$('#J_newValue').html(html);
			selectNational($("#" + widgetName), oldSelectedValue);
			break;
	}
}
$(document).on("back-result",function(){
	window.location.reload();
})
$(document).on("click",'#J_detail_belonguser',function(){
	if(belonguserid!=''){
		getUserStaffInfo(belonguserid);
	}
})
$(document).on("click",'#J_detail_users',function(){
	if(usersid!=''){
		getUserStaffInfo(usersid);
	}
})

/**
 * 实勘录入OR详情
 * sourceId：
 * 		录入时为房源ID，显示详情为实勘ID
 * isHasInquistion：
 * 		是否有实勘：false，否；true，是
 */
function viewInquistion(sourceId, isHasInquistion) { 
	var url = '';
	if(isHasInquistion) {
		if($("#temp_inquisition_check").val()==undefined){
			commonContainer.alert("无权限");
			return false;
		}
		url = basePath+'/house/inquisition/inqCheckPage.html?inquId=' + sourceId;
		window.open(url);
	} else {
		if($("#temp_inquisition_add").val()==undefined){
			commonContainer.alert("无权限");
			return false;
		}
		url = basePath+'/house/inquisition/inqAddPage.html?housesId=' + sourceId;
		window.open(url);
		/*layer.open({
			title: false,
			type : 2,
			shift: 5,
			skin : 'layui-layer-lan',
			content : url,				
			area : ['97%', '97%'],
			btn : []
		});*/
	}
}
var browserVersion = window.navigator.userAgent.toUpperCase();
var isOpera = browserVersion.indexOf("OPERA") > -1 ? true : false;
var isFireFox = browserVersion.indexOf("FIREFOX") > -1 ? true : false;
var isChrome = browserVersion.indexOf("CHROME") > -1 ? true : false;
var isSafari = browserVersion.indexOf("SAFARI") > -1 ? true : false;
var isIE = (!!window.ActiveXObject || "ActiveXObject" in window);
var isIE9More = (! -[1, ] == false);
function startInit(iframeId, minHeight) {
    eval("window.IE9MoreRealHeight" + iframeId + "=0");
    window.setInterval("reinitIframe('" + iframeId + "'," + minHeight + ")", 100);
}
function reinitIframe(iframeIdyeji, minHeight) {
    try {
        var iframe = document.getElementById(iframeIdyeji);
        var bHeight = 0;
        if (isChrome == false && isSafari == false)
            bHeight = iframe.contentWindow.document.body.scrollHeight;

        var dHeight = 0;
        if (isFireFox == true)
            dHeight = iframe.contentWindow.document.documentElement.offsetHeight + 2;
        else if (isIE == false && isOpera == false)
            dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
        else if (isIE == true && isIE9More) {//ie9+
            var heightDeviation = bHeight - eval("window.IE9MoreRealHeight" + iframeIdyeji);
            if (heightDeviation == 0) {
                bHeight += 3;
            } else if (heightDeviation != 3) {
                eval("window.IE9MoreRealHeight" + iframeIdyeji + "=" + bHeight);
                bHeight += 3;
            }
        }
        else//ie[6-8]、OPERA
            bHeight += 3;

        var height = Math.max(bHeight, dHeight);
        if (height < minHeight) height = minHeight;
        iframe.style.height = height + "px";
    } catch (ex) { }
}