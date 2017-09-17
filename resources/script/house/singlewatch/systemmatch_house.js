$(function() {
	$("select").chosen({
		width : "100%"
	});
	dimContainer.buildDimChosenSelector($("#J_minBedRoom_system"), "minBedRoom", "");
	dimContainer.buildDimChosenSelector($("#J_maxBedRoom_system"), "maxBedRoom", "");
})



$('#J_systemmatch_query #J_reset_system').on('click', function(event) {
	$('#J_systemmatch_query .J_chosen').val('');
	$('#J_systemmatch_query .J_chosen').trigger('chosen:updated');
})

$('#J_reset_system').on('click', function(event) {
	resetsystem();
})

function resetsystem(){
	$('.J_chosen').val('');
	$('.J_chosen').trigger('chosen:updated');
	
	$('#J_houseid_system').val('');
	$('#J_minPrice_system').val('');
	$('#J_maxPrice_system').val('');
	
	$('#J_minBuildArea_system').val('');
	$('#J_maxBuildArea_system').val('');
	
	$('#J_minBedRoom_system_chosen').val('');
	$('#J_maxBedRoom_system_chosen').val('');	
	
	$('#J_build').val('');
	$('#J_build').attr("data-id","");

	$('#J_business').val('');
	$('#J_business').attr("data-id","");
}


/*$('#J_reset_system').on('click', function(event) {
	$('#J_sendee').val('');
	$('#J_sendee').attr("data-id","");
	$('#J_deptName').val('');
	$('#J_deptName').attr("data-id","");
	
	$('#J_singlestarttime').val('');
	$('#J_singleendtime').val('');
	$('#J_singlehouseid').val('');
})	*/



