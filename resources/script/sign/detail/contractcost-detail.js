/*
 * 初始化表格
 * 详细使用说明参见http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
 * */

/* 租赁合同列表 start */
/* 收款信息列表 start */
var tableopt = '<a type="close" data-id="" class="btn btn-outline btn-success btn-xs" onclick="">收起</a>&nbsp;&nbsp';
var tablecosttype = '收据<br/><a>SJ0001</a>';
var tablemoneyname = '收款批次<br/><a>PC0001</a>';
var tablecollectionunit = '状态<br/>财务审批';
var tablepayer = '收据打印次数<br/>1';
var tableData = [{
	"receivable" : "4000.00",
	"collectiondate" : "2017-03-10",
	"intransit" : "2000.00",
	"paidin" : "2000.00",
	"refund" : "0",
	"costtype" : "服务费",
	"moneyname" : "佣金收入",
	"collectionunit" : "我爱我家",
	"payer" : "业主",
	"payerunit" : "李四",
	"opt" : tableopt
},{
	"receivable" : "",
	"collectiondate" : "2017-03-10",
	"intransit" : "0",
	"paidin" : "2000.00",
	"refund" : "0",
	"costtype" : tablecosttype,
	"moneyname" : tablemoneyname,
	"collectionunit" : tablecollectionunit,
	"payer" : tablepayer,
	"payerunit" : "",
	"opt" : ""
},{
	"receivable" : "",
	"collectiondate" : "2017-03-10",
	"intransit" : "2000.00",
	"paidin" : "0",
	"refund" : "0",
	"costtype" : tablecosttype,
	"moneyname" : tablemoneyname,
	"collectionunit" : tablecollectionunit,
	"payer" : tablepayer,
	"payerunit" : "",
	"opt" : ""
},{
	"receivable" : "3000.00",
	"collectiondate" : "2017-03-10",
	"intransit" : "0",
	"paidin" : "3000.00",
	"refund" : "0",
	"costtype" : "服务费",
	"moneyname" : "佣金收入",
	"collectionunit" : "我爱我家",
	"payer" : "客户",
	"payerunit" : "赵四",
	"opt" : tableopt
},{
	"receivable" : "",
	"collectiondate" : "2017-03-10",
	"intransit" : "0",
	"paidin" : "3000.00",
	"refund" : "0",
	"costtype" : tablecosttype,
	"moneyname" : tablemoneyname,
	"collectionunit" : tablecollectionunit,
	"payer" : tablepayer,
	"payerunit" : "",
	"opt" : ""
}];

$('#J_dataTable_collection').bootstrapTable({
	data : tableData,
	pagination: false
});
/* 收款信息列表 end */

/* 非佣金收款信息列表 start */
var tablereceipt = '<a>SJ0001</a>';
var tablecollectionlot = '<a>PC0001</a>';

var tableDataNon = [{
	"receipt" : tablereceipt,
	"collectionlot" : tablecollectionlot, 
	"collectiondate" : "2017-03-10",
	"intransit" : "0",
	"paidin" : "6000.00",
	"refund" : "0",
	"moneyname" : "代收房租",
	"collectionunit" : "我爱我家",
	"payer" : "业主",
	"payerunit" : "李四"
},{
	"receipt" : tablereceipt,
	"collectionlot" : tablecollectionlot, 
	"collectiondate" : "2017-03-10",
	"intransit" : "1000.00",
	"paidin" : "0",
	"refund" : "0",
	"moneyname" : "违约金",
	"collectionunit" : "我爱我家",
	"payer" : "客户",
	"payerunit" : "张三"
},{
	"receipt" : tablereceipt,
	"collectionlot" : tablecollectionlot, 
	"collectionate" : "2017-03-10",
	"intransit" : "0",
	"paidin" : "1000.00",
	"refund" : "0",
	"moneyname" : "违约金",
	"collectionunit" : "我爱我家",
	"payer" : "业主",
	"payerunit" : "李四"
}];

$('#J_dataTable_noncollection').bootstrapTable({
	data : tableDataNon,
	pagination: false
});
/* 非佣金收款信息列表 end */

/* 发票信息 start */
var tableinvoicenum = '<a>SP0001</a>';

var tableDataInvoice = [{
	"id" : "1",
	"invoicenum" : tableinvoicenum, 
	"invoicename" : "佣金收入",
	"value" : "2000.00",
	"inputperson" : "tom1",
	"inputdate" : "2017-03-10",
	"status" : "成交"
},{
	"id" : "2",
	"invoicenum" : tableinvoicenum, 
	"invoicename" : "佣金收入",
	"value" : "3000.00",
	"inputperson" : "tom1",
	"inputdate" : "2017-03-10",
	"status" : "成交"
}];

$('#J_dataTable_invoice').bootstrapTable({
	data : tableDataInvoice,
	pagination: false
});
/* 发票信息 end */
/* 付款信息 start */
var tablepaymentorder = '<a>F0001</a>';
var tablepaymentlotorder = '<a>FP0001</a>';

var tableDataPayment = [{
	"id" : "3",
	"costtype" : "付款", 
	"paymentorder" : tablepaymentorder,
	"paymentlotorder" : tablepaymentlotorder,
	"moneyname" : "返信息费",
	"paymentunit" : "我爱我家",
	"payee" : "×××公司",
	"payer" : "小米",
	"pay" : "2000.00",
	"paymentdate" : "2017-03-15",
	"intransit" : "0",
	"paiddate" : "2017-03-15",
	"paid" : "2000.00"
}];

$('#J_dataTable_payment').bootstrapTable({
	data : tableDataPayment,
	pagination: false
});
/* 付款信息 end */
/* 租赁草签合同列表 end */