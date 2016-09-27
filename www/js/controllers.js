var error=null;
angular.module('starter.controllers', ['ionic', 'ngCordova'])
  .controller('AppCtrl', function($scope, $ionicModal,$ionicPlatform, $timeout, $cordovaSQLite) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    //$scope.messageinfo += db;
    // Agregar medicina
    $scope.formData = {};
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
    $scope.deleteDB = function () {
      try {
        $cordovaSQLite.execute(db, "DROP TABLE Medicamento");
        $cordovaSQLite.deleteDB("medicineApp.db");
        $scope.messageinfo = db + " - ";
      } catch (error) {
        $scope.messageinfo = error + " - ";
      }
    };

/*
    $scope.crearDB = function () {
      try {
       //db = $cordovaSQLite.openDB({name: "medicineApp.db", location: 'default'});
        var query = "CREATE TABLE IF NOT EXISTS Medicamento " +
          "(id INTEGER PRIMARY KEY, " +
          "medicamento_nombre TEXT, " +
          "cantidad NUMBER, " +
          "unidad_medida TEXT, " +
          "numero_dias NUMBER, " +
          "repetir_horas NUMBER, " +
          "observaciones TEXT)";

        $cordovaSQLite.execute(db, query);
        $scope.messageinfo = db + " - ";
      } catch (error) {
        $scope.messageinfo = error + " - ";

      }
    };
    */

    $scope.guardar = function (formData) {
      var query = "INSERT INTO Medicamento (medicamento_nombre, cantidad, unidad_medida, numero_dias, repetir_horas, observaciones ) VALUES (?,?,?,?,?,?)";
      try {
        $cordovaSQLite.execute(db, query, [
          formData.txtMedicamentoNombre, formData.txtCantidad, formData.ddlUnidadMedida,
          formData.txtDias, formData.txtRepetirHoras, formData.txtObservaciones
        ]).then(function (res) {
          console.log("INSERT ID -> " + res.insertId);
          $scope.getMedicineList();
          $scope.statusMessage = "ID guardado: " + res.insertId;
        }, function (error) {
          $scope.statusMessage = "Error al guardar: " + error.message;
        })
      } catch (err) {
        $scope.log += err + " - ";
      }
    };

    $ionicPlatform.ready(function() {
      $scope.getMedicineList();
    });

   $scope.getMedicineList= function(){
      try {
        $scope.medicinelist = [];
        var query = "SELECT id, medicamento_nombre FROM Medicamento ";
        $cordovaSQLite.execute(db, query,[]).then(function (res) {
          var countRes = res.rows.length;
          if (countRes > 0) {
            for (var i = 0 ; i < countRes; i++) {
              $scope.medicinelist.push(res.rows.item(i));
            }

          }
          else {
            $scope.messageinfo = "No hay alertas programadas. ";
          }
        }, function (err) {
          $scope.messageinfo += "Error -> "+err;
        });
      }
      catch (error) {
        $scope.messageinfo += "error 2 ->" + error + " - ";
      }
    };



    $scope.holamundo = function () {
      $scope.messageinfo += "--hola mundo";
    };

    //$scope.holamundo();
  });
