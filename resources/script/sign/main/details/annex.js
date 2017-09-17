 var conid=getQueryString("conId"); 
 var docbizkey=getQueryString("docbizkey"); 
 var userType=getQueryString('userType');
 if (docbizkey) {
     var idx = docbizkey.indexOf('-');
     formId = docbizkey.substr(idx + 1);
     conid=formId;
 }
 var isEnclosure;
$(function(){
	 upImgFile_out();
	 $("select:not([ng-model],[chosen])").chosen({
			width : "100%" , 
			no_results_text: "未找到此选项!" 
		});
	 dimContainer.buildDimChosenSelector($("#reasonsRrejection"), "RejectCause","");//驳回原因	
	 dimContainer.buildDimChosenSelector($("#creasonsRrejection"), "conRejectCause","");//合同驳回原因	 
})

	 //附件修改
	 var editflag=0;
	 $(document).delegate("a","click",function(event){
		 if(this.type=='amend'){
			 var old_memo = $(this).attr('data-memo');
			 var enclosureId = $(this).attr('data-enclosureId');
			 var old_enclosureType=$(this).attr('data-enclosureType');
			 commonContainer.modal(
				'附件修改',
				$('#adjunct_layer'),
				function(index, layero){
					var memo=$("#J_memo").val();
					var enclosureType=$("#J_AdjunctType").val();
					if($("#upFileName .deleteImg").length==0){
						 layer.alert("未提交已选择的附件，不能修改!");
						 return false;
					 }
					var validArr = [];
					 $("#adjunct_layer .deleteImg").each(function(){
						 	var enclosureList={};
						 	enclosureList.filePath=$(this).attr('data-imgurl');
						 	enclosureList.enclosurePathId=$(this).attr('data-enclosurePathId');
						 	enclosureList.fileName=$(this).attr('data-fileName');
							validArr.push(enclosureList);
						 })
					jsonPostAjax(
						basePath + '/sign/modifyEnclosure',{
							'enclosureId':enclosureId,
							'contractType':2,
							 'memo':memo,
							 //'enclosurePathId':enclosurePathId,
							 'enclosureType':enclosureType,
							 'enclosureList':validArr,
						},
						function(){
							layer.msg("成功");
							layer.close(index);
							jQuery('#J_annexdataTable').bootstrapTable('refresh');
						}
					);
				},
				{
					overflow:true,
					area: ['800px','400px'],
					btns: ['保存','取消'],
					success:function(result){
						 	
							$("#J_AdjunctType").empty();
							$("#J_AdjunctType").attr({"disabled":"disabled"})
							$("#J_AdjunctType").trigger("chosen:updated");
							$.when(
									enclosureTypes($("#J_AdjunctType"),"",1)
								).then(function(result){
									$("#J_memo").val(old_memo);
									$("#J_AdjunctType").val(old_enclosureType);
									$('select').trigger("chosen:updated");
									strLenCalc(200);
								});					
						jsonGetAjax(
							basePath + '/sign/querySingleEnclosure',
							{'enclosureId':enclosureId},
							function(result){
								$("#upFileName").empty();	
								var str='';
								for(var i=0;i<result.data.enclosureList.length;i++){
									str+='\
						    			<div class="col-md-3 deleteImg" data-imgurl="'+result.data.enclosureList[i].filePath +'" data-enclosurePathId="'+result.data.enclosureList[i].enclosurePathId+'" data-fileName="'+result.data.enclosureList[i].fileName+'">\
											<div class="form-group"  style="height:200px;padding:15px;">\
												<img class="upload_image" width=100%; height=100%; style="margin-bottom:10px;" src="'+result.data.enclosureList[i].filePath +'">\
												<p class="filename" onclick="download(\''+result.data.enclosureList[i].filePath+'\')">'+result.data.enclosureList[i].fileName+'</p>\
												<button type="button" class="btn btn-outline btn-success btn-xs mt-3 pd5" onclick="deleteImgFile(this)" >删除<tton>\
											</div>\
										</div>';
								}
								$("#upFileName").append(str);
								fileNum();
							}
							
						)
							
					}
					
				}
			 )
		 }else if(this.type=='examine'){
			 var enclosureId = $(this).attr('data-enclosureId');
			 commonContainer.modal(
						'查看附件',
						$('#examine_layer'),
						function(index, layero){
							
						},
						{
							overflow:true,
							area: ['800px','400px'],
							btns: [],
							success:function(result){
								jsonGetAjax(
										basePath + '/sign/querySingleEnclosure',
										{'enclosureId':enclosureId},
										function(result){
											$("#upFileName_examine").empty();	
											var str='';
											$("#type").text(result.data.enclosureTypeValue);
											for(var i=0;i<result.data.enclosureList.length;i++){
												str+='\
									    			<div class="col-md-3 deleteImg animated pulse" data-imgurl="'+result.data.enclosureList[i].filePath +'" data-enclosurePathId="'+result.data.enclosureList[i].enclosurePathId+'">\
														<div class="form-group"  style="height:200px;padding:15px;">\
															<img class="upload_image" width=100%; height=100%; style="margin-bottom:10px;" src="'+result.data.enclosureList[i].filePath +'" layer-src="'+result.data.enclosureList[i].filePath +'" >\
															<p class="filename"  onclick="download(\''+result.data.enclosureList[i].filePath+'\')">'+result.data.enclosureList[i].fileName+'</p>\
														</div>\
													</div>';
											}
											$("#upFileName_examine").append(str);
											
											layer.photos({
					                            photos: '#upFileName_examine .deleteImg',
					                            anim: 0
					                        });
										}
									)		
							}
							
						}
					 )
		 }else if(this.type=='sign'){
			 var enclosureId = $(this).attr('data-enclosureId');
			 var operateUserName = $(this).attr('data-operateUserName');
			 var operateTime  = $(this).attr('data-operateTime');
			 var approveType=$(this).attr('data-approveType');
			 commonContainer.modal(
						'签收附件',
						$('#examine_layer'),
						function(index, layero){
							jsonGetAjax(
									basePath + '/sign/signEnclosure',{
										'enclosureId':enclosureId,
										'approveType':approveType,
										'userType':userType
									},
									function(){
										layer.msg("成功");
										layer.close(index);
										jQuery('#J_annexdataTable').bootstrapTable('refresh');
									}
								);
						},
						{
							overflow:true,
							area: ['800px','400px'],
							btns: ['签收','驳回','取消'],
							btn2 :function(index, layero){
								commonContainer.modal(
										'驳回原因',
										$('#reasons_rejection_layer'),
										function(index, layero){
											var rejectType =$("#reasonsRrejection").val(); 
											var rejectReason =$("#memo").val();
											if(rejectReason==''){
												layer.msg("请填写驳回原因");
												return false;
											}
											jsonPostAjax(
													basePath + '/sign/rejectEnclosure',{
														'enclosureId':enclosureId,
														'rejectType':rejectType,
														'rejectReason':rejectReason,
														'approveType':approveType,
														'userType':userType
													},
													function(){
														layer.msg("成功");
														layer.close(index);
														jQuery('#J_annexdataTable').bootstrapTable('refresh');
													}
												);
										},
										{
											overflow:true,
											area: ['800px','400px'],
											btns: ['确认','取消'],
											success:function(){
												$("#operdate").text(operateTime);
												$("#opername").text(operateUserName );
												
												
											}
										}
									 )
							},
							success:function(result){
								jsonGetAjax(
										basePath + '/sign/querySingleEnclosure',
										{'enclosureId':enclosureId},
										function(result){
											$("#upFileName_examine").empty();	
											var str='';
											$("#type").text(result.data.enclosureTypeValue);
											for(var i=0;i<result.data.enclosureList.length;i++){
												str+='\
									    			<div class="col-md-3 deleteImg" data-imgurl="'+result.data.enclosureList[i].filePath +'" data-enclosurePathId="'+result.data.enclosureList[i]	.enclosurePathId+'">\
														<div class="form-group"  style="height:200px;padding:15px;">\
															<img class="upload_image" width=100%; height=100%; style="margin-bottom:10px;" src="'+result.data.enclosureList[i].filePath +'" >\
															<p class="filename">'+result.data.enclosureList[i].fileName+'</p>\
														</div>\
													</div>';
											}
											$("#upFileName_examine").append(str);
											
										}
										
									)		
							}
							
						}
					 )
		 }else if(this.type=='del'){
			 var that=$(this);
			 commonContainer.confirm(
						'是否确认删除？',
						function(index, layero){
							var enclosureId=that.attr('data-enclosureid');
							jsonGetAjax(
									basePath + '/sign/delEnclosure',
									{'enclosureId':enclosureId},
									function(result){
										layer.msg("删除成功");
										layer.close(index);
										jQuery('#J_annexdataTable').bootstrapTable('refresh');
									})
						}
					)	
			 
			 
		 }else if(this.type=='reject'){
			 var operateTime=$(this).attr('data-operateTimes');
			 var operateUserName=$(this).attr('data-operateUserNames');
			 var rejectReason=$(this).attr('data-rejectReasons');
			 var enclosureId=$(this).attr('data-enclosureIds')
			 var rejectTypeValue=$(this).attr('data-rejectTypeValue')
			 commonContainer.modal(
				'查看驳回原因',
				$('.look_reject_layer'),
				function(index, layero){
					layer.close(index);
					jQuery('#J_annexdataTable').bootstrapTable('refresh');
				},
				{
					overflow:true,
					area: ['600px','400px'],
					btns: ['确认','取消'],
					success:function(){
						$("#reject_opername").text(operateUserName);
						$("#reject_operdate").text(operateTime);
						$("#reject_reasons").text(rejectTypeValue);
						$("#reject_reason").text(rejectReason);
					}
				}
			 )
		 }
	 });
