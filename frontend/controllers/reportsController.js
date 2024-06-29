export default function reportsController($scope, $http, API_BASE_URL) {
  $scope.fetchAllClientTypesReport = () => {
    $http.get(`${API_BASE_URL}/reports/getAllClientTypes`).then(
      (res) => {
        $scope.clientTypesReport = res.data;
        console.log($scope.clientTypesReport);
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
        console.log("Device Stats Report:", res.data);
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
