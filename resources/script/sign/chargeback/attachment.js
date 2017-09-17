$(function(){
	attachmentView.init();
});
var attachmentView={
	initFalg:true,
	chargebackId:location.search.split('&')[0].split('=')[1],
	init:function(){
		var _this=this;
		//查询单据编号
		jsonGetAjax(basePath+'/sign/chargeback/chargebackCommon.htm',{
			chargebackid:_this.chargebackId
		},function(rdata){
			if(rdata.data.auditstatus=="3"||rdata.data.auditstatus=="8"){
				$("#goFeiyzhixmx").show();
			}	
			$('#signnumber').html('单据编号：'+rdata.data.signnumber);
			$('#strauditstatus').html('审核状态：'+rdata.data.strauditstatus);
			//跳转到退单信息
			$('#goTuidanInfor').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/detail.html?signnumber='+rdata.data.signnumber;
			});
			var urlDate=location.search;
			//跳转到费用处理
			$('#gofeiYongcl').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/cost.html'+urlDate;
			});
			//跳转到补充协议
			$('#goAgreement').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/supplementalagreement.html'+urlDate;
			});
			//跳转到审批流程
			$('#goShenPlc').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/auditprocess.html'+urlDate;
			});
            //跳转到业绩信息
            $('#performance').off().on('click',function(){
                location.href=basePath+'/sign/chargeback/chargeBackToPerformance'+urlDate;
            });
			//跳转到费用执行明细
			$('#goFeiyzhixmx').off().on('click',function(){
				location.href=basePath+'/sign/chargeback/costdetail.html'+urlDate;
			});
			//选择文件
			//审核状态 1.待提交审批2.审核中3.审批通过4.审批不通过5.待提交审批（财务驳回）6.审批通过（风控）7.作废 
			if(rdata.data.auditstatus==1 || rdata.data.auditstatus==5){
				$('#addAttachment').show().off().on('click',function(){
					commonContainer.modal('上传附件',$('#attachmentCon'),function(i){
						_this.saveFile('',i);
					},{
						area:'800px',
//						['600px','300px']
						success:function(){
							_this.popCalbank();
						}
					});
				});
			}
			_this.fileList(rdata.data.auditstatus);
		});
	},
	//附件列表
	fileList:function(auditstatus){
		var _this=this;
		$('#attachmentList').bootstrapTable('destroy').bootstrapTable({
			url:basePath+'/sign/chargeback/chargebackEnclosureList.htm',
			method:'get',
			sidePagination: 'server',
			dataType: 'json',
			pagination: true,
			striped: true,
			cache: false,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams: function (params){
				return{
					chargebackId:_this.chargebackId,
					pageSize:params.limit,
					pageIndex:params.offset / params.limit+ 1
				};
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
					field : 'rownum',
					title : '序号',
					align : 'center'
				},
				{
					field : 'typeValue',
					title : '附件类型',
					align : 'center'
				},
				{
					field : 'createTime',
					title : '最新上传日期',
					align : 'center'
				},
				{
					field : 'createByuserName',
					title : '最新上传人',
					align : 'center'
				},
				{
					field : 'remark',
					title : '备注',
					align : 'center'
				},
				{
					field : '',
					title : '操作',
					align : 'center',
					formatter:function(value,row){
						if(auditstatus==1 || auditstatus==5 ||auditstatus==undefined){
							return '\
								<button type="button" data-enclosureid="'+row.enclosureId+'" class="btn btn-outline btn-success btn-xs mt-3" onclick="attachmentView.operationInfor(this)">修改</button>&nbsp;&nbsp;\
								<button type="button" data-enclosureid="'+row.enclosureId+'" class="btn btn-outline btn-success btn-xs mt-3" onclick="attachmentView.operationInfor(this,1)">查看</button>&nbsp;&nbsp;\
								<button type="button" data-opt="del" data-enclosureid="'+row.enclosureId+'" class="btn btn-outline btn-danger btn-xs" onclick="attachmentView.listDeleteFile(this)">删除</button>';
						}
						return '<button type="button" data-enclosureid="'+row.enclosureId+'" class="btn btn-outline btn-success btn-xs mt-3" onclick="attachmentView.operationInfor(this,1)">查看</button>';
					}
				}
			]
		});
	},
	//文件上传至文件服务器
	upFile:function(){
		var _this=this;
		var upImglock=false;
		//$('#upFile').val('###');
		$('#selectFile').off().on('click',function(){
			$('#upFile').click();
			_this.fileChangeEvt(upImglock);
		});
		_this.fileChangeEvt(upImglock);
	},
	fileChangeEvt:function(lock){
		$('#upFile').off().on('input change',function(){
			var upFileObj=this.files[0];
			//验证上传文件
			//var strIndex=upFileObj.name.lastIndexOf('.')+1;
			//var fileSuffixName=upFileObj.name.substring(strIndex);											//文件后缀
			//var isFileType=/^(jpg|jpeg|png|tif|tiff|bmp|gif)$/.test(fileSuffixName);						//是否符合文件类型
			//是否符合文件类型
			//if(!isFileType){
			//	commonContainer.alert('图片格式为jpg、jpeg、png、tif、tiff、bmp、gif');
			//	return false;
			//}
			//验证上传文件是否大于5MB
			//if(upFileObj.size>5*1024*1024){
			//	commonContainer.alert('图片最大不超过5M');
			//	return false;
			//}
			if(lock){
				return false;
			}else{
				lock=true;
			}
			//var that=this;
			var formData=new FormData();
			formData.append('files',this.files[0]);
			$.ajax({
				url: basePath+'/custom/common/multiFileUpload.htm',
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
			    		//_this.imgList(result.data[0].filepath,content,isProxy,'');
			    		var html='\
			    			<div class="col-md-3" style="padding-top:18px;text-align: center;" data-filename="'+result.data[0].filename+'" data-filepath="'+result.data[0].filepath+'">\
			    				<img src="'+result.data[0].filepath+'" width="80%" height="100">\
			    				<div style="width:80%;margin:0 auto;padding:10px 0 5px;">'+result.data[0].filename+'</div>\
			    				<button type="button" data-opt="del" class="btn btn-outline btn-danger btn-xs" onclick="attachmentView.delteFile(this)">删除</button>\
		    				</div>';
			    		$('#upFileName').append(html);
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
			$('#fileHidden').html('<input type="file" id="upFile">');
		});
	},
	delteFile:function(target){
		$(target).parent().remove();
	},
	//保存附件 type=1修改
	saveFile:function(target,i,type){
		var _this=this;
		//验证必填项
		//附件类型
		var attachmentType=$('#attachmentType').val();
		if(attachmentType==''){
			commonContainer.alert('请选择附件类型');
			return false;
		}
		var upFileLIst=$('#upFileName >div');
		if(upFileLIst.length==0){
			commonContainer.alert('请选择文件');
			return false;
		};
		layer.close(i);
		var enclosureList=[];
		//var upFileListObj={};
		upFileLIst.each(function(i){
//			upFileListObj.fileName=$(this).data('filename');
//			upFileListObj.filePath=$(this).data('filepath');
			
			enclosureList.push({
				fileName:$(this).data('filename'),
				filePath:$(this).data('filepath')
			});
			if(type==1){
				var enclosurePathid=$(this).data('enclosurepathid');
				enclosureList[i].enclosurePathId=(enclosurePathid==undefined?'':enclosurePathid);
			}
		});
		var url='';
		var parms={
			enclosureList:enclosureList,
			remark:$.trim($('#remarks').val()),
			type:attachmentType
		}
		if(type==1){
			parms.enclosureId=$(target).data('enclosureid');
			url='/sign/chargeback/chargebackUpdateEnclosure.htm';
		}else{
			parms.chargebackId=this.chargebackId;
			url='/sign/chargeback/chargebackAddEnclosure.htm';
		}
		jsonPostAjax(basePath+url,parms,function(){
			_this.fileList();
			commonContainer.alert('保存成功');
		});
	},
	//列表删除文件
	listDeleteFile:function(target){
		var _this=this;
		commonContainer.modal('','<div style="padding: 20px;font-size: 14px;">确定删除</div>',function(i){
			layer.close(i);
			jsonGetAjax(basePath+'/sign/chargeback/chargebackDeleEnclosure.html',{
				enclosureId:$(target).data('enclosureid')
			},function(){
				_this.fileList();
				commonContainer.alert('删除成功');
			});
		},{
			btns:['确定','取消'],
			area:'300px'
		});
	},
	//查看附件信息 type=1 查看
	operationInfor:function(target,type){
		var _this=this;
		jsonGetAjax(basePath+'/sign/chargeback/chargebackCheckEnclosure.htm',{
			enclosureId:$(target).data('enclosureid')
		},function(rdata){
			commonContainer.modal(type==1?'查看附件':'修改附件',type==1?$('#seeInfor'):$('#attachmentCon'),function(i){
				if(type==1){
					layer.close(i);
				}else{
					_this.saveFile(target,i,1);
				}
			},{
				btns:type==1?['关闭']:['保存','取消'],
				area:'800px',
				overflow :true,
				success:function(){
					if(type==1){
						$('#fujianConten').html('');
						$('#fujianType').html(rdata.data.typeValue);
						if(rdata.data.enclosureList && rdata.data.enclosureList.length>0){
							var html='';
							$.each(rdata.data.enclosureList,function(i,n){
								html+='\
					    			<div class="col-md-3" style="padding-top:12px;text-align: center;" data-filename="" data-filepath="">\
					    				<img src="'+n.filePath+'" width="80%" height="100">\
					    				<div style="width:80%;margin:0 auto;padding:10px 0 5px;">'+n.fileName+'</div>\
					    				<button type="button" data-opt="del" class="btn btn-outline btn-success btn-xs mt-3" onclick="attachmentView.download(\''+n.filePath+'\')">下载</button>\
				    				</div>';
							});
							$('#fujianConten').html(html);
						}
					}else{
						_this.popCalbank(rdata.data);
					}
				}
			});
		});
	},
	//弹窗成功回调
	popCalbank:function(data){
		var attachmentType='';
		var remarks='';
		var upFileList='';
		if(data){
			attachmentType=data.type.toString();
			if(data.remark!==undefined){
				remarks=data.remark;
			}
			if(data.enclosureList && data.enclosureList.length>0){
				$.each(data.enclosureList,function(i,n){
					upFileList+='\
		    			<div class="col-md-3" style="padding-top:12px;text-align: center;" data-filename="'+n.fileName+'" data-filepath="'+n.filePath+'" data-enclosurePathid="'+n.enclosurePathId+'">\
		    				<img src="'+n.filePath+'" width="80%" height="100">\
		    				<div style="width:80%;margin:0 auto;padding:10px 0 5px;">'+n.fileName+'</div>\
		    				<button type="button" data-opt="del" class="btn btn-outline btn-danger btn-xs" onclick="attachmentView.delteFile(this)">删除</button>\
	    				</div>';
				});
			}
		}
		$('#remarks').val(remarks);
		$('#upFileName').html(upFileList);
		if(this.initFalg){
			//初始select下拉框
			$('select').chosen({
				width:'100%'
			});
			//附件类型
			dimContainer.buildDimChosenSelector($('#attachmentType'),'type',attachmentType);
			this.upFile();
			this.initFalg=false;
		}
		$('#attachmentType').val(attachmentType);
		$('#attachmentType').trigger('chosen:updated');
	},
	//下载文件
	download:function(filePath){
		window.open(basePath+'/sign/downloadEnclosure.htm?filePath='+filePath);
	}
}