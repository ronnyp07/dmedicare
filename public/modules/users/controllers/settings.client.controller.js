'use strict';

angular.module('users').controller('SettingsController', 
	[
	'$scope', 
	'$http', 
	'$location', 
	'Users', 
	'Authentication',
	'Pais',
   'Ciudad',
   'Sector',
   'Notify', 
   '$mdToast', 
   '$animate',
   'Maintains',
   'MaintainsAction',
   'ClientAction',
   '$timeout',
	function(
	$scope, 
	$http, 
	$location, 
	Users, 
	Authentication,
	Pais,
    Ciudad,
    Sector,
    Notify, 
    $mdToast, 
    $animate,
    Maintains,
    MaintainsAction,
    ClientAction,
    $timeout) {
    
    $scope.user = Authentication.user;
	$scope.init = function(){
        $scope.getCodesTipoSangre();
        $scope.getCodesuserContact();
        $scope.getCodesuserReligion();
        $scope.getCodesuserIdioma();
        $scope.getCodesuserNacionalidad(); 
        $scope.getSeguro();
        $scope.getCodesCivilStatus();
    };

    this.userPhones = {};
    this.userCI = {};
    this.userEContact= {};
    this.authentication = Authentication;
    $scope.isSaving = false;
    console.log(this.authentication);
        
   $scope.getSeguro = function(){
     ClientAction.resultActions.getSegurosList()
    .then(function(res){
       $scope.userSeguro = res;
    }, function(err){
    });
    };

    //Obtiene los parametros para el tipo de sangre
    $scope.getCodesTipoSangre = function(){
     MaintainsAction.resultActions.getMbyCode('Tipo Sangre')
    .then(function(res){
       $scope.tipoSangre = res[0].parameters;
    }, function(err){
    });
    };

     //Obtiene los parametros para el contacto de paciente
    $scope.getCodesuserContact = function(){
     MaintainsAction.resultActions.getMbyCode('Relacion Paciente')
    .then(function(res){
       $scope.userContactPerson = res[0].parameters;
    }, function(err){
    });
    };

      //Obtiene los parametros para el contacto de paciente
    $scope.getCodesuserReligion = function(){
     MaintainsAction.resultActions.getMbyCode('Religion')
    .then(function(res){
       $scope.userReligion = res[0].parameters;
    }, function(err){
    });
    };

     $scope.getCodesCivilStatus = function(){
     MaintainsAction.resultActions.getMbyCode('Estatus Civil')
    .then(function(res){
       $scope.userEstatusCivil = res[0].parameters;
    }, function(err){
    });
    };

      //Obtiene los parametros para el contacto de paciente
    $scope.getCodesuserIdioma = function(){
     MaintainsAction.resultActions.getMbyCode('Idioma')
    .then(function(res){
       $scope.userIdioma = res[0].parameters;
    }, function(err){
    });
    };

  //Obtiene los parametros para el contacto de paciente
    $scope.getCodesuserNacionalidad = function(){
     MaintainsAction.resultActions.getMbyCode('Nacionalidad')
    .then(function(res){
       $scope.userNacionalidad = res[0].parameters;
    }, function(err){
    });
    };
    
    this.paisD = Pais.query();
    this.ciudad = Ciudad.query();
    this.sector = Sector.query();
    console.log(this.sector);

    this.filterByCity = function() {
        if(this.authentication.user.pais == null){
           this.authentication.user.ciudad = null;
           this.authentication.user.sector = null;
           this.userSector = null;
        }else{
         
         this.authentication.user.ciudad = Ciudad.query();
         this.authentication.user.sector = null;
         this.userSector = null;
      }
    };

    this.filterSector = function(){
      if(this.authentication.user.pais === null ||  this.authentication.user.ciudad === null){
         this.authentication.user.sector = null;
      }else {
      this.authentication.user.sector = Sector.query();
       }
    };

    this.calculateAge = function () {
      console.log('crete');
    };
    
    $scope.authentication = Authentication;
    $scope.referred = true;

    this.showuserSave = function() {
      $mdToast.show(
        $mdToast.simple()
          .content('Accion realizada exitosamente!!')
          .position('bottom right')
          .hideDelay(3000)
      );
    };

     this.update = function(selecteduser){
 

    };

    $scope.init();
		// $scope.example1model = []; 
		// $scope.example1data = [ {id: 1, label: "David"}, {id: 2, label: "Jhon"}, {id: 3, label: "Danny"}];
		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		this.updateUserProfile = function(selecteduser, isValid) {
			if (isValid) {
			 $scope.isSaving = true;
		 this.userCI = {
      tipo: this.authentication.user.userCI ? this.authentication.user.userCI.tipo : '', 
      value: this.authentication.user.userCI ? this.authentication.user.userCI.value : '' 
     };
     
     this.userPhonesResult = {
       celular : this.authentication.user.userPhones ? this.authentication.user.userPhones.celular : '',
       casa : this.authentication.user.userPhones ? this.authentication.user.userPhones.casa : '',
     };


     this.userEContact = {
        tipoRelacion : this.authentication.user.userEContact ? this.authentication.user.userEContact.tipoRelacion: '',
        contactFirstName: this.authentication.user.userEContact ? this.authentication.user.userEContact.contactFirstName : '',
        contactLastName: this.authentication.user.userEContact ? this.authentication.user.userEContact.contactLastName : '',
        contactCelular : this.authentication.user.userEContact ? this.authentication.user.userEContact.contactCelular: '',
        contactCasa: this.authentication.userEContact ? this.authentication.user.userEContact.userEContact.contactCasa : '',
        contactTrabajo: this.authentication.userEContact ? this.authentication.user.userEContact.userEContact.contactTrabajo : '',

     };

      var user = new Users({
      _id: selecteduser._id,
      userCI: this.userCI,
      //userEContact : this.userEContact,
      firstName: selecteduser.firstName,
      lastName: selecteduser.lastName,
      userDOB : selecteduser.userDOB,
      jobtitle: selecteduser.jobtitle,
      //userEdad: this.userEdad,
      userEC: selecteduser.userEC,
      department: selecteduser.department,
      userPhonesResult: this.userPhonesResult,
      userEContact : this.userEContact,
      // userSexo: $scope.ruserSexo,
      // userEC :  $scope.ruserEC,
      // userSeguro : $scope.user.ruserSeguro,
      // userTipoSangre: $scope.ruserTipoSangre,
      // userPhones: this.userPhonesResult,
      // userReligion: $scope.user.ruserReligion,
      // userIdioma: $scope.user.ruserIdioma,
      // userNacionalidad: $scope.user.ruserNacionalidad,
      // userEmail : selecteduser.userEmail,
      userDireccion: selecteduser.userDireccion,
      pais: selecteduser.pais,
      ciudad: selecteduser.ciudad,
      sector: selecteduser.sector
      // updateDate: Date.now(),
      // updateUser : this.authentication
      });

      $scope.showuserSave = function() {
      $mdToast.show(
        $mdToast.simple()
          .content('Información actualizada correctamente!!')
          .position('top right')
          .hideDelay(3000)
      );
     };

      // console.log(user);
      // $scope.isSaving = false;
      //
      // Usar el método '$save' de user para enviar una petición POST apropiada
      user.$update(function(response){
        $timeout(function() {
        	$scope.isSaving = false;
        	Notify.sendMsg('newPis', {'id': 'nada'});
           alertify.success('Acción realizada exitosamente!! !!'); 
        }, 3000); 
      	
      }, function(errorResponse) {
       // En otro caso, presentar al usuario el mensaje de error
       $scope.error = errorResponse.data.message;
       });


				// $scope.success = $scope.error = null;
				// var user = new Users($scope.user);

				// user.$update(function(response) {
				// 	$scope.success = true;
				// 	Authentication.user = response;
				// }, function(response) {
				// 	$scope.error = response.data.message;
				// });
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);