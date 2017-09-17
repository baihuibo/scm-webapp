// 初始化待处理数量
$(function() {	
	jsonAjax(
		basePath + '/house/keyadmin/pendingcount.htm',
		{
			userid: 20
		},
		function(result) {
			$("#J_waitkeycount").text('('+result.data.pendingcount+')');
		}
	);
	
	
})