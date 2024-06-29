export default function phoneNumbersController(
  $scope,
  $http,
  API_BASE_URL,
  snackbarService
) {
  $scope.fetchAllPhoneNumbers = () => {
    $http.get(`${API_BASE_URL}/phoneNumbers/getAll`).then(
      (res) => {
        console.log(res.data);
        $scope.phoneNumbers = res.data;
        // Initialize filteredPhoneNumbers to show all phone numbers initially
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
        // Handle errors
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

  $scope.getDeviceName = function (deviceId) {
    const device =
      $scope?.devices?.length &&
      $scope.devices.find((device) => device.id === deviceId);
    return device ? device.name : "Unknown Device";
  };

  $scope.handleAddNewPhoneNumber = () => {
    console.log($scope.newPhoneNumber);
    $http.post(`${API_BASE_URL}/phoneNumbers/add`, $scope.newPhoneNumber).then(
      (res) => {
        // Handle success, e.g., refresh phone number list
        $scope.fetchAllPhoneNumbers();
        // Reset form
        console.log(res.data);
        $scope.errorMessage = "";
        snackbarService.showNotification(
          `New Phone Number was added successfully.`,
          "bg-success"
        );
        $scope.newPhoneNumber = {};
        const addModalElement = document.getElementById("addModal");
        const addModal = bootstrap.Modal.getInstance(addModalElement);
        addModal.hide();
      },
      (err) => {
        if (err?.data?.message) {
          $scope.errorMessage = err.data.message;
        }
        console.error("Error adding new phone number:", err);
        // Handle specific error cases if needed
      }
    );
  };

  // Handle search results
  $scope.handleSearchResults = () => {
    const searchText = $scope?.searchInput?.toLowerCase()?.toString() || "";
    $http
      .get(
        `${API_BASE_URL}/phoneNumbers/getFilteredPhoneNumbers/?searchfilter=${searchText}`
      )
      .then(
        (res) => {
          $scope.filteredPhoneNumbers = res.data;
        },
        (err) => {
          console.error("Error filtering phoneNumbers:", err);
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

  // Handle enter key press for search
  $scope.handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      $scope.handleSearchResults();
    }
  };

  // Function to open edit modal and initialize editedPhoneNumber
  $scope.handleEditPhoneNumber = (phoneNumber) => {
    $scope.selectedPhoneNumberToEdit = angular.copy(phoneNumber);
    $scope.errorMessage = "";
  };

  // Save changes to an edited client
  $scope.saveChanges = () => {
    const phoneNumberToSave = angular.copy($scope.selectedPhoneNumberToEdit);

    $http
      .put(
        `${API_BASE_URL}/phoneNumbers/update/${phoneNumberToSave.id}`,
        phoneNumberToSave
      )
      .then(
        (res) => {
          console.log(res.data);
          $scope.errorMessage = "";
          snackbarService.showNotification(
            `"${res.data.number}" was updated successfully.`,
            "bg-warning"
          );
          const index = $scope.phoneNumbers.findIndex(
            (c) => c.id === res.data.id
          );
          if (index !== -1) {
            $scope.filteredPhoneNumbers[index] = res.data;
            $scope.phoneNumbers[index] = res.data;
          }
          const editModalElement = document.getElementById("editModal");
          const editModal = bootstrap.Modal.getInstance(editModalElement);
          editModal.hide();
          console.log("Phone Number updated successfully:", res.data);
        },
        (err) => {
          if (err?.data?.message) {
            $scope.errorMessage = err.data.message;
          }
          console.error("Error updating phone number:", err);
        }
      );
  };
  // Initial fetch of phone numbers and devices
  $scope.fetchAllPhoneNumbers();
  $scope.fetchAllDevices();
}
