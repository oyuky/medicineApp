// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var db=null;
var error=null;
angular.module('starter', ['ngCordova','ionic','starter.controllers'])
.run(function($cordovaSQLite, $ionicPlatform) {
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
      if(window.cordova) {
        // App syntax
        db = $cordovaSQLite.openDB({name: 'medicineApp.db', location: 'default'});
      } else {
        // Ionic serve syntax
        db = window.openDatabase("medicineApp.db", "1.0", "MedicineApp", -1);
      }
      var query = "CREATE TABLE IF NOT EXISTS Medicamento " +
        "(id INTEGER PRIMARY KEY, " +
        "medicamento_nombre TEXT, " +
        "cantidad NUMBER, " +
        "unidad_medida TEXT, " +
        "numero_dias NUMBER, " +
        "repetir_horas NUMBER, " +
        "observaciones TEXT)";
      $cordovaSQLite.execute(db, query);
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
      controller: 'AppCtrl'
    })

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
    .state('app.medicinelist', {
      url: '/medicinelist',
      views: {
        'menuContent': {
          templateUrl: 'templates/medicinelist.html',
          controller: 'AppCtrl'
        }
      }
    })
    .state('app.medicineadd', {
      url: '/medicineadd',
      views: {
        'menuContent': {
          templateUrl: 'templates/medicineadd.html',
          controller: 'AppCtrl'
        }
      }
    })
    /*.state('app.single', {
      url: '/medicinelist/:medicinelistId',
      views: {
        'menuContent': {
          templateUrl: 'templates/medicinelist.html',
          controller: 'MedicineCtrl'
        }
      }
    });*/
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/medicinelist');
});
