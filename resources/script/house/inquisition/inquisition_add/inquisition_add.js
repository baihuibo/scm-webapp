var commonHtml;
var houseDesignId = "";
/*$(function(){
	upImgFile_out();
})*/
//实勘标准内容模态框；
function view1() {
	layer.open({
		title : '实勘标准内容',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		zIndex: 10,//保证树在上面
		content : $('#demo_layer_stantard'),
		area :   ['700px','520px'],
		btn : [ '确定','取消' ],
		yes : function(index, layero) {
				
				layer.close(index);
			}
			
		
	});	
};
$(document).delegate(
		'.norm',
		'click',
		function(event) {
			view1();
		});

//选择上传用户图类型
function view_change() {
	layer.open({
		title : '选择上传户型图类型',
		type : 1,
		shift : 1,
		zIndex: 9,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		content : $('#demo_layer'),
		area : ['600px','20%'],
		//btn : [ '确定' ],
		yes : function(index, layero) {
			layer.msg("操作成功");
			layer.close(index);
		},
		cancel : function(index, layerno) {
			layer.close(index);
		},
		success:function (layero, index){
			//console.log(layero, index);
			//调用和绑定
			//J_inline
			$(document).delegate(
					'#J_upload',
					'click',
				      function(){
						layer.closeAll();
						view_change_pic();
					}    
				
					
			);
			$(document).delegate(
					'#J_inline',
					'click',
				      function(){
						layer.closeAll();
						view_change_flash()
					}    
				
					
			);
		}
		
	});
};
//绑定事件
$(document).delegate(
		'#J_add_out',
		'click',
	      function(index){			
			view_change();
		}    
	
		
);
//选择了flash
function view_change_flash() {
	//动画
	var inqId =123456;
	var requestParameters = "?houseId=" + houseDesignId + "&inqId=" + inqId;
	// $('#flexFrame').attr('src','../../resources/draw3d/WebBrush.html'+requestParameters);
	 $('#flexFrame').attr('src','../../resources/designhouse3d/designHouse.html'+requestParameters);
	layer.open({
		title : '在线绘制',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		content : $('#demo_layer_flash'),
		area : ['1200px'],
		yes : function(index, layero) {
			layer.msg("操作成功");
			layer.close(index);
		},
		cancel : function(index, layerno) {
		}
	});
};

//添加户型图：
function commonfn(files , callback){
	var loaded = 0 , isNoPass = false;
    for (var i = 0; i < files.length; i++) {
        var upFileObj = files[i];
        //验证上传文件
        var strIndex = upFileObj.name.lastIndexOf('.') + 1;
        var fileSuffixName = upFileObj.name.substring(strIndex);											//文件后缀
        var isFileType = /^(jpg|jpeg|png|tif|tiff)$/.test(fileSuffixName);						//是否符合文件类型
        //是否符合文件类型
        if (!isFileType) {
            commonContainer.alert('图片格式为jpg、jpeg、png、tif、tiff');
            isNoPass = true;
            return callback(false);
        }
        //验证上传文件是否大于5MB
        if (upFileObj.size > 5 * 1024 * 1024) {
            commonContainer.alert('图片最大不超过5M');
            isNoPass = true;
            return callback(false);
        }
        var fileData = upFileObj;
        //读取图片数据
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            //加载图片获取图片真实宽度和高度
            var image = new Image();
            image.onload = function () {
                loaded ++;
                if (image.width < 600 || image.height < 450) {
                    commonContainer.alert('请上传图片尺寸≥600*450');
                    isNoPass = true;
                    return callback(false);
                }
                if (loaded === files.length && !isNoPass) {
                    callback(true);
                }
            };
            image.src = data;
        };
        reader.readAsDataURL(fileData);
    }
};
/*function upImgFile_out(){*/
	/*$('#selectFile').on('click',function(){
		$('#upFile').click();*/
		$("#demo_layer_pic").on('change',"input[type='file']",function(){
			var files=Array.prototype.slice.call(this.files)
			if(files.length){
			commonfn(files , function (isTrue) {
				if (isTrue) {
					var formData=new FormData();
					for(var i=0;i<files.length;i++){
						formData.append('files',files[i]);
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
			    		console.log(result);
			    		var html='';
				    	for(var i=0;i<result.data.length;i++){
				    		html+='\
			    			<div class="col-md-3 deleteImg"   data-imgname="" data-imgurl="'+result.data[i].filepath+'">\
								<div class="form-group"  style="height:100%;padding:15px;">\
									<img class="upload_image" width="100%" height="70%" style="margin-bottom:10px;" src="'+result.data[i].filepath+'">\
									<input type="text" placeholder="请输入描述" class="describ form-control" id="describ" maxlength="50"/>\
									<div class="col-sm-12" style="text-align:center"><button type="button" class="btn btn-outline btn-success btn-xs mt-3 pd5" onclick="deleteImgFile(this)" >删除</button></div>\
								</div>\
							</div>';
				    	}
			    		  var file_size = 0;
			    		 $('#upFileName').append(html);
						$('#describ').on('blur',function(that){
						});
				    },
				    error:function(){
				    	layer.alert(errorMsg);
			    	}
				});
			//重置上传文件控件
			$('#fileHidden').html('<input type="file"  accept="image/jpg, image/jpeg" multiple="multiple" id="upFile">');
		}
	})
	}
});	

