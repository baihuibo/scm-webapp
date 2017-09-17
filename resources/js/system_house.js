$favorite_dataTable = $('#J_favorite_dataTable');
$system_dataTable = $('#J_system_dataTable');
function addHouse(businessType) {
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
	  		var guideHouseIds = selectedHouseIds = $('#J_guide_houses').val();
	  		if (selectedHouseIds) selectedHouseIds = selectedHouseIds + ',';
	  		
	  		$('input[name="housesid"]:checked', $system_dataTable).each(function(){
	  			if (guideHouseIds.indexOf($(this).val()) < 0) {
	  				guideFavoriteTr = $(this).parents('tr').clone(); // 拷贝行
		  			guideFavoriteTr.children('td').eq(0).remove(); // 删除行的第一列
		  			guideFavoriteTr.append('<td><a id="J_house_del" data-id="'+$(this).val()+'" class="btn-green btn-bitbucket"><i class="glyphicon glyphicon-remove"></i></a></td>');
		  			$('#J_guide_dataTable tbody').append(guideFavoriteTr);
		  			selectedHouseIds += guideFavoriteTr.children('td').last().find('a').attr('data-id') + ',';
	  			}
	  		}); 
  			$('#J_guide_houses').val(selectedHouseIds.substring(0, selectedHouseIds.length-1));
			layer.close(index);
	  	},
	  	success: function() {
	  		// 清空选中项
	  		$(':checkbox', $system_dataTable).prop('checked', false);
	  		
	  		dimContainer.buildDimChosenSelector($("#J_minBedRoom"), "houseStructure", ""); // 户型1
	  		dimContainer.buildDimChosenSelector($("#J_maxBedRoom"), "houseStructure", ""); // 户型2
	  		searchBuild($("#J_build"), true, 'left'); // 楼盘
	  		searchBusiness($("#J_business"), true, 'right'); // 商圈
	  		
	  		
	  	}
	});
}

$('#J_favorite_query #J_reset').on('click', function(event) {
	$('#J_favorite_query .J_chosen').val('');
	$('#J_favorite_query .J_chosen').trigger('chosen:updated');
})

$('#J_favorite_query #J_search').on('click', function(event) {
	// 加载表格数据
	loadFavoriteTableData(businessType);
})

function loadFavoriteTableData(businessType) {
	$system_dataTable.bootstrapTable('destroy');
	$system_dataTable.bootstrapTable({
		url: basePath + '/custom/common/bookhouse.htm',
		sidePagination: 'server',
		dataType: 'json',
		pagination: true,
		striped: true,
		method:'post',
		pageSize: 5,
		pageList: [5, 20, 50],
		queryParams: function (params) {
			var o = $('#J_favorite_query').serializeObject();
			o.userid = currUserId;
			o.timestamp = new Date().getTime();
			o.pagesize = params.limit;
			o.pageindex = params.offset / params.limit+ 1;
			o.housekind = businessType;
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
		    {field: 'id', title :'序号', checkbox:true, align: 'center',
				formatter: function(value, row, index){	
					var html='';
					html='<input type="hidden" name="housesid" data-housesid="'+row.housesid+'" />';
					return html;
				}
			},
		    {
				field: 'housesid', 
				title: '房源编号', 
				align: 'center',
				formatter:function(value, row, index){
					var houseHref = '';
					if(businessType == '1'){
						houseHref = basePath+"/house/main/leasedetail.htm?houseid="+houseId;
					};
					if(businesstype == '2'){
						houseHref = basePath+"/house/main/buydetail.htm?houseid="+houseId;
					}
					var html = '<a href="'+houseHref+'" target="_black">'+value+'</a>'
						return html;
				}
			},
		    {
				field: 'conmmunityname',
				title: '楼盘', 
				align: 'center'
			},
		    {
		    	field: 'bedroom', 
		    	title: '户型', 
		    	align: 'center',
		    	formatter: function(value, row, index) {
		    		var html = value + '-' + row.livingroom + '-' + row.kitchen + '-' + row.toilet + '-' + row.balcony;
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
		    	title: '委托价',
		    	align: 'center'
		    },
		    {
		    	field: 'heading', 
		    	title: '委托价',
		    	align: 'center'
		    }
		]
	});
}

$system_dataTable.delegate('#J_selectAll','click',function(event){
	if ($(this).prop('checked'))
		$(':checkbox', $system_dataTable).prop('checked', true);
	else
		$(':checkbox', $system_dataTable).prop('checked', false);
})
