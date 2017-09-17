/*
 * 外出时间最小是当前时间
 * 预计返回时间最小是外出时间
 * */
 $("#J_singleouttime").focus(function(){
	$("#J_singleestimatetime").val('');
});
function initsingletime(){
	$("#J_singleouttime").val(laydate.now(0, 'YYYY-MM-DD hh:mm'));	//添加空看，外出时间默认设置当前时间
	var singleouttime = {//外出时间
		elem: '#J_singleouttime',  
	    format: 'YYYY-MM-DD hh:mm',
	    istime: true,
	    istoday: false, 
	    min:laydate.now(0, 'YYYY-MM-DD hh:mm'),
	    choose: function(datas){
	    	singleestimatetime.min = datas;
	    	singleestimatetime.start = datas;
	    },
	}
	var singleestimatetime = {//预计返回时间
		elem: '#J_singleestimatetime',  
		format: 'YYYY-MM-DD hh:mm',
		istoday: false, 
	    istime: true,
	    min:laydate.now(0, 'YYYY-MM-DD hh:mm'),
	    choose: function(datas){
	    	/*singleouttime.min=laydate.now(0, 'YYYY-MM-DD hh:mm');*/
	    	if(new Date(datas)<new Date($("#J_singleouttime").val())){
	    		layer.msg('预计返回时间不能早于外出时间');
	    		$("#J_singleestimatetime").val('');
	    	}
	    }
	}
	laydate(singleouttime);
	laydate(singleestimatetime);
}
initsingletime();
/*
 * 添加空看
 */
function singlewatchadd(houseid,housekind){

	commonContainer.modal('添加空看', $('#J_editsinglewatch_layer'), function(index, layero) {
	    var leng = $("#seeListings tbody tr").length;
	    var goouttime=$('#J_singleouttime').val();
	    var expecttime=$('#J_singleestimatetime').val();
	    var filter_numbs = new Array();
	    for(var i=0; i<leng; i++)  
	    {  
	        numberStr = $("#seeListings tbody tr").eq(i).find("td:first").find('a').text();  
	        filter_numbs.push(numberStr);
	    }

	    if(goouttime=="" || expecttime==""){
	    	commonContainer.alert("时间不能为空");
	    }else{
            commonContainer.showLoading();
	    	jsonGetAjax(
					basePath + '/house/singlewatch/insertemptylook',
					{
						houseids: filter_numbs.join(','),
						goouttime: goouttime,
						expecttime: expecttime
					},
					function (result) { 
						layer.msg('添加空看成功！');
						layer.close(index);
						$("#J_search").trigger("click");
                        commonContainer.hideLoading();
					},{});
	    }
	}, 
	{
		overflow :true,
		area : ['85%', '80%'],
		btns : ['确定','关闭'],
		cancel : function(index, layerno) {
			layer.close(index);
			$('input:checkbox').each(function() {
		        $(this).attr('checked', false);
			});
            commonContainer.hideLoading();
		},
		success: function() {
            commonContainer.hideLoading();
			/*
			 * 1 租赁 意向租金
			 * 2 买卖 委托价
			 * 为了区分两个列的title
			 * */

			//alert("添加空看时的housekind："+housekind);
			if(housekind==1){
				setsinglewatchlist1(houseid);
			}else{
				setsinglewatchlist2(houseid);
			}
			$('#J_singlewatch_addHouse').attr("onclick","singlewatch_addHouse("+housekind+")");
			
			/*//时间控件加载
	  		initsingletime();*/
		}
	});
}

