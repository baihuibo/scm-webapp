(function () {
	// 一些全局的设置
    $.ajaxSetup({cache : false});// 设置 ajax 不缓存
    $(document).on('mousedown', '[readonly]', function () {
        $(this).attr('unselectable', 'on');
    });
}());
window.commonContainer = {
	closeWindow : function () {
		// 关闭窗口
        window.opener = null;
        window.open('','_self');
        window.close();
    },

	getCurrentUserLevel : function getCurrentUserLevel() {
        if (getCurrentUserLevel.promise) {
            return getCurrentUserLevel.promise;
        }
        return getCurrentUserLevel.promise = jsonGetAjax(basePath + '/custom/common/getLevel', null, $.noop)
            .then(function (result) {
                return result.data || 0;
            });
    },

    /**
     * 千位处理工具类
     * @param value 支持数字字符串，支持小数
     * @return {string}
     */
    formatNumber: function (value) {
        // 去除所有数字和小数点以外的所有
        var str = String(value || 0).replace(/(?![0-9\.])./g, '').split('.');
        str[0] = (str[0] || '0').slice(0, 16).replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); // 千位匹配正则转换,最大支持16位
        if (str[1]) {
            str[1] = str[1].slice(0, 2);
        } else {
            str[1] = '00';
        }
        return str.slice(0, 2).join('.');
    },

    /*
    * 千分位分割
    * */
    formatPrice: function (obj) {
        $(obj).on('keydown', function (e) {// 禁止输入字母，-汉字等
            if (e.key === '.' && this.value.indexOf('.') > -1) {// 只允许输入一个小数点
                return false;
            }
            if (e.key && e.key.length === 1 && !/[\d\.]/.test(e.key)) {// 除了小数点，数字，别的不允许输入
                return false;
            }
        }).on('blur', function (e) {
            this.value = commonContainer.formatNumber(this.value);
        }).on('focus', function () {
            this.value = this.value.replace(/,/g, '');
        }).on('compositionstart', false)// 屏蔽输入法输入
            .on('compositionend', function (e) {
                if (e.originalEvent && e.originalEvent.data && this.value) {
                    var data = e.originalEvent.data || '';
                    var idx = this.selectionStart || this.selectionEnd;
                    var value = this.value;
                    this.value = value.slice(0 , idx - data.length) + value.slice(idx , value.length);
                }
            });
    },

	/**
	 * 提示框
	 *
	 * @param msg：提示信息
	 * @param callback：取消和关闭按钮触发的回调，类型：function
	 */
	alert: function(msg, callback) {
		callback = callback || function(index){layer.close(index);};

		layer.alert(msg, {skin: 'layui-layer-lan',}, callback);
	},

    /**
     * loading遮罩层，用在一些耗时操作时，屏蔽用户操作界面和提示用户
     * @param type
     * @returns {number}
     */
	showLoading:function (type) {
		return commonContainer._loading = layer.load(type || 1 , {shade: [0.3,'#fff']});
    },

	hideLoading:function (loading) {
        layer.close(loading || commonContainer._loading);
    },

	/**
	 * 询问框
	 *
	 * @param msg：询问信息
	 * @param confirmCallback：确定按钮触发的回调，类型：function
	 * @param cancelCallback：取消和关闭按钮触发的回调，类型：function
	 */
	confirm: function(msg, confirmCallback, cancelCallback,option) {
		confirmCallback = confirmCallback || function(index){layer.close(index);};
		cancelCallback = cancelCallback || function(){};
		if(option){
			layer.confirm(msg, {skin: 'layui-layer-lan',btn:option.btn}, confirmCallback, cancelCallback);
		}else{
			layer.confirm(msg, {skin: 'layui-layer-lan'}, confirmCallback, cancelCallback);
		}

	},

	/**
	 * 模态框
	 *
	 * @param title：标题
	 * @param content：内容；既可以传入普通的html内容，也可以指定DOM
	 * @param yes：确定按钮触发的回调，类型：function（该回调携带一个参数，即当前层索引）
	 *
	 * @param option：详细参数，包括如下：
	 * @param option.btnAlign 可选值为设置按钮的对齐方式，'l' 左对齐 , 'c' 居中对齐 ,'r' 右对齐(默认)
	 * @param option.area  长度和宽度，例：['600px', '300px']，默认500px
	 * @param option.btns 按钮名称队列，默认：['保存', '取消']
	 * @param option.btn 按钮名称队列，默认：['保存', '取消']
	 * @param option.btn2 ...option.btnN 对应的按钮回调函数，第一个回调函数是yes，之后的分别为 btn2,btn3,btnN...
	 * @param option.success 层弹出后的成功回调方法，类型：function（当你需要在层创建完毕时即执行一些语句，可以通过该函数。该回调携带两个参数，分别是当前层DOM当前层索引。）
	 * @param option.title
	 * @param option.content
	 * @param option.type // 0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
	 * @param option.shift
	 */
	modal: function(title, content, yes, option) {
        option = option || {};

        option.skin = option.overflow ? 'layui-layer-lan' : 'layui-layer-lan layui-layer-no-overflow';

        if (option.btnAlign) {
            var map = {
                l: ' layui-layer-btn-align-left',
                c: ' layui-layer-btn-align-center',
                // r : 'layui-layer-btn-align-right' // 默认值，并且也不需要处理
            };

            if (map[option.btnAlign]) {
                option.skin += map[option.btnAlign];
            }
        }

        title && (option.title = title);// 标题
        content && (option.content = content); // 内容
        yes && (option.yes = yes);// 确定按钮的回调函数

        if(!option.btns && !option.btn){
        	option.btn= ['保存', '取消']
        }

        if (option.btns && !option.btn) {// 按钮重置,如果btns和btn同时存在，则只有btn设置可以生效
            option.btn = option.btns;
        }

        if (!option.area) {
            option.area = '500px';
        }
        if (!option.shift) {
            option.shift = 5;
        }
        if (!option.type) {
            option.type = 1; // 0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        }

        return layer.open(option);
	},

	// 判断是否为空
	isNull: function(param) {
		return !param && param!==0 && typeof param!=="boolean"?true:false;
	},

	// 初始化chosen
	initChosen: function($container) {
		$container.chosen({
			disable_search_threshold : 10,
            placeholder_text : ' ',
			no_results_text: "未找到此选项!"
		});
	},
}


