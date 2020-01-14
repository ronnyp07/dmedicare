'use strict';

//Documents service used to communicate Documents REST endpoints
angular.module('documents').factory('Documents', ['$resource',
	function($resource) {
		return $resource('documents/:documentId', { documentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).service('DocumentAccion', ['$http', '$q', 'Documents',  function(http, $q, Documents){
	   var self = {
	   	   defer : $q.defer(),
	   	   newDocument : function(doc){
	   	  	   var document = new Documents({
	   	  	   	docType : 'OF',
                result: doc.result,
                docpatient: doc.docpatient,
		 	    createUser: doc.createUser
	   	  	   });
	   	  		document.$save(function(res){
		       	   self.defer.resolve(res);
		         },function(error){
		         	self.defer.reject(error);
		         });
	   	     	return self.defer.promise;
	   	     }
	   };

	   // loadDocuments : function(param){
	   // 	     	 $http.post('api/docPatients', {patiendId: param})
	   // 	     	 .success(function(data){
	   // 	     	 	angular.forEach(data, function(){
	   // 	     	 		console.log('loading data');
	   // 	     	 	});
	   // 	     	 })
	   // 	     } 

       return self;

}]).factory('NotifyDocument', ['$rootScope', function($rootScope) {
	var notify = {};
	notify.msg = '';

	notify.sendbroadCast = function(mgs){
	  this.msg = mgs;
	  this.broadCast();
	  console.log(this.mgs);
	};

	notify.broadCast = function(){
		$rootScope.$broadcast('noError');
	};

    notify.sendMsg = function(msg, data){
       data = data || {};
       $rootScope.$emit(msg, data);
    };

    notify.getMsg = function(msg, func, scope){
     var unbind = $rootScope.$on(msg, func);

      if(scope){
          scope.$on('destroy', unbind);
      }
    };

    return notify;
	
}]);