function download(downloadurl){
	var url = basePath + '/sign/downloadEnclosure?filePath='+downloadurl;
	try{ 
        var elemIF = document.createElement("iframe");   
        elemIF.src = url;   
        elemIF.style.display = "none";   
        document.body.appendChild(elemIF);   
    }catch(e){ 

    } 
	
}
	 //上传附件
	 var addflag=0;
	 var i=0;
	 $(document).delegate("#oper_annex_btn #upload","click",function(event){
		 jsonGetAjax(
					basePath + '/sign/contractSales/getAttachmentPrint',{'conId':conid},
					function(result){
						if(result.data==0){
							layer.alert("请打印一表一书，再此添加附件！");
							return false;
						}else{
							$("#fileNum").text("未选择任何文件");
							 $("#adjunct_form")[0].reset();
							 $("#J_AdjunctType").val()=='';
							 $("#J_AdjunctType").trigger("chosen:updated");
							 $("#upFileName").empty();
							 commonContainer.modal(
								'上传附件',
								$('#adjunct_layer'),
								function(index, layero){
									var memo=$("#J_memo").val();
									var enclosureType=$("#J_AdjunctType").val();
									if($("#J_AdjunctType").val()==''){
										layer.alert("请选择附件类型");
										return false;
									}
									if($("#upFileName .deleteImg").length==0){
										 layer.alert('请选择附件');
										 return false;
									 }
									var validArr = [];
									var invalidCount = 0;
									 $("#adjunct_layer .deleteImg").each(function(){
										 	var enclosureList={};
										 	enclosureList.filePath=$(this).attr('data-imgurl');
										 	enclosureList.fileName=$(this).attr('data-fileName');
											validArr.push(enclosureList);
									 })
									jsonPostAjax(
										basePath + '/sign/addEnclosure',{
											'contractId':conid,
											'contractType':2,
											 'memo':memo,
											 'enclosureType':enclosureType,
											 'enclosureList':validArr,
										},
										function(){
											layer.msg("成功");
											layer.close(index);
											jQuery('#J_annexdataTable').bootstrapTable('refresh');
										}
									);
								},
								{
									overflow:true,
									area: ['800px','400px'],
									btns: ['保存','取消'],
									success:function(){
											$("#J_AdjunctType").empty();
											$('#J_AdjunctType').removeAttr("disabled");
											$("#J_AdjunctType").trigger("chosen:updated");
											enclosureTypes($("#J_AdjunctType"),"",2);
									}
								}
							 ) 
						}
					}		
				)
		 
	 })
	 


