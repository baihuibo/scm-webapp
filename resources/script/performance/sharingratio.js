$(function(){	
$('#J_dataTable').bootstrapTable({ 
			url:basePath + '/perf/setRuleDetail/getPerformanceVersion',
			sidePagination: 'server',
			dataType: 'json',
			method:'post',
			pagination: true,
			striped: true,
			pageSize: 10,
			pageList: [10, 20, 50],
			queryParams : function(params) {
				/*var o = jQuery('#J_query').serializeObject();
				o.timestamp = new Date().getTime();
				o.userid = $('#J_user').attr('data-id');
				o.pageindex = params.offset / params.limit+ 1,
				o.pagesize = params.limit;
				if(o.deptid){
					o.deptid = $("#J_deptName").attr("data-id");
				}
				if(o.level){
					o.level = $("#J_deptLevel").val();
				}
				if(o.begindate) {o.begindate = encodeURI(o.begindate);}
				if(o.enddate) {o.enddate = encodeURI(o.enddate);}
				return o;*/
			},
			responseHandler: function(result) {
				if(result.code == 0 && result.data && result.data.totalcount > 0) {
					return { "rows": result.data.list, "total": result.data.totalcount }
				}
				return { "rows": [], "total": 0 } 
			},
	
			columns:[			         
			      	    {field: 'serialNum', title: '序号', align: 'center',
			      	    	/*formatter: function(value, row, index) {	
			      				var html = '';
			      				var url = '';
			      				if (row.businesstype == '1') {// 跳转到租赁详情
			      					url = basePath+"/house/main/leasedetail.htm?houseid="+row.houseid;
			      				} else if (row.businesstype == '2') {// 跳转到买卖详情
			      					url = basePath+"/house/main/buydetail.htm?houseid="+row.houseid;
			      				}
			      				html = "<a href="+url+" target='_blank'>"+ row.serialNum +"</a>";
			      				return html;
			      	    	}*/
			      	    },
			      	    {field: 'strbusinesstype', title: '业务类型', align: 'center'},
			      	    {field: 'beginDate', title: '启用日期', align: 'center'},
			      	    {field: 'createtime', title : '适用城市公司', align : 'center'	
			      	    },
			      	    {field: 'version', title: '版本号', align: 'center'},
				      	{field: 'createTime', title: '创建时间', align: 'center'},
				    	{field: 'endDate', title: '截止时间', align: 'center'},
				    	{field: 'ruleVersionId', title: '部门特殊规则', align: 'center',
				      		formatter: function(value, row, index) {
				      			var content = value ? value : '-';
				      			if(row.content != undefined){
				      				var html = '';		    
			      	    			html = '<div class="text-left">'+ruleVersionId+'</div>';
			      	    			return html; 
				      			}
			      	    	}
				      	},
				        {field: 'updateBy', title: '创建人', align: 'center'},
				      	{field: 'memo', title: '备注', align: 'center',
				      		formatter: function(value, row, index) {
			      		    	var html = '';		    
			      	    			html = '<div class="text-left"><a type="del" data-followid="'+row.id+'" class="btn btn-outline btn-danger btn-xs">删除</a></div>';
			      	    		return html;
			      	    	}
				      	}
			      	],
		})
	
		$('#J_dataTable').bootstrapTable('refresh',{ url: basePath + '/perf/setRuleDetail/getPerformanceVersion' });

function view(obj) {
        	layer.open({
        		title : '城市公司规则新增',
        		type : 1,
        		shift : 1,
        		skin : 'layui-layer-lan layui-layer-no-overflow',
        		content : $('#demo_layer'),
        		area : '980px',
        		btn : [ '保存' ],
        		yes : function(index, layero) {
        			layer.msg("操作成功");
        			layer.close(index);
        		},
        		cancel : function(index, layerno) {
        		}
        	});
        };
        function view1(obj) {
            layer.open({
                title : '收益业绩详情',
                type : 1,
                shift : 1,
                skin : 'layui-layer-lan layui-layer-no-overflow',
                content : $('#demo_layer1'),
                area : '860px',
                btn : [ '保存' ],
                yes : function(index, layero) {
                    layer.msg("操作成功");
                    layer.close(index);
                },
                cancel : function(index, layerno) {
                }
            });
        };
        function view2(obj) {
            layer.open({
                title : '部门规则列表',
                type : 1,
                shift : 1,
                skin : 'layui-layer-lan layui-layer-no-overflow',
                content : $('#demo_layer2'),
                area : '980px',
                btn : [ '保存' ],
                yes : function(index, layero) {
                    layer.msg("操作成功");
                    layer.close(index);
                },
                cancel : function(index, layerno) {
                }
            });
        };
// 显示部门树状结构
        $('#J_deptSelect').on('click', function() {
            showDeptTree($('#J_deptName'), $('#J_deptLevel'));
        });
        function showDeptTree(){
         layer.open({
                title : '组织架构',
                type : 1,
                shift : 1,
                skin : 'layui-layer-lan layui-layer-no-overflow',
                content : $('#demo_layer3'),
                area : '980px',
                btn : [ '保存' ],
                yes : function(index, layero) {
                    layer.msg("操作成功");
                    layer.close(index);
                },
                cancel : function(index, layerno) {
                }
            });

        }
});