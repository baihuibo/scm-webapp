var get_discountId=getUrlParam("discountId");
var getconid;
var chargeobject_val="";//获取 业主/客户 选择值
var arremployee=Array();//员工ids
var contype_key="";
var entrusttransfer="";
$(document).on("click",'#saveBtn',function(){
	getcheckboxval();
	ajaxSubmit();	
})
$(function(){
	//默认 业主和客户 两个checkbox都选中
	$("[name = chargeobject]:checkbox").attr("checked","checked");
    $("[name = chargeobject]:checkbox").click(function(){
    	setcommissionshow();
    	//选择服务费收取对象的时候
    	if(contype_key!=""){
        	if(contype_key=="买卖"){
        		if(entrusttransfer!=""){
        			setcommission_buy(entrusttransfer);
        		}    		
        	}else if(contype_key=="租赁"){
        		setcommission_lease();
        	}    		
    	}
    });
    
    //合同约定佣金计算
    //$("#J_discountForm").find("input[data-setcomm='setcomm' ]").blur(function(){setcommission_buy();});
    
    $("#J_discountForm").find("input[data-setcomm='setcomm']").on('input',function(e){    	
    	if(contype_key=="买卖"){
    		if(entrusttransfer!=""){
    			setcommission_buy(entrusttransfer);
    		}    		
    	}else if(contype_key=="租赁"){
    		setcommission_lease();
    	}
    	
    });
    
    //实时监听字数
    $('#J_edit_situationexplain').bind('input propertychange', function() {
        getinputNum();
    	check(this);
    });
});

function getinputNum(){
    var entered_length=$("#J_edit_situationexplain").val().length;
    var also_length=500-parseFloat(entered_length);
    //$(".entered").text(entered_length);
    $(".alsoinput").text(also_length);
}
function check(obj){
    var value = $(obj).val();
    var length = value.length;
    // 长度限制为500
    if(length>500){
        //截取前500个字符
        value = value.substring(0,500);
        alert("最多输入500字");
        $(obj).val(value);
        $(".alsoinput").text("0");
    }
}
/*
 * 根据选择 业主/客户 checkbox 判断显示哪个佣金
 * 客户 2 J_customer_box
 * 业主 1 J_owner_box
 * chargeobject
 * */
function setcommissionshow(){
	var chk_value =[];
	$('input[name="chargeobject"]:checked').each(function(){
		chk_value.push($(this).val()); 
	});
	
	if(chk_value=="1"){
    	$("#J_customer_box").hide();
    	$("#J_owner_box").show();
    	chargeobject_val="1";
	}else if(chk_value=="2"){
    	$("#J_owner_box").hide();
    	$("#J_customer_box").show();
    	chargeobject_val="2";
	}else if(chk_value=="2,1"){
    	$("#J_owner_box").show();
    	$("#J_customer_box").show();
    	chargeobject_val="0";
	}else{
    	$("#J_owner_box").hide();
    	$("#J_customer_box").hide();
	}
	
	return chargeobject_val;
}
/*function setcommissionshow(){
	var chk_value =[];
	$('input[name="chargeobject"]:checked').each(function(){
		chk_value.push($(this).val()); 
	});
	if(chk_value.indexOf("1")>-1){
		$("#J_owner_box").show();
	}else{
		$("#J_owner_box").hide();
	}
	
	if(chk_value.indexOf("2")>-1){
		$("#J_customer_box").show();
	}else{
		$("#J_customer_box").hide();
	}
	chargeobject_val=chk_value;
}*/
$(".J_audit_area").hide();
window.onload=function(){
	if(get_discountId!=null){	    //判断是新增还是修改
		$(".J_audit_area").show();
		editcontractdetail(get_discountId);
	}else{
	    //J_audit_area
		$(".J_audit_area").hide();
	}
}
/*
 * 获取url的参数
 * */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null)
        return unescape(r[2]);
    return null; //返回参数值
}
/* 打折原因不同，显示不同 */
$("#J_employee_box").hide();
$("#J_contract_box").hide();
$(document).delegate('#chargebackType', 'change', function(event){
    var sel_val=$("#chargebackType").val();
    switch(sel_val){
    case "3":
    	$("#J_employee_box").hide();
    	$("#J_contract_box").show();
    	break;
    case "4":
    	$("#J_contract_box").hide();
    	$("#J_employee_box").show();
    	break;
    }
});

/* 员工折扣select 处理 */
$("select#J_edit_discountreason").change(function(){
	//console.log($(this).val());
	var s_val=$(this).val();
	switch(s_val){
    case "3":
    	$("#J_employee_box").hide();
    	$("#J_contract_box").show();
    	$("#J_edit_contractnum").removeAttr("readonly");    	
    	break;
    case "4":
    	$("#J_contract_box").hide();
    	$("#J_employee_box").show();
    	break;
    default:
    	$("#J_contract_box").hide();
    	$("#J_employee_box").hide();
    }
});
/* 
 * 
 * 根据con_id 查询合同信息
 * */
