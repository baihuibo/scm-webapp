var $system_dataTable = null; //$('#J_system_dataTable');
var $favorite_dataTable = null; //$('#J_favorite_dataTable');
var isInit=true;
//var curBusinessType = '';
//businessType: 业务类型
//type:	type==1是反馈时添加房源 
function addHouse(businessType,type) {
//	curBusinessType = businessType;
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
	  		var guideHouseIds = selectedHouseIds = $('#J_guide_houses').val() || '';
	  		if (selectedHouseIds) selectedHouseIds = selectedHouseIds + ',';
	  		var curTab = $('#J_add_house_dialog').find('li[class="active"]');
	  		if(curTab.attr('data-type') == 'system') {
	  			$('input[name="btSelectItem"]:checked', $system_dataTable).each(function(){
		  			if (guideHouseIds.indexOf($(this).val()) < 0) {
		  				var guideFavoriteTr = $(this).parents('tr').clone().removeClass('selected'); // 拷贝行
			  			var curHouseid = guideFavoriteTr.children('td').eq(1).text(); // 获取房源ID
			  			guideFavoriteTr.children('td').eq(0).remove(); // 删除行的第一列
                        var pr = guideFavoriteTr.children('td').eq(4);
                        pr.before('<td>-</td>');// 层数列，补空
                        pr.appendTo(guideFavoriteTr);// 价格列和朝向列换位置
			  			if(type==1){
			  				var html='\
				  				<td style="text-align: center;">\
	  				    			<span class="isevaluate" data-isevaluate="2">-</span>\
						   		</td>\
						   		<td style="text-align: center;">\
						   			<button type="button" data-addhous="1" data-houseid="'+curHouseid+'" class="btn btn-outline btn-success btn-xs mt-3" onclick="tapeManagViseView.creatResultsPop(this)">反馈</button>\
					   			</td>';
			  				guideFavoriteTr.append(html);
			  			}else{
			  				guideFavoriteTr.append('<td><a id="J_house_del" data-id="'+curHouseid+'" class="btn-green btn-bitbucket"><i class="glyphicon glyphicon-remove"></i></a></td>');
			  			}
                        if(type==1){
                        	var table = $('#seeListings');
                            if (!table.find('tbody').length) {
                                table.append('<tbody></tbody>');
                            }
                            table.find('tbody').append(guideFavoriteTr);
			  			}else{
			  				$('#J_guide_dataTable tbody').append(guideFavoriteTr);
			  			}
			  			//$('#J_guide_dataTable tbody').append(guideFavoriteTr);
			  			selectedHouseIds += guideFavoriteTr.children('td').last().find('a').attr('data-id') + ',';
		  			}
		  		}); 
	  		} else {
	  			$('input[name="btSelectItem"]:checked', $favorite_dataTable).each(function(){
		  			if (guideHouseIds.indexOf($(this).val()) < 0) {
		  				var guideFavoriteTr = $(this).parents('tr').clone().removeClass('selected'); // 拷贝行
			  			var curHouseid = guideFavoriteTr.children('td').eq(1).text(); // 获取房源ID
			  			guideFavoriteTr.children('td').eq(0).remove(); // 删除行的第一列
			  			if(type==1){
			  				var html='\
				  				<td style="text-align: center;">\
	  				    			<span class="isevaluate" data-isevaluate="2">-</span>\
						   		</td>\
						   		<td style="text-align: center;">\
						   			<button type="button" data-addhous="1" data-houseid="'+curHouseid+'" class="btn btn-outline btn-success btn-xs mt-3" onclick="tapeManagViseView.creatResultsPop(this)">反馈</button>\
					   			</td>';
			  				guideFavoriteTr.append(html);
			  			}else{
			  				guideFavoriteTr.append('<td><a id="J_house_del" data-id="'+curHouseid+'" class="btn-green btn-bitbucket"><i class="glyphicon glyphicon-remove"></i></a></td>');
			  			}
			  			if(type==1){
			  				$('#seeListings tbody').append(guideFavoriteTr);
			  			}else{
			  				$('#J_guide_dataTable tbody').append(guideFavoriteTr);
			  			}
			  			//$('#J_guide_dataTable tbody').append(guideFavoriteTr);
			  			selectedHouseIds += guideFavoriteTr.children('td').last().find('a').attr('data-id') + ',';
		  			}
		  		}); 
	  		}
	  		
  			$('#J_guide_houses').val(selectedHouseIds.substring(0, selectedHouseIds.length-1));
			layer.close(index);
	  	},
	  	success: function() {
	  		//清空表格内容
	  		$('#J_system_query')[0].reset();
	  		$('#J_favorite_query')[0].reset();
	  		$('.J_chosen').val('');
	  		$('.J_chosen').trigger('chosen:updated');
	  		//businessType:1租金 ，2买卖
	  		if(businessType==1){
	  			$('#J_system_dataTableContent').html(tabTit('J_system_dataTable','意向租金（元/月）'));
		  		$('#J_favorite_dataTableContent').html(tabTit('J_favorite_dataTable','意向租金（元/月）'));
	  		}else if(businessType==2){
	  			$('#J_system_dataTableContent').html(tabTit('J_system_dataTable','委托价（万元）'));
		  		$('#J_favorite_dataTableContent').html(tabTit('J_favorite_dataTable','委托价（万元）'));
	  		}
	  		if(isInit){
	  			// 初始化户型
		  		dimContainer.buildDimChosenSelector($(".J_bedRoom"), "minBedRoom", ""); // 户型
		  		isInit=false;
	  		}
	  		$system_dataTable = $('#J_system_dataTable');
	  		$favorite_dataTable = $('#J_favorite_dataTable');
	  		//$system_dataTable.find('tbody').html('');
	  		//$favorite_dataTable.find('tbody').html('');
	  		// 清空选中项
	  		var curTab = $('#J_add_house_dialog').find('li[class="active"]');
	  		if(curTab.attr('data-type') == 'system') {
		  		$(':checkbox', $system_dataTable).prop('checked', false);
		  		searchBuild($("#J_build", $('#J_system_query')), true, 'left'); // 楼盘
		  		searchBusiness($("#J_business", $('#J_system_query')), true, 'right'); // 商圈
	  		} else {
		  		$(':checkbox', $favorite_dataTable).prop('checked', false);
		  		searchBuild($("#J_build", $('#J_favorite_query')), true, 'left'); // 楼盘
		  		searchBusiness($("#J_business", $('#J_favorite_query')), true, 'right'); // 商圈
	  		}
	  		
	  		if(businessType == '1') {
	  			$('.J_price').text('意向租金：');
	  			$('.J_priceUnit').text('元/月');
	  			$('.J_tablePrice').text('意向租金(元/月)');
	  		}else if(businessType == '2') {
	  			$('.J_price').text('委托价：');
	  			$('.J_priceUnit').text('万元');
	  			$('.J_tablePrice').text('委托价(万元)');
	  		}
	  		
	  		$('#J_favorite_query #J_search').off().on('click', function(event) {
	  			loadFavoriteTableData(businessType,type);
	  		})

	  		$('#J_system_query #J_search').off().on('click', function(event) {
	  			loadSystemTableData(businessType,type);
	  		})
	  	}
	});
}

