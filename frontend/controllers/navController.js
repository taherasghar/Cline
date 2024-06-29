export default function navController(
  $scope,
  $location,
  authService,
  snackbarService
) {
  $scope.isActive = function (route) {
    return route === $location.path();
  };
  $scope.isAuthenticated = authService.isAuthenticated();
  $scope.user = authService.user();
  // for phone item
  $scope.dropdownOpen = false;

  $scope.toggleDropdown = function () {
    $scope.dropdownOpen = false;
  };
  // for reports item
  $scope.dropdownOpenReport = false;

  $scope.toggleDropdownReport = function () {
    $scope.dropdownOpenReport = false;
  };

  $scope.logout = function () {
    authService.logout();
    localStorage.setItem("successLogout", "yes");
  };
}