function upImgFile_out(){
	var lock = false;
	$('#selectFile').off().on('click',function(){
		$('#upFile').click();
		fileUp(lock);
	});
	fileUp(lock);
};
function fileUp(lock){
	$('#upFile').off().on('input change',function(){
		var formData=new FormData();
		for(var i=0;i<this.files.length;i++){
			if(this.files[i].size>5*1024*1024){		
				commonContainer.alert('请上传小于5MB文件');
				return false;
			}
			formData.append('files',this.files[i]);
		}
		if(lock){
			return false;
		}else{
			lock=true;
		}
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
		    	if(result.code==0){
		    		lock=false;
		    		console.log(result);
		    		var html='';
		    		for(var j=0;j<result.data.length;j++){
		    			html+='\
			    			<div class="col-md-3 deleteImg" data-imgurl="'+result.data[j].filepath+'" data-fileName="'+result.data[j].filename+'">\
								<div class="form-group"  style="height:200px;padding:15px;">\
									<img class="upload_image" width=100%; height=100%; style="margin-bottom:10px;" src="'+result.data[j].filepath+'"  >\
									<p class="filename">'+result.data[j].filename+'</p>\
									<button type="button" class="btn btn-outline btn-success btn-xs mt-3 pd5" onclick="deleteImgFile(this)" >删除</button>\
								</div>\
							</div>';
		    			
		    		}
		    		console.log(html)
		    		 $('#upFileName').append(html);
		    		 fileNum();
		    		 
		    		 
		    	}else{
		    		commonContainer.alert('上传失败');
		    	}
	    	},
		    error:function(){
		    	lock=false;
		    	layer.alert(errorMsg);
	    	}
		});
		//重置上传文件控件
		$('#fileHidden').html('<input type="file" id="upFile"  multiple="" >');
	});
}
function deleteImgFile(that){
	commonContainer.confirm(
		'是否确认删除？',
		function(index, layero){
			$(that).parents('.deleteImg').remove();
			fileNum();
			layer.close(index);
		}
	)	
}

