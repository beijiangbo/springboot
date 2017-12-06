'use strict';

/* Directives */
var ppjrAppDirectives = angular.module('springbootDirectives', []);


/* 分页组件指令 */
/* 定义分页对象
 * pageBean = {
 * data:[0,1,2,3,4,5,6,7,8,9,10], -- 数据
 * search:{}, --查询对象
 * pageSize:10, -- 页大小
 * currentPage:1, -- 当前页
 * totalSize:101, -- 总数据数
 * totalPage:11 -- 总页数
 * }
 */
 
ppjrAppDirectives.directive('platPaging',['ppObj',function(platObj) {

	function pagingCtrl($scope,$element,$attrs){
	
	}
 	function link(scope, element, attr) {
	    scope.bindData = function(currentPage){
	    	if (scope.paging === false) {
	    		scope.paging = true;
	    		scope.pageBean.currentPage = currentPage;
	    	}
	    };
	    scope.paging = false;
	  	$watchCurrentPage(scope,platObj);
		$watchTotalSize(scope);

    };
    return {
		templateUrl:"/partials/common/paging.html",
		restrict: 'AE',
		scope:{
			pageBean:"=platPaging",
			form:"=platForm"
		},
		link:link,
		controller:pagingCtrl
    };
}]);
ppjrAppDirectives.directive('operationBar',['ppObj',function(ppObj){
	function link($scope, element, attr) {
//		console.log($scope.ppVector);
		var menuId = $scope.ppVector.menuId;
		if (angular.isUndefined(menuId)) {
			throw new Error("Missing Required Filed. menuId excepted not be null .");
		}
		$scope.menuId = menuId;
		var _path = {
			use: "admin",
			opt: "menu",
			id : menuId
		};
		ppObj.get(_path, {}, function(obj) {
			if (obj.result === true) {
				applyEvent(obj.data);
				//$scope.pageMenu = obj.data;
			} else {
				throw new Error("Load menu fail. " + obj.msg);
			}
		});
		var _callbak_menu = [];
		var  applyEvent = function(pageMenu) {
			var _pageMenu = [];
			for (var i = 0; i<pageMenu.length ; i++) {
				var _item = angular.copy(pageMenu[i]);
				if (_item.type === 'BUTTON') {
					_item.uri = eval(_item.uri);
					_callbak_menu.push(_item);
				} else {
					_pageMenu.push(_item);
				}
			}
			$scope.pageMenu = _pageMenu;
		};
		$scope.ppVector.callbackRowButton(_callbak_menu);
	};
	function operationBarCtrl($scope,$element,$attrs){

	};
	return {
		templateUrl:"/partials/common/operation.html",
		restrict: 'E',
		replace : true ,
		scope:{
			ppVector:"=ppVector"
		},
		link : link ,
		controller : operationBarCtrl
	};
}]);


function $watchCurrentPage($scope,platObj){
	$scope.$watch(
	  		function (){return $scope.pageBean.currentPage;},
	  		function (newVal, oldVal) {
  				throttle(fetchData(newVal , oldVal , $scope , platObj) , 1000);
	  		}
    , true);
};

function fetchData(newVal, oldVal , $scope , platObj) {
	if(newVal!== undefined && oldVal!== undefined && newVal !== oldVal){
		$scope.pageBean.search.currentPage = $scope.pageBean.currentPage;
		if($scope.form !== undefined){
				platObj.post($scope.pageBean.search,$scope.form,
					function(pageBean){
						if((pageBean.currentPage - 1) * pageBean.pageSize > pageBean.totalSize){
							$scope.pageBean.currentPage = 1;
							$scope.pageBean.search.currentPage = 1;
							platObj.post($scope.pageBean.search,$scope.form,function(pageBean){
								$scope.paging = false;
								$scope.pageBean = pageBean;
							});
						}else{
							$scope.paging = false;
							$scope.pageBean = pageBean;
						}
					}
				);
		} else {
			var _paramMap = angular.copy($scope.pageBean.search);
			platObj.post($scope.pageBean.search,{},function(pageBean){
				$scope.paging = false;
				$scope.pageBean = pageBean;
			});
		}

	}
	flushUIBar(newVal,oldVal,$scope);
}

function throttle(fn, delay, mustRunDelay){
    var timer = null;
    var t_start;
    return function(){
      var context = this, args = arguments, t_curr = +new Date();
      clearTimeout(timer);
      if(!t_start){
        t_start = t_curr;
      }
      if(t_curr - t_start >= mustRunDelay){
        fn.apply(context, args);
        t_start = t_curr;
      }else {
        timer = setTimeout(function(){
          fn.apply(context, args);
        }, delay);
      }
    };
  };




function $watchTotalSize($scope){
	$scope.$watch(
	  		function (){return $scope.pageBean.totalSize;},
	  		function (newVal, oldVal) {
	  			flushUIBar(newVal,oldVal,$scope);
    		}
    , true);
};

function flushUIBar(newVal, oldVal,$scope) {
	//计算分页页脚
	$scope.pageIndexs = [];
	var pageIndLength = 6;

	var i = $scope.pageBean.currentPage - 2;
	if(i > (($scope.pageBean.totalPage + 1) - pageIndLength)){
		i = ($scope.pageBean.totalPage + 1) - pageIndLength;
	}
	for (var j = 1; i <= $scope.pageBean.totalPage && j <= pageIndLength; i++) {
		if(i > 0){
			$scope.pageIndexs.push(i);
			j++;
		}
	};
	$scope.prePage = false;
	$scope.preByPage = false;
	$scope.nextPage = false;
	$scope.nextByPage = false;
	if($scope.pageIndexs[0] == 1){
		$scope.prePage = false;
	}else if($scope.pageIndexs[0] == 2){
		$scope.prePage = true;
		$scope.preByPage = false;
	}else if($scope.pageIndexs[0] > 2){
		$scope.prePage = true;
		$scope.preByPage = true;
	}
	if($scope.pageIndexs[$scope.pageIndexs.length - 1] == $scope.pageBean.totalPage){
		$scope.nextPage = false;
	}else if($scope.pageIndexs[$scope.pageIndexs.length - 1] == $scope.pageBean.totalPage - 1){
		$scope.nextPage = true;
		$scope.nextByPage = false;
	}else if($scope.pageIndexs[$scope.pageIndexs.length - 1] < $scope.pageBean.totalPage - 1){
		$scope.nextPage = true;
		$scope.nextByPage = true;
	}
}

ppjrAppDirectives.directive('dateFormat', ['$filter',function($filter) {  
    var dateFilter = $filter('date');  
    return {  
        require: 'ngModel',  
        link: function(scope, elm, attrs, ctrl) {  
  
            function formatter(value) {  
                return dateFilter(value, 'yyyy-MM-dd'); //format  
            }  
  
            function parser() {  
                return ctrl.$modelValue;  
            }  
  
            ctrl.$formatters.push(formatter);  
            ctrl.$parsers.unshift(parser);  
  
        }  
    };  
}]);  