function getcontractinfobyconid(con_id){
	getconid=con_id;
	jsonGetAjax(
		basePath + '/contract/discount/getConBasicInfoByConId',
		{
			"conId":con_id,
		},
		function(result) {
			console.log(result.data);

			//是否委托过户(0:否；1:是) 如果是1 则没有居间(客户、业主)
			entrusttransfer=result.data.entrustedtransfer;
			//$("#J_entrustedtransfer").attr("value",result.data.entrustedtransfer);
            $("#J_entrustedtransfer").val(result.data.entrustedtransfer);
//			console.log(result.data.signleasecontractuserinfo.cocustomerlist[0].full_name);
			//客户信息
//			var customer_list=result.data.signleasecontractuserinfo.customerlist[0];
//			console.log(cocustomer_list.full_name);			
			//业主信息
//			var owner_list=result.data.signleasecontractuserinfo.ownerlist[0];
			//合同名称
			$("#J_edit_contractcode").val(result.data.contractcode);
			//房源编号
			$("#J_edit_housescode").val(result.data.housescode);
			//客源编号
			$("#J_edit_customercode").val(result.data.customercode);
			// 业务类型 
			$("#J_edit_contracttype").val(result.data.contracttype);
			//客户姓名
			$("#J_edit_customername").val(result.data.customername);
			//业主姓名
			$("#J_edit_ownername").val(result.data.ownername);
			//折前佣金
			//$("#J_edit_perdiscountcomm").attr("value",result.data.ownername);
			//折后佣金
			//$("#J_edit_discountedcomm").attr("value",result.data.ownername);
			//总折扣
			//$("#J_edit_totaldiscount").attr("value",result.data.ownername);
			//所属部门
			$("#J_edit_deptname").val(result.data.deptname);
			//业主居间佣金
			$("#J_edit_ownerbrokfixcomm").val(result.data.ownerbrokfixcomm);
			//业主履约佣金
			$("#J_edit_ownerperffixcomm").val(result.data.ownerperffixcomm);
			//客户居间佣金
			$("#J_edit_customerbrokfixcomm").val(result.data.customerbrokfixcomm);
			//客户履约佣金
			$("#J_edit_customerperffixcomm").val(result.data.customerperffixcomm);

			contype_key=result.data.contracttype;
			
			if(contype_key=="租赁"){
				$(".J_brok_area").show();
				$(".J_total_area").show();
				$(".J_lease_area").hide();
				setcommission_lease();
			}else if(contype_key=="买卖"){
				$(".J_lease_area").show();
				$(".J_brok_area").show();
				$(".J_total_area").show();
				//设置各种佣金
				setcommission_buy(entrusttransfer);				
			}

			$(".isNaN input").each(function(index, element) {
				
				if(isNaN($(this).val()) || $(this).val()==""){
					$(this).val("0");
				}
		    });
			
		}
	);
}
/*
 * 买卖的各项佣金和折扣设置 (全部显示)
 * */
function setcommission_buy(entrusttransfer){
	var aa=setcommissionshow();//获取服务费收取对象  业主 1 客户 2 业主+客户 0
	//alert(aa);
	//业主居间佣金（公司规定）
	var ownerbrokfixcomm_val=parseFloat($("#J_edit_ownerbrokfixcomm").val());
	//业主履约佣金（公司规定）
	var ownerperffixcomm_val=parseFloat($("#J_edit_ownerperffixcomm").val());
	//客户居间佣金（公司规定）
	var customerbrokfixcomm_val=parseFloat($("#J_edit_customerbrokfixcomm").val());
	//客户履约佣金（公司规定）
	var customerperffixcomm_val=parseFloat($("#J_edit_customerperffixcomm").val());
	
	//业主居间佣金（合同规定）
	var ownerbrokcomm_val=parseFloat($("#J_edit_ownerbrokcomm").val());
	//业主履约佣金（合同规定）
	var ownerperfcomm_val=parseFloat($("#J_edit_ownerperfcomm").val());
	//客户居间佣金（合同规定）
	var customerbrokcomm_val=parseFloat($("#J_edit_customerbrokcomm").val());
	//客户履约佣金（合同规定）
	var customerperfcomm_val=parseFloat($("#J_edit_customerperfcomm").val());
	
	//业主佣金合计（公司规定）
	var ownertotal_val=ownerbrokfixcomm_val+ownerperffixcomm_val;
	//$("#J_ownertotalcost_company").attr("value",ownertotal_val);
	$("#J_ownertotalcost_company").val(ownertotal_val);
	//客户佣金合计（公司规定）
	var customertotal_val=customerbrokfixcomm_val+customerperffixcomm_val;
	//$("#J_customertotalcost_company").attr("value",customertotal_val);
	$("#J_customertotalcost_company").val(customertotal_val);
	//业主佣金合计（合同规定）
	var ownertotalcost_con_val=ownerbrokcomm_val+ownerperfcomm_val;
	//$("#J_ownertotalcost_contract").attr("value",ownertotalcost_con_val);
	$("#J_ownertotalcost_contract").val(ownertotalcost_con_val);
	//客户佣金合计（合同规定）
	var customertotalcost_con_val=customerbrokcomm_val+customerperfcomm_val;
	//$("#J_customertotalcost_contract").attr("value",customertotalcost_con_val);
	$("#J_customertotalcost_contract").val(customertotalcost_con_val);

	//业主居间折扣（折）= 业主居间佣金（合同规定）/业主居间佣金（公司规定）
	var ownerbrokcommdiscount=(ownerbrokcomm_val/ownerbrokfixcomm_val*10).toFixed(2);
	//$("#J_edit_ownerbrokdisc").attr("value",ownerbrokcommdiscount);
	$("#J_edit_ownerbrokdisc").val(ownerbrokcommdiscount);
	//业主履约折扣（折）= 业主履约佣金（合同规定）/业主履约佣金（公司规定）
	var ownerperfcommdiscount=(ownerperfcomm_val/ownerperffixcomm_val*10).toFixed(2);
	//$("#J_edit_ownerperfdisc").attr("value",ownerperfcommdiscount);
	$("#J_edit_ownerperfdisc").val(ownerperfcommdiscount);
	//业主总折扣(折) = 业主佣金合计（合同规定）/业主佣金合计（公司规定）
	var ownertotaldiscount=(ownertotalcost_con_val/ownertotal_val*10).toFixed(2);
	//$("#J_ownertotal_discount").attr("value",ownertotaldiscount);
	$("#J_ownertotal_discount").val(ownertotaldiscount);
	//客户居间折扣（折）= 客户居间佣金（合同规定）/客户居间佣金（公司规定）
	var customerbrokcommdiscount=(customerbrokcomm_val/customerbrokfixcomm_val*10).toFixed(2);
	//$("#J_edit_customerbrokdisc").attr("value",customerbrokcommdiscount);
	$("#J_edit_customerbrokdisc").val(customerbrokcommdiscount);
	//客户履约折扣（折）= 客户履约佣金（合同规定）/客户履约佣金（公司规定）
	var customerperfcommdiscount=(customerperfcomm_val/customerperffixcomm_val*10).toFixed(2);
	//$("#J_edit_customerperfdisc").attr("value",customerperfcommdiscount);
	$("#J_edit_customerperfdisc").val(customerperfcommdiscount);
	//客户总折扣(折) = 客户佣金合计（合同规定）/客户佣金合计（公司规定）
	var customertotaldiscount=(customertotalcost_con_val/customertotal_val*10).toFixed(2);
	//$("#J_customertotal_discount").attr("value",customertotaldiscount);
	$("#J_customertotal_discount").val(customertotaldiscount);

	
	//折前佣金=业主佣金合计（公司规定）+客户佣金合计（公司规定）
	var perdiscomm=ownertotal_val+customertotal_val;
	//$("#J_edit_perdiscountcomm").attr("value",perdiscomm);
	$("#J_edit_perdiscountcomm").val(perdiscomm);
	//折后佣金=业主佣金合计（合同规定）+客户佣金合计（合同规定）
	var discomm=parseFloat(ownertotalcost_con_val)+parseFloat(customertotalcost_con_val);
	//$("#J_edit_discountedcomm").attr("value",discomm);
	$("#J_edit_discountedcomm").val(discomm);
	//总折扣(折)=折后佣金(元)/折前佣金(元)
	var totaldis=parseFloat(discomm/perdiscomm*10).toFixed(2);
	//$("#J_edit_totaldiscount").attr("value",totaldis);
	$("#J_edit_totaldiscount").val(totaldis);

	/*if(totaldis>=10){
		$(".J_discount_area").hide();
	}else{
		$(".J_discount_area").show();
	}*/
/*
	//业主履约佣金（合同规定）
	var ownerperfcomm_val=parseFloat($("#J_edit_ownerperfcomm").val());
	//客户履约佣金（合同规定）
	var customerperfcomm_val=parseFloat($("#J_edit_customerperfcomm").val());
	*/
	if(entrusttransfer=="1"){
		$(".J_brok_area").hide();
		$(".J_total_area").hide();
		var en_discomm=ownerperffixcomm_val+customerperffixcomm_val;
		$("#J_edit_perdiscountcomm").val(en_discomm);
		var en_perdiscomm=ownerperfcomm_val+customerperfcomm_val;
		$("#J_edit_discountedcomm").val(en_perdiscomm);
		$("#J_edit_totaldiscount").val(parseFloat(en_perdiscomm/en_discomm*10).toFixed(2));
	}
	
	$(".isNaN input").each(function(index, element) {
		if(isNaN($(this).val())){
			//alert($(this).val());
			$(this).val("0");
		}
    });
	/*
	 * var aa=setcommissionshow();//获取服务费收取对象  业主 1;  客户 2;  业主+客户 0
	 * 买卖显示全部信息
	 * 判断服务费收取对象
	 * 
	 * */
	//alert(entrusttransfer);
	if(aa=="1"){//选择业主
		//业主佣金合计(公司规定)
		var ot_com=$("#J_ownertotalcost_company").val();
		//折前佣金
		$("#J_edit_perdiscountcomm").val(ot_com);
		//业主佣金合计(合同约定)
		var ot_con=$("#J_ownertotalcost_contract").val();
		//折后佣金
		$("#J_edit_discountedcomm").val(ot_con);
		//总折扣
		$("#J_edit_totaldiscount").val(parseFloat(ot_con/ot_com*10).toFixed(2));
		if(entrusttransfer=="1"){
			// 业主履约佣金 (公司规定)
			var op_com=$("#J_edit_ownerperffixcomm").val();
			// 业主履约佣金(合同约定)
			var op_con=$("#J_edit_ownerperfcomm").val();
			// 折前佣金
			$("#J_edit_perdiscountcomm").val(op_com);
			// 折后佣金
			$("#J_edit_discountedcomm").val(op_con);
			// 总折扣
			$("#J_edit_totaldiscount").val(parseFloat(op_con/op_com*10).toFixed(2));
		}
		// alert("111");
	}else if(aa=="2"){//选择客户
		// 客户佣金合计(公司规定)
		var ct_com=$("#J_customertotalcost_company").val();
		// 客户佣金合计(合同约定)
		var ct_con=$("#J_customertotalcost_contract").val();
		// 折前佣金
		$("#J_edit_perdiscountcomm").val(ct_com);
		// 折后佣金
		$("#J_edit_discountedcomm").val(ct_con);
		// 总折扣
		$("#J_edit_totaldiscount").val(parseFloat(ct_con/ct_com*10).toFixed(2));

		if(entrusttransfer=="1"){
			// 客户履约佣金 (公司规定)
			var cp_com=$("#J_edit_customerperffixcomm").val();
			// 客户履约佣金(合同约定)
			var cp_con=$("#J_edit_customerperfcomm").val();
			// 折前佣金
			$("#J_edit_perdiscountcomm").val(cp_com);
			// 折后佣金
			$("#J_edit_discountedcomm").val(cp_con);
			// 总折扣
			$("#J_edit_totaldiscount").val(parseFloat(cp_con/cp_com*10).toFixed(2));
		}
		
		// alert("222");
	}
	// else 正常全选状态
	// alert(aa);
}

