'use strict';

var appCore = angular.module('core');

appCore.controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	
	}
]);

appCore.directive('slider', function () {
      return {
         restrict: 'A',
         scope: true,
         controller: function ($scope, $element, $attrs) {
            $scope.onSlide = function (e, ui) {
              $scope.model = ui.value;
              // or set it on the model
              // DataModel.model = ui.value;
              // add to angular digest cycle
              $scope.$digest();
            };
         },
         link: function (scope, el, attrs) {
         	var link = el.find('.link');
            link.bind('click', function() {
            	var $this = $(this);
            	var $next = $this.next();
            	$next.slideToggle();
		        $this.parent().toggleClass('open');
           });
         }
      };
 });