/**
 * 基础维数据调用
 */
window.dimContainer = {

	/**
	 * 获取维数据的请求地址
	 * @returns {String}
	 */
	getDimReqUrl: function() {
		return basePath + '/custom/common/sys_cfg_key_select.htm?compId=2';
	},

	/**
	 * 生成config单选框
	 *
	 * @param $container：需要加载radio的父级控件（一般为div，如$("#J_schoolLevel")）
	 * @param radioName：radio控件的name
	 * @param keyCode：基础维数据的keyCode
	 * @param selectedValue：所选中的值，如果没有选中值，则传""
	 */
	buildDimRadio: function($container, radioName, keyCode, selectedValue) {
		var that = this;
	    var items = [];
	    jsonGetAjax(that.getDimReqUrl(), {'keyCode':keyCode}, function(result) {
    		$.each(result.data, function(n, value) {
    			var item = '<div class="radio radio-primary radio-inline">' +
								'<input type="radio" id="' + radioName+value.valueCode + '" name="' + radioName + '" value="' + value.valueCode + '"><label for="' + radioName+value.valueCode + '">' + value.valueName + '</label>' +
							'</div>';
    			items.push(item);
    	    })
    	    $container.append(items);
    		$(':radio[value="' + selectedValue + '"]', $container).prop('checked', 'checked');
		})
	},

	/**
	 * 生成config复选框（不包含“所有”选项）
	 *
	 * @param $container：需要加载radio的父级控件（一般为div，如$("#J_schoolLevel")）
	 * @param checkboxName：radio控件的id或name（建议id和name的值相同）
	 * @param keyCode：基础维数据的keyCode
	 * @param selectedValues：所选中的值，如果没有选中值，则传""或[]
	 */
	buildDimCheckBox: function($container, checkboxName, keyCode, selectedValues) {
	    this.buildDimCheckBoxHasAll($container, checkboxName, keyCode, selectedValues, null);
	},

	/**
	 * 生成config复选框（包含“所有”选项）
	 *
	 * @param $container：需要加载radio的父级控件（一般为div，如$("#J_schoolLevel")）
	 * @param checkboxName：radio控件的id或name（建议id和name的值相同）
	 * @param keyCode：基础维数据的keyCode
	 * @param selectedValues：所选中的值，如果没有选中值，则传""或[]
	 * @param allItemName：全选的名称，如："全部"，"所有"，"均可"
	 */
	buildDimCheckBoxHasAll: function($container, checkboxName, keyCode, selectedValues, allItemName) {
		var that = this;
		jsonGetAjax(that.getDimReqUrl(), {'keyCode':keyCode}, function(result) {
    	    var items = [];
    	    var arr=[];
    	    // push数据
    		$.each(result.data, function(n, value) {
    			arr.push(checkboxName+value.valueCode);
    			var item = '<div class="checkbox checkbox-primary checkbox-inline">' +
    							'<input type="checkbox" id="' + checkboxName+value.valueCode + '" name="' + checkboxName + '" value="' + value.valueCode + '"><label for="' + checkboxName+value.valueCode + '">' + value.valueName + '</label>' +
							'</div>';
    			items.push(item);
    	    })

    	    // push allItem
    	    if(allItemName){
    			var allName = 'x_all' + Date.now();
    	    	var all_item = '<div class="checkbox checkbox-primary checkbox-inline">' +
									'<input type="checkbox" class="J_selectAll" id="' + allName + '" name="' + allName + '"><label for="' + allName + '">' + allItemName + '</label>' +
								'</div>';
				items.push(all_item);
    	    }
    	    $container.append(items);

    	    // 选中值处理
    	    var selectedValueArr;
    	    if(selectedValues=='all'){
    	    	selectedValueArr=arr;
    	    	$container.find(':checkbox').prop('checked', true);
    	    }else{
    	    	selectedValueArr = selectedValues.split(',');
                $.each(selectedValueArr, function (n, value) {
                    $(':checkbox[value="' + value + '"]', $container).prop('checked', true);
                });
    	    }


            // 各选项绑定click事件
            if (allItemName) {
                var selectAll = $container.find('.J_selectAll');

                // allItemCheckBox处理
                if (allItemName && result.data.length === selectedValueArr.length) {
                    selectAll.prop('checked', true);
                }

                // 全选绑定click事件
                selectAll.on('click', function () {
                    $container.find(':checkbox').prop('checked', this.checked);
                });

                $container.find(':checkbox:not(.J_selectAll)').on('click', function () {
                    if (this.checked && result.data.length === $container.find(':checkbox:checked').length) {
                        selectAll.prop('checked', true);
                    } else {
                        selectAll.prop('checked', false);
                    }
                })
            }
		})
	},

	/**
	 * 生成config下拉框（包含单选和多选）
	 *
	 * @param $container：需要加载options的select控件（如：$("#compId")）
	 * @param keyCode：基础维数据的keyCode
	 * @param selectedValue：所选中的值，如果没有选中值，则传""
	 */
	buildDimChosenSelector: function($container, keyCode, selectedValues) {
		// 初始化chosen控件
		commonContainer.initChosen($container);

		var that = this;
	    var options = [];
	    return jsonGetAjax(that.getDimReqUrl(), {'keyCode':keyCode}, function(result) {
    		$.each(result.data, function(n, value) {
    	    	options.push('<option value="' + value.valueCode + '">' + value.valueName + '</option>');
    	    })
    	    $container.append(options);

    		var selectedValueArr = selectedValues.split(',');
    		$container.val(selectedValueArr);
    		$container.trigger("chosen:updated");
		})
	},

	/**
	 * 生成下拉框（包含单选和多选）
	 *
	 * @param $container：所属区域的父级DIV
	 * @param $leftSelector：左侧的select控件
	 * @param $rightSelector：右侧的select控件
	 */
	buildMoveAreaSelector: function($container, $leftSelector, $rightSelector) {
		$container.delegate('#J_addBtn', 'click', function(event){
			var $options = $('option:selected', $leftSelector);  //获取选中的选项
			$options.appendTo($rightSelector);  //追加给对方
	    })

	    $container.delegate('#J_delBtn', 'click', function(event){
	    	var $options = $('option:selected', $rightSelector);
	    	$options.appendTo($leftSelector);
	    })
	},

	/**
	 * 行政区下拉框
	 *
	 * @param $container：输入框控件
	 * @param selectedValue：所选中的值，如果没有选中值，则传""
	 */
	buildCanton: function($container, selectedValues) {
		commonContainer.initChosen($container);

		var that = this;
	    var options = [];
	    jsonGetAjax(basePath + '/custom/common/area_list.htm', {'city_id':'110100000000'}, function(result) {
    		$.each(result.data, function(n, value) {
    	    	options.push('<option value="' + value.areaId + '">' + value.areaName + '</option>');
    	    })
    	    $container.append(options);

    		var selectedValueArr = selectedValues.split(',');
    		$container.val(selectedValueArr);
    		$container.trigger("chosen:updated");
		})
	},

}