/*
 * 租赁的各项佣金和折扣设置 (部分显示)
 * */
function setcommission_lease(){
	var aa=setcommissionshow();//获取服务费收取对象  业主 1 客户 2 业主+客户 0
	/*
	 * 折前佣金就是公司规定的业主居间+客户居间
	 * 折后佣金是合同约定的业主居间+客户居间
	 * 总折扣就是折后除以折前
	 * */
	
	//业主居间佣金（公司规定）
	var ownerbrokfixcomm_val=parseFloat($("#J_edit_ownerbrokfixcomm").val());
	//客户居间佣金（公司规定）
	var customerbrokfixcomm_val=parseFloat($("#J_edit_customerbrokfixcomm").val());
	
	//业主居间佣金（合同规定）
	var ownerbrokcomm_val=parseFloat($("#J_edit_ownerbrokcomm").val());
	//客户居间佣金（合同规定）
	var customerbrokcomm_val=parseFloat($("#J_edit_customerbrokcomm").val());


	//业主居间折扣（折）= 业主居间佣金（合同规定）/业主居间佣金（公司规定）
	var ownerbrokcommdiscount=(ownerbrokcomm_val/ownerbrokfixcomm_val*10).toFixed(2);
	$("#J_edit_ownerbrokdisc").val(ownerbrokcommdiscount);

	//客户居间折扣（折）= 客户居间佣金（合同规定）/客户居间佣金（公司规定）
	var customerbrokcommdiscount=(customerbrokcomm_val/customerbrokfixcomm_val*10).toFixed(2);
	$("#J_edit_customerbrokdisc").val(customerbrokcommdiscount);

	//折前佣金=业主居间（公司规定）+客户居间（公司规定）
	var perdiscomm=parseFloat(ownerbrokfixcomm_val)+parseFloat(customerbrokfixcomm_val);
	$("#J_edit_perdiscountcomm").val(perdiscomm);
	
	//折后佣金=业主居间（合同约定）+客户居间（合同约定）
	var discomm=parseFloat(ownerbrokcomm_val)+parseFloat(customerbrokcomm_val);
	$("#J_edit_discountedcomm").val(discomm);
	
	//总折扣(折)=折后佣金(元)/折前佣金(元)
	var totaldis=parseFloat(discomm/perdiscomm*10).toFixed(2);
	$("#J_edit_totaldiscount").val(totaldis);

/*	if(totaldis>=10){
		$(".J_discount_area").hide();
	}else{
		$(".J_discount_area").show();
	}*/
	
	
	$(".isNaN input").each(function(index, element) {
		if(isNaN($(this).val())){
			$(this).val("0");
		}
    });
	/*
	 * var aa=setcommissionshow();//获取服务费收取对象  业主 1;  客户 2;  业主+客户 0
	 * 买卖显示全部信息
	 * 判断服务费收取对象
	 * 
	 * */
	//alert(entrusttransfer);
	if(aa=="1"){//选择业主
		//业主居间佣金(公司规定)
		var ob_com=$("#J_edit_ownerbrokfixcomm").val();
		//折前佣金
		$("#J_edit_perdiscountcomm").val(ob_com);
		//业主居间佣金(合同约定)
		var ob_con=$("#J_edit_ownerbrokcomm").val();
		//折后佣金
		$("#J_edit_discountedcomm").val(ob_con);
		//总折扣
		$("#J_edit_totaldiscount").val(parseFloat(ob_con/ob_com*10).toFixed(2));
		// alert("111");
	}else if(aa=="2"){//选择客户
		//客户居间佣金(公司规定)
		var cb_com=$("#J_edit_customerbrokfixcomm").val();
		$("#J_edit_perdiscountcomm").val(cb_com);
		//客户居间佣金(合同约定)
		var cb_con=$("#J_edit_customerbrokcomm").val();
		$("#J_edit_totaldiscount").val(cb_con);
		//折后佣金
		$("#J_edit_totaldiscount").val(parseFloat(cb_con/cb_com*10).toFixed(2));
		
		// alert("222");
	}
	// else 正常全选状态
	//alert(aa);
}


