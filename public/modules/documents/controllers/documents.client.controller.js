'use strict';

// Documents controller
var appDocument = angular.module('documents');
appDocument.controller('DocumentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Documents',
	function($scope, $stateParams, $location, Authentication, Documents) {
		$scope.authentication = Authentication;

	}
]);
appDocument.controller('OFCreateCtrl', 
	['$scope', 
	 '$stateParams', 
	 '$location', 
	 'Authentication', 
	 'Documents',
	 '$timeout',
	 'DocumentAccion',
	 'ngTableParams',
	 '$http',
	 '$modal',
	 '$log',
	 'NotifyDocument',
	 'lodash',
	 function(
	 $scope, 
	 $stateParams, 
	 $location, 
	 Authentication, 
	 Documents,
	 $timeout,
	 DocumentAccion,
	 ngTableParams,
	 $http,
	 $modal,
	  $log,
	 NotifyDocument,
	 lodash){
	
	 var vm = this;
	 vm.result = {};
	 vm.isSaving = false;
	 vm.authentication = Authentication;
     

   	 $scope.getDocNum = function(patient){
   	 $http.post('api/docPatients', {patientId: patient})
   	  .success(function(data){
   	  $scope.docList = data;
   	  vm.result = $scope.docList.legnth > 0 ? $scope.docList[0].result: '';

   	  });
    };


     $scope.getDocNum($stateParams.patientId);

	 NotifyDocument.getMsg('setDocument', function(event, data){
	 	vm.result = data.result.result;
	 });
     
	 vm.listDocument = function(patient){
	 vm.modelCreate = function (size, patient) {
	        var modalInstance = $modal.open({
	          templateUrl: 'modules/documents/views/create-document.client.view.html',
	          controller:   
            function ($scope, $modalInstance) {
            $http.post('api/docPatients', {patientId: patient})
   	     	 .success(function(data){

   	     	 console.log(patient);
   	     	 $scope.docList = data;
   	        });
                  $scope.ok = function () {
                  $modalInstance.close();
          };
            $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
          },
	          size: size
	     });

	   modalInstance.result.then(function (selectedItem) {
	      }, function () {
	        $log.info('Modal dismissed at: ' + new Date());
	      });
	    };

	   vm.modelCreate('lg', patient);
	   

	 };

     vm.create = function(result){
     	 vm.isSaving = true;
	 	 vm.saveresult = {
		 	docType: 'OF',
		 	result: vm.result,
		 	docpatient: $scope.patient._id,
		 	createUser: vm.authentication.user._id,
		 	createDate: Date.now
		 };
		 
		 DocumentAccion.newDocument(vm.saveresult)
		 .then(function(data){
		 $timeout(function() {
        	 vm.isSaving = false;
        	 $scope.getDocNum($scope.patient._id);
             alertify.success('Acción realizada exitósamente!!'); 
         }, 3000); 
		 }, function(err){
            $timeout(function() {
        	 vm.isSaving = false;
             alertify.error('Ha ocurrido un error intente de nuevo!!'); 
           }, 3000);
		 });
	    
     };


     vm.setResult = function(document){
     	   NotifyDocument.sendMsg('setDocument', {result: document});
     };
   }
]);