/**
 * 具有搜索功能的输入框
 */
window.searchContainer = {

	jsonSearch_: function($container, value_, idField_, keyField_, effectiveFields_, isShowBtn_, listAlign_) {
        var groupBtn = $container.next('.input-group-btn').css('position' , 'static');
        if (!groupBtn.find('ul').length) {
            groupBtn.find('.btn').show();
            groupBtn.append('<ul class="dropdown-menu dropdown-menu-right" role="menu"></ul>')
        }
        var ul = groupBtn.find('ul').empty();
        var inputGroup = $container.closest('.input-group');
        if (!inputGroup.length) {
            inputGroup = $container.parent();
        }

        $container.bsSuggest('destroy');

        $container.bsSuggest({
            data: {
                'value': value_,
                'defaults': ''
            },
            idField: idField_,
            keyField: keyField_,
            showBtn: isShowBtn_,
            effectiveFields: effectiveFields_,
            getDataMethod: "data",
            listAlign: listAlign_,
			autoMinWidth: false,
			autoDropup: false,
            listStyle: {
                "padding-top": 0, "max-height": "216px",
                'overflow': 'auto', minWidth: inputGroup.width()
            },
			allowNoKeyword: false,   //是否允许无关键字时请求数据。为 false 则无输入时不执行过滤请求
	        //multiWord: true,       //以分隔符号分割的多关键字支持
	        //separator: ","         //多关键字支持时的分隔符，默认为空格
        }).on('onDataRequestSuccess', function (e, result) {
        	result.value = result.data;
            // console.log('onDataRequestSuccess: ', result);
        }).on('onSetSelectValue', function (e, keyword) {
            // console.log('onSetSelectValue: ', keyword);
        }).on('onUnsetSelectValue', function (e) {
            // console.log("onUnsetSelectValue");
        }).on('blur', function () {
            if (!$container.attr('data-id')) {
                $container.val('').trigger('keyup');
            }
        }).on('keyup click focus', setCss);
        groupBtn.on('click', setCss);

        if (!listAlign_) {
            listAlign_ = 'left';
        }

        function setCss() {
            if (!ul.length) {
                return;
            }
        	var layer = $container.closest('.layui-layer-content');
            var divRect = inputGroup.get(0).getBoundingClientRect();
			var maxWidth = 'auto';
            if (layer.length) {// 弹出窗中？
				var layerRect = layer.get(0).getBoundingClientRect();
                if (layerRect.right - divRect.right < 150) {// 非常靠右的组件
                    listAlign_ = 'right';// 列表右对齐
					maxWidth = divRect.right - layerRect.left;
                }
                if(layerRect.left - divRect.left < 150){// 非常靠左的组件
                	listAlign_ = 'left';
                	maxWidth = layerRect.right - divRect.left;
				}
            } else {
                if ($(window).width() - divRect.right < 150) {// 非常靠右的组件
                    listAlign_ = 'right'; // 列表右对齐
                }
			}

			var css = {
                transition: 'inherit',
                paddingRight: 0,
                minWidth :inputGroup.width(),
                maxWidth : maxWidth,
                left: listAlign_ === 'left' ? 0 : 'auto',
                right: listAlign_ === 'right' ? 0 : 'auto'
            };
            ul.css(css);
            if (ul.get(0).scrollWidth - ul.width() > 50) {
                ul.addClass('table-text-left');
            }else{
            	ul.removeClass('table-text-left');
			}
        }
	},

	/**
	 * 行政区【暂未使用】
	 *
	 * @param $container：输入框控件
	 * @param isShowBtn：是否显示搜索按钮，显示则传true，不显示传false
	 */
	searchCanton: function($container, isShowBtn, listAlign) {
		var that = this;

		jsonGetAjax(basePath + '/custom/common/area_list.htm', {'city_id':'110100000000'}, function(result) {
	    	that.jsonSearch_($container, result.data, 'areaId', 'areaName', [], isShowBtn, listAlign);
		})
	},

	/**
	 * 公司经纪人搜索
	 *
	 * @param $container：输入框控件
	 * @param isShowBtn：是否显示搜索按钮，显示则传true，不显示传false
	 * @param listAlign：列表对其方式 ， right， left
	 * @param data：查询部门参数
	 */
	searchUserListByComp: function searchUserListByComp($container, isShowBtn, listAlign , data) {
		var that = this;
        if (typeof listAlign === 'object') {
            data = listAlign;
            listAlign = void 0;
        }
        if (data) {// 查询部门时，清空 promise 数据
            searchUserListByComp.ajaxPromise = null;
        }
        var  url = '/custom/common/' + (data ? 'getUserListByDeptId' : 'getUserListByCompAmple');

        if (!searchUserListByComp.ajaxPromise) {
            searchUserListByComp.ajaxPromise = jsonGetAjax(basePath + url, data || {}, $.noop);
        }
        //$container.val('数据加载中...').prop('disabled' , true);
        return searchUserListByComp.ajaxPromise.then(function ajaxThen(result) {
            //$container.val('').prop('disabled' , false);
            var itemArr = $.map(result.data, function(value) {
            	var data = [value.userId , value.userName , value.shopName , value.deptName , value.postName]
					.filter(function (t) { return !!t });// 去除数组空值
                return {
                    userId : value.userId,
                    userName : value.userName,
                    data : data.join('/')
                };
            });

            that.jsonSearch_($container, itemArr, 'userId', 'userName', ['data'], isShowBtn, listAlign);
        });
	},
	/**
	 * 大区助理
	 *
	 * @param $container：输入框控件
	 * @param isShowBtn：是否显示搜索按钮，显示则传true，不显示传false
	 */
	searchManagerListByComp: function searchManagerListByComp($container, isShowBtn, listAlign) {
		var that = this;

        if (!searchManagerListByComp.ajaxPromise) {
            // 缓存公司经纪人
            // 由于这里的ajax每次都会发送一个新的请求，并且数据 2Mb+
            // 过于浪费资源，这里将ajax请求缓存起来
            // 只需要保证每次页面刷新都加载一次最新的数据就好了
            searchManagerListByComp.ajaxPromise = jsonGetAjax(basePath + '/sign/contractSales/getDistrictManagerList', {}, $.noop);
        }
        searchManagerListByComp.ajaxPromise.then(function ajaxThen(result) {
            var itemArr = $.map(result.data, function(value) {
                return {
                    userId : value.userId,
                    userName : value.userName,
                    data : value.userId + ' / ' + value.userName + ' / ' + value.shopsName + ' / ' + value.shopGroupName+ ' / ' + value.postName
                };
            });

            that.jsonSearch_($container, itemArr, 'userId', 'userName', ['data'], isShowBtn, listAlign);
        });
	},
	/**
	 * 店经理
	 *
	 * @param $container：输入框控件
	 * @param isShowBtn：是否显示搜索按钮，显示则传true，不显示传false
	 */
	searchStoreManagerListByComp: function searchStoreManagerListByComp($container, isShowBtn, listAlign) {
		var that = this;

        if (!searchStoreManagerListByComp.ajaxPromise) {
            // 缓存公司经纪人
            // 由于这里的ajax每次都会发送一个新的请求，并且数据 2Mb+
            // 过于浪费资源，这里将ajax请求缓存起来
            // 只需要保证每次页面刷新都加载一次最新的数据就好了
            searchStoreManagerListByComp.ajaxPromise = jsonGetAjax(basePath + '/sign/contractSales/getStoreManagerList', {}, $.noop);
        }
        searchStoreManagerListByComp.ajaxPromise.then(function ajaxThen(result) {
            var itemArr = $.map(result.data, function(value) {
                return {
                    userId : value.userId,
                    userName : value.userName,
                    data : value.userId + ' / ' + value.userName + ' / ' + value.shopsName + ' / ' + value.shopGroupName+ ' / ' + value.postName
                };
            });

            that.jsonSearch_($container, itemArr, 'userId', 'userName', ['data'], isShowBtn, listAlign);
        });
	},
	/**
	 * 店面助理
	 *
	 * @param $container：输入框控件
	 * @param isShowBtn：是否显示搜索按钮，显示则传true，不显示传false
	 */
	searchShopAssistantListByComp: function searchShopAssistantListByComp($container, isShowBtn, listAlign) {
		var that = this;

        if (!searchShopAssistantListByComp.ajaxPromise) {
            // 缓存公司经纪人
            // 由于这里的ajax每次都会发送一个新的请求，并且数据 2Mb+
            // 过于浪费资源，这里将ajax请求缓存起来
            // 只需要保证每次页面刷新都加载一次最新的数据就好了
            searchShopAssistantListByComp.ajaxPromise = jsonGetAjax(basePath + '/sign/contractSales/getShopAssistantList', {}, $.noop);
        }
        searchShopAssistantListByComp.ajaxPromise.then(function ajaxThen(result) {
            var itemArr = $.map(result.data, function(value) {
                return {
                    userId : value.userId,
                    userName : value.userName,
                    data : value.userId + ' / ' + value.userName + ' / ' + value.shopsName + ' / ' + value.shopGroupName+ ' / ' + value.postName
                };
            });

            that.jsonSearch_($container, itemArr, 'userId', 'userName', ['data'], isShowBtn, listAlign);
        });
	},
	/**
	 * 公司实体店搜索
	 *
	 * @param $container：输入框控件
	 * @param isShowBtn：是否显示搜索按钮，显示则传true，不显示传false
	 */
	searchShopListByComp: function($container, isShowBtn, listAlign) {
		var that = this;

		var itemArr = new Array();
		jsonGetAjax(basePath + '/custom/common/getShopListByComp.htm', {}, function(result) {
			 $.each(result.data, function(n, value) {
				 var data = value.shopId + ' / ' + value.shopName + ' / ' + value.aliasCnspell;

				 var dataArr = new Object();
				 dataArr.shopId = value.shopId;
				 dataArr.shopName = value.shopName;
				 dataArr.data = data;

				 itemArr.push(dataArr);
			 });

			 that.jsonSearch_($container, itemArr, 'shopId', 'shopName', ['data'], isShowBtn, listAlign);
		})
	},

    /**
	 * 公司组织结构和所属人联动处理器
     * @param $deptGroup 组织结构的 form-group div
     * @param $userGroup 所属人的 form-group div
     */
	deptLikeUserList : function ($deptGroup , $userGroup) {
        var $deptBtn = $deptGroup.find('.btn');
        var $deptNameInput = $deptGroup.find(':text');
        var $levelInput = $deptGroup.find(':hidden');

        var $userInput = $userGroup.find(':text'); // 选择人

        // 部门自动补全查询
        searchDept($deptNameInput, true, 'left')
            .then(function () {
                // 这里的 off 用来清除掉 bsSuggest 附加的点击事件，这是不需要的
                $deptBtn.off().on('click', function (e) {
                    // 显示部门树状结构
                    showDeptTree($deptNameInput, $levelInput);
                });

                $deptNameInput.on('onSetSelectValue', function (e, data) {
                    // 初始化所属人
                    searchContainer.searchUserListByComp($userInput, true, 'left', {deptId: data.id});
                });
            })
    },

    /**
	 * 公司财务中心店搜索
	 *
	 * @param $container：输入框控件
	 * @param isShowBtn：是否显示搜索按钮，显示则传true，不显示传false
	 */
	searchFinanceCoreListByComp: function($container, isShowBtn, listAlign) {
		var that = this;

		var itemArr = new Array();
		jsonGetAjax(basePath + '/finance/core/getFinancialCenterShopByCompany', {}, function(result) {
			 $.each(result.data, function(n, value) {
				 var data = value.deptId + ' / ' + value.deptName;

				 var dataArr = new Object();
				 dataArr.deptId = value.deptId;
				 dataArr.deptName = value.deptName;
				 dataArr.data = data;

				 itemArr.push(dataArr);
			 });

			 that.jsonSearch_($container, itemArr, 'deptId', 'deptName', ['data'], isShowBtn, listAlign);
		})
	},
};

