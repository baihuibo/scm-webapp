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
	
	var beginbuydate = {
			elem: '#J_beginbuydate',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	endbuydate.min = datas;
		    	endbuydate.start = datas
		    }
		}
		
		var endbuydate = {
			elem: '#J_endbuydate',  
		    format: 'YYYY-MM-DD',
		    istime: false,
		    choose: function(datas){
		    	beginbuydate.max = datas
		    }
		}
	
	laydate(begindate);
	laydate(enddate);
	laydate(beginbuydate);
	laydate(endbuydate);
})