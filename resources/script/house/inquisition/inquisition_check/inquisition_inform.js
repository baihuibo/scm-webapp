searchContainer.searchUserListByComp($("#J_user"), true, 'right');
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

var commonHtml;
/*$(function(){
	upImgFile_out();

})*/

//可编辑的图片的删除功能
function delimg_out1(that){
	//alert($(that).parents().html())
	$(that).parents('.out_img').remove();
	//删除后长度小于页面长度，不能轮播
	var  singelw = $(".singel-report").width()*0.9;
	var outImg = ($(".out_img").width()+20)*($(".out_img").length);
	if(singelw>=outImg){
		 $('.outerRight2').unbind();
		 $('.outerLeft2').unbind();
	 }
	$(".apart_in_number").text($(".out_img").length);
}
//可编辑的图片的删除功能
function delimg_out2(that){
	//alert($(that).parents().html())
	$(that).parents('.out_img2').remove();
	//删除后长度小于页面长度，不能轮播
	var  singelw = $(".singel-report").width()*0.9;
	var insImg = ($(".out_img2").width()+20)*($(".out_img2").length);
//	console.log(singelw,insImg)
	if(singelw>=insImg){
		 $('.insRight2').unbind();
		 $('.insLeft2').unbind();
	 }
	$(".indoor_in_number").text($(".out_img2").length);
}
//----------------------------添加实勘
//选择上传用户图类型
function view_change() {
	layer.open({
		title : '选择上传户型图类型',
		type : 1,
		shift : 1,
		zIndex: 9,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		content : $('#demo_layer'),
		area : ['500px','20%'],
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
			$(document).delegate(
					'#J_upload',
					'click',
				      function(){
						layer.closeAll();
						view_change_pic();
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
	var housesId = 1;
	var inqId =123456;
	var requestParameters = "?houseId=" + housesId + "&inqId=" + inqId;
	// $('#flexFrame').attr('src','../../resources/draw3d/WebBrush.html'+requestParameters);
	$('#flexFrame').attr('src','../../resources/designhouse3d/designHouse.html'+requestParameters);
	layer.open({
		title : '在线绘制',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		content : $('#demo_layer_flash'),
		area : ['1200px'],
		btn : [ '确定' ],
		yes : function(index, layero) {
			layer.msg("操作成功");
			layer.close(index);
		},
		cancel : function(index, layerno) {
		}
	});
};

//调用和绑定
$(document).delegate(
		'#J_inline',
		'click',
	      function(){
			view_change_flash();
		}    
	
		
);
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
//			console.log(this.filesarr);
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
			    	/*++_this.index;
		    		console.log(result);*/
			    	var html='';
			    	var file_size = 0;
			    	for(var i=0;i<result.data.length;i++){
			    		html+='\
		    			<div class="col-md-3 deleteImg"   data-imgname="" data-imgurl="'+result.data[i].filepath+'">\
							<div class="form-group"  style="height:200px;padding:15px;">\
								<img class="upload_image" width="100%" height="80%" style="margin-bottom:10px;" src="'+result.data[i].filepath+'">\
								<div class="col-sm-12"><input type="text" placeholder="请输入描述" class="form-control" id="describ" maxlength="50"/></div>\
								<div class="col-sm-12" style="text-align:center"><button type="button" class="btn btn-outline btn-success btn-xs mt-3 pd5" onclick="deleteImgFile(this)" >删除</button></div>\
							</div>\
						</div>';
			    		/*if(result.data[i].file_size>=(5*1024*1024)){
					           layer.alert("请上传小于5M的图片");
					           return false;
					     }*/
			    	}
    		  
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
var $ctrl = $('#ibox').controller();
var $scope = $('#ibox').scope();
//讲户型图添加到页面上去
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
			var arrPicter=[];
			/*var html='';*/
			if($('#upFileName .upload_image').length==0){
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
			layer.close(index);
			
		},
		cancel : function(index, layerno) {
		}
	});
};
//删除添加到页面上的户型图
function delimg_out(that){
	$(that).parents('.out_img').remove();
}
//点击取消按钮
$(document).delegate(
		'#cancle',
		'click',
	      function(){
			window.close();
			//alert($(this).children('.out_imgDeal').children('img').attr("src"))
		}
	
);
/*实勘中变更实勘人模态框*/
//分配实勘人；
function inquese() {
	layer.open({
		title : '请选择实勘人',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		zIndex: 10,//保证树在上面
		content : $('#change_inquese'),
		area :   ['500px','320px'],
		btn : [ '确定'],
		yes : function(index, layero) {
//				console.log($("#J_user").val())
//				$("#inquName").text($("#J_user").val());
				
				var sHref = window.location.href;
				//'http://local.cbs.bacic5i5j.com:8083/sales/customer/main/findbuyerclientbycustomerid.htm?inquId=4279003'
			// window.location.href;
			var args = sHref.split("?");
			if (args[0] == sHref) {
				return retval;
			}
			var str = args[1];
			args = str.split("&");
			var a1 = args[0];
			var inquId = a1.replace(/[^0-9]/ig, "");
			/*var auditResult = $('input:radio[name="lists"]:checked')
					.val();*/
			var admeasureId = $("#J_user").attr("data-id");
			if(!admeasureId){
				layer.alert('请输入实勘人');
				return false;
			}
			$.ajax({
				url : basePath + '/house/inquisition/admeasureInqu',
				type : 'POST',
				async : true,
				cache : false,
				data : {
					"inquId" : inquId,
					"admeasureId" : admeasureId
				},
				dataType : 'json',
				success : function(result) {
//					console.log(result);
    	    		if(result.code==1){
    	    		//	layer.alert(errorMsg);
    	    			layer.alert(result.data.describe);
    	    		}else if(result.code==0){
    	    			layer.msg("操作成功");
    	    			window.location.reload();
    	    		}
					
				},
				error : function(result) {

					layer.alert(errorMsg);
				}
			});
			
				layer.close(index);
			}
			
		
	});	
};
$(document).delegate(
		'#inquese',
		'click',
		function(event) {
			inquese();
		});



//所属人模态框
$(document).delegate(
		'#userName',
		'click',
		function(event) {
			var userId = $('#J_usid').val();
			getUserStaffInfo(userId);
		}
)

//点击判断当前第几个图片
	
	$(document).delegate(
		'.insLeft',
		'click',
		function(event) {
			var time = setTimeout(function(event){
				$(".indoored_now_number").text($(".img_in2").children().eq(0).attr("imgno"))
			},1000)
				
		}
	)
	$(document).delegate(
		'.insRight',
		'click',
		function(event) {
			var time = setTimeout(function(event){
				$(".indoored_now_number").text($(".img_in2").children().eq(0).attr("imgno"))	
			},1000)
				
		}
	)
	$(document).delegate(
		'.outerLeft',
		'click',
		function(event) {
			var time = setTimeout(function(event){
				$(".apart_now_number").text($(".img_outer2").children().eq(1).attr("imgno"))
		},1000)
				
		}
	)
	$(document).delegate(
		'.outerRight',
		'click',
		function(event) {
			var time = setTimeout(function(event){
				$(".apart_now_number").text($(".img_outer2").children().eq(0).attr("imgno"))
		},1000)
			
		}
	)



