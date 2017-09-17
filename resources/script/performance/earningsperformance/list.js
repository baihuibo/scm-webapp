$(function(){
	$("select").chosen({
		width : "100%" , 
		no_results_text: "未找到此选项!" 
	})
	
  /*修改收益业绩管理*/
  $(document).delegate("#edit-perfAjustManage","click",function(event){
		$("#J_sharetypeadd")[0].reset();
		var div = $('#edit_perfAjustManage');
		layer.open({
		  	type: 1,
		  	shift: 5,
	  		title: '修改收益业绩',
		  	area: ['1100px', '400px'],
		  	skin : 'layui-layer-lan',
		  	content: div,
		  	btn : ['确定', '取消'],
	    	yes: function(index, layero) {	 	
		  		
		  		
	  		}		
	  
       })  
  })
	
	
	
})