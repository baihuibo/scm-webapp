
/* $(function (){

           function center(){
               var center_num = $(document).width()/2 - $(window).width()/2 ;
               window.scrollBy(center_num,0);

           };
           center()
    })
*/

function getLocalTime(nS) {     
   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
}     
//alert(getLocalTime(1293072805)); 
function initsingletime(){
	var startTime = {//外出时间
		elem: '#J_begindate',  
	    format: 'YYYY-MM-DD',
	    istime: true,
	    istoday:false,
	    //min:laydate.now(),
	    choose: function(datas){
	    	var timestamp = Date.parse(new Date(datas));
	    	timestamp = timestamp / 1000;
	    	//alert(timestamp);
	    	var datas1=getLocalTime(timestamp+60*60*24*100);
	    	endTime.max = datas1;
	    	endTime.min = datas;
	    	endTime.start = datas
	    },
	}
	var endTime = {//预计返回时间
		elem: '#J_enddate',  
		format: 'YYYY-MM-DD',
	    istime: true,
	    istoday:false,
	    //min:laydate.now(0, 'YYYY-MM-DD hh:mm'),
	    choose: function(datas){
	    	var timestamp2 = Date.parse(new Date(datas));
	    	timestamp2 = timestamp2 / 1000;
	    	//alert(timestamp);
	    	var datas2=getLocalTime(timestamp2-60*60*24*100);
	    	startTime.min = datas2;
	    	startTime.max = datas;
	    	startTime.start = datas
	    	//endTime.max = datas2;
	    	//startTime.min=laydate.now(0, 'YYYY-MM-DD');
	    }
	}
	laydate(startTime);
	laydate(endTime);
}
initsingletime();
/*// 初始化录入日期

laydate(begindate);
laydate(enddate);
$('#J_enddate').on('change', function() {
	starttime.max = '100';
})*/
//默认显示当前日期
$('#J_begindate').val(new Date().Format("yyyy-MM-dd"));
$('#J_enddate').val(new Date().Format("yyyy-MM-dd"));
/*$('#J_begindate').on('change', function() {
	starttime.max = '';
})*/
$('#J_enddate').on('change', function() {
	starttime.max = '';
})
// 模糊查询
searchContainer.searchUserListByComp($("#J_user"), true, 'left');

// 部门自动补全查询
searchDept($('#J_deptName1'), true, 'left').then(function () {
    // 显示部门树状结构
    $('#J_deptSelect1').off().on('click', function(e) {
        showDeptTree($('#J_deptName1'),$('#J_level_id1'));
    });
});


/**
 * 房源-2，客源-1；customerTypeId
 * 组店-2，经纪人-1statistical
 */
$('#customerTypeId').on("change", function() {
	//选择了客源
	if ($('#customerTypeId').val() == 1) {
		//alert(1)
		//选择了客源后统计维度默认组店
		if ($('#statistical').val() == 2) {
			//alert(2)
			 //$("#J_user").attr("disabled",true); 
			// $(".dropdown-toggle").attr("disabled",true);
			$('.agent').hide()
			$(".house_person").hide();
			$(".house_house").hide();
			$(".customer_person").hide();
			$(".customer_house").show();
		}
		//选择房源后选择经纪人
		else if($('#statistical').val() == 1){
			//$("#J_user").attr("disabled",false);
			//$(".dropdown-toggle").attr("disabled",false);
			$('.agent').show()
			$(".house_person").hide();
			$(".house_house").hide();
			$(".customer_person").show();
			$(".customer_house").hide();	
		};
		$('#statistical').on("change",  function() {
			//选择客源后选择店组
			if ($('#statistical').val() == 2) {
				//alert(2)
				 //$("#J_user").attr("disabled",true); 
				// $(".dropdown-toggle").attr("disabled",true);
				$('.agent').hide()
				$(".house_person").hide();
				$(".house_house").hide();
				$(".customer_person").hide();
				$(".customer_house").show();
				return false;
			}
			//选择了房源后选择经纪人
			else if($('#statistical').val() == 1){
				//$("#J_user").attr("disabled",false);
				//$(".dropdown-toggle").attr("disabled",false);
				$('.agent').show()
				$(".house_person").hide();
				$(".house_house").hide();
				$(".customer_person").show();
				$(".customer_house").hide();
				return false;
			}
		})
	} else if($('#customerTypeId').val() == 2){
		//alert(11);
		/*$(".customer_person").hide();
		$(".customer_house").show();
		$(".house_person").hide();
		$(".house_house").hide();*/
		if ($('#statistical').val() == 2) {
			//alert(2)
			//$("#J_user").attr("disabled",true);
			//$(".dropdown-toggle").attr("disabled",true);
			$('.agent').hide()
			$(".house_person").hide();
			$(".house_house").show();
			$(".customer_person").hide();
			$(".customer_house").hide();
			return false;
		}
		
		//选择了房源后选择经纪人
		else if($('#statistical').val() == 1){
			//$("#J_user").attr("disabled",false);
			//$(".dropdown-toggle").attr("disabled",false);
			$('.agent').show();
			$(".house_person").show();
			$(".house_house").hide();
			$(".customer_person").hide();
			$(".customer_house").hide();
			return false;
		}
		$('#statistical').on("change",  function() {
			//选择了房源后选择经纪人
			if ($('#statistical').val() == 1) {
				//alert(2)
				//$("#J_user").attr("disabled",false);
				//$(".dropdown-toggle").attr("disabled",false);
				$('.agent').show()
				$(".customer_person").show();
				$(".customer_house").hide();
				$(".house_person").hide();
				$(".house_house").hide();
				return false;
				
			}
			//选择房源后选择店组
			else if($('#statistical').val() == 2){
				// $("#J_user").attr("disabled",true); 
				// $(".dropdown-toggle").attr("disabled",true);
				$('.agent').hide()
				$(".customer_person").hide();
				$(".customer_house").show();
				$(".house_person").hide();
				$(".house_house").hide();
				return false;
			}
		})
		
	}
})
//房源默认情况下
$('#statistical').on("change",  function() {
			//选择经纪人
			if ($('#statistical').val() == 1) {
				//$(".dropdown-toggle").attr("disabled",false);
				//$("#J_user").attr("disabled",false);
				$('.agent').show()
				$(".house_person").show();
				$(".house_house").hide();
				$(".customer_person").hide();
				$(".customer_house").hide();
				return false;
			} 
			//选择组店
			else if($('#statistical').val() == 2){
				 //$("#J_user").attr("disabled",true);
				 //$(".dropdown-toggle").attr("disabled",true);
				 //dropdown-toggle
				//house_person
				$('.agent').hide();
				$(".house_person").hide();
				$(".house_house").show();
				$(".customer_person").hide();
				$(".customer_house").hide();
				return false;	
			}
		})
