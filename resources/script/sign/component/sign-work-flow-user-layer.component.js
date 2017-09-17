/**
 * Created by baihuibo on 2017/6/29.
 */
(function () {
   angular.module('sign-common')
        // 下一个流程审批用户选择弹出层
       .component('signWorkFlowUserLayer', {
           template: '<div class="ibox-content">\n    <table id="J_phone_dataTable"\n           class="table table-hover table-striped">\n        <thead>\n        <tr>\n            <th>选择</th>\n            <th>用户姓名</th>\n            <th>用户部门</th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr ng-repeat="user in $ctrl.users" ng-click="$ctrl.userId = user.userId">\n            <td><input type="radio" ng-value="user.userId" ng-model="$ctrl.userId" name="users"></td>\n            <td>{{::user.userName}}</td>\n            <td>{{::user.userDept}}</td>\n        </tr>\n        </tbody>\n    </table>\n</div>',
           controller: ['$element', function ($element) {
               var $ctrl = this;
               $ctrl.$start = function ($defer, users, title, defaultUserId) {
                   $ctrl.userId = defaultUserId || null;
                   $ctrl.users = users;
                   commonContainer.modal(title || '未查询到用户', $element, function (id) {
                       if (!$ctrl.userId) {
                           return layer.alert('请选择一个用户');
                       }
                       $defer.resolve($ctrl.userId);
                       layer.close(id);
                   }, {
                       cancel: $defer.reject,
                       btn2: $defer.reject,
                       btns: ['确定', '取消'],
                       overflow: 'auto',
                       area: ['800px', '70%']
                   });
               };
           }]
       })
}());