export default function ClientTypeSelectorDirective() {
  return {
    restrict: "E",
    scope: {
      model: "=",
      filteredClients: "=",
      clients: "=",
    },
    template: `
      <select class="form-select" ng-model="model" ng-change="getData()">
        <option value="" ng-selected="true">All Types</option>
        <option value="1">Individual</option>
        <option value="2">Organization</option>
      </select>
    `,
    controller: function($scope, $http, API_BASE_URL) {
      // Function to fetch all clients
      $scope.fetchAllClients = () => {
        $http.get(`${API_BASE_URL}/clients/getAll`).then(
          (res) => {
            $scope.clients = res.data.map((client) => {
              if (client.birthDate) {
                client.birthDate = new Date(client.birthDate);
              }
              return client;
            });

            $scope.filteredClients = $scope.clients;
          },
          (err) => {
            console.error("Error fetching clients:", err);
          }
        );
      };

      // Function to filter clients based on the selected type
      $scope.getData = function() {
        const selectedTypeId = $scope.model;
        if (selectedTypeId) {
          $scope.filteredClients = $scope.clients.filter(
            (client) => client.type == selectedTypeId
          );
        } else {
          $scope.filteredClients = $scope.clients;
        }
      };

      // Watch for changes in the selected type
      $scope.$watch('model', function(newVal, oldVal) {
        if (newVal !== oldVal) {
          $scope.getData();
        }
      });

      // Fetch all clients initially
      $scope.fetchAllClients();
    }
  };
}
