export default function devicesController(
  $scope,
  $http,
  API_BASE_URL,
  snackbarService
) {
  $scope.isLoading = true;
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  $scope.fetchAllDevices = () => {
    $http.get(`${API_BASE_URL}/devices/getAll`).then(
      (res) => {
        $scope.devices = res.data.map(device => ({ ...device, showDrillDown: false }));
        delay(200).then(() => {
          $scope.isLoading = false;
          $scope.$apply(); 
        });
      },
      (err) => {
        console.error("Error fetching devices:", err);
        $scope.isLoading = false;
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

  $scope.toggleDrillDown = (device) => {
    device.showDrillDown = !device.showDrillDown;
  };


  $scope.handleSearchResults = () => {
    const searchText = $scope?.searchInput?.toLowerCase()?.toString() || "";
    $http
      .get(
        `${API_BASE_URL}/devices/getFilteredDevices/?searchfilter=${searchText}`
      )
      .then(
        (res) => {
          $scope.devices = res.data;
        },
        (err) => {
          console.error("Error filtering devices:", err);

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

  $scope.handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      $scope.handleSearchResults();
    }
  };

  $scope.handleAddNewDevice = () => {
    const newName = $scope.newName.trim();
    if (newName) {
      const newDevice = { name: newName, isAssigned: 0 };
      $http.post(`${API_BASE_URL}/devices/addDevice`, newDevice).then(
        (res) => {
          $scope.devices.push(res.data);
          const addModalElement = document.getElementById("addModal");
          const addModal = bootstrap.Modal.getInstance(addModalElement);
          addModal.hide();
          snackbarService.showNotification(
            `New Device "${res.data.name}" has been added successfully.`,
            "bg-success"
          );
          $scope.errorMessage = "";
        },
        (err) => {
          console.error("Error adding device:", err);
          if (err?.data?.message) {
            $scope.errorMessage = err.data.message;
          }
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
    }
    $scope.newName = "";
  };

  $scope.handleEditDevice = () => {
    const editedName = $scope.editName.trim();
    if (editedName && $scope.currentDevice) {
      const updatedDevice = { Id: $scope.currentDevice.id, Name: editedName };

      $http.put(`${API_BASE_URL}/devices/updateDevice`, updatedDevice).then(
        (res) => {
          const index = $scope.devices.findIndex((d) => d.id === res.data.id);
          $scope.devices[index] = res.data;
          const editModalElement = document.getElementById("editModal");
          const editModal = bootstrap.Modal.getInstance(editModalElement);
          snackbarService.showNotification(
            `${res.data.name}'s name has been updated successfully.`,
            "bg-warning"
          );
          editModal.hide();
          $scope.errorMessage = "";
        },
        (err) => {
          console.error("Error updating device:", err);
          if (err?.data?.message) {
            $scope.errorMessage = err.data.message;
          }
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
    }
    $scope.editName = "";
  };

  $scope.editDevice = (device) => {
    $scope.currentDevice = device;
    $scope.editName = device.name;
    $scope.errorMessage = "";
  };

  $scope.deviceIdToDelete = null;

  $scope.showDeleteConfirmation = function (deviceId) {
    $scope.deviceIdToDelete = deviceId;
    var deleteModal = new bootstrap.Modal(
      document.getElementById("confirmDeleteModal")
    );
    deleteModal.show();
  };

  $scope.confirmDelete = function () {
    if ($scope.deviceIdToDelete !== null) {
      $scope.handleDeleteDevice($scope.deviceIdToDelete);
      $scope.deviceIdToDelete = null;
    }
  };

  $scope.handleDeleteDevice = (deviceId) => {
    $http.delete(`${API_BASE_URL}/devices/deleteDevice/${deviceId}`).then(
      (res) => {
        $scope.devices = $scope.devices.filter(
          (device) => device.id !== deviceId
        );

        console.log("Device deleted successfully");
      },
      (err) => {
        console.error("Error deleting device:", err);

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

  $scope.fetchAssignedPhoneNumbersMap = () => {
    $http.get(`${API_BASE_URL}/devices/getAssignedPhoneNumbersMap`).then(
      (res) => {
        $scope.assignedPhoneNumbersMap = res.data;
        console.log($scope.assignedPhoneNumbersMap);
      },
      (err) => {
        console.error("Error fetching assigned phone numbers map:", err);
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

  $scope.fetchAssignedPhoneNumbersMap();
}