/* 
 * 判断是否已选择服务费收取对象 业主/客户
 */
function getcheckboxval(){
	var chk_val=[];
	$('input[name="chargeobject"]:checked').each(function(){
		chk_val.push($(this).attr("value"));
	});
	if(chk_val.length==0){
		commonContainer.alert("请选择服务费收取对象！");
	}
	//alert(chk_val.length==0 ?'':chk_val);
}
/*折扣新增*/
function editcontractinfo_insert(){
	var customerbrokcomm_val=$("#J_edit_customerbrokcomm").val();//客户居间佣金
	var customerbrokdisc_val=$("#J_edit_customerbrokdisc").val();//客户居间折扣
	var customerperfcomm_val=$("#J_edit_customerperfcomm").val();//客户履约佣金
	var customerperfdisc_val=$("#J_edit_customerperfdisc").val();//客户履约折扣
	var discountreason_val=$("#J_edit_discountreason").val();//打折原因 select
	var ownerbrokcomm_val=$("#J_edit_ownerbrokcomm").val();//业主居间佣金
	var ownerbrokdisc_val=$("#J_edit_ownerbrokdisc").val();//业主居间折扣
	var ownerperfcomm_val=$("#J_edit_ownerperfcomm").val();//业主履约佣金
	var ownerperfdisc_val=$("#J_edit_ownerperfdisc").val();//业主履约折扣
	var situationexplain_val=$("#J_edit_situationexplain").val();//情况说明
	var totaldisc_val=$("#J_edit_totaldiscount").val();//总折扣
	var associateid_val=$("#J_edit_employee").val();//关联ID ,员工ID/合同ID
	
	var discountreason_id=$("#J_edit_discountreason").val();
	var discountreason_val=$("#J_edit_situationexplain").val();//打折原因 select id
	var associateid;//合同编号或者员工编号
	var discountreasonid;//打折原因 id
	if(discountreason_id=="3"){//合同编号
		associateid=$("#J_edit_contractnum").val();
	}else if(discountreason_id=="4"){//员工编号
		associateid=arremployee;
		//associateid=$("#J_edit_employee").val();
	}else{
		associateid="";
		discountreason_val="";
	}
	if(discountreason_id=="3" || discountreason_id=="4"){//3 多次成交 、4 公司员工 
		//hasreasons
		var idtxt=$("#J_edit_contractnum").val(); //3
		var nametxt=$("#J_edit_employee").text(); //4
		//alert(idtxt);
		if(discountreason_id=="3" && idtxt==""){
			layer.alert("请输入合同编号");
			return false;	
		}
		if(discountreason_id=="4" && nametxt==""){
			layer.alert("请输入员工编号");
			return false;	
		}
		
		jsonPostAjax(basePath + '/contract/discount/add',
		{		
			"chargeobject":chargeobject_val,		//chargeobject (string, optional): 收费对象(0:全部，1:业主，2:客户) ,
			"conid": getconid,				//conid (string, optional): 合同主键ID ,
			"customerbrokcomm": customerbrokcomm_val,	//customerbrokcomm (string, optional): 客户居间佣金 ,
			"customerbrokdisc": customerbrokdisc_val,	//customerbrokdisc (string, optional): 客户居间折扣 ,
			"customerperfcomm": customerperfcomm_val,	//customerperfcomm (string, optional): 客户履约佣金 ,
			"customerperfdisc": customerperfdisc_val,	//customerperfdisc (string, optional): 客户履约折扣 ,
			"discountreason": discountreason_id,		//discountreason (string, optional): 打折原因(1:客户业主要求打折,2:中介合作,3:二次或多次成交,4:公司员工,5:其他公司抢单,6:其他原因) ,
			"ownerbrokcomm": ownerbrokcomm_val,		//ownerbrokcomm (string, optional): 业主居间佣金 ,
			"ownerbrokdisc": ownerbrokdisc_val,		//ownerbrokdisc (string, optional): 业主居间折扣 ,
			"ownerperfcomm": ownerperfcomm_val,		//ownerperfcomm (string, optional): 业主履约佣金 ,
			"ownerperfdisc": ownerperfdisc_val,		//ownerperfdisc (string, optional): 业主履约折扣 ,
			"reasons": [{	//reasons (Array[新增折扣原因], optional): 员工id或之前的合同id，如果有 ,
							//就是选3或者4了就传，没选这两个值就不传？
							//TODO 根据打折原因判断 userid  或者 合同编号 页面 选的 员工 就是 userid 选的 合同 就是 合同编号， 合同编号是手写的
			            	"associateid": associateid,//associateid (string, optional): 关联ID ,		            	
			            	"discountreason": discountreason_id	//discountreason (integer, optional): 打折原因(3:二次或多次成交,4:公司员工)
			            }],
	        "situationexplain": situationexplain_val,	//situationexplain (string, optional): 情况说明 ,
	        "totaldisc": totaldisc_val			//totaldisc (string, optional): 总折扣        	
		}, function(result) {
//			commonContainer.alert("操作成功!");
			layer.alert('操作成功!', {
				skin: 'layui-layer-lan',
				closeBtn:0,  // 是否显示关闭按钮
				yes:function(){
					location.href=basePath+"/contract/discount/detail?discountId="+result.data;
				}
			});
			
		},{});
	}else{
		/*var aaa=chargeobject_val+":"+getconid+":"+customerbrokcomm_val+":"+customerbrokdisc_val+":"+customerperfcomm_val+":"+customerperfdisc_val+":";
		aaa+=discountreason_id+":"+ownerbrokcomm_val+":"+ownerbrokdisc_val+":"+ownerperfcomm_val+":"+ownerperfdisc_val+":"+situationexplain_val+":"+totaldisc_val;
		alert(aaa);
		console.log(aaa);*/
		//noreasons
		jsonPostAjax(basePath + '/contract/discount/add',{
			"chargeobject":chargeobject_val,//chargeobject (string, optional): 收费对象(0:全部，1:业主，2:客户) ,
			"conid": getconid,//conid (string, optional): 合同主键ID ,
			"customerbrokcomm": customerbrokcomm_val,//customerbrokcomm (string, optional): 客户居间佣金 ,
			"customerbrokdisc": customerbrokdisc_val,//customerbrokdisc (string, optional): 客户居间折扣 ,
			"customerperfcomm": customerperfcomm_val,//customerperfcomm (string, optional): 客户履约佣金 ,
			"customerperfdisc": customerperfdisc_val,//customerperfdisc (string, optional): 客户履约折扣 ,
			"discountreason": discountreason_id,//discountreason (string, optional): 打折原因(1:客户业主要求打折,2:中介合作,3:二次或多次成交,4:公司员工,5:其他公司抢单,6:其他原因) ,
			"ownerbrokcomm": ownerbrokcomm_val,//ownerbrokcomm (string, optional): 业主居间佣金 ,
			"ownerbrokdisc": ownerbrokdisc_val,//ownerbrokdisc (string, optional): 业主居间折扣 ,
			"ownerperfcomm": ownerperfcomm_val,//ownerperfcomm (string, optional): 业主履约佣金 ,
			"ownerperfdisc": ownerperfdisc_val,//ownerperfdisc (string, optional): 业主履约折扣 ,
	        "situationexplain": situationexplain_val,//situationexplain (string, optional): 情况说明 ,
	        "totaldisc": totaldisc_val			//totaldisc (string, optional): 总折扣        	
		}, function(result) {
			/*commonContainer.alert("操作成功.");
			location.href=basePath+"/contract/discount/detail?discountId="+result.data;*/

			layer.alert('操作成功!', {
	//			skin: 'layui-layer-lan',
//				closeBtn:0,  // 是否显示关闭按钮
				yes:function(){
					location.href=basePath+"/contract/discount/detail?discountId="+result.data;
				}
			});
		}, {});
	}
}
function hasreasons(){
	jsonPostAjax(basePath + '/contract/discount/add',
	{		
		"chargeobject":chargeobject_val,		//chargeobject (string, optional): 收费对象(0:全部，1:业主，2:客户) ,
		"conid": getconid,				//conid (string, optional): 合同主键ID ,
		"customerbrokcomm": customerbrokcomm_val,	//customerbrokcomm (string, optional): 客户居间佣金 ,
		"customerbrokdisc": customerbrokdisc_val,	//customerbrokdisc (string, optional): 客户居间折扣 ,
		"customerperfcomm": customerperfcomm_val,	//customerperfcomm (string, optional): 客户履约佣金 ,
		"customerperfdisc": customerperfdisc_val,	//customerperfdisc (string, optional): 客户履约折扣 ,
		"discountreason": discountreason_id,		//discountreason (string, optional): 打折原因(1:客户业主要求打折,2:中介合作,3:二次或多次成交,4:公司员工,5:其他公司抢单,6:其他原因) ,
		"ownerbrokcomm": ownerbrokcomm_val,		//ownerbrokcomm (string, optional): 业主居间佣金 ,
		"ownerbrokdisc": ownerbrokdisc_val,		//ownerbrokdisc (string, optional): 业主居间折扣 ,
		"ownerperfcomm": ownerperfcomm_val,		//ownerperfcomm (string, optional): 业主履约佣金 ,
		"ownerperfdisc": ownerperfdisc_val,		//ownerperfdisc (string, optional): 业主履约折扣 ,
		"reasons": [{	//reasons (Array[新增折扣原因], optional): 员工id或之前的合同id，如果有 ,
						//就是选3或者4了就传，没选这两个值就不传？
						//TODO 根据打折原因判断 userid  或者 合同编号 页面 选的 员工 就是 userid 选的 合同 就是 合同编号， 合同编号是手写的
		            	"associateid": associateid,//associateid (string, optional): 关联ID ,		            	
		            	"discountreason": discountreason_id	//discountreason (integer, optional): 打折原因(3:二次或多次成交,4:公司员工)
		            }],
        "situationexplain": situationexplain_val,	//situationexplain (string, optional): 情况说明 ,
        "totaldisc": totaldisc_val			//totaldisc (string, optional): 总折扣        	
	}, function() {
		commonContainer.alert("操作成功has");
		//location.reload();
	},{});
}
function noreasons(){
	jsonPostAjax(basePath + '/contract/discount/add',
	{		
		"chargeobject":chargeobject_val,		//chargeobject (string, optional): 收费对象(0:全部，1:业主，2:客户) ,
		"conid": getconid,						//conid (string, optional): 合同主键ID ,
		"customerbrokcomm": customerbrokcomm_val,	//customerbrokcomm (string, optional): 客户居间佣金 ,
		"customerbrokdisc": customerbrokdisc_val,	//customerbrokdisc (string, optional): 客户居间折扣 ,
		"customerperfcomm": customerperfcomm_val,	//customerperfcomm (string, optional): 客户履约佣金 ,
		"customerperfdisc": customerperfdisc_val,	//customerperfdisc (string, optional): 客户履约折扣 ,
		"discountreason": discountreason_id,		//discountreason (string, optional): 打折原因(1:客户业主要求打折,2:中介合作,3:二次或多次成交,4:公司员工,5:其他公司抢单,6:其他原因) ,
		"ownerbrokcomm": ownerbrokcomm_val,		//ownerbrokcomm (string, optional): 业主居间佣金 ,
		"ownerbrokdisc": ownerbrokdisc_val,		//ownerbrokdisc (string, optional): 业主居间折扣 ,
		"ownerperfcomm": ownerperfcomm_val,		//ownerperfcomm (string, optional): 业主履约佣金 ,
		"ownerperfdisc": ownerperfdisc_val,		//ownerperfdisc (string, optional): 业主履约折扣 ,
        "situationexplain": situationexplain_val,	//situationexplain (string, optional): 情况说明 ,
        "totaldisc": totaldisc_val					//totaldisc (string, optional): 总折扣        	
	}, function() {
		commonContainer.alert("操作成功");
		//location.reload();
	},{});
}