/*});*/

/*};*/
//删除上传图片文件
function deleteImgFile(that){
	layer.confirm("确定要删除此图片？",function(index){
		$(that).parents('.deleteImg').remove();
		layer.close(index);
		layer.msg("删除成功");
	});	
}
//讲户型图添加到页面上去
var $ctrl = $('#ibox').controller();
var $scope = $('#ibox').scope();
function view_change_pic() {
	layer.open({
		title : '户型图上传',
		type : 1,
		shift : 1,
		zIndex: 10,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		content : $('#demo_layer_pic'),
		area : ['900px','90%'],
		btn : [ '保存','取消' ],
		yes : function(index, layero) {
			var html='';
			var arrPicter=[];
			if($('.upload_image').length==0){
				return layer.alert("请上传图片！");
			}
			$('#upFileName .upload_image').each(function(index,img){
				var obj={};
				obj.picturePath=$(this).attr("src");
				obj.imgDescribe='户型图';
				obj.describe=$(this).next('.describ').val();
				arrPicter.push(obj);
			});
			$ctrl.doorAddPicter(arrPicter);
			$scope.$digest();
			$('#upFileName').empty();
//			
			 
			 
			layer.close(index);
		},
		cancel : function(index, layerno) {
		}
	});
};

//删除添加到页面上的户型图
function delimg_out(that){
	$(that).parents('.out_img').remove();
	//删除后长度小于页面长度，不能轮播
	var  singelw = $(".singel-report").width()*0.9;
	var outImg = ($(".out_img").width()+20)*($(".out_img").length);
//	console.log(singelw,outImg,insImg)
	if(singelw>=outImg){
		 $('.outerRight').unbind();
		 $('.outerLeft').unbind();
	 }
	$(".apart_in_number").text($(".out_img").length);
}




