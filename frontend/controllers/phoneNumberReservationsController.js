export default function phoneNumberReservationsController(
  $scope,
  $http,
  API_BASE_URL
) {
  $scope.reservations = [];

  // Function to format the date
  const formatDate = (dateString) => {
    if (!dateString) return "";

    // Split the date and time parts
    const [datePart, timePart] = dateString.split("T");

    // Remove milliseconds from the time part
    const formattedTime = timePart.split(".")[0];

    // Combine date part and formatted time with ' at '
    return `${datePart} at ${formattedTime}`;
  };

  $scope.fetchAllPhoneNumbers = () => {
    $http.get(`${API_BASE_URL}/phoneNumbers/getAll`).then(
      (res) => {
        $scope.phoneNumbers = res.data;
      },
      (err) => {
        console.error("Error fetching clients:", err);

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

  $scope.fetchAllReservedPhoneNumbers = () => {
    $http.get(`${API_BASE_URL}/phoneNumbersReservations/getAll`).then(
      (res) => {
        $scope.reservations = res.data.map((reservation) => {
          reservation.bed = formatDate(reservation.bed);
          if (reservation.eed) {
            reservation.eed = formatDate(reservation.eed);
          }
          return reservation;
        });

        // Extract unique phone numbers
        const phoneNumbers = $scope.reservations.map((r) => r.phoneNumber);
        $scope.uniquePhoneNumbers = [...new Set(phoneNumbers)];

        const clients = $scope.reservations.map((r) => r.clientName);
        $scope.uniqueClientNames = [...new Set(clients)];
      },
      (err) => {
        console.error("Error fetching reserved phone numbers:", err);
      }
    );
  };

  $scope.openDeleteModal = function (reservation) {
    $scope.selectedReservation = angular.copy(reservation); // Ensure a deep copy to prevent changes to original object
    var confirmDeleteModal = new bootstrap.Modal(
      document.getElementById("confirmDeleteModal")
    );
    confirmDeleteModal.show();
  };

  // Confirm delete
  $scope.confirmDelete = function () {
    if ($scope.selectedReservation && !$scope.selectedReservation.eed) {
      alert("Cannot delete an active reservation.");
      return;
    }

    $http
      .delete(
        `${API_BASE_URL}/phoneNumbersReservations/delete/${$scope.selectedReservation.id}`
      )
      .then(
        function (res) {
          // Remove the deleted reservation from the list
          $scope.reservations = $scope.reservations.filter(
            (r) => r.Id !== $scope.selectedReservation.Id
          );
          $scope.selectedReservation = null;
          console.log("Reservation deleted successfully:", res.data);
          $scope.fetchAllReservedPhoneNumbers();
        },
        function (err) {
          console.error("Error deleting reservation:", err);
        }
      );
  };
}
