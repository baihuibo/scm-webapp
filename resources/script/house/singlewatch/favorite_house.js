var $favorite_dataTable = $('#J_favorite_dataTable');
function singlewatch_addHouse(housekind) {
	$favorite_dataTable = $('#J_favorite_dataTable');
	gethouseid();
	var div = $('#J_add_house_dialog');
	layer.open({
	  	type: 1,
	  	shift: 5,
  		title: '选择房源',
	  	area: ['800px', '90%'],
	  	skin : 'layui-layer-lan',
	  	content: div,
	  	btn : ['确定', '取消'],
	  	yes: function(index, layero) {
	  		var guideFavoriteTr=[];
	          //删除之前添加的房源
	          var addHousLength=guideFavoriteTr.length;

	          if(addHousLength>0){              
	              var seeListings=$('#seeListings tbody tr').length;
	              var gtLength=seeListings-addHousLength-1;
	              $('#seeListings tbody tr:gt('+gtLength+')').remove();
	          }
	          //收藏夹
	          $('input[name="btSelectItem"]:checked',$('#J_favorite_dataTable')).each(function(){
	              var houseidContent=$(this).parents('td').next().html();
	              var houseidIndex=houseidContent.indexOf('（');
	              houseidContent=houseidContent.substring(0,houseidIndex);
	              var choosHous='\
					   <tr>'+$(this).parents('tr').html()+'\
						    <td style="text-align: center;"><a href="" class="J_houseinfo_del">删除</a></td>\
					   </tr>';                
	              if($.inArray(choosHous,guideFavoriteTr)==-1){
	                  guideFavoriteTr.push(choosHous);
	              }
	          });
	          //系统房源
	          
	          $('input[name="btSelectItem"]:checked',$('#J_systemmatch_dataTable')).each(function(){
	              var houseidContent=$(this).parents('td').next().html();
	              var houseidIndex=houseidContent.indexOf('（');
	              houseidContent=houseidContent.substring(0,houseidIndex);
	              var choosHous='\
					   <tr>'+$(this).parents('tr').html()+'\
						    <td style="text-align: center;"><a href="" class="J_houseinfo_del">删除</a></td>\
					   </tr>';                
	              if($.inArray(choosHous,guideFavoriteTr)==-1){
	                  guideFavoriteTr.push(choosHous);
	              }
	          });
	          $('#seeListings tbody').append(guideFavoriteTr.join(''));
	          //$('input[name="housesid"]',$('#seeListings tbody')).parents('td').hide();
	          $('input[name="btSelectItem"]',$('#seeListings tbody')).parents('td').remove();
	          layer.close(index);
	  		/*var guideHouseIds="";
	  		var selectedHouseIds="";
	  		var guideHouseIds = selectedHouseIds = $('#J_guide_houses').val();
	  		if (selectedHouseIds) selectedHouseIds = selectedHouseIds + ',';
	  		
	  		$('input[name="housesid"]:checked', $favorite_dataTable).each(function(){
	  			if (guideHouseIds.indexOf($(this).val()) < 0) {
	  				guideFavoriteTr = $(this).parents('tr').clone(); // 拷贝行
		  			guideFavoriteTr.children('td').eq(0).remove(); // 删除行的第一列
		  			guideFavoriteTr.append('<td><a id="J_house_del" data-id="'+$(this).val()+'" class="btn-green btn-bitbucket"><i class="glyphicon glyphicon-remove"></i></a></td>');
		  			$('#J_guide_dataTable tbody').append(guideFavoriteTr);
		  			selectedHouseIds += guideFavoriteTr.children('td').last().find('a').attr('data-id') + ',';
	  			}
	  		}); 
  			$('#J_guide_houses').val(selectedHouseIds.substring(0, selectedHouseIds.length-1));
			layer.close(index);*/
	  	},
	  	success: function() {
	  		//清空选中项
	  		$(':checkbox', $favorite_dataTable).prop('checked', false);
	  		searchBuild($("#J_build"), true, 'left'); 			// 楼盘
	  		searchBusiness($("#J_business"), true, 'right'); 	// 商圈
	  		searchBuild($("#J_build_favorite"), true, 'left'); // 楼盘
	  		searchBusiness($("#J_business_favorite"), true, 'right'); // 商圈
	  		dimContainer.buildDimChosenSelector($("#J_minBedRoom_favorite"), "minBedRoom", "");
	  		dimContainer.buildDimChosenSelector($("#J_maxBedRoom_favorite"), "maxBedRoom", "");
	  		
	  		// 加载表格数据
	  		//	房源类型1租赁2买卖 收藏夹

	  		$('#J_favorite_dataTable').bootstrapTable('destroy');
	  		$('#J_systemmatch_dataTable').bootstrapTable('destroy');
	  		if(housekind==1){
	  			$('.J_favorite_price').html("意向租金：");
	  			$('.J_favorite_unit').html("元/月或元/平方米/天");

	  			$('.J_system_price').html("意向租金：");
	  			$('.J_system_unit').html("元/月或元/平方米/天");
	  			
	  			$('#J_favorite_cprice').html("意向租金<br>(元/月或元/平方米/天)");
	  			$('#J_system_cprice').html("意向租金<br>(元/月或元/平方米/天)");
	  		}else if(housekind==2){
	  			$('.J_favorite_price').html("委托价：");
	  			$('.J_favorite_unit').html("万元");
	  			
	  			$('.J_system_price').html("委托价：");
	  			$('.J_system_unit').html("万元");
	  			
	  			$('#J_favorite_cprice').html("委托价(万元)");
	  			$('#J_system_cprice').html("委托价(万元)");
	  		}
	  		$('#J_search_favorite').attr("onclick","search_favorite("+housekind+")");
	  		$('#J_search_system').attr("onclick","search_system("+housekind+")");
	  		
	  		resetsystem();
	  		resetfavorite();	  			  		
	  	}
	});
}

