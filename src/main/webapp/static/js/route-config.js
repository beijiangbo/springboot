
'use strict';

/**
 * @name springbootApp
 * @description # springbootApp
 * 
 * Main module of the application.
 */
var app = angular.module('springbootApp', ['ngRoute', 'ngResource']);

app.config(['$routeProvider', function($routeProvider) {
	
	$routeProvider.when('/', { 
		controller: 'indexCtrl',
		templateUrl: '/template/home/main.html'
	}).when('/goods/list', {
    	controller: 'goodsCtrl',
    	templateUrl: '/template/goods/main.html'
	}).when('/goods/add', {
    	controller: 'goodAddCtrl',
    	templateUrl: '/template/goods/add.html'
	}).when('/goods/type', {
    	controller: 'goodTypeCtrl',
    	templateUrl: '/template/goods/type.html'
	}).when('/order', {
    	controller: 'orderCtrl',
    	templateUrl: '/template/order/main.html'
	}).otherwise({ 
		redirectTo : '/' 
	});
	
}]);