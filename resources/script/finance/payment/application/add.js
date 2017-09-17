$(function() {
	$("select").chosen({
		width : "100%"
	});
	
	$('.J_chosen').val('');
	$('.J_chosen').trigger('chosen:updated');
	
	var contractid=getQueryString("contractNo");
	var selectionId=getQueryString("selection");
	
	if(selectionId == "1"){
		$('#J_iboxpay').show();
		$('#J_iboxpay_finance').hide();
		$('#J_annex').hide();
	}else{
		$('#J_iboxpay').hide();
		$('#J_iboxpay_finance').show();
		$('#J_annex').show();
	}
	
	//合同基础数据展示
	jsonGetAjax(
		basePath + '/finance/contract/detail',
		{	
			"contractId": contractid
		},
		function(result) {
			$('#J_Contract').text(result.data.contractInfo.contractNumber?result.data.contractInfo.contractNumber:'-');
			$('#J_typecontract').text(result.data.contractInfo.strBusinessType?result.data.contractInfo.strBusinessType:'-');
			$('#J_houseId').text(result.data.contractInfo.houseId?result.data.contractInfo.houseId:'-');
			$('#J_clientId').text(result.data.contractInfo.clientId?result.data.contractInfo.clientId:'-');
			$('#J_ownerName').text(result.data.contractInfo.ownerName?result.data.contractInfo.ownerName:'-');
			$('#J_clientName').text(result.data.contractInfo.clientName?result.data.contractInfo.clientName:'-');
		}
	);
})

function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 