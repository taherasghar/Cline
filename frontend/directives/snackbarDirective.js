export default function SnackbarDirective() {
  return {
    restrict: "E",
    template:
      '<div class="snackbar mx-4" ng-class="[snackbarClass, {show: isVisible}]">{{message}} <i class="bi bi-check2-circle mx-1"></i></div>',
    controller: function ($scope, $timeout, snackbarService) {
      $scope.isVisible = false;
      $scope.message = "";
      $scope.snackbarClass = "";

      $scope.$on("showNotification", function (event, data) {
        $scope.message = data.message;
        $scope.snackbarClass = data.customClass;
        $scope.isVisible = true;

        $timeout(function () {
          $scope.isVisible = false;
        }, 5000);
      });
    },
  };
}