/*$(document).on("change", '#statistical', function() {
	if ($(this).val() == 1) {
		$(".house_house").show();
		//$(".agent").show();
	} else {
		//$(".agent").hide();
	}
})*/
//选择店组，经纪人输入框不能输入；
/*if ($('#statistical').val() == 1) {
			  $("#J_user").attr("disabled",true); 
}*/
$('#J_search').on('click', function(event) {
	//获得所属部门的层级
	var	departmentTypeId
	var departmentTypeId_val=$('#J_level_id1').val();
	//var J_deptName1=$('#J_deptName1')
	if(departmentTypeId_val==''){
		layer.alert('请选择所属部门');
		return false;
	}
	else if(departmentTypeId_val==1){
		departmentTypeId=30;
	}else if(departmentTypeId_val==2){
		departmentTypeId=40;
	}else if(departmentTypeId_val==3){
		departmentTypeId=50;
	}else{
		layer.alert('部门只能选择大区，店组和店');
		return false;
	};
	//判断是房源-店组表格显示
	$(function() {
		$("select").chosen({
			width : "100%",
			no_results_text : "未找到此选项!"
		});
		$("#J_reset").on('click', function(event) {
			downExcel();
		});
		$('#J_deptSelect').on('click', function() {
			showDeptTree($('#J_deptName'),$('#J_level_id'));
		});
		
		var statistical=$('#statistical').val();
		if(!$('#house_house').is(':hidden')&&statistical==2){
			//上面的导航栏
			$('#begin_house_house').text($('#J_begindate').val())
			$('#end_house_house').text($('#J_enddate').val())
			searchTableDatas();
			jQuery('#house_house').bootstrapTable('refresh', {url: basePath + '/business/report/finddepartmentstatisticslogtimes'});
			searchParam = $('#J_query').serializeObject();
			//判断是房源-经纪人表格显示
		}else if(!$('#house_person').is(':hidden')&&statistical==1){
			//alert(1)
			$('#begin_house_house2').text($('#J_begindate').val())
			$('#end_house_house2').text($('#J_enddate').val())
			searchTableDatas2();
			jQuery('#house_person').bootstrapTable('refresh', {url: basePath + '/business/report/finduserstatisticslogtimes'});
			searchParam = $('#J_query').serializeObject();
		}else if(!$('#customer_house').is(':hidden')&&statistical==2){
			$('#begin_house_house3').text($('#J_begindate').val())
			$('#end_house_house3').text($('#J_enddate').val())
			searchTableDatas3();
			jQuery('#customer_house').bootstrapTable('refresh', {url: basePath + '/business/report/finddepartmentstatisticslogtimes'});
			searchParam = $('#J_query').serializeObject();
		}else if(!$('#customer_person').is(':hidden')&&statistical==1){
			$('#begin_house_house4').text($('#J_begindate').val())
			$('#end_house_house4').text($('#J_enddate').val())
			searchTableDatas4();
			jQuery('#customer_person').bootstrapTable('refresh', {url: basePath + '/business/report/finduserstatisticslogtimes'});
			searchParam = $('#J_query').serializeObject();
		}
	})

//房源--店组
function searchTableDatas() {
	$('#house_house').bootstrapTable('destroy').bootstrapTable({
		url: basePath + '/business/report/finddepartmentstatisticslogtimes',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		//showFooter:true,
		pagination: false,
		striped: true,
		pageSize: 10000,
		pageList: [10000],

		queryParams: function (params) {
			var o = jQuery('#J_query').serializeObject();
			o.businessTypeId=$('#businsStates').val();
			o.customerTypeId=$('#customerTypeId').val();
			o.departmentTypeId=departmentTypeId;
			o.departmentId=$('#J_deptName1').attr('data-id');
			return o;
		},
		responseHandler: function(result){
			console.log(result.data)
			if(result.code == 0 && result.data && result.data.length > 0) {
				return { "rows": result.data, "total": result.data.length }
			}
			return { "rows": [] } 
		},
		columns: [ 	
		           	{field: 'displayShopName',title :'所属部门', align: 'center',width:'13px',
		           		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.displayShopName==''||row.displayShopName==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				html='<p>'+row.displayShopName+'</p>'
		        				
		        			}
		        			
		        			return html;
		        			}
		           		},
		           	//房源沟通
		           	{field: 'ownerCommunicateAllHouseSourceTimes',title :'操作', align: 'center',
		           		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerCommunicateAllHouseSourceTimes==''||row.ownerCommunicateAllHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.ownerCommunicateAllHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId1" shopId="'+row.shopId+'" data-displayKpiId ="7">'+row.ownerCommunicateAllHouseSourceTimes+'</span>'
		        				}
		        				
		        				//html=row.userName+'<input type="hidden" id="userid" name="data-userid" data-userid="'+row.userId+'"/>';
		        			}
		        			
		        			return html;
		        			}
		           	},
		          	{field: 'allCommunicateOwnerHouseSourceTimes', title: '所属', align: 'center',
		           		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.allCommunicateOwnerHouseSourceTimes==''||row.allCommunicateOwnerHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p >'+row.allCommunicateOwnerHouseSourceTimes+'</p>'
		        				}else{
		        					
		        					html='<span id="displayKpiId2" shopId="'+row.shopId+'" data-displayKpiId ="8">'+row.allCommunicateOwnerHouseSourceTimes+'</span>'
		        				}
		        				
		        				//html=row.userName+'<input type="hidden" id="userid" name="data-userid" data-userid="'+row.userId+'"/>';
		        			}
		        			
		        			return html;
		        			}
		          	},
		        	{field: 'ownerCommunicateOwnerHouseSourceTimes',title :'操作且所属', align: 'center',
		          		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerCommunicateOwnerHouseSourceTimes==''||row.ownerCommunicateOwnerHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p >'+row.ownerCommunicateOwnerHouseSourceTimes+'</p>'
		        				}
		        				else{
		        					html='<span id="displayKpiId3" shopId="'+row.shopId+'"  data-displayKpiId ="9">'+row.ownerCommunicateOwnerHouseSourceTimes+'</span>'
		        				}
		        				
		        			}
		        			
		        			return html;
		        			}
		        	},
			         //沟通房源
			        {field: 'ownerCommunicateAllHouseSourceCount',title :'操作', align: 'center',
		        		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerCommunicateAllHouseSourceCount==''||row.ownerCommunicateAllHouseSourceCount==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.ownerCommunicateAllHouseSourceCount+'</p>'
		        				}else{
		        					html='<span id="displayKpiId4" shopId="'+row.shopId+'" data-displayKpiId ="10">'+row.ownerCommunicateAllHouseSourceCount+'</span>'
		        				}
		        				
		        				//html=row.userName+'<input type="hidden" id="userid" name="data-userid" data-userid="'+row.userId+'"/>';
		        			}
		        			
		        			return html;
		        			}
			        },
				    {field: 'allCommunicateOwnerHouseSourceCount',title :'所属', align: 'center',
			        	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.allCommunicateOwnerHouseSourceCount==''||row.allCommunicateOwnerHouseSourceCount==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.allCommunicateOwnerHouseSourceCount+'</p>'
		        				}else{
		        					html='<span id="displayKpiId5" shopId="'+row.shopId+'" data-displayKpiId ="11">'+row.allCommunicateOwnerHouseSourceCount+'</span>'
		        				}
		        				
		        				
		        			}
		        			
		        			return html;
		        			}
				    },    
				    {field: 'ownerCommunicateOwnerHouseSourceCount',title :'操作且所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerCommunicateOwnerHouseSourceCount==''||row.ownerCommunicateOwnerHouseSourceCount==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.ownerCommunicateOwnerHouseSourceCount+'</p>'
		        				}else{
		        					html='<span id="displayKpiId6" shopId="'+row.shopId+'" data-displayKpiId ="12">'+row.ownerCommunicateOwnerHouseSourceCount+'</span>'
		        				}
		        				
		        				
		        			}
		        			
		        			return html;
		        			}
				    },
				  //跟进
				    {field: 'ownerFollowUpHouseAllSourceTimes',title :'操作', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerFollowUpHouseAllSourceTimes==''||row.ownerFollowUpHouseAllSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.ownerFollowUpHouseAllSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId7" shopId="'+row.shopId+'" data-displayKpiId ="16">'+row.ownerFollowUpHouseAllSourceTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
				    },
				        
				    {field: 'allFollowUpHouseOwnerSourceTimes',title :'所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.allFollowUpHouseOwnerSourceTimes==''||row.allFollowUpHouseOwnerSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.allFollowUpHouseOwnerSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId8" shopId="'+row.shopId+'" data-displayKpiId ="17">'+row.allFollowUpHouseOwnerSourceTimes+'</span>'
		        				}	
		        			}
		        			return html;
		        			}
				    },
				    {field: 'ownerFollowUpHouseOwnerSourceTimes',title :'操作且所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerFollowUpHouseOwnerSourceTimes==''||row.ownerFollowUpHouseOwnerSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.ownerFollowUpHouseOwnerSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId9" shopId="'+row.shopId+'" data-displayKpiId ="18">'+row.ownerFollowUpHouseOwnerSourceTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
				    }, 
				   //新增
				    {field: 'ownerCommunicateAllNewHouseSourceTimes',title :'操作', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerCommunicateAllNewHouseSourceTimes==''||row.ownerCommunicateAllNewHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.ownerCommunicateAllNewHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId10" shopId="'+row.shopId+'" data-displayKpiId ="13">'+row.ownerCommunicateAllNewHouseSourceTimes+'</span>'
		        				}
		        			}
		        			
		        			return html;
		        			}
				    }, 
				    {field: 'allCommunicateOwnerNewHouseSourceTimes',title :'所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.allCommunicateOwnerNewHouseSourceTimes==''||row.allCommunicateOwnerNewHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.allCommunicateOwnerNewHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId11" shopId="'+row.shopId+'" data-displayKpiId ="14">'+row.allCommunicateOwnerNewHouseSourceTimes+'</span>'
		        				}
		        			}
		        			
		        			return html;
		        			}
				    },
				    {field: 'ownerCommunicateOwnerNewHouseSourceTimes',title :'操作且所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerCommunicateOwnerNewHouseSourceTimes==''||row.ownerCommunicateOwnerNewHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.ownerCommunicateOwnerNewHouseSourceTimes+'</p>'
		        				}
		        				else{
		        					html='<span id="displayKpiId12" shopId="'+row.shopId+'" data-displayKpiId ="15">'+row.ownerCommunicateOwnerNewHouseSourceTimes+'</span>'
		        				}
		        				
		        			}
		        			
		        			return html;
		        			}
				    }, 
				     //空看
				    {field: 'ownerEmptySeeAllHouseSourceTimes',title :'操作', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerEmptySeeAllHouseSourceTimes==''||row.ownerEmptySeeAllHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.ownerEmptySeeAllHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId13" shopId="'+row.shopId+'" data-displayKpiId ="19">'+row.ownerEmptySeeAllHouseSourceTimes+'</span>'
		        				}
		        			}
		        			
		        			return html;
		        			}
				    },
				    {field: 'allEmptySeeOwnerHouseSourceTimes',title :'所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.allEmptySeeOwnerHouseSourceTimes==''||row.allEmptySeeOwnerHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.allEmptySeeOwnerHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId14" shopId="'+row.shopId+'" data-displayKpiId ="20">'+row.allEmptySeeOwnerHouseSourceTimes+'</span>'
		        				}
		        				
		        			}
		        			
		        			return html;
		        			}
				    },
				    {field: 'ownerEmptySeeOwnerHouseSourceTimes',title :'操作且所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerEmptySeeOwnerHouseSourceTimes==''||row.ownerEmptySeeOwnerHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.ownerEmptySeeOwnerHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId15" shopId="'+row.shopId+'" data-displayKpiId ="21">'+row.ownerEmptySeeOwnerHouseSourceTimes+'</span>'
		        				}	
		        			}
		        			return html;
		        			}
				    },
				   //房源收钥匙
				    {field: 'ownerRecieveKeyAllHouseSourceTimes',title :'操作', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerRecieveKeyAllHouseSourceTimes==''||row.ownerRecieveKeyAllHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.ownerRecieveKeyAllHouseSourceTimes+'</p>'
		        				}
		        				else{
		        					html='<span id="displayKpiId16" shopId="'+row.shopId+'" data-displayKpiId ="22">'+row.ownerRecieveKeyAllHouseSourceTimes+'</span>'
		        				}
		        			}
		        			
		        			return html;
		        			}
				    }, 
				    {field: 'allRecieveKeyOwnerHouseSourceTimes',title :'所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.allRecieveKeyOwnerHouseSourceTimes==''||row.allRecieveKeyOwnerHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.allRecieveKeyOwnerHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId17" shopId="'+row.shopId+'" data-displayKpiId ="23">'+row.allRecieveKeyOwnerHouseSourceTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
				    },
				    {field: 'ownerRecieveKeyOwnerHouseSourceTimes',title :'操作且所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerRecieveKeyOwnerHouseSourceTimes==''||row.ownerRecieveKeyOwnerHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.ownerRecieveKeyOwnerHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId18" shopId="'+row.shopId+'" data-displayKpiId ="24">'+row.ownerRecieveKeyOwnerHouseSourceTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
				    }, 
				     //实勘   
				    {field: 'ownerInquisitionAllHouseSourceTimes',title :'操作', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerInquisitionAllHouseSourceTimes==''||row.ownerInquisitionAllHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.ownerInquisitionAllHouseSourceTimes+'</p>'
		        				}
		        				else{
		        					html='<span id="displayKpiId19" shopId="'+row.shopId+'" data-displayKpiId ="25">'+row.ownerInquisitionAllHouseSourceTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
				    },
				    {field: 'allInquisitionOwnerHouseSourceTimes',title :'所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.allInquisitionOwnerHouseSourceTimes==''||row.allInquisitionOwnerHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.allInquisitionOwnerHouseSourceTimes+'</p>'
		        				}
		        				else{
		        					html='<span id="displayKpiId20" shopId="'+row.shopId+'" data-displayKpiId ="26">'+row.allInquisitionOwnerHouseSourceTimes+'</span>'
		        				}
		        				
		        			}
		        			
		        			return html;
		        			}
				    }, 
				    {field: 'ownerInquisitionOwnerHouseSourceTimes',title :'操作且所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerInquisitionOwnerHouseSourceTimes==''||row.ownerInquisitionOwnerHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p >'+row.ownerInquisitionOwnerHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId21" shopId="'+row.shopId+'" data-displayKpiId ="27">'+row.ownerInquisitionOwnerHouseSourceTimes+'</span>'
		        				}
		        			}
		        			
		        			return html;
		        			}
				    }, 
				    //委托
				    {field: 'ownerCredentialAllHouseSourceTimes',title :'操作', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerCredentialAllHouseSourceTimes==''||row.ownerCredentialAllHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.ownerCredentialAllHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId22" shopId="'+row.shopId+'" data-displayKpiId ="28">'+row.ownerCredentialAllHouseSourceTimes+'</span>'
		        				}
		        			}
		        			
		        			return html;
		        			}
				    },
				    {field: 'allCredentialOwnerHouseSourceTimes',title :'所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.allCredentialOwnerHouseSourceTimes==''||row.allCredentialOwnerHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.allCredentialOwnerHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId23" shopId="'+row.shopId+'" data-displayKpiId ="29">'+row.allCredentialOwnerHouseSourceTimes+'</span>'
		        				}
		        			}
		        			
		        			return html;
		        			}
				    }, 
				    {field: 'ownerCredentialOwnerHouseSourceTimes',title :'操作且所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerCredentialOwnerHouseSourceTimes==''||row.ownerCredentialOwnerHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.ownerCredentialOwnerHouseSourceTimes+'</p>'
		        				}
		        				else{
		        					html='<span id="displayKpiId24" shopId="'+row.shopId+'" data-displayKpiId ="30">'+row.ownerCredentialOwnerHouseSourceTimes+'</span>'
		        				}
		        			}
		        			
		        			return html;
		        			}
				    }     
				]
	});
}
//房源--经纪人
function searchTableDatas2() {
	$('#house_person').bootstrapTable('destroy').bootstrapTable({
		url: basePath + '/business/report/finduserstatisticslogtimes',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		//showFooter:true,
		pagination: false,
		striped: true,
		//pageSize: 10000,
		//pageList: [10000],
		queryParams: function (params) {
			var o = jQuery('#J_query').serializeObject();
			o.businessTypeId=$('#businsStates').val();
			o.customerTypeId=$('#customerTypeId').val();
			o.departmentTypeId=departmentTypeId;
			o.departmentId=$('#J_deptName1').attr('data-id');
			o.userId=$('#J_user').attr('data-id');
			return o;
		},
		responseHandler: function(result){
			console.log(result.data)
			if(result.code == 0 && result.data && result.data.length > 0) {
				return { "rows": result.data, "total": result.data.length }
			}
			return { "rows": [], "total": 0 }
		},
		columns: [ 	

		        	{field: 'displayShopName',title :'所属部门', align: 'center'},
		        	//经纪人
		        	{field: 'userName',title :'经纪人', align: 'center',
		        		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.userName==''){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.userName+'</p>'
		        				}else{
		        					html='<span id="userid" name="data-userid" data-userid="'+row.userId+'">'+row.userName+'</span>'
		        				}
		        			}
		        			
		        			return html;
		        			}
		        	},
		           	//房源沟通
		           	{field: 'ownerCommunicateAllHouseSourceTimes',title :'操作', align: 'center',
		        		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerCommunicateAllHouseSourceTimes==''||row.ownerCommunicateAllHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p >'+row.ownerCommunicateAllHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId111" data-userid="'+row.userId+'" data-displayKpiId ="7">'+row.ownerCommunicateAllHouseSourceTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
		           	},
		          	{field: 'allCommunicateOwnerHouseSourceTimes', title: '所属', align: 'center',
		           		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.allCommunicateOwnerHouseSourceTimes==''||row.allCommunicateOwnerHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.allCommunicateOwnerHouseSourceTimes+'</p>'
		        				}
		        				else{
		        					html='<span id="displayKpiId112" data-userid="'+row.userId+'" data-displayKpiId ="8">'+row.allCommunicateOwnerHouseSourceTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
		          	},
		        	{field: 'ownerCommunicateOwnerHouseSourceTimes',title :'操作且所属', align: 'center',
		          		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerCommunicateOwnerHouseSourceTimes==''||row.ownerCommunicateOwnerHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.ownerCommunicateOwnerHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId113" data-userid="'+row.userId+'" data-displayKpiId ="9">'+row.ownerCommunicateOwnerHouseSourceTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
		        	},
			       	//沟通房源
			        {field: 'ownerCommunicateAllHouseSourceCount',title :'操作', align: 'center',
		        		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerCommunicateAllHouseSourceCount==''||row.ownerCommunicateAllHouseSourceCount==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.ownerCommunicateAllHouseSourceCount+'</p>'
		        				}else{
		        					html='<span id="displayKpiId114" data-userid="'+row.userId+'" data-displayKpiId ="10">'+row.ownerCommunicateAllHouseSourceCount+'</span>'
		        				}
		        			}
		        			return html;
		        			}
			        },
				    {field: 'allCommunicateOwnerHouseSourceCount',title :'所属', align: 'center',
			        	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.allCommunicateOwnerHouseSourceCount==''||row.allCommunicateOwnerHouseSourceCount==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.allCommunicateOwnerHouseSourceCount+'</p>'
		        				}else{
		        					html='<span id="displayKpiId115" data-userid="'+row.userId+'" data-displayKpiId ="11">'+row.allCommunicateOwnerHouseSourceCount+'</span>'
		        				}
		        			}
		        			return html;
		        			}
				    },    
				    {field: 'ownerCommunicateOwnerHouseSourceCount',title :'操作且所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerCommunicateOwnerHouseSourceCount==''||row.ownerCommunicateOwnerHouseSourceCount==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.ownerCommunicateOwnerHouseSourceCount+'</p>'
		        				}else{
		        					html='<span id="displayKpiId116" data-userid="'+row.userId+'" data-displayKpiId ="12">'+row.ownerCommunicateOwnerHouseSourceCount+'</span>'
		        				}
		        			}
		        			return html;
		        			}
				    },
				    //跟进
				    {field: 'ownerFollowUpHouseAllSourceTimes',title :'操作', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerFollowUpHouseAllSourceTimes==''||row.ownerFollowUpHouseAllSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.ownerFollowUpHouseAllSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId117" data-userid="'+row.userId+'" data-displayKpiId ="16">'+row.ownerFollowUpHouseAllSourceTimes+'</span>'
			        				
		        				}
		        			}
		        			return html;
		        			}
				    },
				  
				    {field: 'allFollowUpHouseOwnerSourceTimes',title :'所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.allFollowUpHouseOwnerSourceTimes==''||row.allFollowUpHouseOwnerSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.allFollowUpHouseOwnerSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId118" data-userid="'+row.userId+'" data-displayKpiId ="17">'+row.allFollowUpHouseOwnerSourceTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
				    },
				    {field: 'ownerFollowUpHouseOwnerSourceTimes',title :'操作且所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerFollowUpHouseOwnerSourceTimes==''||row.ownerFollowUpHouseOwnerSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.ownerFollowUpHouseOwnerSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId119" data-userid="'+row.userId+'" data-displayKpiId ="18">'+row.ownerFollowUpHouseOwnerSourceTimes+'</span>'
		        				}
		        			}
		        			
		        			return html;
		        			}
				    }, 
				   //新增
				    {field: 'ownerCommunicateAllNewHouseSourceTimes',title :'操作', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerCommunicateAllNewHouseSourceTimes==''||row.ownerCommunicateAllNewHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.ownerCommunicateAllNewHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId120" data-userid="'+row.userId+'" data-displayKpiId ="13">'+row.ownerCommunicateAllNewHouseSourceTimes+'</span>'
		        				}
		        				
		        			}
		        			
		        			return html;
		        			}
				    }, 
				    {field: 'allCommunicateOwnerNewHouseSourceTimes',title :'所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.allCommunicateOwnerNewHouseSourceTimes==''||row.allCommunicateOwnerNewHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.allCommunicateOwnerNewHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId121" data-userid="'+row.userId+'" data-displayKpiId ="14">'+row.allCommunicateOwnerNewHouseSourceTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
				    },
				    {field: 'ownerCommunicateOwnerNewHouseSourceTimes',title :'操作且所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerCommunicateOwnerNewHouseSourceTimes==''||row.ownerCommunicateOwnerNewHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.ownerCommunicateOwnerNewHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId122" data-userid="'+row.userId+'" data-displayKpiId ="15">'+row.ownerCommunicateOwnerNewHouseSourceTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
				    }, 
				     //空看
				    {field: 'ownerEmptySeeAllHouseSourceTimes',title :'操作', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerEmptySeeAllHouseSourceTimes==''||row.ownerEmptySeeAllHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.ownerEmptySeeAllHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId123" data-userid="'+row.userId+'" data-displayKpiId ="19">'+row.ownerEmptySeeAllHouseSourceTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
				    },
				    {field: 'allEmptySeeOwnerHouseSourceTimes',title :'所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.allEmptySeeOwnerHouseSourceTimes==''||row.allEmptySeeOwnerHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.allEmptySeeOwnerHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId124" data-userid="'+row.userId+'" data-displayKpiId ="20">'+row.allEmptySeeOwnerHouseSourceTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
				    },
				    {field: 'ownerEmptySeeOwnerHouseSourceTimes',title :'操作且所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerEmptySeeOwnerHouseSourceTimes==''||row.ownerEmptySeeOwnerHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.ownerEmptySeeOwnerHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId125" data-userid="'+row.userId+'" data-displayKpiId ="21">'+row.ownerEmptySeeOwnerHouseSourceTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
				    },
				   //房源收钥匙
				    {field: 'ownerRecieveKeyAllHouseSourceTimes',title :'操作', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerRecieveKeyAllHouseSourceTimes==''||row.ownerRecieveKeyAllHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.ownerRecieveKeyAllHouseSourceTimes+'</p>'
		        				}
		        				else{
		        					html='<span id="displayKpiId126" data-userid="'+row.userId+'" data-displayKpiId ="22">'+row.ownerRecieveKeyAllHouseSourceTimes+'</span>'
		        				}
		        				
		        			}
		        			return html;
		        			}
				    }, 
				    {field: 'allRecieveKeyOwnerHouseSourceTimes',title :'所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.allRecieveKeyOwnerHouseSourceTimes==''||row.allRecieveKeyOwnerHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.allRecieveKeyOwnerHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId127" data-userid="'+row.userId+'" data-displayKpiId ="23">'+row.allRecieveKeyOwnerHouseSourceTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
				    },
				    {field: 'ownerRecieveKeyOwnerHouseSourceTimes',title :'操作且所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerRecieveKeyOwnerHouseSourceTimes==''||row.ownerRecieveKeyOwnerHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.ownerRecieveKeyOwnerHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId128" data-userid="'+row.userId+'" data-displayKpiId ="24">'+row.ownerRecieveKeyOwnerHouseSourceTimes+'</span>'
		        				}
		        				
		        			}
		        			return html;
		        			}
				    }, 
				     //实勘   
				    {field: 'ownerInquisitionAllHouseSourceTimes',title :'操作', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerInquisitionAllHouseSourceTimes==''||row.ownerInquisitionAllHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.ownerInquisitionAllHouseSourceTimes+'</p>'
		        				}
		        				else{
		        					html='<span id="displayKpiId129" data-userid="'+row.userId+'" data-displayKpiId ="25">'+row.ownerInquisitionAllHouseSourceTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
				    },
				    {field: 'allInquisitionOwnerHouseSourceTimes',title :'所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.allInquisitionOwnerHouseSourceTimes==''||row.allInquisitionOwnerHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.allInquisitionOwnerHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId130" data-userid="'+row.userId+'" data-displayKpiId ="26">'+row.allInquisitionOwnerHouseSourceTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
				    }, 
				    {field: 'ownerInquisitionOwnerHouseSourceTimes',title :'操作且所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerInquisitionOwnerHouseSourceTimes==''||row.ownerInquisitionOwnerHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p >'+row.ownerInquisitionOwnerHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId131" data-userid="'+row.userId+'" data-displayKpiId ="27">'+row.ownerInquisitionOwnerHouseSourceTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
				    }, 
				    //委托
				    {field: 'ownerCredentialAllHouseSourceTimes',title :'操作', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerCredentialAllHouseSourceTimes==''||row.ownerCredentialAllHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.ownerCredentialAllHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId132" data-userid="'+row.userId+'" data-displayKpiId ="28">'+row.ownerCredentialAllHouseSourceTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
				    },
				    {field: 'allCredentialOwnerHouseSourceTimes',title :'所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.allCredentialOwnerHouseSourceTimes==''||row.allCredentialOwnerHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.allCredentialOwnerHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId133" data-userid="'+row.userId+'" data-displayKpiId ="29">'+row.allCredentialOwnerHouseSourceTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
				    }, 
				    {field: 'ownerCredentialOwnerHouseSourceTimes',title :'操作且所属', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerCredentialOwnerHouseSourceTimes==''||row.ownerCredentialOwnerHouseSourceTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.ownerCredentialOwnerHouseSourceTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId134" data-userid="'+row.userId+'" data-displayKpiId ="30">'+row.ownerCredentialOwnerHouseSourceTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
				    }   
				]
	});
}

