'use strict';

//Sectors service used to communicate Sectors REST endpoints
angular.module('sectors').factory('Sector', ['$resource',
	function($resource) {
		return $resource('sectors/:sectorId', { sectorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])
.factory('Notify', ['$rootScope', function($rootScope) {
    var notify = {};
    notify.msg = '';

    notify.sendbroadCast = function(mgs){
      this.msg = mgs;
      this.broadCast(mgs);
      console.log(this.mgs);
    }

    notify.broadCast = function(msg){
        $rootScope.$broadcast('noError', msg);
    }

    notify.sendMsg = function(msg, data){
       data = data || {};
       $rootScope.$emit(msg, data);
    }

    notify.getMsg = function(msg, func, scope){
     var unbind = $rootScope.$on(msg, func);

      if(scope){
          scope.$on('destroy', unbind);
      }
    };

    return notify;
    // Usar el service '$resource' para devolver un objeto '$resource' Patients
 
}]);