/**
 * 组织结构搜索
 * @param $container 搜索输入框
 * @param isShowBtn 是否显示搜索按钮
 * @param listAlign 列表对其方式
 * @param powerAll?  全量查询组织结构
 * @return {*}
 */
function searchDept($container, isShowBtn, listAlign , powerAll) {
    var itemArr = new Array();
    var currentLevel, mapper = {};
    var url = basePath + '/custom/common/getBasOrganization.htm';
    var allUrl = basePath + '/custom/common/getBasOrganizationAll.htm';
    return commonContainer.getCurrentUserLevel().then(function (level) {
        var levelMapper = {
            30: 1,
            40: 2,
            50: 3,
            10: false,
            99: false
        };
        currentLevel = levelMapper[level] || false;
    }).then(function () {
        if (searchDept.promise) {
            return searchDept.promise;
        }
        return searchDept.promise = jsonGetAjax(powerAll ? allUrl : url, {}, $.noop);
    }).then(function (result) {
        $.each(result.data, function (n, value) {
            // if (value.level === 0) {
            //     return;// 不显示北京公司
            // }
            // if (powerAll !== true) {
            //     if (currentLevel === false) {
            //         return;// 未有权限，不能选择任何数据
            //     } else if (currentLevel > value.level) {
            //         return;// 权限不足，不能选择此数据
            //     }
            // }
			// 新需求，不再限制权限
            var data = value.id + ' / ' + value.name;

            var dataArr = new Object();
            dataArr.id = value.id;
            dataArr.name = value.name;
            dataArr.data = data;
            dataArr.level = value.level;
            mapper[value.id] = dataArr;
            itemArr.push(dataArr);
        });
        searchContainer.jsonSearch_($container, itemArr, 'id', 'name', ['data'], isShowBtn, listAlign);
        $container.on('onSetSelectValue' , function (e, data) {
			var sourceData = mapper[data.id];
            if (sourceData) {
                data.level = sourceData.level;
            }
        });
    });
}

