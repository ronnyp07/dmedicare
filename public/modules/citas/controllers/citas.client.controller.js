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
   'MaintainDetailsService',
   'MaintainList',
   'HeaderDetailsList',
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
   Notify,
   MaintainDetailsService,
   MaintainList,
   HeaderDetailsList) {
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
      $scope.calendarView = 'day';
      $scope.dayViewStart = '06:00';
      $scope.calendarDay =  new Date();
      $scope.tester = 'Is the Controller connecting';
      vm.dayViewStart = '06:00';
      vm.dayViewEnd = '22:00';


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

   // $scope.getTipoConsulta = function(){
   //   MaintainsAction.resultActions.getMbyCode('TipoConsulta')
   //  .then(function(res){
   //     $scope.tipoConsulta = res[0].parameters;
   //  }, function(err){
   //  });
   //  };
   $scope.getTipoConsulta = function(){
     MaintainDetailsService.getHeaderMaster(MaintainList.Tipo_Consulta)
    .then(function(res){
       $scope.tipoConsulta = res;
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
          console.log(data);
          for(var i = 0; i < data.length; i++){
          var doctorId = data[i].appDoctor;
          $scope.events.push({
          title: data[i].appPatient ? data[i].appPatient.patientFirstName + ' ' + data[i].appPatient.patientLastName : '' ,
          type: data[i].appTypeStatus ? data[i].appTypeStatus : 'warning',
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
          patientName : data[i].appPatient ? data[i].appPatient.patientFirstName + ' ' + data[i].appPatient.patientLastName : '' 
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
           $scope.startAt = selectedDate;
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
           $scope.uplocation =  selectedDate.appLocation ? selectedDate.appLocation._id: '';
           $scope.upreason = selectedDate.reason;
           $scope.uppatient = selectedDate.patient._id;
           $scope.upappId = selectedDate.id;
           $scope.upstatus = selectedDate.status;
           $scope.patientFullName = selectedDate.patientName;
          
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

     modalInstance.result.then(function (selectedItem){
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

        select: function(start, end, allDay, jsEvent) {
          var date = {
              start: start,
              end: end
          };
          console.log(new Date(start).getTime() / 1000);
         $scope.modelDetail('lg', date);
       },
        dayClick: $scope.alertEventOnClick,
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
          appLoc : this.location,
          appDoctor: this.doctor,
          appstartDate: new Date($scope.startAt),
          appsendDate: new Date($scope.endsAt),
          appPatient: this.patient,
          appTypeStatus: 'warning',
          appType: this.appType,
          appReason: this.reason,
          status: HeaderDetailsList.Por_Venir_id,
          canceled: false,
          patientCheckIn: false  
       });

      citas.$save(function(response) {
         Notify.sendMsg('newPis', {'id': response._id});
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
   'MaintainDetailsService',
   'MaintainList',
   'HeaderDetailsList', 
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
    MaintainsService,
    MaintainDetailsService,
    MaintainList,
    HeaderDetailsList){

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
     MaintainDetailsService.getHeaderMaster(MaintainList.Tipo_Consulta)
    .then(function(res){
       $scope.tipoConsulta = res;
    }, function(err){
    });
    };
  
    $scope.getEstadoConsulta = function(){
     MaintainDetailsService.getHeaderMaster(MaintainList.Estado_Consulta)
    .then(function(res){
       $scope.estadoConsulta = res;
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
          title: data[i].appPatient ? data[i].appPatient.patientFirstName + ' ' + data[i].appPatient.patientLastName : '' ,
          type: data[i].appTypeStatus ? data[i].appTypeStatus : 'warning',
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
    var  appStatus;
    if($scope.upstatus === HeaderDetailsList.Por_Venir_id){
        appStatus = 'warning';
    }else if($scope.upstatus === HeaderDetailsList.En_Espera_id){
        appStatus = 'info';
    }else if($scope.upstatus === HeaderDetailsList.Completado_id){
        appStatus = 'success';
    }else if($scope.upstatus === HeaderDetailsList.Cancelado_id){
        appStatus = 'inverse';
    }else if($scope.upstatus === HeaderDetailsList.Pospuesto_id){
        appStatus = 'special';
    }


       var cita  = new Citas({
          _id: $scope.upappId, 
          appLoc :   $scope.uplocation,
          appDoctor: $scope.updoctorId,
          appstartDate:  $scope.upstartAt,
          appsendDate:    $scope.upendsAt,
          appPatient:   $scope.uppatient ,
          appTypeStatus: appStatus,
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