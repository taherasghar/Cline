import devicesController from "./controllers/devicesController.js";
import clientController from "./controllers/clientController.js";
import phoneNumbersController from "./controllers/phoneNumberController.js";
import phoneNumberReservationsController from "./controllers/phoneNumberReservationsController.js";
import navController from "./controllers/navController.js";
import PageHeaderDirective from "./directives/pageHeaderDirective.js";
import ClientTypeSelectorDirective from "./directives/clientTypeSelectorDirective.js";
import DeviceSelectorDirective from "./directives/deviceSelectorDirective.js";
import reportsController from "./controllers/reportsController.js";
import FooterDirective from "./directives/footerDirective.js";
import loginController from "./controllers/loginController.js";
import authService from "./services/authService.js";
import NavBarDirective from "./directives/navbarDirective.js";
import registerController from "./controllers/registerController.js";
import SnackbarDirective from "./directives/snackbarDirective.js";
import homeController from "./controllers/homeController.js";

var app = angular
  .module("myApp", ["ngRoute"])
  .constant("API_BASE_URL", "https://localhost:44366/api")
  .factory("authService", authService);

// Controllers
app.controller("HomeController", homeController);
app.controller("NavController", navController);
app.controller("DevicesController", devicesController);
app.controller("ClientController", clientController);
app.controller("PhoneNumbersController", phoneNumbersController);
app.controller(
  "PhoneNumberReservationsController",
  phoneNumberReservationsController
);
app.controller("ReportsController", reportsController);
app.controller("LoginController", loginController);
app.controller("RegisterController", registerController);


// Directives
app.directive("pageHeader", PageHeaderDirective);
app.directive("navBar", NavBarDirective);
app.directive("clientTypeSelector", ClientTypeSelectorDirective);
app.directive("deviceSelector", DeviceSelectorDirective);
app.directive("footerDirective", FooterDirective);
app
  .directive("snackbar", SnackbarDirective)
  .factory("snackbarService", function ($rootScope) {
    return {
      showNotification: function (message, customClass) {
        $rootScope.$broadcast("showNotification", {
          message: message,
          customClass: customClass,
        });
      },
    };
  });

// Routing
app.config(function ($routeProvider) {
  $routeProvider
    .when("/login", {
      templateUrl: "views/login/login.html",
      controller: "LoginController",
    })
    .when("/register", {
      templateUrl: "views/register/register.html",
      controller: "RegisterController",
    })
    .when("/", {
      templateUrl: "views/home/home.html",
      controller:"HomeController"
    })
    .when("/devices", {
      templateUrl: "views/devices/devices.html",
      controller: "DevicesController",
    })
    .when("/clients", {
      templateUrl: "views/clients/clients.html",
      controller: "ClientController",
    })
    .when("/phone-numbers", {
      templateUrl: "views/phoneNumbers/phoneNumbers.html",
      controller: "PhoneNumbersController",
    })
    .when("/reservations", {
      templateUrl: "views/phoneNumberReservations/phoneNumberReservations.html",
      controller: "PhoneNumberReservationsController",
    })
    .when("/reports/client-types-stats", {
      templateUrl: "views/clientTypesStats/clientTypesStats.html",
      controller: "ReportsController",
    })
    .when("/reports/device-stats", {
      templateUrl: "views/deviceStats/deviceStats.html",
      controller: "ReportsController",
    })
    .otherwise({
      template: "<h1>Not Found 404</h1>",
    });
});

app.run(function ($rootScope, $location, authService) {
  $rootScope.$on("$routeChangeStart", function (event, next) {
    if (
      next.$$route &&
      next.$$route.originalPath !== "/login" &&
      next.$$route.originalPath !== "/register" &&
      !authService.isAuthenticated()
    ) {
      $location.path("/login");
    }
    if (
      authService.isAuthenticated() &&
      (next.$$route.originalPath === "/login" ||
        next.$$route.originalPath === "/register")
    ) {
      $location.path("/");
    }
  });
});