$systemmatch_dataTable = $('#J_systemmatch_dataTable');
function search_system(housekind){
	/*
	 * 1 租赁 意向租金 price
	 * 2 买卖 委托价 entrustprice
	 * 为了区分两个列的title
	 * */
	if(housekind==1){
		loadSystemmatchTableData1(housekind);
	}else{
		loadSystemmatchTableData2(housekind);
	}
	$systemmatch_dataTable.bootstrapTable('refresh', {url: basePath + '/custom/common/syshouse'});
}
function loadSystemmatchTableData1(housekind) {
	$systemmatch_dataTable.bootstrapTable('destroy');
	$systemmatch_dataTable.bootstrapTable({
		url: basePath + '/custom/common/syshouse',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o = $('#J_systemmatch_query').serializeObject();			
			//户型
			/*if($('#J_minBedRoom_system').val()!=null || $('#J_maxBedRoom_system').val()!=null){
				o.minBedRoom = $('#J_minBedRoom_system').val();
				o.maxBedRoom = $('#J_maxBedRoom_system').val();
			}
			//房源编号
			if($('#J_houseid_system').val()!=null){
				o.houseid = $('#J_houseid_system').val();
			}
			//价格
			if($('#J_minPrice_system').val()!=null|| $('#J_maxPrice_system').val()!=null){
				o.minPrice=$('#J_minPrice_system').val();
				o.maxPrice=$('#J_maxPrice_system').val();				
			}
			//建筑面积
			if($('#J_minBuildArea_system').val()!=null || $('#J_maxBuildArea_system').val()!=null){
				o.minBuildArea=$('#J_minBuildArea_system').val();
				o.maxBuildArea=$('#J_maxBuildArea_system').val();				
			}*/
			//
			//o.userid = currUserId;
			//o.timestamp = new Date().getTime();			
			o.pagesize = params.limit;
			o.pageindex = params.offset / params.limit+ 1;
			o.housekind=housekind;
			o.conmmunityIds= $('#J_build', $('#J_systemmatch_query')).attr('data-id');
			o.businessIds = $('#J_business', $('#J_systemmatch_query')).attr('data-id');
			var str_houseids = arr_houseids_ath.join(",");
			o.houseids=str_houseids;
			return o;
		},
		responseHandler: function(result) {
			if (result.code == 0 && result.data && result.data.totalcount > 0){
				return { 
					"rows": result.data.list, 
					"total": result.data.totalcount 
				}
			}
			return { 
				"rows": [],
				"total": 0 
			}
		},
		
		/*

       	{field: 'id',title :'序号',checkbox:true, align: 'center',
       		formatter: function(value, row, index){	
  				var html='';
  				html='<input type="hidden" name="blackid" blackid="'+row.blackid+'" data-status="'+row.ispass+'"/>';
  				return html;
  	    	}
       	 
       	},
		*/		
		columns: [
			{
				field: 'id', 
				title: '<input type="checkbox" id="J_system_selectAll"/>',
				checkbox:true,
				align: 'center',
				formatter: function(value, row, index){
					var html='';
					html='<input type="hidden" name="housesid" housesid="'+row.housesid+'" value="'+row.housesid+'" />';
					return html;
				}
			},
		    {
				field: 'housesid', 
				title: '房源编号', 
				align: 'center',
				formatter:function(value, row, index){
					var houseHref = '';
					if(housekind == '1'){
						houseHref = basePath+"/house/main/leasedetail.htm?houseid="+value;
					};
					if(housekind == '2'){
						houseHref = basePath+"/house/main/buydetail.htm?houseid="+value;
					}
					var html = '<a href="'+houseHref+'" target="_black">'+value+'</a>'
						return html;
				}
			},
		    {
				field: 'conmmunityname',
				title: '楼盘名', 
				align: 'center'
			},
		    {
		    	field: 'bedroom', 
		    	title: '户型', 
		    	align: 'center',
		    	formatter: function(value, row, index) {
		    		var html=''
		    		var html = value + '室' + row.livingroom + '厅' + row.toilet + '卫'+row.kitchen+'厨'+row.balcony+'阳';
					return html;
		    	}
		    },
		    {
		    	field: 'buildarea',
		    	title: '建筑面积', 
		    	align: 'center',
		    	formatter: function(value, row, index) {
		    		var html = value + '平方米';
					return html;
		    	}
		    },
		    {
				field: 'entrustprice',
				title: '意向租金<br>(元/月或元/平方米/天)',
				align: 'center'
		    	/*formatter: function(value, row, index) {
		    		var html = value + '万';
					return html;
		    	}*/
		    },
		    {
		    	field: 'heading', 
		    	title: '朝向',
		    	align: 'center'
		    }
		],
        onCheck: function (row) {
        	var checkhouseid=row.housesid;
  			for(var i=0;i<arr_houseids_ath.length;i++){
  			    if(arr_houseids_ath[i]==checkhouseid){
  			    	commonContainer.alert('当前数据已选');
  			    	$('input[value="'+checkhouseid+'"]').siblings('input').attr("checked",false);
  			    }
  			}
        }
	});
}
function loadSystemmatchTableData2(housekind) {
	$systemmatch_dataTable.bootstrapTable('destroy');
	$systemmatch_dataTable.bootstrapTable({
		url: basePath + '/custom/common/syshouse',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 10,
		pageList: [10, 20, 50],
		queryParams: function (params) {
			var o = $('#J_systemmatch_query').serializeObject();			
			//户型
			/*if($('#J_minBedRoom_system').val()!=null || $('#J_maxBedRoom_system').val()!=null){
				o.minBedRoom = $('#J_minBedRoom_system').val();
				o.maxBedRoom = $('#J_maxBedRoom_system').val();
			}
			//房源编号
			if($('#J_houseid_system').val()!=null){
				o.houseid = $('#J_houseid_system').val();
			}
			//价格
			if($('#J_minPrice_system').val()!=null|| $('#J_maxPrice_system').val()!=null){
				o.minPrice=$('#J_minPrice_system').val();
				o.maxPrice=$('#J_maxPrice_system').val();				
			}
			//建筑面积
			if($('#J_minBuildArea_system').val()!=null || $('#J_maxBuildArea_system').val()!=null){
				o.minBuildArea=$('#J_minBuildArea_system').val();
				o.maxBuildArea=$('#J_maxBuildArea_system').val();				
			}*/
			//
			//o.userid = currUserId;
			//o.timestamp = new Date().getTime();
			o.pagesize = params.limit;
			o.pageindex = params.offset / params.limit+ 1;
			o.housekind=housekind;
			o.conmmunityIds= $('#J_build', $('#J_systemmatch_query')).attr('data-id');
			o.businessIds = $('#J_business', $('#J_systemmatch_query')).attr('data-id');

			var str_houseids = arr_houseids_ath.join(",");
			o.houseids=str_houseids;
			
			return o;
		},
		responseHandler: function(result) {
			if (result.code == 0 && result.data && result.data.totalcount > 0){
				return { 
					"rows": result.data.list, 
					"total": result.data.totalcount 
				}
			}
			return { 
				"rows": [],
				"total": 0 
			}
		},
		columns: [
			{
				field: 'id', 
				title: '<input type="checkbox" id="J_system_selectAll"/>',
				checkbox:true,
				align: 'center',
				formatter: function(value, row, index){
					var html='';
					html='<input type="hidden" name="housesid" housesid="'+row.housesid+'" value="'+row.housesid+'" />';
					return html;
				}
			},
		    {field: 'housesid',title: '房源编号',align: 'center',
				formatter:function(value, row, index){
					var houseHref = '';
					if(housekind == '1'){
						houseHref = basePath+"/house/main/leasedetail.htm?houseid="+value;
					};
					if(housekind == '2'){
						houseHref = basePath+"/house/main/buydetail.htm?houseid="+value;
					}
					var html = '<a href="'+houseHref+'" target="_black">'+value+'</a>'
						return html;
				}
			},
		    {field: 'conmmunityname',title: '楼盘名',align: 'center'},
		    {field: 'bedroom',title: '户型',align: 'center',
		    	formatter: function(value, row, index) {
		    		var html=''
		    		var html = value + '室' + row.livingroom + '厅' + row.toilet + '卫'+row.kitchen+'厨'+row.balcony+'阳';
					return html;
		    	}
		    },
		    {field: 'buildarea',title: '建筑面积',align: 'center',
		    	formatter: function(value, row, index) {
		    		var html = value + '平方米';
					return html;
		    	}
		    },
		    {field: 'entrustprice',title: '委托价(万元)',align: 'center'},
		    {field: 'heading',title: '朝向',align: 'center'}
		],
        onCheck: function (row) {
        	var checkhouseid=row.housesid;
  			for(var i=0;i<arr_houseids_ath.length;i++){
  			    if(arr_houseids_ath[i]==checkhouseid){
  			    	commonContainer.alert('当前数据已选');
  			    	$('input[value="'+checkhouseid+'"]').siblings('input').attr("checked",false);
  			    }
  			}
        }
	});
}
/*
 * 系统房源全选和全不选
 * */
