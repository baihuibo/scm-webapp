function getQueryString(name) { // js获取url地址以及 取得后面的参数
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

var chargebackId = getQueryString('chargebakcid');
var costcontractId = getQueryString('conId');
var businesstype = getQueryString('businesstype');
var contractCode = getQueryString('contractcode');



$("#iframeIdyeji").attr("src","/sales/performanceIncome/toExpectIncomeDetail.html?applyId="+getQueryString("chargebakcid"))


startInit('iframeId', 560);
startInit('iframeIdyeji', 560);

var browserVersion = window.navigator.userAgent.toUpperCase();
var isOpera = browserVersion.indexOf("OPERA") > -1 ? true : false;
var isFireFox = browserVersion.indexOf("FIREFOX") > -1 ? true : false;
var isChrome = browserVersion.indexOf("CHROME") > -1 ? true : false;
var isSafari = browserVersion.indexOf("SAFARI") > -1 ? true : false;
var isIE = (!!window.ActiveXObject || "ActiveXObject" in window);
var isIE9More = (! -[1, ] == false);
function reinitIframe(iframeId, minHeight) {
    try {
        var iframe = document.getElementById(iframeId);
        var bHeight = 0;
        if (isChrome == false && isSafari == false)
            bHeight = iframe.contentWindow.document.body.scrollHeight;

        var dHeight = 0;
        if (isFireFox == true)
            dHeight = iframe.contentWindow.document.documentElement.offsetHeight + 2;
        else if (isIE == false && isOpera == false)
            dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
        else if (isIE == true && isIE9More) {//ie9+
            var heightDeviation = bHeight - eval("window.IE9MoreRealHeight" + iframeId);
            if (heightDeviation == 0) {
                bHeight += 3;
            } else if (heightDeviation != 3) {
                eval("window.IE9MoreRealHeight" + iframeId + "=" + bHeight);
                bHeight += 3;
            }
        }
        else//ie[6-8]、OPERA
            bHeight += 3;

        var height = Math.max(bHeight, dHeight);
        if (height < minHeight) height = minHeight;
        iframe.style.height = height + "px";
    } catch (ex) { }
}
function startInit(iframeId, minHeight) {
    eval("window.IE9MoreRealHeight" + iframeId + "=0");
    window.setInterval("reinitIframe('" + iframeId + "'," + minHeight + ")", 100);
}




function reinitIframe(iframeIdyeji, minHeight) {
    try {
        var iframe = document.getElementById(iframeIdyeji);
        var bHeight = 0;
        if (isChrome == false && isSafari == false)
            bHeight = iframe.contentWindow.document.body.scrollHeight;

        var dHeight = 0;
        if (isFireFox == true)
            dHeight = iframe.contentWindow.document.documentElement.offsetHeight + 2;
        else if (isIE == false && isOpera == false)
            dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
        else if (isIE == true && isIE9More) {//ie9+
            var heightDeviation = bHeight - eval("window.IE9MoreRealHeight" + iframeIdyeji);
            if (heightDeviation == 0) {
                bHeight += 3;
            } else if (heightDeviation != 3) {
                eval("window.IE9MoreRealHeight" + iframeIdyeji + "=" + bHeight);
                bHeight += 3;
            }
        }
        else//ie[6-8]、OPERA
            bHeight += 3;

        var height = Math.max(bHeight, dHeight);
        if (height < minHeight) height = minHeight;
        iframe.style.height = height + "px";
    } catch (ex) { }
}
function startInit(iframeIdyeji, minHeight) {
    eval("window.IE9MoreRealHeight" + iframeIdyeji + "=0");
    window.setInterval("reinitIframe('" + iframeIdyeji + "'," + minHeight + ")", 100);
}



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
            //跳转到附件管理
            $('#goAttachment').off().on('click',function(){
                location.href=basePath+'/sign/chargeback/attachment.html'+urlDate;
            });
            //跳转到补充协议
            $('#goAgreement').off().on('click',function(){
                location.href=basePath+'/sign/chargeback/supplementalagreement.html'+urlDate;
            });
            //跳转到审批流程
            $('#goShenPlc').off().on('click',function(){
                location.href=basePath+'/sign/chargeback/auditprocess.html'+urlDate;
            });
            //跳转到费用执行明细
            $('#goFeiyzhixmx').off().on('click',function(){
                location.href=basePath+'/sign/chargeback/costdetail.html'+urlDate;
            });
        });
    }

}