'use strict';

// Patients controller
var patientModule = angular.module('patients');

patientModule.controller('PatientsController', [
'$scope', 
'$stateParams', 
'$location', 
'Authentication', 
'ngTableParams',
'Patients',
 '$modal', 
  '$log',
  'Notify',
function(
$scope, 
$stateParams, 
$location, 
Authentication,
ngTableParams, 
Patients,
$modal, 
 $log,
 Notify) {

$scope.authentication = Authentication;
$scope.patient = {};

this.modelCreate = function (size) {
	        var modalInstance = $modal.open({
	          templateUrl: 'modules/patients/views/create-patient.client.view.html',
	          controller:   
            function ($scope, $modalInstance) {
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


   this.modelRemove = function (size, selectedpatient) {
          $scope.patient = selectedpatient;
        var modalInstance = $modal.open({
          templateUrl: 'modules/patients/views/delete-patient.client.view.html',
          controller: 
          //'modalDelete',
          function ($scope, $modalInstance, patient) {
                 $scope.patient = patient;

                  $scope.ok = function () {
                   //console.log($scope.cliente);
                  // $scope.doSearch();
                  $modalInstance.close($scope.patient);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size,
          resolve: {
            patient: function () {
              return selectedpatient;
            }
          }
     });

   modalInstance.result.then(function (selectedpatient) {
      $scope.selected = selectedpatient;
      //console.log($scope.selected);
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

$scope.modelUpdate = function (size, selectedPatient) {
         
          var modalInstance = $modal.open({
            templateUrl: 'modules/patients/views/edit-patient.client.view.html',
            controller:   
            function ($scope, $modalInstance, patient) {
                $scope.patient = patient;
                console.log($scope.patient);
                $scope.patient.rpais = selectedPatient.pais ? selectedPatient.pais._id : null;
                $scope.patient.rciudad = selectedPatient.ciudad ? selectedPatient.ciudad._id : null;
                $scope.patient.rsector = selectedPatient.sector ? selectedPatient.sector._id :  null;
                $scope.patient.rpatientSexo =  selectedPatient.patientSexo ? selectedPatient.patientSexo._id : null;
                $scope.patient.rpatientEC = selectedPatient.patientEC ? selectedPatient.patientEC._id : null;
                $scope.patient.rpatientTipoSangre = selectedPatient.patientTipoSangre ? selectedPatient.patientTipoSangre : null;
                $scope.patient.rpatientSeguro = selectedPatient.patientSeguro ? selectedPatient.patientSeguro._id : null;
                $scope.patient.rtipoRelacion = selectedPatient.patientEContact ? selectedPatient.patientEContact.tipoRelacion : null;            
                $scope.patient.patientEContact = selectedPatient.patientEContact ? selectedPatient.patientEContact : null;                
                $scope.patient.rpatientReligion = selectedPatient.patientReligion ? selectedPatient.patientReligion._id : null;
                $scope.patient.rpatientIdioma = selectedPatient.patientIdioma ? selectedPatient.patientIdioma._id : null;
                $scope.patient.rpatientNacionalidad = selectedPatient.patientNacionalidad ? selectedPatient.patientNacionalidad._id : null;
                $scope.patient.rPatientCI = selectedPatient.PatientCI ? selectedPatient.PatientCI : null;            
             
                

          $scope.ok = function () {
                  $modalInstance.close();
          };
            $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
          },
          size: size,
          resolve: {
            patient: function () {
              return selectedPatient;
            }
          }
       });

    modalInstance.result.then(function (selectedItem) {
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

        // var patient = Patients.query()
       var params = {
          page: 1,            
          count: 15,
          filter: {
              name: name
        }
       };

       var settings = {
      //  groupBy: 'tipo',
         total: 0,  
         counts: [15,20,25],        
         getData: function($defer, params) {
         Patients.get(params.url(), function(response){     
                params.total(response.total);
                $defer.resolve(response.results);
                $scope.total = response.total;
               // console.log(response);
          }); 
        
          }
       };

    $scope.tableParams = new ngTableParams( params, settings);

		// Remove existing Patient
		$scope.remove = function(patient) {
			if ( patient ) { 
				patient.$remove();

				for (var i in $scope.patients) {
					if ($scope.patients [i] === patient) {
						$scope.patients.splice(i, 1);
					}
				}
			} else {
				$scope.patient.$remove(function() {
					$location.path('patients');
				});
			}
		};

    $scope.doSearch = function () {
        $scope.tableParams.reload();
    };

     Notify.getMsg('patientReload', function(event, data ){
       $scope.doSearch();
     });


		// Update existing Patient
		$scope.update = function() {
			var patient = $scope.patient;

			patient.$update(function() {
				$location.path('patients/' + patient._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Patients
		$scope.find = function() {
			$scope.patients = Patients.query();
		};

		// Find existing Patient
		$scope.findOne = function() {
			$scope.patient = Patients.get({ 
				patientId: $stateParams.patientId
			});
		};
	}
]);

patientModule.controller('patientDeleteController', ['$scope', 'Authentication', 'Patients', 'Notify',
  function($scope, Authentication, Patients, Notify) {
    //$scope.authentication = Authentication;
        
        this.delete = function(cliente) {
         var patient = new Patients({
                _id: $scope.patient._id
         });

         patient.$remove(function(){
          Notify.sendMsg('patientReload', {'id': 'nada'});
          alertify.success('Acción realizada exitósamente!!'); 
         }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
       });
     }; 
  }
]);


patientModule.controller
  ('PatientsCreateController', 
  ['$scope', 
   '$http',  
   'Authentication', 
   'Patients', 
   'Pais',
   'Ciudad',
   'Sector',
   'Notify', 
   '$mdToast', 
   '$animate',
   'Maintains',
   'MaintainsAction',
   'ClientAction',
   'MaintainsHeaderAction',
   'MaintainDetailsService',
   'MaintainList',
   function($scope, $http,  Authentication, Patients, 
    Pais, Ciudad, Sector,  Notify, $mdToast, $animate, Maintains, MaintainsAction, ClientAction, MaintainsHeaderAction, MaintainDetailsService, MaintainList) {

    //Inicializa los parametros del Formulario.
    $scope.init = function(){
        $scope.getCodesTipoSangre();
        $scope.getCodesPatientContact();
        $scope.getCodesPatientReligion();
        $scope.getCodesPatientIdioma();
        $scope.getCodesPatientNacionalidad(); 
        $scope.getPatientGender();
        $scope.getSeguro();
        $scope.getPatientStatusCivil();
    };
        this.patientPhones = {};
        this.PatientCI = {};
        this.patientEContact= {};

   $scope.getSeguro = function(){
     ClientAction.resultActions.getSegurosList()
    .then(function(res){
       $scope.patientSeguro = res;
       console.log($scope.patientSeguro);
    }, function(err){
    });
    };


    //Obtiene los parametros para el tipo de sangre
    $scope.getPatientGender = function(){
    MaintainDetailsService.getHeaderMaster(MaintainList.Gender)
    .then(function(res){
       $scope.gender = res;
       console.log($scope.gender);
    }, function(err){
    });
    };

    $scope.getPatientStatusCivil = function(){
    MaintainDetailsService.getHeaderMaster(MaintainList.Estatus_Civil)
    .then(function(res){
       $scope.estatusCivil = res;
       console.log($scope.gender);
    }, function(err){
    });
    };


       //Obtiene los parametros para el tipo de sangre
    $scope.getCodesTipoSangre = function(){
     MaintainDetailsService.getHeaderMaster(MaintainList.Tipo_Sangre)
    .then(function(res){
       $scope.tipoSangre = res;
    }, function(err){
    });
    };

    $scope.getCodesPatientContact = function(){
    MaintainDetailsService.getHeaderMaster(MaintainList.Relacion_Paciente)
    .then(function(res){
       $scope.patientContactPerson = res;
    }, function(err){
    });
    };

    $scope.getCodesPatientReligion = function(){
    MaintainDetailsService.getHeaderMaster(MaintainList.Religion)
    .then(function(res){
       $scope.patientReligion = res;
    }, function(err){
    });
    };

    $scope.getCodesPatientIdioma = function(){
     MaintainDetailsService.getHeaderMaster(MaintainList.Idioma)
    .then(function(res){
       $scope.patientIdioma = res;
    }, function(err){
    });
    };

    $scope.getCodesPatientNacionalidad = function(){
     MaintainDetailsService.getHeaderMaster(MaintainList.Nacionalidad)
    .then(function(res){
       $scope.patientNacionalidad = res;
    }, function(err){
    });
    };
    
    this.paisD = Pais.query();
    this.ciudad = Ciudad.query();
    this.sector = Sector.query();

    this.filterByCity = function() {
        if(this.pais === null){
           this.ciudad = null;
           this.sector = null;
           this.patientSector = null;
        }else{
         console.log(this.pais);
         this.ciudad = Ciudad.query();
         this.sector = null;
         this.patientSector = null;
      }
    };

    this.filterSector = function(){
      this.sector = Sector.query();
    };

    this.calculateAge = function () {
      console.log('crete');
    };
    
    $scope.authentication = Authentication;
    $scope.referred = true;

     this.create = function(){
      console.log(this.PatientCI.tipo);
      this.PatientCI = {
      tipo: this.PatientCI.tipo, 
      value: this.PatientCI.tipovalue 
     };

     this.patientPhonesResult = {
       celular : this.patientPhones.celular,
       casa : this.patientPhones.casa,
     };

     this.patientEContact = {
        tipoRelacion : this.patientEContact.tipoRelacion,
        contactFirstName: this.patientEContact.firstName,
        contactLastName: this.patientEContact.lastName,
        contactCelular : this.patientEContact.eTelCelular,
        contactCasa: this.patientEContact.eTelCasa,
        contactTrabajo: this.patientEContact.eTrabajo,

     };

      var patient = new Patients({
      PatientCI: this.PatientCI,
      patientEContact : this.patientEContact,
      patientFirstName: this.patientFirstName,
      patientLastName: this.patientLastName,
      patientDOB : this.patientDOB,
      patientEdad: this.patientEdad,
      patientSexo: this.patientSexo,
      patientEC : this.patientEC,
      patientSeguro : this.patientSeguro,
      patientTipoSangre: this.patientTipoSangre,
      patientPhones: this.patientPhones,
      patientReligion: this.patientReligion,
      patientIdioma: this.patientIdioma,
      patientNacionalidad: this.patientNacionalidad,
      patientEmail : this.patientEmail,
      patientDireccion: this.patientDireccion,
      pais: this.pais,
      ciudad: this.patientCiudad,
      sector: this.patientSector
      });

      // Usar el método '$save' de Patient para enviar una petición POST apropiada
      patient.$save(function(response){ 
        Notify.sendMsg('patientReload', {'id': 'nada'});
        alertify.success('Acción realizada exitósamente!!'); 

      }, function(errorResponse) {
       // En otro caso, presentar al usuario el mensaje de error
       $scope.error = errorResponse.data.message;
       });
    };

     $scope.init();

    }
]);


patientModule.controller
  ('PatientsUpdateController', 
  ['$scope', 
   '$http',  
   'Authentication', 
   'Patients', 
   'Pais',
   'Ciudad',
   'Sector',
   'Notify', 
   '$mdToast', 
   '$animate',
   'Maintains',
   'MaintainsAction',
   'MaintainDetailsService',
   'MaintainList',
   'ClientAction',
   function($scope, $http,  Authentication, Patients, 
    Pais, Ciudad, Sector,  Notify, $mdToast, $animate, Maintains, MaintainsAction, MaintainDetailsService, MaintainList, ClientAction) {

    //Inicializa los parametros del Formulario.
    $scope.init = function(){
        $scope.getCodesTipoSangre();
        $scope.getCodesPatientContact();
        $scope.getCodesPatientReligion();
        $scope.getCodesPatientIdioma();
        $scope.getCodesPatientNacionalidad(); 
        $scope.getPatientGender();
        $scope.getPatientStatusCivil();
        $scope.getSeguro();
    };
        this.patientPhones = {};
        this.PatientCI = {};
        this.patientEContact= {};
        this.authentication = Authentication;
        
    //Obtiene los parametros para el tipo de sangre
    $scope.getPatientGender = function(){
    MaintainDetailsService.getHeaderMaster(MaintainList.Gender)
    .then(function(res){
       $scope.gender = res;
       console.log($scope.gender);
    }, function(err){
    });
    };

    $scope.getPatientStatusCivil = function(){
    MaintainDetailsService.getHeaderMaster(MaintainList.Estatus_Civil)
    .then(function(res){
       $scope.estatusCivil = res;
       console.log($scope.gender);
    }, function(err){
    });
    };

   $scope.getSeguro = function(){
     ClientAction.resultActions.getSegurosList()
    .then(function(res){
       $scope.patientSeguro = res;
    }, function(err){
    });
    };

       //Obtiene los parametros para el tipo de sangre
    $scope.getCodesTipoSangre = function(){
     MaintainDetailsService.getHeaderMaster(MaintainList.Tipo_Sangre)
    .then(function(res){
       $scope.tipoSangre = res;
    }, function(err){
    });
    };

    $scope.getCodesPatientContact = function(){
    MaintainDetailsService.getHeaderMaster(MaintainList.Relacion_Paciente)
    .then(function(res){
       $scope.patientContactPerson = res;
    }, function(err){
    });
    };

    $scope.getCodesPatientReligion = function(){
    MaintainDetailsService.getHeaderMaster(MaintainList.Religion)
    .then(function(res){
       $scope.patientReligion = res;
    }, function(err){
    });
    };

    $scope.getCodesPatientIdioma = function(){
     MaintainDetailsService.getHeaderMaster(MaintainList.Idioma)
    .then(function(res){
       $scope.patientIdioma = res;
    }, function(err){
    });
    };

    $scope.getCodesPatientNacionalidad = function(){
     MaintainDetailsService.getHeaderMaster(MaintainList.Nacionalidad)
    .then(function(res){
       $scope.patientNacionalidad = res;
    }, function(err){
    });
    };

    this.paisD = Pais.query();
    this.ciudad = Ciudad.query();
    this.sector = Sector.query();
    console.log(this.sector);

    this.filterByCity = function() {
        if(this.pais === null){
           this.ciudad = null;
           this.sector = null;
           this.patientSector = null;
        }else{
         console.log(this.pais);
         this.ciudad = Ciudad.query();
         this.sector = null;
         this.patientSector = null;
      }
    };

    this.filterSector = function(){
      if(this.pais === null ||  this.ciudad === null){
         this.sector = null;
      }else {
      this.sector = Sector.query();
       }
    };

    this.calculateAge = function () {
      console.log('crete');
    };
    


    $scope.authentication = Authentication;
    $scope.referred = true;

    this.showPatientSave = function() {
      $mdToast.show(
        $mdToast.simple()
          .content('Nuevo Paciente Guardado!!')
          .position('bottom right')
          .hideDelay(3000)
      );
    };

     this.update = function(selectedPatient){
 
     this.PatientCI = {
      tipo: $scope.patient.rPatientCI ? $scope.patient.rPatientCI.tipo : '' , 
      value: $scope.patient.rPatientCI ? $scope.patient.rPatientCI.value : '' 
     };
     
     this.patientPhonesResult = {
       celular : selectedPatient.patientPhones ? selectedPatient.patientPhones.celular : '',
       casa : selectedPatient.patientPhones ? selectedPatient.patientPhones.casa : '',
     };

     this.patientEContact = {
        tipoRelacion : $scope.patient.rtipoRelacion,
        contactFirstName: $scope.patient.patientEContact ? $scope.patient.patientEContact.contactFirstName : '',
        contactLastName: $scope.patient.patientEContact ? $scope.patient.patientEContact.contactLastName : '',
        contactCelular : $scope.patient.patientEContact ? $scope.patient.patientEContact.contactCelular: '',
        contactCasa: $scope.patient.patientEContact ? $scope.patient.patientEContact.contactCasa : '',
        contactTrabajo: $scope.patient.patientEContact ? $scope.patient.patientEContact.contactTrabajo : '',
     };

      var patient = new Patients({
      _id: selectedPatient._id,
      PatientCI: this.PatientCI,
      patientEContact : this.patientEContact,
      patientFirstName: selectedPatient.patientFirstName,
      patientLastName: selectedPatient.patientLastName,
      patientDOB : selectedPatient.patientDOB,
      patientEdad: this.patientEdad,
      patientSexo: $scope.patient.rpatientSexo,
      patientEC :  $scope.patient.rpatientEC,
      patientSeguro : $scope.patient.rpatientSeguro,
      patientTipoSangre: $scope.patient.rpatientTipoSangre,
      patientPhones: this.patientPhonesResult,
      patientReligion: $scope.patient.rpatientReligion,
      patientIdioma: $scope.patient.rpatientIdioma,
      patientNacionalidad: $scope.patient.rpatientNacionalidad,
      patientEmail : selectedPatient.patientEmail,
      patientDireccion: selectedPatient.patientDireccion,
      pais: $scope.patient.rpais,
      ciudad: $scope.patient.rciudad,
      sector: $scope.patient.rsector,
      updateDate: Date.now(),
      updateUser : this.authentication
      });
     // console.log(patient);
      // Usar el método '$save' de Patient para enviar una petición POST apropiada
      patient.$update(function(response){
       console.log(response); 
        Notify.sendMsg('patientReload', {'id': 'nada'});
        alertify.success('Acción realizada exitósamente!!'); 
      }, function(errorResponse) {
       // En otro caso, presentar al usuario el mensaje de error
       $scope.error = errorResponse.data.message;
       });
    };
       $scope.init();
    }
]);


patientModule.controller('PatientsDashBoard', 
  ['$scope','$stateParams', 'Patients', 'Authentication',  function($scope, $stateParams, Patients, Authentication){
    $scope.authentication = Authentication;
    var patientid = $stateParams.patientId;
    this.patient = Patients.get({patientId : patientid});
    
    console.log(this.patient);

    $scope.calculateAge = function(birthday) { // pass in player.dateOfBirth
    var ageDifMs = Date.now() - new Date(birthday);
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

}]);


patientModule.filter('ageFilter', function() {
     function calculateAge(birthday) { // birthday is a date
         var ageDifMs = Date.now() - birthday.getTime();
         var ageDate = new Date(ageDifMs); // miliseconds from epoch
         return Math.abs(ageDate.getUTCFullYear() - 1970);
     }
     function monthDiff(d1, d2) {
       if (d1 < d2){
        var months = d2.getMonth() - d1.getMonth();
        return months <= 0 ? 0 : months;
       }
       return 0;
     }       
     return function(birthdate) { 
           var age = calculateAge(birthdate);
           if (age === 0)
             return monthDiff(birthdate, new Date()) + ' months';
           return age;
     }; 
});

patientModule.controller('patientDoc', ['Documents', '$scope', function(Documents, $scopea){

}]);


patientModule.directive('patientList', ['Patients', 'Notify', function(Cliente, Notify){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/patients/views/patients-list.template.html',
     link: function(scope, element, attr){         
      // when a new procedimiento is added update the cliente List..
         //    Notify.getMsg('newPis', function(event, data){
         //        scope.pacientsCtrl.doSearch(); 
         // });
    }
   };
 }]);

// patientModule.directive('oftarmologiaForm', ['Patients', 'Notify', function(Cliente, Notify){
//     return {
//     restrict: 'E',
//     transclude: true,
//     templateUrl: 'modules/patients/template/oftarmologiaform.html',
//      link: function(scope, element, attr){         
//       // when a new procedimiento is added update the cliente List..
//             Notify.getMsg('newPis', function(event, data){
//                 scope.pacientsCtrl.doSearch(); 
//          });
//     }
//    };
//  }]);

patientModule.directive('oftarmologiaForm', ['Patients', 'Notify', function(Cliente, Notify){
    return {
    restrict: 'E',
    transclude: true,
    scope: { patient: '=',
             patientId: '=info'},
    templateUrl: 'modules/documents/template/oftarmologiaform.html',
    link: function(scope, element, attr){
     //scope.patient = $scope.         
      // when a new procedimiento is added update the cliente List..
         //    Notify.getMsg('newPis', function(event, data){
         //        scope.pacientsCtrl.doSearch(); 
         // });
    }
   };
 }]);

