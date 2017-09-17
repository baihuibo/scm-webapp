/**
 * Created by lijingru on 2017-06-27.
 */
/**
 * 获取流程图
 * @param {String} conId discountid
 */
//RENT_CHARGEBACK
function getdojobworkflow(conid,contypeid){
	jsonPostAjax(basePath+'/workflow/doJob?modelName='+contypeid+'&methodName=getFlowChartUrlByBusiness',{			
	    "formId":conid
	},function(result){
		var auditstatus=$("#J_detail_auditstatus").text();
		//if(auditstatus!="待提交审批"){//待提交审批状态下，不显示流程图
			if(result.data!=undefined){
				if(contypeid=="LEASE_DISCOUNT"){
					$('#J_srcimg').attr('src',result.data.LEASE_DISCOUNT);
				}else if(contypeid=="BUY_DISCOUNT"){
					$('#J_srcimg').attr('src',result.data.BUY_DISCOUNT);
				}
			}
		//}
	});
}
/*var postData = {
    formId: formId,
    isEnd: isEnd
};
var paramsData = {
    modelName: modelName,
    methodName: labelId
};*/
function getcontractdetail(conId){
	jsonPostAjax(basePath + '/workflow/doJob?'+$.params(paramsData),postData,{
		params: paramsData
	}, function() {
		commonContainer.alert("操作成功");
		//location.reload();
	},{});
}