//客源--店组
function searchTableDatas3() {
	$('#customer_house').bootstrapTable('destroy').bootstrapTable({
		url: basePath + '/business/report/finddepartmentstatisticslogtimes',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		//showFooter:true,
		pagination: false,
		striped: true,
		pageSize: 10000,
		pageList: [10000],
		queryParams: function (params) {
			var o = jQuery('#J_query').serializeObject();
			o.businessTypeId=$('#businsStates').val();
			o.customerTypeId=$('#customerTypeId').val();
			o.departmentTypeId=departmentTypeId;
			o.departmentId=$('#J_deptName1').attr('data-id');
			return o;
		},
		responseHandler: function(result){
			console.log(result.data)
			if(result.code == 0 && result.data && result.data.length > 0) {
				return { "rows": result.data, "total": result.data-1 }
			}
			return { "rows": [] } 
		},
		columns: [ 	
		           	{field: 'displayShopName',title :'所属部门', align: 'center'},
		           	//客户沟通
		           	{field: 'ownerCommunicateCustomerTimes',title :'客户沟通', align: 'center',
		           		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerCommunicateCustomerTimes==''||row.ownerCommunicateCustomerTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				html='<span id="displayKpiId310" shopId="'+row.shopId+'" data-displayKpiId ="1">'+row.ownerCommunicateCustomerTimes+'</span>'
		        				//html=row.userName+'<input type="hidden" id="userid" name="data-userid" data-userid="'+row.userId+'"/>';
		        			}
		        			return html;
		        			}
		           	},
		            //客户沟通数
		          	{field: 'ownerCommunicateCustomerCount', title: '客户沟通数', align: 'center',
		           		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerCommunicateCustomerCount==''||row.ownerCommunicateCustomerCount==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.ownerCommunicateCustomerCount+'</p>'
		        				}else{
		        					html='<span id="displayKpiId311" shopId="'+row.shopId+'" data-displayKpiId ="2">'+row.ownerCommunicateCustomerCount+'</span>'
		        				}
		        			}
		        			return html;
		        			}
		          	},
		           	//客户跟进
		        	{field: 'ownerFollowUpCustomerCount',title :'客户跟进', align: 'center',
		          		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerFollowUpCustomerCount==''||row.ownerFollowUpCustomerCount==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.ownerFollowUpCustomerCount+'</p>'
		        				}else{
		        					html='<span id="displayKpiId312" shopId="'+row.shopId+'" data-displayKpiId ="4">'+row.ownerFollowUpCustomerCount+'</span>'
		        				}
		        			}
		        			return html;
		        			}
		        	},
			        //客户新增
			        {field: 'ownerNewCustomerCount',title :'客户新增', align: 'center',
		        		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerNewCustomerCount==''||row.ownerNewCustomerCount==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.ownerNewCustomerCount+'</p>'
		        				}else{
		        					html='<span id="displayKpiId313" shopId="'+row.shopId+'" data-displayKpiId ="3">'+row.ownerNewCustomerCount+'</span>'
		        				}
		        			}
		        			return html;
		        			}
			        },
				    //客户预约看房
				    {field: 'ownerOrderSeeCustomerCount',title :'客户预约看房', align: 'center',
			        	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerOrderSeeCustomerCount==''||row.ownerOrderSeeCustomerCount==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.ownerOrderSeeCustomerCount+'</p>'
		        				}else{
		        					html='<span id="displayKpiId314" shopId="'+row.shopId+'" data-displayKpiId ="5">'+row.ownerOrderSeeCustomerCount+'</span>'
		        				}
		        			}
		        			return html;
		        			}
				    }, 
				    //客户看房套数
				    {field: 'ownerSuccessSeeCustomerHouseCount',title :'客户看房套数', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerSuccessSeeCustomerHouseCount==''||row.ownerSuccessSeeCustomerHouseCount==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.shopId==undefined){
		        					html='<p>'+row.ownerSuccessSeeCustomerHouseCount+'</p>'
		        				}
		        				else{
		        					html='<span id="displayKpiId315" shopId="'+row.shopId+'" data-displayKpiId ="6">'+row.ownerSuccessSeeCustomerHouseCount+'</span>'
		        				}
		        				
		        			}
		        			return html;
		        			}
				    }
				]
	});
}
//客源--经纪人
function searchTableDatas4() {
	$('#customer_person').bootstrapTable('destroy').bootstrapTable({
		url: basePath + '/business/report/finduserstatisticslogtimes',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		//showFooter:true,
		pagination: false,
		striped: true,
		pageSize: 10000,
		pageList: [10000],
		queryParams: function (params) {
			var o = jQuery('#J_query').serializeObject();
			o.businessTypeId=$('#businsStates').val();
			o.customerTypeId=$('#customerTypeId').val();
			o.departmentTypeId=departmentTypeId;
			o.departmentId=$('#J_deptName1').attr('data-id');
			o.userId=$('#J_user').attr('data-id');
			return o;
		},
		responseHandler: function(result){
			console.log(result.data)
			if(result.code == 0 && result.data && result.data.length > 0) {
				return { "rows": result.data, "total": result.data-1 }
			}
			return { "rows": [] } 
		},
		columns: [ 	
		           	{field: 'displayShopName',title :'所属部门', align: 'center'},
		           	//经纪人
		        	{field: 'userName',title :'经纪人', align: 'center',
		           		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.userName==''){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p >'+row.userName+'</p>'
		        				}
		        				html='<span id="userid2" name="data-userid" data-userid="'+row.userId+'">'+row.userName+'</span>'
		        
		        			}
		        			
		        			return html;
		        			}
		        	},
		           	//客户沟通
		           	{field: 'ownerCommunicateCustomerTimes',title :'客户沟通', align: 'center',
		        		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerCommunicateCustomerTimes==''||row.ownerCommunicateCustomerTimes==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.ownerCommunicateCustomerTimes+'</p>'
		        				}else{
		        					html='<span id="displayKpiId410" data-userid="'+row.userId+'" data-displayKpiId ="1">'+row.ownerCommunicateCustomerTimes+'</span>'
		        				}
		        			}
		        			return html;
		        			}
		           	},
		            //客户沟通数
		          	{field: 'ownerCommunicateCustomerCount', title: '客户沟通数', align: 'center',
		           		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerCommunicateCustomerCount==''||row.ownerCommunicateCustomerCount==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.ownerCommunicateCustomerCount+'</p>'
		        				}
		        				else{
		        					html='<span id="displayKpiId411" data-userid="'+row.userId+'" data-displayKpiId ="2">'+row.ownerCommunicateCustomerCount+'</span>'
		        				}
		        			
		        			}
		        			return html;
		        			}
		          	},
		           	//客户跟进
		        	{field: 'ownerFollowUpCustomerCount',title :'客户跟进', align: 'center',
		          		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerFollowUpCustomerCount==''||row.ownerFollowUpCustomerCount==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.ownerFollowUpCustomerCount+'</p>'
		        				}else{
		        					html='<span id="displayKpiId412" data-userid="'+row.userId+'" data-displayKpiId ="4">'+row.ownerFollowUpCustomerCount+'</span>'
		        				}
		        			}
		        			return html;
		        			}
		        	},
			        //客户新增
			        {field: 'ownerNewCustomerCount',title :'客户新增', align: 'center',
		        		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerNewCustomerCount==''||row.ownerNewCustomerCount==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.ownerNewCustomerCount+'</p>'
		        				}else{
		        					html='<span id="displayKpiId413" data-userid="'+row.userId+'" data-displayKpiId ="3">'+row.ownerNewCustomerCount+'</span>'
		        				}
		        				
		        				//html=row.userName+'<input type="hidden" id="userid" name="data-userid" data-userid="'+row.userId+'"/>';
		        			}
		        			return html;
		        			}
			        },
				    //客户预约看房
				    {field: 'ownerOrderSeeCustomerCount',title :'客户预约看房', align: 'center',
			        	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerOrderSeeCustomerCount==''||row.ownerOrderSeeCustomerCount==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.ownerOrderSeeCustomerCount+'</p>'
		        				}else{
		        					html='<span id="displayKpiId414" data-userid="'+row.userId+'" data-displayKpiId ="5">'+row.ownerOrderSeeCustomerCount+'</span>'
		        				}
		        				
		        				//html=row.userName+'<input type="hidden" id="userid" name="data-userid" data-userid="'+row.userId+'"/>';
		        			}
		        			return html;
		        			}
				    }, 
				    //客户看房套数
				    {field: 'ownerSuccessSeeCustomerHouseCount',title :'客户看房套数', align: 'center',
				    	formatter: function(value, row, index){	
		        			var html='';
		        			if(row.ownerSuccessSeeCustomerHouseCount==''||row.ownerSuccessSeeCustomerHouseCount==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				if(row.userId==undefined){
		        					html='<p>'+row.ownerSuccessSeeCustomerHouseCount+'</p>'
		        				}else{
		        					html='<span id="displayKpiId415" data-userid="'+row.userId+'" data-displayKpiId ="6">'+row.ownerSuccessSeeCustomerHouseCount+'</span>'
		        				}
		        				
		        				//html=row.userName+'<input type="hidden" id="userid" name="data-userid" data-userid="'+row.userId+'"/>';
		        			}
		        			return html;
		        			}
				    }
				]
	});
}


});


