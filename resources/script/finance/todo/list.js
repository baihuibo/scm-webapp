$(function(){
	// 获取收款批次数量
	if(todo_collect_batch) {
		countContainer.getCollectBatchCount($('#J_collectBatchCount'));
	}
	
	// 获取收据回收数量
	if(todo_receipt_return) {
		countContainer.getReceiptReturnCount($('#J_receiptReturnCount'));
	}
	
	// 获取POS查账数量
	if(todo_collect_pos_audit) {
		countContainer.getPosCollectCount($('#J_posCollectCount'));
	}
	
	// 获取出纳查账数量
	if(todo_collect_audit) {
		countContainer.getCollectCount($('#J_collectCount'));
	}
	
	// 获取付款申请数量
	if(todo_payment_apply) {
		countContainer.getPaymentApplyCount($('#J_paymentApplyCount'));
	}
	
	// 获取退款申请数量
	if(todo_refund_apply) {
		countContainer.getRefundApplyCount($('#J_refundApplyCount'));
	}
	
	// 获取转款申请数量
	if(todo_transfer_apply) {
		countContainer.getTransferApplyCount($('#J_transferApplyCount'));
	}
	
	// 获取付款失败数量
	if(todo_payment_payfailed) {
		countContainer.getPayFailedPaymentCount($('#J_payFailedPaymentCount'));
	}
})

window.countContainer = {
	getCollectBatchCount: function($container) {
	    var reqUrl = basePath + '/finance/todo/getCollectBatchCount';
	    jsonGetAjax(reqUrl, {}, function(result) {
	    	$container.html(result.data);
	    	$('#J_totalTodoCount').text(Number($('#J_totalTodoCount').text()) + result.data);
		})
	},
	
	getReceiptReturnCount: function($container) {
	    var reqUrl = basePath + '/finance/todo/getReceiptReturnCount';
	    jsonGetAjax(reqUrl, {}, function(result) {
	    	$container.html(result.data);
	    	$('#J_totalTodoCount').text(Number($('#J_totalTodoCount').text()) + result.data);
		})
	},
	
	getPosCollectCount: function($container) {
	    var reqUrl = basePath + '/finance/todo/getPosCollectCount';
	    jsonGetAjax(reqUrl, {}, function(result) {
	    	$container.html(result.data);
	    	$('#J_totalTodoCount').text(Number($('#J_totalTodoCount').text()) + result.data);
		})
	},
	
	getCollectCount: function($container) {
	    var reqUrl = basePath + '/finance/todo/getCollectCount';
	    jsonGetAjax(reqUrl, {}, function(result) {
	    	$container.html(result.data);
	    	$('#J_totalTodoCount').text(Number($('#J_totalTodoCount').text()) + result.data);
		})
	},
	
	getPaymentApplyCount: function($container) {
	    var reqUrl = basePath + '/finance/todo/getPaymentApplyCount';
	    jsonGetAjax(reqUrl, {'paymentType': 1}, function(result) {
	    	$container.html(result.data);
	    	$('#J_totalTodoCount').text(Number($('#J_totalTodoCount').text()) + result.data);
		})
	},
	
	getRefundApplyCount: function($container) {
	    var reqUrl = basePath + '/finance/todo/getPaymentApplyCount';
	    jsonGetAjax(reqUrl, {'paymentType': 2}, function(result) {
	    	$container.html(result.data);
	    	$('#J_totalTodoCount').text(Number($('#J_totalTodoCount').text()) + result.data);
		})
	},
	
	getTransferApplyCount: function($container) {
	    var reqUrl = basePath + '/finance/todo/getPaymentApplyCount';
	    jsonGetAjax(reqUrl, {'paymentType': 3}, function(result) {
	    	$container.html(result.data);
	    	$('#J_totalTodoCount').text(Number($('#J_totalTodoCount').text()) + result.data);
		})
	},
	
	getPayFailedPaymentCount: function($container) {
	    var reqUrl = basePath + '/finance/todo/getPayFailedPaymentCount';
	    jsonGetAjax(reqUrl, {}, function(result) {
	    	$container.html(result.data);
	    	$('#J_totalTodoCount').text(Number($('#J_totalTodoCount').text()) + result.data);
		})
	},
}