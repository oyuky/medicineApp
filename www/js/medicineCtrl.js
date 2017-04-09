/**
 * Created by Oyuky on 28/09/2016.
 */
var error='';
var medicinesListModule =  angular.module('MedicineApp',['ngCordova']);

medicinesListModule.controller('MedicineCtrl',['$scope','$cordovaSQLite', '$ionicPlatform', 'MedicineFactory','$cordovaCalendar',
    function MedicineCtrl($scope, $cordovaSQLite, $ionicPlatform, MedicineFactory,$cordovaCalendar) {

      initData();
      initMethods();

      $scope.checkItem = function (id) {
        var checked = false;
        for(var i=0; i<= medicinelist.length; i++) {
          if(id == medicinelist[i]) {
            checked = true;
          }
        }
        return checked;
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

      function initData() {
        try {
          $scope.statusMessage = error;
          $scope.formData = {
            txtMedicamentoNombre: '',
            txtCantidad: 0,
            ddlUnidadMedida: '',
            txtDias: 0,
            txtRepetirHoras: 0,
            txtObservaciones: ''
          };
          $scope.loadingMedicines = false;
          MedicineFactory.initDB();
        } catch (err) {
          console.log("error al cargar---- ->" + err + " - ");
        }
      }

      function initMethods() {
        loadMedicineList();
        $scope.addNewMedicine = addNewMedicine;
        $scope.deleteMedicine = deleteMedicine;

        $scope.createEvents =createEvents;

        $scope.callClick = function() {
          alert("i was clicked");
        };
      }

      function createEvents(index, id, encendido) {
        if (encendido==0) {
          console.log("encender..."+encendido);
          MedicineFactory.createEvents(id);
          MedicineFactory.updateMedicine(id, 1);
          loadMedicineList();
          alert("encender eventos");
          event.stopImmediatePropagation();
        }
        else
        {

          console.log("apagar..."+encendido);
          MedicineFactory.deleteEvents(id);
          MedicineFactory.updateMedicine(id, 0);
          loadMedicineList();
          alert("apagar eventos");
        }
      }

      function loadMedicineList() {
        try {
          $scope.loadingMedicines = true;
          $scope.medicinelist = [];
          MedicineFactory.getAllMedicines().then(function (res) {
            var countRes = res.rows.length;
            if (countRes > 0) {
              for (var i = 0; i < countRes; i++) {
                $scope.medicinelist.push({id:res.rows.item(i).id,medicamento_nombre:res.rows.item(i).medicamento_nombre, encendido:res.rows.item(i).encendido});
                console.log("encendido ---- ->" + res.rows.item(i).encendido + " - ");
                //$scope.medicinelist.push(res.rows.item(i));
              }
            }
            else {
              $scope.messageinfo = "No hay alertas programadas. ";
            }
          }, function (err) {
            $scope.messageinfo += "Error -> " + err;
          });
        } catch (error) {
          $scope.messageinfo += "error 2 ->" + error + " - ";
        }
      }

      function addNewMedicine() {
        error = '';
        console.log("save ---- ->" + $scope.formData.txtMedicamentoNombre + " - ");
        validateFields();
        console.log("error ---- ->" + error + " - ");
        if (error == '') {
          MedicineFactory.addNewMedicine($scope.formData)
            .then(function (response) {
              $scope.formData.txtMedicamentoNombre = '';
              alert("New Tracker has been added.");
              loadMedicineList();
            }, function (error) {
              alert("Error in adding new trakcer");
            });
        } else {
          alert(error);
        }
      }

      function deleteMedicine(index, id) {
        if (index > -1) {
          MedicineFactory.deleteMedicine(id)
            .then(function (response) {
              $scope.medicinelist.splice(index, 1);
              alert("Tracker has been succesfully deleted.");
            }, function (error) {
              alert("Error in adding new trakcer");
            });
        }
      }

      function validateFields() {
        console.log($scope.formData.txtMedicamentoNombre);
        if ($scope.formData.txtMedicamentoNombre == '' && $scope.formData.txtMedicamentoNombre.length == 0) {
          error += 'Nombre de medicamento, ';
        }
        console.log($scope.formData.txtCantidad);
        if ($scope.formData.txtCantidad == 0) {
          error += 'Dosis, ';
        }
        console.log($scope.formData.ddlUnidadMedida);
        if ($scope.formData.ddlUnidadMedida == '' && $scope.formData.ddlUnidadMedida.length == 0) {
          error += 'Unidad de medida, ';
        }
        if (error != '') {
          console.log(error);
          error = 'Campos requeridos: ' + error;
          error = error.substr(0, error.length - 2);
          console.log(error);
        }
      }
    }]);
