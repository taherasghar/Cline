export default function registerController(
  $scope,
  $http,
  $location,
  API_BASE_URL,
  snackbarService
) {
  $scope.credentials = {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  };

  $scope.errorMessage = "";

  $scope.register = function () {
    $http
      .post(`${API_BASE_URL}/auth/register`, $scope.credentials)
      .then(function (response) {
        if (response.data) {
          snackbarService.showNotification(
            `Your account has been created, Welcome ${$scope.credentials.firstName}!`,
            "bg-success"
          );
          $location.path("/login");

          $scope.errorMessage = "";
        } else {
          $scope.errorMessage = "Registration failed. Please try again.";
        }
      })
      .catch(function (error) {
        if (error.data && error.data.message) {
          $scope.errorMessage = error.data.message;
        } else {
          $scope.errorMessage =
            "An error occurred during the registration process.";
        }
      });
  };
}
