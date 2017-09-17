$(function(){
	commconapplyView.init();
});
var commconapplyView={
	userId:'',
	fileList:null,
	submitLock:false,
	init:function(){
		$('select').chosen({
			width:'100%'
		});
		//获取当前用户信息
		this.getUser();
		//模板下载
		$('#temDownload').off().on('click',function(){
			window.open(basePath+'/finance/commoncontract/download.htm');
		});
		//文件上传
		this.upFile();
		//提交
		$('#submitBtn').off().on('click',this.submit.bind(this));
		//取消
		$('#cancelBtn').off().on('click',function(){
			location.reload();
		});
	},
	//获取当前用户信息
	getUser:function(){
		var _this=this;
		jsonGetAjax(basePath+'/finance/commoncontract/getCurrentUser.htm',{},function(result){
			_this.userId=result.data.userId;
			$('#userName').html(result.data.userName);
		});
	},
	//提交
	submit:function(){
		//提交前验证
		var payment=$('#payment').val();
		if(payment===''){
			commonContainer.alert('请选择付款款项');
			return false;
		}
		if(this.fileList==null){
			commonContainer.alert('请上传文件');
			return false;
		}
		//验证备注
		var remarksVal=$('#remarks').val();
		if(remarksVal==''){
			commonContainer.alert('请填写付款原因');
			return false;
		}
		if(this.submitLock){
			return false;
		}else{
			this.submitLock=true;
		}
		jsonPostAjax(basePath+'/finance/commoncontract/applysubmit.htm',{
			fundCode:payment,					//付款款项
			list:this.fileList,					//上传数据
			remark:remarksVal,					//付款原因
			userId:this.userId					//用户id
		},function(){
			//commonContainer.alert('保存成功');
			layer.msg('保存成功',{time:300}, function(){
				location.reload();
			});
		},{
			completeCallBack:function(){
				commconapplyView.submitLock=false;
			}
		});
	},
	//文件上传
	upFile:function(){
		var _this=this;
		var upImglock=false;
		$('#selectFile').off().on('click',function(){
			$('#upFile').click();
			_this.fileChangeEvt(upImglock);
		});
		_this.fileChangeEvt(upImglock);
	},
	fileChangeEvt:function(lock){
		var _this=this;
		$('#upFile').off().on('input change',function(){
			$('#attachmentList').bootstrapTable('destroy');
			var upFileObj=this.files[0];
			//验证上传文件
			var strIndex=upFileObj.name.lastIndexOf('.')+1;
			var fileSuffixName=upFileObj.name.substring(strIndex);											//文件后缀
			var isFileType=/^xls$/.test(fileSuffixName);													//是否符合文件类型
			//是否符合文件类型
			if(!isFileType){
				commonContainer.alert('上传文件格式为xls');
				return false;
			}
			//验证上传文件是否大于5MB
			if(upFileObj.size>5*1024*1024){
				commonContainer.alert('上传文件最大不超过5M');
				return false;
			}
			if(lock){
				return false;
			}else{
				lock=true;
			}
			//var that=this;
			var formData=new FormData();
			formData.append('file',upFileObj);
			$.ajax({
				url: basePath+'/finance/commoncontract/upload.htm',
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
			    		_this.fileList=result.data.list;
			    		if(result.data && result.data.list){
			    			$('#attachmentList').bootstrapTable({
								data:result.data.list,
								columns:[
									{
										field : 'r',
										title : '序号',
										align : 'center'
									},
									{
										field : 'contractCode',
										title : '合同号',
										align : 'center'
									},
									{
										field : 'fundName',
										title : '付款款项',
										align : 'center'
									},
									{
										field : 'strpayType',
										title : '付款方式',
										align : 'center'
									},
									{
										field : 'realpayAmount',
										title : '付款金额',
										align : 'center'
									},
									{
										field : 'strreceiverType',
										title : '收款人类型',
										align : 'center'
									},
									{
										field : 'receiveName',
										title : '收款人',
										align : 'center'
									},
									{
										field : 'strreceiverCardType',
										title : '收款人证件类型',
										align : 'center'
									},
									{
										field : 'receiverCardNumber',
										title : '证件号码',
										align : 'center'
									},
									{
										field : 'accountHolder',
										title : '开户人',
										align : 'center'
									},
									{
										field : 'straccountHolderCardType',
										title : '开户人证件类型',
										align : 'center'
									},
									{
										field : 'accountHolderCardNumber',
										title : '开户人证件编号',
										align : 'center'
									},
									{
										field : 'strbankAccountKind',
										title : '账号类型',
										align : 'center'
									},
									{
										field : 'bankBranchName',
										title : '银行支行名称<br /><span style="color:#ff0000">必须准确填写</span>',
										align : 'center'
									},
									{
										field : 'openBank',
										title : '开户行',
										align : 'center'
									},
									{
										field : 'lineNumber',
										title : '联行号',
										align : 'center'
									},
									{
										field : 'bankAccount',
										title : '账号',
										align : 'center'
									}
								]
							});
			    			//$.each(result.data.list,function(){});
			    		}
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
			$('#fileHidden').html('<input type="file" accept="*/xls" id="upFile">');
		});
	}
}