/* 编辑展示 */
function editcontractdetail(get_discountId){
	jsonGetAjax(basePath + '/contract/discount/getDetail', 
	{		
		"discountId":get_discountId
	}, function(result) {
		console.log(result.data);
		for(var key in result.data){
			/*if($("#tab-11 #J_edit_"+key).hasClass('input')){
				alert($("#tab-11 #J_edit_"+key).val());
				$("#tab-11 #J_edit_"+key).attr("value",result.data[key]);
			}*/
			
			if($("#tab-11 #J_edit_"+key)){
				$("#tab-11 #J_edit_"+key).attr("value",result.data[key]);
			}
		}
		$("#J_edit_signnumber").text(result.data.signnumber);
		$("#J_edit_auditstatus").text(result.data.auditstatus);
		//折扣原因
		//$("#J_edit_discountreason").attr("value",result.data.discountreason);
		$("#J_edit_discountreason option[value='" + result.data.discountreason + "']").attr("selected", true);  
		$("#J_edit_situationexplain").val(result.data.situationexplain);
		var costobj=result.data.chargeobject;
		switch(costobj){
		case "0":
			$('input[name="chargeobject"]').attr("checked",true);
			break;
		case "1":
			$('input[value="'+costobj+'"]').attr("checked",true);
            $('input[value="2"]').attr("checked",false);
            $("#J_customer_box").hide();
			break;
		case "2":
			$('input[value="'+costobj+'"]').attr("checked",true);
            $('input[value="1"]').attr("checked",false);
            $("#J_owner_box").hide();
			break;
		}
		if(result.data.discountreason=="4"){
			//打折原因，员工姓名
			$("#J_employee_box").show();
			var aname=result.data.reasonlist[0].associatename;
			var aid=result.data.reasonlist[0].associateid;

			var newnames=aname.split(",");
			//员工编号的字符串形式为["20","30","40"] 以下为去掉[ " ] 这三个字符的方法，将字符串变为 20,30,40 
			var newids=aid.replace(/"([^"]*)"/g, "$1").replace("[","").replace("]","");
			newids=newids.split(",");
			var html="";
			for(var i=0;i<newnames.length;i++){
				html+='<span class="J_employee_del" data-id="'+newids[i]+'">'+newnames[i]+'&nbsp;&nbsp;<label>×</label></span>';
			}			
			$("#J_edit_employee").html(html);	
		}
		//console.log(result.data);
		if(result.data.discountreason=="3"){
			//打折原因，二次或多次成交
			$("#J_contract_box").show();
			$("#J_edit_contractnum").removeAttr("readonly");
			$("#J_edit_contractnum").val(result.data.reasonlist[0].associatename);
		}
		getinputNum();//获取字数
		contype_key=result.data.contracttype;
		
		//买卖类型 计算佣金
		var comm_buy=function(){
			//打折原因，合同编号
			//$("#J_edit_contractnum").text();

			/* 
			 * J_ownertotalcost_company
			 * 业主佣金合计=业主居间佣金+业主履约佣金（公司规定）
			 * ownerbrokfixcomm + ownerperffixcomm
			 * 
			 * ownertotalcost_contract
			 * 业主佣金合计=业主居间佣金+业主履约佣金（合同约定）
			 * ownerbrokcomm + ownerperfcomm
			 * 
			 * 业主总折扣=业主佣金合计（合同约定）/业主佣金合计（公司规定）
			 * J_total_discount
			 *
			 * 总折扣(折)=折后佣金(元)/折前佣金(元)
			 * */
			//业主佣金合计（公司规定）
			var otc_com=result.data.ownerbrokfixcomm + result.data.ownerperffixcomm;
			$("#J_ownertotalcost_company").attr("value",otc_com);
			
			//业主佣金合计（合同约定）
			var otc_con=result.data.ownerbrokcomm + result.data.ownerperfcomm;
			$("#J_ownertotalcost_contract").attr("value",otc_con);
			
			//业主总折扣
			var ot_d=(otc_con/otc_com*10).toFixed(2);
			$("#J_ownertotal_discount").attr("value",ot_d);		
			
			//客户佣金合计（公司规定）
			var ctc_com=result.data.customerbrokfixcomm + result.data.customerperffixcomm;
			$("#J_customertotalcost_company").attr("value",ctc_com);
			
			//客户佣金合计（合同约定）
			var ctc_con=result.data.customerbrokcomm + result.data.customerperfcomm;
			$("#J_customertotalcost_contract").attr("value",ctc_con);
			
			//客户总折扣
			var ct_d=(ctc_con/ctc_com*10).toFixed(2);
			$("#J_customertotal_discount").attr("value",ct_d);
			
			//折前佣金=业主佣金合计（公司规定）+客户佣金合计（公司规定）
			var perdiscomm=otc_com+ctc_com;
			$("#J_edit_perdiscountcomm").attr("value",perdiscomm);
			//折后佣金=业主佣金合计（合同规定）+客户佣金合计（合同规定）
			var discomm=otc_con+ctc_con;
			$("#J_edit_discountedcomm").attr("value",discomm);
			//总折扣(折)=折后佣金(元)/折前佣金(元)
			var totaldis=(discomm/perdiscomm*10).toFixed(2);
			$("#J_edit_totaldiscount").attr("value",totaldis);
			
			/*if(totaldis>=10){
				$(".J_discount_area").hide();
			}else{
				$(".J_discount_area").show();
			}*/

		}

		$(".J_brok_area").show();
		$(".J_total_area").show();
		if(contype_key=="租赁"){
			/*
			 * 折前佣金就是公司规定的业主居间+客户居间
			 * 折后佣金是合同约定的业主居间+客户居间
			 * 总折扣就是折后除以折前
			 * */
			$(".J_lease_area").hide();
			
		}else if(contype_key=="买卖"){
			$(".J_lease_area").show();
			comm_buy();
		}

		var totaldis=$("#J_edit_totaldiscount").val();
		/*if(totaldis>=10){
			$(".J_discount_area").hide();
		}else{
			$(".J_discount_area").show();
		}*/
		entrusttransfer=$("#J_edit_entrustedtransfer").val();
		if(entrusttransfer=="1"){
			$(".J_brok_area").hide();
			$(".J_total_area").hide();
			var ownerfcomm=parseFloat($("#J_edit_ownerperffixcomm").val());
			var customerfcomm=parseFloat($("#J_edit_customerperffixcomm").val());
			var perdcomm=$("#J_edit_perdiscountcomm").val(ownerfcomm+customerfcomm);
			
			var ownercomm=parseFloat($("#J_edit_ownerperfcomm").val());
			var customercomm=parseFloat($("#J_edit_customerperfcomm").val());
			var dcomm=$("#J_edit_discountedcomm").val(ownercomm+customercomm);
			
			
			var ownerdisc=parseFloat($("#J_edit_ownerperfdisc").val());
			var customerdisc=parseFloat($("#J_edit_customerperfdisc").val());
			var tdiscount=(ownerdisc+customerdisc)/2;
			
			$("#J_edit_totaldiscount").val(tdiscount);			
		}

		/*var ot_d=(otc_con/otc_com*10).toFixed(2);
		$("#J_ownertotal_discount").attr("value",ot_d);*/	
	})
}
/* 编辑update */
function editcontract_update(get_discountId){
	 /*新增折扣 {
		 chargeobject (string, optional):收费对象(0:全部，1:业主，2:客户) ,
		 conid (string, optional):合同主键ID ,
		 customerbrokcomm (string, optional):客户居间佣金 ,
		 customerbrokdisc (string, optional):客户居间折扣 ,
		 customerperfcomm (string, optional):客户履约佣金 ,
		 customerperfdisc (string, optional):客户履约折扣 ,
		 discountid (integer, optional):折扣主键ID ,
		 discountreason (string, optional):打折原因(1:客户业主要求打折,2:中介合作,3:二次或多次成交,4:公司员工,5:其他公司抢单,6:其他原因) ,
		 ownerbrokcomm (string, optional):业主居间佣金 ,
		 ownerbrokdisc (string, optional):业主居间折扣 ,
		 ownerperfcomm (string, optional):业主履约佣金 ,
		 ownerperfdisc (string, optional):业主履约折扣 ,
		 reasons (Array[新增折扣原因], optional):员工id或之前的合同id，如果有 ,
		 situationexplain (string, optional):情况说明 ,
		 totaldisc (string, optional):总折扣
		 }
		 新增折扣原因 {
		 associateid (string, optional):关联ID ,
		 discountreason (integer, optional):打折原因(3:二次或多次成交,4:公司员工)
		 } */
	var customerbrokcomm_val=$("#J_edit_customerbrokcomm").val();//客户居间佣金
	var customerbrokdisc_val=$("#J_edit_customerbrokdisc").val();//客户居间折扣
	var customerperfcomm_val=$("#J_edit_customerperfcomm").val();//客户履约佣金
	var customerperfdisc_val=$("#J_edit_customerperfdisc").val();//客户履约折扣
	
	var ownerbrokcomm_val=$("#J_edit_ownerbrokcomm").val();//业主居间佣金
	var ownerbrokdisc_val=$("#J_edit_ownerbrokdisc").val();//业主居间折扣
	var ownerperfcomm_val=$("#J_edit_ownerperfcomm").val();//业主履约佣金
	var ownerperfdisc_val=$("#J_edit_ownerperfdisc").val();//业主履约折扣
	var situationexplain_val=$("#J_edit_situationexplain").val();//情况说明
	var totaldisc_val=$("#J_edit_totaldiscount").val();//总折扣
	
	var associateid_val=$("#J_edit_employee").attr("value");//关联ID ,员工ID/合同ID
	$("#J_edit_contractnum").attr("value");

	var discountreason_id=$("#J_edit_discountreason").val();
	var discountreason_val=$("#J_edit_situationexplain").val();//打折原因 select id
	var associateid;//合同编号或者员工编号
	var discountreasonid;//打折原因 id
	if(discountreason_id=="3"){
		associateid=$("#J_edit_contractnum").val();
	}else if(discountreason_id=="4"){
		getemployeeids();
		associateid=arremployee;
		//associateid=$("#J_edit_employee").val();
	}else{
		associateid="";
		discountreason_val="";
	}

	// 判断合同编号和员工姓名是否为空
	var idtxt=$("#J_edit_contractnum").val(); //3
	var nametxt=$("#J_edit_employee").text(); //4
	//alert(idtxt);
	if(discountreason_id=="3" && idtxt==""){
		layer.alert("请输入合同编号");
		return false;	
	}
	if(discountreason_id=="4" && nametxt==""){
		layer.alert("请输入员工编号");
		return false;	
	}
	jsonPostAjax(
			basePath + '/contract/discount/udpate',{
				"chargeobject": chargeobject_val,
				"conid": getconid,
				"customerbrokcomm": customerbrokcomm_val,
				"customerbrokdisc": customerbrokdisc_val,
				"customerperfcomm": customerperfcomm_val,
				"customerperfdisc": customerperfdisc_val,
				"discountid": get_discountId,
				"discountreason": discountreason_id,
				"ownerbrokcomm": ownerbrokcomm_val,
				"ownerbrokdisc": ownerbrokdisc_val,
				"ownerperfcomm": ownerperfcomm_val,
				"ownerperfdisc": ownerperfdisc_val,
				"reasons": [
		            {
		            	"associateid": associateid,
		            	"discountreason": discountreason_id
		            }],
				"situationexplain": situationexplain_val,
				"totaldisc": totaldisc_val
			}, function(index) {
				layer.alert('操作成功!', {
					skin: 'layui-layer-lan',
					closeBtn:0,  // 是否显示关闭按钮
					yes:function(){
						self.location.href=basePath+"/contract/discount/detail?discountId="+get_discountId;
					}
				});
			},{});
}
/*
 * 取消
 * */
