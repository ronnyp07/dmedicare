'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'datamedicare';
	var applicationModuleVendorDependencies = [
	'ngResource',
	'ngLodash', 
	'ngCookies',  
	'ngAnimate',  
	'ngTouch',  
	'ngSanitize',  
	'ui.router', 
	'mwl.calendar', 
	'ui.bootstrap',  
	'ui.utils',
	'ui.select2', 
	'ngMaterial', 
	'ngTable', 
	'ui.date', 
	'ui.calendar',  
	'pais', 
	'ciudads',
	'clientes',
	'citas',
	'doctor',
	'locations',
	'documents',
	'angularUtils.directives.dirPagination',
    'users'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);


//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict'

angular.module('citas', []);
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('ciudads', ['pais']);
'use strict';

// Use application configuration module to register a new module
angular.module('clientes', ['pais', 'ciudads', 'sectors']);

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('dashboards');
'use strict';

angular.module('doctor', ['pais', 'ciudads', 'sectors', 'clientes']);



'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('documents');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('locations');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('maintains');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('pais');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('patients');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('sectors', ['pais', 'ciudads']);
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

//Setting up route
angular.module('citas').config(['$stateProvider',
	function($stateProvider) {
		// Citas state routing
		$stateProvider.
		state('listCitas', {
			url: '/citas',
			templateUrl: 'modules/citas/views/list-citas.client.view.html'
		}).
		state('createCita', {
			url: '/citas/create',
			templateUrl: 'modules/citas/views/create-cita.client.view.html'
		}).
		state('viewCita', {
			url: '/citas/:citaId',
			templateUrl: 'modules/citas/views/view-cita.client.view.html'
		}).
		state('editCita', {
			url: '/citas/:citaId/edit',
			templateUrl: 'modules/citas/views/edit-cita.client.view.html'
		});
	}
]);
'use strict';

// Citas controller
var appCitas = angular.module('citas');

appCitas.controller('CitasController', 
  ['$scope', 
   '$stateParams', 
   '$location', 
   'Authentication', 
   'MaintainsAction',
   'Citas',
   'Patients',
   'UserAction',
   '$modal',
   'PatientFunctions',
   'DoctorAction',
   'LocationAction',
   'AppAction',
   'Notify',
	function(
   $scope, 
   $stateParams, 
   $location, 
   Authentication, 
   MaintainsAction, 
   Citas, 
   Patients, 
   UserAction,
   $modal, 
   PatientFunctions, 
   DoctorAction, 
   LocationAction,
   AppAction,
   Notify) {
	 $scope.authentication = Authentication;
   moment.locale('es');
   $scope.init = function(){
        $scope.getTipoConsulta();
        $scope.getPatients();
        $scope.getDoctors();
        $scope.getLocations();
        $scope.refreshCalendar();
        $scope.today();
   };

   var vm = this;
   $scope.events = [];
   $scope.datepickers = {
        dt: false,
        dtSecond: false
   };

 
      
      console.log($scope.resultm);
     //$scope.func = $scope.resultm.load('TipoConsulta')

      $scope.calendarView = 'day';
      $scope.dayViewStart = '06:00';
      $scope.calendarDay =  new Date();
      $scope.tester = 'Is the Controller connecting';
      vm.dayViewStart = '06:00';
      vm.dayViewEnd = '22:00';
    // $scope.open = function($event) {
    //     $event.preventDefault();
    //     $event.stopPropagation();

    //     $scope.opened = true;
    // };

   // console.log($scope.authentication);

  $scope.today = function() {
    $scope.dt = new Date();
  };


  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();
  $scope.maxDate = new Date(2020, 5, 22);

  $scope.open = function($event) {
    $scope.status.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

  $scope.status = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 2);
  $scope.events =
    [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

  $scope.getDayClass = function(date, mode) {
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i=0;i<$scope.events.length;i++){
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  };




   /*
    =============================================================
      Fill all the dropdown
    =============================================================
   */
   $scope.getPatients = function(){
      PatientFunctions.patientFunctionResult.getPatientList().then(function(result){
      $scope.listPatient = result;
     }, function(err){});
   };

   $scope.getDoctors = function(){
      UserAction.resultActions.getUsersList().then(function(result){
      $scope.doctorList = result;
     }, function(err){});
   };

   $scope.getTipoConsulta = function(){
     MaintainsAction.resultActions.getMbyCode('TipoConsulta')
    .then(function(res){
       $scope.tipoConsulta = res[0].parameters;
    }, function(err){
    });
    };

    $scope.getLocations = function(){
     LocationAction.resultActions.getlocationList().then(function(res){
       $scope.locationList = res;
    }, function(err){
    });
    };


     $scope.eventClicked = function(event){
      // console.log(event);
        $scope.updateApp('lg', event);
     };

     $scope.newAppoiment = function(e){
     
     };

   $scope.refreshCalendar = function () {
      $scope.events.splice(0);
         AppAction.restultActions.getApp().then(function(data){
          for(var i = 0; i < data.length; i++){
          // $scope.events.push({
          //   id:data[i]._id,
          //   title: data[i].appPatient.patientFirstName,
          //   type: "warning",
          //   start: new Date(data[i].appstartDate), 
          //   end: new Date(data[i].appsendDate),
          //   color: 'blue',
          //   textColor: 'white', // an option!,
          //   allDay: false
          // });
         var doctorId = data[i].appDoctor;
         $scope.events.push({
          title: data[i].appPatient.patientFirstName + ' ' + data[i].appPatient.patientLastName,
          type: "warning",
          startsAt: new Date(data[i].appstartDate),
          endsAt: new Date(data[i].appsendDate),
          draggable: true,
          resizable: true,
          id: data[i]._id,
          reason: data[i].appReason,
          doctor: doctorId,
          patient: data[i].appPatient,
          appType: data[i].appType,
          appLocation: data[i].appLoc,
          status: data[i].status,
          patientName : data[i].appPatient.patientFirstName + ' ' + data[i].appPatient.patientLastName
         });
        }
       }, function(err){

       });
    };

    Notify.getMsg('newPis', function(event, data){
           $scope.refreshCalendar();
    });


   $scope.hstep = 1;
   $scope.mstep = 15;
   $scope.options = {
      hstep: [1, 2, 3],
      mstep: [1, 5, 10, 15, 25, 30]
   };

   this.toggle = function($event, which) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.datepickers[which]= true;
    };


   $scope.ismeridian = true;
    $scope.toggleMode = function() {
      $scope.ismeridian = ! $scope.ismeridian;
    };

  $scope.calendar = {
    opened: {},
    dateFormat: 'DD/mm/yyyy',
    dateOptions: {},
    open: function($event, which) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.calendar.opened[which] = true;
    } 
  };

   
   $scope.eventSources = [
          $scope.events
    ];

    /*
    =========================================================
      Pop up New Appoiment
      Todo: Abre al hacer click en algun lugar del calendario
    =========================================================
    */ 
       $scope.modelDetail = function (size, selectedDate) {
        if($scope.calendarView === 'day'){
          console.log($scope.calendarView);
        var modalInstance = $modal.open({
          templateUrl: 'modules/citas/partials/schedule.create.client.html',
          controller: function ($scope, $modalInstance, patient) {
      
           // var startDate = moment(selectedDate.start).format('DD MMMM YYYY');
           // var startAtTime = moment(selectedDate.start).format('hh:mm:ss a');
           // var localFormat = 'YYYY-MM-DD[T]HH:mm:ss';
           //var startDateFormat = moment(startDate + ' ' + startAtTime).format(localFormat);
           
           // var endDate = moment(selectedDate.end).format('DD MMMM YYYY');
           // var endAtTime = moment(selectedDate.end).format('hh:mm:ss a');
           // var endDateFormat =  moment(endDate + ' ' + endAtTime).format(localFormat);

            $scope.startAt = selectedDate;
          // $scope.startAt  = moment(selectedDate, moment.ISO_8601);
           $scope.endsAt  = moment(selectedDate).add(15, 'm');;
           $scope.startDateCalendar = moment(selectedDate.start).format('DD MMMM YYYY');
           $scope.endDateCalendar = moment(selectedDate.end).format('DD MMMM YYYY'); 

          
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
              return selectedDate;
            }
          }
     });

     modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
        }, function () {
        });
        }
      };



     /*
    =========================================================
      Pop up Update Appoiment
      Todo: open the update windows when clinked on an event
    =========================================================
    */ 
     $scope.updateApp = function (size, selectedDate) {
        var modalInstance = $modal.open({
          templateUrl: 'modules/citas/partials/schedule.update.client.html',
          controller: function ($scope, $modalInstance, patient) {
           $scope.upstartAt = selectedDate.startsAt;
           $scope.upendsAt  = selectedDate.endsAt;
           $scope.upstartDateCalendar = moment(selectedDate.startsAt).format('DD MMMM YYYY');
           $scope.upendDateCalendar = moment(selectedDate.endsAt).format('DD MMMM YYYY'); 
           $scope.updoctorId = selectedDate.doctor._id;
           $scope.upAppType = selectedDate.appType;
           $scope.uplocation =  selectedDate.appLocation._id;
           $scope.upreason = selectedDate.reason;
           $scope.uppatient = selectedDate.patient._id;
           $scope.upappId = selectedDate.id;
           $scope.upstatus = selectedDate.status;
           $scope.patientFullName = selectedDate.patientName;
           console.log($scope.upappId);
          
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
              return selectedDate;
            }
          }
     });

     modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
        }, function () {
        });
      };


   $scope.alertEventOnClick = function(e){
      console.log('event clicked');
    };

    $scope.alertEventOnClick = function(e){
      console.log('a day was clicked');
    };

    $scope.alertOnResize = function(e){
      console.log('a day was rezise');
    };
    
    $scope.openPopover= function(start, end, jsEvent, view){
    };

   $scope.calOptions = {
      calendar:{
        defaultView: 'agendaDay',
        height: 450,
        editable: true,
        selectable: true,
        ignoreTimezone: true,
        header:{
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },

        // dayClick: function(date, jsEvent, view) {
        //   
        //   $scope.modelDetail('lg', date);
        // },
        select: function(start, end, allDay, jsEvent) {
          var date = {
              start: start,
              end: end
          };
          console.log(new Date(start).getTime() / 1000);
         $scope.modelDetail('lg', date);
       },
        dayClick: $scope.alertEventOnClick,
       //dayClick: $scope.alertEventOnClick(),
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
  };

    /*
    =========================================================
      Create New Appoiment
      Developer: Ronny Pabel Morel Mesa
      Create Date: 9/11/2015
      Todo: Method to insert a new appoiment
    =========================================================
    */ 
    this.create = function(){
       
       var citas = new Citas({
          appLoc :   this.location,
          appDoctor: this.doctor,
          appstartDate:  new Date($scope.startAt),
          appsendDate:   new Date($scope.endsAt),
          appPatient:   this.patient,
          appType:   this.appType,
          appReason:   this.reason,
          canceled: false,
          patientCheckIn: false  
       });

      citas.$save(function(response) {
         Notify.sendMsg('newPis', {'id': response._id});
         console.log($scope.events);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
        console.log($scope.error);
      });
    };


    $scope.init();
	}
]);