function fileNum(){
	 var fileNum=$("#upFileName .deleteImg").length;
		 if(fileNum>0){
			 $("#fileNum").text("已选择 "+fileNum+" 个文件");
		 }else if(fileNum==0){
			 $("#fileNum").text("未选择任何文件");
		 }
}


/**
 * 附件类型搜索
 */
function enclosureTypes($container, selectedValues,operateType) {
	// 初始化chosen控件
	commonContainer.initChosen($container);
    var options = [];
	var url = basePath + '/sign/enclosureType';
	return jsonGetAjax(url, {'contractId':conid,'operateType':operateType}, function(result) {
		options.push('<option value="">请选择</option>');
		$.each(result.data, function(n, value) { 
	    	options.push('<option value="' + value.key+ '">' + value.value+ '</option>');
	    })
	    $container.append(options);
		
		var selectedValueArr = selectedValues.split(',');
		$container.val(selectedValueArr);
		$container.trigger("chosen:updated");
	})
}

//点击按钮
var a;
var arr = [];
//1、点击关闭
$(document).delegate(".btn-close","click",function(){
	$(".mock").remove();
})
//2、下一张
$(document).delegate(".btn-next","click",function(){
	for(var i=0;i<$("#upFileName_examine .deleteImg").length;i++){
		if($("#bigPic").attr("src")==arr[i]){
			if(i==$("#upFileName_examine .deleteImg").length-1){
				$("#bigPic").attr("src",arr[0]);
				break;
			}else{
				$("#bigPic").attr("src",arr[i+1])
				break;
			}
		}
	}
/*	var data = $("#bigPic").attr("data-enclosurepathid");
	var picsrc = $(".deleteImg").find()*/
		
})
/*$(".btn-next").on("click",function(){
	console.log(a);
});*/
/*function pNext($contents){
	var srcnum = $contents.prev().attr(src);
	$("#bigPic").attr(src,srcnum);
}*/

/*function pPrev($contents){
	
}*/
//3、上一张
$(document).delegate(".btn-prev","click",function(){
	var L = $(".deleteImg").length
	for(var i=0;i<L;i++){
		if($("#bigPic").attr("src")==arr[i]){
			if(i==0){
				$("#bigPic").attr("src",arr[L-1]);
				break;
			}else{
				$("#bigPic").attr("src",arr[i-1])
				break;
			}
		}
	}
})


//图片放大

function upPic($contents){	
	if($(".mock").length==0){
		arr =[];
		$(".upload_image").each(function(){		
			arr.push($(this).attr("src"))
		})		
		$("body").append('<div class="mock">'+
				'<img id="bigPic" src="'+$contents.attr("data-imgurl")+'"/>'+
				 '<div class="btn-view">'+
				      '<span class="btn-prev">←</span>'+
				      '<span class="btn-next">→</span>'+
				      '<span class="btn-close">×</span>'+
				  '</div>'+
				'</div>');
	}
}
