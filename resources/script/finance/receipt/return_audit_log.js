var returnBatchId=getQueryString('returnBatchId');
function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 
$(function(){
	var str;
	jsonGetAjax(
			basePath + '/finance/collect/auditLogList',{
				"sourceId":returnBatchId,
			},function(result){
				$("#J_dataTable tbody").empty();
				for(var i=0;i<result.data.length;i++){
					str+="<tr>"
				 			+'<td>'+(i+1)+'</td>'
					 		+'<td>'+result.data[i].sourceId+'</td>'
					 		+'<td>'+result.data[i].createByName+'</td>'
					 		+'<td>'+result.data[i].createByPositionName+'</td>'
					 		+'<td>'+result.data[i].createTime+'</td>'
					 		+'<td>'+result.data[i].auditOpinion+'</td>'
					 		
					 		if(result.data[i].auditContent ==undefined){
					 			str+='<td>-</td>'
					 		}else{
					 			str+='<td>'+result.data[i].auditContent +'</td>'
					 		}
					 	"</tr>"
				 }
				$("#J_dataTable tbody").append(str);
				
			}
	);
})