//表格下载J_export
$('#J_export').on('click', function(event) {
	downExcel() 
})
function downExcel() {
	var parameters = {

	};
	//
	var	departmentTypeId2
	var departmentTypeId_val=$('#J_level_id1').val();
	//var J_deptName1=$('#J_deptName1')
	if(departmentTypeId_val==''){
		layer.alert('请选择所属部门');
		return false;
	}
	else if(departmentTypeId_val==1){
		departmentTypeId2=30;
	}else if(departmentTypeId_val==2){
		departmentTypeId2=40;
	}else if(departmentTypeId_val==3){
		departmentTypeId2=50;
	}else{
		layer.alert('部门只能选择大区，店组和店');
		return false;
	}
	//
	var departmentUserGroupTypeId=$('#statistical').val();
	//var departmentUserGroup=$('#statistical').val();
	// var departmentUserGroupTypeId = departmentUserGroup;//经理人
	//var departmentUserGroupTypeId = 2;// 店组
	parameters.departmentId = $('#J_deptName1').attr('data-id');
	parameters.departmentTypeId = departmentTypeId2;
	parameters.businessTypeId = $('#businsStates').val();
	parameters.customerTypeId = $('#customerTypeId').val();
	// "2017-04-18";
	var end=$('#J_enddate').val();
	parameters.endTime = encodeURI(end);

	// "2017-04-18";
	var start=$('#J_begindate').val();
		//alert(start)
	parameters.startTime = encodeURI(start);
	parameters = "departmentId=" + parameters.departmentId
			+ "&departmentTypeId=" + parameters.departmentTypeId
			+ "&startTime=" + parameters.startTime + "&endTime="
			+ parameters.endTime + "&businessTypeId="
			+ parameters.businessTypeId + "&customerTypeId="
			+ parameters.customerTypeId;
	if (departmentUserGroupTypeId == 1) {
		window.open(basePath + '/business/report/downuserlogtimes.htm?'
				+ parameters);
	} else {
		window.open(basePath + '/business/report/downdepartmentlogtimes.htm?'
				+ parameters);
	}
};
//房源-店组模态框；

