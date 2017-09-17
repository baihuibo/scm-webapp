searchContainer.searchUserListByComp($("#J_user"), true, 'right');
//提示框；
function alerta(msg){
	layer.alert(msg,{skin: 'layui-layer-lan',})
}
//举报详情模态框
function reportDetail() {
	$(".inq_imageBox").css({"background-image":""});
	$(".inq_imageBox1").css({"background-image":""});
	layer.open({
		title : '户型图对比',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		zIndex: 10,//保证树在上面
		content : $('#demo_layer_stantard3'),
		area :   ['700px','520px'],
		
	});	
};

function reportinDetail() {
	$(".inq_imageBox").css({"background-image":""});
	$(".inq_imageBox1").css({"background-image":""});
	layer.open({
		title : '室内图对比',
		type : 1,
		shift : 1,
		skin : 'layui-layer-lan layui-layer-no-overflow',
		zIndex: 10,//保证树在上面
		content : $('#demo_layer_stantard3'),
		area :   ['700px','520px'],
		
	});	
};
//举报图片对比功能
	//判断图片类型是否相同
$(function(){
	$(".apart").click(function(){	
		var a,b,c,d;
		var leftImg,rightImg;
		
		$("input[name='btSelectItem']").each(function(){
			if($(this).prop("checked")){
				return a = $(this).closest(".out_img").find(".reported_out").text(),
				c = $(this).closest(".out_img").find("img").attr("alt"),
				leftImg = $(this).closest(".out_img").find("img").attr("src");
			}
		})
		$("input[name='btSelectItem_m']").each(function(){
			if($(this).prop("checked")){
				return b = $(this).closest(".out_img").find(".reported_out").text(),
				d = $(this).closest(".out_img").find("img").attr("alt"),
				rightImg = $(this).closest(".out_img").find("img").attr("src");
			}
		})
		
//		console.log(leftImg);
		/*if(a!=b){				
			alerta("图片类型不匹配")			
		}else{*/
		if(d=="室内图"){
			return alerta("请选择户型图比较！");
		}
			if(c==d&&d=="户型图"){
				
				reportDetail();
				
				//定义options
				var options1 =
				{
					thumbBox: '.thumbBox',
					imgSrc: leftImg
					
				}			
				var options =
				{
					thumbBox: '.thumbBox1',
					imgSrc: rightImg
					
				}
				//赋值options
				var cropper = $('.inq_imageBox').cropbox(options1);	
				var cropper1 = $('.inq_imageBox1').cropbox(options);
				//点击放大缩小
				$('#btnZoomIn').on('click', function(){
					cropper.zoomIn();
					cropper1.zoomIn();
					
				})
				$('#btnZoomOut').on('click', function(){
					cropper.zoomOut();
					cropper1.zoomOut();
				})
				$('#btnZoomIn').bind("selectstart", function () { return false; });
				$('#btnZoomOut').bind("selectstart", function () { return false; });
			}else{
				alerta("图片类型不匹配");
			}
			
		/*}*/	
	})

	$(".indoor").click(function(){
		var a,b,c,d;
		var leftImg,rightImg;
		$("input[name='btSelectItem']").each(function(){
			if($(this).prop("checked")){
				return a = $(this).closest(".out_img").find(".reported_out").text(),
				c = $(this).closest(".out_img").find("img").attr("alt"),
				leftImg = $(this).closest(".out_img").find("img").attr("src");
			}
		})
		$("input[name='btSelectItem_m']").each(function(){
			if($(this).prop("checked")){
				return b = $(this).closest(".out_img").find(".reported_out").text(),
				d = $(this).closest(".out_img").find("img").attr("alt"),
				rightImg = $(this).closest(".out_img").find("img").attr("src");
			}
		})
		console.log(leftImg,rightImg);
		/*if(a!=b){		
			alerta("图片类型不匹配")	
		}else{*/
		if(d=="户型图"){
			return alerta("请选择室内图比较！");
		}
			if(c==d&&d=="室内图"){
				
				reportinDetail();
				
				//定义options
				var options1 =
				{
					thumbBox: '.thumbBox',
					imgSrc: leftImg
					
				}			
				var options =
				{
					thumbBox: '.thumbBox1',
					imgSrc: rightImg
					
				}
				//赋值options
				var cropper = $('.inq_imageBox').cropbox(options1);	
				var cropper1 = $('.inq_imageBox1').cropbox(options);
				//点击放大缩小
				$('#btnZoomIn').on('click', function(){
					cropper.zoomIn();
					cropper1.zoomIn();
					
				})
				$('#btnZoomOut').on('click', function(){
					cropper.zoomOut();
					cropper1.zoomOut();
				})
				$('#btnZoomIn').bind("selectstart", function () { return false; });
				$('#btnZoomOut').bind("selectstart", function () { return false; });
			}else{
				alerta("图片类型不匹配");
			}
			
		/*}*/			
	})
})

