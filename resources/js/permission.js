function findPermission(key){
	var url = basePath + "/custom/common/checkPermission?key="+encodeURIComponent(key);
	$.ajax({
		url : url,
		data : {},
		type : 'get',
		dataType : 'json',
		cache : false,
		success : function(result) {
			if (result.code == '0') {
				if(result.data){
					
				}else{
					commonContainer.alert("您没有访问权限，将返回首页",noPermissionLocationToDefualt);
				}
			}
		}
	});
	
	
	
}
function noPermissionLocationToDefualt(){
	var url = basePath ='/../../base/system/front.htm';
	location.href=url;
}