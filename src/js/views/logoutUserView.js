import View from "./View.js";
import * as bootstrap from "bootstrap";

class LogoutUserView extends View {
  _parentElement = document.querySelector(".logout");
  _message = "Successfully logged out!";

  _modalElement = document.getElementById("logoutModalToggle");
  _formValidationContainerClassName = "validation-error-message";

  constructor() {
    super();
  }

  _getFormValidationContainer() {
    return this._parentElement.querySelector(
      `.${this._formValidationContainerClassName}`
    );
  }

  _getModalInstance(modalElement = this._modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement);
    return modal;
  }

  closeModal() {
    const modal = this._getModalInstance(this._modalElement);
    console.log(modal);
    modal.hide();
  }

  addHandlerLogoutUser(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler();
    });
  }

  renderValidationError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <p><span><i class="bi bi-exclamation-triangle me-2"></i></span>${message}</p>
      </div>
    `;
    const container = this._getFormValidationContainer();
    container.innerHTML = markup;
  }

  _generateMarkup() {
    const markup = `
      <div class="text-danger validation-error-message"></div>
      <p class="text-cct-russet">
        <i class="bi bi-exclamation-triangle me-2"></i> Are
        you sure to logout!
      </p>
      <button type="submit" class="btn btn-cct-russet">
        Logout
      </button>
    `;
    return markup;
  }
}

export default new LogoutUserView();
