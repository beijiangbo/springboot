
"use strict";

/**
 * computerCtrl
 * 
 * */
var app = angular.module('springbootApp');

app.controller('goodsCtrl', function($rootScope, $scope, $http, $location, $timeout) {
	$http({
		method: 'GET',
        url: '/user/list'
	}).then(function successCallback(response) {
		$scope.dataList = response.data;
	},function errorCallback(response) {
		console.log(response.data);
	})
});
