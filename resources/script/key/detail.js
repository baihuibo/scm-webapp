//加载列表数据
var id=getQueryString("id");
$(function() {
	jsonAjax(// ajax调取以及显示钥匙详情信息
		basePath + '/house/keyadmin/keydetail.htm', 
		{
			"id":id //获取到url后面的 参数 id
		},
		function(result) {//加载详情页信息数据
			if(result.data == undefined) {
				alert('查无此房源，请核实钥匙信息');
				return false;
			}
			$("#J_houseid").text(result.data.houseid?result.data.houseid:'-');
			if(result.data.htype=='买卖'){
				$("#J_houseid").attr("href",'../main/buydetail.htm?houseid='+result.data.houseid);
			}else if(result.data.htype=='租赁'){
				$("#J_houseid").attr("href",'../main/leasedetail.htm?houseid='+result.data.houseid);
			}
			
			$("#J_rekeyusername").text(result.data.rekeyusername?result.data.rekeyusername:'-');
			$('#J_rekeyusername').on('click',function(){
				getUserStaffInfo(result.data.rekeyuserid);
			})
			$("#J_rekeyshopname").text(result.data.rekeyshopname?result.data.rekeyshopname:'-');
			$("#J_addr").text(result.data.addr?result.data.addr:'-');
			$("#J_strinputdate").text(result.data.strinputdate.substring(0,19)?result.data.strinputdate.substring(0,19):'-');
			$("#J_keycode").text(result.data.keycode?result.data.keycode:'-');
			$("#J_phshoptel").text(result.data.phshoptel?result.data.phshoptel:'-');
			$("#J_hstate").text(result.data.hstate?result.data.hstate:'-');
			$("#J_htype").text(result.data.htype?result.data.htype:'-');
			$("#J_groupkeynum").text(result.data.groupkeynum&&result.data.keynum?result.data.groupkeynum+'套'+'（每套'+result.data.keynum+'把）':'-');
			$("#J_doorcodenum").text(result.data.doorcodenum);
			
			//追踪记录
			$('#J_dataTable').bootstrapTable({
				data: result.data.keytrace,
				columns: [
					{
						field : 'inputdate',
						title : '日期',
						align : 'center',
						formatter: function(value, row, index) {
							inputdate = value ? value : '-';
							
							if(value != undefined){
								var html='';
								html= inputdate.substring(0,19);
								return html;
							}
					    }
					},
					{
						field : 'username',title : '操作人',align : 'center',
						formatter: function(value ,row, index){
		      	    		var html='';
		      	    		if(row.username){
		      	    			html='<a onclick="getUserStaffInfo('+row.userid+')">'+row.username+'</a>'
		      	    		}else{
		      	    			html='-'
		      	    		}
		      	    		return html;
			      	    }
					},
					{
						field : 'strstatus',
						title : '钥匙状态',
						align : 'center'
					},
					{
						field : 'lendusername',title : '借钥匙人',align : 'center',
						formatter: function(value ,row, index){
		      	    		var html='';
		      	    		if(row.lendusername){
		      	    			html='<a onclick="getUserStaffInfo('+row.lenduserid+')">'+row.lendusername+'</a>'
		      	    		}else{
		      	    			html='-'
		      	    		}
		      	    		return html;
			      	    }
					},
					{
						field : 'lendusertel',
						title : '借钥匙人电话',
						align : 'center'
					},
					{
						field : 'lenddate',
						title : '借用时间</br>预计还钥匙时间',
						align : 'center',
						formatter: function(value, row, index) {
							lenddate = value ? value : '-';
							planbackdate = row.planbackdate ? row.planbackdate.substring(0,19) : '-';
							
							if(value != undefined){
								var html='';
								html= lenddate.substring(0,19)+'</br>'+planbackdate;
								return html;
							}
					    }
					},
					{
						field : 'memo',
						title : '备注',
						align : 'center'
					}
				]
			});
		}
	);
});

// 导出下载excel
function copyExcel(){
	window.open(basePath + '/house/keyadmin/downloadexcel.htm?id='+id);
}

function getQueryString(name) { // js获取url地址以及 取得后面的参数
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
	} 