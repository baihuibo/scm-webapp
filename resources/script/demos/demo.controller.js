angular.module('app')
    .controller('demoCtrl', function ($http) {
        window.ctrl = this;

    });

angular.bootstrap(document, ['app']);