function house_house(event){
	layer.open({
		//title : '实勘结果批量上传',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		zIndex: 10,//保证树在上面
		content : $('#layer_house_house'),
		area :   ['700px','400px'],
		//btn : [ '确定'],
		//yes : function(event) {	

	});	
};
//房源-店组-第一组
/*$(document).delegate(
		'#displayKpiId1',
		'click',
		function(event) {
			excel1(event)
			house_house(event)
		}
	)*/
/*function excel1(event){
	//$("#layer_house_house  tr:not(:first)").html(""); 
	$('#house_house2').bootstrapTable({
		url: basePath + '/business/report/findshophousestatisticslogtimes',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: false,
		striped: true,
		pageSize: 10000,
		pageList: [10000],
		queryParams: function (params) {
			var o = jQuery('#J_query').serializeObject();
			o.businessTypeId=$('#businsStates').val();
			o.displayKpiId=$('#displayKpiId1').attr('data-displayKpiId');//shopId
			o.shopId=$('#displayKpiId1').attr('shopId');
			return o;
		},
		responseHandler: function(result){
			console.log(result.data)
			if(result.code == 0 && result.data && result.data.length > 0) {
				return { "rows": result.data, "total": result.data-1 }
			}
			return { "rows": [] } 
		},
		columns: [ 	
		           	{field: 'houseId',title :'房源编号', align: 'center',
		           		formatter: function(value, row, index){	
		           			var html='';
		           			var housesId=row.houseId;
		           			//html='<a href="#">'+housesId+'</a>'
		           			var businessType=$('#businsStates').val();
		           			if(businessType=='1'){
		           				html='<a target="_blank" href="../../house/main/leasedetail.htm?houseid='+housesId+'">'+housesId+'</a>'
		           			}else if(businessType=='2'){
		           				html='<a target="_blank" href="../../house/main/buydetail.htm?houseid='+housesId+'">'+housesId+'</a>'
		           			}
		           			return html;
		           			}
		           	},
		        	{field: 'buildingName',title :'楼盘', align: 'center'},
		           	
		          	{field: 'belongUserName', title: '所属人', align: 'center',
		        		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.belongUserName==''){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				html='<span id="userid4" name="data-userid" data-belongUserId="'+row.belongUserId+'">'+row.belongUserName+'</span>'
		        				//html=row.userName+'<input type="hidden" id="userid" name="data-userid" data-userid="'+row.userId+'"/>';
		        			}
		        			
		        			return html;
		        			}
		          	},
		           	//客户跟进
		        	{field: 'times',title :'操作次数', align: 'center'},
			        //客户新增
			        {field: 'registerTime',title :'录入日期', align: 'center'},
				    //客户预约看房
				    {field: 'lastFollowTime',title :'最后跟进日期', align: 'center'}, 
				    //客户看房套数
				   
				]
	});
		
	}*/
