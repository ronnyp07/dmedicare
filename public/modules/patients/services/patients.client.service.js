'use strict';

//Patients service used to communicate Patients REST endpoints
angular.module('patients').factory('Patients', ['$resource',
	function($resource) {
		return $resource('api/patients/:patientId', { patientId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('ItemsService', ['$http','$rootScope', function($http, $rootScope) 
{
    var service={};

    service.saveItem = function(item, image)
    {
        var fd = new FormData();
        fd.append('file', image);
        fd.append('item', JSON.stringify(item));
        $http.post('items/', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
            console.log('success add new item');
        })
        .error(function(e){
            console.log('error add new item', e);
        });


    };

    return service;
}
]).factory('PatientFunctions', ['$http', '$q', function($http, $q){
    var patientFunctionResult = {};

    patientFunctionResult.getPatientList = function(){
        var defer = $q.defer();
        $http.post('patient/getList').
            success(function(data){
              defer.resolve(data);
             }).
             error(function(err){
              defer.reject(err);
          });        
        return defer.promise;
     };

     return{
       patientFunctionResult
     };
}

]);