function setsinglewatchlist1(houseid){
	$('#J_singleestimatetime').val("");
	jsonGetAjax(
		basePath + '/house/singlewatch/detailsinglewatch',
		{
			houseid: houseid,
			housekind: 1
		},
		function (result) {
			if (result.code == 0 && result.data) {
				var obj = result.data;
				//console.log(obj);
				$('#seeListings').bootstrapTable('destroy');
				$('#seeListings').bootstrapTable({
					data:$.makeArray(obj),
					pagination: false,
					responseHandler: function (result) {
					/*	if (result.code == 0 && result.data && result.data.totalcount > 0) {
							return {"rows": result.data.rows, "total": result.data.totalcount}
						}
						return {"rows": [], "total": 0}*/
					},
					columns:[
   	                         {field: 'houseid', title: '房源编号', align: 'center',
   	  		           		 formatter: function(value, row, index){	
   			           			var html='';
   			           			html='<a target="_blank" href="../../house/main/leasedetail.htm?houseid='+value+'">'+value+'</a>'
   			           			return html;
   			           			}
   	                         },
   	                         {field: 'building', title: '楼盘名', align: 'center'},
   	                         {
   	                        	 field: 'bedroom', title: '户型', align: 'center',
   	                        	/*$('#shape').html(
   	                        	 obj.list[0].bedroom+'-'+ 几室
   	                        	 obj.list[0].livingroom+'-'+几厅
   	                        	 obj.list[0].toilet+'-'+几卫
   	                        	 obj.list[0].kitchen+'-'+几厨
   	                        	 obj.list[0].balcony); 几阳*/
   	                        	formatter: function (value, row, index) {
       	                         	var html="";
       	                         	html=row.bedroom+'室'+row.livingroom+'厅'+row.toilet+'卫'+row.kitchen+'厨'+row.balcony+'阳';
       	                         	return html;
   	                        	}
   	                         },
   	                         {
   	                        	 field: 'buildarea', title: '建筑面积', align: 'center',
   	                        	 formatter: function (value, row, index) {
   	                        		 var html="";
   	                        		 html=obj.buildarea+" 平方米";
   	                        		 return html;
   	                        	 }
   	                         },
   	                         {//1 租赁 意向租金
   	                        	 field: 'entrustprice',
   	                        	 title: '意向租金<br>(元/月或元/平方米/天 )',
   	                        	 align: 'center'
   	                         },
   	                         {field: 'heading', title: '朝向', align: 'center'},
   	                         {
   	                        	 field: 'opt', title: '操作', align: 'center',
   	                        	 formatter: function (value, row, index) {
   	                        		 var html="<a href=\'#\' class=\'J_houseinfo_del\'>删除</a>";
   	                        		 return html;
   	                        	 }   	                        	
   	                         },
					         ]
				});
			}
		});
}
function setsinglewatchlist2(houseid){
	$('#J_singleestimatetime').val("");
	jsonGetAjax(
		basePath + '/house/singlewatch/detailsinglewatch',
		{
			houseid: houseid,
			housekind: 2
		},
		function (result) {
			if (result.code == 0 && result.data) {
				var obj = result.data;
				$('#seeListings').bootstrapTable('destroy');
				$('#seeListings').bootstrapTable({
					data:$.makeArray(obj),
					pagination: false,
					responseHandler: function (result) {
					/*	if (result.code == 0 && result.data && result.data.totalcount > 0) {
							return {"rows": result.data.rows, "total": result.data.totalcount}
						}
						return {"rows": [], "total": 0}*/
					},
					columns:[
   	                         {field: 'houseid', title: '房源编号', align: 'center',
   	   	  		           		 formatter: function(value, row, index){	
   	   			           			var html='';
   	   			           			html='<a target="_blank" href="../../house/main/buydetail.htm?houseid='+value+'">'+value+'</a>'
   	   			           			return html;
   	   			           			}
   	                         },
   	                         {field: 'building', title: '楼盘名', align: 'center'},
   	                         {
   	                        	 field: 'bedroom', title: '户型', align: 'center',
   	                        	formatter: function (value, row, index) {
       	                         	var html="";
       	                         	html=row.bedroom+'室'+row.livingroom+'厅'+row.toilet+'卫'+row.kitchen+'厨'+row.balcony+'阳';
       	                         	return html;
   	                        	}
   	                         },
   	                         {
   	                        	 field: 'buildarea', title: '建筑面积', align: 'center',
   	                        	 formatter: function (value, row, index) {
   	                        		 var html="";
   	                        		 html=obj.buildarea+" 平方米";
   	                        		 return html;
   	                        	 }
   	                         },
   	                         {//2 买卖 委托价
   	                        	 field: 'entrustprice',
   	                        	 title: '委托价(万)',
   	                        	 align: 'center'
   	                        	 /*formatter: function(value, row, index) {
   	                        		 var html = value + '万';
   	                        		 return html;
   	                        	 }*/
   	                         },
   	                         {field: 'heading', title: '朝向', align: 'center'},
   	                         {
   	                        	 field: 'opt', title: '操作', align: 'center',
   	                        	 formatter: function (value, row, index) {
   	                        		 var html="<a href=\'#\' class=\'J_houseinfo_del\'>删除</a>";
   	                        		 return html;
   	                        	 }
   	                        	
   	                         },
					         ]
				});
			}
		});
}



$(document).delegate('.J_houseinfo_del', 'click', function(event){
	var singlewatchListTab=$('#seeListings');
	if(singlewatchListTab.find('tr').length>2){
		$(this).parent().parent().remove();
	}else{
		commonContainer.alert('至少保留一条房源信息');
	}
	return false;
});