/*$systemmatch_dataTable.delegate('#J_systemmatch_dataTable input[name="btSelectAll"]','click',function(event){
	
	if ($(this).prop('checked')){
		$(':checkbox', $systemmatch_dataTable).prop('checked', true);
		checkhouse_system();	//系统推荐
	}else{
		$(':checkbox', $systemmatch_dataTable).prop('checked', false);
	}
})*/
//系统房源
$(document).delegate('#J_systemmatch_dataTable input[name="btSelectAll"]', 'click', function(event){
	if ($(this).prop('checked')){
		$(':checkbox', $systemmatch_dataTable).prop('checked', true);
		checkhouse_system();	//系统推荐
	}else{
		$(':checkbox', $systemmatch_dataTable).prop('checked', false);
	}
	if(!this.checked){
		$('input[name="btSelectAll"]').attr("checked",false);
	}
});

/*
 * 系统房源* 
 */
function checkhouse_system(){
	var sys_ids=[];
	$("#J_systemmatch_dataTable input[name='btSelectItem']:checkbox").each(function(){
		var sys_id_s = $(this).next('input').attr('value');
		sys_ids.push(sys_id_s);
	});
	for(var i=0;i<arr_houseids_ath.length;i++){
		for(var j=0;j<sys_ids.length;j++){
			if(arr_houseids_ath[i]==sys_ids[j]){
				commonContainer.alert('已选的房源，不允许选中');
				$('input[value="'+sys_ids[j]+'"]').siblings('input').attr("checked",false);
				$('#J_systemmatch_dataTable input[name="btSelectAll"]').attr("checked",false);
				continue;
			}
		}
	}
}