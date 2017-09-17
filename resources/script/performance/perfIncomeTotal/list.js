

$(function() {
	$("select").chosen({
		width : "100%",
		no_results_text : "未找到此选项!"
	});
	
	
})





//上传与下载
$(document).delegate(
		'#J_del',
		'click',
		function(event) {
			view1();
		});
function view1() {
	layer.open({
		title : '批量调整',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		zIndex: 10,//保证树在上面
		content : $('#demo_layer_stantard2'),
		area :   ['40vw','50vh'],
		//btn : [ '确定'],
		yes : function(index, layero) {								
				jQuery('#J_dataTable_list').bootstrapTable('refresh', {url: basePath + '/performanceIncome/download'});
				layer.close(index);
			}
			
		
	});	
};
//批量上传；

$(".up_btn").off().on("click",function(){
	var islock=false;
	//
	var upFile=$('#file1');
	$('#file1').click();
	$('#file1').on('input change',function(){
		var upFileObj=this.files[0];
		var temp = this.files[0].name;
		//console.log(temp);
		if(/[@\/'\\"#$%&\^*]/.test(temp)){
			layer.alert("你上传的 \“"+temp+"\” 文件有特殊字符，文件名中不可存在特殊字符,请重新上传");
			return false;
         }
		//上传至文件服务器（获取文件路径）
		var formData=new FormData();
		formData.append('file',upFileObj);
		//alert(formData.toString())
		if(islock){
			return false;
		}else{
			islock=true;
			layer.msg('上传中', { icon: 16 ,shade: 0.01,time:9999999});
		}
		$.ajax({
			url: basePath+'/performanceIncome/perfIncomeFileUpload',
		    type: 'POST',
		    async:true,
		    cache: false,
		    data: formData,
		    processData: false,
		    contentType: false,
		    dataType:'json',
		    success:function(result){
		    	if(result.code == '0'){
		    		var html='<div data-attachname='+result.data.filename+' data-attachurl="'+result.data.filepath+'"><span class="btn btn-green btn-bitbucket"><i class="glyphicon glyphicon-ok"></i></span>'+result.data.filename+'</div>';
		    		//$('#uploadForm').append(html);
					$('.upload2').html('<input type="file" name="file1" id="file1" style="display: none" />');	//重置上传文件				
					layer.alert("上传成功");
		    	}else{
		    		$('.upload2').html('<input type="file" name="file1" id="file1" style="display: none" />');	//重置上传文件		
//		    		layer.alert("上传失败！请检查上传文件");
		    		layer.alert(result.msg)
		    	}
		    },
		    error:function(){
		    	$('.upload2').html('<input type="file" name="file1" id="file1" style="display: none" />');	//重置上传文件		
		    	layer.alert(errorMsg);
	    	}
		});
	});
	
})




//结果批量下载；
$("#exceldown").on("click",function(){
	window.open(basePath + '/performanceIncome/download',"_blank");
});

//按条件查询跟进列表
$('#J_search').on('click', function(event) {
	searchTableDatas();
	jQuery('#J_dataTable_list').bootstrapTable('refresh', {url: basePath + '/performanceIncome/getList'});
});

//初始化所属人
searchContainer.searchUserListByComp($("#J_user"), true, 'left');


function searchTableDatas(){
	$('#J_dataTable_list').bootstrapTable({
		url: basePath + '/performanceIncome/getList',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o = jQuery('#J_query').serializeObject();
			if(o.operatorId){
				o.operatorId  = encodeURI($("#J_user").attr("data-id"))
			}
			o.pageindex = params.offset / params.limit+ 1;
			o.pagesize = params.limit;
			return o;
		},
		responseHandler: function(result){
			console.log(result.data);
			if(result.code == 0 && result.data && result.data.totalcount > 0) {
				return { "rows": result.data.list, "total": result.data.totalcount }
			}
			return { "rows": [], "total": 0 } 
		},
		columns: [ 	
		           	{field: 'incomeId',title :'调整编号',align: 'center',},
		          	{field: 'contractNo', title: '合同编号', align: 'center',
		          		formatter : function(value,row) {
		          			if(value==undefined){
		          				var html = '';
		          				html = '-';
		          				return html;
		          			}else if(row.businessType==1){
								var html = '';
								html = '<a target="_blank" href="/sales/sign/detail/detail.html?conid='+ row.contractId+ '&formal=true">'+ value+ '</a>';
								return html;
							}else if(row.businessType==2){
								return '<a target="_blank" href="/sales/sign/signthecontract/contractdetail.htm?conId='+ row.contractId+ '">'+ value+ '</a>';
							}			  
						}
		          	},
		          	 {field: 'perfTypeName', title: '业绩类型', align: 'center', },
		            {field: 'adjustDate', title: '调整时间', align: 'center',
		          		formatter : function(value,row) {
							return '<div>'+value.substring(0, 19) + '</div>';
						}
		            },
				    {field: 'businessType', title: '业务类型', align: 'center',
		            	formatter : function(value, row) {
							if (row.businessType == 1) {
								return '<div businessType=1>普租</div>';
							} else if(row.businessType == 2) {
								return '<div businessType=2>二手买卖</div>';
							}else{
								return '<div businessType=3>一手买卖</div>';
							}
		            	}
				    },
				    {field: 'adjustAmount', title: '调整金额', align: 'center',
				    	formatter : function(value, row) {
				    		return '<div style="text-align:right"; class="remark_all">'+ value + '</div>';
				    	}
				    },				    
				    {field: 'belongerName', title: '被调整人', align: 'center'},
				    {field: 'belongMonth', title: '业绩归属月',align: 'center',
				    	formatter : function(value,row) {
				    		var val = value
							if (val != undefined) {
								return '<div>' + val.substring(0, 7) + '</div>';
							} else {
								return '-';
							}
				    	}
				    },
				    {field: 'fullDeptName', title: '被调整人所属部门',align: 'center'},
				    {field: 'operatorName', title: '操作人',align: 'center'},
				    {field: 'memo', title: '调整原因',align: 'center'}
				]
	});
}