$('#J_favorite_query #J_reset').off().on('click', function(event) {
	$('#J_favorite_query .J_chosen').val('');
	$('#J_favorite_query .J_chosen').trigger('chosen:updated');
})

$('#J_system_query #J_reset').off().on('click', function(event) {
	$('#J_system_query .J_chosen').val('');
	$('#J_system_query .J_chosen').trigger('chosen:updated');
})

function loadSystemTableData(curBusinessType,type) {
	//获取已有房源id
	var houseidsList=gethasHous(type);
	$system_dataTable.bootstrapTable('destroy');
	$system_dataTable.bootstrapTable({
		url: basePath + '/custom/common/syshouse.htm',
		sidePagination: 'server',
		cache: false,
		dataType: 'json',
		pagination: true,
		striped: true,
		method:'post',
		pageSize: 5,
		pageList: [5, 20, 50],
		clickToSelect:true,
		queryParams: function (params) {
			var o = $('#J_system_query').serializeObject();
			o.timestamp = new Date().getTime();
			o.pagesize = params.limit;
			o.pageindex = params.offset / params.limit+ 1;
			o.housekind = curBusinessType;
			o.conmmunityIds = $('#J_build', $('#J_system_query')).attr('data-id');
			o.businessIds = $('#J_business', $('#J_system_query')).attr('data-id');
			o.houseids=houseidsList;	//已有房源id
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
		    	field: 'houseid', 
		    	title :'序号', 
		    	checkbox:true, 
		    	align: 'center',
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
					if(curBusinessType == '1'){
						houseHref = basePath+"/house/main/leasedetail.htm?houseid="+value;
					};
					if(curBusinessType == '2'){
						houseHref = basePath+"/house/main/buydetail.htm?houseid="+value;
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
		    	title: curBusinessType == '1'?'意向租金（元/月）':'委托价（万元）',
		    	align: 'center'
		    },
		    {
		    	field: 'heading', 
		    	title: '朝向',
		    	align: 'center'
		    }
		]
	});
}

