export default function authService($window, $location) {
  
  return {
    isAuthenticated: function () {
      if (localStorage.getItem("token")) {
        return true;
      } else {
        return false;
      }
    },
    user: function () {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        try {
          const decoded = jwt_decode(token);
          return decoded;
        } catch (error) {
          console.log(error);
          return null;
        }
      }
    },
    logout: function () {
      localStorage.removeItem("token");
      $location.path("/login");
    },
  };
}

authService.$inject = ["$window", "$location"];
