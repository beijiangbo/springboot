
"use strict";

/**
 * indexCtrl
 * 
 * */

var app = angular.module('springbootApp');

app.controller('indexCtrl', function($rootScope, $scope, $http, $location, $timeout) {
	$http({
		method: 'GET',
        url: '/user/list'
	}).then(function successCallback(response) {
		$scope.dataList = response.data;
	},function errorCallback(response) {
		console.log(response.data);
	})
});