//添加室内图：
/*function upImgFile_out2(){
	$('#selectFile2').on('click',function(){
		$('#upFile2').click();*/
		$('#upFile2').on('input change',function(){
			//调用图片上传的公共接口
			var formData2=new FormData();
			for(var i=0;i<this.files.length;i++){
				if(this.files[i].width<800||this.files[i].height<600||this.files[i].width/this.files[i].height!=4/3){
					commonContainer.alert('请上传图片尺寸≥800*600，比例为4:3');
					return false;
				}
				if(this.files[i].size>5*1024*1024){		
					commonContainer.alert('请上传小于5MB文件');
					return false;
				}
				formData2.append('files',this.files[i]);
			}
			//console.log(this.filesarr);
			$.ajax({
				url: basePath+'/custom/common/multiFileUpload.htm',
			    type: 'POST',
			    async:true,
			    cache: false,
			    data: formData2,
			    processData: false,
			    contentType: false,
			    dataType:'json',
			    success:function(result){
			    	//++_this.index;
//		    		console.log(result);
			    	var html='';
			    	for(var i=0;i<result.data.length;i++){
			    		html+='\
		    			<div class="col-md-3 deleteImg"   data-imgname="" data-imgurl="'+result.data[i].filepath+'">\
							<div class="form-group"  style="height:200px;padding:15px;">\
								<img class="upload_image2" width="100%" height="80%" style="margin-bottom:10px;" src="'+result.data[i].filepath+'">\
								<input type="text" placeholder="请输入描述" class="describ" id="describ" maxlength="50"/>'
								html+=commonHtml;
								html+='<div class="col-sm-12" style="text-align:center"><button type="button" class="btn btn-outline btn-success btn-xs mt-3 pd5" onclick="deleteImgFile(this)" >删除</button></div>'
								html+='</div></div>';
			    	}
						  var file_size = 0;
				    		/* if(result.data[0].file_size>=(5*1024*1024)){
	    			                  
	    			           layer.alert("请上传小于5M的图片");
	    			                  return false;
	    			          }else{
	    			        	  $('#upFileName2').append(html);
	    			          }*/
						  $('#upFileName2').append(html);
					//$('#upFileName2').append(html);
				//	$('#'+_this.index).show('600');
				//	var initchosen='#initchosen'+_this.index+' select';
					/*$(initchosen).chosen({
						width : '75%'
					});*/
			    },
			    error:function(){
			    	layer.alert(errorMsg);
		    	}
			});
			
			//重置上传文件控件
			$('#fileHidden2').html('<input type="file"  accept="image/jpg, image/jpeg" multiple="multiple" id="upFile2">');
		});
/*	});
};*/

//点击添加室内图出来模态框-------讲室内图添加到页面上去
function view_change_pic2() {
	layer.open({
		title : '室内图上传',
		type : 1,
		shift : 1,
		zIndex: 10,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		content : $('#demo_layer_pic2'),
		area : ['900px','90%'],
		btn : [ '保存','取消' ],
		yes : function(index, layero) {
			var html='';
			$('.upload_image2').each(function(index,img){
				$('.upFileName').empty();
				var pictureKey = $("option").attr('pictureKey');
				var img_out='';
				var pic='';
				img_out=$(this).attr("src");
//				console.log(img_out);
				pic=$(this).next().next().find("option:selected").attr("pictureKey");;
				
				html =html+ '<div class="out_img2" id="out_im'+index+'"><div class="out_imgDeal"><img class="upload_image1" pictureKey="'+pic+'" title="'+$(this).next('.describ').val()+'" src="'+img_out+'">'+
								'<p  class="big_pic">'+$(this).next().next().val()+'</p></div>'+
								'<span  class="delt glyphicon glyphicon-remove" id="delimg1'+index+'" onclick="delimg_outs(this)">'+'</span>'+
							'</div>';
				//img_outs.append('img_out'); 
				
			});
				$(".img_ins").append(html);				
			layer.msg("操作成功");
			layer.close(index);
			$(".indoor_in_number").text($(".img_ins").children("div").length)
			//图片放大
			 $('#indoor_ins').imgZoom();
			var  singelw = $(".singel-report").width()*0.9;
			var insImg = ($(".out_img2").width()+20)*($(".out_img2").length);			 
			if(singelw<=insImg){
			  	$('.img_ins').slider({
			  		prev_btn:'insRight',
			  		next_btn:'insLeft',
			  		count:1
			  	})
			 }else{
				 $('.insRight').unbind();
				 $('.insLeft').unbind();
			 }
		},
		cancel : function(index, layerno) {
		}
	});
};
//调用和绑定
$(document).delegate(
		'#J_add_in',
		'click',
	      function(){
			view_change_pic2();
		}    
);