function loadFavoriteTableData(curBusinessType,type) {
	//获取已有房源id
	var houseidsList=gethasHous(type);
	$favorite_dataTable.bootstrapTable('destroy');
	$favorite_dataTable.bootstrapTable({
		url: basePath + '/custom/common/bookhouse.htm',
		sidePagination: 'server',
		cache: false,
		dataType: 'json',
		pagination: true,
		striped: true,
		method:'post',
		pageSize: 5,
		pageList: [5, 20, 50],
		queryParams: function (params) {
			var o = $('#J_favorite_query').serializeObject();
			o.timestamp = new Date().getTime();
			o.pagesize = params.limit;
			o.pageindex = params.offset / params.limit+ 1;
			o.housekind = curBusinessType;
			o.businessIds = $('#J_build', $('#J_favorite_query')).attr('data-id');
			o.conmmunityIds = $('#J_business', $('#J_favorite_query')).attr('data-id');
			o.houseids=houseidsList;	//已有房源id
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
					if(curBusinessType == '1'){
						houseHref = basePath+"/house/main/leasedetail.htm?houseid="+value;
					};
					if(curBusinessType == '2'){
						houseHref = basePath+"/house/main/buydetail.htm?houseid="+value;
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
		    	title: curBusinessType == '1'?'意向租金(元/月)':'委托价（万元）',
		    	align: 'center'
		    },
		    {
		    	field: 'heading', 
		    	title: '朝向',
		    	align: 'center'
		    }
		]
	});
}

//获取已有房源id
function gethasHous(type){
	var houseidsArrr=[];
	if(type==1){
		$('#seeListings button').each(function(){
			var seehouseid=$(this).data('houseid');
		   if(seehouseid){
			   houseidsArrr.push(seehouseid);
		   }
		});
	}else{
		$('#J_guide_dataTable a').each(function(){
			var addhouseid=$(this).data('id');
			if(addhouseid){
				houseidsArrr.push(addhouseid);
			}
		});
	}
	return houseidsArrr.join(',');
}
//表格抬头
function tabTit(id,str){
	return '\
		<table id="'+id+'" class="table table-hover table-striped">\
			<thead>\
				<tr>\
					<th data-field="id"></th>\
					<th data-field="housesid">房源编号</th>\
					<th data-field="conmmunityname">楼盘</th>\
					<th data-field="bedroom">户型</th>\
					<th data-field="buildarea">建筑面积</th>\
					<th data-field="entrustprice J_tablePrice">'+str+'</th>\
					<th data-field="heading">朝向</th>\
				</tr>\
			</thead>\
		</table>';
}