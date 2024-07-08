export default function reportsController($scope, $http, API_BASE_URL) {
  $scope.isLoading = true;
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  $scope.fetchAllClientTypesReport = () => {
    $http.get(`${API_BASE_URL}/reports/getAllClientTypes`).then(
      (res) => {
        $scope.clientTypesReport = res.data;
        delay(100).then(() => {
          $scope.isLoading = false;
          $scope.$apply();
        });
      },
      (err) => {
        console.error("Error fetching devices:", err);

        if (err.data) {
          console.error("Error data:", err.data);
        }
        if (err.status) {
          console.error("Error status:", err.status);
        }
        if (err.statusText) {
          console.error("Error status text:", err.statusText);
        }
      }
    );
  };

  $scope.fetchDeviceStatsReport = () => {
    $http.get(`${API_BASE_URL}/reports/getDeviceStatsReport`).then(
      (res) => {
        $scope.deviceStatsReport = res.data;
        delay(100).then(() => {
          $scope.isLoading = false;
          $scope.$apply();
        });
      },
      (err) => {
        console.error("Error fetching device stats report:", err);
      }
    );
  };
  $scope.filterDevicesByStatus = function (deviceStat) {
    // Implement filter logic based on selected filters
    if (
      $scope.selectedDevice &&
      deviceStat.deviceId !== $scope.selectedDevice
    ) {
      return false;
    }
    if (
      $scope.selectedStatus &&
      $scope.selectedStatus === "Reserved" &&
      deviceStat.numberOfReservedPhoneNumbers === 0
    ) {
      return false;
    }
    if (
      $scope.selectedStatus &&
      $scope.selectedStatus === "Unreserved" &&
      deviceStat.numberOfUnReservedPhoneNumbers === 0
    ) {
      return false;
    }
    return true;
  };
}
