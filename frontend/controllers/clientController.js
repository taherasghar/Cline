export default function clientController(
  $scope,
  $http,
  $interval,
  API_BASE_URL,
  snackbarService
) {
  // Fetch all clients
  $scope.isLoading = true;
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
        delay(100).then(() => {
          $scope.isLoading = false;
          $scope.$apply(); 
        });
      },
      (err) => {
        console.error("Error fetching clients:", err);
      }
    );
  };

  // Initialize new client object
  $scope.newClient = {
    name: "",
    type: "",
    birthDate: null,
  };

  // Handle adding a new client
  $scope.handleAddNewClient = () => {
    // Ensure birthDate is formatted as yyyy-mm-dd before sending to backend
    if ($scope.newClient.birthDate instanceof Date) {
      // Adjust birth date by adding one day
      const adjustedBirthDate = new Date(
        $scope.newClient.birthDate.getTime() + 24 * 60 * 60 * 1000
      );
      $scope.newClient.birthDate = adjustedBirthDate
        .toISOString()
        .split("T")[0];
    }

    $http.post(`${API_BASE_URL}/clients/add`, $scope.newClient).then(
      (res) => {
        // Handle success response
        console.log("Client added successfully:", res.data);
        snackbarService.showNotification(
          `${res.data.name} was added successfully.`,
          "bg-success"
        );
        $scope.errorMessage = "";
        // Optionally reset the form or close modal after successful addition
        $scope.newClient = {
          name: "",
          type: "1", // Reset to Individual
          birthDate: null,
        };
        $scope.errorMessage = "";

        // Refresh client list
        $scope.fetchAllClients();
        // Close modal if needed
        const addModalElement = document.getElementById("addModal");
        const addModal = bootstrap.Modal.getInstance(addModalElement);
        addModal.hide();
      },
      (err) => {
        // Handle error response
        if (err?.data?.message) {
          $scope.errorMessage = err.data.message;
        }

        console.error("Error adding client:", err);
      }
    );
  };

  // Handle editing a client
  $scope.handleEditClient = (client) => {
    $scope.errorMessage = "";
    $scope.selectedClientToEdit = angular.copy(client);
    if ($scope.selectedClientToEdit.birthDate) {
      $scope.selectedClientToEdit.birthDate = new Date(
        $scope.selectedClientToEdit.birthDate
      );
    }
  };

  // Save changes to an edited client
  $scope.saveChanges = () => {
    const clientToSave = angular.copy($scope.selectedClientToEdit);

    if (clientToSave.birthDate instanceof Date) {
      // Adjust birth date by adding one day
      const adjustedBirthDate = new Date(
        clientToSave.birthDate.getTime() + 24 * 60 * 60 * 1000
      );
      clientToSave.birthDate = adjustedBirthDate.toISOString().split("T")[0];
    }

    $http
      .put(`${API_BASE_URL}/clients/update/${clientToSave.id}`, clientToSave)
      .then(
        (res) => {
          const index = $scope.clients.findIndex((c) => c.id === res.data.id);
          if (index !== -1) {
            $scope.clients[index] = res.data;
          }
          $scope.errorMessage = "";

          const editModalElement = document.getElementById("editModal");
          const editModal = bootstrap.Modal.getInstance(editModalElement);
          editModal.hide();
          const updatedUser = res.data;
          snackbarService.showNotification(
            `${updatedUser.name}'s details were updated successfully.`,
            "bg-warning"
          );
        },
        (err) => {
          console.error("Error updating client:", err);
          if (err?.data?.message) {
            $scope.errorMessage = err.data.message;
          }
        }
      );
  };

  $scope.fetchPhoneNumbersToBeReserved = () => {
    $http.get(`${API_BASE_URL}/phoneNumbers/getAll`).then(
      (res) => {
        $scope.phoneNumbers = res.data.filter((pn) => pn.isReserved !== true);
      },
      (err) => {
        console.error("Error fetching phone numbers:", err);
      }
    );
  };

  // Update current time function
  $scope.updateCurrentTime = function () {
    $scope.currentTime = new Date().toLocaleString();
  };

  // Interval to update current time
  $interval($scope.updateCurrentTime, 1000);
  $scope.updateCurrentTime();

  // Handle reserving phone number for a client
  $scope.handleReservePhoneNumber = (client) => {
    $scope.selectedClientForReservation = client;
  };

  // Initialize selected client for reservation
  $scope.selectedClientForReservation = null;

  $scope.handleReservePhoneNumber = (client) => {
    $scope.selectedClientForReservation = client;
  };

  // Initialize selected client for reservation
  $scope.selectedClientForReservation = null;

  $scope.reservePhoneNumber = (client, phoneNumber) => {
    const reservation = {
      ClientId: client.id,
      PhoneNumberId: phoneNumber,
      EED: null,
    };

    console.log("Reservation Payload:", reservation);

    $http
      .post(`${API_BASE_URL}/phoneNumbersReservations/reserve`, reservation)
      .then(
        (res) => {
          const reservationModalElement =
            document.getElementById("reservationModal");
          const reservationModalModal = bootstrap.Modal.getInstance(
            reservationModalElement
          );
          reservationModalModal.hide();
          $scope.fetchAllClients();
          $scope.fetchPhoneNumbersToBeReserved();
          console.log("Phone number reserved successfully:", res.data);
          snackbarService.showNotification(
            `Phone number reserved successfully.`,
            "bg-success"
          );
        },
        (err) => {
          console.error("Error reserving phone number:", err);
        }
      );
  };

  // Fetch reserved phone numbers for a client
  $scope.fetchReservedPhoneNumbers = (clientId) => {
    $http
      .get(`${API_BASE_URL}/phoneNumbersReservations/getReservedPhoneNumbers`, {
        params: { clientId },
      })
      .then(
        (res) => {
          $scope.reservedPhoneNumbers = res.data;
          console.log(res.data);
        },
        (err) => {
          console.error("Error fetching reserved phone numbers:", err);
        }
      );
  };

  // Handle unreserving phone number for a client
  $scope.handleUnReservePhoneNumber = (clientId) => {
    $scope.clientIdToUnReserve = clientId;
    $scope.fetchReservedPhoneNumbers(clientId);
    const unreserveModalElement = document.getElementById("unreserveModal");
    const unreserveModal = bootstrap.Modal.getInstance(unreserveModalElement);
    unreserveModal.show();
  };

  $scope.confirmUnReserve = () => {
    const clientId = $scope.clientIdToUnReserve;
    const phoneNumberId = $scope.selectedPhoneNumberId;

    console.log({
      clientId,
      phoneNumberId,
    });
    $http
      .put(`${API_BASE_URL}/phoneNumbersReservations/unReserve`, {
        clientId,
        phoneNumberId,
      })
      .then(
        (res) => {
          console.log("Phone number unreserved successfully:", res.data);
          snackbarService.showNotification(
            `Phone number unreserved successfully.`,
            "bg-warning"
          );
          const unreserveModalElement =
            document.getElementById("unreserveModal");
          const unreserveModal = bootstrap.Modal.getInstance(
            unreserveModalElement
          );
          unreserveModal.hide();
          $scope.fetchAllClients();
          $scope.fetchPhoneNumbersToBeReserved();
        },
        (err) => {
          console.error("Error unreserving phone number:", err);
        }
      );
  };

  // Handle search results
  $scope.handleSearchResults = () => {
    const searchText = $scope?.searchInput?.toLowerCase()?.toString() || "";
    $http
      .get(
        `${API_BASE_URL}/clients/getFilteredClients/?searchfilter=${searchText}`
      )
      .then(
        (res) => {
          $scope.filteredClients = res.data;
        },
        (err) => {
          console.error("Error filtering clients:", err);
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
}