appCitas.controller('UpdateCitasController', [
   '$scope', 
   'Authentication', 
   'MaintainsAction',
   'Citas',
   'Patients',
   'UserAction',
   '$modal',
   'PatientFunctions',
   'DoctorAction',
   'LocationAction',
   'AppAction',
   'Notify',
   'MaintainsService', 
  function(
    $scope,
    Authentication, 
    MaintainsAction,
    Citas,
    Patients,
    UserAction,
    $modal,
    PatientFunctions,
    DoctorAction,
    LocationAction,
    AppAction,
    Notify, 
    MaintainsService){

  var vm = this;
  $scope.events = [];
  vm.todoList = '';

  $scope.init = function(){
        $scope.getTipoConsulta();
        $scope.getPatients();
        $scope.getDoctors();
        $scope.getLocations();
        $scope.getEstadoConsulta();
        $scope.refreshCalendar();
   };

   $scope.maintainas = MaintainsService.results;
   console.log($scope.maintainas);
   
   /*
    =============================================================
      Fill all the dropdown
    =============================================================
   */
   $scope.getPatients = function(){
      PatientFunctions.patientFunctionResult.getPatientList().then(function(result){
      $scope.listPatient = result;
     }, function(err){});
   };

   $scope.getDoctors = function(){
      UserAction.resultActions.getUsersList().then(function(result){
      $scope.doctorList = result;
     }, function(err){});
   };

   $scope.getTipoConsulta = function(){
     MaintainsAction.resultActions.getMbyCode('TipoConsulta')
    .then(function(res){
       $scope.tipoConsulta = res[0].parameters;
    }, function(err){
    });
    };

    $scope.getEstadoConsulta = function(){
     MaintainsAction.resultActions.getMbyCode('EstadoConsulta')
    .then(function(res){
       $scope.estadoConsulta = res[0].parameters;
    }, function(err){
    });
    };

    $scope.getLocations = function(){
     LocationAction.resultActions.getlocationList().then(function(res){
       $scope.locationList = res;
    }, function(err){
    });
    };
  

    $scope.refreshCalendar = function () {
      $scope.events.splice(0);
         AppAction.restultActions.getApp().then(function(data){
          for(var i = 0; i < data.length; i++){
          var doctorId = data[i].appDoctor;
        
         $scope.events.push({
          title: data[i].appPatient.patientFirstName + ' ' + data[i].appPatient.patientLastName,
          type: "warning",
          startsAt: new Date(data[i].appstartDate),
          endsAt: new Date(data[i].appsendDate),
          draggable: true,
          resizable: true,
          id: data[i].appId,
          reason: data[i].appReason,
          doctor: doctorId,
          patient: data[i].appPatient,
          appType: data[i].appType,
          appLocation: data[i].appLoc
         });
        }
       }, function(err){

       });
    };

    this.update = function(){

      console.log($scope.id);
       var cita  = new Citas({
          _id: $scope.upappId, 
          appLoc :   $scope.uplocation,
          appDoctor: $scope.updoctorId,
          appstartDate:  $scope.upstartAt,
          appsendDate:    $scope.upendsAt,
          appPatient:   $scope.uppatient ,
          appType:  $scope.upAppType,
          appReason:   $scope.upreason,
          status: $scope.upstatus,
          canceled: false,
          patientCheckIn: false  
       }); 

       console.log(cita);

      cita.$update(function(){ 
      Notify.sendMsg('newPis', {'id': 'nada'});
        }, function(errorResponse) {
       $scope.error = errorResponse.data.message;
      });
    };

  $scope.init();
    


}]);
'use strict'

angular.module('index', []);
'use strict';