//初始化录入日期
var begindate = {
		elem: '#J_begindate',  
	    format: 'YYYY-MM-DD',
	    istime: false,
	    isclear: false,
	    choose: function(datas){
	    	enddate.min = datas;
	    	enddate.start = datas

	    }
	}

var enddate = {
		elem: '#J_enddate',  
	    format: 'YYYY-MM-DD',
	    istime: false,
	    isclear: false,
	    choose: function(datas){
	    	begindate.max = datas
	    }
	}

laydate(begindate);
laydate(enddate);

$('#J_enddate').on('change', function() {
	starttime.max = '';
})


//初始化调整日期
var beginmonth = {
	elem : '#J_beginmonth',
	format : 'YYYY-MM-DD',
	istime : false,
	isclear: false,
	choose : function(datas) {
		endmonth.min = datas;
		$("#J_beginmonth").val( datas.substring(0, 7));
	}
}

var endmonth = {
	elem : '#J_endmonth',
	format : 'YYYY-MM-DD',
	istime : false,
	isclear: false,
	choose : function(datas) {
		$("#J_endmonth").val( datas.substring(0, 7));
	}
}

laydate(beginmonth);
laydate(endmonth);

$('#J_endmonth').on('change', function() {
	starttime.max = '';
})

var old="";
function check(ele){
var pattern = /^(\+|\-)?((([1-9]([0-9]*))|0)(\.[0-9]*)?)?$/; 
var val=ele.value;
if(val.match(pattern)){
old=val;
return true;
}else{
ele.value=old;
return false;
}
}
function allCheck(ele){
var pattern = /^(\+|\-)?(([1-9]([0-9]*))|0)(\.[0-9]+)?$/; 
var val=ele.value;
if(val.match(pattern)){
old=val;
return true;
}else{
ele.value="";
return false;
}
}

$("#J_beginmonth").on("click",function(){
	$("#laydate_table").hide();
})
$("#J_endmonth").on("click",function(){
	$("#laydate_table").hide();
})
$("#J_begindate").on("click",function(){
	$("#laydate_table").show();
})
$("#J_enddate").on("click",function(){
	$("#laydate_table").show();
})


$("#J_reset").on("click",function(){
	$('input').val('');	
	$('.J_chosen').trigger('chosen:updated');
	enddate.min='';
	enddate.start='';
	begindate.max='';
})

 $("#customertype").bind("change",function(){
		if(this.value){
			var companyId;
			var keyid=this.value;
			$.ajax({
				url : basePath + '/perf/authorize/getUserInfo',
				type : 'get',
				dataType : 'json',
				cache : true,
				success : function(result) {	
					companyId = result.data;
					$("#J_perfType").find("option:not(:first-child)").remove();
					dimContainer1.buildDimChosenSelector1($("#J_perfType"), companyId,keyid,"");
				}
			});			
		}else{
			$("#J_perfType").find("option:not(:first-child)").remove();
			$("#J_perfType").trigger("chosen:updated");
		}
		
	})
	
	window.dimContainer1 = {
		getDimReqUrl: function() {
			return basePath + '/perf/setRuleDetail/findPerfType';
		},
		buildDimChosenSelector1: function($container, compId,keyId, selectedValues) {//selectedValues默认选中值
			// 初始化chosen控件
			commonContainer.initChosen($container);

			var that = this;
		    var options = [];
		    jsonPostAjax(that.getDimReqUrl(), {'compId':compId,'keyId':keyId}, function(result) {
	    		$.each(result.data, function(n, value) {
	    			if(value!=null){
	    				options.push('<option value="' + value.valueCode + '">' + value.valueName + '</option>');
	    			}    	    	
	    	    })
	    	    $container.append(options);

	    		var selectedValueArr = selectedValues.split(',');
	    		$container.val(selectedValueArr);
	    		$container.trigger("chosen:updated");
			})
		},
	}


