// 'use strict';

// // Pais controller
// angular.module('pais').controller('PaisController', ['$scope', '$stateParams', '$location', 'Authentication', 'Pais',
// 	function($scope, $stateParams, $location, Authentication, Pais) {
// 		$scope.authentication = Authentication;

// 		// Create new Pai
// 		$scope.create = function() {
// 			// Create new Pai object
// 			var pai = new Pais ({
// 				name: this.name
// 			});

// 			// Redirect after save
// 			pai.$save(function(response) {
// 				$location.path('pais/' + response._id);

// 				// Clear form fields
// 				$scope.name = '';
// 			}, function(errorResponse) {
// 				$scope.error = errorResponse.data.message;
// 			});
// 		};
// //
// 		// Remove existing Pai
// 		$scope.remove = function(pai) {
// 			if ( pai ) { 
// 				pai.$remove();

// 				for (var i in $scope.pais) {
// 					if ($scope.pais [i] === pai) {
// 						$scope.pais.splice(i, 1);
// 					}
// 				}
// 			} else {
// 				$scope.pai.$remove(function() {
// 					$location.path('pais');
// 				});
// 			}
// 		};

// 		// Update existing Pai
// 		$scope.update = function() {
// 			var pai = $scope.pai;

// 			pai.$update(function() {
// 				$location.path('pais/' + pai._id);
// 			}, function(errorResponse) {
// 				$scope.error = errorResponse.data.message;
// 			});
// 		};

// 		// Find a list of Pais
// 		$scope.find = function() {
// 			$scope.pais = Pais.query();
// 		};

// 		// Find existing Pai
// 		$scope.findOne = function() {
// 			$scope.pai = Pais.get({ 
// 				paiId: $stateParams.paiId
// 			});
// 		};
// 	}
// ]);

'use strict';

var paisModule = angular.module('pais');

// Pais controller
paisModule.controller('PaisController', [
	'$scope', 
	'$http',   
	'$location', 
	'Authentication', 
	'Pais', 
	'$modal', 
	'$log',
	'Notify',
	'$mdToast',
	function($scope, $http,  $location, Authentication, Pais, $modal, $log, Notify, $mdToast) {
		this.authentication = Authentication;

	    // Find a list of Pais
	   this.pais = Pais.query();

       $scope.refered = false;
  //Open the middleware to open a single pais modal.
	 this.modelCreate = function (size) {
		    var modalInstance = $modal.open({
		      templateUrl: 'modules/pais/views/create-pais.client.view.html',
		      controller: 'modalResutl',
		      size: size
		 });

	 modalInstance.result.then(function (selectedItem) {
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };


     //Open the middleware to open a single pais modal.
	 this.modelUpdate = function (size, selectedPais) {
            console.log(selectedPais);
		    var modalInstance = $modal.open({
		      templateUrl: 'modules/pais/views/edit-pais.client.view.html',
		      controller: function ($scope, $modalInstance, pais) {
               $scope.pais = pais;

                 $scope.ok = function () { 	
                  $modalInstance.close($scope.pais);
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };

		      },
		      size: size,
		      resolve: {
		        pais: function () {
		          return selectedPais;
		        }
		      }
		 });

	 modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };

	  $scope.$on('handleBroadcast', function(){

	  if($scope.returnPais){
	  	this.pais = $scope.returnPais;
	  	console.log(pais);
	  	$scope.returnPais = '';
	  }
	  	  // this.pais = $scope.pais;
	  });
	  
	// Notify.getMgs('hola', function(event, data){
	// 	 console.log('JODETE');
	// });

	  // Remove existing Pai
	this.remove = function(pais) {
			if( pais ) { 
				pais.$remove();

				for (var i in this.pais) {
					if (this.pais [i] === pais) {
						this.pais.splice(i, 1);
					}
				}
			} else {
				this.pais.$remove(function() {
				});
			}
		};
	
	 }
]);




paisModule.controller('modalResutl',  function ($scope, $modalInstance) {

  $scope.$on('noError', function(){
  	$modalInstance.close();
	$scope.ok = function () {	
    };
 });


  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


paisModule.controller('PaisCreateController', ['$scope',  'Pais', 'Notify',
	function($scope, Pais, Notify) {

	  	// // Create new Pai
		this.create = function() {
			// Create new Pai object
			var pais = new Pais ({
				name: this.name
			});

			// Redirect after save
			pais.$save(function(response) {
             Notify.sendMsg('newPis', {'id': response._id});
             Notify.sendbroadCast('noError');
             
				// Clear form fields
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);


paisModule.controller('PaisUpdateController', ['$scope', 'Authentication', 'Pais',
	function($scope, Authentication, Pais) {
		$scope.authentication = Authentication;

	// Update existing Pai
     

		this.update = function(updatePais) {
          var pais = updatePais;

			pais.$update(function() {

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	
	}
]);

paisModule.directive('paisList', ['Pais', 'Notify', function(Pais, Notify){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/pais/views/pais-list.template.html',
    link: function(scope, element, attr){
         // when a new pais is added update the Pais List..
         Notify.getMsg('newPis', function(event, data){
            scope.paisCtrl.pais = Pais.query();
         });
         
       
    }
  };
}]);

// paisModule.directive('ciudadsList', function(){
//     return {
//     restrict: 'E',
//     transclude: true,
//     templateUrl: 'modules/ciudads/views/ciudad-list.template.html'
//   };
// });