$("#cancelBtn").on("click",function(){
	if(window.history.length=="1"){
		self.location.href=basePath+"/contract/discount/list.html";
	}else{
		window.history.back();
	}	
});

/* 选择员工 J_edit_employee */
$("#J_chosen_employee").click(function(){
	commonContainer.modal('选择公司员工',$('#J_changeperson_layer'),function(index, layero) {
			var employee_content='<span class="J_employee_del" data-id="'+$("#J_popuser").attr("data-id")+'">'+$('#J_popuser').val()+'&nbsp;&nbsp;<label>×</label></span>';
			var employee_ids=getemployeeids();
			var chose_ath=$("#J_popuser").attr("data-id");
			if(chose_ath){
				if(employee_ids.length>0){
                    for(var i=0;i<employee_ids.length;i++){
                        if(employee_ids[i]==chose_ath){
                            commonContainer.alert('当前员工已选');
                            return false;
                        }
                    }
                    layer.close(index);
                    $("#J_edit_employee").append(employee_content);
                    getemployeeids();
				}else{
                    layer.close(index);
                    $("#J_edit_employee").append(employee_content);
                    getemployeeids();
				}
			}else{
                commonContainer.alert('请选择员工');
			}
		}, 
		{
			overflow :true,
			area : ['40%','70%'],
			btns : ['确定', '取消'],
			overflow:false,
			success: function() {
				$('#J_popuser').val('');
				$('#J_popuser').attr('data-id', '');
				$(".layui-layer-content").css("overflow","hidden");
				searchContainer.searchUserListByComp($("#J_popuser"), true, 'right');
			}
		}
	);
});

