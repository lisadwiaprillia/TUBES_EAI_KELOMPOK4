DashboardHelper.preLoaderShow();
new Dashboard().getProject();

let postDataAdd = {
  name: null,
  budget: null,
  responsible_user: null,
  status: null,
};

let postDataEdit = {
  id: null,
  name: null,
  budget: null,
  responsible_user: null,
  status: null,
};

$(document).on("submit", "#addProjectForm", function (e) {
  e.preventDefault();
  let projectData = DashboardHelper.serializeObject($(this));
  postDataAdd = {
    name: projectData.project_name,
    budget: projectData.budget,
    responsible_user: projectData.user_responsible,
    status: projectData.status,
  };
  new Dashboard().addProject();
});

$(document).on("submit", "#updateProjectForm", function (e) {
  e.preventDefault();
  let projectData = DashboardHelper.serializeObject($(this));
  postDataEdit = {
    ...postDataEdit,
    name: projectData.project_name,
    budget: projectData.budget,
    responsible_user: projectData.user_responsible,
    status: projectData.status,
  };
  new Dashboard().updateProject();
});

function Dashboard() {
  this.getProject = () => {
    $("#showProject").html("");
    DashboardClient.get(DashboardClient.domainUrl() + "/v1/projects")
      .then((response) => {
        if (response.status === true) {
          let data = response.data;
          data.forEach((val) => {
            let status_value = val.status == 1 ? "Complete" : "Incomplete";
            let status_color = val.status == 1 ? "success" : "secondary";
            $("#showProject").append(`
                            <tr>
                                <td><h6 class="mb-0 text-sm">${val.id || "--"}</h6></td>
                                <td><h6 class="mb-0 text-sm">${val.name || "--"}</h6></td>
                                <td><p class="text-sm font-weight-bold mb-0">${
                                  val.budget || "--"
                                }</p></td>
                                <td><span class="text-xs font-weight-bold">${
                                  val.responsible_user || "--"
                                }</span></td>
                                <td><span class="badge badge-sm bg-gradient-${status_color}">${status_value}</span></td>
                                <td class="align-middle text-center"><span class="me-2 text-xs font-weight-bold">${
                                  val.created_at || "--"
                                }</span></td>
                                <td>
                                    <div data-toggle="modal" data-target="#editProject" style="display: inline">
                                        <a class="btn btn-link text-dark px-3 mb-0" href="javascript: editProject(${
                                          val.id
                                        });"><i class="fas fa-pencil-alt text-dark me-2" aria-hidden="true"></i></a>
                                    </div>
                                    <a class="btn btn-link text-danger text-gradient px-3 mb-0" href="javascript: deleteProject(${
                                      val.id
                                    });"><i class="far fa-trash-alt" aria-hidden="true"></i></a>
                                </td>
                            </tr>
                        `);
          });
        } else {
          $("#showProject").html(
            '<tr class="text-center"><td colspan="10" class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Data Not Found...</td></tr>'
          );
        }
        DashboardHelper.preLoaderHide();
      })
      .catch((error) => {
        $("#showProject").html(
          '<tr class="text-center"><td colspan="10" class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Data Not Found...</td></tr>'
        );
        if (error.status === 401) {
          DashboardHelper.unAuthorize();
        }
        DashboardHelper.preLoaderHide();
      });
  };

  this.addProject = () => {
    DashboardClient.post(DashboardClient.domainUrl() + "/v1/add/project", postDataAdd)
      .then((response) => {
        if (response.status === true) {
          showToast("info", response.message);
          closeModal("#close_1", "#addProjectForm");
          this.getProject();
        }
      })
      .catch((error) => {
        showToast("error", error.responseJSON.message);
      });
  };

  this.updateProject = () => {
    DashboardClient.put(DashboardClient.domainUrl() + "/v1/update/project", postDataEdit)
      .then((response) => {
        if (response.status === true) {
          showToast("info", response.message);
          closeModal("#close_2", "#updateProjectForm");
          this.getProject();
        }
      })
      .catch((error) => {
        showToast("error", error.responseJSON.message);
      });
  };

  this.deleteProject = (id) => {
    DashboardClient.delete(DashboardClient.domainUrl() + "/v1/delete/project/" + id)
      .then((response) => {
        if (response.status === true) {
          showToast("info", response.message);
          this.getProject();
        }
      })
      .catch((error) => {
        showToast("error", error.responseJSON.message);
      });
  };

  this.getProjectById = (id) => {
    DashboardClient.get(DashboardClient.domainUrl() + "/v1/get/project/" + id)
      .then((response) => {
        if (response.status === true) {
          let data = response.data;
          $("#edit_name").val(data.name);
          $("#edit_budget").val(data.budget);
          $("#edit_user_responsible").val(data.responsible_user);
          $("#edit_status").val(data.status);
        }
      })
      .catch((error) => {
        console.error(error.responseJSON);
      });
  };
}

function editProject(id) {
  postDataEdit.id = id;
  new Dashboard().getProjectById(id);
}

function deleteProject(id) {
  new Dashboard().deleteProject(id);
}

function showToast(type, message) {
  toastr[type](message, type, DashboardHelper.toastOption());
}

function closeModal(closeButtonId, formId) {
  $(closeButtonId).click();
  $(formId).trigger("reset");
}
