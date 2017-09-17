angular.module('common-module')
    .filter('pluck', function () {
        return function (value, pluck) {
            return _.map(value || [], pluck);
        }
    });