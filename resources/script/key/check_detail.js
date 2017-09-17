var id = getQueryString("id");
$('#J_checkusername').on('click',function(event){
	if($(this).attr("checkusersid")){
		getUserStaffInfo($(this).attr("checkusersid"));
	}
})
$(function() {
	jsonGetAjax(
		basePath + '/house/keyadmin/checkdetail.htm',
		{
			"id": id
		},
		function(result) {
			console.log(result.data);
			//加载详情页信息数据
			$('#J_phshopname').text(result.data.shopname?result.data.shopname:'-');
			$('#J_keynum').text(result.data.keynum);
			$('#J_waitchangeshopnum').text(result.data.waitchangeshopnum);
			$('#J_memo').text(result.data.memo);
			$('#J_checkusername').text(result.data.checkusername);
			if(result.data.checkusersid){
				$('#J_checkusername').attr({"checkusersid":result.data.checkusersid});
			}
			
				
				
			$('#J_inshopnum').text(result.data.inshopnum);
			$('#J_strtype').text(result.data.strtype);
			$('#J_lendnum').text(result.data.lendnum);
			console.log(result.data);
			if (result.data.keytracktrace.length > 0){
				$('#J_dataTable').bootstrapTable({
					data: result.data.keytracktrace,
					columns: [
							    {field: 'houseid', title: '房源编号', align: 'center',
							    	formatter:function(value,row,index){
							 			var html = '';
							 			if(row.infotype==1){
							 				html ='<a target="_blank" href="../main/leasedetail.htm?houseid='+row.houseid+'">'+row.houseid+'</a>';
							 			}else{
							 				html ='<a target="_blank" href="../main/buydetail.htm?houseid='+row.houseid+'">'+row.houseid+'</a>';
							 			}
							 			return html;
							 		}
							    },
							    {field: 'keycode', title: '钥匙编号', align: 'center'},
							    {field: 'strinfotype', title: '业务类型', align: 'center'},
							    {field: 'groupkeynum', title: '钥匙数量', align: 'center', formatter: function(value, row, index) {								
									var html='';
									html=value +'套'+'('+row.keynum+'把/套)';
									return html;
							    }},
							    
							    {field: 'lendusername', title: '借钥匙人<br>借钥匙人电话', align: 'center', 
								    formatter: function(value ,row, index){
					      	    		var html='';
					      	    		var lendusertel =row.lendusertel ? row.lendusertel:'-';
					      	    		var lendusername =row.lendusername ? row.lendusername:'-';
					      	    		if(row.lendusername){
					      	    			html='<a onclick="getUserStaffInfo('+row.lenduserid+')">'+lendusername+'</a>'+'</br>'+lendusertel;
					      	    		}else{
					      	    			html='-'+'<br>'+lendusername;
					      	    		}
					      	    		
					      	    		return html;
						      	    }
							    },
							    {field: 'lenddate', title: '借用时间', align: 'center',
							    	formatter: function(value, row, index) {
								    	var html=row.lenddate ? row.lenddate :'-';
							    		return html;
							    	}
							    },
							    {field: 'strstatus', title: '钥匙状态', align: 'center'},
							   // {field: 'checktracememo', title: '备注', align: 'center'}
							    {field: 'opt', title: '备注', formatter: function(value, row, index) {
							    	var html = '';
							    	var checktracememo = row.checktracememo ? row.checktracememo : '-'
							    	html+='<div class="remark_twolines">'+checktracememo+'</div>'
						    		return html;
							    }},
							]
				});
			}
		}
	);
});

function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}