//驳回举报
$(document).delegate(
		'#no',
		'click',
	      function(){
			var id=$('#reportNo').text();
			var handleResult=$('#handleResults').val();
			var isTrue=1;
			//alert(memo);
			if(handleResult==''){
				layer.alert('请填写处理举报描述');
				return false;
			}
	
			$.ajax({
    			url: basePath+'/house/inquisitionCtf/inqDealReport',
    		    type: 'POST',
    		   // contentType : 'application/json;charset=UTF-8',
    		    data:{
    		    	"id":id,
    		    	"handleResult":handleResult,
    		    	"isTrue":isTrue
    		    },
    		    dataType:'json',
    		    success:function(result){
    	    		console.log(result);
    	    		console.log(result.msg);
    	    		console.log(result.code);
    	    		if(result.code==1){
    	    			layer.alert(result.msg);
    	    			return false;
    	    		}else if(result.code==0){
    	    			window.close();//关闭当前窗口
     	    			window.opener.location.href = window.opener.location.href;//刷新父页面
    	    		}
    	    		
    	    		
    		    },
    		    error:function(){
    		    	layer.alert(errorMsg);
    	    	}
    		});
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
				
				var sHref = window.location.href;
				//'http://local.cbs.bacic5i5j.com:8083/sales/customer/main/findbuyerclientbycustomerid.htm?inquId=4279003'
			// window.location.href;
			var args = sHref.split("?");
/*			if (args[0] == sHref) {
				return retval;
			}*/
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
					console.log(result);
    	    		if(result.code==1){
    	    			//layer.alert(errorMsg);
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
	//被举报室内图
	$(document).delegate(
		'.insLeft2',
		'click',
		function(event) {
			var time = setTimeout(function(event){
				$(".indoored_now_number").text($(".img_in2").children().eq(0).attr("imgno"))
			},1000)
				
		}
	)
	$(document).delegate(
		'.insRight2',
		'click',
		function(event) {
			var time = setTimeout(function(event){
				$(".indoored_now_number").text($(".img_in2").children().eq(0).attr("imgno"))	
			},1000)
				
		}
	)
	//被举报户型图
	$(document).delegate(
		'.outerLeft2',
		'click',
		function(event) {
			var time = setTimeout(function(event){
				$(".aparted_now_number").text($(".img_outer2").children().eq(1).attr("imgno"))
		},1000)
				
		}
	)
	$(document).delegate(
		'.outerRight2',
		'click',
		function(event) {
			var time = setTimeout(function(event){
				$(".aparted_now_number").text($(".img_outer2").children().eq(0).attr("imgno"))
		},1000)
			
		}
	)
	//举报室内图
	$(document).delegate(
		'.insLeftj2',
		'click',
		function(event) {
			var time = setTimeout(function(event){
				$(".indoor_now_number").text($(".img_inj2").children().eq(0).attr("imgno"))
			},1000)
				
		}
	)
	$(document).delegate(
		'.insRightj2',
		'click',
		function(event) {
			var time = setTimeout(function(event){
				$(".indoor_now_number").text($(".img_inj2").children().eq(0).attr("imgno"))	
			},1000)
				
		}
	)
	//举报户型图
	$(document).delegate(
		'.outerLeftj2',
		'click',
		function(event) {
			var time = setTimeout(function(event){
				$(".apart_now_number").text($(".img_outerj2").children().eq(0).attr("imgno"))
		},1000)
				
		}
	)
	$(document).delegate(
		'.outerRightj2',
		'click',
		function(event) {
			var time = setTimeout(function(event){
				$(".apart_now_number").text($(".img_outerj2").children().eq(0).attr("imgno"))
		},1000)
			
		}
	)

//真实举报
$(document).delegate(
		'#real',
		'click',
	      function(e){
			var id=$('#reportNo').text();
			var handleResult=$('#handleResults').val();
			var isTrue=0;
			//alert(memo);
			if(handleResult==''){
				layer.alert('请填写处理举报描述');
				return false;
			}
			
			$.ajax({
    			url: basePath+'/house/inquisitionCtf/inqDealReport',
    		    type: 'POST',
    		    //contentType : 'application/json;charset=UTF-8',
    		    data:{
    		    	"id":id,
    		    	"handleResult":handleResult,
    		    	"isTrue":isTrue
    		    },
    		    dataType:'json',
    		    success:function(result){
    	    		console.log(result);
    	    		if(result.code==1){
    	    			layer.alert(result.msg);
    	    			return false;
    	    		}else if(result.code==0){
    	    			window.close();
    	    			window.opener.location.href = window.opener.location.href;//刷新父页面
    	    			 
    	    		}
    	    		
    	    		
    		    },
    		    error:function(){
    		    	layer.alert(errorMsg);
					//window.open("inqCheckPage.html?inquId="+4279003);//出现浏览器拦截现象
    	    	}
    		});
			/*e.stopPropagation();*/
		});   
	
		
