'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', '$rootScope',
	function($scope, $http, $location, Authentication, $rootScope) {
		$scope.authentication = Authentication;
		$scope.test = "123456";
		console.log($scope.test);

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials)
			    .success(function(response) {
			     $rootScope.currentUser = response;
				// If successful we assign the response to the global; user model
				$scope.authentication.user = response;
			    $scope.authentication.emrId = {doctor: 123};
				// And redirect to the index page
				$location.path('/dashboards');
			}).error(function(response) {
				$rootScope.currentUser = null;
				$scope.error = response.message;
			});
		};
	}
]);