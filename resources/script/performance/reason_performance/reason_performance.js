$(function(){
	$("select").chosen({
		width : "100%" , 
		no_results_text: "未找到此选项!" 
	})
	$.ajax({
			url : basePath + '/perf/authorize/getUserInfo',
			type : 'get',
			dataType : 'json',
			cache : true,
			success : function(result) {
				//var keyId = $("h5").attr("keyId");
				companyId = result.data;
				$("#perfType").find("option:not(:first-child)").remove();
				dimContainer1.buildDimChosenSelector1($("#perfType"), companyId,"1");
			}
		});
	
	jQuery('#J_search').on('click', function(event){
		
		$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/perf/reason/getPerfReason' });
	});
	//var concealType;
	function initListLoad(){
		$('#J_dataTable').bootstrapTable({
			url:basePath + '/perf/reason/getPerfReason',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				var o = jQuery('#J_reasonform').serializeObject();
				o.timestamp = new Date().getTime();
				o.currPage = params.offset / params.limit+ 1,
				o.pageSize = params.limit;
				if(o.starttime) {o.starttime = encodeURI(o.starttime);}
				if(o.endtime) {o.endtime = encodeURI(o.endtime);}
				return o;
			},
			responseHandler: function(result) {
				if(result.code == 0 && result.data && result.data.totalcount > 0) {
					return { "rows": result.data.rows, "total": result.data.totalcount }
				}
				return { "rows": [], "total": 0 } 
			},
			columns:[
			         {field:'perfReason1Id',title:'序号',align:'center',
			        	 formatter : function(value, row, index) {
								return index + 1;
							}	
			      	    },
			      	    
		      	    {field: 'valueName', title: '业绩类型', align: 'center',
		      	    	formatter:function(value, row, index){
		      	    		return '<div class="perfType" type="'+row.perfType+'" data-id="'+row.perfReasonId+'">'+value+'</div>'
						}
		      	    },
		      	    {field: 'levelOneReason', title: '一级原因', align: 'center',
		      	    	formatter:function(value){
							return '<div style="text-align:left;max-width:500px;" class="remark_all">'+value+'</div>';
						}
		      	    },
		      	    {field: 'levelTwoReason', title: '二级原因', align: 'center',
		      	    	formatter:function(value, row, index){
		      	    		if(row.levelTwoReason==undefined){
		      		   	    	return '<div style="text-align:left;max-width:500px;"class="remark_all"></div>';
		      		   	  	  }else{
		      		   	    	return '<div style="text-align:left;max-width:500px;" class="remark_all">'+value+'</div>';
		      		   	  	  }
		      	    	}
		      	    },
		      	   
			      	{field: 'opt', title: '操作', align: 'left',
		      	    	formatter: function(value, row, index){	
		      				var html='';
		      				html='<a type=\"amend\" data-id="'+row.reasonId+'" data-pertype='+row.pertypeId+' data-gradeLevel='+row.gradeLevelId+' class="J_shreinfo_modify btn btn-success btn-xs">修改</a>&nbsp;&nbsp;<a type=\"del\"  class="delete-btn btn btn-outline btn-danger btn-xs">删除</a>';
		      				return html;
		      	    	}
			      	  },
		      	],
		})

	}
	
  /*一级原因模态框*/
  $(document).delegate("#add-onereason","click",function(event){
	  $(".J_reason_save").remove();
	 // var tr = $('#J_dataTable').find('tr');
	  $("#J_perfType").val($("#perfType option:selected").text());
	  $("#J_levelOneReason").val('')
	  $("#J_levelTwoReason").val('');
		var div = $('#primarycause');
		layer.open({
		  	type: 1,
		  	shift: 5,
	  		title: '房源录入人业绩原因添加',
		  	area: ['1000px', '300px'],
		  	skin : 'layui-layer-lan',
		  	content: div,
		  	btn : ['确定', '取消'],
	    	yes: function(index, layero) {	
	    	  var perfType =$("#perfType").val();
	   	  	  var levelOneReason =$("#J_levelOneReason").val()
	   	  	  var levelTwoReason =$("#J_levelTwoReason").val();
	   	  	  if(levelOneReason==""){
	   	  		commonContainer.alert("请输入一级原因");
	   	    	return false;
	   	  	  }
	    		jsonPostAjax(
	      				basePath + '/perf/reason/insertReason',
	      				{
	      					'perfType':perfType,
	      					'levelOneReason':levelOneReason,
	      					'levelTwoReason':levelTwoReason,
	      				},
	      				function(result){
	      					if(result.code==0){
	      						layer.msg("操作成功"); 
		      					jQuery('#J_dataTable').bootstrapTable('refresh');
		      					layer.close(index);
	      					}
	      				     	
	      					
	      				}
	      			)
	    		
	  		}		
	  
       })  
  })
  /*
   * 修改
   * */
  $(document).delegate(".J_shreinfo_modify","click",function(event){
	  var div = $('#primarycause');
	  $(".J_reason_save1").remove();
	  var tr = $(this).parent().parent();
	  var perfReasonId =$("#J_perfReasonId").val(tr.find("td").eq(1).find("div.perfType").attr("data-id"))
	  var perfType =$("#J_perfType").val(tr.find("td").eq(1).text());
	  var levelOneReason =$("#J_levelOneReason").val(tr.find("td").eq(2).text())
	  var levelTwoReason =$("#J_levelTwoReason").val(tr.find("td").eq(3).text())
		layer.open({
		  	type: 1,
		  	shift: 5,
	  		title: '房源录入人业绩原因修改',
		  	area: ['1000px', '300px'],
			skin : 'layui-layer-lan',
			content: div,
		  	btn : ['确定', '取消'],
	    	yes: function(index, layero) {
	    		 var perfReasonId =$("#J_perfReasonId").val()
	    		  var perfType =$("#perfType").val();
	    		  var levelOneReason =$("#J_levelOneReason").val()
	    		  var levelTwoReason =$("#J_levelTwoReason").val();
	    		  if(levelOneReason==""){
	  	   	  		commonContainer.alert("请输入一级原因");
	  	   	    	return false;
	  	   	  	  }
	    		jsonPostAjax(
	    				basePath + '/perf/reason/updateReason',
	    				{
	    					'perfReasonId':perfReasonId,
	    					'levelOneReason':levelOneReason,
	    					'levelTwoReason':levelTwoReason,
	    					'perfType':perfType
	    				},
	    				function(result){
	    					if(result.code==0){
	    					//layer.msg("修改成功");
	    					layer.msg("修改成功");
	    					 //$(".layui-layer").hide();
	    	  				 //$(".layui-layer-shade").hide();
	    					jQuery('#J_dataTable').bootstrapTable('refresh');
	    					layer.close(index);
	    					}
	    				}
	    			)
	    					
	  		}		
	  
     })  
})

  //删除
  $(document).delegate('.delete-btn', 'click', function(event){
 	    var tr=  $(this).parent().parent();
 	    var perfReasonId =tr.find("td").eq(1).find("div.perfType").attr("data-id")
 		if(this.type=='del'){
 			commonContainer.confirm(
 				'是否确认删除此条数据？',
 				function(index, layero){
 					 jsonPostAjax(
 						basePath + '/perf/reason/delectReason',
 						{"perfReasonId" : perfReasonId},
 						function(){
 							layer.msg("删除成功");
 							tr.remove();
 							jQuery('#J_dataTable').bootstrapTable('refresh');
 							if($("#J_dataTable tbody tr").length<1){	
 								$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/perf/reason/getPerfReason' });
 							}
 						}
 					)
 				}
 			);
 		} 
  
  })
  
  window.dimContainer1 = {
			getDimReqUrl: function() {
				return basePath + '/perf/reason/findPerfType';
			},
			buildDimChosenSelector1: function($container, compId, selectedValues) {//selectedValues默认选中值
				// 初始化chosen控件
				commonContainer.initChosen($container);

				var that = this;
			    var options = [];
			    jsonPostAjax(that.getDimReqUrl(), {'compId':compId}, function(result) {
		    		$.each(result.data, function(n, value) {
		    			if(value!=null){
		    				options.push('<option value="' + value.valueCode + '">' + value.valueName + '</option>');
		    			}    	    	  
		    	    })
		    	    $container.append(options);

		    		var selectedValueArr = selectedValues.split(',');
		    		$container.val(selectedValueArr);
		    		$container.trigger("chosen:updated");
		    		initListLoad();
				})
			},
		}
  
  

})