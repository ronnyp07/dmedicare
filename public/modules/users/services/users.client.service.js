'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('UserAction', ['$http', '$q', function($http, $q){
    var resultActions = {};
    
    resultActions.getUsersList = function(){
        var defer = $q.defer();
        $http.get('users/userList').
            success(function(data){
              defer.resolve(data);
             }).
             error(function(err){
              defer.reject(err);
          });        
        return defer.promise;
     };
     return{
        resultActions
     };
}

]);

