angular.module('workflow-module')
    .service('workflowService', function () {
        /**
         * 查询流程动作列表
         * @param templateId
         */
        this.queryWorkFlowButton = function (templateId) {
            return $http.get(basePath + '/workflow/selectShowLabelBytemplateId', {
                params: {templateId: templateId}
            }).then(function (response) {
                return response.data;
            })
        };

        /**
         * 执行工作流动作
         * @param postData  post 数据
         * @param paramsData  url 参数
         */
        this.workFlowDoJob = function (postData, paramsData) {
            return $http.post(basePath + '/workflow/doJob', postData, {
                params: paramsData
            }).then(function (response) {
                return response.data;
            })
        };
    });