/*
 * 获取列表中的houseid
 * */
/*
 * 设置一个全局变量，用于存储houseids
 * */
var arr_houseids_ath=[];

function gethouseid(){
	arr_houseids_ath=[];
	$("#seeListings").each(function (){
        var seeListings_length=$('#seeListings tbody tr').length;
        for(var i=1;i<=seeListings_length;i++){
        	var houseids=$("#seeListings").find("tr").eq(i).find("td").eq(0).text();
        	arr_houseids_ath.push(houseids);
        }
        //console.log(arr_houseids_ath);
	});
}

$(function() {
	$("select").chosen({
		width : "100%"
	});
	/*searchBuild($("#J_build_favorite"), true, 'left'); // 楼盘
	searchBusiness($("#J_business_favorite"), true, 'right'); // 商圈
	dimContainer.buildDimChosenSelector($("#J_minBedRoom_favorite"), "minBedRoom", "");
	dimContainer.buildDimChosenSelector($("#J_maxBedRoom_favorite"), "maxBedRoom", "");*/
})

/*jQuery('#J_search_favorite').on('click', function (event) {
});*/
function search_favorite(housekind){
	/*
	 * 1 租赁 意向租金 price
	 * 2 买卖 委托价 entrustprice
	 * 为了区分两个列的title
	 * */
	if(housekind==1){
		loadFavoriteTableData1(housekind);
	}else{
		loadFavoriteTableData2(housekind);
	}
	//loadFavoriteTableData(housekind);
	//$favorite_dataTable.bootstrapTable('destroy');
	$favorite_dataTable.bootstrapTable('refresh', {url: basePath + '/custom/common/bookhouse'});
}


$('#J_favorite_query #J_reset_favorite').on('click', function(event) {
	$('#J_favorite_query .J_chosen').val('');
	$('#J_favorite_query .J_chosen').trigger('chosen:updated');
})

$('#J_reset_favorite').on('click', function(event) {
	resetfavorite();
})

function resetfavorite(){
	$('.J_chosen').val('');
	$('.J_chosen').trigger('chosen:updated');
	
	$('#J_houseid_favorite').val('');
	$('#J_minPrice_favorite').val('');
	$('#J_maxPrice_favorite').val('');
	
	$('#J_minBuildArea_favorite').val('');
	$('#J_maxBuildArea_favorite').val('');
	
	$('#J_minBedRoom_favorite_chosen').val('');
	$('#J_maxBedRoom_favorite_chosen').val('');	
	
	$('#J_build_favorite').val('');
	$('#J_build_favorite').attr("data-id","");

	$('#J_business_favorite').val('');
	$('#J_business_favorite').attr("data-id","");
}

