export default function homeController($scope, snackbarService) {
  if (localStorage.getItem("successLogin")) {
    snackbarService.showNotification(`Logged in successfully.`, "bg-success");
    localStorage.removeItem("successLogin");
  }
}
