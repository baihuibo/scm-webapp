(function($){
  $.fn.extend({
    slider:function(settings){
      var defaults={
        prev_btn:'',
        next_btn:'',
        speed:1000,
        count:2
      }
      var $pics=$(this);
      settings=$.extend(defaults,settings);
      var len=$pics.children('div').length,
        w=$pics.children('div:first').outerWidth(true),       
        count=settings.count,
        speed=settings.speed;
       $pics.width(len*w+20);

  $('.'+settings.next_btn).bind('click',prevFn);
   

    $('.'+settings.prev_btn).bind('click',nextFn);
    
    function nextFn(){
        if(!$pics.is(':animated')){
          $pics.stop().animate({'marginLeft':-w*count},speed,function(){
            $pics.children('div').slice(0,count).appendTo($pics);
            $pics.css('marginLeft','5%');
          })
        }
      }
    function prevFn(){
      if(!$pics.is(':animated')){
          $pics.css('marginLeft',-w*count).children('div').slice(len-count).prependTo($pics);
         $pics.stop().animate({'marginLeft':"5%"},speed)

     }
   }
  }
 })
})(jQuery)