function loadFavoriteTableData1(housekind) {
	$favorite_dataTable.bootstrapTable('destroy');
	$favorite_dataTable.bootstrapTable({
		url: basePath + '/custom/common/bookhouse',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 5,
		pageList: [5, 20, 50],
		queryParams: function (params) {
			var o = $('#J_favorite_query').serializeObject();			
			/*if($('#J_minBedRoom_favorite').val()!=null || $('#J_maxBedRoom_favorite').val()!=null){
				o.minBedRoom = $('#J_minBedRoom_favorite').val();
				o.maxBedRoom = $('#J_maxBedRoom_favorite').val();
			}
			//房源编号
			if($('#J_houseid_favorite').val()!=null){
				o.houseid = $('#J_houseid_favorite').val();
			}
			//价格
			if($('#J_minPrice_favorite').val()!=null|| $('#J_maxPrice_favorite').val()!=null){
				o.minPrice=$('#J_minPrice_favorite').val();
				o.maxPrice=$('#J_maxPrice_favorite').val();				
			}
			//建筑面积
			if($('#J_minBuildArea_favorite').val()!=null || $('#J_maxBuildArea_favorite').val()!=null){
				o.minBuildArea=$('#J_minBuildArea_favorite').val();
				o.maxBuildArea=$('#J_maxBuildArea_favorite').val();				
			}*/
			o.pagesize = params.limit;
			o.pageindex = params.offset / params.limit+ 1;
			o.housekind=housekind;
			o.conmmunityIds = $('#J_build_favorite', $('#J_favorite_query')).attr('data-id');
			o.businessIds = $('#J_business_favorite', $('#J_favorite_query')).attr('data-id');

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
				title: '<input type="checkbox" id="J_favorite_selectAll"/>', 
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
		    {field: 'entrustprice',title: '意向租金<br>(元/月或元/平方米/天)',align: 'center'},
		    {
		    	field: 'heading', 
		    	title: '朝向',
		    	align: 'center'
		    }
		],
        onCheck: function (row) {
	  		/*$(document).delegate('#J_favorite_dataTable input[name="btSelectItem"]', 'click', function(event){
	  		});*/
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


function loadFavoriteTableData2(housekind) {
	$favorite_dataTable.bootstrapTable('destroy');
	$favorite_dataTable.bootstrapTable({
		url: basePath + '/custom/common/bookhouse',
		sidePagination: 'server',
		dataType: 'json',
		method:'post',
		pagination: true,
		striped: true,
		pageSize: 5,
		pageList: [5, 20, 50],
		queryParams: function (params) {
			var o = $('#J_favorite_query').serializeObject();			
			/*if($('#J_minBedRoom_favorite').val()!=null || $('#J_maxBedRoom_favorite').val()!=null){
				o.minBedRoom = $('#J_minBedRoom_favorite').val();
				o.maxBedRoom = $('#J_maxBedRoom_favorite').val();
			}
			//房源编号
			if($('#J_houseid_favorite').val()!=null){
				o.houseid = $('#J_houseid_favorite').val();
			}
			//价格
			if($('#J_minPrice_favorite').val()!=null|| $('#J_maxPrice_favorite').val()!=null){
				o.minPrice=$('#J_minPrice_favorite').val();
				o.maxPrice=$('#J_maxPrice_favorite').val();				
			}
			//建筑面积
			if($('#J_minBuildArea_favorite').val()!=null || $('#J_maxBuildArea_favorite').val()!=null){
				o.minBuildArea=$('#J_minBuildArea_favorite').val();
				o.maxBuildArea=$('#J_maxBuildArea_favorite').val();				
			}*/
			o.pagesize = params.limit;
			o.pageindex = params.offset / params.limit+ 1;
			o.housekind=housekind;
			o.conmmunityIds = $('#J_build_favorite', $('#J_favorite_query')).attr('data-id');
			o.businessIds = $('#J_business_favorite', $('#J_favorite_query')).attr('data-id');

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
				title: '<input type="checkbox" id="J_favorite_selectAll"/>', 
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
		    {field: 'entrustprice',title: '委托价(万元)',align: 'center'},
		    {
		    	field: 'heading', 
		    	title: '朝向',
		    	align: 'center'
		    }
		],
        onCheck: function (row) {
	  		/*$(document).delegate('#J_favorite_dataTable input[name="btSelectItem"]', 'click', function(event){
	  		});*/
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

/*$favorite_dataTable.delegate('#J_favorite_selectAll','click',function(event){
	if ($(this).prop('checked'))
		$(':checkbox', $favorite_dataTable).prop('checked', true);
	else
		$(':checkbox', $favorite_dataTable).prop('checked', false);
})*/

/*
 * 收藏房源全选和全不选
 * */
/*$favorite_dataTable.delegate('#J_favorite_selectAll','click',function(event){
	if ($(this).prop('checked')){
		$(':checkbox', $favorite_dataTable).prop('checked', true);
		checkhouse_favorite();	//收藏房源
	}else{
		$(':checkbox', $favorite_dataTable).prop('checked', false);		
	}
})*/
//收藏房源
$(document).delegate('#J_favorite_dataTable input[name="btSelectAll"]', 'click', function(event){
	if ($(this).prop('checked')){
		$(':checkbox', $favorite_dataTable).prop('checked', true);
		checkhouse_favorite();	//系统推荐
	}else{
		$(':checkbox', $favorite_dataTable).prop('checked', false);
	}
	if(!this.checked){
		$('input[name="btSelectAll"]').attr("checked",false);
	}
});
function checkhouse_favorite(){
	var favo_ids=[];
	$("#J_favorite_dataTable input[name='btSelectItem']:checkbox").each(function(){
		var favo_id_s = $(this).next('input').attr('value');
		favo_ids.push(favo_id_s);
	});	
	
	for(var i=0;i<arr_houseids_ath.length;i++){
		for(var j=0;j<favo_ids.length;j++){
			if(arr_houseids_ath[i]==favo_ids[j]){
				commonContainer.alert('已选的房源，不允许选中');
				$('input[value="'+favo_ids[j]+'"]').siblings('input').attr("checked",false);
				$('#J_favorite_dataTable input[name="btSelectAll"]').attr("checked",false);
				continue;
			}
		}
	}
}