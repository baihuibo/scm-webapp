(function ($, undefined){
    $.fn.imgZoom = function(options,param){
        
        var otherArgs = Array.prototype.slice.call(arguments, 1);
        if (typeof options == 'string') {
            var fn = this[0][options];
            if($.isFunction(fn)){
                return fn.apply(this, otherArgs);
            }else{
                throw ("imgZoom - No such method: " + options);
            }
        }

        return this.each(function(){

            var operimg_id;
            var zoom_rate=100;
            var zoom_timeout;    
            var currIndex=0;

            var self = this;  // 保存组件对象 
            //var aa=$(this).find('.img_in2').html();
            //console.log(aa)
//            console.log(self);
            this.init=function(){
                this.createHtml();

//                console.log($(self).find('div[class="out_imgDeal"]'));

            };    
            this.createHtml=function(){
                var img_divs=$(self).find('div[class="out_imgDeal"]');
                for(var i=0;i<img_divs.length;i++){
                	if($(img_divs[i]).find("span[name='zoom_span']").length==0){
                    	$(img_divs[i]).append('<p style="position:relative"><span style="font-size:18px;cursor:pointer;" name="zoom_span" index="'+i+'" class="glyphicon glyphicon-search _out"></span></p>');
                   }
                }
                $(self).find('span[name="zoom_span"]').bind('click',function(){
                	
                	self.setimgbox($(this).parent().parent().parent().index());
                     
                     
                });


            };    
            this.rotateimg=function (){
                //var smallImg=$("#"+operimg_id);
                var smallImg= $(self).find('img[class="upload_image1"]');
                var smallImg=$(smallImg[currIndex]);
                var num=smallImg.attr('curr_rotate');
                if(num==null){
                   num=0;
                }
                num=parseInt(num);
                num +=1;
                smallImg.attr('curr_rotate',num);

                $("#show_img").rotate({angle:90*num});
                smallImg.rotate({angle:90*num});
            };

            this.createOpenBox=function(){

                $('#operimg_box').remove();

                if($('#operimg_box').length==0){
                    var html = '    <div class="operimg_box" id="operimg_box">';
                    html += '       <img id="show_img" src="" onclick="get_imgsize()" />';
                    html += '       <span class="set_img percent_img" id="zoom_show" >percent</span>';
                    html += '       <span class="set_img zoomin" ></span>';
                    html += '       <span class="set_img zoomout"></span>';
                    //html += '       <span class="set_img ratateimg" id="btn_rotateimg" onclick="rotateimg()"></span>';
                    html += '       <span class="set_img ratateimg" id="btn_rotateimg" ></span>';
                    html += '       <span class="set_img close_img" id="delimg"></span>';
                    html += '       <span class="set_img arrowleft" ></span>';
                    html += '       <span class="set_img arrowright" ></span>';
                    html += '       <span class="set_img operarea_box"></span>';
                    html += '   </div><div class="clearboth"></div><div id="mask_bg" style="height:10000px"></div>';
                    $('body').append(html);     

                    $('#operimg_box').find('span[class="set_img zoomin"]').bind('click',function(){
                           self.zoomIn();
                    });
                    $('#operimg_box').find('span[class="set_img zoomout"]').bind('click',function(){
                           self.zoomOut();
                    });
                    $('#operimg_box').find('span[class="set_img ratateimg"]').bind('click',function(){
                           self.rotateimg();
                    });
                    $('#operimg_box').find('span[class="set_img arrowleft"]').bind('click',function(){
                           self.prevImg();
                    });
                    $('#operimg_box').find('span[class="set_img arrowright"]').bind('click',function(){
                           self.nextImg();
                    });


                }
            };
            this.get_imgsize=function(){
                var img_size=$("#show_img").width();
                //alert(img_size);
            };

            this.setNewIndex=function(isNext) {
                var imgs = $(self).find('img[class="upload_image1"]');
                var imgCount = imgs.length;
                //var currIndex = parseInt(operimg_id.replace("uploadImage_",""));
                if (isNext) {
                    currIndex += 1;
                    if (currIndex >= imgCount) {
                        currIndex = 0;
                    }
                } else {
                    currIndex -= 1;
                    if (currIndex < 0) {
                        currIndex  =imgCount-1;
                    }        
                }
                return currIndex;    
            };
            this.nextImg=function() {
                var index = this.setNewIndex(true);
                this.setimgbox(index);
            };
            this.prevImg=function() {
                var index = this.setNewIndex(false);
                this.setimgbox(index);
            };
            this.zoomIn=function() {
            	if(zoom_rate<300){
           		 zoom_rate += 10;
           	}else{
           		$('.set_img zoomin').unbind();//大于300时，清除放大按钮的点击事件
           	}    
                this.doZoom(zoom_rate);
                this.setoperimgbox();
            };
            this.zoomOut=function() {
            	if(zoom_rate>10){
            		 zoom_rate -= 10;
            	}else{
            		$('.set_img zoomout').unbind();//小于10时，清除缩小按钮的点击事件
            	}          
                this.doZoom(zoom_rate);
                this.setoperimgbox();
            };
            this.doZoom=function(zoom_rate){
            	//$("#show_img").css('width', zoom_rate + '%').css('height', zoom_rate + '%');	
                var naturalWidth= $("#show_img")[0].naturalWidth;
                $("#show_img").css('width', naturalWidth*zoom_rate*0.01+'px');

            	clearTimeout(zoom_timeout);
                zoom_rate=parseInt(zoom_rate);
            	$("#zoom_show").show();
            	$("#zoom_show").html(zoom_rate+'%');
            	zoom_timeout=setTimeout(function (){
            		$("#zoom_show").hide('fast');
            	},1000);
            };
            this.setoperimgbox=function(){
                var obImage=$("#operimg_box");
                var ob_width = obImage.width();
                var ob_height = obImage.height();
                //保证弹框在屏幕中央，弹框距离=（窗口高度-弹框高度）/2+滚动条到顶部距离
                var scoll = $(window).scrollTop();
                //alert(ob_width +":"+ob_height);
                var ob_left = (window.innerWidth-ob_width)/2;
                var ob_top = (window.innerHeight-ob_height)/2+scoll;
//                alert(ob_left+"   "+ob_top+" "+ ob_width+" "+ob_height+" "+window.innerWidth+" "+window.innerHeight+""+scoll);
                $("#operimg_box").css("left",ob_left).css("top",ob_top);
                $("#mask_bg").show();
                $("#operimg_box").show();
            };

            this.delimg=function(index){
                //var imgboxid=$(x).parent().parent().attr("id");
                var smallimgbox='uploadList_'+index;
                $("#"+smallimgbox).remove();

            };

            this.setimgbox=function(index){
                //alert('xxxx');
                this.createOpenBox();
                zoom_rate = 100;

                currIndex=Number(index);  
                console.log('currIndex='+currIndex+"--"+index);
               // operimg_id='uploadImage_'+index;

                var smallImg= $(self).find('img[class="upload_image1"]');
                //console.log(smallImg[0].naturalWidth);
                //[index]
                //var smallImg=$("#"+operimg_id);

//                  alert(smallImg[0].naturalWidth);

                var naturalWidth=smallImg[index].naturalWidth;
                var naturalHeight=smallImg[index].naturalHeight;
                zoom_rate=600/Math.max(naturalWidth,naturalHeight)*100;

                $("#show_img").attr("src",$(smallImg[index]).attr('src'));
                $("#mask_bg").show();
                $("#operimg_box").show();
                //$("#show_img").css('width', zoom_rate + '%').css('height', zoom_rate + '%');
                $("#show_img").css('width', naturalWidth*zoom_rate*0.01+'px');

                var num=$(smallImg[index]).attr('curr_rotate');
                $("#show_img").rotate({angle:90*num});

                $("#delimg").click(function(){
                    $("#show_img").attr("src","");
                    $("#operimg_box").hide();
                    $("#mask_bg").hide();
                });

                this.setoperimgbox();
            };

            this.downloadimg=function(){
            	var src=$("#show_img").attr("src");
            	DownLoadReportIMG(src);

            };
            this.DownLoadReportIMG=function(imgPathURL) {  
                //如果隐藏IFRAME不存在，则添加  
                if(!browserIsIe()){
                    downloads(imgPathURL);
                    return;
                }

                if (!document.getElementById("IframeReportImg"))  
                    $('<iframe style="display:none;" id="IframeReportImg" name="IframeReportImg" onload="DoSaveAsIMG();" width="0" height="0" src="about:blank"></iframe>').appendTo("body");  
                if (document.all.IframeReportImg.src != imgPathURL) {  
                    //加载图片  
                    document.all.IframeReportImg.src = imgPathURL;  
                }  
                else {  
                    //图片直接另存为  
                    DoSaveAsIMG();  
                }  
            };  
            this.DoSaveAsIMG=function() {  
                if (document.all.IframeReportImg.src != "about:blank")  
                    window.frames["IframeReportImg"].document.execCommand("SaveAs");  
            };  
            //判断是否为ie浏览器  
            this.browserIsIe=function() {  
                if (!!window.ActiveXObject || "ActiveXObject" in window)  
                    return true;  
                else  
                    return false;  
            };  
             this.downloads=function(src) {
                var $a = $("<a></a>").attr("href", src).attr("download", "img.jpg");
                $a[0].click();
            };

            this.init();
        });
    }

 })(jQuery);