//Citas service used to communicate Citas REST endpoints
angular.module('citas').factory('Citas', ['$resource',
	function($resource) {
		return $resource('citas/:citaId', { citaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('AppAction', ['$http', '$q', function($http, $q){
    var restultActions = {};
       
   restultActions.getApp = function(){
           var defer = $q.defer();
           $http.post('citas/getList').success(function(data){
           		defer.resolve(data);
           }).error(function(err){
           		defer.reject(err);
       });
           return defer.promise;
 };

 function getAppByDoctor (doctorId){
           var defer = $q.defer();
           $http.post('citas/getAppDoc', {doctorId}).success(function(data){
           		defer.resolve(data);
           }).error(function(err){
           		defer.reject(err);
       });
           return defer.promise;
 }
 
	return {
		restultActions,
		getAppByDoctor: getAppByDoctor
	};
}
]).factory('Notify', ['$rootScope', function($rootScope) {
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
	// Usar el service '$resource' para devolver un objeto '$resource' Patients
 
}]);

'use strict';

//Setting up route
angular.module('ciudads').config(['$stateProvider',
	function($stateProvider) {
		// Ciudads state routing
		$stateProvider.
		state('listCiudads', {
			url: '/ciudads',
			templateUrl: 'modules/ciudads/views/list-ciudads.client.view.html'
		}).
		state('createCiudad', {
			url: '/ciudads/create',
			templateUrl: 'modules/ciudads/views/create-ciudad.client.view.html'
		}).
		state('viewCiudad', {
			url: '/ciudads/:ciudadId',
			templateUrl: 'modules/ciudads/views/view-ciudad.client.view.html'
		}).
		state('editCiudad', {
			url: '/ciudads/:ciudadId/edit',
			templateUrl: 'modules/ciudads/views/edit-ciudad.client.view.html'
		});
	}
]);
// 'use strict';

// // Ciudads controller
// angular.module('ciudads').controller('CiudadsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ciudads',
// 	function($scope, $stateParams, $location, Authentication, Ciudads) {
// 		$scope.authentication = Authentication;

// 		// Create new Ciudad
// 		$scope.create = function() {
// 			// Create new Ciudad object
// 			var ciudad = new Ciudads ({
// 				name: this.name
// 			});

// 			// Redirect after save
// 			ciudad.$save(function(response) {
// 				$location.path('ciudads/' + response._id);

// 				// Clear form fields
// 				$scope.name = '';
// 			}, function(errorResponse) {
// 				$scope.error = errorResponse.data.message;
// 			});
// 		};

// 		// Remove existing Ciudad
// 		$scope.remove = function(ciudad) {
// 			if ( ciudad ) { 
// 				ciudad.$remove();

// 				for (var i in $scope.ciudads) {
// 					if ($scope.ciudads [i] === ciudad) {
// 						$scope.ciudads.splice(i, 1);
// 					}
// 				}
// 			} else {
// 				$scope.ciudad.$remove(function() {
// 					$location.path('ciudads');
// 				});
// 			}
// 		};

// 		// Update existing Ciudad
// 		$scope.update = function() {
// 			var ciudad = $scope.ciudad;

// 			ciudad.$update(function() {
// 				$location.path('ciudads/' + ciudad._id);
// 			}, function(errorResponse) {
// 				$scope.error = errorResponse.data.message;
// 			});
// 		};

// 		// Find a list of Ciudads
// 		$scope.find = function() {
// 			$scope.ciudads = Ciudads.query();
// 		};

// 		// Find existing Ciudad
// 		$scope.findOne = function() {
// 			$scope.ciudad = Ciudads.get({ 
// 				ciudadId: $stateParams.ciudadId
// 			});
// 		};
// 	}
// ]);

'use strict';

var ciudadModule = angular.module('ciudads');

// ciudad controller
ciudadModule.controller('ciudadController', [
	'$scope', 
	'$http',  
	'$location', 
	'Authentication', 
	'Ciudad', 
	'Pais',
	'Notify',
	'$modal', 
	'$log',
	function($scope, $http,  $location, Authentication, Ciudad, Pais, Notify, $modal, $log) {
		this.authentication = Authentication;
       console.log(this.authentication);
	    // Find a list of ciudad
	   this.ciudad = Ciudad.query();
	  // this.pais = Pais.query();

  //Open the middleware to open a single ciudad modal.
	 this.modelCreate = function (size) {
		    var modalInstance = $modal.open({
		      templateUrl: 'modules/ciudads/views/create-ciudad.client.view.html',
		      controller: 'modalResutl',

		    //    function ($scope, $modalInstance) {
                
      //            $scope.ok = function (result) {
      //            	console.log($scope.refered);
      //            	if(this.refered){
      //            		$modalInstance.close();
      //            	}
				  // };

				  // $scope.cancel = function () {
				  //   $modalInstance.dismiss('cancel');
				  // };

		    //   },
		      size: size
		 });

	 modalInstance.result.then(function (selectedItem) {
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };


     //Open the middleware to open a single ciudad modal.
	 this.modelUpdate = function (size, selectedciudad) {

            console.log(selectedciudad);
		    var modalInstance = $modal.open({
		      templateUrl: 'modules/ciudads/views/edit-ciudad.client.view.html',
		      controller: function ($scope, $modalInstance, ciudad) {
                 $scope.ciudad = ciudad;

                 $scope.ciudad.rpais = selectedciudad.pais._id;

             
                 Notify.sendbroadCast('noError', 'this is a message');

                 $scope.ok = function () { 	
                  $modalInstance.close($scope.ciudad);
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };

		      },
		      size: size,
		      resolve: {
		        ciudad: function () {
		          return selectedciudad;
		        }
		      }
		 });

	 modalInstance.result.then(function (selectedciudad) {
      $scope.selected = selectedciudad;
      //console.log($scope.selected);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };

/*	  $scope.$on('handleBroadcast', function(){

	  if($scope.returnciudad){

	  	$scope.returnciudad = '';
	  }
	  	  // this.ciudad = $scope.ciudad;
	  });*/
	  
	// Notify.getMgs('hola', function(event, data){
	// 	 console.log('JODETE');
	// });

	  // Remove existing Pai
	this.remove = function(ciudad) {
			if( ciudad ) { 
				ciudad.$remove();

				for (var i in this.ciudad) {
					if (this.ciudad [i] === ciudad) {
						this.ciudad.splice(i, 1);
					}
				}
			} else {
				this.ciudad.$remove(function() {
				});
			}
		};

		
	
	 }
]);




ciudadModule.controller('modalResutl',  function ($scope, $modalInstance) {

/*  $scope.$on('noError', function(){
  	
 });
*/

  $scope.ok = function () {	
    $modalInstance.close();
   };


  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


ciudadModule.controller('CiudadCreateController', ['$scope',  'Ciudad', 'Notify', 'Pais',
	function($scope, Ciudad, Notify, Pais) {

		this.pais = Pais.query();
	  	// // Create new Pai
	  this.create = function() {
			// Create new Pai object
	   var ciudads = new Ciudad ({
				name: this.name,
				pais: this.Selectedpais
	   });
			

			//console.log(ciudads);
			// Redirect after save
			ciudads.$save(function(response) {
             Notify.sendMsg('newPis', {'id': response._id});
            // Notify.sendbroadCast('noError');*/
            // this.ciudad = Ciudad.query();
				// Clear form fields
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

	}
]);

ciudadModule.controller('ciudadUpdateController', ['$scope', 'Authentication', 'Ciudad', 'Pais', 'Notify',
	function($scope, Authentication, Ciudad, Pais, Notify) {
		//$scope.authentication = Authentication;
	    // Update existing Pai
        
          this.pais = Pais.query();
	      this.update = function(updateciudad) {
          
	      var ciudad = new Ciudad ({
	      		_id: updateciudad._id,
				name: updateciudad.name,
				pais: $scope.ciudad.rpais
	       });
	     

		  ciudad.$update(function() {
		  	 console.log("did safe");
		  	 Notify.sendMsg('newPis', {'id': 'update'});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				console.log($scope.error);
			});
	   };
     	
	}
]);


ciudadModule.directive('ciudadList', ['Ciudad', 'Notify', function(Ciudad, Notify){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/ciudads/views/ciudad-list.template.html',
    link: function(scope, element, attr){
         // when a new ciudad is added update the ciudad List..
         // Notify.getMsg('newCiudad', function(event, data){
         // 	scope.rpais = data;
            
         // });

           Notify.getMsg('newPis', function(event, data){
           	console.log('got the message');
            scope.ciudadCtrl.ciudad = Ciudad.query();
            console.log(scope.ciudadCtrl.ciudad);
         });
    }
  };
}]);



'use strict';

//Ciudads service used to communicate Ciudads REST endpoints
angular.module('ciudads').factory('Ciudad', ['$resource',
	function($resource) {
		return $resource('ciudads/:ciudadId', { ciudadId: '@_id'
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
 
}])



'use strict';

//Setting up route
angular.module('clientes').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('listClientes', {
			url: '/clientes',
			templateUrl: 'modules/clientes/views/list-clientes.client.view.html'
		});
	}
]); 
'use strict';

var clienteModule = angular.module('clientes');

// cliente controller
clienteModule.controller('clienteController', [
	'$scope', 
	'$http',  
	'$location', 
	'Authentication',
	'Pais',
	'Ciudad',
	'Sector', 
	'Cliente', 
	'Notify',
	'ngTableParams',
	'$modal', 
	'$log',
	function($scope, $http,  $location, Authentication, Pais, Ciudad, Sector, Cliente, Notify, ngTableParams, $modal, $log) {
		this.authentication = Authentication;

	    // Find a list of cliente
       var params = {
       	  page: 1,            
	      count: 5,
	      filter: {
            name: name
        }
       };

       var settings = {
      // 	groupBy: 'tipo',
       	total: 0,  
       	counts: [5,10,15],        
	    getData: function($defer, params) {
	        Cliente.get(params.url(), function(response){     
                params.total(response.total);
                $defer.resolve(response.results);
                $scope.total = response.total;
	        });
	      
	        }
       };

	  $scope.tableParams = new ngTableParams( params, settings);
      //Open the middleware to open a single cliente modal.
	  this.modelCreate = function (size) {
		    var modalInstance = $modal.open({
		      templateUrl: 'modules/clientes/views/create-clientes.client.view.html',
		      controller: 'modalResutl',
		      size: size
		 });

	 modalInstance.result.then(function (selectedItem) {
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };

	    this.modelUpdate = function (size, selectedClient) {      
          var modalInstance = $modal.open({
          templateUrl: 'modules/clientes/views/edit-clientes.client.view.html',
          controller: function ($scope, $modalInstance, cliente) {

          	 console.log(selectedClient);
               $scope.cliente = cliente;
               $scope.cliente.rpais = selectedClient.pais;
               $scope.cliente.rciudad = selectedClient.ciudad;
               $scope.cliente.rsector = selectedClient.sector;
               console.log($scope.cliente.rciudad);
          $scope.ok = function () {  
            $modalInstance.close($scope.cliente);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size,
          resolve: {
            cliente: function () {
              return selectedClient;
            }
          }
     });

	   modalInstance.result.then(function (selectedItem) {
	      $scope.selected = selectedItem;
	      }, function () {
	        $log.info('Modal dismissed at: ' + new Date());
	      });
	  };

	  this.doSearch = function () {
		    $scope.tableParams.reload();
		};

	 this.modelRemove = function (size, selectedcliente) {
	   	    $scope.cliente = selectedcliente;
		    var modalInstance = $modal.open({
		      templateUrl: 'modules/clientes/views/clientes-delete.template.html',
		      controller: 
		      //'modalDelete',
		      function ($scope, $modalInstance, cliente) {
                 $scope.cliente = cliente;

                  $scope.ok = function () {
                   //console.log($scope.cliente);
                  // $scope.doSearch();
                  $modalInstance.close($scope.cliente);
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };

		      },
		      size: size,
		      resolve: {
		        cliente: function () {
		          return selectedcliente;
		        }
		      }
		 });

	 modalInstance.result.then(function (selectedcliente) {
      $scope.selected = selectedcliente;
      //console.log($scope.selected);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };

	  // Remove existing Pai
	$scope.remove = function(cliente) {
			if( cliente ) { 
				cliente.$remove();

				for (var i in this.cliente) {
					if (this.cliente [i] === cliente) {
						this.cliente.splice(i, 1);
					}
				}
			} else {
				this.cliente.$remove(function() {
				});
			}
		};
	 }
]);


clienteModule.controller('clienteDeleteController', ['$scope', 'Authentication', 'Cliente', 'Notify',
	function($scope, Authentication, Cliente, Notify) {
		//$scope.authentication = Authentication;
        
	      this.delete = function(cliente) {
	       var cliente = new Cliente({
                _id: $scope.cliente._id
	       });

	       cliente.$remove(function(){
	        Notify.sendMsg('newPis', {'id': 'nada'});
	       }, function(errorResponse) {
		  	$scope.error = errorResponse.data.message;
		   });
	   };	
	}
]);

clienteModule.controller('clienteUpdateController', ['$scope', 'Authentication', 'Cliente', 'Notify', 'Pais', 'Ciudad', 'Sector', '$mdToast', '$animate',
	function($scope, Authentication, Cliente, Notify, Pais, Ciudad, Sector, $mdToast, $animate) {

		 this.pais = Pais.query();
		 this.ciudad = Ciudad.query();
		 this.sector = Sector.query();
		 
		 this.filterByPais = function(){
            this.sector = {};
           
		 };

		 this.filterByCiudad = function(){
		 	this.sector = Sector.query();
		 };
	 
	    this.update = function(updateCliente) {
	   	     console.log("patientUpdate");

	      	var cliente  = new Cliente ({
	      		_id: updateCliente._id,
				name: updateCliente.name,
				tipo: updateCliente.tipo,
                clienteRNC: updateCliente.clienteRNC,
                clienteTelefono: updateCliente.clienteTelefono,
                pais: $scope.cliente.rpais,
	            ciudad: $scope.cliente.rciudad,
	            sector: $scope.cliente.rsector,
	            clienteDireccion: updateCliente.clienteDireccion
	       });

	     this.showSimpleUdpdate = function() {
			    $mdToast.show(
			      $mdToast.simple()
			        .content('Paso!!')
			        .position('bottom right')
			        .hideDelay(3000)
			    );
		};
	
	   cliente.$update(function() {
		  	 Notify.sendMsg('newPis', {'id': 'update'});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
	   };
     	
	}
]);

 clienteModule.controller('modalResutl',  function ($scope, $modalInstance) {

   $scope.ok = function () {
     $modalInstance.close();
    };


   $scope.cancel = function () {
     $modalInstance.dismiss('cancel');
   };
 });


 clienteModule.controller('clienteCreateController', 
 	['$scope', 
 	'Cliente', 
 	'Notify', 
 	'Pais',
 	'Ciudad',
 	'Sector',
 	function($scope, Cliente, Notify, Pais, Ciudad, Sector) {

 	  this.pais = Pais.query();
 		
 	  this.filterByCity = function() {
        this.ciudad = Ciudad.query();
        this.sector = '';
        // this.sector = {};
 	  };

 	  this.filterSector = function(){
 	  	this.sector = Sector.query();
 	  };

 	  	// Create new Pai
 	  this.create = function() {
 			// Create new Pai object
 	   var clientes = new Cliente ({
 				name: this.name,
 				tipo: 'A',
                clienteRNC: this.clienteRNC,
                clienteTelefono: this.clienteTelefono,
                pais: this.clientePais,
	            ciudad: this.clienteCiudad,
	            sector: this.clienteSector,
	            clienteDireccion: this.clienteDireccion
 	      });
 			
			clientes.$save(function(response) {
              Notify.sendMsg('newPis', {'id': response._id});
             // Notify.sendbroadCast('noError');*/
             // this.cliente = cliente.query();
 			}, function(errorResponse) {
 				$scope.error = errorResponse.data.message;
 			});
 	  };

 	}
 ]);



clienteModule.directive('clienteList', ['Cliente', 'Notify', function(Cliente, Notify){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/clientes/views/clientes-list.template.html',
     link: function(scope, element, attr){          
          // when a new cliente is added update the cliente List..
          // Notify.getMsg('newcliente', function(event, data){
         // 	scope.rpais = data;
            
         // });

            Notify.getMsg('newPis', function(event, data){            	console.log('got the message');
            scope.clienteCtrl.doSearch(); 
         });
    }
   };
 }]);



'use strict';

// Crear el service 'patients'
angular.module('clientes')
.factory('Cliente', ['$resource', function($resource) {
	// Usar el service '$resource' para devolver un objeto '$resource' Patients
    return $resource('/api/clientes/:clienteId', {
        clienteId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}])

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
 
}]).factory('ClientAction', ['$http', '$q', function($http, $q){
    var resultActions = {};
    
    resultActions.getSegurosList = function(){
        var defer = $q.defer();
        $http.post('cliente/getList').
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




'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/singin');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/home',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
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
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		//console.log($scope.authentication);
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

//Setting up route
angular.module('dashboards').config(['$stateProvider',
	function($stateProvider) {
		// Dashboards state routing
		$stateProvider.
		state('listDashboards', {
			url: '/dashboards',
			templateUrl: 'modules/dashboards/views/list-dashboards.client.view.html'
		}).
		state('createDashboard', {
			url: '/dashboards/create',
			templateUrl: 'modules/dashboards/views/create-dashboard.client.view.html'
		}).
		state('viewDashboard', {
			url: '/dashboards/:dashboardId',
			templateUrl: 'modules/dashboards/views/view-dashboard.client.view.html'
		}).
		state('editDashboard', {
			url: '/dashboards/:dashboardId/edit',
			templateUrl: 'modules/dashboards/views/edit-dashboard.client.view.html'
		});
	}
]);
'use strict';

// Dashboards controller
var appDashBoard = angular.module('dashboards');

appDashBoard.controller('DashboardsController', 
	['$scope', 
	'$stateParams', 
	'$location', 
	'Authentication', 
	'Dashboards',
	'AppAction',
	'MaintainsAction',
  'PatientFunctions',
	'lodash',
	'Maintains',
	'$resource',
	'$http',
	function($scope, $stateParams, $location, Authentication, Dashboards, AppAction, MaintainsAction, PatientFunctions, lodash, Maintains, $resource, $http) {
		$scope.authentication = Authentication;
		  
   $scope.showApp = 'citados';
   $scope.init = function(){
   		 $scope.appByDoctors();
       $scope.getPatients();       
   };

   $scope.isSaving = true;

   $scope.sendPatientChart= function(param){
    console.log(param);

      if(param){
      $location.path('/patients/' + param);
    }
   };


    $scope.getPatients = function(){
      PatientFunctions.patientFunctionResult.getPatientList().then(function(result){
      $scope.listPatient = result;
     }, function(err){});
   };

   $scope.showFunction = function(currentId){
      if(currentId === $scope.currentItem){
         $scope.currentItem = null;
      }else{
        $scope.currentItem = currentId;
       }
   };

   $scope.setView = function(view){
    $scope.showApp = view;
   };



$scope.appByDoctors = function(){
     MaintainsAction.resultActions.getMbyCode('TipoConsulta')
      .then(function(res){
      $scope.data = res[0].parameters;

      MaintainsAction.resultActions.getMbyCode('EstadoConsulta')
      .then(function(appStatus){
      $scope.appStatus  = appStatus[0].parameters;

      AppAction.getAppByDoctor($scope.authentication.user._id)
     .then(function(result){
      /*Get the all apps Patient*/

      $scope.appCheckin = lodash.chain(result)
                    .filter(isAppFromToday)
                    .map(function(item){
                    	 var appType = getMaintainesDesc(item.appType);
                       var status = getAppStatusDesc(item.status);
                    	 var appUptime = getDateDiff(item.appstartDate);
                      return {
                    		appLoc: item.appLoc,
                    		appPatient: item.appPatient,
                    		appId: item.appId,
                    		appDoctor:item.appDoctor,
                    		appReason: item.appReason,
                    		appType: appType,
                    		appsendDate: item.appsendDate,
                    	  appstartDate: item.appstartDate,
                        appStatus: status,
                        appUptime : appUptime
                    	};
                    })
                    .value();

     $scope.watingApp = lodash.chain(result)
                    .filter(watingAppFun)
                    .map(function(item){
                      var appType = getMaintainesDesc(item.appType);
                      var status = getAppStatusDesc(item.status);
                      return {
                        appLoc: item.appLoc,
                        appPatient: item.appPatient,
                        appId: item.appId,
                        appDoctor:item.appDoctor,
                        appReason: item.appReason,
                        appType: appType,
                        appsendDate: item.appsendDate,
                        appstartDate: item.appstartDate,
                        appStatus: status
                      };
                    })
                    .value();

    $scope.completeApp = lodash.chain(result)
                    .filter(completeAppFun)
                    .map(function(item){
                      var appType = getMaintainesDesc(item.appType);
                      var status = getAppStatusDesc(item.status);
                     
                      return {
                        appLoc: item.appLoc,
                        appPatient: item.appPatient,
                        appId: item.appId,
                        appDoctor:item.appDoctor,
                        appReason: item.appReason,
                        appType: appType,
                        appsendDate: item.appsendDate,
                        appstartDate: item.appstartDate,
                        appStatus: status
                        
                      };
                    })
                    .value();


      $scope.checkinCount = $scope.appCheckin.length;
      $scope.waitingCount = $scope.watingApp.length;
      $scope.completeAppCount  = $scope.completeApp.length;
      $scope.appDoctor = result;
      //console.log($scope.completeApp);
      $scope.isSaving = false;
       function getDateDiff(startDate){
          var now = '29/10/2015 15:17:00';
          var duration = {};

         if(moment()> new Date(startDate))
         {
           duration = {
             retrasada: true,
             hora: moment.utc(moment(moment(), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(startDate), 'DD/MM/YYYY HH:mm:ss'))).format('HH:mm:ss')
           };
         }else {
           duration = {
             retrasada: false,
             hora: moment.utc(moment(new Date(startDate), 'DD/MM/YYYY HH:mm:ss').diff(moment(moment(), 'DD/MM/YYYY HH:mm:ss'))).format('HH:mm:ss')
           };
          }

          console.log(duration.hora + ' ' + moment.utc );
          return duration;
       }

       function isAppFromToday(team){    
        if (team){
       	return ((moment(team.appstartDate).format('DD MMMM YYYY') ===  moment().format('DD MMMM YYYY')) && (getAppStatusDesc(team.status) === 'Por Venir'));
        //return ((moment(team.appstartDate).format('DD MMMM YYYY') ===  moment().format('DD MMMM YYYY')) && (team.patientCheckIn === true));
         }
        }

        function watingAppFun(team){
        if(team){
        return ((moment(team.appstartDate).format('DD MMMM YYYY') ===  moment().format('DD MMMM YYYY')) && (getAppStatusDesc(team.status) === 'En Espera'));
        //return ((moment(team.appstartDate).format('DD MMMM YYYY') ===  moment().format('DD MMMM YYYY')) && (team.patientCheckIn === true));
          }
        }

        function completeAppFun(team){
          if(team){
        return ((moment(team.appstartDate).format('DD MMMM YYYY') ===  moment().format('DD MMMM YYYY')) && (getAppStatusDesc(team.status) === 'Completado' || getAppStatusDesc(team.status) === 'Cancelado'));
        //return ((moment(team.appstartDate).format('DD MMMM YYYY') ===  moment().format('DD MMMM YYYY')) && (team.patientCheckIn === true));
         }
        }

      function getMaintainesDesc(paramId){
      var mantain;
      if(paramId === undefined)
      {
         mantain = '';
      }else {
        mantain = lodash.chain($scope.data)
                           .find({ '_id': paramId})
                           .value();
      }
    	return mantain.value;
      }

      function getAppStatusDesc(paramId){
        var mantain;
      if(paramId === undefined)
      {
         mantain = 'En Espera';
      }else{
       mantain = lodash.chain($scope.appStatus)
                           .find({ '_id': paramId})
                           .value();
      }
      return mantain.value;
      }

      });
      });

     }, function(err){
    });/*end of */
    
};

   $scope.calculateAge = function(birthday) { // pass in player.dateOfBirth
    var ageDifMs = Date.now() - new Date(birthday);
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

  if($scope.authentication){
    $scope.init();
  }
	}
]);

appDashBoard .directive('dashactive', function () {
      return {
         restrict: 'A',
         scope: true,
         controller: function ($scope, $element, $attrs) {
         },
    
         link: function (scope, el, attrs) {
         	var link = el.find('li');
            link.bind('click', function() {
            	var $this = $(this);
            	var $next = $this.nextAll();
            	var $prev = $this.prevAll();
            	$prev.removeClass('active');
            	$next.removeClass('active');
		        $this.toggleClass('active');
           });
         }
      };
 });

appDashBoard .directive('divlist', function () {
      return {
         restrict: 'A',
         scope: true,
         controller: function ($scope, $element, $attrs) {
         },
    
         link: function (scope, el, attrs) {
          var link = el.find('a');
            link.bind('click', function() {
              //console.log('this has been clicked');
            var $this = $(this);
            var $div = $this.closest('div.divCont');

            //$('#LeftScrollableDiv').children().first();
            if($div.hasClass('hideDiv')){
              $div.removeClass('hideDiv');
              $div.toggleClass('showDiv');
            }else{
              $div.removeClass('showDiv');
              $div.toggleClass('hideDiv');
            }
             //    $div.style.display = 'block';
             // else
             //    $div.style.display = 'none';
            
            //   var $next = $this.nextAll();
            //   var $prev = $this.prevAll();
            //   $prev.removeClass('active');
            //   $next.removeClass('active');
            // $this.toggleClass('active');
           });
         }
      };
 });

appDashBoard.directive('appCheckin', function(){
	return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/dashboards/templates/checkin.html',
    link: function(scope, element, attr){         
      // when a new procedimiento is added update the cliente List..
      
    }
   };
});

appDashBoard.directive('appWaiting', function(){
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/dashboards/templates/waiting.html',
    link: function(scope, element, attr){         
      // when a new procedimiento is added update the cliente List..
    }
   };
});

appDashBoard.directive('appComplete', function(){
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/dashboards/templates/complete.html',
    link: function(scope, element, attr){         
      // when a new procedimiento is added update the cliente List..
    }
   };
});
'use strict';

//Dashboards service used to communicate Dashboards REST endpoints
angular.module('dashboards').factory('Dashboards', ['$resource',
	function($resource) {
		return $resource('dashboards/:dashboardId', { dashboardId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
// Invocar modo JavaScript 'strict'
'use strict';

// Configurar el módulo routes de 'patients'
angular.module('doctor').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('doctorList', {
			url:'/doctors',
			templateUrl: 'modules/doctors/views/list-doctor.client.view.html'
		});
	}
]); 
'use strict';

var doctorModule = angular.module('doctor');

doctorModule.controller
('doctorsController', 
['$scope', 
 '$http', 
 '$location',
 'Doctors',  
 'Authentication', 
 'ngTableParams',
 '$modal', 
  '$log',
 'Pais',
 'Ciudad',
 'Sector',
 'Cliente',
 function($scope, $http,  $location, Doctors, Authentication, ngTableParams, $modal, $log,
  //Seguros, 
  Pais, Ciudad, Sector, Cliente) {
      
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
         Doctors.get(params.url(), function(response){     
                params.total(response.total);
                $defer.resolve(response.results);
                $scope.total = response.total;
               // console.log(response);
          });
        
          }
       };

    $scope.calculateAge = function calculateAge(birthday) { 
    // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    console.log(Math.abs(ageDate.getUTCFullYear() - 1970));
    //return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    $scope.tableParams = new ngTableParams( params, settings);
    //Open the middleware to open a single cliente modal.
     this.modelRemove = function (size, selectedcliente) {
          $scope.patient = selectedcliente;
        var modalInstance = $modal.open({
          templateUrl: 'patients/views/patient-delete.template.html',
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
              return selectedcliente;
            }
          }
     });

   modalInstance.result.then(function (selectedcliente) {
      $scope.selected = selectedcliente;
      //console.log($scope.selected);
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

        //Open the middleware to open a single pais modal.
   this.modelUpdate = function (size, selectedDoctor) {

        var modalInstance = $modal.open({
          templateUrl: 'modules/doctors/views/edit-doctor.client.view.html',
          controller: function ($scope, $modalInstance, doctor) {
                $scope.doctor = doctor;
                console.log(selectedDoctor);
                $scope.doctor.rpais = selectedDoctor.pais;
                $scope.doctor.rciudad = selectedDoctor.ciudad;
                $scope.doctor.rsector = selectedDoctor.sector;
                $scope.doctor.rdoctorDepartment = selectedDoctor.deparment;
                $scope.doctor.rdoctorEspecialidad =  selectedDoctor.especialidad;

                // console.log($scope.doctor.rsector);

          $scope.ok = function () {  
              $modalInstance.close($scope.doctor);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size,
          resolve: {
            doctor: function () {
              return selectedDoctor;
            }
          }
     });

   modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };


    this.modelCreate = function (size) {
        var modalInstance = $modal.open({
          templateUrl: 'modules/doctors/views/create-doctor.client.view.html',
          controller: 'modalResutl',
          size: size
     });

     modalInstance.result.then(function (selectedItem) {
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    this.doSearch = function () {
        $scope.tableParams.reload();
    };  

 }

]);

doctorModule.controller
  ('doctorCreateController', 
  ['$scope', 
   '$http',  
   'Authentication', 
   'Doctors',
   'Pais',
   'Ciudad',
   'Sector',
   'Cliente',
   'MaintainsAction',
   'Notify', 
   '$mdToast', 
   '$animate',
   function($scope, $http,  Authentication, 
    Doctors, 
    Pais, Ciudad, Sector, Cliente, MaintainsAction, Notify,  $mdToast, $animate) {

    this.pais = Pais.query();
    this.ciudad = Ciudad.query();
    this.sector = Sector.query();
    this.doctorPhones = {};

   $scope.init = function(){
        $scope.getTipoEspecialidad();
        $scope.getTipoDepartment();      
   };

   $scope.getTipoEspecialidad = function(){
     MaintainsAction.resultActions.getMbyCode('Especialidad')
    .then(function(res){
       $scope.especialidad = res[0].parameters;
    }, function(err){
    });
   };

     $scope.getTipoDepartment = function(){
     MaintainsAction.resultActions.getMbyCode('Departamentos')
    .then(function(res){
       $scope.department = res[0].parameters;
    }, function(err){
    });
   };

    this.filterByPais = function(){
      this.sector = {};      
    };

    this.filterByCiudad = function(){
      this.sector = Sector.query();
    };

    this.DoctorCI = {};
    $scope.authentication = Authentication;
    $scope.referred = true;
    //$scope.seguros = Seguros.query();

    this.showPatientSave = function() {
      $mdToast.show(
        $mdToast.simple()
          .content('Nuevo Paciente Guardado!!')
          .position('bottom right')
          .hideDelay(3000)
      );
    };

    this.create = function(){
      this.DoctorCI = {
          tipo: this.DoctorCI.tipo, 
         value: this.DoctorCI.tipovalue 
      };

      this.doctorPhones = {
       celular : this.doctorPhones.celular,
       casa : this.doctorPhones.casa,
     };

      var doctor = new Doctors({
      DoctorCI: this.DoctorCI,
      firstName: this.firstName,
      lastName: this.lastName,
      deparment: this.doctorEspecialidad,
      especialidad: this.especialidad,
      doctorPhones :  this.doctorPhones,
      DoctorEmail: this. DoctorEmail,
      sexo: this.sexo,
      DoctorDireccion: this.DoctorDireccion,   
      pais: this.doctorPais,
      ciudad: this.doctorCiudad,
      sector: this.doctorSector
      });

      // Usar el método '$save' de Patient para enviar una petición POST apropiada
      doctor.$save(function(response){ 
      Notify.sendMsg('newPis', {'id': 'nada'});
      }, function(errorResponse) {
       // En otro caso, presentar al usuario el mensaje de error
       $scope.error = errorResponse.data.message;
       console.log($scope.error);
       });
    };

    $scope.init();
    }
]);

doctorModule.controller
  ('doctorUpdateController', 
  ['$scope', 
   '$http',   
   'Authentication', 
   'Doctors', 
   //'Seguros',
   'Pais',
   'Ciudad',
   'Sector',
   'Cliente',
   'MaintainsAction',
   'Notify', '$mdToast', '$animate',
   function($scope, $http,   Authentication, Doctors, 
    Pais, Ciudad, Sector, Cliente, MaintainsAction, Notify, $mdToast, $animate) {

    this.pais = Pais.query();
    this.ciudad = Ciudad.query();
    this.sector = Sector.query();
    this.doctorPhones = {};

    $scope.init = function(){
        $scope.getTipoEspecialidad();
        $scope.getTipoDepartment();
   };

   $scope.getTipoEspecialidad = function(){
     MaintainsAction.resultActions.getMbyCode('Especialidad')
    .then(function(res){
       $scope.especialidad = res[0].parameters;
    }, function(err){
    });
   };

     $scope.getTipoDepartment = function(){
     MaintainsAction.resultActions.getMbyCode('Departamentos')
    .then(function(res){
       $scope.department = res[0].parameters;
    }, function(err){
    });
   };
   
     this.filterByPais = function(){
            this.sector = {}; 
     };

     this.filterByCiudad = function(){
      this.sector = Sector.query();
     };

    this.showDoctorSave = function() {
      $mdToast.show(
        $mdToast.simple()
          .content('Nuevo Paciente Guardado!!')
          .position('bottom right')
          .hideDelay(3000)
      );
    };

    this.update = function(selectedDoctor){
    this.DoctorCI = {
      tipo: selectedDoctor.DoctorCI.tipo, 
      value: selectedDoctor.DoctorCI.value 
    };

    this.doctorPhones = {
       celular : selectedDoctor.doctorPhones.celular,
       casa : selectedDoctor.doctorPhones.casa,
     };
    // Usar los campos form para crear un nuevo objeto $resource Patient
      var doctors = new Doctors({
      _id: selectedDoctor._id,
      DoctorCI : this.DoctorCI,
      sexo: selectedDoctor.sexo,
      firstName: selectedDoctor.firstName,
      lastName: selectedDoctor.lastName,
      deparment: $scope.doctor.rdoctorDepartment,
      especialidad: $scope.doctor.rdoctorEspecialidad,
      doctorPhones :  this.doctorPhones,
      DoctorEmail : selectedDoctor.DoctorEmail,
      DoctorTelefono: selectedDoctor.DoctorTelefono,
      DoctorDireccion: selectedDoctor.DoctorDireccion,
      pais: $scope.doctor.rpais,
      ciudad: $scope.doctor.rciudad,
      sector: $scope.doctor.rsector

      });
      //console.log(selectedDoctor);
      console.log(doctors);
      //
     // Usar el método '$save' de Patient para enviar una petición POST apropiada
      doctors.$update(function(){ 
      Notify.sendMsg('newPis', {'id': 'nada'});
      }, function(errorResponse) {
       $scope.error = errorResponse.data.message;
       });
    };

    $scope.init();
    }
]);

doctorModule.controller('patientDeleteController', ['$scope', 'Authentication', 'Patients', 'Notify', '$mdToast', '$animate',
  function($scope, Authentication, Patients, Notify, $mdToast, $animate) {
    $scope.authentication = Authentication;
      // Update existing Pai
        
        this.delete = function(patient) {
          //console.log ('passed');
         var patient = new Patients({
                _id: $scope.patient._id
         });

         console.log($scope.patient);

         patient.$remove(function(){
          Notify.sendMsg('newPis', {'id': 'nada'});
         }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
       });

     };

     this.showSimpleToast = function() {
      $mdToast.show(
        $mdToast.simple()
          .content('Paciente Eliminado!!')
          .position('bottom right')
          .hideDelay(3000)
      );
    };
      
  }
]);


doctorModule.directive('doctorsList', ['Patients', 'Notify', function(Cliente, Notify){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/doctors/views/doctor-list.template.html',
     link: function(scope, element, attr){         
      // when a new procedimiento is added update the cliente List..
            Notify.getMsg('newPis', function(event, data){
                scope.doctorsCtrl.doSearch(); 
         });
    }
   };
 }]);
'use strict';

// Crear el service 'patients'
angular.module('doctor').factory('Doctors', ['$resource', function($resource) {
	// Usar el service '$resource' para devolver un objeto '$resource' Patients
    return $resource('api/doctors/:doctorId', {
        doctorId: '@_id'
    }, {
        update: {
            method: 'PUT'
        },
        'save': {
            method: 'POST',
            isArray: false
        }
    });
}])
    .factory('Notify', ['$rootScope', function($rootScope) {
    var notify = {};
    notify.msg = '';

    notify.sendbroadCast = function(mgs){
      this.msg = mgs;
      this.broadCast(mgs);
      //console.log(this.mgs);
    };

    notify.broadCast = function(msg){
        $rootScope.$broadcast('noError', msg);
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
    // Usar el service '$resource' para devolver un objeto '$resource' Patients
 
}]).factory('DoctorAction', ['$http', '$q', function($http, $q){
    var resultActions = {};
    
    resultActions.getDoctorList = function(){
        var defer = $q.defer();
        $http.post('doctor/getList').
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

'use strict';

//Setting up route
angular.module('documents').config(['$stateProvider',
	function($stateProvider) {
		// Documents state routing
		$stateProvider.
		state('listDocuments', {
			url: '/documents',
			templateUrl: 'modules/documents/views/list-documents.client.view.html'
		}).
		state('createDocument', {
			url: '/documents/create',
			templateUrl: 'modules/documents/views/create-document.client.view.html'
		}).
		state('viewDocument', {
			url: '/documents/:documentId',
			templateUrl: 'modules/documents/views/view-document.client.view.html'
		}).
		state('editDocument', {
			url: '/documents/:documentId/edit',
			templateUrl: 'modules/documents/views/edit-document.client.view.html'
		});
	}
]);
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
	 NotifyDocument){
	
	 var vm = this;
	 vm.result = {};
	 vm.isSaving = false;
	 vm.authentication = Authentication;

	 NotifyDocument.getMsg('setDocument', function(event, data){
	 	console.log(data);
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
   	     	 $scope.docList = data;
   	     	 console.log($scope.docList);
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
		 	createUser: vm.authentication.user._id
		 };
		 
		 DocumentAccion.newDocument(vm.saveresult)
		 .then(function(data){
		 $timeout(function() {
        	 vm.isSaving = false;
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

'use strict';

//Setting up route
angular.module('locations').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('listLocations', {
			url: '/locations',
			templateUrl: 'modules/locations/views/list-locations.client.view.html'
		});
	}
]); 
'use strict';

var locationModule = angular.module('locations');

// location controller
locationModule.controller('locationController', [
	'$scope', 
	'$http',  
	'$location', 
	'Authentication',
	'Pais',
	'Ciudad',
	'Sector', 
	'Locations', 
	'Notify',
	'ngTableParams',
	'$modal', 
	'$log',
	function($scope, $http,  $location, Authentication, Pais, Ciudad, Sector, Locations, Notify, ngTableParams, $modal, $log) {
		this.authentication = Authentication;

	    // Find a list of location
       var params = {
       	  page: 1,            
	      count: 5,
	      filter: {
            name: name
        }
       };

       var settings = {
      // 	groupBy: 'tipo',
       	total: 0,  
       	counts: [5,10,15],        
	    getData: function($defer, params) {
	        Locations.get(params.url(), function(response){     
                params.total(response.total);
                $defer.resolve(response.results);
                $scope.total = response.total;
	        });
	      
	        }
       };

	  $scope.tableParams = new ngTableParams( params, settings);
      //Open the middleware to open a single location modal.
	  this.modelCreate = function (size) {
		    var modalInstance = $modal.open({
		      templateUrl: 'modules/locations/views/create-location.client.view.html',
		      controller: 'modalResutl',
		      size: size
		 });

	 modalInstance.result.then(function (selectedItem) {
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };

	    this.modelUpdate = function (size, selectedClient) {      
          var modalInstance = $modal.open({
          templateUrl: 'modules/locations/views/edit-location.client.view.html',
          controller: function ($scope, $modalInstance, location) {

          	 console.log(selectedClient);
               $scope.location = location;
               $scope.location.rpais = selectedClient.pais;
               $scope.location.rciudad = selectedClient.ciudad;
               $scope.location.rsector = selectedClient.sector;
               console.log($scope.location.rciudad);
          $scope.ok = function () {  
            $modalInstance.close($scope.location);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size,
          resolve: {
            location: function () {
              return selectedClient;
            }
          }
     });

	   modalInstance.result.then(function (selectedItem) {
	      $scope.selected = selectedItem;
	      }, function () {
	        $log.info('Modal dismissed at: ' + new Date());
	      });
	  };

	  this.doSearch = function () {
		    $scope.tableParams.reload();
		};

	 this.modelRemove = function (size, selectedlocation) {
	   	    $scope.location = selectedlocation;
		    var modalInstance = $modal.open({
		      templateUrl: 'modules/locations/views/locations-delete.template.html',
		      controller: 
		      //'modalDelete',
		      function ($scope, $modalInstance, location) {
                 $scope.location = location;

                  $scope.ok = function () {
                   //console.log($scope.location);
                  // $scope.doSearch();
                  $modalInstance.close($scope.location);
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };

		      },
		      size: size,
		      resolve: {
		        location: function () {
		          return selectedlocation;
		        }
		      }
		 });

	 modalInstance.result.then(function (selectedlocation) {
      $scope.selected = selectedlocation;
      //console.log($scope.selected);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };

	  // Remove existing Pai
	$scope.remove = function(location) {
			if( location ) { 
				location.$remove();

				for (var i in this.location) {
					if (this.location [i] === location) {
						this.location.splice(i, 1);
					}
				}
			} else {
				this.location.$remove(function() {
				});
			}
		};
	 }
]);


locationModule.controller('locationDeleteController', ['$scope', 'Authentication', 'location', 'Notify',
	function($scope, Authentication, location, Notify) {
		//$scope.authentication = Authentication;
        
	      this.delete = function(location) {
	       var location = new location({
                _id: $scope.location._id
	       });

	       location.$remove(function(){
	        Notify.sendMsg('newPis', {'id': 'nada'});
	       }, function(errorResponse) {
		  	$scope.error = errorResponse.data.message;
		   });
	   };	
	}
]);

locationModule.controller('locationUpdateController', ['$scope', 'Authentication', 'location', 'Notify', 'Pais', 'Ciudad', 'Sector', '$mdToast', '$animate',
	function($scope, Authentication, location, Notify, Pais, Ciudad, Sector, $mdToast, $animate) {

		 this.pais = Pais.query();
		 this.ciudad = Ciudad.query();
		 this.sector = Sector.query();
		 
		 this.filterByPais = function(){
            this.sector = {};
           
		 };

		 this.filterByCiudad = function(){
		 	this.sector = Sector.query();
		 };
	 
	    this.update = function(updatelocation) {
	   	     console.log("patientUpdate");

	      	var location  = new location ({
	      		_id: updatelocation._id,
				name: updatelocation.name,
				tipo: updatelocation.tipo,
                locationRNC: updatelocation.locationRNC,
                locationTelefono: updatelocation.locationTelefono,
                pais: $scope.location.rpais,
	            ciudad: $scope.location.rciudad,
	            sector: $scope.location.rsector,
	            locationDireccion: updatelocation.locationDireccion
	       });

	     this.showSimpleUdpdate = function() {
			    $mdToast.show(
			      $mdToast.simple()
			        .content('Paso!!')
			        .position('bottom right')
			        .hideDelay(3000)
			    );
		};
	
	   location.$update(function() {
		  	 Notify.sendMsg('newPis', {'id': 'update'});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
	   };
     	
	}
]);

 locationModule.controller('modalResutl',  function ($scope, $modalInstance) {

   $scope.ok = function () {
     $modalInstance.close();
    };


   $scope.cancel = function () {
     $modalInstance.dismiss('cancel');
   };
 });


 locationModule.controller('locationCreateController', 
 	['$scope', 
 	'Locations', 
 	'Notify', 
 	'Pais',
 	'Ciudad',
 	'Sector',
 	function($scope, Locations, Notify, Pais, Ciudad, Sector) {

 	  this.pais = Pais.query();
 		
 	  this.filterByCity = function() {
        this.ciudad = Ciudad.query();
        this.sector = '';
        // this.sector = {};
 	  };

 	  this.filterSector = function(){
 	  	this.sector = Sector.query();
 	  };

 	  	// Create new Pai
 	  this.create = function() {
 			// Create new Pai object
 	   var locations = new Locations ({
 				name: this.name,
                locationRNC: this.locationRNC,
                locationTelefono: this.locationTelefono,
                pais: this.locationPais,
	            ciudad: this.locationCiudad,
	            sector: this.locationSector,
	            locationDireccion: this.locationDireccion
 	   });
			

 			//console.log(locations);
 			// Redirect after save
			locations.$save(function(response) {
              Notify.sendMsg('newPis', {'id': response._id});
             // Notify.sendbroadCast('noError');*/
             // this.location = location.query();
 				// Clear form fields
 			}, function(errorResponse) {
 				$scope.error = errorResponse.data.message;
 			});
 		 };

 	}
 ]);



locationModule.directive('locationList', ['Locations', 'Notify', function(location, Notify){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/locations/views/locations-list.template.html',
     link: function(scope, element, attr){          // when a new location is added update the location List..
          // Notify.getMsg('newlocation', function(event, data){
         // 	scope.rpais = data;
            
         // });

            Notify.getMsg('newPis', function(event, data){            	console.log('got the message');
            scope.locationCtrl.doSearch(); 
         });
    }
   };
 }]);



'use strict';

//Locations service used to communicate Locations REST endpoints
angular.module('locations')
.factory('Locations', ['$resource', function($resource) {
		return $resource('locations/:locationId', { locationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
	
]).factory('Notify', ['$rootScope', function($rootScope) {
	var notify = {};
	notify.msg = '';

	notify.sendbroadCast = function(mgs){
	  this.msg = mgs;
	  this.broadCast(mgs);
	  console.log(this.mgs);
	};

	notify.broadCast = function(msg){
		$rootScope.$broadcast('noError', msg);
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
	// Usar el service '$resource' para devolver un objeto '$resource' Patients
 
}]).factory('LocationAction', ['$http', '$q', function($http, $q){
    var resultActions = {};

    resultActions.getlocationList = function(){
        var defer = $q.defer();
        $http.post('locations/getList').
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

'use strict';

//Setting up route
angular.module('maintains').config(['$stateProvider',
	function($stateProvider) {
		// Maintains state routing
		$stateProvider.
		state('listMaintains', {
			url: '/maintains',
			templateUrl: 'modules/maintains/views/list-maintains.client.view.html'
		}).
		state('createMaintain', {
			url: '/maintains/create',
			templateUrl: 'modules/maintains/views/create-maintain.client.view.html'
		}).
		state('viewMaintain', {
			url: '/maintains/:maintainId',
			templateUrl: 'modules/maintains/views/view-maintain.client.view.html'
		}).
		state('editMaintain', {
			url: '/maintains/:maintainId/edit',
			templateUrl: 'modules/maintains/views/edit-maintain.client.view.html'
		});
	}
]);
'use strict';

// Maintains controller
var maintainModule = angular.module('maintains');

maintainModule.controller('MaintainsController', 
['$scope', 
 '$stateParams', 
 '$location', 
 'Authentication',
 'ngTableParams',
 '$modal', 
  '$log', 
 'Maintains',
 '$mdSidenav',
 'MaintainsR',
 '$mdToast',
  function(
  $scope, 
  $stateParams, 
  $location, 
  Authentication, 
  ngTableParams,
  $modal, 
  $log,
  Maintains,
  $mdSidenav,
  MaintainsR,
  $mdToast){

   /*
        ==================================
			Create By: Ronny Morel
			Creating Date: 10/26/2015
			Description: Inicialate the maintaining page, upload the list table and fill the control.
        ==================================
   */
	   var vm = this;
	   vm.authentication = Authentication;
	   vm.currentPage = 1; 
       vm.pageSize = 5;
	   vm.maintainList = Maintains.get();
	   vm.maintainList2 = MaintainsR.query();

	   vm.clearValue = function() {
	    vm.maintain = '';
	    vm.maintainList2 = MaintainsR.query();
	    vm.codigo = '';
	    vm.name = '';
	    vm.desc = '';
	   };

	   console.log(vm.maintainList2);
	   var params = {
          page: 1,            
          count: 15,
          filter: {             
              name: name
          }
        };

       var settings = {
         total: 0,  
         counts: [15,20,25],        
         getData: function($defer, params) {
         Maintains.get(params.url(), function(response){     
                params.total(response.total);
                $defer.resolve(response.results);
                $scope.total = response.total;
          });
          }
       };
       vm.tableParams = new ngTableParams( params, settings);


          function buildToggler(navID) {
		      return function() {
		        $mdSidenav(navID)
		          .toggle()
		          .then(function () {
		            $log.debug('toggle ' + navID + ' is done');
		          });
		      };
		    }

		    $scope.close = function () {
		      $mdSidenav('right').close()
		        .then(function () {
		          $log.debug("close RIGHT is done");
		        });
		    };
     
     	   $scope.toggleRight = buildToggler('right');
		    $scope.isOpenRight = function(){
		      return $mdSidenav('right').isOpen();
		   };

     
      //PopUp list of the details mantains
      //Ronny Morel - 10-26-2015 
      this.modelUpdate = function (size, selecteditem) {
          
          var modalInstance = $modal.open({
          templateUrl: 'modules/maintains/views/maintain-details.template.html',
          controller: 
          function ($scope, $modalInstance, maintain) {


           $scope.selecteditem = maintain;
     	   $scope.maintaindetails = maintain.parameters;
	     
     	 // console.log(vm.maintaindetails);

          $scope.ok = function () {
                  $modalInstance.close($scope.patient);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size,
          resolve: {
            maintain: function () {
              return selecteditem;
            }
          }
        });
          modalInstance.result.then(function (selectedItem) {
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

	      vm.doSearch = function () {
	        vm.tableParams.reload();
	     }; 

	     $scope.showPatientSave = function() {
	      $mdToast.show(
	        $mdToast.simple()
	          .content('Completado con exito!!')
	          .position('top right')
	          .hideDelay(3000)
	      );
	     };


		// Create new Maintain
		vm.create = function() {
			// Create new Maintain object
			var maintain = new Maintains ({
				name: vm.name,
				code: vm.code,
				desc: vm.desc,
				parents: vm.maintainParent
			});

			// Redirect after save
			maintain.$save(function(response) {
				vm.doSearch();
				$scope.showPatientSave();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);

maintainModule.controller('MaintainsControllerDetails', 
 ['$scope', 'Maintains', '$location', '$mdToast', '$animate',
  function($scope, Maintains, $location, $mdToast, $animate){
  this.sendMaintainDetails = function(){

    $scope.maintain.parameters.push({'value': this.name, 'description': this.description})

  	var details = new Maintains({
  		_id : $scope.maintain._id, 
  		parameters : $scope.maintain.parameters
  	});

  	details.$update(function(data){
         $scope.showSimpleUdpdate();
  	}, function(errorResponse) {
        $scope.error = errorResponse.data.message;
     });

  	 $scope.showSimpleUdpdate = function() {
	    $mdToast.show(
		$mdToast.simple()
	    .content('Accion guardada exitosamente!!')
	    .position('top right')
	    .hideDelay(3000)
		);
   };

  };
  
}]);

maintainModule.directive('mantainList', function(){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/maintains/views/maintain-list.template.html'
    };
});

maintainModule.directive('mantaindetailsList', function(){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/maintains/views/maintain-list.template.html'
    };
});
'use strict';

//Maintains service used to communicate Maintains REST endpoints
angular.module('maintains')
.factory('Maintains', ['$resource',
	function($resource) {
		return $resource('maintains/:maintainId', 
			  {maintainId: '@_id'}, {
			   update: {
				method: 'PUT'
			},
			 'save': {
            method: 'POST',
            isArray: true
		    }
		});
	}
]).factory('MaintainsR', ['$resource',
    function($resource) {
        return $resource('api/getList/:maintainId', 
              {maintainId: '@_id'}, {
               update: {
                method: 'PUT'
            },
             'save': {
            method: 'POST',
            isArray: true
            }
        });
    }
]).factory('MaintainsAction', ['$http', '$q', function($http, $q){
         var resultActions = {};
         resultActions.getMbyCode = function(param){
               var defer = $q.defer();
                $http.post('/api/maintains/getBycode', {mCode: param})
                 .success(function(data){

                 	 resultActions.codeFilter = data;
                     defer.resolve(data);
                     
                }).error(function(error){
					 defer.reject(error);
                });
                return defer.promise;
         };

         return {
              resultActions
         };

}]).service('MaintainsService', ['$http', '$q', function($http, $q){
        var self = {
         'results': [],
         'load' : function(){
               var defer = $q.defer();
                $http.get('/maintains')
                 .success(function(data){
                 console.log(data);
                if(data.length !== 0){
 					angular.forEach(data, function(daraResult){
 					  self.results.push(daraResult);
 					});
                }
                     defer.resolve(data);

                }).error(function(error){
					 defer.reject(error);
                });

                return defer.promise;
           }
         };
         self.load();
         return self;

}]);
// .factory('MaintainsFServices', ['$http', '$q', function($http, $q){
//          var resultActions = {
//          	'results': [],
//          	'param': function(p){
//                resultActions.load(p).then(function(data){
//                	angular.forEach(data, function(daraResult){
//  					  resultActions.results.push(daraResult);
//  					});
//                	 console.log(resultActions.results);
//                });

//                return resultActions.results;
//          	},
//          	'load' : function(param){
//                var defer = $q.defer();
//                 $http.post('/api/maintains/getBycode', {mCode: param})
//                  .success(function(data){
                 		
//                  if(data.length !== 0){
//                  	//console.log('passed');
//  					angular.forEach(data, function(daraResult){
//  					  resultActions.results.push(daraResult);
//  					});
//                 }
//                     defer.resolve(data);
                     
//                 }).error(function(error){
// 					 defer.reject(error);
//                 });
//                 return defer.promise;
//           }
//          };
//          resultActions.param('TipoConsulta');
//         return resultActions;
// }]);
'use strict';

//Setting up route
angular.module('pais').config(['$stateProvider',
	function($stateProvider) {
		// Pais state routing
		$stateProvider.
		state('listPais', {
			url: '/pais',
			templateUrl: 'modules/pais/views/list-pais.client.view.html'
		}).
		state('createPai', {
			url: '/pais/create',
			templateUrl: 'modules/pais/views/create-pai.client.view.html'
		}).
		state('viewPai', {
			url: '/pais/:paiId',
			templateUrl: 'modules/pais/views/view-pai.client.view.html'
		}).
		state('editPai', {
			url: '/pais/:paiId/edit',
			templateUrl: 'modules/pais/views/edit-pai.client.view.html'
		});
	}
]);
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






'use strict';

//Pais service used to communicate Pais REST endpoints
angular.module('pais').factory('Pais', ['$resource',
	function($resource) {
		return $resource('pais/:paiId', { paiId: '@_id'
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
	  this.broadCast();
	  console.log(this.mgs);
	}

	notify.broadCast = function(){
		$rootScope.$broadcast('noError');
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
 
}])



'use strict';

//Setting up route
angular.module('patients').config(['$stateProvider',
	function($stateProvider) {
		// Patients state routing
		$stateProvider.
		state('listPatients', {
			url: '/patients',
			templateUrl: 'modules/patients/views/list-patients.client.view.html'
		}).
		state('viewPatients', {
			url: '/patients/:patientId',
			templateUrl: 'modules/patients/views/patients-dashboard.template.html'
		});
		
}
		
]);
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
function(
$scope, 
$stateParams, 
$location, 
Authentication,
ngTableParams, 
Patients,
$modal, 
 $log) {

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
                $scope.rpatientSexo =  selectedPatient.patientSexo ? selectedPatient.patientSexo : null;
                $scope.rpatientEC = selectedPatient.patientEC ? selectedPatient.patientEC : null;
                $scope.rpatientTipoSangre = selectedPatient.patientTipoSangre ? selectedPatient.patientTipoSangre : null;
                $scope.patient.rpatientSeguro = selectedPatient.patientSeguro ? selectedPatient.patientSeguro._id : null;
                $scope.patient.rtipoRelacion = selectedPatient.patientEContact ? selectedPatient.patientEContact.tipoRelacion : null;            
                $scope.patient.patientEContact = selectedPatient.patientEContact ? selectedPatient.patientEContact : null;                
                $scope.patient.rpatientReligion = selectedPatient.patientReligion ? selectedPatient.patientReligion : null;
                $scope.patient.rpatientIdioma = selectedPatient.patientIdioma ? selectedPatient.patientIdioma : null;
                $scope.patient.rpatientNacionalidad = selectedPatient.patientNacionalidad ? selectedPatient.patientNacionalidad : null;
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

    this.doSearch = function () {
        $scope.tableParams.reload();
    }; 

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
   function($scope, $http,  Authentication, Patients, 
    Pais, Ciudad, Sector,  Notify, $mdToast, $animate, Maintains, MaintainsAction, ClientAction) {

    //Inicializa los parametros del Formulario.
    $scope.init = function(){
        $scope.getCodesTipoSangre();
        $scope.getCodesPatientContact();
        $scope.getCodesPatientReligion();
        $scope.getCodesPatientIdioma();
        $scope.getCodesPatientNacionalidad(); 
        $scope.getSeguro();
    };
        this.patientPhones = {};
        this.PatientCI = {};
        this.patientEContact= {};
        

    
     // GetMaintnains.getM.CallMbyCode('Tipo Sangre', function(data){
     //    console.log(data);
     // });

   $scope.getSeguro = function(){
     ClientAction.resultActions.getSegurosList()
    .then(function(res){
       $scope.patientSeguro = res;
       console.log($scope.patientSeguro);
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
    $scope.getCodesPatientContact = function(){
     MaintainsAction.resultActions.getMbyCode('Relacion Paciente')
    .then(function(res){
       $scope.patientContactPerson = res[0].parameters;
    }, function(err){
    });
    };

      //Obtiene los parametros para el contacto de paciente
    $scope.getCodesPatientReligion = function(){
     MaintainsAction.resultActions.getMbyCode('Religion')
    .then(function(res){
       $scope.patientReligion = res[0].parameters;
    }, function(err){
    });
    };

      //Obtiene los parametros para el contacto de paciente
    $scope.getCodesPatientIdioma = function(){
     MaintainsAction.resultActions.getMbyCode('Idioma')
    .then(function(res){
       $scope.patientIdioma = res[0].parameters;
    }, function(err){
    });
    };

  //Obtiene los parametros para el contacto de paciente
    $scope.getCodesPatientNacionalidad = function(){
     MaintainsAction.resultActions.getMbyCode('Nacionalidad')
    .then(function(res){
       $scope.patientNacionalidad = res[0].parameters;
    }, function(err){
    });
    };
    
    this.paisD = Pais.query();
    this.ciudad = Ciudad.query();
    this.sector = Sector.query();

    this.filterByCity = function() {
        if(this.pais == null){
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

    this.showPatientSave = function() {
      $mdToast.show(
        $mdToast.simple()
          .content('Nuevo Paciente Guardado!!')
          .position('bottom right')
          .hideDelay(3000)
      );
    };

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

      $scope.showPatientSave = function() {
      $mdToast.show(
        $mdToast.simple()
          .content('Nuevo Paciente Guardado!!')
          .position('top right')
          .hideDelay(3000)
      );
     };

      console.log(patient);
      //
      // Usar el método '$save' de Patient para enviar una petición POST apropiada
      patient.$save(function(response){ 
        Notify.sendMsg('newPis', {'id': 'nada'});
        $scope.showPatientSave();
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
   'ClientAction',
   function($scope, $http,  Authentication, Patients, 
    Pais, Ciudad, Sector,  Notify, $mdToast, $animate, Maintains, MaintainsAction, ClientAction) {

    //Inicializa los parametros del Formulario.
    $scope.init = function(){
        $scope.getCodesTipoSangre();
        $scope.getCodesPatientContact();
        $scope.getCodesPatientReligion();
        $scope.getCodesPatientIdioma();
        $scope.getCodesPatientNacionalidad(); 
        $scope.getSeguro();
    };
        this.patientPhones = {};
        this.PatientCI = {};
        this.patientEContact= {};
        this.authentication = Authentication;
        

    
     // GetMaintnains.getM.CallMbyCode('Tipo Sangre', function(data){
     //    console.log(data);
     // });

   $scope.getSeguro = function(){
     ClientAction.resultActions.getSegurosList()
    .then(function(res){
       $scope.patientSeguro = res;
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
    $scope.getCodesPatientContact = function(){
     MaintainsAction.resultActions.getMbyCode('Relacion Paciente')
    .then(function(res){
       $scope.patientContactPerson = res[0].parameters;
    }, function(err){
    });
    };

      //Obtiene los parametros para el contacto de paciente
    $scope.getCodesPatientReligion = function(){
     MaintainsAction.resultActions.getMbyCode('Religion')
    .then(function(res){
       $scope.patientReligion = res[0].parameters;
    }, function(err){
    });
    };

   

      //Obtiene los parametros para el contacto de paciente
    $scope.getCodesPatientIdioma = function(){
     MaintainsAction.resultActions.getMbyCode('Idioma')
    .then(function(res){
       $scope.patientIdioma = res[0].parameters;
    }, function(err){
    });
    };

  //Obtiene los parametros para el contacto de paciente
    $scope.getCodesPatientNacionalidad = function(){
     MaintainsAction.resultActions.getMbyCode('Nacionalidad')
    .then(function(res){
       $scope.patientNacionalidad = res[0].parameters;
    }, function(err){
    });
    };
    
    this.paisD = Pais.query();
    this.ciudad = Ciudad.query();
    this.sector = Sector.query();
    console.log(this.sector);

    this.filterByCity = function() {
        if(this.pais == null){
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
      tipo: $scope.patient.rPatientCI.tipo, 
      value: $scope.patient.rPatientCI.value 
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
      patientSexo: $scope.rpatientSexo,
      patientEC :  $scope.rpatientEC,
      patientSeguro : $scope.patient.rpatientSeguro,
      patientTipoSangre: $scope.rpatientTipoSangre,
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

      $scope.showPatientSave = function() {
      $mdToast.show(
        $mdToast.simple()
          .content('Información actualizada correctamente!!')
          .position('top right')
          .hideDelay(3000)
      );
     };
     console.log($scope.rpais);
      console.log(patient);
      //
      // Usar el método '$save' de Patient para enviar una petición POST apropiada
      patient.$update(function(response){ 
        Notify.sendMsg('newPis', {'id': 'nada'});
        $scope.showPatientSave();
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
            Notify.getMsg('newPis', function(event, data){
                scope.pacientsCtrl.doSearch(); 
         });
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
    scope: { patient: '=' },
    templateUrl: 'modules/documents/template/oftarmologiaform.html',
     link: function(scope, element, attr){
     //scope.patient = $scope.         
      // when a new procedimiento is added update the cliente List..
            Notify.getMsg('newPis', function(event, data){
                scope.pacientsCtrl.doSearch(); 
         });
    }
   };
 }]);


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
'use strict';

//Setting up route
angular.module('sectors').config(['$stateProvider',
	function($stateProvider) {
		// Sectors state routing
		$stateProvider.
		state('listSectors', {
			url: '/sectors',
			templateUrl: 'modules/sectors/views/list-sectors.client.view.html'
		}).
		state('createSector', {
			url: '/sectors/create',
			templateUrl: 'modules/sectors/views/create-sector.client.view.html'
		}).
		state('viewSector', {
			url: '/sectors/:sectorId',
			templateUrl: 'modules/sectors/views/view-sector.client.view.html'
		}).
		state('editSector', {
			url: '/sectors/:sectorId/edit',
			templateUrl: 'modules/sectors/views/edit-sector.client.view.html'
		});
	}
]);
'use strict';

var sectorModule = angular.module('sectors');

// ciudad controller
sectorModule.controller('sectorController', [
	'$scope', 
	'$http',  
	'$location', 
	'Authentication', 
	'Sector',
	'Ciudad', 
	'Notify',
	'$modal', 
	'$log',
	function($scope, $http,  $location, Authentication, Sector,Ciudad, Notify, $modal, $log) {
		this.authentication = Authentication;

	    // Find a list of ciudad
	   this.sector = Sector.query();
	   this.ciudad = Ciudad.query();
	  // this.pais = Pais.query();

  //Open the middleware to open a single ciudad modal.
	 this.modelCreate = function (size) {
		    var modalInstance = $modal.open({
		      templateUrl: 'modules/sectors/views/create-sector.client.view.html',
		      controller: 'modalResutl',

		    //    function ($scope, $modalInstance) {
                
      //            $scope.ok = function (result) {
      //            	console.log($scope.refered);
      //            	if(this.refered){
      //            		$modalInstance.close();
      //            	}
				  // };

				  // $scope.cancel = function () {
				  //   $modalInstance.dismiss('cancel');
				  // };

		    //   },
		      size: size
		 });

	 modalInstance.result.then(function (selectedItem) {
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };


     //Open the middleware to open a single ciudad modal.
	 this.modelUpdate = function (size, selectedsector) {

            //console.log(selectedsector);
		    var modalInstance = $modal.open({
		      templateUrl: 'modules/sectors/views/edit-sector.client.view.html',
		      controller: function ($scope, $modalInstance, sector) {
                 $scope.sector = sector;
                 $scope.sector.rciudad = selectedsector.ciudad;
                   
                 $scope.ok = function () { 	
                  $modalInstance.close($scope.sector);
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };

		      },
		      size: size,
		      resolve: {
		        sector: function () {
		          return selectedsector;
		        }
		      }
		 });

	 modalInstance.result.then(function (selectedsector) {
      $scope.selected = selectedsector;
      //console.log($scope.selected);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };

	  // Remove existing Pai
	this.remove = function(sector) {
			if( sector ) { 
				sector.$remove();

				for (var i in this.sector) {
					if (this.sector [i] === sector) {
						this.sector.splice(i, 1);
					}
				}
			} else {
				this.sector.$remove(function() {
				});
			}
		};

		
	
	 }
]);


sectorModule.controller('modalResutl',  function ($scope, $modalInstance) {

 $scope.$on('noError', function(){
  	
 });

  $scope.ok = function () {	
    $modalInstance.close();
   };


  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


sectorModule.controller('sectorCreateController', ['$scope',  'Ciudad', 'Notify', 'Sector',
	function($scope, Ciudad, Notify, Sector) {

	  this.ciudad = Ciudad.query();
	  	// // Create new Pai
	  this.create = function() {
			// Create new Pai object
	   var sector = new Sector ({
				name: this.name,
				ciudad: this.Selectedciudad
	   });
			
			// Redirect after save
	   sector.$save(function(response) {
             Notify.sendMsg('newPis', {'id': response._id});
            // Notify.sendbroadCast('noError');
            // this.ciudad = Ciudad.query();
				// Clear form fields
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);

sectorModule.controller('sectorUpdateController', ['$scope',  'Ciudad', 'Sector', 'Notify',
	function($scope, Ciudad, Sector, Notify) {
		//$scope.authentication = Authentication;

          this.ciudad = Ciudad.query();
          
	      this.update = function(updateSector) {

	      	var sector  = new Sector ({
	      		_id: updateSector._id,
				name: updateSector.name,
				ciudad: $scope.sector.rciudad
	       });
		
		  sector.$update(function() {
		  	 Notify.sendMsg('newPis', {'id': 'update'});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
	   };
     	
	}
]);


sectorModule.directive('sectorList', ['Sector', 'Notify', function(Sector, Notify){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/sectors/views/sector-list.template.html',
    link: function(scope, element, attr){
         // when a new ciudad is added update the ciudad List..
         // Notify.getMsg('newCiudad', function(event, data){
         // 	scope.rpais = data;
            
         // });
           Notify.getMsg('newPis', function(event, data){
           	console.log('got the message');
            scope.sectorCtrl.sector = Sector.query();
         });
    }
  };
}]);



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



'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		// state('password', {
		// 	url: '/settings/password',
		// 	templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		// }).
		// state('accounts', {
		// 	url: '/settings/accounts',
		// 	templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		// }).
		// state('signup', {
		// 	url: '/signup',
		// 	templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		// }).
		state('signin', {
			url: '/singin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		});
		// state('forgot', {
		// 	url: '/password/forgot',
		// 	templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		// }).
		// state('reset-invalid', {
		// 	url: '/password/reset/invalid',
		// 	templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		// }).
		// state('reset-success', {
		// 	url: '/password/reset/success',
		// 	templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		// }).
		// state('reset', {
		// 	url: '/password/reset/:token',
		// 	templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		// });
	}
]);
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
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
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
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user,
			emrId: window.emrId
		};

		return _this._data;
	}
]);
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

