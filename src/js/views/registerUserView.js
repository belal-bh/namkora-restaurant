import { ADMIN, CUSTOMER, ANONYMOUS } from "../models/userTypes.js";
import View from "./View.js";
import * as bootstrap from "bootstrap";

class RegisterUserView extends View {
  _parentElement = document.querySelector(".registration");
  _message = "You have been successfully registered!";

  _modalElement = document.getElementById("registrationModalToggle");
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

  addHandlerRegisterUser(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      const newUserData = {
        username: data.username,
        rawPassword: data.rawPassword,
        userType: data.isAdmin === "on" ? ADMIN : CUSTOMER,
      };
      handler(newUserData);
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
      <div class="mb-3">
        <label for="registration--username" class="form-label"
          >Username</label
        >
        <input
          type="text"
          class="form-control"
          id="registration--username"
          aria-describedby="registration--usernameHelp"
          required
          name="username"
        />
        <div
          id="registration--usernameHelp"
          class="form-text"
        >
          Choose an uniqe username.
        </div>
      </div>
      <div class="mb-3">
        <label
          for="registration--rawPassword"
          class="form-label"
          >Password</label
        >
        <input
          type="password"
          class="form-control"
          id="registration--rawPassword"
          required
          name="rawPassword"
        />
      </div>
      <div class="mb-3 form-check">
        <input
          type="checkbox"
          class="form-check-input"
          id="registration--isAdmin"
          name="isAdmin"
        />
        <label
          class="form-check-label"
          for="registration--isAdmin"
          >Request for
          <span class="text-cct-russet">ADMIN</span>
          Account.</label
        >
      </div>
      <button type="submit" class="btn btn-cct-russet">
        Register
      </button>
    `;

    return markup;
  }
}

export default new RegisterUserView();
