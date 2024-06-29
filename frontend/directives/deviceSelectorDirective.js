export default function DeviceSelectorDirective() {
  return {
    restrict: "E",
    scope: {
      model: "=",
      filteredPhoneNumbers: "="
    },
    template: `
      <select class="form-select" ng-model="model" ng-change="getData()">
        <option value="">All Devices</option>
        <option ng-repeat="device in devices" value="{{ device.id }}">
          {{ device.name }}
        </option>
      </select>
    `,
    controller: function($scope, $http, API_BASE_URL) {
      $scope.fetchAllPhoneNumbers = () => {
        $http.get(`${API_BASE_URL}/phoneNumbers/getAll`).then(
          (res) => {
            $scope.phoneNumbers = res.data;
            $scope.filteredPhoneNumbers = res.data;
          },
          (err) => {
            console.error("Error fetching phone numbers:", err);
          }
        );
      };

      $scope.fetchAllDevices = () => {
        $http.get(`${API_BASE_URL}/devices/getAll`).then(
          (res) => {
            $scope.devices = res.data;
          },
          (err) => {
            console.error("Error fetching devices:", err);
          }
        );
      };

      $scope.getData = function() {
        const selectedDeviceId = $scope.model;
        if (selectedDeviceId) {
          $scope.filteredPhoneNumbers = $scope.phoneNumbers.filter(
            (phoneNumber) => phoneNumber.deviceId == selectedDeviceId
          );
        } else {
          $scope.filteredPhoneNumbers = $scope.phoneNumbers;
        }
      };

      $scope.$watch('model', function(newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getData();
        }
      });

      $scope.fetchAllPhoneNumbers();
      $scope.fetchAllDevices();
    }
  };
}