/*$(document).delegate(
		'#house_house tbody tr td span',
		'click',
		function(event) {
			if($(this).attr('shopid')!=undefined){
				excelshow($(this).attr('shopid'),$(this).attr('data-displaykpiid'))
			}else if($(this).attr('data-userid')!=undefined){
				exceluser($(this).attr('data-userid'),$(this).attr('data-displaykpiid'))
			}
			
			house_house(event)
		}
	)*/
//房源-店组
$(document).delegate(
		'#house_house tbody tr td span',
		'click',
		function(event) {
			
				excelshow($(this).attr('shopid'),$(this).attr('data-displaykpiid'))
			
			//	exceluser($(this).attr('data-userid'),$(this).attr('data-displaykpiid'))
			
			
			house_house(event)
		}
	);
function excelshow(shopid,displaykpiid){
	
	/*$('#house_house2').bootstrapTable('destroy');*/
	$('#house_house2').bootstrapTable('destroy').bootstrapTable({
		url: basePath + '/business/report/findshophousestatisticslogtimes',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: false,
		striped: false,
		pageSize: 10000,
		pageList: [10000],
		queryParams: function (params) {
			var o = jQuery('#J_query').serializeObject();
			o.businessTypeId=$('#businsStates').val();
			o.displayKpiId=displaykpiid;//shopId
			o.shopId=shopid;
			return o;
		},
		responseHandler: function(result){
			console.log(result.data)
			if(result.code == 0 && result.data && result.data.length > 0) {
				return { "rows": result.data, "total": result.data-1 }
			}
			return { "rows": [] } 
		},
		columns: [ 	
		           	{field: 'houseId',title :'房源编号', align: 'center',
		           		formatter: function(value, row, index){	
		           			var html='';
		           			var housesId=row.houseId;
		           			//html='<a href="#">'+housesId+'</a>'
		           			var businessType=$('#businsStates').val();
		           			if(businessType=='1'){
		           				if(row.buildingHouseId)
			           				html='<a target="_blank" href="../../house/main/leasedetail.htm?houseid='+housesId+'">'+housesId+'</a>';
		           				else
		           					html='<a target="_blank" href="../../house/virtual/detail.htm?houseid='+housesId+'&type='+businessType+'">'+housesId+'(虚)</a>';
		           			}else if(businessType=='2'){
		           				if(row.buildingHouseId)
			           				html='<a target="_blank" href="../../house/main/buydetail.htm?houseid='+housesId+'">'+housesId+'</a>';
		           				else
		           					html='<a target="_blank" href="../../house/virtual/detail.htm?houseid='+housesId+'&type='+businessType+'">'+housesId+'(虚)</a>';
		           			}
		           			return html;
		           			}
		           	},
		        	{field: 'buildingName',title :'楼盘', align: 'center'},
		           	
		          	{field: 'belongUserName', title: '所属人', align: 'center',
		        		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.belongUserName==''||row.belongUserName==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				html='<span id="userid4" name="data-userid" data-belongUserId="'+row.belongUserId+'">'+row.belongUserName+'</span>'
		        				//html=row.userName+'<input type="hidden" id="userid" name="data-userid" data-userid="'+row.userId+'"/>';
		        			}
		        			
		        			return html;
		        			}
		          	},
		           	//客户跟进
		        	{field: 'times',title :'操作次数', align: 'center'},
			        //客户新增
			        {field: 'registerTime',title :'录入日期', align: 'center'},
				    //客户预约看房
				    {field: 'lastFollowTime',title :'最后跟进日期', align: 'center'}, 
				    //客户看房套数
				   
				]
	});
};
//房源-经纪人
$(document).delegate(
		'#house_person tbody tr td span',
		'click',
		function(event) {
			
			exceluser($(this).attr('data-userid'),$(this).attr('data-displaykpiid'))
			
			//	exceluser($(this).attr('data-userid'),$(this).attr('data-displaykpiid'))
			
			
			house_house(event)
		}
	)
