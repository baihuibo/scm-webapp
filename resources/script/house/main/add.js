$(function(){
	/*dimContainer.buildDimRadio($("#type"), "type", "businessType", "");	*/
	$("#J_add_btn").click(function(){
		
		if($("input[name='type']:checked").val()==undefined){
			commonContainer.alert('请选择业务类型');
			return false;
		}else if($("input[name='type']:checked").val()==1){
			window.location.href="../main/leaseadd.htm";
		}else if($("input[name='type']:checked").val()==2){
			window.location.href="../main/buyadd.htm";
		}
	})
})
