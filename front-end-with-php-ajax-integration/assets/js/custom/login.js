DashboardHelper.authAlive();

$(document).ready(function () {
  $(document).on("submit", "#login", function (e) {
    e.preventDefault();
    let loginData = DashboardHelper.serializeObject($(this));
    let postData = {
      email: loginData.email,
      password: loginData.password,
    };

    DashboardClient.post(DashboardClient.domainUrl() + "/v1/login", postData)
      .then((response) => {
        if (response.status === true) {
          DashboardHelper.setAccessToken(response.token);
          toastr.info(response.message, "info", DashboardHelper.toastOption());
          window.location.href = "user/index.php";
        } else {
          toastr.error(
            "Login failed. Please check your credentials.",
            "error",
            DashboardHelper.toastOption()
          );
        }
      })
      .catch((error) => {
        toastr.error(
          "An error occurred while processing your request. Please try again later.",
          "error",
          DashboardHelper.toastOption()
        );
      });
  });
});