function exceluser(userid,displaykpiid){
	
	/*$('#house_house2').bootstrapTable('destroy');*/
	$('#house_house2').bootstrapTable('destroy').bootstrapTable({
	//$('#house_house2').bootstrapTable({
		url: basePath + '/business/report/finduserhousestatisticslogtimes',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: false,
		striped: true,
		pageSize: 10000,
		pageList: [10000],
		queryParams: function (params) {
			var o = jQuery('#J_query').serializeObject();
			o.businessTypeId=$('#businsStates').val();
			o.displayKpiId=displaykpiid;//shopId
			o.userId=userid;
			return o;
		},
		responseHandler: function(result){
			console.log(result.data)
			if(result.code == 0 && result.data && result.data.length > 0) {
				return { "rows": result.data, "total": result.data-1 }
			}
			return { "rows": [] } 
		},
		columns: [ 	
		           	{field: 'houseId',title :'房源编号', align: 'center',
		           		formatter: function(value, row, index){	
		           			var html='';
		           			var housesId=row.houseId;
		           			//html='<a href="#">'+housesId+'</a>'
		           			var businessType=$('#businsStates').val();
		           			if(businessType=='1'){
		           				html='<a target="_blank" href="../../house/main/leasedetail.htm?houseid='+housesId+'">'+housesId+'</a>'
		           			}else if(businessType=='2'){
		           				html='<a target="_blank" href="../../house/main/buydetail.htm?houseid='+housesId+'">'+housesId+'</a>'
		           			}
		           			return html;
		           			}
		           	},
		        	{field: 'buildingName',title :'楼盘', align: 'center'},
		           	
		          	{field: 'belongUserName', title: '所属人', align: 'center',
		        		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.belongUserName==''||row.belongUserName==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				html='<span id="userid4" name="data-userid" data-belongUserId="'+row.belongUserId+'">'+row.belongUserName+'</span>'
		        				//html=row.userName+'<input type="hidden" id="userid" name="data-userid" data-userid="'+row.userId+'"/>';
		        			}
		        			
		        			return html;
		        			}
		          	},
		           	//客户跟进
		        	{field: 'times',title :'操作次数', align: 'center'},
			        //客户新增
			        {field: 'registerTime',title :'录入日期', align: 'center'},
				    //客户预约看房
				    {field: 'lastFollowTime',title :'最后跟进日期', align: 'center'}, 
				    //客户看房套数
				   
				]
	});
};
//客源-店组
function customer(event){
	layer.open({
		//title : '实勘结果批量上传',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		zIndex: 10,//保证树在上面
		content : $('#layer_customer'),
		area :   ['700px','400px'],
		//btn : [ '确定'],
		//yes : function(event) {	

	});	
};
$(document).delegate(
		'#customer_house tbody tr td span',
		'click',
		function(event) {
			
			excelcustomershow($(this).attr('shopid'),$(this).attr('data-displaykpiid'))
			
			//	exceluser($(this).attr('data-userid'),$(this).attr('data-displaykpiid'))
			
			
			customer(event)
		}
	);
