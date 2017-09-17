//付款确认
$(function(){
	confirmPayView.init();
});
var confirmPayView={
	init:function(){
		//初始select下拉框
		$('select').chosen({
			width:'100%'
		});
		//付款导表类型
		dimContainer.buildDimChosenSelector($('#guidetableType'),'paymentBatchType','');
		//付款批次状态
		dimContainer.buildDimChosenSelector($('#batchStatus'),'paymentBatchStatus','');
		//创建查询日期
		this.queryDate();
		//导入付款结果
		this.payImport();
		//点击查询
		$('#payQueryBtn').off().on('click',this.queryResList);
	},
	//查询日期
	queryDate:function(){
		var seeBeginDate={
			elem:'#paymentstarttime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	seeEndDate.min=datas;
		    	seeEndDate.start=datas;
		    }
		};
		var seeEndDate={
			elem:'#paymentendtime',
		    format:'YYYY-MM-DD',
		    istime:false,
		    choose:function(datas){
		    	seeBeginDate.max=datas;
		    }
	    }
		laydate(seeBeginDate);
		laydate(seeEndDate);
	},
	//查询结果列表
	queryResList:function(){
		$('#paymentList').bootstrapTable('destroy').bootstrapTable({
			url:basePath+'/finance/payment/selectNonCashConfirmList.htm',
			method:'post',
			sidePagination:'server',
			dataType:'json',
			pagination: true,
			striped:true,
			pageSize:10,
			pageList:[10, 20, 50],
			queryParams: function (params) {
				var data=$('#queryCriteria').serializeObject();
				data.pagesize = params.limit;
				data.pageindex = params.offset / params.limit+ 1;
				return data;
			},
			responseHandler: function(result) {
				if (result.code == 0 && result.data && result.data.totalcount> 0){
					return {
						'rows': result.data.list, 
						'total': result.data.totalcount
					}
				}
				return {
					'rows': [],
					'total': 0
				}	
			},
			columns:[
	         	{
	         		field: 'batchNumber',
			    	title :'付款批次',
			    	align:'center',
					formatter:function(value,row){
						return '<a href="javascript:;" data-batchid="'+row.batchId+'" onclick="confirmPayView.seePayForm(this)">'+value+'</a>';
					}
	         	},
				{
					field : 'strType',
					title : '付款导表类型',
					align : 'center'
				},
				{
					field : 'downloadTime',
					title : '导表日期',
					align : 'center'
				},
				{
					field : 'strDownloadBy',
					title : '导表人',
					align : 'center'
				},
				{
					field : 'payCount',
					title : '付款总笔数',
					align : 'center'
				},
				{
					field : 'payAmount',
					title : '付款总金额',
					align : 'center'
				},
				{
					field : 'strStatus',
					title : '付款批次状态',
					align : 'center'
				},
				{
					field : 'payFailedCount',
					title : '付款失败笔数',
					align : 'center'
				},
				{
					field : 'payFailedAmount',
					title : '付款失败金额',
					align : 'center'
				},
				{
					field : 'uploadTime',
					title : '回导时间',
					align : 'center'
				},
				{
					field : '',
					title : '操作',
					align : 'center',
					formatter:function(value,row){
						//付款批次状态status：1，成功；2，付款部分成功 3，付款失败；4，付款确认中；
						return ((row.status==4 && $('#quanXian').length>0)?'<button type="button" class="btn btn-outline btn-success btn-xs mt-3" data-batchid="'+row.batchId+'" onclick="confirmPayView.exportPay(this)">导出</button>':'-');
					}
				}
			]
		});
	},
	//查看付款申请单
	seePayForm:function(target){
		var _this=this;
		commonContainer.modal('付款申请单列表',$('#seePaydan'),function(i){
		},{
			btns:[],
			area:'80%',
			success:function(){
				$('#seePaydan form')[0].reset();
				var tabHtml='\
					<table id="seePayList" class="table table-hover table-striped table-bordered">\
						<thead>\
							<tr>\
								<th data-field="">\
									<div class="th-inner">序号</div>\
								</th>\
								<th data-field="">\
									<div class="th-inner">付款单编号</div>\
								</th>\
								<th data-field="">\
									<div class="th-inner">付款导表类型</div>\
								</th>\
								<th data-field="">\
									<div class="th-inner">应付款日期</div>\
								</th>\
								<th data-field="">\
									<div class="th-inner">合同编号</div>\
								</th>\
								<th data-field="">\
									<div class="th-inner">付款方式</div>\
								</th>\
								<th data-field="">\
									<div class="th-inner">收款人</div>\
								</th>\
								<th data-field="">\
									<div class="th-inner">金额</div>\
								</th>\
							</tr>\
						</thead>\
					</table>';
				$('#tabCont').html(tabHtml);
				//if(_this.isInit==undefined){
					$('#seePaydanBtn').off().on('click',_this.seePayFormList.bind(this,target));
					//_this.isInit=true;
				//}
			}
		});
	},
	//查看付款申请单列表
	seePayFormList:function(target){
		$('#seePayList').bootstrapTable('destroy').bootstrapTable({
			url:basePath+'/finance/payment/selectNonCashPaymentList.htm',
			method:'post',
			sidePagination:'server',
			dataType:'json',
			pagination: true,
			striped:true,
			pageSize:10,
			pageList:[10, 20, 50],
			queryParams: function (params) {
				var data=$('#seePayquery').serializeObject();
				data.batchId=$(target).data('batchid');
				data.pagesize = params.limit;
				data.pageindex = params.offset / params.limit+ 1;
				return data;
			},
			responseHandler: function(result) {
				if (result.code == 0 && result.data && result.data.totalcount> 0){
					return {
						'rows': result.data.list, 
						'total': result.data.totalcount
					}
				}
				return {
					'rows': [],
					'total': 0
				}	
			},		
			columns:[
	         	{
	         		field: '',
			    	title :'序号',
			    	align:'center',
			    	formatter:function(value,row,index){
						return ++index;
					}
	         	},
				{
					field : 'paymentNumber',
					title : '付款单编号',
					align : 'center',
					formatter:function(value,row){
						return '<a href="'+basePath+'/finance/payment/detail.htm?paymentId='+row.paymentId+'" target="_blank">'+value+'</a>';
					}
				},
				{
					field : 'strType',
					title : '付款导表类型',
					align : 'center'
				},
				{
					field : 'payTime',
					title : '应付款日期',
					align : 'center'
				},
				{
					field : 'contractNumber',
					title : '合同编号',
					align : 'center'
				},
				{
					field : 'strPayType',
					title : '付款方式',
					align : 'center'
				},
				{
					field : 'receiverName',
					title : '收款人',
					align : 'center'
				},
				{
					field : 'payAmount',
					title : '金额',
					align : 'center'
				}
			]
		});
	},
	//付款结果导入
	payImport:function(){
		var _this=this;
		var upImglock=false;
		//$('#upFile').val('###');
		$('#importResu').off().on('click',function(){
			$('#upFile').click();
			_this.fileChangeEvt(upImglock);
		});
		_this.fileChangeEvt(upImglock);
	},
	fileChangeEvt:function(lock){
		var _this=this;
		$('#upFile').off().on('input change',function(){
			var upFileObj=this.files[0];
			//验证上传文件
			var strIndex=upFileObj.name.lastIndexOf('.')+1;
			var fileSuffixName=upFileObj.name.substring(strIndex);											//文件后缀
			var isFileType=/^xls$/.test(fileSuffixName);						//是否符合文件类型
			//是否符合文件类型
			if(!isFileType){
				commonContainer.alert('请选择xls文件');
				return false;
			}
			//验证上传文件是否大于5MB
			if(upFileObj.size>5*1024*1024){
				commonContainer.alert('图片最大不超过5M');
				return false;
			}
			if(lock){
				return false;
			}else{
				lock=true;
			}
			//var that=this;
			var formData=new FormData();
			formData.append('file',this.files[0]);
			$.ajax({
				url: basePath+'/finance/payment/resultImport.htm',
			    type: 'POST',
			    async:true,
			    cache: false,
			    data: formData,
			    processData: false,
			    contentType: false,
			    dataType:'json',
			    success:function(result){
			    	lock=false;
			    	if(result.code==0){
			    		_this.queryResList();
			    		//_this.imgList(result.data[0].filepath,content,isProxy,'');
//			    		var html='\
//			    			<div class="col-md-3" style="padding-top:18px;text-align: center;" data-filename="'+result.data[0].filename+'" data-filepath="'+result.data[0].filepath+'">\
//			    				<img src="'+result.data[0].filepath+'" width="80%" height="100">\
//			    				<div style="width:80%;margin:0 auto;padding:10px 0 5px;">'+result.data[0].filename+'</div>\
//			    				<button type="button" data-opt="del" class="btn btn-outline btn-danger btn-xs" onclick="attachmentView.delteFile(this)">删除</button>\
//		    				</div>';
//			    		$('#upFileName').append(html);
			    	}else{
			    		commonContainer.alert(result.msg);
			    	}
			    },
			    error:function(){
			    	lock=false;
			    	layer.alert(errorMsg);
		    	}
			});
			//重置上传文件控件
			$('#fileHidden').html('<input type="file" accept="application/vnd.ms-excel" id="upFile">');
		});
	},
	//付款单导出
	exportPay:function(target){
		window.open(basePath+'/finance/payment/noCashExport.htm?batchId='+$(target).data('batchid'));
	}
}