/*
 * 选择员工编号
 * */
function getemployeeids(){
	arremployee=[];
	var employee_b=$('span[class="J_employee_del"]');
	for(var i=0;i<employee_b.length;i++){
		var d_id=$(employee_b[i]).attr("data-id");
		//var d_id=$(employee_b[i]).val();
		arremployee.push(d_id);
		//console.log(arremployee);
	}
	return arremployee;
}

$(document).delegate('.J_employee_del','click',function(event){
	$(this).remove();
	getemployeeids();
})

/*
 * 表单提交
 * */
function ajaxSubmit(){
//	sureflag=0;
	if(!contractValidate()){
		commonContainer.alert("存在不符合规则的数据！！");
	//	sureflag=1;
		return;
	}
	//根据选择 业主/客户 checkbox 判断显示哪个佣金
	setcommissionshow();
	//判断是新增页面还是编辑页面
	if(get_discountId!=null){
		/*
		 * 编辑
		 * */
		editcontract_update(get_discountId);
	}else{
		/*
		 * 增加
		 * */		
		editcontractinfo_insert();
	}

	/*jsonPostAjax(basePath + '/customer/detail/newdemand', val, function() {
		console.log(val);
		commonContainer.alert('操作成功');
		//layer.close(index);
		window.location.reload();//换成刷新iframe document.frames("name").location.reload(true);
	},{});*/
}


