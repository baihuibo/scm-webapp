require('./common/all');
require('./workflow/all');
require('./business.module');
require('./customers.module');
require('./finance.module');
require('./houses.module');
require('./performance.module');
require('./sign.module');
require('./config.module');

var app = angular.module('app', [
    'common-module',
    'business-module',
    'customers-module',
    'finance-module',
    'houses-module',
    'performance-module',
    'sign-module',
    'workflow-module',
    'config-module'
]);

module.exports = app;