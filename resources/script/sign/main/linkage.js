var basePath_ = basePath;

/**
 * 级联下拉框调用
 */
window.linkageContainer = {
	
	// 初始化chosen
	initChosen: function($container) {
		$container.chosen({
			width : "100%",
			disable_search_threshold : 10,
			no_results_text: "未找到此选项!"
		});
	},
	
	/**
	 * 生成Options Html
	 * 
	 * @param list:      包含多组数据的array
	 * @param nameKey:   每一项数据中，name列的列名称
	 * @pararm valueKey: 每一项数据中，value列的列名称
	 */
	buildOptions: function(list, nameKey, valueKey, selectedValue) {
		nameKey = nameKey || 'name';
	    valueKey = valueKey || 'value';
	    var result = [];
	    result.push('<option value="">请选择</option>');
	    if (list != undefined) {
	    	for (var i = 0; i < list.length; i++) {
		    	var item = list[i];
		    	var name = item[nameKey];
		    	var value = item[valueKey];
		    	if (value == selectedValue&&selectedValue!='')
		    		result.push('<option selected="selected" value="' + value + '">' + name + '</option>');
		    	else
		    		result.push('<option value="' + value + '">' + name + '</option>');
		    }
	    }

	    return result.join('');
	},
	
	/**
	 * 行政区-街道办事处级联下拉框
	 * @param $region：	加载“行政区”的select控件
	 * @param $street：	加载“街道”的select控件
	 * @param regionId：	所选中的“行政区”的值，如果没有选中值，则传""
	 * @param streetId：	所选中的“街道”的值，如果没有选中值，则传""
	 */
	regionSelector: function($region, $street, regionId, streetId){

		// 初始化chosen控件
		linkageContainer.initChosen($region);
		linkageContainer.initChosen($street);
		
	    this.regionId_ = regionId;
	    this.streetId_ = streetId;

		this.$region_ = $region;
		this.$street_ = $street;

		this.makeregion_ = $.proxy(this.makeregion_, this);
		this.makestreet_ = $.proxy(this.makestreet_, this);
		this.onregionChange_ = $.proxy(this.onregionChange_, this);
		this.onstreetChange_ = $.proxy(this.onstreetChange_, this);

		this.makeregion_();
		if (this.regionId_) {
			this.makestreet_();
		}
	},
	
}

// 省-市-区级联下拉框 begin
linkageContainer.regionSelector.prototype.makeregion_ = function(){
	var that = this;
	
	jsonGetAjax(basePath_ + '/sign/contractSales/arealist', {}, function(result) {
		var provinceList = result.data;
		var html = linkageContainer.buildOptions(provinceList, 'areaName', 'areaId', that.regionId_);
		that.$region_.html(html);
		that.$region_.on('change', that.onstreetChange_);
		that.$region_.trigger("chosen:updated");
	})
}

linkageContainer.regionSelector.prototype.onstreetChange_ = function(e){
	this.regionId_ = this.$region_.val();
	this.makestreet_();
}

linkageContainer.regionSelector.prototype.makestreet_ = function(){
	var that = this;
	jsonGetAjax(basePath_ + '/sign/contractSales/Streetlist', {'areaParentId':this.regionId_}, function(result) {
		var cityList = result.data;
		var html = linkageContainer.buildOptions(cityList, 'areaName', 'areaId', that.streetId_);
		that.$street_.html(html);
		that.$street_.trigger("chosen:updated");
	})
}
// 省-市-区级联下拉框 end




