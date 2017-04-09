// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var db=null;
var error=null;
angular.module('starter', ['ionic','ConfigurationApp','MedicineApp','ngCordova'])
.run(function($ionicPlatform, $cordovaSQLite, $cordovaCalendar) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    try {
      //, iosDatabaseLocation: 'Library'

      if (window.cordova) {
        // App syntax
        db = $cordovaSQLite.openDB({name: 'medicineApp.db', location: 'default'});
      } else {
        // Ionic serve syntax
        db = window.openDatabase("medicineApp.db", "1.0", "MedicineApp", -1);
      }
      //$cordovaSQLite.execute(db, 'DROP TABLE IF EXISTS Medicamento');
      var query = "CREATE TABLE IF NOT EXISTS Medicamento " +
        "(id INTEGER PRIMARY KEY, " +
        "medicamento_nombre TEXT, " +
        "cantidad NUMBER, " +
        "unidad_medida TEXT, " +
        "numero_dias NUMBER, " +
        "repetir_horas NUMBER, " +
        "encendido NUMBER, "+
        "observaciones TEXT)";
      $cordovaSQLite.execute(db, query);
      console.log('se crea db');

      /*
      $cordovaCalendar.deleteCalendar('Medicamentos').then(function (result) {
        console.log("yey");
        // success
      }, function (err) {
        console.log("no yey");
        // error
      });

      $cordovaCalendar.createCalendar({
        calendarName: 'Medicamentos',
        calendarColor: '#FF0000'
      }).then(function (result) {
        console.log("yey");
        // success
      }, function (err) {
        console.log("no yey");
        // error
      });

*/
    }
    catch (err) {
      error = err;
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'MedicineCtrl'
    })
    .state('app.configuration', {
      url: '/configuration',
      views: {
        'menuContent': {
          templateUrl: 'templates/configuration.html',
          controller: 'ConfigurationCtrl'
        }
      }
    })
    .state('app.medicinelist', {
      url: '/medicinelist',
      views: {
        'menuContent': {
          templateUrl: 'templates/medicinelist.html',
          controller: 'MedicineCtrl'
        }
      }
    })
    .state('app.medicineadd', {
      url: '/medicineadd',
      views: {
        'menuContent': {
          templateUrl: 'templates/medicineadd.html',
          controller: 'MedicineCtrl'
        }
      }
    });
  /*
   .state('app.search', {
   url: '/search',
   views: {
   'menuContent': {
   templateUrl: 'templates/search.html'
   }
   }
   })

   .state('app.browse', {
   url: '/browse',
   views: {
   'menuContent': {
   templateUrl: 'templates/browse.html'
   }
   }
   })
   .state('medicinelist', {
   url: '/',
   templateUrl: 'templates/medicinelist.html',
   controller: 'MedicineCtrl'
   })
   .state('medicineadd', {
   url: '/medicineadd',
   templateUrl: 'templates/medicineadd.html',
   controller: 'MedicineCtrl'
   })
   */
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/medicinelist');
});