//删除添加到页面上的户型图
function delimg_outs(that){
	$(that).parents('.out_img2').remove();
	//删除后长度小于页面长度，不能轮播
	var  singelw = $(".singel-report").width()*0.9;
	var insImg = ($(".out_img2").width()+20)*($(".out_img2").length);
	console.log(singelw,insImg)
	if(singelw>=insImg){
		 $('.insRight').unbind();
		 $('.insLeft').unbind();
	 }
	$(".indoor_in_number").text($(".out_img2").length);
}


//点击取消按钮
$(document).delegate(
		'#cancle',
		'click',
	      function(){
			/*var el = $(self.frameElement).closest('.layui-layer').get(0);			
			top.layer.close(el.id.match(/\d+/))*/
			window.close();
		}
	
);
//文本框输入字数限制
$('#memo').onkeydown = function()
{   
    if(this.value.length >= 1000)
      event.returnValue = false;
} 



//所属人模态框
$(document).delegate(
		'#userName',
		'click',
		function(event) {
			var userId = $('#J_usid').val();
			getUserStaffInfo(userId);
		}
	)
//所属人模态框<过往实勘>
$(document).delegate(
		'#userName2',
		'click',
		function(event) {
			var userId2 = $(this).attr('data-userid');
			getUserStaffInfo(userId2);
		}
	)
//过往实勘
//后台获取数据(过往实勘)
$(function() {
	var sHref =window.location.href;
		//'http://local.cbs.bacic5i5j.com:8080/sales/house/inquisition/inqHistory?inquId=4279003'
	var args = sHref.split("?");
	if (args[0] == sHref) {
		return retval;
	}
	var str = args[1];
	args = str.split('&');
	var a1 = args[0];
	var housesId = a1.replace(/[^0-9]/ig, "");
	//var housesId=$('#housesId').text();
	//alert(housesId)
	$.ajax({
		url : basePath + '/house/inquisition/inqHistory',
		type : 'POST',
		async : true,
		cache : false,
		data : {
			"housesId" : housesId
		},
		dataType : 'json',
		success : function(result) {
//			console.log(result.data);
			//console.log(result.data.length);
			
			for(var i=0;i<result.data.length;i++){
				var operateTime=result.data[i].operateTime;//操作时间
				var operateName=result.data[i].operateName;//操作人
				var userId=result.data[i].userId//操作人id
				var memo//描述
				if(result.data[i].memo==undefined){
					memo='';
					
				}else{
					memo=result.data[i].memo;
				}
				var html2='';
				if(result.data[i].pictureList==undefined){
					 html2='';
				}else{
					for(var j=0;j<result.data[i].pictureList.length;j++){
						var pictureList = result.data[i].pictureList[j];
						if(pictureList.picturePath != undefined){
							var picturePath=pictureList.picturePath;
							var imgDescribe=pictureList.imgDescribe;
							html2=html2+ '<li>'+
											'<img class="inq_past_img" src="'+picturePath+'" />'+
											'<div class="inq_past_sTitle">'+'</div>'+
											'<p class="inq_past_title">'+imgDescribe+'</p>'+
										'</li>'
						}
					}
				}
			
				
				var html='<div class="inq_past_list">'+
					'<p class="inq_past_normsg">操作时间：<span class="inq_past_time" id="inq_past_time">'+operateTime+
					'</span>操作人：<a id="userName2" class="inq_past_time inq_past_name" data-userid="'+userId+'" href="javascript:;">'+operateName+
						'</a>'+
					'</p>'+
					'<p class="break-word">'+memo+'</p>'+
					'<ul class="inq_past_imglist">'+html2+'</ul>'+
				'</div>';
				
				$(".inq_past_box").append(html);
			};


		},
		error : function() {
			layer.alert(errorMsg);
		}
	});
})

// 过往实勘模态框；
function pastView() {
	layer.open({
		title : '过往实勘',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		zIndex : 10,// 保证树在上面
		content : $('#demo_layer_stantard1'),
		area : [ '700px', '548px' ],

	});
};
$(document).delegate('#past', 'click', function(event) {
	pastView();
});