// 字符串处理特殊字符通用方法
(function (proto) {
    var REGX_HTML_DECODE = /&\w+;|&#(\d+);/g;

    var HTML_DECODE = {
        "&#60;": "<",
        "&#62;": ">",
        "&#38": "&",
        "&#32": " ",
        "&#34": "\"",
        "&#169": "©",
        "&#64": "@",
        "&#42": "*",
        // Add more
    };

	var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },
		matchHTML = /&(?!#?\w+;)|<|>|"|'|\//g;

    proto.encodeHTML = function() {
        return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;
    };

    proto.decodeHTML = function (s) {
        return this.replace(REGX_HTML_DECODE, function ($0, $1) {
            var c = HTML_DECODE[$0];
            if (!c && $1) {
                // Maybe is Entity Number
                c = String.fromCharCode(+$1);
            }
            return c;
        });
    };

    /**
	 * 字符串模板格式化工具
     * @param args
	 * @example
	 * <example>
	 *     <file name="test.js">
     *        var str = "hi 我叫 {name} , 今年{age}岁了";
     *        str = str.format({name : '小白' , age : 23}); // 传入对象将匹配对象的属性
     *        // str =>  hi 我叫 小白 , 今年23岁了
	 *
     *        var str = "hi 我叫 {obj.name} , 今年{obj.age}岁了 , {664 * 3}";
     *        str = str.format({
     *        	obj : {name : '小白' , age : 23}
     *        });
	 *        // 现在支持更复杂的表达式以及对象属性访问
     *        // str =>  hi 我叫 小白 , 今年23岁了, 1992
	 *
     *        var str2 = "hi 我叫 {0} , 今年{1}岁了";
     *        str2 = str2.format('小白' , 23); // 按照参数顺序，自动匹配到字符模板
     *        // str2 =>  hi 我叫 小白 , 今年23岁了
	 *     </file>
	 * </example>
     * @return {String}
     */
    proto.format = function (args) {
        var isobj = (typeof args === 'object' && arguments.length === 1) || !arguments.length;
        var data = isobj ? args || {} : arguments;
        return this.replace(/{(.*?)}/g, function (matchAll, matchContent) {
            if (isobj) {
                return getValueFn(matchContent)(data);
            }
            return data[matchContent];
        });
    };

    var fncache = {};

    function getValueFn(key) {// 获取方法
        var proxyFn = fncache[key];
        if (!proxyFn) {
            proxyFn =
                fncache[key] =
                    new Function('obj', 'try{with(obj){ return ' + key + '}} catch(e){return ""}');
        }
        return proxyFn;
    }
}(String.prototype));

(function (window) {
	var openNative = window.open;
    window.open = function (href, target, specs, replace) {
        if (specs || !href) {// 多个限制参数时
            openNative(href, target, specs, replace);
        } else {
            var proxy = document.createElement('a');
            proxy.href = href;
            proxy.target = target || '_blank';
            document.body.appendChild(proxy);
            proxy.click();
            document.body.removeChild(proxy);
        }
    };
}(window));