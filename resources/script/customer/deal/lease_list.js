/**
 * 日期控件
 * 
 * @param obj
 * @returns
 */
$(function(){
	// 初始化录入日期
	var begindate = {
		elem: '#J_begindate',  
	    format: 'YYYY-MM-DD',
	    istime: false,
	    choose: function(datas){
	    	enddate.min = datas;
	    	enddate.start = datas
	    }
	}
	
	var enddate = {
		elem: '#J_enddate',  
	    format: 'YYYY-MM-DD',
	    istime: false,
	    choose: function(datas){
	    	begindate.max = datas
	    }
	}
	
	var beginleasedate = {
			elem: '#J_beginleasedate',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	endleasedate.min = datas;
		    	endleasedate.start = datas
		    }
		}
		
		var endleasedate = {
			elem: '#J_endleasedate',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	beginleasedate.max = datas
		    }
		}
	
	laydate(begindate);
	laydate(enddate);
	laydate(beginleasedate);
	laydate(endleasedate);
})

/**
 * 转需求
 * 
 * @param obj
 * @returns
 */
function turndemand(obj) {
	layer.open({
		title : '转需求',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		content : $('#turndemand_layer'),
		area : '400px',
		btn : [ '确定','取消' ],
		yes : function(index, layero) {
			window.location.href="#";
			layer.msg("操作成功");
			layer.close(index);
		},
		cancel : function(index, layerno) {
			
		}
	});
}

/**
 * 转需求复选框判断是否选中状态
 * 
 * @param id
 * @returns
 */
$("#J_turndemand").on("click",function(){
	
	if($("input[name='list']:checked").length==0){
		layer.alert("请选择需要转需求的客源");
		return false;
	}
	
	var validArr = [];
	var validData = {};
	var invalidCount = 0;
	$("input[name='blackid']:checked").each(function(){
		if($(this).attr("data-status") == currStatus){
			invalidCount ++;
		}else{
			validData['blackid'] = $(this).val();
			validData['ispass'] = currStatus;
			validArr.push(validData);
		}
	})
	
	commonContainer.confirm('确认是否需要转需求?',function(index, layero){
		turndemand(this);
	});
})
