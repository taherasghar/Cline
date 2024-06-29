export default function loginController(
  $scope,
  $http,
  $location,
  API_BASE_URL,
  snackbarService
) {

  if (localStorage.getItem("successLogout")) {
    snackbarService.showNotification(`Logged out successfully.`, "bg-danger");
    localStorage.removeItem("successLogout");
  }

  $scope.credentials = {
    username: "",
    password: "",
  };

  $scope.errorMessage = "";
  $scope.login = function () {
    $http
      .post(`${API_BASE_URL}/auth/login`, $scope.credentials)
      .then(function (response) {
        if (response.data && response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("successLogin", "yes");
          $location.path("/");
          $scope.errorMessage = "";
        } else {
          $scope.errorMessage = "Invalid login credentials";
        }
      })
      .catch(function (error) {
        if (error.data && error.data.message) {
          $scope.errorMessage = error.data.message;
        } else {
          $scope.errorMessage = "An error occurred during the login process.";
        }
      });
  };
}