/*
$('#J_edit_ownerbrokcomm').blur(function(){
    transPrice(this);
});
$('#J_edit_ownerbrokcomm').focus(function(){
	repSign(this);
});
$('#J_edit_ownerbrokcomm').bind('input propertychange', function() {//实时监听
    checkDecimal(this);
});
var cd_record={
    num:""
}
var checkDecimal=function(n){//用正则表达式控制价格输入
    //var decimalReg=/^\d{0,6}\.{0,1}(\d{1,2})?$/;//var decimalReg=/^[-\+]?\d{0,8}\.{0,1}(\d{1,2})?$/;
    var decimalReg=/^\d{0,16}(\.\d{0,2})?$/;
    if(n.value!=""&&decimalReg.test(n.value)){
        cd_record.num=n.value;
    }else{
        if(n.value!=""){
            n.value=cd_record.num;
        }
    }
}
function repSign(s){
	var ss=$(s).val();
	console.log("replace之前的ss:"+ss);
    //ss = ss.replace(",","");
    ss = ss.replace(/,/gi,'');
    console.log("replace之后的ss:"+ss);
    $(s).val(ss);
	//(".","");
}
function transPrice(pval) {//千分位显示
	var s=$(pval).val();
    console.log("初始："+s);
    /!*var regex=/^[0]+/
    var a=s.replace(regex,"");*!/
	//s=parseFloat(s);//去除首位输入的0，如002，小数不影响parseFloat字符串转数字
	s=s.replace(/^[0]+/,"");
	console.log("parsefloat后的:"+s);
	s=s.toString();
    console.log("s.tostring:"+s);
    s = s.replace(/^(\d*)$/, "$1.");
    console.log("s.replace正则:"+s);
    s = (s + "00").replace(/(\d*\.\d\d)\d*!/, "$1");
    console.log("s+00:"+s);
	s = s.replace(".", ",");
    console.log("s.replace'.':"+s);
	var re = /(\d)(\d{3},)/;
	while (re.test(s)){
        s = s.replace(re, "$1,$2");
        console.log("s.replace$1 $2:"+s);
	}
	s = s.replace(/,(\d\d)$/, ".$1");
    console.log("s.replace',':"+s);
	s = s.replace(/^\./, "0.");
    console.log("s.replace'\.':"+s);
    $(pval).val(s);
}*/
/*
commonContainer.formatPrice('#J_edit_ownerbrokcomm');
commonContainer.formatPrice('#J_edit_ownerperfcomm');*/