function excelcustomershow(shopid,displaykpiid){
	$('#customer2').bootstrapTable('destroy').bootstrapTable({
	//$('#customer2').bootstrapTable({
		url: basePath + '/business/report/findshopcustomerstatisticslogtimes',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: false,
		striped: true,
		pageSize: 10000,
		pageList: [10000],
		queryParams: function (params) {
			var o = jQuery('#J_query').serializeObject();
			o.businessTypeId=$('#businsStates').val();
			o.displayKpiId=displaykpiid;//shopId
			o.shopId=shopid;
			return o;
		},
		responseHandler: function(result){
			console.log(result.data)
			if(result.code == 0 && result.data && result.data.length > 0) {
				return { "rows": result.data, "total": result.data-1 }
			}
			return { "rows": [] } 
		},
		columns: [ 	
		           	{field: 'customerId',title :'客源编号', align: 'center',
		           		formatter: function(value, row, index){	
		           			var html='';
		           			var businessType=$('#businsStates').val();
		           			if(businessType=='1'){
		           				html='<a target="_blank" href="/sales/customer/main/findleaseclientbycustomerid.htm?customerId='+row.customerId+'">'+row.customerId+'</a>';
		           			}else if(businessType=='2'){
		           				html='<a target="_blank" href="/sales/customer/main/findbuyerclientbycustomerid.htm?customerId='+row.customerId+'">'+row.customerId+'</a>';
		           			}
		           			return html;
		           			}
		           	},
		        	{field: 'customerFinalAssessmentName',title :'评价', align: 'center',
		           		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.customerFinalAssessmentName==''){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				html='<span >'+row.customerFinalAssessmentName+'</span>'
		        			}
		        			return html;
		        			}
		        	},
		        	{field: 'clientTypeName',title :'客户类型', align: 'center',
		           		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.clientTypeName==''){
		        				
		        				html='-'	
		        			}else{
		        				html='<span >'+row.clientTypeName+'</span>'
		        			}
		        			return html;
		        			}
		        	},
		          	{field: 'belongUserName', title: '所属人', align: 'center',
		        		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.belongUserName==''||row.belongUserName==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				html='<span id="userid4" name="data-userid" data-belongUserId="'+row.belongUserId+'">'+row.belongUserName+'</span>'
		        				//html=row.userName+'<input type="hidden" id="userid" name="data-userid" data-userid="'+row.userId+'"/>';
		        			}
		        			
		        			return html;
		        			}
		          	},
		           	//客户跟进
		        	{field: 'times',title :'操作次数', align: 'center'},
			        //客户新增
			        {field: 'registerTime',title :'录入日期', align: 'center'},
				    //客户预约看房
				    {field: 'lastFollowTime',title :'最后跟进日期', align: 'center'}, 
				    //客户看房套数
				   
				]
	});
}

$(document).delegate(
		'#customer_person tbody tr td span',
		'click',
		function(event) {
			
			excelcustomeruser($(this).attr('shopid'),$(this).attr('data-displaykpiid'))
			
			//	exceluser($(this).attr('data-userid'),$(this).attr('data-displaykpiid'))
			
			
			customer(event)
		}
	);
function excelcustomeruser(userid,displaykpiid){
	//$('#customer2').bootstrapTable({
	$('#customer2').bootstrapTable('destroy').bootstrapTable({
		url: basePath + '/business/report/findusercustomerstatisticslogtimes',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: false,
		striped: true,
		pageSize: 10000,
		pageList: [10000],
		queryParams: function (params) {
			var o = jQuery('#J_query').serializeObject();
			o.businessTypeId=$('#businsStates').val();
			o.displayKpiId=displaykpiid;//shopId
			o.userId=userid;
			return o;
		},
		responseHandler: function(result){
			console.log(result.data)
			if(result.code == 0 && result.data && result.data.length > 0) {
				return { "rows": result.data, "total": result.data-1 }
			}
			return { "rows": [] } 
		},
		columns: [ 	
		           	{field: 'customerId',title :'客源编号', align: 'center',
		           		formatter: function(value, row, index){	
		           			var html='';
		           			var businessType=$('#businsStates').val();
		           			if(businessType=='1'){
		           				html='<a target="_blank" href="/sales/customer/main/findleaseclientbycustomerid.htm?customerId='+row.customerId+'">'+row.customerId+'</a>';
		           			}else if(businessType=='2'){
		           				html='<a target="_blank" href="/sales/customer/main/findbuyerclientbycustomerid.htm?customerId='+row.customerId+'">'+row.customerId+'</a>';
		           			}
		           			return html;
		           			}
		           	},
		        	{field: 'customerFinalAssessmentName',title :'评价', align: 'center',
		           		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.customerFinalAssessmentName==''){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				html='<span >'+row.customerFinalAssessmentName+'</span>'
		        			}
		        			return html;
		        			}
		        	},
		        	{field: 'clientTypeName',title :'客户类型', align: 'center',
		           		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.clientTypeName==''){
		        				
		        				html='-'	
		        			}else{
		        				html='<span >'+row.clientTypeName+'</span>'
		        			}
		        			return html;
		        			}
		        	},
		          	{field: 'belongUserName', title: '所属人', align: 'center',
		        		formatter: function(value, row, index){	
		        			var html='';
		        			if(row.belongUserName==''||row.belongUserName==undefined){
		        				//alert(html);
		        				html='-'	
		        			}else{
		        				html='<span id="userid4" name="data-userid" data-belongUserId="'+row.belongUserId+'">'+row.belongUserName+'</span>'
		        				//html=row.userName+'<input type="hidden" id="userid" name="data-userid" data-userid="'+row.userId+'"/>';
		        			}
		        			
		        			return html;
		        			}
		          	},
		           	//客户跟进
		        	{field: 'times',title :'操作次数', align: 'center'},
			        //客户新增
			        {field: 'registerTime',title :'录入日期', align: 'center'},
				    //客户预约看房
				    {field: 'lastFollowTime',title :'最后跟进日期', align: 'center'}, 
				    //客户看房套数
				   
				]
	});
}
//房源-店组-第一组
/*$(document).delegate(
		'#displayKpiId2',
		'click',
		function(event) {
			excel2(event)
			house_house(event)
		}
	)*/


//所属人模态框客源-经纪人-弹框
$(document).delegate(
		'#userid4',
		'click',
		function(event) {
			
			var userId2 = $(this).attr('data-belongUserId');
			getUserStaffInfo(userId2);
		}
	);


















//所属人模态框1
$(document).delegate(
		'#userid',
		'click',
		function(event) {
			
			var userId2 = $(this).attr('data-userid');
			getUserStaffInfo(userId2);
		}
	);

//所属人模态框2
$(document).delegate(
		'#userid2',
		'click',
		function(event) {
			var userId2 = $(this).attr('data-userid');
			getUserStaffInfo(userId2);
		}
	)	